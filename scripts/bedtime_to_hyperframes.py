"""One-time port of the Remotion BedtimeStory to a HyperFrames project.

Reads src/bedtime/story.json and writes hyperframes/bedtime/index.html plus
one scene file per beat in hyperframes/bedtime/compositions/. The art is the
same SVG as src/bedtime/art.tsx; Remotion's per-frame sine motion becomes
bounded GSAP yoyo tweens, and each character's mouth moves while their line
is spoken.

After the port the HTML files are the source: edit them (or in the
HyperFrames desktop app). Rerunning this script overwrites those edits.

Usage: python3 scripts/bedtime_to_hyperframes.py
"""

import json
import math
import pathlib
import random
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "hyperframes" / "bedtime"
STORY = json.loads((ROOT / "src" / "bedtime" / "story.json").read_text())

W, H = 1080, 1920
FPS = 30
FADE = 0.8  # crossfade between scenes, s (24 frames)
OUTRO = 5.0

N = dict(
    sky0="#0B1233", sky1="#26205A", sky2="#4B3A7F", moon="#FFF2C2", moonShade="#F2DB97", glow="#FFE27A",
    skin="#E7AF84", cheek="#F28C8C", hair="#2A1A14", dress="#B9A6F0", dressDark="#9784DA", quilt="#F3A5B7",
    quiltDark="#D9849A", wall="#1C2552", wood="#7A4E3A", leaf="#2F6B57", leafDark="#1F4E40", water="#1D3E73",
    cream="#FFF7E6",
)
DEVA = "'Tiro Devanagari Hindi'"
FONT_FACE = """@font-face { font-family: 'Tiro Devanagari Hindi'; src: url('assets/fonts/tiro-400-devanagari.woff2') format('woff2'); unicode-range: U+0900-097F, U+1CD0-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FF; }
    @font-face { font-family: 'Tiro Devanagari Hindi'; src: url('assets/fonts/tiro-400-latin.woff2') format('woff2'); unicode-range: U+0000-00FF, U+2000-206F; }"""

STAR = "M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3 Z"


class Scene:
    """Collects markup and GSAP calls for one composition."""

    def __init__(self, cid: str, dur: float):
        self.id = cid
        self.dur = dur
        self.js: list[str] = []
        self.n = 0

    def uid(self, name: str) -> str:
        self.n += 1
        return f"{self.id}-{name}{self.n}"

    def osc(self, sel: str, prop: str, a: float, b: float, period: float, t0: float = 0.0, ease: str = "sine.inOut", extra: str = "") -> None:
        """a -> b -> a ... with the given full period, bounded to the scene."""
        half = period / 2
        reps = max(1, math.ceil((self.dur - t0) / half))
        self.js.append(
            f'tl.fromTo("#{sel}", {{ {prop}: {a:.3f}{extra} }}, {{ {prop}: {b:.3f}, duration: {half:.3f}, ease: "{ease}", yoyo: true, repeat: {reps} }}, {t0:.3f});'
        )

    def tween(self, sel: str, frm: str, to: str, t0: float, dur: float, ease: str = "power2.inOut") -> None:
        self.js.append(f'tl.fromTo("#{sel}", {{ {frm} }}, {{ {to}, duration: {dur:.3f}, ease: "{ease}" }}, {t0:.3f});')

    def set(self, sel: str, props: str, t: float) -> None:
        self.js.append(f'tl.set("#{sel}", {{ {props} }}, {t:.3f});')


def at(x: float, y: float, inner: str, eid: str | None = None, extra_style: str = "") -> str:
    i = f' id="{eid}"' if eid else ""
    return f'<div{i} class="abs" style="left:{x:.0f}px;top:{y:.0f}px;{extra_style}">{inner}</div>'


def wrap(eid: str, inner: str) -> str:
    """An untransformed wrapper GSAP can move."""
    return f'<div id="{eid}" class="wrap">{inner}</div>'


# ---------------------------------------------------------------------------
# Art (mirrors src/bedtime/art.tsx)


def stars(sc: Scene, count: int, seed: int, w: int = W, h: int = H, max_y: float = 0.75) -> str:
    rng = random.Random(seed)
    groups: list[list[str]] = [[], [], []]
    for i in range(count):
        x, y = rng.random() * w, rng.random() * h * max_y
        r = (1.5 + rng.random() * 3.2) * (w / W if w < W else 1)
        g = groups[i % 3]
        if rng.random() > 0.9:
            g.append(f'<path transform="translate({x:.1f} {y:.1f})" d="{STAR}" fill="{N["cream"]}"/>')
        else:
            g.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{N["cream"]}"/>')
    ids = [sc.uid("stars") for _ in groups]
    for k, gid in enumerate(ids):
        sc.osc(gid, "opacity", 1.0, 0.35, 2.2 + k * 0.9, 0)
    body = "".join(f'<g id="{gid}">{"".join(g)}</g>' for gid, g in zip(ids, groups))
    return f'<svg class="full" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>'


def night_sky(sc: Scene, frm: str = N["sky0"], to: str = N["sky2"], n: int = 70, seed: int = 1) -> str:
    return f'<div class="full" style="background:linear-gradient(180deg,{frm} 0%,{N["sky1"]} 55%,{to} 100%)">{stars(sc, n, seed)}</div>'


def glow(x: float, y: float, r: float, opacity: float = 0.5, eid: str | None = None, color: str = N["glow"]) -> str:
    i = f' id="{eid}"' if eid else ""
    return (f'<div{i} class="abs" style="left:{x - r:.0f}px;top:{y - r:.0f}px;width:{2 * r:.0f}px;height:{2 * r:.0f}px;'
            f'border-radius:50%;background:radial-gradient(circle,{color} 0%,rgba(0,0,0,0) 68%);opacity:{opacity}"></div>')


def eyes(pfx: str, cx: float, cy: float, gap: float, size: float, closed: bool, look=(0.0, 0.0), color: str = "#2A1A14", both: bool = False) -> str:
    """Open eyes (with a pupils group) and/or closed arcs, ids for toggling."""
    open_g, closed_g = [], []
    for s in (-1, 1):
        ex = cx + s * gap
        closed_g.append(f'<path d="M{ex - size} {cy} Q {ex} {cy + size * 0.9} {ex + size} {cy}" fill="none" stroke="{color}" stroke-width="{size * 0.38:.1f}" stroke-linecap="round"/>')
        open_g.append(f'<ellipse cx="{ex}" cy="{cy}" rx="{size * 0.78:.1f}" ry="{size}" fill="{color}"/>')
        open_g.append(f'<circle class="pupil" cx="{ex + look[0] * size * 0.25 + size * 0.22:.1f}" cy="{cy + look[1] * size * 0.25 - size * 0.3:.1f}" r="{size * 0.26:.1f}" fill="white"/>')
    out = ""
    if not closed or both:
        out += f'<g id="{pfx}-eo" opacity="{0 if closed else 1}">{"".join(open_g)}</g>'
    if closed or both:
        out += f'<g id="{pfx}-ec" opacity="{1 if closed else 0}">{"".join(closed_g)}</g>'
    return out


