"""Fit the OnionExplainer scenes to recorded voiceover clips.

Put one clip per scene in public/onion/vo/<scene id>.mp3 (ids: hook, weapon,
rooms, knife, twist, discovery, gas, eyes, garlic, ignobel, why, tips, cta).
This sets each scene's `seconds` in src/onion/script.ts to its clip length
plus a short breath, and switches HAS_VOICEOVER on in OnionExplainer.tsx so
the clips play and the music ducks under them.

Usage: python3 scripts/onion_vo_timing.py
"""

import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "src" / "onion" / "script.ts"
COMP = ROOT / "src" / "onion" / "OnionExplainer.tsx"
VO = ROOT / "public" / "onion" / "vo"
BREATH = 0.6  # seconds after each line before the next scene


def duration(path: pathlib.Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def main() -> None:
    text = SCRIPT.read_text()
    ids = re.findall(r'id: "([a-z]+)"', text)
    missing = [i for i in ids if not (VO / f"{i}.mp3").exists()]
    if missing:
        raise SystemExit(f"missing clips in {VO}: {', '.join(missing)}")
    for i in ids:
        secs = round(duration(VO / f"{i}.mp3") + BREATH, 2)
        text = re.sub(
            rf'(id: "{i}",\s*seconds: )[0-9.]+',
            rf"\g<1>{secs}",
            text,
        )
        print(f"{i:10s} {secs:6.2f} s")
    SCRIPT.write_text(text)
    COMP.write_text(COMP.read_text().replace("const HAS_VOICEOVER = false", "const HAS_VOICEOVER = true"))
    print("updated script.ts and enabled the voiceover")


if __name__ == "__main__":
    main()
