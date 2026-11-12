"""Make an episode's voices with Microsoft's Hindi neural voices (edge-tts).

Reads episodes/<ep>/lines.json (written by `node engine/build.mjs <ep> --lines`) and writes
episodes/<ep>/assets/vo/<line>.mp3 plus episodes/<ep>/vo.json: each clip's length and a mouth
track (15 levels a second: 0 closed, 1 half open, 2 open) that the rig lip-syncs to.
Clips are cached by text + voice, so re-running only re-voices changed lines.

Usage: python3 engine/voice.py ep01
"""

import asyncio
import hashlib
import json
import os
import pathlib
import ssl
import subprocess
import sys

import edge_tts
import edge_tts.communicate as ec
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
CA = "/root/.ccr/ca-bundle.crt"
if os.path.exists(CA):  # the cloud sandbox's HTTPS proxy
    ec._SSL_CTX = ssl.create_default_context(cafile=CA)

FPS = 15


def envelope(path: pathlib.Path) -> tuple[float, list[int]]:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", "16000", "-f", "s16le", "-"],
        capture_output=True, check=True,
    ).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768
    hop = 16000 // FPS
    n = max(1, len(x) // hop)
    rms = np.array([np.sqrt(np.mean(x[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(n)])
    ref = np.percentile(rms, 90) or 1
    lv = [0 if r < ref * 0.18 else 1 if r < ref * 0.55 else 2 for r in rms]
    # Never hold the mouth open for one frame between closed frames twice in a row: smooth flicker.
    for i in range(1, len(lv) - 1):
        if lv[i - 1] == lv[i + 1] == 0 and lv[i] == 2:
            lv[i] = 1
    return len(x) / 16000, lv


def trim(src: pathlib.Path, dst: pathlib.Path) -> None:
    # Cut leading/trailing silence and shorten long pauses inside the line.
    af = (
        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.03,"
        "areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,"
        "silenceremove=stop_periods=-1:stop_duration=0.32:stop_threshold=-45dB"
    )
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(src), "-af", af, "-ar", "44100", "-ac", "2", "-b:a", "160k", str(dst)],
        check=True,
    )


async def main(ep: str) -> None:
    epdir = ROOT / "episodes" / ep
    lines = json.loads((epdir / "lines.json").read_text())
    out = epdir / "assets" / "vo"
    cache = ROOT / ".cache" / "vo"
    out.mkdir(parents=True, exist_ok=True)
    cache.mkdir(parents=True, exist_ok=True)
    result = {}
    for ln in lines:
        key = hashlib.sha1(json.dumps([ln["say"], ln["voice"], ln["pitch"], ln["rate"]]).encode()).hexdigest()[:12]
        raw = cache / f"{key}.mp3"
        if not raw.exists() or raw.stat().st_size == 0:
            print(f"  voicing {ln['id']} ({ln['who']}): {ln['say']}")
            await edge_tts.Communicate(ln["say"], ln["voice"], pitch=ln["pitch"], rate=ln["rate"]).save(str(raw))
        clip = out / f"{ln['id']}.mp3"
        trim(raw, clip)
        dur, mouth = envelope(clip)
        result[ln["id"]] = {"file": f"assets/vo/{ln['id']}.mp3", "dur": round(dur, 3), "mouth": mouth}
    (epdir / "vo.json").write_text(json.dumps(result, ensure_ascii=False))
    total = sum(v["dur"] for v in result.values())
    print(f"{len(result)} lines, {total:.1f} s of voice -> {epdir / 'vo.json'}")


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1] if len(sys.argv) > 1 else "ep01"))