def mouth(pfx: str, cx: float, cy: float, w: float, color: str = "#8A3B3B") -> str:
    """Smile plus a hidden open mouth for talking."""
    return (f'<path id="{pfx}-ms" d="M{cx - w / 2} {cy} Q {cx} {cy + w * 0.5} {cx + w / 2} {cy}" fill="none" stroke="{color}" stroke-width="{w * 0.16:.1f}" stroke-linecap="round"/>'
            f'<ellipse id="{pfx}-mo" cx="{cx}" cy="{cy + w * 0.12:.1f}" rx="{w * 0.36:.1f}" ry="{w * 0.4:.1f}" fill="{color}" opacity="0"/>')


def talk(sc: Scene, pfx: str, start: float, end: float) -> None:
    """Mouth opens and closes while a line is spoken."""
    sc.set(f"{pfx}-ms", "opacity: 0", start)
    sc.set(f"{pfx}-mo", "opacity: 1", start)
    half = 0.11
    reps = max(1, int((end - start) / half) - 1)
    sc.js.append(f'tl.fromTo("#{pfx}-mo", {{ scaleY: 0.25, transformOrigin: "50% 50%" }}, {{ scaleY: 1, duration: {half}, ease: "sine.inOut", yoyo: true, repeat: {reps} }}, {start:.3f});')
    sc.set(f"{pfx}-mo", "opacity: 0", end)
    sc.set(f"{pfx}-ms", "opacity: 1", end)


def jugnu(sc: Scene, pfx: str, size: float, flip: bool = False) -> str:
    sc.osc(f"{pfx}-w1", "rotation", -50, -15, 0.16, 0, extra=', transformOrigin: "100% 100%"')
    sc.osc(f"{pfx}-w2", "rotation", -25, 5, 0.16, 0.04, extra=', transformOrigin: "0% 100%"')
    sc.osc(f"{pfx}-glow", "opacity", 1, 0.55, 2.0, 0)
    tf = ' transform="scale(-1 1)"' if flip else ""
    legs = "".join(f'<path d="M{x} 26 q 2 14 -4 20" fill="none" stroke="#3E3226" stroke-width="4" stroke-linecap="round"/>' for x in (-8, 6, 18))
    return f'''<svg viewBox="-110 -110 220 220" width="{size}" height="{size}" style="overflow:visible"><g{tf}>
<g id="{pfx}-glow"><circle cx="-30" cy="22" r="95" fill="{N["glow"]}" opacity="0.18"/><circle cx="-30" cy="22" r="55" fill="{N["glow"]}" opacity="0.3"/></g>
<g opacity="0.75"><ellipse id="{pfx}-w1" cx="-10" cy="-30" rx="34" ry="16" fill="#DCEBFF"/><ellipse id="{pfx}-w2" cx="8" cy="-28" rx="30" ry="14" fill="#EEF5FF"/></g>
<ellipse cx="-34" cy="20" rx="34" ry="28" fill="{N["glow"]}"/><ellipse cx="-38" cy="14" rx="16" ry="10" fill="#FFFBE0"/>
<ellipse cx="4" cy="6" rx="26" ry="24" fill="#5B4A3A"/><circle cx="38" cy="-6" r="30" fill="#6E5A46"/>
<path d="M44 -34 Q 54 -64 70 -66" fill="none" stroke="#5B4A3A" stroke-width="5" stroke-linecap="round"/>
<path d="M30 -34 Q 30 -66 46 -74" fill="none" stroke="#5B4A3A" stroke-width="5" stroke-linecap="round"/>
<circle cx="70" cy="-66" r="6" fill="{N["glow"]}"/><circle cx="46" cy="-74" r="6" fill="{N["glow"]}"/>
{eyes(pfx, 44, -10, 11, 8, False, (1, 0), "#1A120C")}<circle cx="60" cy="4" r="5" fill="{N["cheek"]}" opacity="0.7"/>
{mouth(pfx, 50, 8, 14, "#2A1A14")}{legs}</g></svg>'''


def pari_head(pfx: str, closed: bool, look, both: bool = False) -> str:
    return f'''<circle cx="42" cy="86" r="22" fill="{N["hair"]}"/><circle cx="178" cy="86" r="22" fill="{N["hair"]}"/>
<circle cx="110" cy="92" r="64" fill="{N["skin"]}"/>
<path d="M46 92 Q 44 26 110 24 Q 176 26 174 92 Q 160 52 124 54 Q 116 70 92 62 Q 66 64 46 92 Z" fill="{N["hair"]}"/>
{eyes(pfx, 110, 100, 24, 10, closed, look, both=both)}
<circle cx="74" cy="120" r="10" fill="{N["cheek"]}" opacity="0.55"/><circle cx="146" cy="120" r="10" fill="{N["cheek"]}" opacity="0.55"/>
{mouth(pfx, 110, 128, 22)}'''


