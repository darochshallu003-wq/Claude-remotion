"""Generate an explainer's voiceover with Microsoft's Hindi neural voice.

Reads each scene's `vo` line from src/<project>/script.ts and writes
public/<project>/vo/<scene id>.mp3 using edge-tts (needs the host
speech.platform.bing.com to be reachable). Technical terms in SAY get a
phonetic spelling in the spoken text only, so the voice says them clearly.
The voice's 1-1.5 s sentence pauses are cut to 0.15 s. Questions are asked by
a second voice (QUESTION_VOICE) and answered by the narrator.

Usage: python3 scripts/vo_tts.py <project> [voice] [rate]
  e.g.  python3 scripts/vo_tts.py haldi
  defaults: hi-IN-MadhurNeural  +22%
Then run scripts/vo_timing.py <project> to fit the scenes to the clips.
"""

import asyncio
import os
import pathlib
import re
import subprocess
import sys

import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Questions are asked by a second voice, so they sound like someone asking.
QUESTION_VOICE = "hi-IN-SwaraNeural"
QUESTION_RATE = "+12%"

SAY = {
    # onion
    "syn-propanethial-S-oxide": "सिन-प्रोपेन-थायल-एस-ऑक्साइड",
    "Ig Nobel": "इग नोबेल",
    "Self-defence.": "सेल्फ़-डिफ़ेंस।",
    # haldi
    "piperine": "पाइपरीन",
    "curcumin": "कर्क्यूमिन",
    "turmeric latte": "टर्मरिक लाटे",
    "cafés": "कैफ़े",
    # tamra
    "oligodynamic": "ऑलिगो-डायनैमिक",
    "E. coli": "ई-कोलाई",
    "EPA": "ई-पी-ए",
    "WHO": "डब्ल्यू-एच-ओ",
    "RO.": "आर-ओ।",
    "DNA": "डी-एन-ए",
    # mitti
    "Streptomyces": "स्ट्रेप्टो-माइसीज़",
    "geosmin": "जियो-स्मिन",
    "petrichor": "पेट्रिकोर",
    "Petra": "पेट्रा",
    "ichor": "आइकोर",
    "springtails": "स्प्रिंगटेल्स",
    "MIT": "एम-आई-टी",
}


async def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    project = sys.argv[1]
    voice = sys.argv[2] if len(sys.argv) > 2 else "hi-IN-MadhurNeural"
    rate = sys.argv[3] if len(sys.argv) > 3 else "+22%"
    script = ROOT / "src" / project / "script.ts"
    out = ROOT / "public" / project / "vo"
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    lines = re.findall(r'id: "([a-z]+)",.*?vo: "(.*?)",\n', script.read_text(), re.S)
    out.mkdir(parents=True, exist_ok=True)
    for scene_id, vo in lines:
        spoken = vo
        for k, v in SAY.items():
            spoken = re.sub(re.escape(k), v, spoken, flags=re.I)
        # Split into sentences. Questions (ending in "?") are asked by a
        # second voice, like a curious viewer, and the narrator answers;
        # the closing call-to-action scene keeps its question with the
        # narrator, since there the narrator is asking the audience.
        parts: list[tuple[str, str]] = []
        for sentence in re.split(r"(?<=[।?!])\s+", spoken.strip()):
            asker = sentence.endswith("?") and scene_id != "cta"
            who = "q" if asker else "n"
            if parts and parts[-1][0] == who == "n":
                parts[-1] = ("n", parts[-1][1] + " " + sentence)
            else:
                parts.append((who, sentence))
        raws = []
        for k, (who, text) in enumerate(parts):
            raw = out / f"{scene_id}.{k}.raw.mp3"
            v, r = (QUESTION_VOICE, QUESTION_RATE) if who == "q" else (voice, rate)
            await edge_tts.Communicate(text, v, rate=r, proxy=proxy).save(str(raw))
            raws.append(raw)
        # join the parts, then cut any pause longer than 0.15 s down to
        # 0.15 s and trim the ends
        inputs = [a for raw in raws for a in ("-i", str(raw))]
        joined = "".join(f"[{i}:a]" for i in range(len(raws)))
        subprocess.run(
            [
                "ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex",
                f"{joined}concat=n={len(raws)}:v=0:a=1,"
                "silenceremove=start_periods=1:start_threshold=-45dB"
                ":stop_periods=-1:stop_threshold=-45dB:stop_duration=0.15:stop_silence=0.15",
                "-c:a", "libmp3lame", "-q:a", "2", str(out / f"{scene_id}.mp3"),
            ],
            check=True,
        )
        for raw in raws:
            raw.unlink()
        asked = sum(1 for who, _ in parts if who == "q")
        print("wrote", scene_id, f"({asked} question{'s' if asked != 1 else ''} by {QUESTION_VOICE})" if asked else "")


if __name__ == "__main__":
    asyncio.run(main())
