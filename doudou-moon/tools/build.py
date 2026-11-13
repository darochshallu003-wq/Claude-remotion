"""Build every scene of "Doudou and the Moon" into compositions/*.html and the root index.html.

Each scene is plain SVG + one GSAP timeline; sentence times come from tools/timing.json (tools/vo.py).
Run: python3 tools/build.py
"""
import json
import math
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from kit import (C, paper, ridge, pine, round_tree, stars, bear, bear_head, moon, cloud, candy,
                 firefly, owl, rabbit, squirrel, bird)
from tl import TL, TIMING, scene_html, scene_ts, REMOTION, ROOT

OUT = ROOT / "compositions"
OUT.mkdir(exist_ok=True)
END_HOLD = 4.0  # extra seconds the last frame holds after "Goodnight, little one"


class Cam:
    """Frames the stage: centre (cx, cy) at scale s, tweened on the scene's camera group."""

    def __init__(self, tl, sel, cx=960, cy=540, s=1.0):
        # the camera moves an HTML wrapper around the stage (1 px = 1 stage unit)
        self.tl, self.sel = tl, f"#{tl.sid}-camd"
        self.st = (cx, cy, s)
        tl.set(self.sel, {**self.props(cx, cy, s), "transformOrigin": "0px 0px"}, 0)

    @staticmethod
    def props(cx, cy, s):
        return {"x": round(960 - cx * s, 1), "y": round(540 - cy * s, 1), "scale": s}

    def to(self, at, cx, cy, s, dur, ease="power2.inOut"):
        self.tl.ft(self.sel, {**self.props(*self.st), "transformOrigin": "0px 0px"},
                   {**self.props(cx, cy, s), "duration": dur, "ease": ease}, at)
        self.st = (cx, cy, s)


def write(sid, body, tl, css="", overlay=""):
    (OUT / f"{sid}.html").write_text(scene_html(sid, body, tl, css, overlay))
    REMOTION.mkdir(parents=True, exist_ok=True)
    (REMOTION / f"{sid.split('-')[0]}.ts").write_text(scene_ts(sid, body, tl, css, overlay))


# ------------------------------------------------------------------ the bedroom (s01, s08, s12, s13)
def bedroom(p, mode="night", moon_face=None, bite=True, sheep=False, glow=False, patch=False):
    night = mode == "night"
    wall, floor = ("#34506a", "#3f3438") if night else ("#f1dcb6", "#c99a6e")
    sky = "#22405a" if night else "#bfe3ea"
    hills = (C["far"], C["mid"], C["near"]) if night else ("#9cc79a", "#7fae6a", "#5d9154")
    curt = "#7a6aa6" if night else "#d68f7c"
    out = [f'<rect x="-400" y="-400" width="2720" height="1880" fill="{wall}"/>']
    # wallpaper: small paper moons in rows
    for r in range(6):
        for c in range(14):
            x, y = 40 + c * 140 + (70 if r % 2 else 0), 60 + r * 130
            out.append(f'<path d="M{x} {y} a14 14 0 1 0 12 22 a11 11 0 1 1 -12 -22 Z" fill="{"#3d5c78" if night else "#ead0a6"}"/>')
    out.append(f'<rect x="-400" y="860" width="2720" height="600" fill="{floor}"/>')
    for i in range(9):
        out.append(f'<line x1="-400" y1="{880+i*30}" x2="2320" y2="{880+i*30}" stroke="#00000022" stroke-width="2"/>')
    # window view
    out.append(f'<clipPath id="{p}-win"><rect x="1180" y="170" width="480" height="440"/></clipPath>')
    out.append(f'<g clip-path="url(#{p}-win)"><rect x="1180" y="170" width="480" height="440" fill="{sky}"/>')
    if night:
        out.append(stars(7, 22, 1190, 180, 1650, 420, f"{p}-stars"))
    else:
        out.append(f'<g transform="translate(1290,470)"><g id="{p}-sun"><circle r="70" fill="{C["amber"]}"/></g></g>')
    if moon_face:
        out.append(moon(f"{p}-m", 1540, 285, 62, bite=bite, face=moon_face))
    out.append(paper(f'<path d="{ridge(3, 470, 20, 1100, 1760, 40, 700)}"/>', hills[0], sh=5))
    if night:
        for i, (lx, ly) in enumerate(((1230, 482), (1300, 470), (1380, 478), (1460, 468), (1590, 476))):
            out.append(f'<rect id="{p}-lt{i}" x="{lx}" y="{ly}" width="12" height="12" rx="2" fill="{C["amber"]}"/>')
    out.append(paper(f'<path d="{ridge(5, 530, 18, 1100, 1760, 40, 700)}"/>', hills[1], sh=5))
    for i, x in enumerate(range(1190, 1680, 56)):
        out.append(pine(x, 600 + (i % 2) * 8, 110 + (i * 37 % 40), hills[2]))
    if not night:
        # branch with a bird, and a squirrel in its tree hollow
        out.append(paper('<path d="M1660 300 Q1540 320 1420 300 L1420 312 Q1540 334 1660 316 Z"/>', "#6d4b36", sh=4))
        out.append(bird(1490, 306, 1.0, awake=True, pid=f"{p}-bird"))
        out.append(paper('<rect x="1600" y="170" width="70" height="440"/>', "#7a5a40", sh=0))
        out.append('<ellipse cx="1622" cy="420" rx="24" ry="34" fill="#3b2a1e"/>')
        out.append(f'<g transform="translate(1630,452)"><g id="{p}-sq">{squirrel(0, 0, 0.75)}</g></g>')
    out.append("</g>")
    out.append('<rect x="1180" y="170" width="480" height="440" fill="none" stroke="#5b4636" stroke-width="22"/>')
    out.append('<line x1="1420" y1="170" x2="1420" y2="610" stroke="#5b4636" stroke-width="12"/>')
    out.append('<line x1="1180" y1="390" x2="1660" y2="390" stroke="#5b4636" stroke-width="12"/>')
    out.append(paper('<rect x="1155" y="606" width="530" height="26" rx="6"/>', "#6d4b36", sh=6))
    # curtains
    out.append('<rect x="1090" y="140" width="660" height="14" rx="7" fill="#5b4636"/>')
    out.append(f'<g transform="translate(1170,150)"><g id="{p}-curtL">'
               + paper('<path d="M-80 0 L60 0 Q40 200 64 420 Q20 470 -40 520 Q-70 300 -80 0 Z"/>', curt, sh=8)
               + '</g></g>')
    out.append(f'<g transform="translate(1670,150)"><g id="{p}-curtR">'
               + paper('<path d="M-60 0 L80 0 Q70 300 40 520 Q-20 470 -64 420 Q-40 200 -60 0 Z"/>', curt, sh=8)
               + '</g></g>')
    # bed
    out.append(paper('<path d="M270 860 L270 470 Q270 420 320 420 Q370 420 370 470 L370 860 Z"/>', "#6d4b36", sh=8))
    out.append(paper('<path d="M1030 860 L1030 590 Q1030 560 1060 560 Q1090 560 1090 590 L1090 860 Z"/>', "#6d4b36", sh=8))
    out.append(paper('<rect x="300" y="640" width="770" height="120" rx="24"/>', "#e9e2d0", sh=6))
    out.append(paper('<rect x="290" y="750" width="790" height="56" rx="10"/>', "#6d4b36", sh=6))
    out.append(f'<g transform="translate(430,640)"><g id="{p}-pillow">'
               + paper('<ellipse cx="0" cy="0" rx="125" ry="48"/>', "#f2ece0", sh=5)
               + f'<g id="{p}-pglow" opacity="{1 if glow else 0}"><ellipse rx="80" ry="26" fill="{C["light"]}" opacity="0.6"/>'
               + f'<path d="M-6 -18 a20 20 0 1 0 18 34 a15 15 0 1 1 -18 -34 Z" fill="{C["moon"]}"/></g></g></g>')
    if patch:
        out.append(f'<g transform="translate(590,628)"><g id="{p}-patch" opacity="0">'
                   f'<path d="M-4 -22 a24 24 0 1 0 20 40 a18 18 0 1 1 -20 -40 Z" fill="#e8eef2"/>'
                   f'<path d="M26 -30 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#ffffff"/></g></g>')
    # Doudou in bed: head on the pillow, the quilt over him
    out.append(f'<g transform="translate(445,580) rotate(-10) scale(1.12)"><g id="{p}-head">{bear_head(p)}</g></g>')
    quilt = "M470 650 Q600 590 760 612 Q900 628 1062 640 L1078 800 L462 800 Z"
    out.append(f'<g id="{p}-quilt">' + paper(f'<path d="{quilt}"/>', "#c96f5d", sh=6))
    for i in range(5):
        x = 540 + i * 110
        out.append(f'<path d="M{x} {618 - (2 - abs(i - 2)) * 6} L{x} 800" stroke="#d98a72" stroke-width="5"/>')
        out.append(f'<path d="M{x+55} 700 a10 10 0 1 0 8 16 a8 8 0 1 1 -8 -16 Z" fill="#f3d9a0"/>')
    out.append('<path d="M470 720 Q760 690 1070 720" stroke="#d98a72" stroke-width="5" fill="none"/>')
    out.append(f'<g id="{p}-paws"><circle cx="560" cy="640" r="17" fill="{C["fur"]}"/><circle cx="610" cy="632" r="17" fill="{C["fur"]}"/></g>')
    out.append("</g>")
    # slippers by the bed
    out.append(f'<g id="{p}-slips"><ellipse cx="760" cy="900" rx="34" ry="14" fill="{C["slip"]}"/>'
               f'<ellipse cx="840" cy="908" rx="34" ry="14" fill="{C["slip"]}"/>'
               f'<circle cx="772" cy="893" r="6" fill="#fff"/><circle cx="852" cy="901" r="6" fill="#fff"/></g>')
    if sheep:
        bub = [f'<g id="{p}-bub" opacity="0">']
        for i, (bx, by, br) in enumerate(((540, 500, 10), (585, 455, 15), (640, 400, 21))):
            bub.append(f'<circle cx="{bx}" cy="{by}" r="{br}" fill="#e7e2d6"/>')
        bub.append(cloud(860, 300, 2.3, "#e7e2d6"))
        bub.append('<g clip-path="url(#%s-bclip)">' % p)
        bub.append(f'<clipPath id="{p}-bclip"><rect x="620" y="170" width="480" height="220"/></clipPath>')
        bub.append('<rect x="850" y="300" width="10" height="56" fill="#9b7a5c"/><rect x="900" y="300" width="10" height="56" fill="#9b7a5c"/>'
                   '<rect x="836" y="314" width="88" height="8" fill="#9b7a5c"/><rect x="836" y="334" width="88" height="8" fill="#9b7a5c"/>')
        for i in range(3):
            bub.append(f'<g transform="translate(700,330)"><g id="{p}-sh{i}">'
                       f'<ellipse cx="0" cy="0" rx="30" ry="20" fill="#fff"/><circle cx="-14" cy="-10" r="12" fill="#fff"/>'
                       f'<circle cx="12" cy="-10" r="12" fill="#fff"/><ellipse cx="30" cy="-6" rx="11" ry="10" fill="#4a4040"/>'
                       f'<rect x="-16" y="14" width="6" height="14" fill="#4a4040"/><rect x="12" y="14" width="6" height="14" fill="#4a4040"/></g></g>')
        bub.append("</g></g>")
        out.append("".join(bub))
    return "\n".join(out)


