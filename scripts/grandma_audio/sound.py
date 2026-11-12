"""The Goodbye Money: original score + synthesized SFX + final mix (cartoon-3d-short skill audio helpers).

Everything is timed to the picture constants (frames at 30 fps, shots from src/videos/grandma/story.ts) and the voice
word timings (public/grandma/words.json). Standard mix: voice unchanged, music +3 dB (bed at voice -10 LU, ducked
3 dB under speech), SFX -6 dB; master -15 LUFS integrated, limiter ceiling -1.2 dBTP, 70.000 s, 48 kHz, 24-bit stereo.

Usage: python3 scripts/grandma_audio/sound.py   ->  out/grandma/audio/{mix,stem_voice,stem_music,stem_sfx}.wav + cues.md
"""
import json
import os
import numpy as np
from scipy import ndimage
from dsp import (SR, TAU, ns, tt, rng, lp, hp, bp, colored, smooth_noise, fades, phase, modal, pan, st, place, widen,
                 read_wav, write_wav, integrated, momentary_max, true_peak, dbg)
import instruments as I
import sfx_gen as G

import re
import sys
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
# version: grandma (original timeline) | dadi | grandma_en; the picture's warp table re-times every cue to its voice
VERSION = sys.argv[1] if len(sys.argv) > 1 else "grandma"
OUT = os.path.join(ROOT, "out", "grandma", "audio" if VERSION == "grandma" else f"audio_{VERSION}")
FPS = 30
_w = json.loads(re.search(r"= (\{.*\});", open(os.path.join(ROOT, "src", "videos", "grandma", "warps.ts")).read()).group(1))
WARP = _w.get(VERSION)
TOTAL = WARP["total"] if WARP else 2100
DUR = TOTAL / FPS
N = ns(DUR)


def fr(f):
    """original-timeline frame -> seconds in this version"""
    if not WARP:
        return f / FPS
    return float(np.interp(f, WARP["of"], WARP["nf"], right=WARP["nf"][-1] + (f - WARP["of"][-1]))) / FPS
CUES = []


def cue(kind, t, note=""):
    CUES.append((t, kind, note))


# ----------------------------------------------------------------------------------------------------------- score
BPM = 112
Q = 60 / BPM                       # quarter note
BAR = 4 * Q
m = I.m2f
CH = {"D": [50, 57, 62, 66], "G": [43, 55, 59, 62], "A": [45, 57, 61, 64], "A7": [45, 55, 61, 64], "Bm": [47, 54, 59, 62],
      "Em": [40, 55, 59, 64], "F#m": [42, 54, 57, 61]}
PROG = ["D", "G", "A", "D", "Bm", "G", "A7", "D"]
# our own 8-bar tune (D major): a cheeky rising question, a falling answer
TUNE = [(0, 74, 1), (1, 78, 0.5), (1.5, 81, 0.5), (2, 78, 1), (3, 76, 1),
        (4, 79, 1), (5, 76, 0.5), (5.5, 73, 0.5), (6, 69, 2),
        (8, 71, 1), (9, 74, 0.5), (9.5, 78, 0.5), (10, 76, 1), (11, 73, 1),
        (12, 74, 1.5), (13.5, 76, 0.5), (14, 74, 2),
        (16, 74, 1), (17, 78, 0.5), (17.5, 81, 0.5), (18, 83, 1), (19, 81, 1),
        (20, 79, 1), (21, 78, 0.5), (21.5, 76, 0.5), (22, 74, 2),
        (24, 79, 1), (25, 78, 1), (26, 76, 1), (27, 73, 1), (28, 74, 3)]


