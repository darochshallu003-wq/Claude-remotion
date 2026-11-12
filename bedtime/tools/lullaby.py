"""Synthesize an original music-box lullaby (F major, 3/4, 66 bpm) for the
bedtime story, plus a few sparkle chimes timed to story beats.

Usage: python3 tools/lullaby.py <out.wav> [seconds]
Pure numpy + stdlib wave; deterministic.
"""

import sys
import wave

import numpy as np

SR = 44100
BPM = 66
BEAT = 60.0 / BPM
BAR = 3 * BEAT

# (midi, beats) — two original 8-bar phrases, each bar = 3 beats.
A = [(72, 2), (69, 1), (70, 1), (72, 1), (74, 1), (72, 2), (69, 1), (67, 3),
     (65, 1), (67, 1), (69, 1), (70, 2), (67, 1), (69, 1), (67, 1), (65, 1), (65, 3)]
B = [(74, 2), (72, 1), (70, 1), (69, 1), (67, 1), (72, 2), (70, 1), (69, 3),
     (67, 1), (69, 1), (70, 1), (72, 2), (74, 1), (72, 1), (70, 1), (67, 1), (65, 3)]
# One chord root per bar (MIDI), with chord tones as semitone offsets.
CH_A = [(53, "M"), (58, "M"), (53, "M"), (48, "M"), (53, "M"), (55, "m"), (48, "M"), (53, "M")]
CH_B = [(58, "M"), (55, "m"), (53, "M"), (53, "M"), (48, "M"), (58, "M"), (48, "M"), (53, "M")]
TRIAD = {"M": (0, 4, 7), "m": (0, 3, 7)}

# Sparkle chimes at story beats (seconds): star lands, star returns, thank-you twinkle.
SPARKLES = [24.0, 63.0, 69.5]


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def music_box(m, dur, amp):
    n = int(SR * (dur + 2.5))
    t = np.arange(n) / SR
    f = hz(m)
    tone = (np.sin(2 * np.pi * f * t)
            + 0.35 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 3)
            + 0.12 * np.sin(2 * np.pi * 5.4 * f * t) * np.exp(-t * 9))
    env = np.exp(-t * 1.6) * np.minimum(1, t / 0.004)
    return amp * tone * env


def pad(root, quality, dur, amp):
    n = int(SR * (dur + 1.0))
    t = np.arange(n) / SR
    sig = np.zeros(n)
    for off in TRIAD[quality]:
        f = hz(root + off)
        sig += np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * f * 1.003 * t)
    att = np.minimum(1, t / 0.9)
    rel = np.clip((dur + 1.0 - t) / 1.0, 0, 1)
    return amp * sig * att * rel / 3


def add(buf, sig, at):
    i = int(at * SR)
    j = min(len(buf), i + len(sig))
    if i < len(buf):
        buf[i:j] += sig[: j - i]


def main():
    out = sys.argv[1]
    total = float(sys.argv[2]) if len(sys.argv) > 2 else 92.0
    buf = np.zeros(int(SR * (total + 3)))

    # Form: A B A' B' (second pass an octave up, softer), then a held tonic.
    form = [(A, CH_A, 0, 0.16), (B, CH_B, 0, 0.16), (A, CH_A, 12, 0.11), (B, CH_B, 0, 0.14)]
    t0 = 1.0
    for mel, chords, octv, amp in form:
        t = t0
        for m, beats in mel:
            add(buf, music_box(m + octv, beats * BEAT, amp), t)
            t += beats * BEAT
        for k, (root, q) in enumerate(chords):
            add(buf, pad(root, q, BAR, 0.05), t0 + k * BAR)
            add(buf, music_box(root - 12 + 12, BEAT, 0.05), t0 + k * BAR)  # soft bass pluck
        t0 += 8 * BAR
    # Final tonic chord, rolled.
    for k, m in enumerate((65, 69, 72, 77)):
        add(buf, music_box(m, 4 * BEAT, 0.10), t0 + k * 0.18)
    add(buf, pad(53, "M", 3 * BAR, 0.05), t0)

    # Sparkles: quick rising arpeggio of high, quiet notes.
    for s in SPARKLES:
        for k, m in enumerate((84, 88, 91, 96)):
            add(buf, music_box(m, 0.3, 0.05), s + k * 0.07)

    buf = buf[: int(SR * total)]
    # Gentle simple echo for a dreamy room.
    d = int(0.32 * SR)
    wet = np.zeros_like(buf)
    wet[d:] = buf[:-d] * 0.28
    wet[2 * d:] += buf[: -2 * d] * 0.12
    buf = buf + wet
    # Fade in/out.
    fi, fo = int(1.0 * SR), int(6.0 * SR)
    buf[:fi] *= np.linspace(0, 1, fi)
    buf[-fo:] *= np.linspace(1, 0, fo)
    buf = buf / max(1e-9, np.max(np.abs(buf))) * 0.6

    stereo = np.stack([buf, np.roll(buf, int(0.012 * SR))], axis=1)
    pcm = (stereo * 32767).astype(np.int16)
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"wrote {out} ({total:.1f}s)")


if __name__ == "__main__":
    main()