# ------------------------------------------------------------------ s01 bed
def s01():
    sid, p = "s01-bed", "s01"
    t = TL(sid)
    body = f'<g id="{p}-cam">{bedroom(p, "night", sheep=True)}' + "".join(
        f'<path id="{p}-wv{i}" d="M{1250+i*40} {300+i*60} q60 -30 120 0 t120 0" stroke="{C["light"]}" stroke-width="6" fill="none" stroke-linecap="round" opacity="0"/>'
        for i in range(3)) + "".join(
        f'<g transform="translate({1250 + i*30},{360+i*70})"><g id="{p}-leaf{i}" opacity="0"><path d="M0 0 q18 -18 36 0 q-18 18 -36 0 Z" fill="#7fae6a"/></g></g>'
        for i in range(3)) + "</g>"
    cam = Cam(t, f"#{p}-cam", 1420, 390, 2.2)
    # the little lights go out one by one
    for i in range(5):
        t.ft(f"#{p}-lt{i}", {"opacity": 1}, {"opacity": 0, "duration": 0.35, "ease": "power1.in"}, 1.4 + i * 0.75)
    cam.to(t.L(1) - 0.9, 680, 620, 1.35, 3.2)
    t.blink(p, [t.L(1) + 2.6, t.L(3) + 1.0, t.L(4) + 0.4])
    # counting sheep
    t.ft(f"#{p}-bub", {"opacity": 0}, {"opacity": 1, "duration": 0.6}, t.L(2) - 0.2)
    for i in range(3):
        a = t.L(2) + 0.3 + i * 1.1
        t.ft(f"#{p}-sh{i}", {"x": -80}, {"x": 330, "duration": 1.8, "ease": "none"}, a)
        t.ft(f"#{p}-sh{i}", {"y": 0}, {"y": -70, "duration": 0.9, "ease": "sine.out", "yoyo": True, "repeat": 1}, a)
    t.ft(f"#{p}-bub", {"opacity": 1}, {"opacity": 0, "duration": 0.5}, t.L(3) - 0.2)
    # wind through the window
    cam.to(t.L(3) - 0.4, 960, 560, 1.0, 2.6)
    for s, d in ((f"#{p}-curtL", 1), (f"#{p}-curtR", -1)):
        t.ft(s, {"skewX": 0, "svgOrigin": "0 0"}, {"skewX": -6 * d, "duration": 1.3, "ease": "sine.inOut", "yoyo": True, "repeat": 3}, t.L(3) + 0.2)
    for i in range(3):
        t.ft(f"#{p}-leaf{i}", {"opacity": 0}, {"opacity": 1, "duration": 0.5}, t.L(3) + 0.4 + i * 0.5)
        t.ft(f"#{p}-leaf{i}", {"x": 0, "y": 0, "rotation": 0},
             {"x": -620 - i * 90, "y": 120 + i * 20, "rotation": 260, "duration": 3.6, "ease": "sine.inOut"}, t.L(3) + 0.4 + i * 0.5)
        t.ft(f"#{p}-leaf{i}", {"opacity": 1}, {"opacity": 0, "duration": 0.5}, t.L(3) + 3.6 + i * 0.5)
    # a soft sound outside: ears perk, the head lifts toward the window
    cam.to(t.L(4) - 0.2, 980, 520, 1.12, 3.0)
    for i in range(3):
        t.ft(f"#{p}-wv{i}", {"opacity": 0}, {"opacity": 0.8, "duration": 0.5, "yoyo": True, "repeat": 3}, t.L(4) + 0.6 + i * 0.35)
    t.ft(f"#{p}-ears", {"scale": 1, "svgOrigin": "0 -30"}, {"scale": 1.12, "duration": 0.3, "ease": "back.out(2)"}, t.L(4) + 0.9)
    t.ft(f"#{p}-head", {"rotation": 0, "y": 0, "svgOrigin": "0 40"}, {"rotation": 18, "y": -26, "duration": 0.9, "ease": "power2.inOut"}, t.L(4) + 1.1)
    t.ft(f"#{p}-eyes", {"x": 0}, {"x": 5, "duration": 0.3}, t.L(4) + 1.3)
    t.ft(f"#{p}-mouth", {"scaleY": 1, "svgOrigin": "0 24"}, {"scaleY": -0.6, "duration": 0.4}, t.L(4) + 1.4)
    t.dip_out(sid)
    css = """#s01-title { position:absolute; left:0; right:0; top:200px; text-align:center; font-family:'Nunito', sans-serif;
      font-weight:800; font-size:96px; color:#f6e9bf; letter-spacing:-0.01em; text-shadow:0 6px 0 rgba(11,22,32,0.35); }
    #s01-title small { display:block; font-size:40px; font-weight:700; color:#efe2b2; margin-top:14px; letter-spacing:0.02em; }"""
    overlay = '<div id="s01-title">Doudou and the Moon<small>a bedtime story</small></div>'
    t.ft("#s01-title", {"opacity": 1, "filter": "blur(0px)"}, {"opacity": 0, "filter": "blur(8px)", "duration": 0.5, "ease": "power2.in"}, 4.6)
    write(sid, body, t, css, overlay)


# ------------------------------------------------------------------ s02 the moon at the door
def night_ground(p, seed=1, moon_xy=None):
    out = [f'<rect x="-600" y="-600" width="3120" height="2280" fill="{C["sky"]}"/>', stars(seed, 60, -300, -300, 2200, 600, f"{p}-stars")]
    out.append(paper(f'<path d="{ridge(seed+10, 640, 40, -600, 2500, 60, 1500)}"/>', C["far"], sh=6))
    out.append(paper(f'<path d="{ridge(seed+11, 720, 30, -600, 2500, 60, 1500)}"/>', C["mid"], sh=6))
    return "\n".join(out)