def pari(sc: Scene, pfx: str, size: float, look=(0.0, 0.0), wave_from: float | None = None) -> str:
    if wave_from is not None:
        sc.tween(f"{pfx}-arm", 'rotation: -20, svgOrigin: "150 176"', "rotation: -120", wave_from, 0.4)
        reps = max(1, math.ceil((sc.dur - wave_from - 0.4) / 0.42))
        sc.js.append(f'tl.fromTo("#{pfx}-arm", {{ rotation: -120, svgOrigin: "150 176" }}, {{ rotation: -138, duration: 0.42, ease: "sine.inOut", yoyo: true, repeat: {reps} }}, {wave_from + 0.4:.3f});')
    stars_on = "".join(
        f'<path transform="translate({x} {y}) scale(0.6)" d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z" fill="{N["cream"]}" opacity="0.85"/>'
        for x, y in ((90, 210), (132, 236), (100, 268), (146, 280), (72, 260))
    )
    return f'''<svg viewBox="0 0 220 360" width="{size}" height="{size * 360 / 220:.1f}" style="overflow:visible">
<circle cx="42" cy="86" r="22" fill="{N["hair"]}"/><circle cx="178" cy="86" r="22" fill="{N["hair"]}"/>
<circle cx="56" cy="70" r="8" fill="{N["quilt"]}"/><circle cx="164" cy="70" r="8" fill="{N["quilt"]}"/>
<rect x="84" y="300" width="18" height="40" rx="9" fill="{N["skin"]}"/><rect x="118" y="300" width="18" height="40" rx="9" fill="{N["skin"]}"/>
<ellipse cx="90" cy="342" rx="16" ry="9" fill="{N["quilt"]}"/><ellipse cx="130" cy="342" rx="16" ry="9" fill="{N["quilt"]}"/>
<g transform="rotate(20 70 186)"><rect x="62" y="180" width="18" height="70" rx="9" fill="{N["skin"]}"/></g>
<path d="M78 160 Q 110 148 142 160 L 176 306 Q 110 322 44 306 Z" fill="{N["dress"]}"/>
<path d="M44 306 Q 110 322 176 306 L 172 292 Q 110 306 48 292 Z" fill="{N["dressDark"]}"/>{stars_on}
<g id="{pfx}-arm" transform="rotate(-20 150 176)"><rect x="142" y="170" width="18" height="70" rx="9" fill="{N["skin"]}"/><circle cx="151" cy="242" r="12" fill="{N["skin"]}"/></g>
<rect x="100" y="130" width="20" height="30" fill="{N["skin"]}"/>
<g>{pari_head(pfx, False, look)}</g></svg>'''


def pari_in_bed(sc: Scene, pfx: str, width: float, look=(0.0, 0.0), closed: bool = False, both: bool = False) -> str:
    quilt_stars = "".join(
        f'<path transform="translate({x} {y})" d="{STAR}" fill="{N["quiltDark"]}"/>'
        for x, y in ((300, 380), (460, 360), (620, 390), (760, 370), (380, 440), (700, 445))
    )
    return f'''<svg viewBox="0 0 900 620" width="{width}" height="{width * 620 / 900:.1f}" style="overflow:visible">
<path d="M60 300 L 60 120 Q 60 60 120 60 L 260 60 Q 320 60 320 120 L 320 300 Z" fill="{N["wood"]}"/>
<path d="M90 290 L 90 130 Q 90 92 128 92 L 252 92 Q 290 92 290 130 L 290 290 Z" fill="#8E5F48"/>
<rect x="40" y="300" width="820" height="190" rx="40" fill="{N["wood"]}"/>
<rect x="60" y="430" width="40" height="150" rx="14" fill="#5E3B2C"/><rect x="800" y="430" width="40" height="150" rx="14" fill="#5E3B2C"/>
<ellipse cx="220" cy="300" rx="150" ry="70" fill="{N["cream"]}"/>
<g transform="translate(112 92) scale(1.05)">{pari_head(pfx, closed, look, both)}</g>
<g id="{pfx}-quilt"><path d="M120 300 Q 480 250 870 300 L 880 470 Q 480 500 90 470 Z" fill="{N["quilt"]}"/>
<path d="M120 300 Q 480 250 870 300 L 868 330 Q 480 282 116 332 Z" fill="{N["cream"]}" opacity="0.9"/>{quilt_stars}</g></svg>'''


def moon(pfx: str, size: float, closed: bool = False) -> str:
    return f'''<svg viewBox="-200 -200 400 400" width="{size}" height="{size}" style="overflow:visible">
<circle r="170" fill="{N["moon"]}"/><circle cx="-80" cy="-80" r="26" fill="{N["moonShade"]}" opacity="0.7"/>
<circle cx="96" cy="-40" r="18" fill="{N["moonShade"]}" opacity="0.7"/><circle cx="60" cy="100" r="22" fill="{N["moonShade"]}" opacity="0.6"/>
<circle cx="-110" cy="50" r="12" fill="{N["moonShade"]}" opacity="0.6"/>
{eyes(pfx, 0, -10, 52, 18, closed, color="#6B5A3A")}
<circle cx="-86" cy="40" r="20" fill="{N["cheek"]}" opacity="0.35"/><circle cx="86" cy="40" r="20" fill="{N["cheek"]}" opacity="0.35"/>
{mouth(pfx, 0, 50, 52, "#9A5A4A")}</svg>'''


def cloud(width: float, face: bool = True, color: str = "#E8E4FA", opacity: float = 1) -> str:
    f = ""
    if face:
        f = (eyes("", 200, 120, 30, 10, True, color="#7A6FA8").replace(' id="-ec"', "")
             + f'<circle cx="158" cy="140" r="9" fill="{N["cheek"]}" opacity="0.4"/><circle cx="242" cy="140" r="9" fill="{N["cheek"]}" opacity="0.4"/>')
    return f'''<svg viewBox="0 0 400 200" width="{width}" height="{width / 2}" style="overflow:visible;opacity:{opacity}">
<g fill="{color}"><circle cx="110" cy="120" r="60"/><circle cx="190" cy="90" r="80"/><circle cx="280" cy="115" r="65"/><rect x="60" y="120" width="280" height="60" rx="30"/></g>{f}</svg>'''


def house(pfx: str, width: float) -> str:
    return f'''<svg viewBox="0 0 400 360" width="{width}" height="{width * 0.9:.1f}" style="overflow:visible">
<rect x="250" y="60" width="34" height="70" fill="#5E3B2C"/><path d="M30 170 L 200 40 L 370 170 Z" fill="#B8576A"/>
<path d="M30 170 L 200 40 L 210 50 L 48 176 Z" fill="#D06B7E"/><rect x="64" y="166" width="272" height="180" fill="#E9D7B9"/>
<rect x="170" y="250" width="60" height="96" rx="30" fill="{N["wood"]}"/>
<rect x="84" y="186" width="56" height="56" rx="8" fill="#2B2F55"/>
<g id="{pfx}-lit"><circle cx="110" cy="210" r="70" fill="{N["glow"]}" opacity="0.25"/><rect x="84" y="186" width="56" height="56" rx="8" fill="rgb(255,214,110)"/></g>
<path d="M112 186 V 242 M84 214 H 140" stroke="#7A4E3A" stroke-width="5"/>
<rect x="260" y="186" width="56" height="56" rx="8" fill="#2B2F55"/><path d="M288 186 V 242 M260 214 H 316" stroke="#7A4E3A" stroke-width="5"/></svg>'''


def hills(top: float) -> str:
    return f'''<svg class="abs" viewBox="0 0 1080 900" width="1080" height="900" style="left:0;top:{top}px">
<path d="M0 160 Q 270 40 560 140 T 1080 110 V 900 H 0 Z" fill="#203A5A"/><path d="M0 260 Q 300 160 620 250 T 1080 230 V 900 H 0 Z" fill="#17304B"/></svg>'''


