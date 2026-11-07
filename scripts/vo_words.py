"""Voice a step-style short and time its speech-bubble captions word by word.

Reads src/<project>/script.json (beats -> chunks of {cap, say, pose}),
speaks each beat's `say` text with Microsoft's Hindi neural voice (edge-tts,
needs speech.platform.bing.com) and writes

  public/<project>/vo/<beat id>.mp3   one clip per beat, sentence pauses cut
                                      to GAP seconds
  src/<project>/timing.json           per beat: clip length and, per chunk,
                                      start/end plus every spoken word's
                                      start/end (seconds from the clip start)

The composition shows each chunk's caption while it is spoken and moves the
presenter's mouth on the word timings.

Usage: python3 scripts/vo_words.py <project> [voice] [rate]
  e.g.  python3 scripts/vo_words.py aasmaan
  defaults: hi-IN-MadhurNeural  +18%
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
GAP = 0.12  # seconds of silence kept between sentences
LEAD = 0.05  # seconds kept before a sentence's first word
TAIL = 0.12  # seconds kept after a sentence's last word
BREATH = 0.35  # seconds after a beat's clip before the next beat


def norm(s: str) -> str:
    return "".join(ch for ch in s.lower() if ch.isalnum() or "ऀ" <= ch <= "ॿ")


async def speak(text: str, voice: str, rate: str, raw: pathlib.Path) -> list[tuple[str, float, float]]:
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    com = edge_tts.Communicate(text, voice, rate=rate, proxy=proxy, boundary="WordBoundary")
    words: list[tuple[str, float, float]] = []
    with raw.open("wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "WordBoundary":
                s = ch["offset"] / 1e7
                words.append((ch["text"], s, s + ch["duration"] / 1e7))
    return words


async def beat_clip(beat: dict, voice: str, rate: str, out: pathlib.Path) -> dict:
    chunks = beat["chunks"]
    # every character of the beat's text, normalised, with the chunk it belongs to
    full, owner = "", []
    for i, c in enumerate(chunks):
        n = norm(c["say"])
        full += n
        owner += [i] * len(n)
    text = " ".join(c["say"] for c in chunks)
    sentences = [s for s in re.split(r"(?<=[।?!:])\s+", text.strip()) if s]

    parts, timed, offset = [], [], 0.0
    for k, sentence in enumerate(sentences):
        raw = out / f"{beat['id']}.{k}.raw.mp3"
        words = await speak(sentence, voice, rate, raw)
        if not words:
            raise SystemExit(f"no word timings for {sentence!r}")
        a = max(0.0, words[0][1] - LEAD)
        b = words[-1][2] + TAIL
        parts.append((raw, a, b))
        timed += [(w, offset + s - a, offset + e - a) for w, s, e in words]
        offset += (b - a) + GAP

    # cut each sentence to its words and join them with GAP of silence
    inputs = [x for raw, _, _ in parts for x in ("-i", str(raw))]
    filters = [
        f"[{i}:a]atrim=start={a:.3f}:end={b:.3f},asetpts=PTS-STARTPTS,apad=pad_dur={GAP}[p{i}]"
        for i, (_, a, b) in enumerate(parts)
    ]
    joined = "".join(f"[p{i}]" for i in range(len(parts)))
    subprocess.run(
        [
            "ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex",
            ";".join(filters) + f";{joined}concat=n={len(parts)}:v=0:a=1[o]",
            "-map", "[o]", "-ar", "44100", "-c:a", "libmp3lame", "-q:a", "2", str(out / f"{beat['id']}.mp3"),
        ],
        check=True,
    )
    for raw, _, _ in parts:
        raw.unlink()

    # assign each spoken word to the chunk whose text it came from
    per_chunk: list[list[tuple[float, float]]] = [[] for _ in chunks]
    cursor = 0
    for w, s, e in timed:
        n = norm(w)
        if not n:
            continue
        at = full.find(n, cursor)
        if at < 0:
            print(f"  ! could not place word {w!r} in {beat['id']}")
            continue
        per_chunk[owner[at]].append((round(s, 3), round(e, 3)))
        cursor = at + len(n)

    result = []
    prev_end = 0.0
    for i, ws in enumerate(per_chunk):
        if not ws:  # nothing matched: borrow the gap after the previous chunk
            ws = [(prev_end, prev_end + 0.3)]
            print(f"  ! chunk {i} of {beat['id']} has no timed words")
        result.append({"start": ws[0][0], "end": ws[-1][1], "words": [list(x) for x in ws]})
        prev_end = ws[-1][1]
    return {"seconds": round(offset - GAP + BREATH, 2), "chunks": result}


async def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    project = sys.argv[1]
    voice = sys.argv[2] if len(sys.argv) > 2 else "hi-IN-MadhurNeural"
    rate = sys.argv[3] if len(sys.argv) > 3 else "+18%"
    src = ROOT / "src" / project
    out = ROOT / "public" / project / "vo"
    out.mkdir(parents=True, exist_ok=True)
    script = json.loads((src / "script.json").read_text())
    timing = {}
    for beat in script["beats"]:
        timing[beat["id"]] = await beat_clip(beat, voice, rate, out)
        print(f"{beat['id']:8s} {timing[beat['id']]['seconds']:6.2f} s")
    total = sum(t["seconds"] for t in timing.values())
    (src / "timing.json").write_text(json.dumps(timing, ensure_ascii=False, indent=1) + "\n")
    print(f"total {total:.1f} s; wrote {(src / 'timing.json').relative_to(ROOT)}")


if __name__ == "__main__":
    asyncio.run(main())