def s02():
    sid, p = "s02-moon", "s02"
    t = TL(sid)
    body = [f'<g id="{p}-cam">', night_ground(p, 2)]
    body.append(cloud(1150, 330, 1.6, "#cfd3d4", f"{p}-cloud"))
    body.append(moon(f"{p}-m", 1500, 300, 150, bite=True, face="sad"))
    for i, x in enumerate(range(1300, 2300, 90)):
        body.append(pine(x, 820 + (i % 3) * 14, 200 + (i * 53 % 90), C["near"]))
    body.append(paper(f'<path d="{ridge(21, 830, 14, -600, 2500, 80, 1500)}"/>', C["grass"], sh=6))
    # the silver path from the door toward the forest
    body.append(f'<g id="{p}-path" opacity="0"><path d="M560 900 Q900 880 1200 850 Q1500 830 1900 828 L1900 846 Q1500 860 1210 892 Q900 930 560 990 Z" fill="{C["light"]}" opacity="0.8"/></g>')
    # the cottage
    body.append(paper('<path d="M80 960 L80 560 L340 380 L600 560 L600 960 Z"/>', "#8a6a55", sh=10))
    body.append(paper('<path d="M40 580 L340 350 L640 580 L610 600 L340 400 L70 600 Z"/>', "#5b3d33", sh=8))
    body.append('<rect x="370" y="700" width="150" height="260" rx="70" fill="#2a1c18"/>')
    body.append('<rect x="370" y="760" width="150" height="200" fill="#f0c879" opacity="0.55"/>')
    body.append(bear(f"{p}-d", 445, 960, 0.95))
    body.append(f'<g transform="translate(370,700)"><g id="{p}-door">'
                + paper('<path d="M0 70 Q0 0 75 0 Q150 0 150 70 L150 260 L0 260 Z"/>', "#6d4b36", sh=0)
                + '<circle cx="128" cy="150" r="8" fill="#e2c27a"/></g></g>')
    body.append('<rect x="150" y="640" width="110" height="110" fill="#f0c879" opacity="0.5"/><rect x="150" y="640" width="110" height="110" fill="none" stroke="#5b3d33" stroke-width="10"/>')
    body.append("</g>")
    cam = Cam(t, f"#{p}-cam", 460, 780, 1.7)
    t.dip_in(sid)
    # slippers on, the door opens, Doudou steps out
    t.ft(f"#{p}-door", {"scaleX": 1, "svgOrigin": "0 0"}, {"scaleX": 0.12, "duration": 1.2, "ease": "power2.inOut"}, 0.8)
    t.ft(f"#{p}-d-bear", {"x": -10, "opacity": 0.0}, {"x": 0, "opacity": 1, "duration": 0.8, "ease": "power2.out"}, 1.2)
    t.ft(f"#{p}-d-bear", {"x": 0}, {"x": 150, "duration": 2.2, "ease": "power1.inOut"}, 2.2)
    t.ft(f"#{p}-d-bear", {"y": 0}, {"y": -8, "duration": 0.27, "ease": "sine.inOut", "yoyo": True, "repeat": 7}, 2.2)
    t.ft(f"#{p}-d-legL", {"rotation": -10, "svgOrigin": "0 0"}, {"rotation": 10, "duration": 0.27, "yoyo": True, "repeat": 7}, 2.2)
    t.ft(f"#{p}-d-legR", {"rotation": 10, "svgOrigin": "0 0"}, {"rotation": -10, "duration": 0.27, "yoyo": True, "repeat": 7}, 2.2)
    t.blink(f"{p}-d", [1.9, 5.8])
    # the moonlight path lays itself down
    t.ft(f"#{p}-path", {"opacity": 0, "scaleX": 0.05, "svgOrigin": "560 920"}, {"opacity": 1, "scaleX": 1, "duration": 2.4, "ease": "power2.out"}, t.L(1))
    cam.to(t.L(1) - 0.2, 760, 760, 1.15, 2.8)
    # look up: the moon with a bite missing
    cam.to(t.L(2) - 0.2, 1240, 470, 1.0, 3.2)
    t.ft(f"#{p}-d-head", {"rotation": 0, "y": 0, "svgOrigin": "0 30"}, {"rotation": 14, "y": -6, "duration": 1.0, "ease": "power2.inOut"}, t.L(2))
    t.ft(f"#{p}-d-eyes", {"y": 0, "x": 0}, {"y": -4, "x": 4, "duration": 0.4}, t.L(2) + 0.4)
    t.ft(f"#{p}-cloud", {"x": 0}, {"x": 40, "duration": t.slot, "ease": "none"}, 0)
    # the moon speaks, sadly
    t.ft(f"#{p}-m-moon", {"rotation": 0, "svgOrigin": "0 0"}, {"rotation": -6, "duration": 1.6, "ease": "sine.inOut"}, t.L(3))
    t.talk(f"#{p}-m-mmouth", t.L(4), t.L(4, True), f"0 {150*0.27:.0f}", amt=1.6)
    t.ft(f"#{p}-m-tear", {"opacity": 0, "y": 0}, {"opacity": 1, "y": 0, "duration": 0.4}, t.L(4) + 2.4)
    t.ft(f"#{p}-m-tear", {"y": 0}, {"y": 50, "duration": 2.4, "ease": "power1.in"}, t.L(4) + 2.8)
    t.ft(f"#{p}-m-tear", {"opacity": 1}, {"opacity": 0, "duration": 0.4}, t.L(4) + 4.9)
    # "I will help you find it"
    cam.to(t.L(5) - 0.6, 980, 640, 0.92, 1.8)
    t.ft(f"#{p}-d-armR", {"rotation": 0, "svgOrigin": "0 0"}, {"rotation": -150, "duration": 0.7, "ease": "back.out(1.6)"}, t.L(5) + 0.1)
    t.talk(f"#{p}-d-mouth", t.L(5) + 0.1, t.L(5) + 1.2, "0 24", amt=2.2)
    t.ft(f"#{p}-d-head", {"rotation": 14, "y": -6, "svgOrigin": "0 30"}, {"rotation": 4, "y": 2, "duration": 0.35, "ease": "power2.out", "yoyo": True, "repeat": 1}, t.L(5) + 0.9)
    t.ft(f"#{p}-m-meyesc", {"opacity": 1}, {"opacity": 0, "duration": 0.3}, t.L(5) + 1.2)
    t.ft(f"#{p}-m-meyes", {"opacity": 0}, {"opacity": 1, "duration": 0.3}, t.L(5) + 1.3)
    t.dip_out(sid)
    write(sid, "\n".join(body), t)


# ------------------------------------------------------------------ s03 into the forest (parallax walk)
def s03():
    sid, p = "s03-forest", "s03"
    t = TL(sid)
    D = t.slot
    v_far, v_mid, v_near = 30, 90, 190  # px per second
    slow_at = t.L(5)

    def at_screen(i, sx=1300, dt=1.0):
        return sx + v_near * (t.L(i) + dt)

    body = [f'<rect x="0" y="0" width="1920" height="1080" fill="{C["sky"]}"/>', stars(31, 40, 0, 0, 1920, 520, f"{p}-stars"),
            moon(f"{p}-m", 1660, 190, 70, bite=True, face="sad")]
    body.append(f'<g id="{p}-far">' + paper(f'<path d="{ridge(33, 600, 40, -100, 2800, 60, 1100)}"/>', C["far"], sh=6) + "</g>")
    mid = [paper(f'<path d="{ridge(34, 690, 30, -100, 4400, 60, 1100)}"/>', C["mid"], sh=6)]
    for i, x in enumerate(range(-60, 4400, 120)):
        mid.append(pine(x, 720 + (i % 3) * 10, 230 + (i * 41 % 100), "#28504f"))
    body.append(f'<g id="{p}-mid">' + "".join(mid) + "</g>")
    body.append(paper(f'<path d="{ridge(35, 860, 10, -100, 6600, 80, 1100)}"/>', C["grass"], sh=6))
    body.append(f'<path d="M-100 930 Q960 900 2020 925 L2020 965 Q960 945 -100 975 Z" fill="{C["light"]}" opacity="0.75"/>')
    near = []
    # owl tree
    ox = at_screen(2)
    near.append(round_tree(ox, 900, 560, "#1f4440"))
    near.append(paper(f'<path d="M{ox-10} 640 L{ox-190} 600 L{ox-190} 616 L{ox-10} 660 Z"/>', "#3b2c25", sh=4))
    near.append(owl(f"{p}-owl", ox - 140, 608, 1.0))
    # the snoring stream
    sx = at_screen(3, 1250)
    near.append(f'<path d="M{sx-360} 1080 Q{sx-160} 960 {sx} 990 Q{sx+200} 1020 {sx+380} 960 L{sx+420} 1080 Z" fill="#3c6f8a"/>')
    near.append(f'<path d="M{sx-300} 1060 Q{sx-120} 1000 {sx+40} 1020" stroke="#9cc6d8" stroke-width="5" fill="none" opacity="0.7"/>')
    for k, (dx, r) in enumerate(((-200, 34), (-110, 26), (40, 40), (170, 30), (280, 24))):
        near.append(paper(f'<ellipse cx="{sx+dx}" cy="{1010 - k%2*20}" rx="{r*1.4:.0f}" ry="{r}"/>', "#7d8a8c", sh=5))
    near.append(f'<g transform="translate({sx+60},900)"><g id="{p}-zz" opacity="0">'
                f'<path d="M0 0 h26 l-26 26 h26" stroke="{C["light"]}" stroke-width="6" fill="none" stroke-linejoin="round"/>'
                f'<path d="M40 -40 h18 l-18 18 h18" stroke="{C["light"]}" stroke-width="5" fill="none" stroke-linejoin="round"/></g></g>')
    # dew on the leaves
    lx = at_screen(4, 1150)
    for k in range(5):
        a = -60 + k * 30
        near.append(f'<g transform="translate({lx},1000) rotate({a})">' + paper('<path d="M0 0 Q30 -90 0 -180 Q-30 -90 0 0 Z"/>', "#3f7a4e", sh=4) + "</g>")
    for k, (dx, dy) in enumerate(((-120, 920), (-55, 860), (10, 840), (75, 860), (135, 915))):
        near.append(f'<g transform="translate({lx+dx},{dy})"><g class="{p}-dew"><circle r="9" fill="#e8f2f6"/><circle cx="-3" cy="-3" r="3" fill="#fff"/></g></g>')
    # some grass tufts all along
    for k in range(40):
        x = k * 170 + (k * 53 % 60)
        near.append(f'<path d="M{x} 1080 L{x+10} 1010 L{x+22} 1080 L{x+30} 1020 L{x+42} 1080 Z" fill="#2a4b33"/>')
    body.append(f'<g id="{p}-near">' + "".join(near) + "</g>")
    body.append(bear(f"{p}-d", 760, 960, 1.05))
    t.dip_in(sid)
    for sel, v in ((f"#{p}-far", v_far), (f"#{p}-mid", v_mid)):
        t.ft(sel, {"x": 0}, {"x": -v * D, "duration": D, "ease": "none"}, 0)
    t.ft(f"#{p}-near", {"x": 0}, {"x": -v_near * slow_at, "duration": slow_at, "ease": "none"}, 0)
    t.ft(f"#{p}-near", {"x": -v_near * slow_at}, {"x": -v_near * slow_at - v_near * 0.45 * (D - slow_at), "duration": D - slow_at, "ease": "none"}, slow_at)
    # walk cycle, then tiptoe
    def walk(a, b, beat):
        n = int((b - a) / beat)
        n -= (n + 1) % 2
        t.ft(f"#{p}-d-bear", {"y": 0}, {"y": -9, "duration": beat, "ease": "sine.inOut", "yoyo": True, "repeat": n}, a)
        t.ft(f"#{p}-d-legL", {"rotation": -16, "svgOrigin": "0 0"}, {"rotation": 16, "duration": beat, "ease": "sine.inOut", "yoyo": True, "repeat": n}, a)
        t.ft(f"#{p}-d-legR", {"rotation": 16, "svgOrigin": "0 0"}, {"rotation": -16, "duration": beat, "ease": "sine.inOut", "yoyo": True, "repeat": n}, a)
        t.ft(f"#{p}-d-armL", {"rotation": 12, "svgOrigin": "0 0"}, {"rotation": -12, "duration": beat, "ease": "sine.inOut", "yoyo": True, "repeat": n}, a + 0.05)
        t.ft(f"#{p}-d-armR", {"rotation": 12, "svgOrigin": "0 0"}, {"rotation": -12, "duration": beat, "ease": "sine.inOut", "yoyo": True, "repeat": n}, a + 0.05)
    walk(0, slow_at, 0.34)
    walk(slow_at + 0.01, D, 0.6)
    t.blink(f"{p}-d", [2.0, 5.3, 9.1, 13.2, 17.5])
    # the owl watches him pass
    t.ft(f"#{p}-owl-eyes", {"x": 6}, {"x": -6, "duration": 3.5, "ease": "sine.inOut"}, t.L(2) + 0.3)
    t.ft(f"#{p}-owl-eyes", {"scaleY": 1, "svgOrigin": "0 -66"}, {"scaleY": 0.1, "duration": 0.1, "yoyo": True, "repeat": 1}, t.L(2) + 1.6)
    t.ft(f"#{p}-d-head", {"rotation": 0, "svgOrigin": "0 30"}, {"rotation": 8, "duration": 0.8, "ease": "power2.inOut", "yoyo": True, "repeat": 1, "repeatDelay": 1.2}, t.L(2) + 0.5)
    # the stream snores
    t.ft(f"#{p}-zz", {"opacity": 0, "y": 10}, {"opacity": 1, "y": -20, "duration": 1.2, "ease": "sine.out", "yoyo": True, "repeat": 1}, t.L(3) + 0.3)
    # the dew
    t.ft(f".{p}-dew", {"scale": 0.7}, {"scale": 1.15, "duration": 0.6, "ease": "sine.inOut", "yoyo": True, "repeat": 3, "stagger": 0.15}, t.L(4))
    # tiptoe: arms up a little for balance, eyes look down
    t.ft(f"#{p}-d-eyes", {"y": 0}, {"y": 3, "duration": 0.5}, slow_at)
    t.dip_out(sid)
    write(sid, "\n".join(body), t)