def nest(sc: Scene, pfx: str, width: float) -> str:
    for k, sel in enumerate(["mom", "c1", "c2", "c3"]):
        sc.osc(f"{pfx}-{sel}", "scale", 1.0, 1.03, 3.8, k * 0.2, extra=', transformOrigin: "50% 50%"')
    chicks = "".join(
        f'''<g transform="translate({x} {y})"><g id="{pfx}-c{k}"><circle r="36" fill="#F6D36B"/><path d="M30 2 L 46 8 L 30 14 Z" fill="#F2A13A"/>
<path d="M6 -6 q 8 7 16 0" fill="none" stroke="#2A1A14" stroke-width="4" stroke-linecap="round"/>
<path d="M-6 -36 q 4 -12 12 -8" fill="none" stroke="#F6D36B" stroke-width="5" stroke-linecap="round"/></g></g>'''
        for x, y, k in ((130, 170, 1), (200, 160, 2), (255, 176, 3))
    )
    twigs = "".join(f'<path d="M{60 + i * 46} {210 + (i % 2) * 18} q 30 {20 - (i % 3) * 10} 64 -4" fill="none" stroke="#6A4128" stroke-width="6" stroke-linecap="round"/>' for i in range(9))
    return f'''<svg viewBox="0 0 500 330" width="{width}" height="{width * 330 / 500:.1f}" style="overflow:visible">
<g transform="translate(330 140)"><g id="{pfx}-mom"><ellipse cx="0" cy="20" rx="95" ry="70" fill="#C98B5B"/>
<path d="M-80 0 Q -150 -10 -170 40 Q -110 40 -70 50 Z" fill="#A86F45"/><circle cx="60" cy="-50" r="50" fill="#D79C6A"/>
<path d="M104 -50 L 136 -40 L 104 -30 Z" fill="#F2B544"/><path d="M58 -58 q 10 8 20 0" fill="none" stroke="#2A1A14" stroke-width="5" stroke-linecap="round"/>
<circle cx="80" cy="-34" r="8" fill="{N["cheek"]}" opacity="0.5"/><path d="M-40 -10 Q 30 -40 60 30 Q 0 60 -60 40 Z" fill="#B87A4C"/></g></g>
{chicks}<path d="M40 190 Q 250 340 470 190 Q 460 290 250 300 Q 40 290 40 190 Z" fill="#8A5A3A"/>{twigs}</svg>'''


def frog(pfx: str, width: float) -> str:
    return f'''<svg viewBox="0 0 420 300" width="{width}" height="{width * 300 / 420:.1f}" style="overflow:visible">
<ellipse cx="210" cy="250" rx="200" ry="46" fill="#3E8A62"/><path d="M210 250 L 330 224 A 200 46 0 0 1 380 238 Z" fill="#2C6B4B"/>
<ellipse cx="210" cy="190" rx="110" ry="70" fill="#7CC36A"/><ellipse cx="210" cy="210" rx="70" ry="40" fill="#B8E39A"/>
<circle cx="160" cy="110" r="34" fill="#7CC36A"/><circle cx="260" cy="110" r="34" fill="#7CC36A"/>
<g id="{pfx}-ec" opacity="0"><path d="M144 112 q 16 10 32 0" fill="none" stroke="#1F3A22" stroke-width="6" stroke-linecap="round"/>
<path d="M244 112 q 16 10 32 0" fill="none" stroke="#1F3A22" stroke-width="6" stroke-linecap="round"/></g>
<g id="{pfx}-eo"><circle cx="160" cy="110" r="16" fill="#1F3A22"/><circle cx="260" cy="110" r="16" fill="#1F3A22"/>
<circle cx="166" cy="104" r="5" fill="white"/><circle cx="266" cy="104" r="5" fill="white"/></g>
<ellipse id="{pfx}-yawn" cx="210" cy="176" rx="40" ry="40" fill="#7A2E3A"/>
<circle cx="150" cy="160" r="10" fill="{N["cheek"]}" opacity="0.5"/><circle cx="270" cy="160" r="10" fill="{N["cheek"]}" opacity="0.5"/>
<ellipse cx="120" cy="244" rx="34" ry="14" fill="#6AB35A"/><ellipse cx="300" cy="244" rx="34" ry="14" fill="#6AB35A"/></svg>'''


def lotus(width: float) -> str:
    petals = "".join(f'<ellipse cx="100" cy="70" rx="20" ry="52" transform="rotate({a} 100 120)" fill="{"#F7B6CB" if a == 0 else "#EE93B0"}"/>' for a in (-60, -30, 0, 30, 60))
    return f'<svg viewBox="0 0 200 140" width="{width}" height="{width * 0.7:.1f}" style="overflow:visible"><ellipse cx="100" cy="128" rx="96" ry="16" fill="#3E8A62"/>{petals}<circle cx="100" cy="100" r="12" fill="#F6D36B"/></svg>'


def zzz(sc: Scene, x: float, y: float, size: float = 60, t0: float = 0.0) -> str:
    out = []
    for k in range(3):
        zid = sc.uid("z")
        reps = max(0, math.ceil((sc.dur - t0) / 3.0))
        sc.js.append(
            f'tl.fromTo("#{zid}", {{ x: 0, y: 0, scale: 0.6, opacity: 0 }}, {{ keyframes: [{{ opacity: 0.85, x: 45, y: -110, scale: 0.9, duration: 1.5, ease: "sine.out" }}, {{ opacity: 0, x: 90, y: -220, scale: 1.2, duration: 1.5, ease: "sine.in" }}], repeat: {reps} }}, {t0 + k:.3f});'
        )
        out.append(f'<div id="{zid}" class="abs zz" style="left:{x:.0f}px;top:{y:.0f}px;font-size:{size}px;opacity:0">z</div>')
    return "".join(out)


# ---------------------------------------------------------------------------
# Shared pieces


