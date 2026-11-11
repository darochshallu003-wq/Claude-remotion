"""Bring a recorded (human) voiceover into an explainer.

Takes either ONE continuous take with a clear pause (about 2 s) between the
scene lines, or one file per scene in script order. Any format ffmpeg reads
works (m4a, mp3, wav, ogg, opus, aac, mp4 video...).

For each scene it: cleans the audio (rumble cut, gentle denoise, loudness
normalised to -16 LUFS for Instagram/YouTube), trims the silence at both
ends, shortens long pauses inside a line to 0.3 s, and writes
public/<project>/vo/<scene id>.mp3. Then it runs vo_timing.py so every scene
fits its clip. For the bhaidooj hook it also measures where "इस दिन की असली
कहानी" and "यमराज" start (the last two phrases of the hook) and stores them
in HOOK_CUES, so the darkness and thunder land on those words.

Usage:
  python3 scripts/vo_import.py <project> <one-take audio>
  python3 scripts/vo_import.py <project> <one-take audio> --starts 3.2,14.2,...
  python3 scripts/vo_import.py <project> <clip 1> <clip 2> ...   (script order)

--starts gives the second, in the take, where each scene's line begins (one
per scene, in script order; any point in the pause before the line works).
Use it when the pauses between lines are too short to split on.
"""

import pathlib
import re
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
CLEAN = "highpass=f=80,afftdn=nf=-25,loudnorm=I=-16:TP=-1.5:LRA=11"
KEEP_PAUSE = 0.3  # longest pause kept inside a line, seconds


def run(*args: str) -> str:
    return subprocess.run(args, capture_output=True, text=True, check=True).stderr


def duration(path: pathlib.Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True, check=True,
    )
    return float(out.stdout.strip())


def silences(path: pathlib.Path, min_len: float, noise: str = "-38dB") -> list[tuple[float, float]]:
    log = run("ffmpeg", "-hide_banner", "-i", str(path), "-af", f"silencedetect=n={noise}:d={min_len}", "-f", "null", "-")
    starts = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", log)]
    ends = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", log)]
    return list(zip(starts, ends))


def clean(src: pathlib.Path, dst: pathlib.Path, start: float | None = None, end: float | None = None) -> None:
    cut = []
    if start is not None:
        cut += ["-ss", f"{start:.3f}"]
    if end is not None:
        cut += ["-to", f"{end:.3f}"]
    run(
        "ffmpeg", "-v", "error", "-y", *cut, "-i", str(src), "-ac", "1", "-ar", "44100", "-af",
        f"{CLEAN},silenceremove=start_periods=1:start_threshold=-42dB"
        f":stop_periods=-1:stop_threshold=-42dB:stop_duration={KEEP_PAUSE}:stop_silence={KEEP_PAUSE},"
        # silenceremove leaves the tail pause; trim it by reversing once
        "areverse,silenceremove=start_periods=1:start_threshold=-42dB,areverse,"
        "afade=t=in:d=0.02",
        "-c:a", "libmp3lame", "-q:a", "2", str(dst),
    )


def main() -> None:
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    project = sys.argv[1]
    args = sys.argv[2:]
    starts: list[float] | None = None
    if "--starts" in args:
        k = args.index("--starts")
        starts = [float(x) for x in args[k + 1].split(",")]
        args = args[:k] + args[k + 2 :]
    inputs = [pathlib.Path(a) for a in args]
    script = ROOT / "src" / project / "script.ts"
    out = ROOT / "public" / project / "vo"
    out.mkdir(parents=True, exist_ok=True)
    ids = re.findall(r'id: "([a-z]+)"', script.read_text())

    if len(inputs) == len(ids):
        for i, src in zip(ids, inputs):
            clean(src, out / f"{i}.mp3")
    elif len(inputs) == 1:
        take = inputs[0]
        with tempfile.TemporaryDirectory() as tmp:
            # level the take first so the pause detector sees a steady floor
            norm = pathlib.Path(tmp) / "take.wav"
            run("ffmpeg", "-v", "error", "-y", "-i", str(take), "-ac", "1", "-ar", "44100",
                "-af", "highpass=f=80,afftdn=nf=-25,loudnorm=I=-16:TP=-1.5", str(norm))
            total = duration(norm)
            if starts is not None:
                if len(starts) != len(ids):
                    raise SystemExit(f"--starts needs {len(ids)} times ({', '.join(ids)}), got {len(starts)}")
                for k, i in enumerate(ids):
                    end = starts[k + 1] if k + 1 < len(ids) else total
                    clean(norm, out / f"{i}.mp3", starts[k], end)
                    print(f"{i:10s} {starts[k]:6.2f} → {end:6.2f} s of the take")
            gaps = [] if starts is not None else silences(norm, 0.7)
            # the (scenes - 1) longest pauses are the breaks between lines
            gaps = [g for g in gaps if g[0] > 0.05 and g[1] < total - 0.05]
            if starts is None and len(gaps) < len(ids) - 1:
                raise SystemExit(
                    f"found {len(gaps)} long pauses but need {len(ids) - 1}: leave about 2 seconds "
                    "of silence between lines, or send one file per line"
                )
            breaks = sorted(sorted(gaps, key=lambda g: g[1] - g[0], reverse=True)[: len(ids) - 1])
            bounds = [0.0] + [b for g in breaks for b in g] + [total]
            for k, i in enumerate(ids if starts is None else []):
                s, e = bounds[2 * k], bounds[2 * k + 1]
                clean(norm, out / f"{i}.mp3", max(0.0, s - 0.05), e + 0.05)
                print(f"{i:10s} {s:6.2f} → {e:6.2f} s of the take")
    else:
        raise SystemExit(f"give one take or exactly {len(ids)} clips ({', '.join(ids)}), got {len(inputs)}")

    text = script.read_text()
    if "HOOK_CUES" in text:
        hook = out / "hook.mp3"
        phrases_end = [s for s, _ in silences(hook, 0.15, "-40dB")]
        starts = [e for _, e in silences(hook, 0.15, "-40dB")]
        if len(starts) >= 2:
            story, yamraj = starts[-2], starts[-1]
            text = re.sub(r"HOOK_CUES = \{[^}]*\}", f"HOOK_CUES = {{ story: {story:.2f}, yamraj: {yamraj:.2f} }}", text)
            script.write_text(text)
            print(f"hook cues: story {story:.2f} s, yamraj {yamraj:.2f} s (of {duration(hook):.2f} s)")
        else:
            print(f"hook: only {len(phrases_end) + 1} phrase(s) found; pause briefly before \"यमराज\". Cues left as they were.")

    subprocess.run([sys.executable, str(ROOT / "scripts" / "vo_timing.py"), project], check=True)


if __name__ == "__main__":
    main()