def band(buf, t0, t1, r, layers, transpose=0, vel=1.0):
    """the ensemble from t0 to t1 (s): layers in {bass, chords, brush, glock, vibes, horns, box}"""
    b = 0
    while t0 + b * BAR < t1 - 0.05:
        tb, ch = t0 + b * BAR, CH[PROG[b % 8]]
        if "bass" in layers:   # walking pizzicato: root, fifth
            for k, note in enumerate([ch[0], ch[1], ch[0] + 12, ch[1]]):
                t = tb + k * Q
                if t < t1:
                    place(buf, pan(I.pluck(m(note + transpose), 0.75 * vel, r, 0.6, 0.35), -0.15), t)
        if "chords" in layers:  # off-beat pizz chord stabs
            for k in (1, 3):
                t = tb + k * Q
                if t < t1:
                    for j, note in enumerate(ch[1:]):
                        place(buf, pan(I.pluck(m(note + 12 + transpose), 0.32 * vel, r, 0.35, 0.6), 0.35 - 0.2 * j), t + 0.006 * j)
        if "brush" in layers:
            for k in range(4):
                t = tb + k * Q
                if t < t1:
                    place(buf, pan(I.brush(0.35 * vel if k % 2 else 0.22 * vel, r, 0.3, swish=k % 2 == 1), 0.25), t)
        if "vibes" in layers:
            t = tb
            for j, note in enumerate(ch[1:]):
                place(buf, pan(I.vibes(m(note + 12 + transpose), 0.22 * vel, r, min(BAR, t1 - t) + 0.4), -0.4 + 0.4 * j), t)
        if "horns" in layers:
            for k in (1, 3):
                t = tb + k * Q
                if t < t1:
                    for j, note in enumerate(ch[1:3]):
                        place(buf, pan(I.brass(m(note + transpose), Q * 0.55, 0.22 * vel, r, kind="horn"), 0.3 * (j - 0.5)), t)
        b += 1
    for beat, note, d in TUNE:
        t = t0 + beat * Q
        if t >= t1 - 0.1:
            break
        if "glock" in layers:
            place(buf, pan(I.glock(m(note + 12 + transpose), 0.38 * vel, r, 1.4), 0.2), t)
        if "box" in layers:
            place(buf, pan(I.musicbox(m(note + 12 + transpose), 0.4 * vel, r, 1.6), -0.15), t)


def sting(buf, t, r, chord=(62, 66, 69, 74), big=1.0):
    """'ta-daa': brass chord + cymbal + triangle"""
    for j, note in enumerate(chord):
        place(buf, pan(I.brass(m(note), 0.9, 0.45 * big, r, kind="horn"), 0.5 * (j / 3 - 0.5)), t + 0.012 * j)
    place(buf, st(I.cymbal(0.4 * big, r, 2.2)), t)
    place(buf, pan(I.triangle(0.5, r, 1.6), 0.4), t)


def score():
    r = rng(1001)
    mus = np.zeros((2, N))
    W = fr
    # hook (day): cheeky intro, stops on the flash
    band(mus, 0.25, W(150), r, {"bass", "chords", "glock"}, vel=0.9)
    place(mus, pan(I.triangle(0.6, r, 1.8), 0.3), W(152)); cue("music", W(152), "flash: triangle")
    # departure + the lane's grandmas: lighter, brushes
    band(mus, W(158), W(397), r, {"bass", "brush", "box"}, vel=0.8)
    for j, note in enumerate([75, 74]):  # 'haven't caught you yet': a sly half-step
        place(mus, pan(I.musicbox(m(note + 12), 0.5, r, 1.4), 0.2), W(437) + 0.18 * j)
    # the refusals: one more layer every time ("Refuse once / twice / three times")
    band(mus, W(462), W(706), r, {"bass", "brush"}, vel=0.85)
    band(mus, W(706), W(786), r, {"bass", "brush", "glock"}, vel=0.9, transpose=2)
    band(mus, W(786), W(874), r, {"bass", "brush", "glock", "vibes"}, vel=0.95, transpose=4)
    band(mus, W(874), W(995), r, {"bass", "brush", "glock", "vibes", "horns"}, vel=1.0, transpose=5)
    # dead stop before "The car pulls away", then a run up the strings and "You won." sting
    for k, note in enumerate([62, 64, 66, 67, 69, 71, 73, 74]):
        place(mus, pan(I.pluck(m(note), 0.5, r, 0.4, 0.6), -0.3 + 0.08 * k), W(1004) + k * Q / 2)
    sting(mus, W(1061), r); cue("music", W(1061), "'You won.' sting")
    band(mus, W(1088), W(1168), r, {"bass", "chords", "glock"}, vel=0.8)
    # "Unluckily": music drops out; a low held note; hit on 'one rupees'
    place(mus, st(I.pad([m(38), m(45)], 2.4, 0.5, r, att=0.4, rel=0.8)), W(1180))
    place(mus, pan(I.timpani(m(38), 0.9, r, 2.0), 0), W(1255)); cue("music", W(1255), "timpani hit '...and one'")
    place(mus, pan(I.glock(m(86), 0.5, r, 1.6), 0.3), W(1255))
    # explanation: music box + warm pad, gentle
    band(mus, W(1336), W(1772), r, {"box", "bass"}, vel=0.6)
    place(mus, st(I.pad([m(50), m(57), m(62), m(66)], W(1772) - W(1336), 0.45, r, att=1.2, rel=1.5)), W(1336))
    # the ticket home: pad swell
    place(mus, st(I.pad([m(55), m(59), m(62), m(67)], W(1895) - W(1777), 0.6, r, att=1.5, rel=1.2)), W(1777))
    # next month (day): the full tune, finale sting on "one thousand and one"
    band(mus, W(1902), W(2058), r, {"bass", "chords", "brush", "glock"}, vel=1.0)
    sting(mus, W(2060), r, chord=(62, 66, 69, 74, 78), big=1.2); cue("music", W(2060), "finale sting")
    return mus