# ------------------------------------------------------------------ s04 the lost firefly
def s04():
    sid, p = "s04-firefly", "s04"
    t = TL(sid)
    body = [f'<g id="{p}-cam"><rect x="-200" y="-200" width="2320" height="1480" fill="{C["sky"]}"/>',
            stars(41, 30, 0, 0, 1920, 400, f"{p}-stars")]
    body.append(paper(f'<path d="{ridge(42, 520, 30, -200, 2200, 60, 1300)}"/>', C["far"], sh=6))
    # far oak, where the light fell
    body.append(f'<g transform="translate(1700,620)">' + round_tree(0, 0, 300, "#1f4440") + '<ellipse cx="0" cy="-70" rx="14" ry="20" fill="#0d1612"/></g>')
    body.append(paper(f'<path d="{ridge(43, 760, 20, -200, 2200, 60, 1300)}"/>', C["mid"], sh=6))
    body.append(bear(f"{p}-d", 560, 1180, 2.1))
    for k in range(26):
        x = -100 + k * 85 + (k * 37 % 30)
        h = 220 + (k * 71 % 180)
        if 200 < x < 900:
            h = min(h, 150)
        col = "#2a4b33" if k % 2 else "#335a3b"
        body.append(paper(f'<path d="M{x} 1100 Q{x+20} {1100-h*0.6} {x+60+(k%3)*20} {1100-h} Q{x+30} {1100-h*0.5} {x+40} 1100 Z"/>', col, sh=5))
    body.append(firefly(f"{p}-ff", 1300, 520, 2.4))
    body.append(f'<path id="{p}-trail" d="M1300 520 Q1500 420 1690 540" stroke="{C["amber"]}" stroke-width="6" stroke-dasharray="4 18" stroke-linecap="round" fill="none" opacity="0"/>')
    body.append("</g>")
    cam = Cam(t, f"#{p}-cam", 960, 540, 1.0)
    t.dip_in(sid)
    # lost: wandering loops
    pts = [(0, 0), (-160, 80), (-40, 180), (120, 60), (-60, -40), (-300, 40)]
    at = 0.3
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        t.ft(f"#{p}-ff", {"x": x0, "y": y0}, {"x": x1, "y": y1, "duration": 1.1, "ease": "sine.inOut"}, at)
        at += 1.1
    t.ft(f"#{p}-ff-wings", {"scaleY": 1, "svgOrigin": "0 -8"}, {"scaleY": 0.4, "duration": 0.06, "yoyo": True, "repeat": 141}, 0)
    t.ft(f"#{p}-d-head", {"rotation": 0, "svgOrigin": "0 30"}, {"rotation": 12, "duration": 1.0, "ease": "power2.inOut"}, 1.5)
    t.blink(f"{p}-d", [2.8, 6.5])
    # it speaks, its light pulsing, then flies to the old oak
    t.ft(f"#{p}-ff", {"scale": 1}, {"scale": 1.12, "duration": 0.3, "ease": "sine.inOut", "yoyo": True, "repeat": 7}, t.L(1))
    fx = t.L(1, True) - 0.6
    t.ft(f"#{p}-ff", {"x": -300, "y": 40}, {"x": 390, "y": 20, "duration": 2.0, "ease": "power2.inOut"}, fx)
    t.ft(f"#{p}-trail", {"opacity": 0}, {"opacity": 0.9, "duration": 0.6}, fx + 0.4)
    t.ft(f"#{p}-d-head", {"rotation": 12, "svgOrigin": "0 30"}, {"rotation": -4, "duration": 1.0, "ease": "power2.inOut"}, fx + 0.4)
    cam.to(fx, 1200, 560, 1.1, 2.2)
    t.dip_out(sid)
    write(sid, "\n".join(body), t)


# ------------------------------------------------------------------ s05 the oak hollow
def s05():
    sid, p = "s05-hollow", "s05"
    t = TL(sid)
    shard = f'<g id="{p}-shard" opacity="0" transform="translate(0,60)"><path d="M0 -26 L16 -4 L6 20 L-14 10 L-12 -12 Z" fill="{C["moon"]}"/></g>'
    held = shard + candy(f"{p}-candy", 0, 64, 0.62, op=0)
    body = [f'<g id="{p}-cam"><rect x="-300" y="-300" width="2520" height="1680" fill="{C["sky"]}"/>',
            stars(51, 40, -200, -200, 2100, 500, f"{p}-stars")]
    body.append(paper(f'<path d="{ridge(52, 700, 30, -300, 2300, 60, 1400)}"/>', C["far"], sh=6))
    # the old oak: a huge trunk
    body.append(paper('<path d="M760 1200 Q820 900 800 560 Q760 300 640 120 L1640 120 Q1500 320 1480 600 Q1470 900 1560 1200 Z"/>', "#4a3a30", sh=12))
    for k in range(9):
        x = 830 + k * 80
        body.append(f'<path d="M{x} 1150 Q{x+20} 800 {x-10} 300" stroke="#3a2c24" stroke-width="7" fill="none"/>')
    body.append(paper('<circle cx="900" cy="150" r="260"/>', "#1f4440", sh=10))
    body.append(paper('<circle cx="1300" cy="80" r="300"/>', "#24504a", sh=10))
    body.append(paper('<circle cx="1600" cy="180" r="220"/>', "#1f4440", sh=10))
    body.append('<ellipse cx="1080" cy="760" rx="110" ry="150" fill="#5c4738"/>')
    body.append('<ellipse cx="1080" cy="770" rx="88" ry="128" fill="#0d1612"/>')
    body.append(f'<ellipse id="{p}-inner" cx="1070" cy="800" rx="40" ry="40" fill="{C["light"]}" opacity="0"/>')
    body.append(paper(f'<path d="{ridge(53, 1040, 8, -300, 2300, 60, 1400)}"/>', C["grass"], sh=6))
    body.append(bear(f"{p}-d", 900, 1080, 1.9).replace(f'<g id="{p}-d-armR">', f'<g id="{p}-d-armR">', 1))
    # put the shard and candy in Doudou's right paw (inside the arm group, so they move with it)
    body[-1] = body[-1].replace(f'<g id="{p}-d-armR">', f'<g id="{p}-d-armR">{held}', 1)
    # scent curls, a chestnut and a folded blanket
    body.append(f'<path id="{p}-curl1" d="M900 700 q-30 -40 0 -80 t0 -80" stroke="{C["light"]}" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="200" stroke-dashoffset="200"/>')
    body.append(f'<path id="{p}-curl2" d="M950 690 q30 -40 0 -80 t0 -80" stroke="{C["light"]}" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="200" stroke-dashoffset="200"/>')
    body.append(f'<g transform="translate(860,500)"><g id="{p}-nut" opacity="0"><path d="M0 -26 Q26 -20 24 6 Q12 26 0 26 Q-12 26 -24 6 Q-26 -20 0 -26 Z" fill="#8a4f2a"/><path d="M-22 8 Q0 18 22 8 L22 14 Q0 30 -22 14 Z" fill="#d9b48a"/></g></g>')
    body.append(f'<g transform="translate(990,490)"><g id="{p}-blk" opacity="0"><rect x="-34" y="-20" width="68" height="40" rx="8" fill="#c96f5d"/><rect x="-34" y="-6" width="68" height="8" fill="#e8a88e"/></g></g>')
    body.append("</g>")
    cam = Cam(t, f"#{p}-cam", 1100, 600, 0.9)
    t.dip_in(sid)
    cam.to(0.2, 1020, 760, 1.25, 3.5)
    # reach inside
    t.ft(f"#{p}-d-armR", {"rotation": 0, "svgOrigin": "0 0"}, {"rotation": -128, "duration": 1.3, "ease": "power2.inOut"}, t.L(1) - 0.2)
    t.ft(f"#{p}-d-head", {"rotation": 0, "svgOrigin": "0 30"}, {"rotation": 10, "duration": 0.8}, t.L(1) - 0.2)
    t.ft(f"#{p}-d-heart", {"opacity": 0}, {"opacity": 1, "duration": 0.2}, t.L(1) + 0.8)
    t.ft(f"#{p}-d-heart", {"scale": 1, "svgOrigin": "0 -86"}, {"scale": 1.35, "duration": 0.18, "ease": "power2.out", "yoyo": True, "repeat": 9}, t.L(1) + 0.8)
    t.ft(f"#{p}-d-heart", {"opacity": 1}, {"opacity": 0, "duration": 0.4}, t.L(2) + 1.6)
    # something warm: moonlight
    t.ft(f"#{p}-inner", {"opacity": 0, "scale": 0.5, "svgOrigin": "1070 800"}, {"opacity": 0.9, "scale": 1.4, "duration": 1.2, "ease": "power2.out"}, t.L(2) + 0.6)
    t.ft(f"#{p}-shard", {"opacity": 0}, {"opacity": 1, "duration": 0.3}, t.L(2) + 2.4)
    t.ft(f"#{p}-inner", {"opacity": 0.9}, {"opacity": 0, "duration": 0.6}, t.L(2) + 2.6)
    t.ft(f"#{p}-d-armR", {"rotation": -128, "svgOrigin": "0 0"}, {"rotation": -40, "duration": 1.4, "ease": "power2.inOut"}, t.L(2) + 2.6)
    t.ft(f"#{p}-d-mouth", {"scaleY": 1, "svgOrigin": "0 24"}, {"scaleY": 1.5, "duration": 0.4}, t.L(2) + 3.2)
    # it becomes a moon candy
    t.ft(f"#{p}-shard", {"opacity": 1, "scale": 1, "rotation": 0, "svgOrigin": "0 60"}, {"opacity": 0, "scale": 0.3, "rotation": 120, "duration": 1.2, "ease": "power2.in"}, t.L(3) + 0.8)
    t.ft(f"#{p}-candy", {"opacity": 0, "scale": 0.2, "svgOrigin": "0 0"}, {"opacity": 1, "scale": 1, "duration": 1.6, "ease": "back.out(1.4)"}, t.L(3) + 1.6)
    # to the nose: a sniff, chestnuts and sun-dried blankets
    cam.to(t.L(4) - 0.3, 920, 760, 1.45, 2.4)
    t.ft(f"#{p}-d-armR", {"rotation": -40, "svgOrigin": "0 0"}, {"rotation": 122, "duration": 1.6, "ease": "power2.inOut"}, t.L(4) + 0.4)
    t.eyes_close(f"{p}-d", t.L(4) + 1.8)
    t.ft(f"#{p}-d-head", {"rotation": 10, "y": 0, "svgOrigin": "0 30"}, {"rotation": -6, "y": -6, "duration": 0.5, "ease": "sine.inOut", "yoyo": True, "repeat": 3}, t.L(4) + 2.0)
    for i in (1, 2):
        t.ft(f"#{p}-curl{i}", {"strokeDashoffset": 200, "opacity": 1}, {"strokeDashoffset": 0, "duration": 1.6, "ease": "power1.out"}, t.L(4) + 2.4 + i * 0.3)
    t.ft(f"#{p}-nut", {"opacity": 0, "y": 20}, {"opacity": 1, "y": 0, "duration": 0.8, "ease": "power2.out"}, t.L(4) + 3.4)
    t.ft(f"#{p}-blk", {"opacity": 0, "y": 20}, {"opacity": 1, "y": 0, "duration": 0.8, "ease": "power2.out"}, t.L(4) + 4.6)
    t.dip_out(sid)
    write(sid, "\n".join(body), t)


