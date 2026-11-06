"""Synthesize the light, upbeat study-vibe music bed for PhotoExplainer.

C major, 100 BPM, I-V-vi-IV: soft marimba-like arpeggios, a round bass,
a gentle kick and an off-beat shaker. Made to sit quietly under a voiceover.
Generated from scratch (numpy), so there are no licensing questions.
Writes public/photo/music.wav (44.1 kHz stereo).
Usage: python3 scripts/photo_music.py [seconds]
"""

import pathlib
import sys
import wave

import numpy as np

SR = 44100
BPM = 100
BEAT = 60 / BPM
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "photo" / "music.wav"
rng = np.random.default_rng(5)


def midi(n: float) -> float:
    return 440 * 2 ** ((n - 69) / 12)


# chord roots / triads (MIDI): C, G, Am, F
CHORDS = [
    [60, 64, 67, 72],
    [55, 59, 62, 67],
    [57, 60, 64, 69],
    [53, 57, 60, 65],
]
BASS = [36, 43, 45, 41]


def add(buf: np.ndarray, at: float, sig: np.ndarray, gain: float) -> None:
    i = int(at * SR)
    if i >= len(buf):
        return
    m = min(len(sig), len(buf) - i)
    buf[i : i + m] += sig[:m] * gain


def marimba(f: float, dur: float = 0.6) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    env = np.exp(-t / 0.16) * np.clip(t / 0.002, 0, 1)
    return (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.04)) * env


def bass(f: float, dur: float) -> np.ndarray:
    t = np.arange(int(dur * SR)) / SR
    env = np.clip(t / 0.01, 0, 1) * np.exp(-t / 0.5)
    return (np.sin(2 * np.pi * f * t) + 0.2 * np.sin(4 * np.pi * f * t)) * env


def kick() -> np.ndarray:
    t = np.arange(int(0.3 * SR)) / SR
    f = 50 + 90 * np.exp(-t / 0.03)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)


def shaker() -> np.ndarray:
    t = np.arange(int(0.08 * SR)) / SR
    n = rng.standard_normal(len(t))
    n = np.diff(n, prepend=0)  # brighten
    return n * np.exp(-t / 0.02)


def main() -> None:
    seconds = float(sys.argv[1]) if len(sys.argv) > 1 else 112
    total = int(seconds * SR)
    left = np.zeros(total)
    right = np.zeros(total)
    bar = 4 * BEAT
    pattern = [0, 1, 2, 3, 2, 1, 2, 3]  # arpeggio over eighth notes
    k = kick()
    sh = shaker()
    b = 0
    while b * bar < seconds:
        c = b % 4
        t0 = b * bar
        for j, idx in enumerate(pattern):
            note = CHORDS[c][idx] + 12
            sig = marimba(midi(note))
            pan = 0.35 + 0.3 * (idx / 3)
            add(left, t0 + j * BEAT / 2, sig, 0.22 * (1 - pan) * 2)
            add(right, t0 + j * BEAT / 2, sig, 0.22 * pan * 2)
        bs = bass(midi(BASS[c]), bar)
        add(left, t0, bs, 0.5)
        add(right, t0, bs, 0.5)
        add(left, t0 + 2.5 * BEAT, bass(midi(BASS[c] + 7), BEAT * 1.5), 0.3)
        add(right, t0 + 2.5 * BEAT, bass(midi(BASS[c] + 7), BEAT * 1.5), 0.3)
        if b >= 1:
            for beat in (0, 2):
                add(left, t0 + beat * BEAT, k, 0.45)
                add(right, t0 + beat * BEAT, k, 0.45)
            for beat in range(4):
                add(left, t0 + (beat + 0.5) * BEAT, sh, 0.05)
                add(right, t0 + (beat + 0.5) * BEAT + 0.004, sh, 0.06)
        b += 1
    t = np.arange(total) / SR
    fade = np.clip(t / 1.5, 0, 1) * np.clip((seconds - t) / 3, 0, 1)
    stereo = np.stack([left * fade, right * fade], axis=1)
    stereo = stereo / np.abs(stereo).max() * 0.7
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((stereo * 32767).astype(np.int16).tobytes())
    print(f"wrote {OUT} ({seconds:.0f}s)")


if __name__ == "__main__":
    main()
