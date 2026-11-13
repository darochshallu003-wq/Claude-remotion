"""Cut-paper drawing kit shared by every scene. Each helper returns static SVG markup.

Animated groups are always inner <g> with no transform attribute; positioning lives on a wrapper,
so GSAP can tween x/y/scale/rotation from zero (contract rule 6).
"""
import json
import math
import random

C = dict(
    sky="#27455f", far="#2f5570", mid="#2c5c5b", near="#1e3b3a", grass="#36583c",
    moon="#f6e9bf", light="#efe2b2", amber="#f4b740", shadow="#0b1620",
    fur="#a8693f", furd="#8a5431", muzzle="#f1d6ad", ear="#d9906a", ink="#2a1a10",
    pj="#8fa9d0", pjd="#7591bb", slip="#d9a0ae", scarf="#f3e4b0", cheek="#e59a8a",
)


def paper(shape, fill, sh=8, op=0.28, extra=""):
    """A paper layer: a hard shadow copy, then the layer. `shape` is an element without fill."""
    s = shape.replace("/>", f' fill="{C["shadow"]}" opacity="{op}" transform="translate(0,{sh})"/>', 1) if sh else ""
    f = shape.replace("/>", f' fill="{fill}" {extra}/>', 1)
    return s + f


def ridge(seed, y, amp, x0=-200, x1=2120, step=60, bottom=1200):
    """A hill ridge path, seeded so every render matches."""
    r = random.Random(seed)
    pts = []
    x = x0
    ph = r.random() * 6
    while x <= x1:
        yy = y + math.sin(x / 260 + ph) * amp + r.uniform(-amp * 0.25, amp * 0.25)
        pts.append((x, yy))
        x += step
    d = f"M{x0},{bottom} L" + " L".join(f"{px:.0f},{py:.0f}" for px, py in pts) + f" L{x1},{bottom} Z"
    return d


def pine(x, y, h, fill, sh=True):
    w = h * 0.42
    d = (f"M{x},{y-h} L{x+w*0.55},{y-h*0.55} L{x+w*0.32},{y-h*0.56} L{x+w*0.8},{y-h*0.16} "
         f"L{x+w*0.5},{y-h*0.17} L{x+w},{y} L{x-w},{y} L{x-w*0.5},{y-h*0.17} L{x-w*0.8},{y-h*0.16} "
         f"L{x-w*0.32},{y-h*0.56} L{x-w*0.55},{y-h*0.55} Z")
    return paper(f'<path d="{d}"/>', fill, sh=6 if sh else 0)


def round_tree(x, y, h, fill, trunk="#3b2c25"):
    r = h * 0.3
    out = paper(f'<rect x="{x-h*0.05:.0f}" y="{y-h*0.45:.0f}" width="{h*0.1:.0f}" height="{h*0.45:.0f}" rx="6"/>', trunk, sh=0)
    for dx, dy, rr in ((0, -0.62, 1), (-0.45, -0.5, 0.75), (0.45, -0.5, 0.78), (0, -0.85, 0.7)):
        out += paper(f'<circle cx="{x+dx*r:.0f}" cy="{y+dy*h:.0f}" r="{r*rr:.0f}"/>', fill, sh=6)
    return out


def stars(seed, n, x0, y0, x1, y1, pid, r=(2, 4.5)):
    rnd = random.Random(seed)
    out = f'<g id="{pid}">'
    for i in range(n):
        x, y, rr = rnd.uniform(x0, x1), rnd.uniform(y0, y1), rnd.uniform(*r)
        # a four-point paper star
        out += (f'<path class="{pid}-s" d="M{x:.0f},{y-rr*2:.0f} L{x+rr*0.5:.0f},{y-rr*0.5:.0f} L{x+rr*2:.0f},{y:.0f} '
                f'L{x+rr*0.5:.0f},{y+rr*0.5:.0f} L{x:.0f},{y+rr*2:.0f} L{x-rr*0.5:.0f},{y+rr*0.5:.0f} '
                f'L{x-rr*2:.0f},{y:.0f} L{x-rr*0.5:.0f},{y-rr*0.5:.0f} Z" fill="{C["moon"]}" opacity="0.8"/>')
    return out + "</g>"