def bedroom(sc: Scene, warm_id: str | None = None, warm: float = 0) -> str:
    w = ""
    if warm_id is not None or warm:
        i = f' id="{warm_id}"' if warm_id else ""
        w = f'<div{i} class="full" style="background:radial-gradient(circle at 60% 55%, rgba(255,226,122,0.22), rgba(0,0,0,0) 60%);opacity:{warm}"></div>'
    return f'''<div class="full" style="background:linear-gradient(180deg,{N["wall"]} 0%,#262E63 70%,#1A1F45 100%)">
  <div class="abs" style="left:250px;top:230px;width:580px;height:560px;border-radius:290px 290px 24px 24px;overflow:hidden;border:22px solid {N["wood"]}">
    <div class="full" style="background:linear-gradient(180deg,{N["sky0"]},{N["sky2"]})">{stars(sc, 24, 4, 536, 516, 0.5)}
      {at(300, 70, moon(sc.uid("wm"), 170))}
      <div class="abs" style="left:-40px;top:400px;width:640px;height:200px;border-radius:50%;background:#203A5A"></div></div>
    <div class="abs" style="left:257px;top:0;width:22px;height:100%;background:{N["wood"]}"></div>
    <div class="abs" style="top:300px;left:0;width:100%;height:22px;background:{N["wood"]}"></div>
  </div>
  <div class="abs" style="left:170px;top:190px;width:130px;height:680px;border-radius:0 0 80px 20px;background:#6D5BB5"></div>
  <div class="abs" style="left:780px;top:190px;width:130px;height:680px;border-radius:0 0 20px 80px;background:#6D5BB5"></div>
  <div class="abs" style="left:140px;top:170px;width:800px;height:34px;border-radius:17px;background:{N["wood"]}"></div>
  <div class="abs" style="left:250px;top:780px;width:580px;height:900px;background:linear-gradient(180deg,rgba(255,242,194,0.10),rgba(255,242,194,0));clip-path:polygon(0 0,100% 0,120% 100%,-20% 100%)"></div>
  <div class="abs" style="left:0;right:0;top:1460px;bottom:0;background:#3A2E4F"></div>
  <div class="abs" style="left:180px;top:1560px;width:720px;height:110px;border-radius:50%;background:#5A4C86"></div>
  {w}</div>'''


def bob(sc: Scene, eid: str, period: float, amp: float, t0: float = 0.0) -> None:
    sc.osc(eid, "y", -amp, amp, period, t0)


def flyers(sc: Scene, x: float, y: float, size: float = 240, wave_from: float | None = None, side: str = "right") -> str:
    """Pari floating with Jugnu beside her (scenes birds, pond, clouds)."""
    jx = size * 0.85 if side == "right" else -size * 0.45
    pb, jb, jd = sc.uid("pbob"), sc.uid("jbob"), sc.uid("jdrift")
    bob(sc, pb, 26 * 2 * math.pi / FPS, 16)
    bob(sc, jb, 26 * 2 * math.pi / FPS, 22)
    sc.osc(jd, "x", -20, 20, 18 * 2 * math.pi / FPS, 0)
    sc.osc(pb + "r", "rotation", -4, 4, 40 * 2 * math.pi / FPS, 0)
    return (at(x, y, wrap(pb, wrap(pb + "r", pari(sc, sc.id + "-pari", size, wave_from=wave_from))))
            + at(x + jx - 90, y - 50, wrap(jb, glow(150, 90, 150, 0.4) + at(90, 40, wrap(jd, jugnu(sc, sc.id + "-jug", size * 0.5, flip=side == "right"))))))


# ---------------------------------------------------------------------------
# Scenes. `lead` is when the beat's voice starts in scene time.


def scene_title(sc: Scene, lead: float, lines) -> str:
    sc.tween("title-name", "opacity: 0, y: 40", "opacity: 1, y: 0", 0.33, 1.67, "power3.out")
    sc.tween("title-sub", "opacity: 0", "opacity: 1", 1.5, 1.33)
    sc.tween("title-jx", "x: -200", "x: 1200", 0.67, 5.67, "none")
    sc.osc("title-jy", "y", -60, 60, 14 * 2 * math.pi / FPS, 0)
    return f'''<div id="title-cam" class="full">{night_sky(sc, n=90, seed=2)}
  {glow(540, 400, 380, 0.35)}{at(350, 210, moon("title-moon", 380, True))}{hills(1180)}{at(570, 1080, house("title-house", 330))}</div>
  <div class="full" style="text-align:center;top:700px">
    <div id="title-name" class="deva" style="font-size:140px;color:{N["cream"]};text-shadow:0 0 50px rgba(255,226,122,0.55)">परी और जुगनू</div>
    <div id="title-sub" class="deva" style="font-size:62px;color:#CFC6F5;margin-top:4px">नींद वाली सैर</div></div>
  {at(0, 560, wrap("title-jx", wrap("title-jy", jugnu(sc, "title-jug", 150))))}'''


def scene_awake(sc: Scene, lead: float, lines) -> str:
    sc.osc("awake-pari-eo .pupil", "x", -3, 3, 34 * 2 * math.pi / FPS, 0)
    for l in lines:
        if l["who"] == "p":
            talk(sc, "awake-pari", lead + l["start"], lead + l["end"])
    return f'<div id="awake-cam" class="full">{bedroom(sc)}{at(60, 820, pari_in_bed(sc, "awake-pari", 960, (0, -0.6)))}</div>'


def scene_jugnu(sc: Scene, lead: float, lines) -> str:
    sc.tween("jugnu-warm", "opacity: 0", "opacity: 1", lead + 0.8, 1.6, "power2.inOut")
    sc.tween("jugnu-glow", "opacity: 0", "opacity: 0.45", lead + 0.8, 1.6, "power2.inOut")
    sc.tween("jugnu-appear", "opacity: 0, scale: 0.4", "opacity: 1, scale: 1", lead + 0.8, 1.6, "power2.inOut")
    sc.tween("jugnu-fly", "x: 0, y: 0", "x: 150, y: 300", lead + 3.4, 1.8, "power2.inOut")
    sc.osc("jugnu-hover", "y", -16, 16, 20 * 2 * math.pi / FPS, 0)
    for l in lines:
        if l["who"] == "j":
            talk(sc, "jugnu-jug", lead + l["start"], lead + l["end"])
    return f'''<div id="jugnu-cam" class="full">{bedroom(sc, "jugnu-warm")}{at(60, 820, pari_in_bed(sc, "jugnu-pari", 960, (1, -1)))}
  {at(470, 460, wrap("jugnu-fly", glow(155, 165, 260, 0, "jugnu-glow") + wrap("jugnu-hover", wrap("jugnu-appear", jugnu(sc, "jugnu-jug", 170, flip=True)))))}</div>'''


