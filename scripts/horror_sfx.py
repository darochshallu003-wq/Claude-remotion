"""Synthesize the night-horror sound design for the "ulte pair" story.

Writes 44.1 kHz stereo WAVs to public/sfx/horror/, generated from scratch with
numpy (no licensing questions):
  ambience.wav  night wind + crickets, loopable
  drone.wav     low ominous pad, loopable
  stinger.wav   jump-scare hit (boom + dissonant screech)
  payal.wav     the witch's anklet bells
  heartbeat.wav two heavy beats
  thud.wav      someone falling on mud
  run.wav       fast bare footsteps
  owl.wav       distant owl hoot
  comic.wav     plucked "everything is fine" melody for the twist
  chai.wav      warm plucked resolve for the ending

Usage: python3 scripts/horror_sfx.py
"""

import pathlib
import wave

import numpy as np

SR = 44100
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "sfx" / "horror"
rng = np.random.default_rng(11)


def t_of(dur: float) -> np.ndarray:
    return np.arange(int(SR * dur)) / SR


def write(name: str, left: np.ndarray, right: np.ndarray | None = None, peak: float = 0.89) -> None:
    right = left if right is None else right
    stereo = np.stack([left, right], axis=1)
    stereo = stereo / max(1e-9, np.abs(stereo).max()) * peak
    with wave.open(str(OUT / name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((stereo * 32767).astype(np.int16).tobytes())


def onepole(x: np.ndarray, fc: float) -> np.ndarray:
    """Simple one-pole low-pass via FFT-free recursion, vectorised in blocks."""
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc)
        y[i] = acc
    return y


def fft_band(x: np.ndarray, lo: float, hi: float) -> np.ndarray:
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    spec[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(spec, len(x))


def loop_fade(x: np.ndarray, fade: float = 1.0) -> np.ndarray:
    """Crossfade the tail into the head so the clip loops seamlessly."""
    n = int(SR * fade)
    head, tail = x[:n], x[-n:]
    ramp = np.linspace(0, 1, n)
    out = x[:-n].copy()
    out[:n] = head * ramp + tail * (1 - ramp)
    return out


def ambience() -> tuple[np.ndarray, np.ndarray]:
    dur = 13.0
    t = t_of(dur)
    chans = []
    for side in range(2):
        wind = fft_band(rng.standard_normal(len(t)), 80, 700)
        gust = 0.55 + 0.45 * np.sin(2 * np.pi * t / 6.5 + side) * np.sin(2 * np.pi * t / 2.9)
        wind = wind / np.abs(wind).max() * gust * 0.5
        crick = np.zeros_like(t)
        for k in range(3):
            f0 = 4300 + 350 * k + 120 * side
            rate = 14 + 3 * k
            chirp_gate = (np.sin(2 * np.pi * rate * t + k) > 0.2).astype(float)
            phrase = (np.sin(2 * np.pi * t / (1.7 + 0.4 * k) + side + k) > -0.1).astype(float)
            crick += np.sin(2 * np.pi * f0 * t) * chirp_gate * phrase * 0.05
        chans.append(loop_fade(wind + crick))
    return chans[0], chans[1]


def drone() -> tuple[np.ndarray, np.ndarray]:
    dur = 17.0
    t = t_of(dur)
    chans = []
    for side, det in ((0, 0.0), (1, 0.6)):
        sig = np.zeros_like(t)
        for f, a in ((55, 1.0), (55 * 1.5 + det, 0.4), (58.3 + det, 0.5), (110.4, 0.25), (155.6 + det, 0.12)):
            sig += a * np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.11 * t))
        swell = 0.7 + 0.3 * np.sin(2 * np.pi * t / 8.5 + side)
        air = fft_band(rng.standard_normal(len(t)), 300, 1200) * 0.15
        chans.append(loop_fade(sig * swell + air))
    return chans[0], chans[1]


def stinger() -> tuple[np.ndarray, np.ndarray]:
    t = t_of(2.4)
    boom_f = 70 * np.exp(-t / 0.4) + 32
    boom = np.sin(2 * np.pi * np.cumsum(boom_f) / SR) * np.exp(-t / 0.7)
    screech = np.zeros_like(t)
    for f in (1480, 1568, 2093, 2217):  # clustered semitones
        vib = 1 + 0.012 * np.sin(2 * np.pi * 7 * t)
        screech += np.sin(2 * np.pi * np.cumsum(f * vib) / SR)
    screech *= np.minimum(1, t / 0.03) * np.exp(-t / 0.9) * 0.22
    hiss = fft_band(rng.standard_normal(len(t)), 2000, 9000) * np.exp(-t / 0.25) * 0.4
    left = boom + screech + hiss
    right = boom + np.roll(screech, 300) + hiss
    return left, right


def bell(t: np.ndarray, f: float, start: float, amp: float) -> np.ndarray:
    tt = np.clip(t - start, 0, None)
    on = (t >= start).astype(float)
    out = np.zeros_like(t)
    for ratio, a, d in ((1, 1, 0.18), (2.32, 0.6, 0.1), (4.1, 0.35, 0.06), (6.8, 0.2, 0.04)):
        out += a * np.sin(2 * np.pi * f * ratio * tt) * np.exp(-tt / d)
    return out * on * amp