# ---------------------------------------------------------------- Doudou
def bear_head(p, mouth="smile"):
    m = {"smile": "M-9 23 Q0 31 9 23", "flat": "M-7 25 Q0 27 7 25", "o": "M-5 24 Q0 31 5 24 Q0 20 -5 24"}[mouth]
    f, e = C["fur"], C["ear"]
    return f"""
      <g id="{p}-ears">
        {paper('<circle cx="-42" cy="-40" r="21"/>', f, sh=5)}<circle cx="-42" cy="-40" r="11" fill="{e}"/>
        {paper('<circle cx="42" cy="-40" r="21"/>', f, sh=5)}<circle cx="42" cy="-40" r="11" fill="{e}"/>
      </g>
      {paper('<circle cx="0" cy="0" r="55"/>', f, sh=6)}
      <circle cx="-31" cy="15" r="9" fill="{C['cheek']}" opacity="0.55"/>
      <circle cx="31" cy="15" r="9" fill="{C['cheek']}" opacity="0.55"/>
      <ellipse cx="0" cy="17" rx="26" ry="19" fill="{C['muzzle']}"/>
      <ellipse cx="0" cy="8" rx="9.5" ry="6.5" fill="{C['ink']}"/>
      <path id="{p}-mouth" d="{m}" stroke="{C['ink']}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      <g id="{p}-eyes">
        <ellipse cx="-20" cy="-9" rx="5.8" ry="7.4" fill="{C['ink']}"/><circle cx="-18" cy="-12" r="2" fill="#fff"/>
        <ellipse cx="20" cy="-9" rx="5.8" ry="7.4" fill="{C['ink']}"/><circle cx="22" cy="-12" r="2" fill="#fff"/>
      </g>
      <g id="{p}-eyesc" opacity="0">
        <path d="M-27 -8 Q-20 -2 -13 -8" stroke="{C['ink']}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
        <path d="M13 -8 Q20 -2 27 -8" stroke="{C['ink']}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
      </g>"""


def bear(p, x, y, s=1.0, slippers=True, scarf=False):
    """Standing Doudou, feet at (x, y). Animatable: {p}-bear (whole), {p}-head, {p}-armL, {p}-armR,
    {p}-legL, {p}-legR, {p}-body, {p}-eyes, {p}-eyesc, {p}-mouth, {p}-scarf, {p}-heart."""
    f, pj = C["fur"], C["pj"]
    slip = (f'<ellipse cx="0" cy="38" rx="21" ry="10" fill="{C["slip"]}"/><circle cx="0" cy="31" r="5" fill="#fff" opacity="0.8"/>'
            if slippers else "")
    leg = lambda side: f"""<g transform="translate({side*24},-44)"><g id="{p}-leg{'L' if side<0 else 'R'}">
          {paper('<rect x="-15" y="0" width="30" height="42" rx="14"/>', C['pjd'], sh=4)}
          <ellipse cx="0" cy="38" rx="17" ry="9" fill="{f}"/>{slip}</g></g>"""
    arm = lambda side: f"""<g transform="translate({side*48},-118)"><g id="{p}-arm{'L' if side<0 else 'R'}">
          {paper(f'<rect x="-13" y="-6" width="26" height="62" rx="13"/>', pj, sh=4)}
          <circle cx="0" cy="58" r="14" fill="{f}"/></g></g>"""
    sc = f"""<g id="{p}-scarf" opacity="{1 if scarf else 0}">
          {paper('<path d="M-52 -128 Q0 -100 52 -128 L54 -112 Q0 -84 -54 -112 Z"/>', C['scarf'], sh=4)}
          {paper('<path d="M26 -110 L50 -50 L30 -46 L14 -104 Z"/>', C['scarf'], sh=4)}
          <path d="M-40 -116 Q0 -96 40 -116" stroke="#e2cf8c" stroke-width="3" fill="none"/></g>"""
    return f"""<g transform="translate({x},{y}) scale({s})"><g id="{p}-bear">
      <ellipse cx="0" cy="2" rx="70" ry="12" fill="{C['shadow']}" opacity="0.3"/>
      {leg(-1)}{leg(1)}
      {arm(-1)}
      <g id="{p}-body">
        {paper('<ellipse cx="0" cy="-86" rx="58" ry="58"/>', pj, sh=6)}
        <circle cx="0" cy="-110" r="4" fill="{C['scarf']}"/><circle cx="0" cy="-88" r="4" fill="{C['scarf']}"/>
        <circle cx="0" cy="-66" r="4" fill="{C['scarf']}"/>
        <path d="M-30 -60 l4 -8 l4 8 l-8 0 Z" fill="{C['moon']}" opacity="0.7"/>
        <path d="M24 -100 l4 -8 l4 8 l-8 0 Z" fill="{C['moon']}" opacity="0.7"/>
        <g id="{p}-heart" opacity="0"><path d="M-14 -96 c-8 -10 -22 -2 -14 9 l14 12 l14 -12 c8 -11 -6 -19 -14 -9 Z" fill="#e0707a" transform="translate(14,4)"/></g>
      </g>
      {arm(1)}
      {sc}
      <g transform="translate(0,-170)"><g id="{p}-head">{bear_head(p)}</g></g>
    </g></g>"""