def scene_birds(sc: Scene, lead: float, lines) -> str:
    leaves = "".join(
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{N["leafDark"]}"/><circle cx="{cx - r * 0.3}" cy="{cy - r * 0.25}" r="{r * 0.6}" fill="{N["leaf"]}"/>'
        for cx, cy, r in ((980, 560, 170), (760, 600, 140), (560, 700, 120), (1040, 960, 150), (880, 1100, 110), (380, 860, 90))
    )
    p_line = next(l for l in lines if l["who"] == "p")
    talk(sc, "birds-pari", lead + p_line["start"], lead + p_line["end"])
    return f'''<div id="birds-cam" class="full">{night_sky(sc, seed=5)}{at(60, 140, moon("birds-moon", 200, True))}
  <svg class="full" viewBox="0 0 1080 1920" width="1080" height="1920">
  <path d="M1120 760 Q 800 820 520 900 Q 420 930 300 900" fill="none" stroke="#5E3B2C" stroke-width="70" stroke-linecap="round"/>
  <path d="M760 830 Q 860 1000 1000 1080" fill="none" stroke="#5E3B2C" stroke-width="36" stroke-linecap="round"/>{leaves}</svg>
  {at(440, 640, nest(sc, "birds-nest", 540))}{zzz(sc, 820, 640, 56)}</div>
  {flyers(sc, 90, 1000, 230, wave_from=lead + p_line["start"])}'''


def scene_pond(sc: Scene, lead: float, lines) -> str:
    t = lead + lines[1]["start"] + 2.6
    sc.tween("pond-frog-yawn", 'scaleY: 0.15, scaleX: 1.1, transformOrigin: "50% 0%"', "scaleY: 1, scaleX: 0.8", t, 0.8, "power2.inOut")
    sc.tween("pond-frog-yawn", "scaleY: 1, scaleX: 0.8", "scaleY: 0.15, scaleX: 1.1", t + 2.4, 0.6, "power2.inOut")
    sc.set("pond-frog-eo", "opacity: 0", t + 0.4)
    sc.set("pond-frog-ec", "opacity: 1", t + 0.4)
    sc.set("pond-frog-eo", "opacity: 1", t + 2.7)
    sc.set("pond-frog-ec", "opacity: 0", t + 2.7)
    sc.tween("pond-zz", "opacity: 0", "opacity: 1", t + 0.4, 0.3)
    sc.tween("pond-zz", "opacity: 1", "opacity: 0", t + 2.4, 0.3)
    p_line = lines[2]
    talk(sc, "pond-pari", lead + p_line["start"], lead + p_line["end"])
    refl = []
    for k in range(5):
        rid = sc.uid("refl")
        sc.osc(rid, "x", -10, 10, 14 * 2 * math.pi / FPS, k * 0.3)
        w = 2 * (90 - k * 12)
        refl.append(f'<div id="{rid}" class="abs" style="left:{800 - w / 2:.0f}px;top:{1000 + k * 34}px;width:{w}px;height:10px;border-radius:5px;background:{N["moon"]};opacity:{0.45 - k * 0.07:.2f}"></div>')
    reeds = "".join(f'<path d="M{x} 1200 Q {x + 10} 1000 {x + 20} {880 + (i % 3) * 30}" fill="none" stroke="#2F5A45" stroke-width="10" stroke-linecap="round"/>' for i, x in enumerate((40, 80, 120, 960, 1000, 1040)))
    return f'''<div id="pond-cam" class="full">{night_sky(sc, seed=6)}{at(760, 160, moon("pond-moon", 210, True))}
  <div class="abs" style="left:-100px;right:-100px;top:860px;height:160px;border-radius:50%;background:#1F3A4A"></div>
  <div class="abs" style="left:0;right:0;top:940px;bottom:0;background:linear-gradient(180deg,#24467E,{N["water"]} 60%,#142A52)"></div>
  {"".join(refl)}<svg class="full" viewBox="0 0 1080 1920" width="1080" height="1920">{reeds}</svg>
  {at(560, 1150, lotus(190))}{at(90, 1260, lotus(150))}{at(180, 940, frog("pond-frog", 520))}
  <div id="pond-zz" class="full" style="opacity:0">{zzz(sc, 560, 950, 50)}</div></div>
  {flyers(sc, 700, 480, 210, wave_from=lead + p_line["start"], side="left")}'''


def scene_clouds(sc: Scene, lead: float, lines) -> str:
    out = []
    for i, (x, y, w, v, face) in enumerate(((60, 300, 420, 0.35, True), (620, 520, 360, -0.28, True), (-80, 1020, 520, 0.22, True), (640, 1180, 440, -0.3, True), (380, 160, 260, 0.18, False))):
        cid = sc.uid("cloud")
        sc.tween(cid, "x: 0", f"x: {v * sc.dur * FPS:.0f}", 0, sc.dur, "none")
        sc.osc(cid + "b", "y", -10, 10, 40 * 2 * math.pi / FPS, i * 0.5)
        out.append(at(x, y, wrap(cid, wrap(cid + "b", cloud(w, face, opacity=0.95)))))
    p_line = lines[2]
    talk(sc, "clouds-pari", lead + p_line["start"], lead + p_line["end"])
    sc.tween("clouds-rise", "y: 80", "y: 0", 0, 4, "power3.inOut")
    return f'''<div id="clouds-cam" class="full">{night_sky(sc, "#141B45", "#5A4A92", seed=7)}{"".join(out)}</div>
  <div id="clouds-rise" class="full">{flyers(sc, 410, 700, 240, wave_from=lead + p_line["start"])}</div>'''


def scene_moon(sc: Scene, lead: float, lines) -> str:
    sc.tween("moon-scale", 'scale: 0.85, transformOrigin: "50% 50%"', "scale: 1", lead, 1.5, "power2.inOut")
    for l in lines:
        if l["who"] == "c":
            talk(sc, "moon-big", lead + l["start"], lead + l["end"])
    bob(sc, "moon-pbob", 28 * 2 * math.pi / FPS, 10)
    bob(sc, "moon-jbob", 28 * 2 * math.pi / FPS, 14)
    sc.osc("moon-jx", "x", -16, 16, 16 * 2 * math.pi / FPS, 0)
    sc.osc("moon-c1", "x", -10, 10, 60 * 2 * math.pi / FPS, 0)
    sc.osc("moon-c2", "x", 10, -10, 50 * 2 * math.pi / FPS, 0)
    return f'''<div id="moon-cam" class="full">{night_sky(sc, n=110, seed=8)}{glow(540, 640, 620, 0.4)}
  {at(180, 280, wrap("moon-scale", moon("moon-big", 720)))}
  {at(-60, 1130, wrap("moon-c1", cloud(520, False, opacity=0.6)))}{at(620, 1200, wrap("moon-c2", cloud(460, False, opacity=0.5)))}</div>
  {at(170, 1010, wrap("moon-pbob", pari(sc, "moon-pari", 190, (1, -1))))}
  {at(360, 1000, wrap("moon-jbob", wrap("moon-jx", jugnu(sc, "moon-jug", 110))))}'''


