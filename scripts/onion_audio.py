"""Synthesize the music bed and sound effects for the OnionExplainer video.

Writes 44.1 kHz stereo WAVs to public/onion/:
  music.wav   ~2 min mysterious "science documentary" groove (D minor, 92 BPM)
  thud.wav    stamp slam
  slice.wav   knife slice
  tick.wav    typewriter tick
  sparkle.wav short shimmer for reveals

Everything is generated from scratch with numpy, so there are no licensing
questions. Usage: python3 scripts/onion_audio.py [seconds]
"""

import pathlib
import sys
import wave

import numpy as np

SR = 44100
OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "onion"
rng = np.random.default_rng(11)


def write(name: str, left: np.ndarray, right: np.ndarray | None = None, peak=0.89):
    right = left if right is None else right
    st = np.stack([left, right], axis=1)
    st = st / max(1e-9, np.abs(st).max()) * peak
    with wave.open(str(OUT / name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def onepole(x: np.ndarray, fc: float) -> np.ndarray:
    """Cheap one-pole low-pass, vectorised via an IIR on blocks."""
    a = np.exp(-2 * np.pi * fc / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a) * x[i] + a * acc
        y[i] = acc
    return y


def midi(n: float) -> float:
    return 440.0 * 2 ** ((n - 69) / 12)


def saw(freq: float, t: np.ndarray) -> np.ndarray:
    ph = (freq * t) % 1.0
    return 2 * ph - 1


def adsr(n: int, a=0.01, d=0.1, s=0.7, r=0.2) -> np.ndarray:
    t = np.arange(n) / SR
    dur = n / SR
    env = np.where(
        t < a,
        t / max(a, 1e-6),
        np.where(t < a + d, 1 - (1 - s) * (t - a) / max(d, 1e-6), s),
    )
    rel = np.clip((dur - t) / max(r, 1e-6), 0, 1)
    return env * rel


def reverb(x: np.ndarray, mix=0.25) -> np.ndarray:
    out = x.copy()
    for delay_ms, g in ((29.7, 0.5), (37.1, 0.45), (41.1, 0.42), (43.7, 0.4)):
        d = int(SR * delay_ms / 1000)
        buf = np.zeros(len(x) + d)
        y = np.zeros_like(x)
        for i in range(0, len(x), d):
            seg = x[i : i + d] + g * buf[i : i + d][: len(x[i : i + d])]
            y[i : i + d] = seg
            buf[i + d : i + 2 * d][: len(seg)] = seg
        out += mix * 0.25 * y
    return out


def music(seconds: float) -> tuple[np.ndarray, np.ndarray]:
    bpm = 92
    beat = 60 / bpm
    bar = 4 * beat
    n = int(SR * seconds)
    L = np.zeros(n)
    R = np.zeros(n)
    # Dm - Bb - F - C, one chord per bar
    chords = [[62, 65, 69], [58, 62, 65], [57, 60, 65], [55, 60, 64]]
    roots = [38, 34, 41, 36]
    bars = int(np.ceil(seconds / bar))
    for b in range(bars):
        c = chords[b % 4]
        start = int(b * bar * SR)
        length = int(bar * SR)
        if start >= n:
            break
        seg_t = np.arange(length) / SR
        # pad: detuned saws, low-passed; each chord rings 0.8 s into the
        # next bar so consecutive chords crossfade instead of gapping
        plen = length + int(0.8 * SR)
        pt = np.arange(plen) / SR
        pad = np.zeros(plen)
        for note in c:
            for det in (-0.08, 0.08):
                pad += saw(midi(note + det), pt)
        pad = onepole(pad, 900) * adsr(plen, a=0.5, d=0.5, s=0.85, r=0.9) * 0.05
        pe = min(n, start + plen)
        L[start:pe] += pad[: pe - start]
        R[start:pe] += pad[: pe - start]
        pad = np.zeros(length)
        # bass: sine root, pulses on beats 1 and 3
        bass = np.zeros(length)
        for k in (0, 2):
            s0 = int(k * beat * SR)
            ln = int(beat * 1.6 * SR)
            tt = np.arange(ln) / SR
            tone = np.sin(2 * np.pi * midi(roots[b % 4]) * tt) * np.exp(-tt / 0.6)
            bass[s0 : s0 + ln] += tone[: length - s0] * 0.22
        # pluck arpeggio on eighths (from bar 2 on)
        arp = np.zeros(length)
        if b >= 1:
            pattern = [0, 1, 2, 1, 2, 0, 1, 2]
            for k, idx in enumerate(pattern):
                s0 = int(k * beat / 2 * SR)
                ln = int(0.35 * SR)
                tt = np.arange(ln) / SR
                f = midi(c[idx] + 12)
                tone = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt / 0.12)
                arp[s0 : s0 + ln] += tone[: max(0, length - s0)][: ln] * 0.07
        end = min(n, start + length)
        m = end - start
        L[start:end] += pad[:m] + bass[:m] + arp[:m] * 0.8
        R[start:end] += pad[:m] + bass[:m] + arp[:m] * 1.2
        # soft kick + shaker from bar 3
        if b >= 2:
            for k in range(4):
                s0 = start + int(k * beat * SR)
                if s0 >= n:
                    break
                if k in (0, 2):
                    ln = int(0.25 * SR)
                    tt = np.arange(ln) / SR
                    kick = np.sin(2 * np.pi * (45 + 80 * np.exp(-tt / 0.03)) * tt) * np.exp(-tt / 0.09) * 0.35
                    e = min(n, s0 + ln)
                    L[s0:e] += kick[: e - s0]
                    R[s0:e] += kick[: e - s0]
                for half in (0.5,):
                    s1 = start + int((k + half) * beat * SR)
                    if s1 >= n:
                        break
                    ln = int(0.06 * SR)
                    sh = rng.standard_normal(ln) * np.exp(-np.arange(ln) / SR / 0.015) * 0.025
                    sh -= onepole(sh, 4000)
                    e = min(n, s1 + ln)
                    L[s1:e] += sh[: e - s1] * 0.8
                    R[s1:e] += sh[: e - s1] * 1.2
    L, R = reverb(L), reverb(R)
    # gentle fade in / out
    fade = np.ones(n)
    fi, fo = int(1.5 * SR), int(3 * SR)
    fade[:fi] = np.linspace(0, 1, fi)
    fade[-fo:] = np.linspace(1, 0, fo)
    return L * fade, R * fade


def thud() -> np.ndarray:
    t = np.arange(int(0.45 * SR)) / SR
    body = np.sin(2 * np.pi * (60 + 120 * np.exp(-t / 0.02)) * t) * np.exp(-t / 0.12)
    slap = rng.standard_normal(len(t)) * np.exp(-t / 0.012)
    slap = onepole(slap, 2500)
    return body + 0.6 * slap


def slice_() -> np.ndarray:
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    hp = noise - onepole(noise, 2500)
    env = np.sin(np.pi * np.clip(t / 0.35, 0, 1)) ** 2 * np.exp(-t / 0.2)
    ring = np.sin(2 * np.pi * 3400 * t) * np.exp(-t / 0.15) * 0.15
    return hp * env + ring


def tick() -> np.ndarray:
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    click = rng.standard_normal(n) * np.exp(-t / 0.004)
    return click - onepole(click, 1500) + 0.3 * np.sin(2 * np.pi * 1800 * t) * np.exp(-t / 0.01)


def sparkle() -> np.ndarray:
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for k, f in enumerate((2093, 2637, 3136, 4186)):
        s = int(k * 0.06 * SR)
        tt = t[: n - s]
        out[s:] += np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.25) * (0.8 ** k)
    return out


def main() -> None:
    seconds = float(sys.argv[1]) if len(sys.argv) > 1 else 120
    OUT.mkdir(parents=True, exist_ok=True)
    write("music.wav", *music(seconds), peak=0.7)
    write("thud.wav", thud())
    write("slice.wav", slice_())
    write("tick.wav", tick(), peak=0.6)
    write("sparkle.wav", sparkle(), peak=0.6)
    print("wrote", ", ".join(sorted(p.name for p in OUT.glob("*.wav"))))


if __name__ == "__main__":
    main()
