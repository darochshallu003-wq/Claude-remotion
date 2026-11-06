"""Synthesize the soft devotional music bed for the ShabariReel composition.

A tanpura drone (Pa-Sa-Sa-Sa cycle) under a slow bansuri-like melody in
Raag Bhupali (S R G P D), with a swarmandal shimmer when Ram arrives and at
the end. Phrases follow the scenes: dawn, tasting, waiting, arrival, tears,
offering, smile, end card.

Generated from scratch with numpy, so there are no licensing questions.
Writes public/shabari/music.wav (44.1 kHz stereo).
Usage: python3 scripts/shabari_music.py
"""

import pathlib
import wave

import numpy as np

SR = 44100
LENGTH = 35.6
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "shabari" / "music.wav"
rng = np.random.default_rng(11)

SA = 293.66  # D4 — flute Sa
RATIO = {"S": 1, "R": 9 / 8, "G": 5 / 4, "P": 3 / 2, "D": 5 / 3}


def freq(name: str) -> float:
    octave = 1.0
    if name.startswith("."):
        octave, name = 0.5, name[1:]
    if name.endswith("'"):
        octave, name = 2.0, name[:-1]
    return SA * RATIO[name] * octave


# (start s, length s, note)
MELODY = [
    (1.0, 1.4, "G"), (2.4, 0.6, "R"), (3.0, 1.8, "S"),
    (5.0, 0.5, ".D"), (5.5, 0.5, "S"), (6.0, 0.6, "R"), (6.6, 1.6, "G"), (8.2, 0.5, "P"), (8.7, 1.3, "G"),
    (10.2, 1.0, "R"), (11.2, 0.8, "S"), (12.0, 2.2, ".D"),
    (14.6, 0.5, "S"), (15.1, 0.5, "R"), (15.6, 0.5, "G"), (16.1, 0.5, "P"), (16.6, 0.6, "D"), (17.2, 2.0, "S'"),
    (19.4, 0.9, "S'"), (20.3, 0.7, "D"), (21.0, 1.0, "P"), (22.0, 1.5, "G"),
    (23.8, 0.6, "G"), (24.4, 0.6, "P"), (25.0, 0.9, "D"), (25.9, 1.4, "S'"), (27.3, 0.6, "D"), (27.9, 1.2, "P"),
    (29.3, 0.8, "G"), (30.1, 0.7, "R"), (30.8, 2.0, "G"),
    (33.0, 0.8, "R"), (33.8, 1.8, "S"),
]


def lowpass(x: np.ndarray, fc: float) -> np.ndarray:
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc += a * (v - acc)
        y[i] = acc
    return y


def flute(total: int) -> np.ndarray:
    out = np.zeros(total)
    prev = None
    for start, dur, name in MELODY:
        f = freq(name)
        rel = 0.35
        n = int((dur + rel) * SR)
        t = np.arange(n) / SR
        # meend: glide in from the previous note if it was contiguous
        f_track = np.full(n, f)
        if prev is not None:
            glide = min(0.14, dur * 0.3)
            g = t < glide
            f_track[g] = prev + (f - prev) * (0.5 - 0.5 * np.cos(np.pi * t[g] / glide))
        vib_depth = 0.006 * np.clip((t - 0.3) / 0.4, 0, 1)
        f_track = f_track * (1 + vib_depth * np.sin(2 * np.pi * 5.2 * t))
        phase = 2 * np.pi * np.cumsum(f_track) / SR
        tone = np.sin(phase) + 0.22 * np.sin(2 * phase) + 0.07 * np.sin(3 * phase)
        env = np.clip(t / 0.09, 0, 1) * np.clip((dur + rel - t) / rel, 0, 1)
        env *= 0.85 + 0.15 * np.sin(np.pi * np.clip(t / max(dur, 0.1), 0, 1))
        breath = rng.standard_normal(n) * 0.06 * (0.5 + np.clip(1 - t / 0.15, 0, 1))
        i0 = int(start * SR)
        seg = (tone + breath) * env
        out[i0 : i0 + n] += seg[: max(0, min(n, total - i0))]
        prev = f
    return lowpass(out, 3200)


def tanpura(total: int) -> np.ndarray:
    out = np.zeros(total)
    base = SA / 2  # tanpura Sa an octave below the flute
    cycle = [base * 3 / 4, base, base, base / 2]
    step = 1.15
    t0 = 0.0
    k = 0
    n = int(5.0 * SR)
    t = np.arange(n) / SR
    while t0 < LENGTH:
        f0 = cycle[k % 4]
        s = np.zeros(n)
        for h in range(1, 22):
            amp = h ** -0.9
            buzz = 1 + 0.6 * np.sin(2 * np.pi * (0.25 + 0.04 * h) * t + h)
            decay = np.exp(-t / (3.2 / (1 + 0.04 * h)))
            s += amp * buzz * decay * np.sin(2 * np.pi * f0 * h * (1 + 0.0004 * rng.standard_normal()) * t)
        s *= np.clip(t / 0.01, 0, 1)
        i0 = int(t0 * SR)
        m = min(n, total - i0)
        out[i0 : i0 + m] += s[:m]
        t0 += step
        k += 1
    return lowpass(out, 2400)


def swarmandal(total: int, at: float) -> np.ndarray:
    out = np.zeros(total)
    notes = ["S", "R", "G", "P", "D", "S'", "R'", "G'", "P'", "D'"]
    for i, nm in enumerate(notes):
        f = SA * RATIO[nm.rstrip("'")] * (2 if nm.endswith("'") else 1) * 2
        n = int(2.5 * SR)
        t = np.arange(n) / SR
        s = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t / 0.7) * np.clip(t / 0.003, 0, 1)
        i0 = int((at + i * 0.05) * SR)
        m = min(n, total - i0)
        if m > 0:
            out[i0 : i0 + m] += s[:m] * 0.5
    return out


def reverb(x: np.ndarray, seed: int) -> np.ndarray:
    r = np.random.default_rng(seed)
    n = int(2.4 * SR)
    t = np.arange(n) / SR
    ir = r.standard_normal(n) * np.exp(-t / 0.55)
    ir = lowpass(ir, 4500)
    ir /= np.sqrt(np.sum(ir**2))
    size = len(x) + n
    nfft = 1 << (size - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, nfft) * np.fft.rfft(ir, nfft), nfft)[: len(x)]
    return y


def main() -> None:
    total = int(LENGTH * SR)
    fl = flute(total)
    tp = tanpura(total)
    sw = swarmandal(total, 14.35) + swarmandal(total, 32.8)

    fl /= np.abs(fl).max()
    tp /= np.abs(tp).max()
    sw /= np.abs(sw).max()

    dry_l = 0.55 * fl + 0.30 * tp + 0.25 * sw
    dry_r = 0.55 * fl + 0.30 * tp + 0.25 * np.roll(sw, int(0.012 * SR))
    left = dry_l + 0.45 * reverb(dry_l, 1)
    right = dry_r + 0.45 * reverb(dry_r, 2)

    t = np.arange(total) / SR
    fade = np.clip(t / 1.2, 0, 1) * np.clip((LENGTH - t) / 2.0, 0, 1)
    stereo = np.stack([left * fade, right * fade], axis=1)
    stereo = stereo / np.abs(stereo).max() * 0.8

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((stereo * 32767).astype(np.int16).tobytes())
    print(f"wrote {OUT} ({LENGTH:.1f}s)")


if __name__ == "__main__":
    main()
