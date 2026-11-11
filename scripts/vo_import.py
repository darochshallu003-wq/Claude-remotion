"""Bring a recorded (human) voiceover into an explainer.

Takes either ONE continuous take with a clear pause (about 2 s) between the
scene lines, or one file per scene in script order. Any format ffmpeg reads
works (m4a, mp3, wav, ogg, opus, aac, mp4 video...).

Processing is deliberately light, so the voice keeps its clarity:
  1. master the whole take once: rumble cut, gentle denoise only if the
     take is noisy (floor above -50 dB), room-echo reduction (WPE
     dereverberation, then a downward expander that pulls echo tails down
     after each word), a little EQ (less boom and mud, more presence and
     air, since phone recordings are often dull), then two-pass linear
     loudness normalisation to -16 LUFS / -1.5 dBTP. No compressor: it
     would lift the echo tails back up;
  2. cut each scene's line out of the mastered take;
  3. trim the silence at both ends and shorten pauses longer than 0.45 s
     to 0.3 s with short fades, so no word is clipped;
  4. write public/<project>/vo/<scene id>.mp3 at 256 kbps and run
     vo_timing.py so every scene fits its clip.
For the bhaidooj hook it also measures where "इस दिन की असली कहानी" and
"यमराज" start (the last two phrases of the hook) and stores them in
HOOK_CUES, so the darkness and thunder land on those words.

Usage:
  python3 scripts/vo_import.py <project> <one-take audio>
  python3 scripts/vo_import.py <project> <one-take audio> --starts 3.2,14.2,...
  python3 scripts/vo_import.py <project> <clip 1> <clip 2> ...   (script order)

--starts gives the second, in the take, where each scene's line begins (one
per scene, in script order; any point in the pause before the line works).
Use it when the pauses between lines are too short to split on.
--no-dereverb skips the echo reduction (for a take recorded somewhere dry).

Needs: pip install numpy soundfile nara_wpe
"""

import json
import pathlib
import re
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf

ROOT = pathlib.Path(__file__).resolve().parent.parent
SR = 48000
KEEP_PAUSE = 0.3  # pauses inside a line are shortened to this, seconds
MIN_PAUSE = 0.45  # ...if they are longer than this
EDGE_PAD = 0.08  # silence kept before the first and after the last word
FADE = 0.015
DEREVERB = True


def wpe_dereverb(x: np.ndarray) -> np.ndarray:
    """Weighted prediction error dereverberation (single channel)."""
    from nara_wpe.utils import istft, stft
    from nara_wpe.wpe import wpe

    size, shift = 2048, 512
    Y = stft(x[None, :], size=size, shift=shift).transpose(2, 0, 1)  # F x D x T
    Z = wpe(Y, taps=10, delay=2, iterations=3, statistics_mode="full").transpose(1, 2, 0)
    z = istft(Z, size=size, shift=shift)[0]
    return z[: len(x)] if len(z) >= len(x) else np.pad(z, (0, len(x) - len(z)))


def expand(x: np.ndarray, sr: int, below: float = 10.0, ratio: float = 3.0, max_cut: float = 18.0,
           look: float = 0.30, att: float = 0.004, rel: float = 0.05) -> np.ndarray:
    """Downward expander keyed to recent speech level: sound more than `below`
    dB under the loudest level of the last `look` s (echo tails, room tone)
    is pushed down by `ratio`, by at most `max_cut` dB."""
    step = 0.005
    hop = int(step * sr)
    n = len(x) // hop + 1
    xp = np.pad(x, (0, n * hop - len(x)))
    db = 20 * np.log10(np.sqrt(np.mean(xp.reshape(n, hop) ** 2, 1)) + 1e-9)
    w = int(look / step)
    ref = np.array([db[max(0, i - w) : i + 1].max() for i in range(n)])
    target = -np.minimum(np.clip(ref - below - db, 0, None) * (ratio - 1), max_cut)
    g = np.zeros(n)
    a, r = np.exp(-step / att), np.exp(-step / rel)
    for i in range(n):
        prev = g[i - 1] if i else 0.0
        coef = a if target[i] > prev else r
        g[i] = coef * prev + (1 - coef) * target[i]
    return x * np.repeat(10 ** (g / 20), hop)[: len(x)]


def ff(*args: str) -> str:
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *args], capture_output=True, text=True, check=True).stderr


def noise_floor_db(path: pathlib.Path) -> float:
    x, sr = sf.read(str(path))
    frame = int(0.03 * sr)
    n = len(x) // frame
    rms = np.sqrt(np.mean(x[: n * frame].reshape(n, frame) ** 2, axis=1) + 1e-12)
    return float(np.percentile(20 * np.log10(rms), 10))