# ------------------------------------------------------------------ s06 back at the lake
def s06():
    sid, p = "s06-lake", "s06"
    t = TL(sid)
    held = candy(f"{p}-hc", 0, 64, 0.62)
    body = [f'<rect x="0" y="0" width="1920" height="1080" fill="{C["sky"]}"/>', stars(61, 50, 0, 0, 1920, 600, f"{p}-stars")]
    # moon with both mouths (sad, then a smile)
    body.append(moon(f"{p}-m", 1300, 230, 130, bite=True, face="sad").replace(
        f'<path id="{p}-m-mmouth"',
        f'<path id="{p}-m-msmile" d="M-26 29 Q0 52 26 29" stroke="#5a4a3a" stroke-width="5.9" fill="none" stroke-linecap="round" opacity="0"/><path id="{p}-m-mmouth"', 1))
    body.append(paper(f'<path d="{ridge(62, 640, 30, -100, 2020, 60, 760)}"/>', C["far"], sh=6))
    for i, x in enumerate(range(900, 2000, 70)):
        body.append(pine(x, 700, 120 + (i * 31 % 50), "#24504a"))
    body.append('<rect x="0" y="690" width="1920" height="390" fill="#2b4e66"/>')
    body.append(f'<g id="{p}-refl"><ellipse cx="1300" cy="820" rx="110" ry="26" fill="{C["light"]}" opacity="0.35"/>'
                + "".join(f'<rect x="{1200+k*30}" y="{860+k*22}" width="{200-k*40}" height="6" rx="3" fill="{C["light"]}" opacity="0.3"/>' for k in range(4)) + "</g>")
    body.append(paper('<path d="M-100 1080 L-100 820 Q200 780 520 830 Q760 870 860 1080 Z"/>', C["grass"], sh=8))
    body.append(bear(f"{p}-d", 520, 900, 1.3).replace(f'<g id="{p}-d-armR">', f'<g id="{p}-d-armR">{held}', 1))
    body.append(candy(f"{p}-fc", 569, 633, 0.81, op=0))
    t.dip_in(sid)
    # walk in
    t.ft(f"#{p}-d-bear", {"x": -520}, {"x": 0, "duration": 3.0, "ease": "power2.out"}, 0.2)
    t.ft(f"#{p}-d-bear", {"y": 0}, {"y": -9, "duration": 0.3, "ease": "sine.inOut", "yoyo": True, "repeat": 7}, 0.2)
    t.ft(f"#{p}-d-legL", {"rotation": -14, "svgOrigin": "0 0"}, {"rotation": 14, "duration": 0.3, "yoyo": True, "repeat": 7}, 0.2)
    t.ft(f"#{p}-d-legR", {"rotation": 14, "svgOrigin": "0 0"}, {"rotation": -14, "duration": 0.3, "yoyo": True, "repeat": 7}, 0.2)
    t.ft(f"#{p}-d-armR", {"rotation": -30, "svgOrigin": "0 0"}, {"rotation": -30, "duration": 0.01}, 0)
    # hold it up; the moon leans down and smiles
    t.ft(f"#{p}-d-armR", {"rotation": -30, "svgOrigin": "0 0"}, {"rotation": 170, "duration": 1.2, "ease": "power2.inOut"}, t.L(1))
    t.ft(f"#{p}-d-head", {"rotation": 0, "svgOrigin": "0 30"}, {"rotation": 12, "duration": 1.0}, t.L(1) + 0.2)
    t.ft(f"#{p}-m-moon", {"x": 0, "y": 0, "scale": 1, "svgOrigin": "0 0"}, {"x": 0, "y": 180, "scale": 1.25, "duration": 2.4, "ease": "power2.inOut"}, t.L(1) + 0.4)
    t.ft(f"#{p}-m-mmouth", {"opacity": 1}, {"opacity": 0, "duration": 0.4}, t.L(1) + 2.0)
    t.ft(f"#{p}-m-msmile", {"opacity": 0}, {"opacity": 1, "duration": 0.4}, t.L(1) + 2.1)
    t.ft(f"#{p}-m-meyesc", {"opacity": 1}, {"opacity": 0, "duration": 0.3}, t.L(1) + 2.2)
    t.ft(f"#{p}-m-meyes", {"opacity": 0}, {"opacity": 1, "duration": 0.3}, t.L(1) + 2.3)
    t.ft(f"#{p}-refl", {"y": 0, "scaleX": 1, "svgOrigin": "1300 820"}, {"y": 20, "scaleX": 1.25, "duration": 2.4, "ease": "power2.inOut"}, t.L(1) + 0.4)
    # the candy rises into the missing corner
    up = t.L(2)
    t.set(f"#{p}-hc", {"opacity": 0}, up)
    t.set(f"#{p}-fc", {"opacity": 1}, up)
    t.ft(f"#{p}-fc", {"x": 0, "y": 0, "scale": 1, "svgOrigin": "0 0"}, {"x": 1427 - 569, "y": 309 - 633, "scale": 2.4, "duration": 3.4, "ease": "power2.inOut"}, up)
    t.ft(f"#{p}-fc", {"rotation": 0}, {"rotation": 360, "duration": 3.4, "ease": "power1.inOut"}, up)
    t.ft(f"#{p}-d-armR", {"rotation": 170, "svgOrigin": "0 0"}, {"rotation": 0, "duration": 1.4, "ease": "power2.inOut"}, up + 1.0)
    t.blink(f"{p}-d", [1.5, up + 2.6])
    t.ft(f"#{p}-fc", {"scale": 2.4}, {"scale": 2.6, "duration": 0.8, "ease": "sine.inOut", "yoyo": True, "repeat": 3}, t.L(3))
    t.dip_out(sid)
    write(sid, "\n".join(body), t)