def payal() -> tuple[np.ndarray, np.ndarray]:
    t = t_of(1.6)
    left = np.zeros_like(t)
    right = np.zeros_like(t)
    for step in (0.0, 0.62):
        for _ in range(9):
            f = rng.uniform(3200, 5200)
            s = step + rng.uniform(0, 0.12)
            a = rng.uniform(0.3, 1)
            left += bell(t, f, s, a * rng.uniform(0.4, 1))
            right += bell(t, f, s + 0.004, a * rng.uniform(0.4, 1))
    return left, right


def heartbeat() -> np.ndarray:
    t = t_of(1.3)
    out = np.zeros_like(t)
    for start, amp in ((0.0, 1.0), (0.24, 0.7)):
        tt = np.clip(t - start, 0, None)
        out += (t >= start) * amp * np.sin(2 * np.pi * (48 + 30 * np.exp(-tt / 0.03)) * tt) * np.exp(-tt / 0.09)
    return out


def thud() -> np.ndarray:
    t = t_of(0.9)
    body = np.sin(2 * np.pi * np.cumsum(90 * np.exp(-t / 0.08) + 40) / SR) * np.exp(-t / 0.15)
    dirt = fft_band(rng.standard_normal(len(t)), 200, 2500) * np.exp(-t / 0.05) * 0.6
    return body + dirt


def run() -> tuple[np.ndarray, np.ndarray]:
    t = t_of(2.2)
    left = np.zeros_like(t)
    right = np.zeros_like(t)
    for k, s in enumerate(np.arange(0, 2.1, 0.17)):
        tt = np.clip(t - s, 0, None)
        step = (t >= s) * fft_band(rng.standard_normal(len(t)), 150, 1800) * np.exp(-tt / 0.03)
        thump = (t >= s) * np.sin(2 * np.pi * 70 * tt) * np.exp(-tt / 0.04)
        hit = step * 0.7 + thump
        (left if k % 2 else right)[:] += hit
        (right if k % 2 else left)[:] += hit * 0.5
    return left, right


def owl() -> tuple[np.ndarray, np.ndarray]:
    t = t_of(2.0)
    out = np.zeros_like(t)
    for start, dur, f in ((0.0, 0.35, 410), (0.55, 0.22, 395), (0.85, 0.6, 400)):
        tt = t - start
        on = (tt >= 0) & (tt <= dur)
        env = np.sin(np.pi * np.clip(tt / dur, 0, 1)) ** 2
        fm = f * (1 - 0.06 * np.clip(tt / dur, 0, 1))
        out += on * env * (np.sin(2 * np.pi * fm * tt) + 0.2 * np.sin(4 * np.pi * fm * tt))
    breath = fft_band(rng.standard_normal(len(t)), 300, 900) * 0.04
    out = out + breath * (out != 0)
    return out * 0.9, out * 0.6  # off to the left, far away


def pluck(f: float, dur: float, bright: float = 0.5) -> np.ndarray:
    """Karplus-Strong string, a bit sitar-ish."""
    n = int(SR * dur)
    period = int(SR / f)
    buf = rng.uniform(-1, 1, period)
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % period]
        nxt = buf[(i + 1) % period]
        buf[i % period] = 0.996 * (bright * buf[i % period] + (1 - bright) * nxt)
    return out


def melody(notes: list[tuple[float, float]], total: float) -> np.ndarray:
    t = t_of(total)
    out = np.zeros_like(t)
    for start, f in notes:
        p = pluck(f, min(1.2, total - start))
        i = int(start * SR)
        out[i : i + len(p)] += p[: len(out) - i]
    return out


def comic() -> np.ndarray:
    # D major-ish skip: playful
    notes = [(0, 587.3), (0.14, 740), (0.28, 880), (0.5, 740), (0.64, 880), (0.8, 1175)]
    return melody(notes, 2.2)


def chai() -> np.ndarray:
    notes = [(0, 293.7), (0.25, 440), (0.5, 587.3), (0.9, 554.4), (1.2, 587.3), (1.5, 740), (2.1, 587.3)]
    tanpura = np.zeros_like(t_of(3.6))
    t = t_of(3.6)
    for f in (146.8, 220, 293.7):
        tanpura += 0.08 * np.sin(2 * np.pi * f * t) * np.minimum(1, t / 0.8) * np.minimum(1, (3.6 - t) / 1.0)
    return melody(notes, 3.6) + tanpura


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    write("ambience.wav", *ambience(), peak=0.6)
    write("drone.wav", *drone(), peak=0.6)
    write("stinger.wav", *stinger())
    write("payal.wav", *payal(), peak=0.7)
    write("heartbeat.wav", heartbeat())
    write("thud.wav", thud())
    write("run.wav", *run(), peak=0.7)
    write("owl.wav", *owl(), peak=0.5)
    write("comic.wav", comic(), peak=0.7)
    write("chai.wav", chai(), peak=0.7)
    print("wrote", ", ".join(sorted(p.name for p in OUT.glob("*.wav"))))


if __name__ == "__main__":
    main()
