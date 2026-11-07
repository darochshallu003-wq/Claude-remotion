"""Voiceover + caption timings for the pressure-cooker reel.

Reads each scene's `vo` from src/cooker/script.ts, speaks it with edge-tts
(one teacher voice) and writes:
  public/cooker/vo/<scene id>.mp3
  src/cooker/words.json   per-scene word timings for the karaoke captions
and sets each scene's `seconds` in script.ts to the clip length plus a breath.
Words wrapped in *stars* are flagged as highlights; the stars are not spoken.

Usage: python3 scripts/cooker_tts.py [voice] [rate]
  defaults: hi-IN-SwaraNeural  +12%
"""

import asyncio
import json
import os
import pathlib
import re
import subprocess
import sys

import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "src" / "cooker" / "script.ts"
OUT = ROOT / "public" / "cooker" / "vo"
WORDS = ROOT / "src" / "cooker" / "words.json"
BREATH = 0.45
KEEP = 0.18  # silence kept on each side of a cut sentence pause
PUNCT = "…।?!,.\"'*"


def norm(s: str) -> str:
    return s.strip(PUNCT).lower()


def duration(path: pathlib.Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


async def speak(text: str, voice: str, rate: str, path: pathlib.Path):
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    com = edge_tts.Communicate(text, voice, rate=rate, proxy=proxy, boundary="WordBoundary")
    events = []
    with open(path, "wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                s = ch["offset"] / 1e7
                events.append((ch["text"], s, s + ch["duration"] / 1e7))
    return events


def tighten(clip: pathlib.Path, words: list[dict]) -> None:
    """Cut long sentence pauses down to 2*KEEP and the tail to KEEP+0.1,
    shifting the word timings to match."""
    keep, t = [], 0.0
    for a, b in zip(words, words[1:]):
        if b["s"] - a["e"] > 2 * KEEP + 0.05:
            keep.append((t, a["e"] + KEEP))
            t = b["s"] - KEEP
    keep.append((t, words[-1]["e"] + KEEP + 0.1))
    shift, starts = [], []
    acc = 0.0
    for s0, e0 in keep:
        starts.append((s0, e0, acc - s0))
        acc += e0 - s0
    for w in words:
        for s0, e0, d in starts:
            if s0 - 0.01 <= w["s"] <= e0:
                w["s"], w["e"] = round(w["s"] + d, 3), round(min(w["e"], e0) + d, 3)
                break
    parts = "".join(f"[0:a]atrim={s0:.3f}:{e0:.3f},asetpts=PTS-STARTPTS[p{i}];" for i, (s0, e0) in enumerate(keep))
    joined = "".join(f"[p{i}]" for i in range(len(keep)))
    tmp = clip.with_suffix(".raw.mp3")
    clip.rename(tmp)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-filter_complex",
                    f"{parts}{joined}concat=n={len(keep)}:v=0:a=1", "-c:a", "libmp3lame", "-q:a", "2", str(clip)],
                   check=True)
    tmp.unlink()


def align(tokens: list[str], events, scene: str):
    """Give every display token a start/end from the spoken word events."""
    out, j = [], 0
    for tok in tokens:
        key = norm(tok)
        hit = None
        for k in range(j, min(j + 4, len(events))):
            if norm(events[k][0]) == key:
                hit = k
                break
        if hit is None:
            # fall back to the next event in order
            hit = min(j, len(events) - 1)
            print(f"  [{scene}] no exact match for {tok!r}, using {events[hit][0]!r}")
        out.append({"t": tok.replace("*", ""), "s": round(events[hit][1], 3),
                    "e": round(events[hit][2], 3), "hi": "*" in tok})
        j = hit + 1
    return out


async def main() -> None:
    voice = sys.argv[1] if len(sys.argv) > 1 else "hi-IN-SwaraNeural"
    rate = sys.argv[2] if len(sys.argv) > 2 else "+12%"
    text = SCRIPT.read_text()
    scenes = re.findall(r'id: "([a-z]+)",.*?vo: "(.*?)",\n', text, re.S)
    OUT.mkdir(parents=True, exist_ok=True)
    data = {}
    for sid, vo in scenes:
        clip = OUT / f"{sid}.mp3"
        events = await speak(vo.replace("*", ""), voice, rate, clip)
        words = align(vo.split(), events, sid)
        tighten(clip, words)
        dur = duration(clip)
        data[sid] = {"duration": round(dur, 3), "words": words}
        secs = round(dur + BREATH, 2)
        text = re.sub(rf'(id: "{sid}",\n\s*seconds: )[\d.]+', rf"\g<1>{secs}", text)
        print(f"{sid}: {dur:.2f}s, {len(events)} words")
    SCRIPT.write_text(text)
    WORDS.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n")
    print("total", round(sum(d["duration"] + BREATH for d in data.values()), 1), "s")


if __name__ == "__main__":
    asyncio.run(main())