# ---------------------------------------------------------------- the moon
def moon(p, x, y, r, bite=True, face="sad"):
    """The moon at (x, y). Animatable: {p}-moon, {p}-bite (attr cx/cy/r), {p}-mmouth, {p}-meyes,
    {p}-meyesc, {p}-tear."""
    bx, by, br = (r * 0.78, -r * 0.62, r * 0.42) if bite else (r * 3, -r * 3, 1)
    eyes_open = 0 if face in ("sad", "sleep") else 1
    mouth = {"sad": f"M{-r*.16:.0f} {r*.3:.0f} Q0 {r*.22:.0f} {r*.16:.0f} {r*.3:.0f}",
             "smile": f"M{-r*.2:.0f} {r*.22:.0f} Q0 {r*.4:.0f} {r*.2:.0f} {r*.22:.0f}",
             "sleep": f"M{-r*.12:.0f} {r*.28:.0f} Q0 {r*.34:.0f} {r*.12:.0f} {r*.28:.0f}"}[face]
    craters = "".join(f'<circle cx="{cx*r:.0f}" cy="{cy*r:.0f}" r="{cr*r:.0f}" fill="#eadba6" opacity="0.7"/>'
                      for cx, cy, cr in ((-.5, -.35, .13), (.42, .45, .1), (-.3, .6, .07), (.1, -.62, .06)))
    lw = max(3, r * 0.045)
    return f"""<g transform="translate({x},{y})"><g id="{p}-moon">
      <circle r="{r*1.55:.0f}" fill="{C['light']}" opacity="0.07"/>
      <circle r="{r*1.25:.0f}" fill="{C['light']}" opacity="0.08"/>
      <mask id="{p}-mask" maskUnits="userSpaceOnUse" x="{-r*2:.0f}" y="{-r*2:.0f}" width="{r*4:.0f}" height="{r*4:.0f}">
        <rect x="{-r*2:.0f}" y="{-r*2:.0f}" width="{r*4:.0f}" height="{r*4:.0f}" fill="#fff"/>
        <circle id="{p}-bite" cx="{bx:.0f}" cy="{by:.0f}" r="{br:.0f}" fill="#000"/>
      </mask>
      <g mask="url(#{p}-mask)">
        <circle r="{r}" fill="{C['shadow']}" opacity="0.25" transform="translate(0,{r*0.06:.0f})"/>
        <circle r="{r}" fill="{C['moon']}"/>
        {craters}
        <circle cx="{-r*.45:.0f}" cy="{r*.2:.0f}" r="{r*.1:.0f}" fill="{C['cheek']}" opacity="0.45"/>
        <circle cx="{r*.45:.0f}" cy="{r*.2:.0f}" r="{r*.1:.0f}" fill="{C['cheek']}" opacity="0.45"/>
        <g id="{p}-meyes" opacity="{eyes_open}">
          <ellipse cx="{-r*.26:.0f}" cy="{-r*.02:.0f}" rx="{r*.055:.1f}" ry="{r*.075:.1f}" fill="#5a4a3a"/>
          <ellipse cx="{r*.26:.0f}" cy="{-r*.02:.0f}" rx="{r*.055:.1f}" ry="{r*.075:.1f}" fill="#5a4a3a"/>
        </g>
        <g id="{p}-meyesc" opacity="{1-eyes_open}">
          <path d="M{-r*.36:.0f} {-r*.02:.0f} Q{-r*.26:.0f} {r*.08:.0f} {-r*.16:.0f} {-r*.02:.0f}" stroke="#5a4a3a" stroke-width="{lw:.1f}" fill="none" stroke-linecap="round"/>
          <path d="M{r*.16:.0f} {-r*.02:.0f} Q{r*.26:.0f} {r*.08:.0f} {r*.36:.0f} {-r*.02:.0f}" stroke="#5a4a3a" stroke-width="{lw:.1f}" fill="none" stroke-linecap="round"/>
        </g>
        <path id="{p}-mmouth" d="{mouth}" stroke="#5a4a3a" stroke-width="{lw:.1f}" fill="none" stroke-linecap="round"/>
      </g>
      <g id="{p}-tear" opacity="0"><path d="M{r*.3:.0f} {r*.12:.0f} q{r*.05:.0f} {r*.1:.0f} 0 {r*.14:.0f} q{-r*.05:.0f} {-r*.04:.0f} 0 {-r*.14:.0f} Z" fill="#cfe6f2"/></g>
    </g></g>"""