# ------------------------------------------------------------------ s07 round again; the gift
def s07():
    sid, p = "s07-gift", "s07"
    t = TL(sid)
    R = 200
    body = [f'<rect x="0" y="0" width="1920" height="1080" fill="{C["sky"]}"/>', stars(71, 60, 0, 0, 1920, 760, f"{p}-stars")]
    body.append(moon(f"{p}-m", 960, 330, R, bite=True, face="smile"))
    body.append(candy(f"{p}-c", 960 + R * 0.78, 330 - R * 0.62, 2.8))
    body.append(f'<g id="{p}-ribbon" opacity="0"><path d="M880 520 Q820 650 900 760 Q960 840 940 900 L1010 900 Q1040 830 990 750 Q920 650 1040 520 Z" fill="{C["light"]}" opacity="0.8"/></g>')
    body.append(paper(f'<path d="{ridge(72, 900, 16, -100, 2020, 60, 1100)}"/>', C["grass"], sh=6))
    for i, x in enumerate(list(range(0, 600, 80)) + list(range(1340, 1960, 80))):
        body.append(pine(x, 910, 200 + (i * 37 % 90), C["near"]))
    body.append(bear(f"{p}-d", 960, 1040, 1.35))
    t.dip_in(sid)
    # the moon becomes round again
    t.ft(f"#{p}-c", {"scale": 1, "opacity": 1, "svgOrigin": "0 0"}, {"scale": 0.3, "opacity": 0, "duration": 1.2, "ease": "power2.in"}, t.L(0) + 0.3)
    t.ft(f"#{p}-m-bite", {"attr": {"r": R * 0.42}}, {"attr": {"r": 0}, "duration": 1.6, "ease": "power2.inOut"}, t.L(0) + 0.6)
    t.ft(f"#{p}-m-moon", {"scale": 1, "svgOrigin": "0 0"}, {"scale": 1.06, "duration": 0.6, "ease": "sine.inOut", "yoyo": True, "repeat": 1}, t.L(0) + 1.8)
    # light pours down
    t.ft(f"#{p}-ribbon", {"opacity": 0, "scaleY": 0.1, "svgOrigin": "960 520"}, {"opacity": 1, "scaleY": 1, "duration": 2.2, "ease": "power2.out"}, t.L(1) + 0.3)
    t.ft(f"#{p}-d-head", {"rotation": 0, "svgOrigin": "0 30"}, {"rotation": -8, "y": -4, "duration": 1.0}, t.L(1) + 0.5)
    t.talk(f"#{p}-m-mmouth", t.L(2), t.L(2, True), f"0 {R*0.3:.0f}", amt=1.4)
    t.blink(f"{p}-d", [t.L(2) + 1.5, t.L(2) + 4.5])
    # it wraps his shoulders like a scarf
    t.ft(f"#{p}-ribbon", {"opacity": 1, "scaleX": 1, "svgOrigin": "960 900"}, {"opacity": 0, "scaleX": 0.2, "duration": 1.4, "ease": "power2.in"}, t.L(3))
    t.ft(f"#{p}-d-scarf", {"opacity": 0, "scale": 1.4, "svgOrigin": "0 -110"}, {"opacity": 1, "scale": 1, "duration": 1.4, "ease": "power3.out"}, t.L(3) + 0.8)
    t.eyes_close(f"{p}-d", t.L(3) + 2.2)
    t.ft(f"#{p}-d-armL", {"rotation": 0, "svgOrigin": "0 0"}, {"rotation": 130, "duration": 1.0, "ease": "power2.inOut"}, t.L(3) + 2.0)
    t.dip_out(sid)
    write(sid, "\n".join(body), t)


# ------------------------------------------------------------------ s08 the warm pillow
def s08():
    sid, p = "s08-pillow", "s08"
    t = TL(sid)
    body = f'<g id="{p}-cam">{bedroom(p, "night", moon_face="sleep", bite=False)}</g>'
    cam = Cam(t, f"#{p}-cam", 960, 540, 1.0)
    t.dip_in(sid)
    t.ft(f"#{p}-quilt", {"y": 70}, {"y": 0, "duration": 1.6, "ease": "power2.out"}, t.L(0) + 1.0)
    t.ft(f"#{p}-slips", {"opacity": 0}, {"opacity": 1, "duration": 0.4}, t.L(0) + 0.5)
    cam.to(t.L(1) - 0.5, 640, 640, 1.5, 3.0)
    t.ft(f"#{p}-pglow", {"opacity": 0}, {"opacity": 1, "duration": 1.6, "ease": "power1.inOut"}, t.L(1) + 0.4)
    t.blink(p, [1.2, t.L(1) + 2.4])
    cam.to(t.L(2) - 0.4, 980, 520, 1.05, 3.4)
    end = t.slot
    t.breathe(f"#{p}-quilt", t.L(2), end, origin="760 800", amt=0.04, period=3.2)
    t.breathe(f"#{p}-m-moon", t.L(2), end, origin="0 0", amt=0.05, period=3.2, prop="scale")
    t.eyes_close(p, t.L(2) + 3.4, 1.2)
    t.dip_out(sid)
    write(sid, body, t)


# ------------------------------------------------------------------ s09 the moon boat dream
def s09():
    sid, p = "s09-dream", "s09"
    t = TL(sid)
    dream_sky = "#33557a"
    body = [f'<g id="{p}-cam"><rect x="-400" y="-400" width="2720" height="2200" fill="{dream_sky}"/>',
            stars(91, 80, -300, -300, 2200, 700, f"{p}-stars")]
    body.append(cloud(300, 200, 1.4, "#4a6b8e"))
    body.append(cloud(1600, 320, 1.8, "#4a6b8e"))
    # the forest far below
    body.append(paper(f'<path d="{ridge(92, 860, 30, -400, 2400, 60, 1700)}"/>', C["mid"], sh=6))
    for i, x in enumerate(range(-300, 2300, 70)):
        body.append(pine(x, 930 + (i % 2) * 10, 130 + (i * 29 % 50), "#28504f"))
    body.append(paper(f'<path d="{ridge(93, 1000, 10, -400, 2400, 60, 1700)}"/>', C["grass"], sh=6))
    # sleeping friends, each with a little moon dreaming above
    friends = [(rabbit, 640, 1300), (squirrel, 960, 1300), (bird, 1280, 1290)]
    body.append(paper('<path d="M-400 1700 L-400 1240 Q960 1180 2400 1240 L2400 1700 Z"/>', "#2f4f37", sh=8))
    body.append(paper('<ellipse cx="640" cy="1310" rx="140" ry="50"/>', "#3c2e26", sh=4))
    body.append(paper('<rect x="900" y="1060" width="120" height="260" rx="20"/>', "#5c4738", sh=6))
    body.append(paper('<path d="M1200 1300 Q1280 1340 1360 1300 L1350 1280 L1210 1280 Z"/>', "#8a6a45", sh=4))
    for k, (fn, x, y) in enumerate(friends):
        body.append(fn(x, y, 1.3))
        body.append(f'<g transform="translate({x+20},{y-170})"><g id="{p}-dm{k}" opacity="0">'
                    f'<circle r="44" fill="#e7e2d6" opacity="0.9"/><path d="M-6 -24 a24 24 0 1 0 20 40 a18 18 0 1 1 -20 -40 Z" fill="{C["moon"]}"/></g></g>')
    # the moon boat with Doudou asleep in it
    boat = (f'<g transform="translate(0,0)"><g id="{p}-boat">'
            + paper('<path d="M-240 -40 Q-200 120 0 130 Q200 120 240 -40 Q150 50 0 50 Q-150 50 -240 -40 Z"/>', C["moon"], sh=8)
            + f'<g transform="translate(-50,-10) scale(0.95)"><g id="{p}-bh">{bear_head(p + "-b")}</g></g>'
            + paper('<path d="M-10 30 Q80 -30 200 20 Q120 50 -10 30 Z"/>', "#c96f5d", sh=4)
            + "</g></g>")
    body.append(f'<g transform="translate(700,520) scale(1.45)"><g id="{p}-sail">{boat}</g></g>')
    body.append(cloud(1800, 430, 0.9, "#e7e2d6", f"{p}-blanket"))
    for k in range(5):
        body.append(firefly(f"{p}-f{k}", 1180 + k * 70, 420 + (k % 2) * 60, 0.8))
    body.append("</g>")
    cam = Cam(t, f"#{p}-cam", 820, 460, 1.15)
    t.dip_in(sid, 1.4)
    # asleep from the start
    t.set(f"#{p}-b-eyes", {"opacity": 0}, 0)
    t.set(f"#{p}-b-eyesc", {"opacity": 1}, 0)
    D = t.slot
    t.ft(f"#{p}-sail", {"x": -500}, {"x": 520, "duration": D, "ease": "none"}, 0)
    t.ft(f"#{p}-boat", {"rotation": -3, "y": 0, "svgOrigin": "0 0"}, {"rotation": 3, "y": 12, "duration": 2.2, "ease": "sine.inOut", "yoyo": True, "repeat": int(D / 2.2) - 1}, 0)
    cam.to(1.0, 1080, 470, 1.0, max(3, t.L(2) - 1.0))
    for k in range(5):
        t.ft(f"#{p}-f{k}", {"x": 0, "y": 0}, {"x": 320 + k * 40, "y": -30 + (k % 3) * 20, "duration": 6.0, "ease": "sine.inOut"}, t.L(2) + k * 0.2)
    t.ft(f"#{p}-blanket", {"x": 0, "y": 0}, {"x": -480, "y": 40, "duration": 3.4, "ease": "power2.inOut"}, t.L(2) + 2.2)
    cam.to(t.L(3) - 0.4, 960, 1180, 1.75, 3.6)
    for k in range(3):
        t.ft(f"#{p}-dm{k}", {"opacity": 0, "scale": 0.4, "svgOrigin": "0 0"}, {"opacity": 1, "scale": 1, "duration": 0.9, "ease": "back.out(1.6)"}, t.L(3) + 1.4 + k * 1.3)
    t.dip_out(sid)
    write(sid, "\n".join(body), t)


