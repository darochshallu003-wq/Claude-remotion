"""Tile preview frames into a labelled contact sheet: python3 scripts/cartoon/tile.py <dir> <out.jpg> [cols] [every] [start]"""
import sys, pathlib, re
from PIL import Image, ImageDraw
d, out = pathlib.Path(sys.argv[1]), sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 7
every = int(sys.argv[4]) if len(sys.argv) > 4 else 60
start = int(sys.argv[5]) if len(sys.argv) > 5 else 0
files = sorted(d.glob("*.jpeg"), key=lambda p: int(re.findall(r"\d+", p.stem)[-1]))
ims = [Image.open(f) for f in files]
w, h = 216, 384
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * w, rows * h), "black")
for i, (f, im) in enumerate(zip(files, ims)):
    im = im.resize((w, h))
    x, y = (i % cols) * w, (i // cols) * h
    sheet.paste(im, (x, y))
    n = int(re.findall(r"\d+", f.stem)[-1])
    ImageDraw.Draw(sheet).text((x + 4, y + 4), str(start + n * every if n < 10000 else n), fill="yellow")
sheet.save(out, quality=85)
print(out, sheet.size)