# ----------------------------------------------------------------------------------------------------------- sfx
def rustle(r, dur=0.35, bright=1.0):
    """paper note crinkle: dense short crackles through a paper resonance"""
    n = ns(dur)
    y = np.zeros(n)
    for _ in range(int(dur * 90)):
        i = r.integers(0, n - 200)
        L = r.integers(40, 200)
        y[i:i + L] += r.standard_normal(L) * np.exp(-np.arange(L) / (L / 3)) * r.uniform(0.3, 1.0)
    y = bp(y, 1500, 7000 * bright) + 0.3 * bp(y, 600, 1500)
    return fades(y * np.sin(np.pi * np.arange(n) / n) ** 0.5, 0.004, 0.05)


def zip_(r, dur=0.6):
    t = np.arange(ns(dur)) / SR
    rate = 45 + 40 * t / dur
    clicks = np.zeros_like(t)
    tc = 0.0
    while tc < dur - 0.01:
        clicks[ns(tc)] = r.uniform(0.6, 1.0)
        tc += 1 / np.interp(tc, t, rate)
    y = np.convolve(clicks, np.exp(-np.arange(200) / 25) * r.standard_normal(200), "same")
    return fades(bp(y, 1200, 6000) + 0.2 * bp(colored(len(t), r, 0.3), 2000, 5000) * np.sin(np.pi * t / dur), 0.005, 0.05)


def engine(dur, r, rpm0=850, rpm1=850, load=0.4):
    """little petrol taxi: firing pulses at rpm / 30 Hz through a body resonance + exhaust noise"""
    n = ns(dur)
    t = np.arange(n) / SR
    f = np.interp(t, [0, dur], [rpm0 / 30, rpm1 / 30]) * (1 + 0.02 * smooth_noise(n, r, 3))
    ph = phase(f)
    puls = np.maximum(0, np.sin(ph)) ** 6 + 0.5 * np.maximum(0, np.sin(ph + 2.1)) ** 6
    y = lp(puls - puls.mean(), 600) + 0.25 * lp(colored(n, r, 0.8), 300) * (0.5 + puls)
    return fades(y * (0.6 + load), 0.08, 0.15)


def coin_roll(r, dur, f0=3100):
    """a coin rolling on asphalt: grit rumble + rim clinks speeding up as it slows and wobbles"""
    n = ns(dur)
    t = np.arange(n) / SR
    y = 0.25 * bp(colored(n, r, 0.4), 800, 3000) * (0.6 + 0.4 * smooth_noise(n, r, 9))
    tc = 0.05
    while tc < dur - 0.05:
        c = G.clink(r, f0 * r.uniform(0.95, 1.05), 0.08, 0.6)
        G._place_mono(y, c * 0.5, tc)
        tc += r.uniform(0.11, 0.2)
    return fades(y, 0.02, 0.08)