# ------------------------------------------------------------------ s10 the moon's words
def s10():
    sid, p = "s10-words", "s10"
    t = TL(sid)
    R = 300
    body = [f'<rect x="0" y="0" width="1920" height="1080" fill="#30507a"/>', stars(101, 70, 0, 0, 1920, 1080, f"{p}-stars")]
    body.append(moon(f"{p}-m", 960, 470, R, bite=False, face="sleep"))
    # what was not finished: a block tower
    body.append(f'<g transform="translate(330,850)"><g id="{p}-tower" opacity="0">'
                + paper('<rect x="-60" y="-60" width="120" height="60" rx="8"/>', "#c96f5d", sh=4)
                + paper('<rect x="-50" y="-120" width="80" height="60" rx="8"/>', "#8fa9d0", sh=4)
                + f'<g transform="rotate(18 40 -150)">' + paper('<rect x="10" y="-170" width="60" height="50" rx="8"/>', C["amber"], sh=4) + "</g></g></g>")
    body.append(cloud(330, 820, 1.4, "#e7e2d6", f"{p}-c1"))
    # what was not said: a speech bubble with three dots
    body.append(f'<g transform="translate(1590,830)"><g id="{p}-bubble" opacity="0">'
                + paper('<path d="M-110 -70 Q-110 -110 -70 -110 L70 -110 Q110 -110 110 -70 L110 -10 Q110 30 70 30 L-20 30 L-60 70 L-50 30 L-70 30 Q-110 30 -110 -10 Z"/>', "#e7e2d6", sh=5)
                + "".join(f'<circle cx="{-40+k*40}" cy="-40" r="11" fill="#5a4a3a"/>' for k in range(3)) + "</g></g>")
    body.append(cloud(1590, 820, 1.4, "#e7e2d6", f"{p}-c2"))
    body.append(f'<g transform="translate(960,1000)"><g id="{p}-dh">{bear_head(p + "-d")}</g></g>')
    t.dip_in(sid)
    t.ft(f"#{p}-m-moon", {"scale": 0.92, "svgOrigin": "0 0"}, {"scale": 1.0, "duration": 4.0, "ease": "power2.out"}, 0)
    for i in (1, 2, 3):
        t.talk(f"#{p}-m-mmouth", t.L(i), t.L(i, True), f"0 {R*0.28:.0f}", amt=1.5, beat=0.2)
    # tomorrow can wait
    t.ft(f"#{p}-tower", {"opacity": 0, "y": 30}, {"opacity": 1, "y": 0, "duration": 0.8, "ease": "power3.out"}, t.L(1) + 0.2)
    t.ft(f"#{p}-c1", {"x": -500, "opacity": 0}, {"x": 0, "opacity": 1, "duration": 1.8, "ease": "power2.inOut"}, t.L(1, True) - 1.4)
    # a dream can wait
    t.ft(f"#{p}-bubble", {"opacity": 0, "y": 30}, {"opacity": 1, "y": 0, "duration": 0.8, "ease": "power3.out"}, t.L(2) + 0.2)
    t.ft(f"#{p}-c2", {"x": 500, "opacity": 0}, {"x": 0, "opacity": 1, "duration": 1.8, "ease": "power2.inOut"}, t.L(2, True) - 1.4)
    # give the rest to the night
    t.blink(f"{p}-d", [1.2, 4.6])
    t.eyes_close(f"{p}-d", t.L(3) + 1.0, 1.4)
    t.ft(f".{p}-stars-s", {"opacity": 0.8}, {"opacity": 0.3, "duration": 2.4, "stagger": 0.02}, t.L(3) + 0.6)
    t.dip_out(sid)
    write(sid, "\n".join(body), t)


# ------------------------------------------------------------------ s11 turning into moonlight
def s11():
    sid, p = "s11-drift", "s11"
    t = TL(sid)
    body = [f'<g id="{p}-cam"><rect x="-200" y="-200" width="3200" height="1480" fill="{C["sky"]}"/>',
            stars(111, 60, -100, -100, 3000, 300, f"{p}-stars")]
    body.append(moon(f"{p}-m", 2300, 150, 110, bite=False, face="sleep"))
    body.append(paper(f'<path d="{ridge(112, 420, 30, -200, 3100, 60, 1400)}"/>', C["far"], sh=6))
    # treetops in rows
    for row, (y, col) in enumerate(((520, "#28504f"), (640, "#1f4440"))):
        for k in range(26):
            x = -150 + k * 120 + row * 60
            body.append(paper(f'<circle cx="{x}" cy="{y + (k*37 % 30)}" r="{80 + (k*13 % 30)}"/>', col, sh=6))
    # the lake
    body.append(paper('<ellipse cx="1500" cy="860" rx="520" ry="120"/>', "#2b4e66", sh=4))
    body.append(f'<ellipse cx="1500" cy="850" rx="70" ry="18" fill="{C["light"]}" opacity="0.4"/>')
    body.append(paper(f'<path d="M-200 1280 L-200 900 Q400 880 900 960 Q1500 1080 2100 950 Q2600 880 3100 920 L3100 1280 Z"/>', C["grass"], sh=8))
    # sleeping homes with dream bubbles
    homes = [(700, 1010), (2240, 1000), (2700, 1010)]
    for k, (x, y) in enumerate(homes):
        body.append(paper(f'<ellipse cx="{x}" cy="{y}" rx="90" ry="40"/>', "#3c2e26", sh=4))
        body.append(f'<g transform="translate({x+60},{y-110})"><g id="{p}-db{k}" opacity="0"><circle r="50" fill="#e7e2d6" opacity="0.9"/>'
                    f'<path d="M-6 -24 a24 24 0 1 0 20 40 a18 18 0 1 1 -20 -40 Z" fill="{C["moon"]}"/></g></g>')
    # the ribbon of moonlight
    body.append(f'<path id="{p}-rib" d="M80 160 Q400 420 700 470 T1300 600 Q1500 780 1500 850 Q1700 980 2240 900 T2760 900" '
                f'stroke="{C["light"]}" stroke-width="34" fill="none" stroke-linecap="round" opacity="0.85" stroke-dasharray="4200" stroke-dashoffset="4200"/>')
    body.append(f'<g transform="translate(110,150) scale(0.9)"><g id="{p}-dh">{bear_head(p + "-d")}</g></g>')
    body.append("</g>")
    cam = Cam(t, f"#{p}-cam", 500, 420, 1.3)
    t.dip_in(sid, 1.2)
    t.set(f"#{p}-d-eyes", {"opacity": 0}, 0)
    t.set(f"#{p}-d-eyesc", {"opacity": 1}, 0)
    t.breathe(f"#{p}-dh", 0.5, t.L(1), origin="0 40", amt=0.05, period=3.4, prop="scale")
    t.ft(f"#{p}-dh", {"opacity": 1}, {"opacity": 0.0, "duration": 2.0}, t.L(1) + 0.4)
    t.ft(f"#{p}-rib", {"strokeDashoffset": 4200}, {"strokeDashoffset": 0, "duration": t.L(1, True) - t.L(1) + 0.8, "ease": "power1.inOut"}, t.L(1))
    cam.to(t.L(1), 1700, 640, 0.75, t.L(1, True) - t.L(1) + 0.8, "power1.inOut")
    for k in range(3):
        t.ft(f"#{p}-db{k}", {"opacity": 0, "scale": 0.4, "svgOrigin": "0 0"}, {"opacity": 1, "scale": 1, "duration": 0.9, "ease": "back.out(1.6)"}, t.L(1) + 4.2 + k * 1.6)
    t.dip_out(sid)
    write(sid, "\n".join(body), t)


# ------------------------------------------------------------------ s12 morning
def s12():
    sid, p = "s12-morning", "s12"
    t = TL(sid)
    body = f'<g id="{p}-cam">{bedroom(p, "morning", patch=True)}' + "".join(
        f'<g transform="translate({1450+k*40},{240-k*20})"><g id="{p}-n{k}" opacity="0"><circle cx="0" cy="18" r="9" fill="#5a4a3a"/>'
        f'<rect x="7" y="-20" width="4" height="38" fill="#5a4a3a"/><path d="M7 -20 q14 6 16 18" stroke="#5a4a3a" stroke-width="4" fill="none"/></g></g>'
        for k in range(3)) + f'<rect id="{p}-night" x="-400" y="-400" width="2720" height="1880" fill="#1a2c40"/></g>'
    cam = Cam(t, f"#{p}-cam", 600, 640, 1.4)
    t.set(f"#{p}-eyes", {"opacity": 0}, 0)
    t.set(f"#{p}-eyesc", {"opacity": 1}, 0)
    # colour flood: night gives way to morning
    t.ft(f"#{p}-night", {"opacity": 0.92}, {"opacity": 0, "duration": 2.0, "ease": "power2.inOut"}, 0.1)
    t.ft(f"#{p}-sun", {"y": 90}, {"y": -40, "duration": 6.0, "ease": "power2.out"}, 0.3)
    t.eyes_open(p, 1.6)
    t.blink(p, [2.6, 3.0])
    t.ft(f"#{p}-head", {"rotation": 0, "y": 0, "svgOrigin": "0 40"}, {"rotation": 14, "y": -14, "duration": 1.0, "ease": "power2.inOut"}, t.L(0) + 2.4)
    t.ft(f"#{p}-patch", {"opacity": 0, "scale": 0.5, "svgOrigin": "0 0"}, {"opacity": 1, "scale": 1, "duration": 1.0, "ease": "back.out(1.6)"}, t.L(0) + 3.4)
    t.ft(f"#{p}-eyes", {"x": 0, "y": 0}, {"x": 5, "y": 3, "duration": 0.4}, t.L(0) + 3.6)
    # the forest wakes: a bird sings, a squirrel stretches
    cam.to(t.L(1) - 0.3, 1420, 400, 1.7, 3.0)
    for k in range(3):
        t.ft(f"#{p}-n{k}", {"opacity": 0, "y": 20}, {"opacity": 1, "y": -30, "duration": 1.2, "ease": "power2.out"}, t.L(2) + 0.2 + k * 0.45)
        t.ft(f"#{p}-n{k}", {"opacity": 1}, {"opacity": 0, "duration": 0.6}, t.L(2) + 1.6 + k * 0.45)
    t.ft(f"#{p}-bird", {"rotation": 0, "svgOrigin": "0 -20"}, {"rotation": -12, "duration": 0.3, "yoyo": True, "repeat": 5}, t.L(2) + 0.2)
    t.ft(f"#{p}-sq", {"scaleY": 1, "scaleX": 1, "svgOrigin": "0 0"}, {"scaleY": 1.25, "scaleX": 0.9, "duration": 0.9, "ease": "sine.inOut", "yoyo": True, "repeat": 1}, t.L(2) + 2.6)
    # Doudou hugs his pillow and smiles
    cam.to(t.L(3) - 0.4, 600, 640, 1.4, 2.6)
    t.ft(f"#{p}-paws", {"x": 0, "y": 0}, {"x": -110, "y": 0, "duration": 1.2, "ease": "power2.inOut"}, t.L(3) + 0.4)
    t.ft(f"#{p}-head", {"rotation": 14, "y": -14, "svgOrigin": "0 40"}, {"rotation": 0, "y": 0, "duration": 1.0, "ease": "power2.inOut"}, t.L(3) + 0.5)
    t.ft(f"#{p}-mouth", {"scale": 1, "svgOrigin": "0 24"}, {"scale": 1.4, "duration": 0.6}, t.L(3) + 1.2)
    t.eyes_close(p, t.L(3) + 2.4)
    t.dip_out(sid)
    write(sid, body, t)


