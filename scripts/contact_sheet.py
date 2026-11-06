"""Render one still per scene (at 80% of each scene) and tile them.

Usage: python3 scripts/contact_sheet.py <project> <CompositionId> <out.png>
  e.g. python3 scripts/contact_sheet.py diwali/narak Diwali01Narak /tmp/sheet.png
"""
import pathlib, re, subprocess, sys, tempfile
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
project, comp, out = sys.argv[1:4]
t = (ROOT / "src" / project / "script.ts").read_text()
secs = [float(x) for x in re.findall(r"seconds: ([0-9.]+)", t)]
frames, s = [], 0
for x in secs:
    f = round(x * 30); frames.append(s + int(f * 0.8)); s += f
tmp = pathlib.Path(tempfile.mkdtemp())
import os
bundle = pathlib.Path(os.environ["BUNDLE"]) if os.environ.get("BUNDLE") else tmp / "bundle"
if not bundle.exists():
    subprocess.run(["npx", "remotion", "bundle", "src/index.ts", "--out-dir", str(bundle)], cwd=ROOT, check=True, capture_output=True)
ims = []
for i, f in enumerate(frames):
    p = tmp / f"{i}.png"
    subprocess.run(["npx", "remotion", "still", str(bundle), comp, str(p), f"--frame={f}", "--scale=0.33",
                    "--browser-executable=/opt/pw-browsers/chromium", "--log=error"], cwd=ROOT, check=True, capture_output=True)
    ims.append(Image.open(p))
w, h = ims[0].size
cols = min(len(ims), 6)
rows = -(-len(ims) // cols)
sheet = Image.new("RGB", (w * cols, h * rows), "white")
for i, im in enumerate(ims):
    sheet.paste(im, ((i % cols) * w, (i // cols) * h))
sheet.save(out)
print(out)