def cloud(x, y, s, fill="#d9d6cf", pid=""):
    i = f' id="{pid}"' if pid else ""
    d = ("M-120 30 Q-130 -10 -90 -14 Q-80 -60 -30 -50 Q-5 -90 45 -62 Q90 -70 98 -26 "
         "Q135 -20 128 22 Q125 40 100 40 L-100 40 Q-122 40 -120 30 Z")
    return f'<g transform="translate({x},{y}) scale({s})"><g{i}>{paper(f"<path d=\"{d}\"/>", fill, sh=6)}</g></g>'


def candy(pid, x, y, s=1.0, op=1):
    return f"""<g transform="translate({x},{y}) scale({s})"><g id="{pid}" opacity="{op}">
      {paper('<path d="M-30 0 L-58 -20 L-52 0 L-58 20 Z"/>', '#f3c86a', sh=3)}
      {paper('<path d="M30 0 L58 -20 L52 0 L58 20 Z"/>', '#f3c86a', sh=3)}
      {paper('<circle r="30"/>', C['moon'], sh=4)}
      <path d="M8 -22 A22 22 0 1 0 8 22 A16 16 0 1 1 8 -22 Z" fill="{C['amber']}"/>
      <circle cx="-10" cy="-12" r="5" fill="#fff" opacity="0.7"/>
    </g></g>"""


def firefly(pid, x, y, s=1.0):
    return f"""<g transform="translate({x},{y}) scale({s})"><g id="{pid}">
      <circle cx="-14" cy="6" r="26" fill="{C['amber']}" opacity="0.16"/>
      <ellipse cx="-12" cy="6" rx="13" ry="11" fill="{C['amber']}"/>
      <ellipse cx="4" cy="0" rx="12" ry="9" fill="#3a3326"/>
      <circle cx="16" cy="-3" r="7" fill="#3a3326"/>
      <circle cx="18" cy="-5" r="2" fill="#fff"/>
      <path d="M18 -9 q4 -12 12 -14 M14 -9 q-1 -12 4 -16" stroke="#3a3326" stroke-width="2" fill="none"/>
      <g id="{pid}-wings"><ellipse cx="0" cy="-12" rx="12" ry="6" fill="#e6eef2" opacity="0.75" transform="rotate(-25)"/>
      <ellipse cx="-6" cy="-10" rx="11" ry="5" fill="#e6eef2" opacity="0.6" transform="rotate(-50)"/></g>
    </g></g>"""


