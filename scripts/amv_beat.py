"""Synthesize the placeholder beat for the AnimeEdit (AMV) composition.

An original 101 BPM West-Coast style bounce (the same tempo family as the
track trending in these edits), so the cut timings in src/amv/edit.ts line
up whether you keep this beat or drop your own song in.

Layout (12 bars of 4/4 = 48 beats, ~28.5 s):
  bars 1-2   intro: filtered pluck riff + riser, no drums
  bars 3-10  drop: kick, clap, swung hats, 808 bass, riff
  bars 11-12 outro: half-time hit, riff, final crash

Generated from scratch with numpy, so there are no licensing questions.
Usage: python3 scripts/amv_beat.py   -> public/amv/beat.wav
"""

import pathlib
import wave

import numpy as np

SR = 44100
BPM = 101
BEAT = 60 / BPM
BARS = 12
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "amv"
rng = np.random.default_rng(101)

total = int(SR * (BARS * 4 * BEAT + 1.5))
L = np.zeros(total)
R = np.zeros(total)


def t_of(n: int) -> np.ndarray:
    return np.arange(n) / SR


def place(sig: np.ndarray, at_beat: float, gain=1.0, pan=0.0) -> None:
    i = int(at_beat * BEAT * SR)
    j = min(total, i + len(sig))
    if i >= total:
        return
    s = sig[: j - i] * gain
    L[i:j] += s * (1 - max(0, pan))
    R[i:j] += s * (1 + min(0, pan))


def onepole_lp(x: np.ndarray, fc: float) -> np.ndarray:
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc)
        y[i] = acc
    return y


def kick() -> np.ndarray:
    t = t_of(int(SR * 0.45))
    f = 45 + 110 * np.exp(-t / 0.04)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22)
    click = rng.standard_normal(len(t)) * np.exp(-t / 0.002) * 0.4
    return np.tanh((body + click) * 2.2)


def clap() -> np.ndarray:
    t = t_of(int(SR * 0.3))
    n = rng.standard_normal(len(t))
    env = np.zeros_like(t)
    for d in (0, 0.011, 0.022):
        env += (t >= d) * np.exp(-np.maximum(0, t - d) / 0.012)
    env += (t >= 0.03) * np.exp(-np.maximum(0, t - 0.03) / 0.09) * 0.6
    hp = n - onepole_lp(n, 900)
    return hp * env * 0.9


def hat(open_=False) -> np.ndarray:
    t = t_of(int(SR * (0.22 if open_ else 0.06)))
    n = rng.standard_normal(len(t))
    hp = n - onepole_lp(n, 7000)
    return hp * np.exp(-t / (0.07 if open_ else 0.014)) * 0.5


def bass808(freq: float, beats: float) -> np.ndarray:
    t = t_of(int(SR * beats * BEAT))
    f = freq * (1 + 0.5 * np.exp(-t / 0.02))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    env = np.minimum(1, t / 0.005) * np.exp(-t / (beats * BEAT * 0.9))
    return np.tanh(s * env * 1.6) * 0.9


def pluck(freq: float, dur=0.32, bright=1.0) -> np.ndarray:
    t = t_of(int(SR * dur))
    s = sum(np.sin(2 * np.pi * freq * k * t) * (0.6 ** (k - 1)) for k in range(1, 6))
    s += 0.3 * np.sign(np.sin(2 * np.pi * freq * t))
    env = np.minimum(1, t / 0.003) * np.exp(-t / (0.09 * bright))
    return s * env * 0.35


def crash() -> np.ndarray:
    t = t_of(int(SR * 2.2))
    n = rng.standard_normal(len(t))
    hp = n - onepole_lp(n, 4000)
    return hp * np.exp(-t / 0.7) * 0.5


def riser(beats: float) -> np.ndarray:
    n_ = int(SR * beats * BEAT)
    t = t_of(n_)
    n = rng.standard_normal(n_)
    sweep = np.sin(2 * np.pi * np.cumsum(300 + 2500 * (t / t[-1]) ** 2) / SR)
    return (n * 0.5 + sweep * 0.3) * (t / t[-1]) ** 2 * 0.6


# Note names -> Hz (A minor flavoured riff, original).
def hz(semis_from_a3: int) -> float:
    return 220.0 * 2 ** (semis_from_a3 / 12)


# Riff: 16 sixteenth-note steps per bar, (step, semitone) pairs.
RIFF = [(0, 0), (3, 3), (6, 7), (8, 5), (10, 3), (11, 0), (14, -2)]
RIFF_B = [(0, 0), (3, 3), (6, 7), (8, 10), (10, 7), (12, 5), (14, 3)]
BASS = [(0, -12, 1.5), (6, -12, 0.5), (8, -9, 1.0), (12, -14, 1.0)]

kk, cp, hh, oh, cr = kick(), clap(), hat(), hat(True), crash()

for bar in range(BARS):
    b0 = bar * 4
    intro = bar < 2
    outro = bar >= 10
    riff = RIFF_B if bar % 2 else RIFF
    for step, semi in riff:
        p = pluck(hz(semi + 12), bright=0.6 if intro else 1.0)
        if intro:
            p = onepole_lp(p, 1400)
        place(p, b0 + step / 4, 0.8, pan=-0.25)
        place(p, b0 + step / 4 + 0.75, 0.25, pan=0.35)  # dotted echo
    if intro:
        continue
    if outro:
        place(kk, b0, 1.0)
        place(cp, b0 + 2, 0.9)
        place(bass808(hz(-12), 4), b0, 0.9)
        continue
    # West-coast bounce kick
    for kb in (0, 0.75, 1.5, 2.5, 3.25):
        place(kk, b0 + kb, 1.0)
    place(cp, b0 + 1, 0.8)
    place(cp, b0 + 3, 0.8)
    for e in range(8):
        swing = 0.08 if e % 2 else 0
        place(oh if e == 7 else hh, b0 + e / 2 + swing, 0.55, pan=0.3)
    for step, semi, dur in BASS:
        place(bass808(hz(semi), dur), b0 + step / 4, 0.85)

place(riser(8), 0, 0.7)
place(cr, 8, 1.0)
place(cr, 40, 1.0)
place(cr, 47, 1.1)
place(kk, 47, 1.2)
place(bass808(hz(-12), 3), 47, 1.0)

stereo = np.stack([L, R], axis=1)
stereo = np.tanh(stereo * 1.2)
stereo = stereo / np.abs(stereo).max() * 0.89
OUT.mkdir(parents=True, exist_ok=True)
with wave.open(str(OUT / "beat.wav"), "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((stereo * 32767).astype(np.int16).tobytes())
print("wrote", OUT / "beat.wav", f"{total / SR:.2f}s")