def master(src: pathlib.Path, dst: pathlib.Path) -> None:
    """Light, transparent clean-up of a whole take into a 48 kHz mono wav."""
    with tempfile.TemporaryDirectory() as tmp:
        raw = pathlib.Path(tmp) / "raw.wav"
        ff("-y", "-i", str(src), "-ac", "1", "-ar", str(SR), str(raw))
        floor = noise_floor_db(raw)
        # denoise only noisy takes: on a quiet one it just adds watery artefacts
        nf = max(-80.0, min(-20.0, floor + 3))
        denoise = f"afftdn=nf={nf:.0f}:nr=6:tn=1," if floor > -50 else ""
        pre = pathlib.Path(tmp) / "pre.wav"
        ff("-y", "-i", str(raw), "-af", f"highpass=f=70,{denoise}anull", str(pre))
        if DEREVERB:
            x, _ = sf.read(str(pre))
            y = expand(wpe_dereverb(x), SR)
            sf.write(str(pre), y / (np.abs(y).max() + 1e-9) * 0.9, SR, subtype="FLOAT")
        chain = (
            "equalizer=f=180:t=q:w=1.0:g=-2,"
            "equalizer=f=320:t=q:w=1.0:g=-2.5,"
            "equalizer=f=3200:t=q:w=1.2:g=3.5,"
            "highshelf=f=8000:g=2.5"
        )
        shaped = pathlib.Path(tmp) / "shaped.wav"
        ff("-y", "-i", str(pre), "-af", chain, str(shaped))
        # two-pass loudnorm: measure, then apply as one linear gain
        log = ff("-i", str(shaped), "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-")
        m = json.loads(log[log.rindex("{") : log.rindex("}") + 1])
        ff(
            "-y", "-i", str(shaped), "-af",
            "loudnorm=I=-16:TP=-1.5:LRA=11:linear=true"
            f":measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
            f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}",
            "-ar", str(SR), str(dst),
        )
        print(f"mastered take: noise floor {floor:.1f} dB, "
              f"{'denoise at %.0f dB' % nf if denoise else 'no denoise needed'}, "
              f"{'echo reduced' if DEREVERB else 'no echo reduction'}, "
              f"{m['input_i']} → -16 LUFS")


