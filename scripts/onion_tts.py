"""Generate the OnionExplainer voiceover with Microsoft's Hindi neural voice.

Reads each scene's `vo` line from src/onion/script.ts and writes
public/onion/vo/<scene id>.mp3 using edge-tts (needs the host
speech.platform.bing.com to be reachable). A few technical terms get a
phonetic spelling in the spoken text only, so the voice says them clearly.

Usage: python3 scripts/onion_tts.py [voice] [rate]
  defaults: hi-IN-MadhurNeural  +10%
Then run scripts/onion_vo_timing.py to fit the scenes to the clips.
"""

import asyncio
import os
import pathlib
import re
import subprocess
import sys

import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "src" / "onion" / "script.ts"
OUT = ROOT / "public" / "onion" / "vo"

SAY = {
    "syn-propanethial-S-oxide": "सिन-प्रोपेन-थायल-एस-ऑक्साइड",
    "Ig Nobel": "इग नोबेल",
    "Self-defence.": "सेल्फ़-डिफ़ेंस।",
}


async def main() -> None:
    voice = sys.argv[1] if len(sys.argv) > 1 else "hi-IN-MadhurNeural"
    rate = sys.argv[2] if len(sys.argv) > 2 else "+10%"
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    text = SCRIPT.read_text()
    lines = re.findall(r'id: "([a-z]+)",.*?vo: "(.*?)",\n', text, re.S)
    OUT.mkdir(parents=True, exist_ok=True)
    for scene_id, vo in lines:
        spoken = vo
        for k, v in SAY.items():
            spoken = spoken.replace(k, v)
        raw = OUT / f"{scene_id}.raw.mp3"
        tts = edge_tts.Communicate(spoken, voice, rate=rate, proxy=proxy)
        await tts.save(str(raw))
        # The voice pauses 1-1.5 s after every sentence; cut any pause
        # longer than 0.3 s down to 0.3 s (silence only) and trim the ends.
        subprocess.run(
            [
                "ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af",
                "silenceremove=start_periods=1:start_threshold=-45dB"
                ":stop_periods=-1:stop_threshold=-45dB:stop_duration=0.3:stop_silence=0.3",
                "-c:a", "libmp3lame", "-q:a", "2", str(OUT / f"{scene_id}.mp3"),
            ],
            check=True,
        )
        raw.unlink()
        print("wrote", scene_id)


if __name__ == "__main__":
    asyncio.run(main())