def scene_home(sc: Scene, lead: float, lines) -> str:
    sc.set("home-pari-eo", "opacity: 0", lead + 5.6)
    sc.set("home-pari-ec", "opacity: 1", lead + 5.6)
    sc.osc("home-pari-quilt", "y", 0, -5, 22 * 2 * math.pi / FPS, lead + 5.6)
    for l in lines:
        if l["who"] == "p":
            talk(sc, "home-pari", lead + l["start"], lead + l["end"])
        if l["who"] == "j":
            talk(sc, "home-jug", lead + l["start"], lead + l["end"])
    sc.osc("home-jx", "x", -30, 30, 20 * 2 * math.pi / FPS, 0)
    sc.osc("home-jy", "y", -22, 22, 26 * 2 * math.pi / FPS, 0)
    return f'''<div id="home-cam" class="full">{bedroom(sc, warm=0.8)}{at(60, 820, pari_in_bed(sc, "home-pari", 960, both=True))}
  {at(600, 720, wrap("home-jx", wrap("home-jy", glow(70, 80, 240, 0.45) + at(0, 0, jugnu(sc, "home-jug", 160, flip=True)))))}</div>'''


def scene_sleep(sc: Scene, lead: float, lines) -> str:
    sc.tween("sleep-house-lit", "opacity: 1", "opacity: 0.25", lead + 2, 7, "power2.inOut")
    period = 40 * 2 * math.pi / FPS
    sc.osc("sleep-jx", "x", 380, -380, period, 0)
    sc.osc("sleep-jy", "y", -120, 120, period, period / 4)
    return f'''<div id="sleep-cam" class="full">{night_sky(sc, n=120, seed=3)}{glow(540, 420, 360, 0.3)}
  {at(370, 250, moon("sleep-moon", 340, True))}{hills(1120)}{at(260, 930, house("sleep-house", 560))}{zzz(sc, 330, 960, 58)}</div>
  {at(540, 1060, wrap("sleep-jx", wrap("sleep-jy", glow(50, 50, 140, 0.4) + at(0, 0, jugnu(sc, "sleep-jug", 100, flip=True)))))}'''


SCENES = dict(title=scene_title, awake=scene_awake, jugnu=scene_jugnu, birds=scene_birds, pond=scene_pond,
              clouds=scene_clouds, moon=scene_moon, home=scene_home, sleep=scene_sleep)
CAM_ORIGIN = dict(title="50% 45%", awake="50% 60%", jugnu="55% 55%", birds="65% 45%", pond="40% 55%",
                  clouds="50% 45%", moon="50% 40%", home="40% 62%", sleep="50% 60%")

BASE_CSS = """#root { position: absolute; inset: 0; overflow: hidden; }
    .full { position: absolute; left: 0; top: 0; width: 100%; height: 100%; }
    .abs { position: absolute; }
    .wrap { position: relative; }
    .deva { font-family: 'Tiro Devanagari Hindi', serif; }
    .zz { font-family: Poppins, sans-serif; font-weight: 700; color: #FFF7E6; }"""


def baseline(js: list[str]) -> list[str]:
    """Only the earliest fromTo on a target renders its from-state immediately."""
    seen, out = set(), []
    for line in js:
        m = re.match(r'tl\.fromTo\("([^"]+)", (\{.*?\}), \{ ', line)
        if m:
            if m.group(1) in seen:
                line = line.replace(m.group(0), m.group(0) + "immediateRender: false, ", 1)
            seen.add(m.group(1))
        out.append(line)
    return out


def scene_file(sc: Scene, body: str, fade_in: float) -> str:
    sc.js.insert(0, f'tl.fromTo("#{sc.id}-fade", {{ opacity: 0 }}, {{ opacity: 1, duration: {fade_in}, ease: "power2.inOut" }}, 0);')
    sc.js.insert(1, f'tl.fromTo("#{sc.id}-cam", {{ scale: 1, transformOrigin: "{CAM_ORIGIN[sc.id]}" }}, {{ scale: {1 + sc.dur * FPS * 0.00016:.4f}, duration: {sc.dur:.3f}, ease: "none" }}, 0);')
    js = "\n      ".join(baseline(sc.js))
    return f'''<template>
  <style>
    {FONT_FACE}
    {BASE_CSS}
  </style>
  <div id="root" data-composition-id="{sc.id}" data-width="{W}" data-height="{H}">
    <div id="{sc.id}-fade" class="full" data-layout-allow-overflow data-layout-allow-overlap>
  {body}
    </div>
  </div>
  <script>
    (function () {{
      const tl = gsap.timeline({{ paused: true }});
      {js}
      window.__timelines["{sc.id}"] = tl;
    }})();
  </script>
</template>
'''


SPEAKER = dict(n=(None, N["cream"]), p=("परी", "#FFC6D6"), j=("जुगनू", N["glow"]), c=("चाँद मामा", "#FFF2C2"))


def captions(placed) -> str:
    groups, js = [], []
    for p in placed:
        lines = p["lines"]
        for i, l in enumerate(lines):
            gid = f"cap-{p['id']}-{i}"
            start = p["start"] + l["start"] - 0.15
            until = p["start"] + (lines[i + 1]["start"] - 0.15 if i + 1 < len(lines) else l["end"] + 0.9)
            name, color = SPEAKER[l["who"]]
            tag = (f'<div class="cap-tag" style="background:{color}">{name}</div>' if name else "")
            text = l["text"] if l["who"] == "n" else f"“{l['text']}”"
            border = color if name else "rgba(255,247,230,0.25)"
            groups.append(
                f'<div id="{gid}" class="clip cap" data-start="{start:.3f}" data-duration="{until - start:.3f}" data-track-index="1">'
                f'<div id="{gid}-in" class="cap-in">{tag}<div class="cap-box" style="color:{color};border-color:{border}">{text}</div></div></div>'
            )
            js.append(f'tl.fromTo("#{gid}-in", {{ opacity: 0, y: 14 }}, {{ opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }}, {start:.3f});')
            js.append(f'tl.to("#{gid}-in", {{ opacity: 0, duration: 0.3, ease: "power2.in" }}, {until - 0.33:.3f});')
    body = "\n    ".join(groups)
    jss = "\n      ".join(js)
    return f'''<template>
  <style>
    {FONT_FACE}
    #root {{ position: absolute; inset: 0; }}
    .cap {{ position: absolute; left: 60px; right: 60px; bottom: 170px; }}
    .cap-in {{ display: flex; flex-direction: column; align-items: center; }}
    .cap-tag {{ margin-bottom: -18px; z-index: 1; padding: 6px 26px 10px; border-radius: 999px; color: {N["sky0"]}; font-family: 'Tiro Devanagari Hindi', serif; font-size: 38px; }}
    .cap-box {{ padding: 30px 40px 26px; border-radius: 36px; background: rgba(11,18,51,0.62); border: 2px solid; font-family: 'Tiro Devanagari Hindi', serif; font-size: 54px; line-height: 1.45; text-align: center; text-shadow: 0 2px 12px rgba(0,0,0,0.5); }}
  </style>
  <div id="root" data-composition-id="captions" data-width="{W}" data-height="{H}">
    {body}
  </div>
  <script>
    (function () {{
      const tl = gsap.timeline({{ paused: true }});
      {jss}
      window.__timelines["captions"] = tl;
    }})();
  </script>
</template>
'''


