"""Synthesize the sound effects used by the CucumberSalad video.

Writes 44.1 kHz stereo WAVs to public/sfx/:
  pop.wav     soft bubbly pop for each ingredient label
  whoosh.wav  airy swoosh going into each slow-motion shot
  chime.wav   light bell chime for the final hero shot

Generated from scratch (numpy), so there are no licensing questions.
Usage: python3 scripts/make_sfx.py
"""

import pathlib
import wave

import numpy as np

SR = 44100
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "sfx"
rng = np.random.default_rng(7)


def write(name: str, left: np.ndarray, right: np.ndarray | None = None) -> None:
    right = left if right is None else right
    stereo = np.stack([left, right], axis=1)
    stereo = stereo / max(1e-9, np.abs(stereo).max()) * 0.89
    data = (stereo * 32767).astype(np.int16)
    with wave.open(str(OUT / name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def pop() -> np.ndarray:
    dur = 0.16
    t = np.arange(int(SR * dur)) / SR
    freq = 480 * (1100 / 480) ** (t / 0.07)  # quick upward chirp
    freq = np.minimum(freq, 1100)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    tone = np.sin(phase) + 0.25 * np.sin(2 * phase)
    env = np.minimum(1, t / 0.004) * np.exp(-t / 0.035)
    click = rng.standard_normal(len(t)) * np.exp(-t / 0.003) * 0.3
    return tone * env + click


def lowpass_sweep(noise: np.ndarray, cutoffs: np.ndarray) -> np.ndarray:
    out = np.empty_like(noise)
    y = 0.0
    for i, (x, fc) in enumerate(zip(noise, cutoffs)):
        a = 1 - np.exp(-2 * np.pi * fc / SR)
        y += a * (x - y)
        out[i] = y
    return out


def whoosh() -> tuple[np.ndarray, np.ndarray]:
    dur = 0.75
    n = int(SR * dur)
    t = np.arange(n) / SR
    shape = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6  # swell then fade
    cutoff = 250 + 3200 * shape
    noise = rng.standard_normal(n)
    body = lowpass_sweep(noise, cutoff)
    body -= lowpass_sweep(body, np.full(n, 180.0))  # trim rumble
    sig = body * shape
    pan = t / dur  # drifts left to right
    return sig * np.sqrt(1 - pan), sig * np.sqrt(pan)


def chime() -> np.ndarray:
    dur = 1.6
    t = np.arange(int(SR * dur)) / SR
    out = np.zeros_like(t)
    for start, f0 in ((0.0, 1318.5), (0.09, 1975.5)):  # E6 then B6
        tt = np.clip(t - start, 0, None)
        on = (t >= start).astype(float)
        for ratio, amp, decay in ((1, 1.0, 0.55), (2.76, 0.35, 0.25), (5.4, 0.15, 0.12)):
            out += on * amp * np.sin(2 * np.pi * f0 * ratio * tt) * np.exp(-tt / decay)
    return out * np.minimum(1, t / 0.002)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    write("pop.wav", pop())
    write("whoosh.wav", *whoosh())
    write("chime.wav", chime())
    print("wrote", ", ".join(sorted(p.name for p in OUT.glob("*.wav"))))


if __name__ == "__main__":
    main()
