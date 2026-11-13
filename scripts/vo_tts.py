"""Generate an explainer's voiceover with Microsoft's Hindi neural voice.

Reads each scene's `vo` line from src/<project>/script.ts and writes
public/<project>/vo/<scene id>.mp3 using edge-tts (needs the host
speech.platform.bing.com to be reachable). Technical terms in SAY get a
phonetic spelling in the spoken text only, so the voice says them clearly.
The voice's 1-1.5 s sentence pauses are cut to 0.15 s. Questions are asked by
a second voice (QUESTION_VOICE) and answered by the narrator.

Usage: python3 scripts/vo_tts.py <project> [voice] [rate] [--elevenlabs]
  e.g.  python3 scripts/vo_tts.py haldi
        python3 scripts/vo_tts.py haldi --elevenlabs
  defaults: hi-IN-MadhurNeural  +22%
Then run scripts/vo_timing.py <project> to fit the scenes to the clips.

With --elevenlabs the lines are spoken by ElevenLabs (api.elevenlabs.io)
instead, with the eleven_multilingual_v2 model. `voice` is then an ElevenLabs
voice id, and `rate` a percentage that becomes ElevenLabs' speed (capped to
its 0.7-1.2 range). Environment variables:
  ELEVENLABS_API_KEY            the key (may be omitted when a proxy adds it)
  ELEVENLABS_VOICE              narrator voice id   (default: George)
  ELEVENLABS_QUESTION_VOICE     question voice id   (default: Sarah)
  ELEVENLABS_MODEL              model id            (default: eleven_multilingual_v2)
"""

import asyncio
import json
import os
import pathlib
import re
import subprocess
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Questions are asked by a second voice, so they sound like someone asking.
QUESTION_VOICE = "hi-IN-SwaraNeural"
QUESTION_RATE = "+12%"

# ElevenLabs premade voices; any voice speaks Hindi with the multilingual model.
EL_VOICE = os.environ.get("ELEVENLABS_VOICE", "JBFqnCBsd6RMkjVDRZzb")  # George
EL_QUESTION_VOICE = os.environ.get("ELEVENLABS_QUESTION_VOICE", "EXAVITQu4vr4xnJGb6EG")  # Sarah
EL_MODEL = os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")


def el_speed(rate: str) -> float:
    """'+22%' -> 1.2 (ElevenLabs accepts speeds from 0.7 to 1.2)."""
    return max(0.7, min(1.2, 1 + int(rate.rstrip("%")) / 100))


def el_say(text: str, voice: str, rate: str, path: pathlib.Path) -> None:
    body = json.dumps({
        "text": text,
        "model_id": EL_MODEL,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "speed": el_speed(rate)},
    }).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_128",
        data=body,
        headers={
            "xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "injected-by-proxy"),
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            path.write_bytes(resp.read())
    except urllib.error.HTTPError as e:
        raise SystemExit(f"ElevenLabs {e.code}: {e.read().decode(errors='replace')}")

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
    # dahi
    "lactose": "लैक्टोज़",
    "lactic acid": "लैक्टिक एसिड",
    "casein": "कैसीन",
    "casserole": "कैसरोल",
}


async def main() -> None:
    eleven = "--elevenlabs" in sys.argv
    args = [a for a in sys.argv[1:] if a != "--elevenlabs"]
    if not args:
        raise SystemExit(__doc__)
    project = args[0]
    voice = args[1] if len(args) > 1 else (EL_VOICE if eleven else "hi-IN-MadhurNeural")
    rate = args[2] if len(args) > 2 else "+22%"
    q_voice = EL_QUESTION_VOICE if eleven else QUESTION_VOICE
    if not eleven:
        import edge_tts
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
            v, r = (q_voice, QUESTION_RATE) if who == "q" else (voice, rate)
            if eleven:
                el_say(text, v, r, raw)
            else:
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
        print("wrote", scene_id, f"({asked} question{'s' if asked != 1 else ''} by {q_voice})" if asked else "")


if __name__ == "__main__":
    asyncio.run(main())
