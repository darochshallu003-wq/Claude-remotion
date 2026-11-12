"""Generate the story narration with edge-tts: one clip per scene, built from
per-voice segments, plus word timings for the read-along captions.

Usage: python3 tools/vo.py <out_dir> [lang]   (lang: en (default) or hi)
Writes <out_dir>/<scene>.mp3 and <out_dir>/words.json
({scene: [[word, seconds], ...], scene_dur: seconds}).
Segments are cached in <out_dir>/seg/ by a hash of voice + text.
"""

import asyncio
import hashlib
import json
import os
import ssl
import subprocess
import sys

import edge_tts
from edge_tts import communicate

sys.path.insert(0, os.path.dirname(__file__))
import importlib  # noqa: E402

LANG = sys.argv[2] if len(sys.argv) > 2 else "en"
_story = importlib.import_module("story" if LANG == "en" else "story_" + LANG)
STORY, VOICES = _story.STORY, _story.VOICES

# Trust the environment's CA bundle (edge-tts pins certifi by default).
_ca = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
if os.path.exists(_ca):
    communicate._SSL_CTX = ssl.create_default_context(cafile=_ca)

SR = 24000
GAP = 0.28  # silence between segments of one scene


def dur(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
        capture_output=True, text=True,
    ).stdout.strip()
    return float(out)


async def segment(seg_dir, key, text, proxy):
    voice, rate, pitch = VOICES[key]
    h = hashlib.sha1(f"{voice}|{rate}|{pitch}|{text}".encode()).hexdigest()[:16]
    wav = os.path.join(seg_dir, h + ".wav")
    meta = os.path.join(seg_dir, h + ".json")
    if os.path.exists(wav) and os.path.exists(meta):
        return wav, json.load(open(meta))
    mp3 = os.path.join(seg_dir, h + ".mp3")
    words = []
    for attempt in range(4):
        try:
            words = []
            with open(mp3, "wb") as f:
                async for chunk in edge_tts.Communicate(
                    text, voice, rate=rate, pitch=pitch, boundary="WordBoundary", proxy=proxy
                ).stream():
                    if chunk["type"] == "audio":
                        f.write(chunk["data"])
                    elif chunk["type"] == "WordBoundary":
                        words.append([chunk["text"], round(chunk["offset"] / 1e7, 3)])
            break
        except Exception as e:  # network hiccup: retry with backoff
            if attempt == 3:
                raise
            await asyncio.sleep(2 * (attempt + 1))
    # Trim leading/trailing silence so segments join tightly; keep word offsets aligned.
    lead = words[0][1] - 0.05 if words else 0.0
    lead = max(0.0, lead)
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-ss", f"{lead:.3f}", "-i", mp3,
         "-af", "areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.12,areverse",
         "-ar", str(SR), "-ac", "1", wav],
        check=True,
    )
    os.remove(mp3)
    words = [[w, round(t - lead, 3)] for w, t in words]
    json.dump(words, open(meta, "w"))
    return wav, words


async def main():
    out = sys.argv[1]
    seg_dir = os.path.join(out, "seg")
    os.makedirs(seg_dir, exist_ok=True)
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    timings = {}
    total = 0.0
    for scene in STORY:
        parts, words, t = [], [], 0.0
        for key, text in scene["vo"]:
            wav, w = await segment(seg_dir, key, text, proxy)
            words += [[x, round(t + o, 3)] for x, o in w]
            parts.append(wav)
            t += dur(wav) + GAP
        # Concatenate with gaps.
        listfile = os.path.join(seg_dir, "_list.txt")
        silence = os.path.join(seg_dir, "_gap.wav")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i",
                        f"anullsrc=r={SR}:cl=mono", "-t", str(GAP), silence], check=True)
        with open(listfile, "w") as f:
            for i, p in enumerate(parts):
                if i:
                    f.write(f"file '{os.path.abspath(silence)}'\n")
                f.write(f"file '{os.path.abspath(p)}'\n")
        path = os.path.join(out, scene["id"] + ".mp3")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", listfile,
                        "-c:a", "libmp3lame", "-b:a", "128k", path], check=True)
        d = dur(path)
        timings[scene["id"]] = words
        timings[scene["id"] + "_dur"] = round(d, 3)
        total += d
        print(f"{scene['id']:<12}{d:6.2f}s")
    json.dump(timings, open(os.path.join(out, "words.json"), "w"), indent=1)
    print(f"total speech {total:.1f}s")


if __name__ == "__main__":
    asyncio.run(main())
