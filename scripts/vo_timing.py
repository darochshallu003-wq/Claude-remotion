"""Fit an explainer's scenes to its recorded voiceover clips.

Expects one clip per scene in public/<project>/vo/<scene id>.mp3. Sets each
scene's `seconds` in src/<project>/script.ts to its clip length plus a short
breath, and turns HAS_VOICEOVER on there so the clips play and the music
ducks under them.

Usage: python3 scripts/vo_timing.py <project> [breath seconds, default 0.25]
"""

import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BREATH = 0.25  # seconds after each line before the next scene


def duration(path: pathlib.Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def main() -> None:
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    project = sys.argv[1]
    breath = float(sys.argv[2]) if len(sys.argv) > 2 else BREATH
    script = ROOT / "src" / project / "script.ts"
    vo = ROOT / "public" / project / "vo"
    text = script.read_text()
    ids = re.findall(r'id: "([a-z]+)"', text)
    missing = [i for i in ids if not (vo / f"{i}.mp3").exists()]
    if missing:
        raise SystemExit(f"missing clips in {vo}: {', '.join(missing)}")
    total = 0.0
    for i in ids:
        secs = round(duration(vo / f"{i}.mp3") + breath, 2)
        total += secs
        text = re.sub(rf'(id: "{i}",\s*seconds: )[0-9.]+', rf"\g<1>{secs}", text)
        print(f"{i:10s} {secs:6.2f} s")
    text = text.replace("HAS_VOICEOVER = false", "HAS_VOICEOVER = true")
    script.write_text(text)
    print(f"scenes total {total:.1f} s; updated {script.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
