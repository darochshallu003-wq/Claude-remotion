"""Generate an explainer's voiceover with Microsoft's Hindi neural voice.

Reads each scene's `vo` line from src/<project>/script.ts and writes
public/<project>/vo/<scene id>.mp3 using edge-tts (needs the host
speech.platform.bing.com to be reachable). Technical terms in SAY get a
phonetic spelling in the spoken text only, so the voice says them clearly.
The voice's 1-1.5 s sentence pauses are cut to 0.15 s.

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
    # diwali series
    "PM 2.5": "पी एम टू पॉइंट फ़ाइव",
    "AQI": "ए क्यू आई",
    "CSIR-NEERI": "सी एस आई आर नीरी",
    "SWAS": "स्वास",
    "STAR": "स्टार",
    "SAFAL": "सफल",
    "FSSAI": "एफ़ एस एस ए आई",
    "BSE": "बी एस ई",
    "NSE": "एन एस ई",
    "PIB": "पी आई बी",
    "NASA": "नासा",
    "WhatsApp": "व्हाट्सऐप",
    "Comment": "कमेंट",
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
        raw = out / f"{scene_id}.raw.mp3"
        await edge_tts.Communicate(spoken, voice, rate=rate, proxy=proxy).save(str(raw))
        # cut any pause longer than 0.15 s down to 0.15 s and trim the ends
        subprocess.run(
            [
                "ffmpeg", "-nostdin", "-v", "error", "-y", "-i", str(raw), "-af",
                "silenceremove=start_periods=1:start_threshold=-45dB"
                ":stop_periods=-1:stop_threshold=-45dB:stop_duration=0.15:stop_silence=0.15",
                "-c:a", "libmp3lame", "-q:a", "2", str(out / f"{scene_id}.mp3"),
            ],
            check=True,
        )
        raw.unlink()
        print("wrote", scene_id)


if __name__ == "__main__":
    asyncio.run(main())