def outro() -> str:
    sc = Scene("outro", OUTRO)
    sky = stars(sc, 60, 9, max_y=1)
    sc.js.insert(0, 'tl.fromTo("#outro-fade", { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.inOut" }, 0);')
    sc.js.append('tl.fromTo("#outro-text", { opacity: 0 }, { opacity: 1, duration: 1, ease: "none" }, 0.67);')
    sc.js.append(f'tl.to("#outro-fade", {{ opacity: 0, duration: 1, ease: "none" }}, {OUTRO - 1.05});')
    sc.osc("outro-jx", "x", -60, 60, 20 * 2 * math.pi / FPS, 0)
    sc.osc("outro-jy", "y", 40, -40, 26 * 2 * math.pi / FPS, 0)
    js = "\n      ".join(sc.js)
    return f'''<template>
  <style>
    {FONT_FACE}
    {BASE_CSS}
    #outro-center {{ display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; }}
  </style>
  <div id="root" data-composition-id="outro" data-width="{W}" data-height="{H}">
    <div id="outro-fade" class="full" style="background:linear-gradient(180deg,{N["sky0"]},{N["sky1"]})">
      {sky}
      <div id="outro-center" class="full">
        {moon("outro-moon", 360, True)}
        <div id="outro-text" style="display:flex;flex-direction:column;align-items:center;gap:30px">
          <div class="deva" data-var-text="goodnight" style="font-size:120px;color:{N["cream"]};text-shadow:0 0 40px rgba(255,226,122,0.5)">शुभ रात्रि</div>
          <div class="deva" data-var-text="sweetDreams" style="font-size:46px;color:#CFC6F5">मीठे सपने देखना</div>
          <div data-var-text="handle" style="margin-top:30px;font-family:Poppins,sans-serif;font-size:34px;color:#CFC6F5;letter-spacing:1px;opacity:0.8">@mythmitao</div>
        </div>
      </div>
      {at(640, 560, wrap("outro-jx", wrap("outro-jy", jugnu(sc, "outro-jug", 120, flip=True))))}
    </div>
  </div>
  <script>
    (function () {{
      const tl = gsap.timeline({{ paused: true }});
      {js}
      window.__timelines["outro"] = tl;
    }})();
  </script>
</template>
'''


def clip_seconds(path: pathlib.Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True)
    return float(out.stdout.strip()) - 0.08  # MP3 encoder padding


def main() -> None:
    placed, t = [], 0.0
    for b in STORY["beats"]:
        frames = round(b["seconds"] * FPS)
        placed.append({**b, "start": t, "frames": frames})
        t += frames / FPS
    scenes_end = t
    total = scenes_end + OUTRO
    comp = OUT / "compositions"
    comp.mkdir(parents=True, exist_ok=True)
    hosts = []
    for i, p in enumerate(placed):
        lead = FADE if i > 0 else 0.0
        dur = p["frames"] / FPS + lead + FADE
        sc = Scene(p["id"], dur)
        body = SCENES[p["id"]](sc, lead, p["lines"])
        (comp / f"{p['id']}.html").write_text(scene_file(sc, body, 1.0 if i == 0 else FADE))
        hosts.append(
            f'<div id="{p["id"]}" data-composition-id="{p["id"]}" data-composition-src="compositions/{p["id"]}.html" '
            f'data-start="{p["start"] - lead:.3f}" data-duration="{dur:.3f}" data-track-index="0" data-track-kind="graphics" '
            f'data-width="{W}" data-height="{H}" style="z-index:{i + 1}"></div>'
        )
    (comp / "captions.html").write_text(captions(placed))
    (comp / "outro.html").write_text(outro())
    vo = "\n      ".join(
        f'<audio id="vo-{p["id"]}" class="clip" src="assets/vo/{p["id"]}.mp3" data-start="{p["start"]:.3f}" data-duration="{clip_seconds(OUT / "assets" / "vo" / (p["id"] + ".mp3")):.3f}" data-track-index="3" data-volume="1"></audio>'
        for p in placed
    )
    variables = json.dumps([
        {"id": "goodnight", "type": "string", "label": "End card title", "default": "शुभ रात्रि"},
        {"id": "sweetDreams", "type": "string", "label": "End card line", "default": "मीठे सपने देखना"},
        {"id": "handle", "type": "string", "label": "Channel handle", "default": "@mythmitao"},
    ], ensure_ascii=False)
    index = f'''<!doctype html>
<html lang="hi" data-composition-variables='{variables}'>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width={W}, height={H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * {{ margin: 0; padding: 0; box-sizing: border-box; }}
      html, body {{ margin: 0; width: {W}px; height: {H}px; overflow: hidden; background: {N["sky0"]}; }}
      #root {{ position: relative; width: 100%; height: 100%; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{total:.3f}" data-fps="{FPS}" data-width="{W}" data-height="{H}">
      {chr(10).join("      " + h for h in hosts).strip()}
      <div id="outro" data-composition-id="outro" data-composition-src="compositions/outro.html" data-start="{scenes_end - 10 / FPS:.3f}" data-duration="{OUTRO + 10 / FPS:.3f}" data-track-index="0" data-track-kind="graphics" data-width="{W}" data-height="{H}" style="z-index:20"></div>
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="{scenes_end + 1:.3f}" data-track-index="1" data-track-kind="captions" data-width="{W}" data-height="{H}" style="z-index:30"></div>
      <audio id="lullaby" class="clip" src="assets/lullaby.mp3" data-start="0" data-duration="{total:.3f}" data-track-index="2" data-volume="0.2" data-fade-out="2"></audio>
      {vo}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({{ paused: true }});
    </script>
  </body>
</html>
'''
    (OUT / "index.html").write_text(index)
    print(f"wrote {len(placed)} scenes + captions + outro; total {total:.2f} s")


if __name__ == "__main__":
    main()