def owl(pid, x, y, s=1.0):
    return f"""<g transform="translate({x},{y}) scale({s})"><g id="{pid}">
      {paper('<path d="M-38 0 Q-44 -70 -30 -86 L-22 -104 L-10 -88 L10 -88 L22 -104 L30 -86 Q44 -70 38 0 Z"/>', '#6b5440', sh=5)}
      <ellipse cx="0" cy="-30" rx="24" ry="26" fill="#9a7c5e"/>
      <g id="{pid}-eyes"><circle cx="-15" cy="-66" r="13" fill="{C['moon']}"/><circle cx="15" cy="-66" r="13" fill="{C['moon']}"/>
      <circle cx="-14" cy="-65" r="6" fill="{C['ink']}"/><circle cx="16" cy="-65" r="6" fill="{C['ink']}"/></g>
      <path d="M-5 -56 L5 -56 L0 -46 Z" fill="{C['amber']}"/>
    </g></g>"""


def rabbit(x, y, s=1.0):
    return f"""<g transform="translate({x},{y}) scale({s})">
      {paper('<ellipse cx="0" cy="-26" rx="40" ry="28"/>', '#d8d2c8', sh=4)}
      {paper('<ellipse cx="-34" cy="-40" rx="22" ry="20"/>', '#d8d2c8', sh=4)}
      {paper('<ellipse cx="-30" cy="-58" rx="8" ry="26" transform="rotate(-70 -30 -58)"/>', '#d8d2c8', sh=3)}
      {paper('<ellipse cx="-40" cy="-60" rx="8" ry="26" transform="rotate(-80 -40 -60)"/>', '#cfc7bb', sh=3)}
      <path d="M-46 -42 q5 4 10 0" stroke="{C['ink']}" stroke-width="2.4" fill="none"/>
      <circle cx="38" cy="-30" r="9" fill="#fff"/></g>"""


def squirrel(x, y, s=1.0):
    return f"""<g transform="translate({x},{y}) scale({s})">
      {paper('<path d="M10 -20 Q60 -30 50 -80 Q44 -110 18 -100 Q40 -80 26 -50 Q16 -36 10 -20 Z"/>', '#b8743e', sh=4)}
      {paper('<ellipse cx="-8" cy="-22" rx="30" ry="22"/>', '#c98448', sh=4)}
      {paper('<circle cx="-34" cy="-34" r="16"/>', '#c98448', sh=4)}
      <path d="M-42 -50 l4 -12 l6 10 Z" fill="#c98448"/>
      <path d="M-42 -34 q4 3 8 0" stroke="{C['ink']}" stroke-width="2.2" fill="none"/></g>"""


def bird(x, y, s=1.0, awake=False, pid=""):
    i = f' id="{pid}"' if pid else ""
    eye = (f'<circle cx="-16" cy="-30" r="3.5" fill="{C["ink"]}"/>' if awake else
           f'<path d="M-20 -30 q4 3 8 0" stroke="{C["ink"]}" stroke-width="2.2" fill="none"/>')
    return f"""<g transform="translate({x},{y}) scale({s})"><g{i}>
      {paper('<ellipse cx="0" cy="-24" rx="28" ry="24"/>', '#d77b62', sh=4)}
      <ellipse cx="4" cy="-16" rx="18" ry="13" fill="#f0c9a6"/>
      {paper('<path d="M18 -34 Q40 -40 44 -20 Q30 -22 18 -24 Z"/>', '#b8604b', sh=3)}
      <path d="M-27 -28 L-40 -24 L-27 -20 Z" fill="{C['amber']}"/>{eye}</g></g>"""


def paper_overlay():
    return '<div class="grain"></div>'


BASE_CSS = """
#root { position:absolute; inset:0; overflow:hidden; background:#16263a; }
#root .cam { position:absolute; inset:0; }
#root svg.stage { position:absolute; inset:0; width:100%; height:100%; overflow:visible; }
#root .grain { position:absolute; inset:0; background-image:url('assets/paper.png'); background-size:960px 540px;
  mix-blend-mode:multiply; opacity:0.45; pointer-events:none; }
#root .dip { position:absolute; inset:0; background:#0e1824; opacity:0; pointer-events:none; }
"""