# ------------------------------------------------------------------ s13 afterwards
def s13():
    sid, p = "s13-after", "s13"
    t = TL(sid)
    body = (f'<g id="{p}-cam">{bedroom(p, "night", moon_face="smile", bite=False)}'
            f'<g transform="translate(560,470)"><g id="{p}-worry" opacity="0">'
            + paper('<path d="M-40 10 Q-48 -22 -14 -24 Q0 -46 24 -28 Q48 -26 42 4 Q40 18 20 18 L-26 18 Q-40 18 -40 10 Z"/>', "#9aa2a8", sh=4)
            + '<circle cx="-8" cy="-4" r="3" fill="#4a4a4a"/><circle cx="14" cy="-4" r="3" fill="#4a4a4a"/>'
            + f'<path id="{p}-wm" d="M-6 8 Q3 3 12 8" stroke="#4a4a4a" stroke-width="3" fill="none" stroke-linecap="round"/></g></g></g>')
    cam = Cam(t, f"#{p}-cam", 640, 620, 1.45)
    t.dip_in(sid)
    t.set(f"#{p}-m-moon", {"opacity": 0}, 0)
    t.blink(p, [1.4, 3.6, 6.2])
    t.ft(f"#{p}-eyes", {"y": 0}, {"y": -3, "duration": 0.6}, 0.8)
    # touch the pillow and remember the moon
    t.ft(f"#{p}-paws", {"x": 0, "y": 0}, {"x": -90, "y": 6, "duration": 1.2, "ease": "power2.inOut"}, t.L(1))
    t.ft(f"#{p}-pglow", {"opacity": 0}, {"opacity": 1, "duration": 1.2}, t.L(1) + 1.0)
    cam.to(t.L(1) + 1.6, 980, 520, 1.0, 3.0)
    t.ft(f"#{p}-m-moon", {"opacity": 0, "scale": 0.7, "svgOrigin": "0 0"}, {"opacity": 1, "scale": 1, "duration": 1.6, "ease": "power2.out"}, t.L(1) + 2.6)
    # close eyes, breathe slowly
    cam.to(t.L(2) - 0.3, 640, 620, 1.45, 2.6)
    t.eyes_close(p, t.L(2) + 0.4, 1.2)
    t.breathe(f"#{p}-quilt", t.L(2) + 0.5, t.slot, origin="760 800", amt=0.04, period=3.2)
    # the last little worry goes beside the pillow
    t.ft(f"#{p}-worry", {"opacity": 0, "x": -60, "y": 0}, {"opacity": 1, "x": -60, "y": -60, "duration": 1.0, "ease": "power2.out"}, t.L(3))
    t.ft(f"#{p}-worry", {"x": -60, "y": -60}, {"x": 150, "y": 140, "duration": 2.2, "ease": "power2.inOut"}, t.L(3) + 1.0)
    t.ft(f"#{p}-wm", {"attr": {"d": "M-6 8 Q3 3 12 8"}}, {"attr": {"d": "M-6 6 Q3 12 12 6"}, "duration": 0.6}, t.L(3) + 3.0)
    t.ft(f"#{p}-worry", {"opacity": 1}, {"opacity": 0.55, "duration": 1.0}, t.L(3) + 3.4)
    t.dip_out(sid)
    write(sid, body, t)


# ------------------------------------------------------------------ s14 goodnight
def s14():
    sid, p = "s14-goodnight", "s14"
    t = TL(sid)
    t.t = dict(t.t, slot=t.t["slot"] + END_HOLD)
    body = [f'<g id="{p}-cam"><rect x="-1000" y="-800" width="3920" height="2700" fill="{C["sky"]}"/>',
            stars(141, 120, -900, -700, 2800, 600, f"{p}-stars")]
    body.append(moon(f"{p}-m", 1500, 230, 120, bite=False, face="sleep"))
    body.append(paper(f'<path d="{ridge(142, 620, 40, -1000, 2900, 60, 1900)}"/>', C["far"], sh=6))
    body.append(paper(f'<path d="{ridge(143, 720, 30, -1000, 2900, 60, 1900)}"/>', C["mid"], sh=6))
    for i, x in enumerate(range(-900, 2900, 80)):
        if 120 < x < 820:
            continue
        body.append(pine(x, 820 + (i % 3) * 12, 180 + (i * 47 % 100), C["near"]))
    body.append(paper(f'<path d="{ridge(144, 840, 12, -1000, 2900, 80, 1900)}"/>', C["grass"], sh=6))
    body.append(paper('<path d="M220 880 L220 560 L470 400 L720 560 L720 880 Z"/>', "#8a6a55", sh=10))
    body.append(paper('<path d="M180 580 L470 370 L760 580 L730 600 L470 420 L210 600 Z"/>', "#5b3d33", sh=8))
    body.append('<rect x="400" y="640" width="140" height="130" fill="#2a1c18"/>')
    body.append(f'<rect id="{p}-lamp" x="400" y="640" width="140" height="130" fill="#f0c879"/>')
    body.append('<rect x="400" y="640" width="140" height="130" fill="none" stroke="#5b3d33" stroke-width="12"/><line x1="470" y1="640" x2="470" y2="770" stroke="#5b3d33" stroke-width="8"/>')
    body.append('<rect x="580" y="430" width="44" height="90" fill="#5b3d33"/>')
    body.append("</g>")
    words = ["Goodnight, Doudou.", "Goodnight, Moon.", "Goodnight, forest.", "Goodnight, little one."]
    overlay = "".join(f'<div class="gn" id="{p}-g{i}">{w}</div>' for i, w in enumerate(words))
    css = """#root .gn { position:absolute; left:0; right:0; top:150px; text-align:center; font-family:'Nunito', sans-serif;
      font-weight:800; font-size:72px; color:#f6e9bf; opacity:0; text-shadow:0 5px 0 rgba(11,22,32,0.4); }"""
    cam = Cam(t, f"#{p}-cam", 470, 660, 2.2)
    t.dip_in(sid)
    for i in range(4):
        a = t.L(i) - 0.1
        t.ft(f"#{p}-g{i}", {"opacity": 0, "filter": "blur(8px)"}, {"opacity": 1, "filter": "blur(0px)", "duration": 0.5, "ease": "power2.out"}, a)
        if i < 3:
            t.ft(f"#{p}-g{i}", {"opacity": 1, "filter": "blur(0px)"}, {"opacity": 0, "filter": "blur(8px)", "duration": 0.3, "ease": "power2.in"}, t.L(i + 1) - 0.45)
    # goodnight, Doudou: his window goes dark
    t.ft(f"#{p}-lamp", {"opacity": 1}, {"opacity": 0, "duration": 0.8, "ease": "power1.in"}, t.L(0) + 0.7)
    # goodnight, moon
    cam.to(t.L(1) - 0.4, 1320, 400, 1.4, 1.8)
    # goodnight, forest; goodnight, little one: pull all the way back
    cam.to(t.L(2) - 0.4, 960, 560, 1.0, 2.0)
    cam.to(t.L(3) - 0.2, 960, 480, 0.82, 5.0, "power2.out")
    t.ft(f".{p}-stars-s", {"opacity": 0.8}, {"opacity": 0.35, "duration": 1.2, "ease": "sine.inOut", "yoyo": True, "repeat": 3, "stagger": {"each": 0.04, "from": "edges"}}, t.L(2))
    write(sid, "\n".join(body), t, css, overlay)


SCENES = [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14]


def index():
    hosts, audio, at = [], [], 0.0
    for i, sc in enumerate(TIMING.values()):
        slot = sc["slot"] + (END_HOLD if sc["id"] == "s14-goodnight" else 0)
        hosts.append(f'''      <div id="{sc["id"]}" class="clip" data-composition-id="{sc["id"]}" data-composition-src="compositions/{sc["id"]}.html"
        data-start="{at:.3f}" data-duration="{slot:.3f}" data-track-index="1" data-track-kind="graphics" data-width="1920" data-height="1080"></div>''')
        audio.append(f'''      <audio id="vo-{sc["id"]}" class="clip" src="assets/voice/{sc["id"]}.wav" data-start="{at:.3f}" data-duration="{sc["voice"]:.3f}" data-track-index="2" data-volume="1"></audio>''')
        at += slot
    total = at
    html = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #16263a; }}
      #root {{ width: 100%; height: 100%; position: relative; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total:.3f}" data-width="1920" data-height="1080">
{chr(10).join(hosts)}
{chr(10).join(audio)}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
"""
    (ROOT / "index.html").write_text(html)
    # Remotion: the same running order, with the narration files
    rows, at = [], 0.0
    for sc in TIMING.values():
        slot = sc["slot"] + (END_HOLD if sc["id"] == "s14-goodnight" else 0)
        rows.append(f'  {{ id: "{sc["id"]}", start: {at:.3f}, slot: {slot:.3f}, voice: {sc["voice"]:.3f} }},')
        at += slot
    imports = "\n".join(f'import {{ scene_{s.split("-")[0]} }} from "./scenes/{s.split("-")[0]}";' for s in TIMING)
    names = ", ".join(f'scene_{s.split("-")[0]}' for s in TIMING)
    (REMOTION.parent / "timing.ts").write_text(f"""// Generated by doudou-moon/tools/build.py from tools/timing.json.
{imports}

export const DOUDOU_SECONDS = {total:.3f};
export const SCENE_TIMES = [
{chr(10).join(rows)}
];
export const SCENES = [{names}];
""")
    print(f"total {total:.2f}s")


if __name__ == "__main__":
    for fn in SCENES:
        fn()
    index()
