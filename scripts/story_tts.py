"""Voice the bedtime story with Microsoft's Hindi neural voices.

Reads src/bedtime/story.json, voices every line with its character's voice
(edge-tts; needs speech.platform.bing.com), and writes one clip per beat to
public/bedtime/vo/<beat id>.mp3 with calm gaps between lines. It then writes
each line's start/end (seconds into the clip) and each beat's length back
into story.json, so the captions follow the voice.

Usage: python3 scripts/story_tts.py
"""

import asyncio
import json
import os
import pathlib
import subprocess

import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
STORY = ROOT / "src" / "bedtime" / "story.json"
OUT = ROOT / "public" / "bedtime" / "vo"

# who -> (voice, rate, pitch)
VOICES = {
    "n": ("hi-IN-SwaraNeural", "-14%", "-2Hz"),   # narrator: soft, slow
    "p": ("hi-IN-SwaraNeural", "-6%", "+38Hz"),   # Pari: a small girl
    "j": ("hi-IN-MadhurNeural", "+4%", "+30Hz"),  # Jugnu: bright and playful
    "c": ("hi-IN-MadhurNeural", "-18%", "-6Hz"),  # Chanda Mama: warm, unhurried
}
LEAD = 0.3   # silence before the first line
GAP = 0.55   # silence between lines
TAIL = 1.3   # silence after the last line, before the next scene
SR = 24000


def run(*args: str) -> None:
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def duration(path: pathlib.Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


async def main() -> None:
    story = json.loads(STORY.read_text())
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    OUT.mkdir(parents=True, exist_ok=True)
    total = 0.0
    for beat in story["beats"]:
        pieces: list[pathlib.Path] = []
        t = LEAD
        for k, line in enumerate(beat["lines"]):
            voice, rate, pitch = VOICES[line["who"]]
            raw = OUT / f"{beat['id']}.{k}.raw.mp3"
            wav = OUT / f"{beat['id']}.{k}.wav"
            await edge_tts.Communicate(line["text"], voice, rate=rate, pitch=pitch, proxy=proxy).save(str(raw))
            # trim silence at both ends; shorten long inner pauses to 0.35 s
            run(
                "-i", str(raw), "-af",
                "silenceremove=start_periods=1:start_threshold=-45dB,"
                "areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                "silenceremove=stop_periods=-1:stop_threshold=-45dB:stop_duration=0.35:stop_silence=0.35",
                "-ar", str(SR), "-ac", "1", str(wav),
            )
            raw.unlink()
            d = duration(wav)
            line["start"] = round(t, 2)
            line["end"] = round(t + d, 2)
            t += d + GAP
            pieces.append(wav)
        t = t - GAP + TAIL
        # lead silence + line, gap, line, ... (tail silence comes from the scene length)
        inputs: list[str] = ["-f", "lavfi", "-t", str(LEAD), "-i", f"anullsrc=r={SR}:cl=mono"]
        chain = "[0:a]"
        n = 1
        for k, wav in enumerate(pieces):
            if k > 0:
                inputs += ["-f", "lavfi", "-t", str(GAP), "-i", f"anullsrc=r={SR}:cl=mono"]
                chain += f"[{n}:a]"
                n += 1
            inputs += ["-i", str(wav)]
            chain += f"[{n}:a]"
            n += 1
        run(*inputs, "-filter_complex", f"{chain}concat=n={n}:v=0:a=1", "-c:a", "libmp3lame", "-q:a", "2",
            str(OUT / f"{beat['id']}.mp3"))
        for wav in pieces:
            wav.unlink()
        beat["seconds"] = round(t, 2)
        total += t
        print(f"{beat['id']:8s} {t:6.2f} s  ({len(pieces)} lines)")
    STORY.write_text(json.dumps(story, ensure_ascii=False, indent=2) + "\n")
    print(f"story total {total:.1f} s; updated {STORY.relative_to(ROOT)}")


if __name__ == "__main__":
    asyncio.run(main())