def spin_down(r, dur=0.7, f0=2900):
    """the coin settling flat: wobble clinks accelerating, then the last tap"""
    y = np.zeros(ns(dur + 0.3))
    tc, gap = 0.0, 0.12
    while tc < dur:
        G._place_mono(y, G.clink(r, f0 * r.uniform(0.97, 1.03), 0.07, 0.5) * 0.6, tc)
        tc += gap
        gap = max(0.018, gap * 0.85)  # floor: a pure geometric series never reaches `dur`
    G._place_mono(y, G.clink(r, f0 * 0.8, 0.25, 0.8), dur)
    return y


def ping(r, f=4200):
    return modal(1.2, [(f, 1.0, 0.35), (f * 2.76, 0.4, 0.15), (f * 5.4, 0.15, 0.06)], r)


def pop(r):
    t = tt(0.09)
    return fades(np.sin(phase(900 * np.exp(-t / 0.03) + 200)) * np.exp(-t / 0.03), 0.001, 0.02)


def thump(r, f=70, dur=0.25):
    t = tt(dur)
    return fades(np.sin(phase(f * (1 + 1.5 * np.exp(-t / 0.02)))) * np.exp(-t / 0.07) + 0.3 * lp(r.standard_normal(len(t)), 900) * np.exp(-t / 0.015), 0.001, 0.03)


def sfx():
    r = rng(501)
    s = np.zeros((2, N))
    W = fr
    golden0, golden1 = W(152), W(1895)
    # ambience: birds by day, crickets in the evening, a soft breeze throughout
    place(s, widen(G.bird_chirps(W(152), r, 0.7), r) * 0.10, 0)
    place(s, widen(G.bird_chirps(DUR - golden1, r, 0.8), r) * 0.10, golden1)
    place(s, widen(G.crickets(golden1 - golden0, r, 3), r) * 0.05, golden0)
    place(s, st(G.breeze(DUR, r, 0.5)) * 0.12, 0)
    # the flash whoosh after the hook
    place(s, st(G.whoosh(0.7, r, 0.35)) * 0.5, W(152) - 0.35); cue("sfx", W(152), "whoosh (flash)")
    # taxi idling (shots 2-8), pulls away (9), cruising road noise (10, 11, 13, 14)
    for a, b, g in [(152, 1002, 0.22)]:
        place(s, pan(engine(W(b) - W(a), r), 0.2) * g, W(a)); cue("sfx", W(a), "taxi idle")
    place(s, pan(engine(3.0, r, 850, 3200, 0.9), 0.1) * 0.35, W(1002)); cue("sfx", W(1002), "taxi pulls away")
    place(s, st(G.whoosh(1.2, r, 0.5, 200, 1200)) * 0.35, W(1010))
    for a, b in [(1088, 1170), (1170, 1335), (1582, 1775), (1775, 1895)]:
        place(s, pan(engine(W(b) - W(a), r, 2200, 2300, 0.6), 0.0) * 0.18, W(a))
        place(s, st(lp(colored(ns(W(b) - W(a)), r, 0.9), 400)) * 0.08, W(a))
    # the note's journey: palm, back, pocket, bag (zip), driver
    for f, what in [(491, "handshake"), (575, "pressed into palm"), (683, "given back"), (758, "pocket"), (931, "to the driver"), (1146, "driver gives it back")]:
        place(s, pan(rustle(r), 0.15) * 0.5, W(f) - 0.04); cue("sfx", W(f), f"paper rustle: {what}")
    place(s, pan(zip_(r), -0.1) * 0.4, W(820)); cue("sfx", W(820), "bag zip")
    for f, g in [(516, 0.5), (964, 0.4)]:
        place(s, st(thump(r)) * g, W(f))
    # lunch box: lid off, the hit on "one"
    place(s, pan(G.clink(r, 2400, 0.3, 0.8), 0.1) * 0.6, W(1238)); cue("sfx", W(1238), "tiffin lid")
    place(s, st(thump(r, 55, 0.4)) * 0.8, W(1255))
    # coins: glints, the zero rolling + settling, the one rolling away
    for f in [1363, 1443, 1544, 1866]:
        place(s, pan(ping(r, 4200 + 300 * (f % 3)), 0.25) * 0.25, W(f)); cue("sfx", W(f), "coin glint")
    place(s, pan(coin_roll(r, W(1500) - W(1405)), -0.3) * 0.5, W(1405)); cue("sfx", W(1405), "zero coin rolls in")
    place(s, pan(spin_down(r, W(1521) - W(1500)), 0.0) * 0.6, W(1500)); cue("sfx", W(1521), "zero coin settles flat")
    place(s, pan(coin_roll(r, 1.4, 3600), 0.2) * 0.4, W(1556)); cue("sfx", W(1556), "one coin rolls away")
    # thought bubbles
    for f in [1648, 1730]:
        place(s, st(pop(r)) * 0.5, W(f)); cue("sfx", W(f), "bubble pop")
    # the wad + sparkle
    place(s, pan(rustle(r, 0.5, 0.8), 0.1) * 0.6, W(2021)); cue("sfx", W(2021), "wad pressed into palm")
    place(s, st(thump(r, 65, 0.3)) * 0.6, W(2060))
    return s


