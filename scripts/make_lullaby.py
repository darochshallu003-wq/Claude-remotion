"""Synthesize the bedtime story's music bed: an original music-box lullaby
over a warm pad, with soft crickets for night ambience.

Writes public/bedtime/lullaby.mp3 (44.1 kHz stereo, via a temporary WAV). Made from scratch with
numpy, so there are no licensing questions.
Usage: python3 scripts/make_lullaby.py [seconds]   (default 124)
"""

import pathlib
import subprocess
import sys
import wave

import numpy as np

SR = 44100
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "bedtime" / "lullaby.wav"
MP3 = OUT.with_suffix(".mp3")
BPM = 64
BEAT = 60 / BPM
rng = np.random.default_rng(11)

# Original melody in 3/4, C major. (midi note, beats); None is a rest.
A = [(67, 1), (64, 1), (67, 1), (69, 2), (67, 1), (64, 2), (62, 1), (60, 3),
     (62, 1), (64, 1), (67, 1), (64, 2), (62, 1), (62, 3), (None, 3)]
B = [(67, 1), (64, 1), (67, 1), (72, 2), (69, 1), (67, 2), (64, 1), (65, 3),
     (64, 1), (62, 1), (60, 1), (62, 2), (64, 1), (60, 3), (None, 3)]
MELODY = A + B
# one chord per bar (3 beats): root notes for the pad and the bass
CHORDS = [(48, 52, 55), (53, 57, 60), (48, 52, 55), (43, 50, 55), (48, 52, 55), (43, 47, 55),
          (48, 52, 55), (48, 52, 55),
          (48, 52, 55), (53, 57, 60), (48, 52, 55), (53, 57, 60), (43, 47, 50), (43, 47, 55),
          (48, 52, 55), (48, 52, 55)]


def hz(m: int) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


def music_box(f: float, dur: float) -> np.ndarray:
    t = np.arange(int(SR * dur)) / SR
    tone = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t)
            + 0.12 * np.sin(2 * np.pi * 5.04 * f * t) * np.exp(-t / 0.08))
    env = np.minimum(1, t / 0.003) * np.exp(-t / 0.9)
    return tone * env


def pad(notes: tuple[int, ...], dur: float) -> np.ndarray:
    t = np.arange(int(SR * dur)) / SR
    out = np.zeros_like(t)
    for m in notes:
        f = hz(m)
        for det in (-0.6, 0.6):
            out += np.sin(2 * np.pi * (f + det) * t) * 0.5
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.8
    return out * env


def crickets(n: int) -> np.ndarray:
    t = np.arange(n) / SR
    out = np.zeros(n)
    for f0, rate, phase in ((4300, 0.9, 0.0), (4700, 0.7, 1.7)):
        chirp = np.sin(2 * np.pi * f0 * t) * (np.sin(2 * np.pi * 28 * t) > 0.3)
        burst = (np.sin(2 * np.pi * rate * t + phase) > 0.75).astype(float)
        out += chirp * burst
    # smooth the gating so it isn't clicky
    k = np.ones(220) / 220
    return np.convolve(out, k, mode="same")


def add(ch: np.ndarray, i: int, s: np.ndarray) -> None:
    if i >= len(ch):
        return
    s = s[: len(ch) - i]
    ch[i:i + len(s)] += s


def main() -> None:
    seconds = float(sys.argv[1]) if len(sys.argv) > 1 else 124.0
    n = int(SR * seconds)
    left = np.zeros(n + SR * 4)
    right = np.zeros(n + SR * 4)
    bar = 3 * BEAT
    phrase_beats = sum(b for _, b in MELODY)
    t0 = 1.5  # let the crickets start first
    loop = 0
    while t0 < seconds:
        # melody (an octave up on alternate passes, quieter, for variety)
        t = t0
        lift = 12 if loop % 3 == 2 else 0
        for m, beats in MELODY:
            if m is not None:
                s = music_box(hz(m + lift), 2.6)
                i = int(t * SR)
                gain = 0.32 if lift else 0.4
                add(left, i, s * gain * 0.9)
                add(right, i, s * gain)
            t += beats * BEAT
        # pad + soft bass, one chord per bar
        for k, chord in enumerate(CHORDS):
            s = pad(chord, bar * 1.15)
            b = music_box(hz(chord[0] - 12), 2.2) * 0.5
            i = int((t0 + k * bar) * SR)
            for ch, g in ((left, 0.055), (right, 0.05)):
                add(ch, i, s * g)
                add(ch, i, b * 0.35)
        t0 += phrase_beats * BEAT
        loop += 1
    left, right = left[:n], right[:n]
    c = crickets(n)
    left += c * 0.012
    right += np.roll(c, 900) * 0.010
    # gentle fade in / out
    t = np.arange(n) / SR
    fade = np.minimum(1, t / 2.5) * np.clip((seconds - t) / 6, 0, 1)
    stereo = np.stack([left * fade, right * fade], axis=1)
    stereo = stereo / max(1e-9, np.abs(stereo).max()) * 0.85
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((stereo * 32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(OUT), "-c:a", "libmp3lame", "-q:a", "3", str(MP3)], check=True)
    OUT.unlink()
    print("wrote", MP3, f"{seconds:.0f} s")


if __name__ == "__main__":
    main()
