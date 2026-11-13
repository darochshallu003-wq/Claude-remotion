"""Narrate tools/script.json with the local Kokoro voice (the same model `hyperframes tts` uses).

Each sentence is spoken on its own, then joined with a fixed pause, so every
sentence's start time is known exactly. Writes:
  assets/voice/<scene>.wav   one narration file per scene
  tools/timing.json          scene durations and sentence start/end times
Usage: python3 tools/vo.py
"""
import json, pathlib
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = pathlib.Path(__file__).resolve().parent.parent
CACHE = pathlib.Path.home() / ".cache/hyperframes/tts"
cfg = json.loads((ROOT / "tools/script.json").read_text())
k = Kokoro(str(CACHE / "models/kokoro-v1.0.onnx"), str(CACHE / "voices/voices-v1.0.bin"))
out = ROOT / "assets/voice"
out.mkdir(parents=True, exist_ok=True)

timing = {"scenes": []}
for sc in cfg["scenes"]:
    parts, t, lines = [], 0.35, []
    sr = 24000
    parts.append(np.zeros(int(0.35 * sr), dtype=np.float32))
    for i, line in enumerate(sc["lines"]):
        gap = cfg["sentence_gap"]
        if sc["id"] == "s14-goodnight":
            gap = 1.3  # the goodnights are slow
        audio, sr = k.create(line, voice=cfg["voice"], speed=cfg["speed"], lang="en-us")
        # trim leading/trailing near-silence so the pauses are ours
        idx = np.where(np.abs(audio) > 0.01)[0]
        if len(idx):
            audio = audio[max(0, idx[0] - 240): idx[-1] + 2400]
        d = len(audio) / sr
        lines.append({"text": line, "start": round(t, 3), "end": round(t + d, 3)})
        parts.append(audio.astype(np.float32))
        t += d
        if i < len(sc["lines"]) - 1:
            parts.append(np.zeros(int(gap * sr), dtype=np.float32))
            t += gap
    audio = np.concatenate(parts)
    peak = np.max(np.abs(audio))
    audio = audio * (0.85 / peak)  # about -1.4 dBFS peak
    sf.write(out / f"{sc['id']}.wav", audio, sr)
    dur = len(audio) / sr
    timing["scenes"].append({"id": sc["id"], "voice": round(dur, 3),
                             "slot": round(dur + cfg["scene_tail"], 3), "lines": lines})
    print(sc["id"], round(dur, 2))

(ROOT / "tools/timing.json").write_text(json.dumps(timing, indent=1, ensure_ascii=False))
print("total", round(sum(s["slot"] for s in timing["scenes"]), 1))