def speech_mask(x: np.ndarray, sr: int, floor: float) -> np.ndarray:
    frame = int(0.02 * sr)
    n = len(x) // frame
    rms = np.sqrt(np.mean(x[: n * frame].reshape(n, frame) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms)
    # speech = clearly above the noise floor AND within 25 dB of the speaking
    # level, so breaths and room tone between lines count as pauses
    loud = db > max(floor + 14, float(np.percentile(db, 95)) - 25)
    # bridge tiny dips (between syllables) shorter than 120 ms
    k = 0
    while k < n:
        if not loud[k]:
            j = k
            while j < n and not loud[j]:
                j += 1
            if j - k < 6 and k > 0 and j < n:
                loud[k:j] = True
            k = j
        else:
            k += 1
    return np.repeat(loud, frame)[: len(x)] if n else np.zeros(len(x), bool)


def tighten(x: np.ndarray, sr: int, floor: float) -> np.ndarray:
    """Trim the ends and shorten long pauses, with short fades at every cut."""
    mask = speech_mask(x, sr, floor)
    idx = np.flatnonzero(mask)
    if not len(idx):
        return x
    start = max(0, idx[0] - int(EDGE_PAD * sr))
    end = min(len(x), idx[-1] + int(EDGE_PAD * sr))
    x, mask = x[start:end], mask[start:end]
    fade = int(FADE * sr)
    ramp = np.linspace(0, 1, fade)
    out: list[np.ndarray] = []
    k, n = 0, len(x)
    while k < n:
        j = k
        if mask[k]:
            while j < n and mask[j]:
                j += 1
            out.append(x[k:j])
        else:
            while j < n and not mask[j]:
                j += 1
            gap = x[k:j]
            if len(gap) > MIN_PAUSE * sr:
                half = int(KEEP_PAUSE * sr / 2)
                a, b = gap[:half].copy(), gap[-half:].copy()
                a[-fade:] *= ramp[::-1]
                b[:fade] *= ramp
                gap = np.concatenate([a, b])
            out.append(gap)
        k = j
    y = np.concatenate(out)
    y[:fade] *= ramp
    y[-fade:] *= ramp[::-1]
    return y


def write_clip(y: np.ndarray, sr: int, dst: pathlib.Path) -> None:
    with tempfile.TemporaryDirectory() as tmp:
        wav = pathlib.Path(tmp) / "clip.wav"
        sf.write(str(wav), y, sr, subtype="PCM_24")
        ff("-y", "-i", str(wav), "-c:a", "libmp3lame", "-b:a", "256k", str(dst))


def phrase_starts(y: np.ndarray, sr: int, floor: float) -> list[float]:
    mask = speech_mask(y, sr, floor)
    edges = np.flatnonzero(np.diff(mask.astype(int)) == 1) + 1
    starts = ([0] if mask[0] else []) + list(edges)
    # keep phrase starts that follow at least 0.15 s of silence
    keep = []
    for s in starts:
        if s == 0 or not mask[max(0, s - int(0.15 * sr)) : s].any():
            keep.append(s / sr)
    return keep


def main() -> None:
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    project = sys.argv[1]
    args = sys.argv[2:]
    if "--no-dereverb" in args:
        global DEREVERB
        DEREVERB = False
        args.remove("--no-dereverb")
    starts: list[float] | None = None
    if "--starts" in args:
        k = args.index("--starts")
        starts = [float(v) for v in args[k + 1].split(",")]
        args = args[:k] + args[k + 2 :]
    inputs = [pathlib.Path(a) for a in args]
    script = ROOT / "src" / project / "script.ts"
    out = ROOT / "public" / project / "vo"
    out.mkdir(parents=True, exist_ok=True)
    ids = re.findall(r'id: "([a-z]+)"', script.read_text())
    clips: dict[str, np.ndarray] = {}

    with tempfile.TemporaryDirectory() as tmp:
        if len(inputs) == len(ids) and starts is None:
            for i, src in zip(ids, inputs):
                m = pathlib.Path(tmp) / f"{i}.wav"
                master(src, m)
                x, _ = sf.read(str(m))
                clips[i] = x
            floor = min(noise_floor_db(pathlib.Path(tmp) / f"{i}.wav") for i in ids)
        elif len(inputs) == 1:
            m = pathlib.Path(tmp) / "take.wav"
            master(inputs[0], m)
            x, _ = sf.read(str(m))
            floor = noise_floor_db(m)
            total = len(x) / SR
            if starts is None:
                mask = speech_mask(x, SR, floor)
                # pauses of at least 0.7 s; the (scenes - 1) longest split the lines
                gaps = []
                k = 0
                while k < len(mask):
                    if not mask[k]:
                        j = k
                        while j < len(mask) and not mask[j]:
                            j += 1
                        if k > 0 and j < len(mask) and (j - k) / SR >= 0.7:
                            gaps.append((k / SR, j / SR))
                        k = j
                    else:
                        k += 1
                if len(gaps) < len(ids) - 1:
                    raise SystemExit(
                        f"found {len(gaps)} long pauses but need {len(ids) - 1}: leave about 2 seconds "
                        "of silence between lines, pass --starts, or send one file per line"
                    )
                breaks = sorted(sorted(gaps, key=lambda g: g[1] - g[0], reverse=True)[: len(ids) - 1])
                starts = [0.0] + [(a + b) / 2 for a, b in breaks]
            if len(starts) != len(ids):
                raise SystemExit(f"--starts needs {len(ids)} times ({', '.join(ids)}), got {len(starts)}")
            for k, i in enumerate(ids):
                end = starts[k + 1] if k + 1 < len(ids) else total
                clips[i] = x[int(starts[k] * SR) : int(end * SR)]
                print(f"{i:10s} {starts[k]:6.2f} → {end:6.2f} s of the take")
        else:
            raise SystemExit(f"give one take or exactly {len(ids)} clips ({', '.join(ids)}), got {len(inputs)}")

    for i, x in clips.items():
        y = tighten(x, SR, floor)
        write_clip(y, SR, out / f"{i}.mp3")
        clips[i] = y

    text = script.read_text()
    if "HOOK_CUES" in text and "hook" in clips:
        ph = phrase_starts(clips["hook"], SR, floor)
        if len(ph) >= 3:
            story, yamraj = ph[-2], ph[-1]
            text = re.sub(r"HOOK_CUES = \{[^}]*\}", f"HOOK_CUES = {{ story: {story:.2f}, yamraj: {yamraj:.2f} }}", text)
            script.write_text(text)
            print(f"hook cues: story {story:.2f} s, yamraj {yamraj:.2f} s (of {len(clips['hook']) / SR:.2f} s)")
        else:
            print('hook: too few phrases found; pause briefly before "यमराज". Cues left as they were.')

    subprocess.run([sys.executable, str(ROOT / "scripts" / "vo_timing.py"), project], check=True)


if __name__ == "__main__":
    main()
