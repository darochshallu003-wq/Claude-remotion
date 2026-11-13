"""Build the plates and measurements for the film from ONE real micrograph.

Source: "Yogurt Bacteria.jpg" by Andreacise, Wikimedia Commons, CC BY 4.0 (see CREDITS).
World coordinates are pixels of the best copy we have (`src/`), called level 0.
Nothing on the specimen is drawn or retouched: the plates are the photo, downsampled
and given one global grade (glass -> warm white, a little stain density).

Writes assets/plates/: plate JPEGs, the counted-pixel overlay PNG, plates.json.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(HERE, 'src')
OUT = os.path.join(HERE, 'assets', 'plates'); os.makedirs(OUT, exist_ok=True)
CFG = json.load(open(os.path.join(HERE, 'config.json')))

# ---------------------------------------------------------------- the best copy we have
cands = ['Yogurt_Bacteria_orig.jpg', 'Yogurt_Bacteria_1920.jpg', 'prev_Yogurt_Bacteria.jpg']
src = next(os.path.join(SRC, c) for c in cands if os.path.exists(os.path.join(SRC, c)))
im = Image.open(src).convert('RGB')
W0, H0 = im.size
ORIG_W = 3000                                   # the file on Commons is 3000 x 4000
print('source', os.path.basename(src), W0, H0)
a = np.asarray(im).astype(np.float32) / 255.0
lum = a @ np.array([0.2126, 0.7152, 0.0722], np.float32)

# ---------------------------------------------------------------- the eyepiece disc (field stop)
small = 4
ls = np.asarray(im.resize((W0 // small, H0 // small), Image.BILINEAR).convert('L')).astype(np.float32) / 255
disc = ls > 0.45
disc = ndi.binary_opening(disc, iterations=2)
lab, n = ndi.label(disc); sizes = ndi.sum(disc, lab, range(1, n + 1))
disc = lab == (1 + int(np.argmax(sizes)))
disc = ndi.binary_fill_holes(disc)
ys, xs = np.nonzero(disc)
cx, cy = xs.mean() * small, ys.mean() * small
r = np.sqrt(disc.sum() / np.pi) * small
print(f'disc centre ({cx:.1f},{cy:.1f}) radius {r:.1f}px')

# ---------------------------------------------------------------- one grade for every plate
inside = np.zeros_like(lum, bool)
yy, xx = np.mgrid[0:H0, 0:W0]
inside = (xx - cx) ** 2 + (yy - cy) ** 2 < (0.85 * r) ** 2
bg = np.median(a[inside & (lum > np.percentile(lum[inside], 60))], axis=0)   # the glass inside the field
GLASS = np.array([244, 241, 236], np.float32) / 255
gain = GLASS / bg
g = np.clip(a * gain, 0, 1)
# a little density and chroma in the stain, nothing else (no false colour)
gl = g @ np.array([0.2126, 0.7152, 0.0722], np.float32)
dens = np.clip((GLASS.mean() - gl) / 0.6, 0, 1)[..., None]
g = np.clip(gl[..., None] + (g - gl[..., None]) * (1 + 0.25 * dens), 0, 1)
g = np.clip(g - 0.06 * dens, 0, 1)
graded = Image.fromarray((g * 255 + 0.5).astype(np.uint8))

# ---------------------------------------------------------------- plates: the same photo at three levels
plates = []
def save(name, img, x, y, s):
    f = f'assets/plates/{name}.jpg'
    img.save(os.path.join(HERE, f), quality=93)
    plates.append(dict(name=name, file=f, x=x, y=y, w=img.size[0], h=img.size[1], s=s))
save('a4', graded.resize((W0 // 4, H0 // 4), Image.LANCZOS), 0, 0, 4)
save('a2', graded.resize((W0 // 2, H0 // 2), Image.LANCZOS), 0, 0, 2)
m = int(r * 1.04)
bx0, by0 = int(cx - m), int(cy - m)
save('c1', graded.crop((bx0, by0, bx0 + 2 * m, by0 + 2 * m)), bx0, by0, 1)

# ---------------------------------------------------------------- scale (no pixel size in the file: two estimates)
# (1) the beads: small round blobs; the median equivalent diameter of isolated ones
stain = np.clip((GLASS.mean() - gl), 0, 1)
dark = (stain > CFG['stain_threshold']) & inside
lab, n = ndi.label(dark)
objs = ndi.find_objects(lab)
areas = ndi.sum(dark, lab, range(1, n + 1))
round_d = []
for i, sl in enumerate(objs):
    h, w = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
    A = areas[i]
    if A < 4 or A > 400: continue
    if max(h, w) / max(1, min(h, w)) > 1.35: continue
    if A / (h * w) < 0.55: continue
    round_d.append(2 * np.sqrt(A / np.pi))
bead_px = float(np.median(round_d)) if round_d else None
print('beads measured', len(round_d), 'median diameter px', bead_px)
# (2) a 100x objective with a field-number-18 eyepiece shows a 180 um wide field
fov_fn18_um = 180.0
mpp_fn = fov_fn18_um / (2 * r)
mpp_bead = CFG['bead_um'] / bead_px if bead_px else None
print(f'um/px by field stop (FN18): {mpp_fn:.4f}; by bead diameter ({CFG["bead_um"]} um): {mpp_bead}')
mpp = mpp_fn

# ---------------------------------------------------------------- counting the colour: one circle
C = CFG['circle']                                    # in ORIGINAL (3000 px) coordinates
k = W0 / ORIG_W
ccx, ccy, crad = C['cx'] * k, C['cy'] * k, C['r'] * k
circ = (xx - ccx) ** 2 + (yy - ccy) ** 2 < crad ** 2
counted = dark & circ
share = counted.sum() / circ.sum()
# the cumulative share as a scan front crosses the circle along screen x (the camera roll is fixed while counting)
th = np.deg2rad(CFG['count_roll_deg'])
u = (xx - ccx) * np.cos(th) - (yy - ccy) * np.sin(th)          # screen-x of each pixel relative to centre
bins = np.linspace(-crad, crad, 121)
hc, _ = np.histogram(u[counted], bins)
cum = np.concatenate([[0], np.cumsum(hc)]) / circ.sum()
# overlay: counted pixels in amber, transparent elsewhere, cropped to the circle
ox0, oy0 = int(ccx - crad) - 2, int(ccy - crad) - 2
ox1, oy1 = int(ccx + crad) + 3, int(ccy + crad) + 3
sub = counted[oy0:oy1, ox0:ox1]
sub = ndi.binary_dilation(sub, iterations=1)
ov = np.zeros(sub.shape + (4,), np.uint8)
ov[sub] = (255, 186, 84, 245)
Image.fromarray(ov, 'RGBA').save(os.path.join(OUT, 'counted.png'))

# landing targets (original coords -> level-0)
pts = {kk: [v[0] * k, v[1] * k] for kk, v in CFG['points'].items()}

json.dump(dict(
    source=os.path.basename(src), size=[W0, H0], orig_scale=k,
    disc=dict(cx=cx, cy=cy, r=r), mpp=mpp, mpp_bead=mpp_bead, bead_px=bead_px, n_beads=len(round_d),
    plates=plates, glass_rgb=(GLASS * 255).tolist(),
    circle=dict(cx=ccx, cy=ccy, r=crad, diam_um=2 * crad * mpp, share=share,
                counted=int(counted.sum()), total=int(circ.sum()), cum=cum.tolist(),
                overlay=dict(file='assets/plates/counted.png', x=ox0, y=oy0, w=int(sub.shape[1]), h=int(sub.shape[0]), s=1)),
    points=pts, stain_threshold=CFG['stain_threshold'],
), open(os.path.join(OUT, 'plates.json'), 'w'), indent=1)
print(f'circle {2*crad*mpp:.1f} um, counted {counted.sum()} / {circ.sum()} px = {100*share:.1f} %')