# ----------------------------------------------------------------------------------------------------------- mix
def load_voice():
    v, sr = read_wav(os.path.join(ROOT, "public", VERSION, "voice.wav"))
    assert sr == SR, sr
    v = st(v if v.ndim == 1 else v[0])
    out = np.zeros((2, N))
    out[:, : min(N, v.shape[1])] = v[:, :N]
    return out


def duck(words, depth_db=-3.0, pre=0.08, post=0.12, att=0.07, rel=0.45):
    g = np.zeros(N)
    for w in words:
        g[ns(max(0, w["s"] - pre)): ns(min(DUR, w["e"] + post))] = 1
    # attack / release smoothing
    k = np.exp(-1 / (SR * np.where(np.diff(np.concatenate([[0], g])) > 0, att, rel)))
    sm = np.zeros(N)
    acc = 0.0
    step = 64
    for i in range(0, N, step):
        tgt = g[i]
        a = np.exp(-step / (SR * (att if tgt > acc else rel)))
        acc = tgt + (acc - tgt) * a
        sm[i:i + step] = acc
    return dbg(depth_db * sm)


def limiter(x, ceil_db=-1.2, look=0.003, rel=0.08):
    ceil = dbg(ceil_db)
    peak = np.max(np.abs(x), axis=0)
    need = np.minimum(1.0, ceil / np.maximum(peak, 1e-9))
    L = ns(look)
    g = ndimage.minimum_filter1d(need, size=2 * L + 1)
    out = np.empty_like(g)
    a = np.exp(-1 / (SR * rel))
    cur = 1.0
    for i in range(0, len(g), 32):
        tgt = g[i:i + 32].min()
        cur = tgt if tgt < cur else tgt + (cur - tgt) * a ** 32
        out[i:i + 32] = cur
    return x * out[None, :]


def main():
    os.makedirs(OUT, exist_ok=True)
    words = json.load(open(os.path.join(ROOT, "public", VERSION, "words.json")))
    v = load_voice()
    mus = score()
    fx = sfx()
    Lv = integrated(v)
    mus *= dbg((Lv - 10.0) - integrated(mus))          # bed at voice -10 LU ("music +3 dB" on the old -13 bed)
    mus *= duck(words)[None, :]
    fx *= dbg((Lv - 6.0) - integrated(fx)) * dbg(-6.0)  # effects stem 6 dB under its voice-matched level
    mix = v + mus + fx
    g = dbg(-15.0 - integrated(mix))
    mix, v2, m2, f2 = mix * g, v * g, mus * g, fx * g
    mix = limiter(mix)
    for name, x in [("mix", mix), ("stem_voice", v2), ("stem_music", m2), ("stem_sfx", f2)]:
        write_wav(os.path.join(OUT, f"{name}.wav"), x)
    rep = f"integrated {integrated(mix):.2f} LUFS, true peak {true_peak(mix):.2f} dBTP, length {mix.shape[1] / SR:.3f} s"
    with open(os.path.join(OUT, "cues.md"), "w") as fcue:
        fcue.write("# The Goodbye Money: sound cues\n\n" + rep + "\n\n| time (s) | frame | kind | note |\n|---|---|---|---|\n")
        for t, k, nte in sorted(CUES):
            fcue.write(f"| {t:.2f} | {round(t * FPS)} | {k} | {nte} |\n")
    print(rep)


if __name__ == "__main__":
    main()
