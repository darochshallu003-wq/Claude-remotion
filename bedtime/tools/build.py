"""Assemble the HyperFrames composition from the story and its narration.

Usage: python3 tools/build.py
Reads tools/story.py, tools/template.html and moonlight/assets/vo/words.json
(from tools/vo.py), then writes:
  moonlight/index.html        — the composition, with every clip timed to the voice
  moonlight/assets/lullaby.wav — background music sized to the film
  youtube-chapters.txt        — chapter list for the YouTube description
"""

import html
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PROJ = os.path.join(ROOT, "moonlight")
sys.path.insert(0, HERE)
from story import STORY  # noqa: E402

LEAD = 0.6   # silence before the voice starts in a scene
TAIL = 1.0   # pause after the voice ends
XFADE = 1.0  # each clip runs this long into the next scene while it fades in


def norm(w):
    return re.sub(r"[^a-z0-9']", "", w.lower().replace("’", "'"))


def word_time(words, start, word, n=1):
    for w, t in words:
        if norm(w) == norm(word):
            n -= 1
            if n == 0:
                return start + t
    raise KeyError(word)


def caption_html(cap):
    out = []
    for part in re.split(r"(\s+)", cap):
        if not part:
            continue
        if part.isspace():
            out.append(" ")
        else:
            out.append(f'<span class="w">{html.escape(part)}</span>')
    return "".join(out)


def fmt(t):
    t = int(round(t))
    return f"{t // 60}:{t % 60:02d}"


def main():
    words = json.load(open(os.path.join(PROJ, "assets", "vo", "words.json")))
    scenes, t = [], 0.0
    for sc in STORY:
        sid = sc["id"]
        vd = words[sid + "_dur"]
        if sid == "title":
            vo, dur = t + 2.2, 7.5
        elif sid == "end":
            vo, dur = t + 0.8, 8.0
        else:
            vo, dur = t + LEAD, LEAD + vd + TAIL
        scenes.append(dict(id=sid, start=round(t, 3), dur=round(dur, 3), vo=round(vo, 3), vodur=vd,
                           cap=sc["cap"], chapter=sc.get("chapter")))
        t += dur
    total = round(t, 3)

    blocks, audio = [], []
    for i, s in enumerate(scenes):
        last = i == len(scenes) - 1
        clip_dur = s["dur"] if last else s["dur"] + XFADE
        inner = f'<svg viewBox="0 0 1920 1080"><g id="art-{s["id"]}"></g></svg>'
        if s["id"] == "title":
            inner += ('<div class="title-wrap"><div class="t-small">a bedtime story</div>'
                      '<div class="t-big">Bramble</div><div class="t-sub">and the Little Lost Star</div></div>')
        elif s["id"] == "end":
            inner = ('<div class="end-wrap"><div class="end-title">The End</div>'
                     '<div class="end-sub">sweet dreams</div>'
                     '<div class="end-credit">Bramble and the Little Lost Star</div></div>')
        if s["cap"]:
            inner += f'<div class="shade"></div><div class="cap" id="cap-{s["id"]}">{caption_html(s["cap"])}</div>'
        blocks.append(
            f'      <div id="sc-{s["id"]}" class="clip scene" data-start="{s["start"]}" '
            f'data-duration="{clip_dur:.3f}" data-track-index="{1 + i % 2}">\n        {inner}\n      </div>'
        )
        audio.append(
            f'      <audio id="vo-{s["id"]}" src="assets/vo/{s["id"]}.mp3" data-start="{s["vo"]}" '
            f'data-duration="{s["vodur"]}" data-volume="1" data-track-index="{4 + i % 2}"></audio>'
        )
    audio.append(
        f'      <audio id="music" src="assets/lullaby.wav" data-start="0" data-duration="{total}" '
        f'data-volume="0.4" data-track-index="3"></audio>'
    )

    data = dict(
        total=total,
        scenes=[{k: s[k] for k in ("id", "start", "dur", "vo", "vodur")} for s in scenes],
        words={s["id"]: words[s["id"]] for s in scenes},
    )
    tpl = open(os.path.join(HERE, "template.html")).read()
    out = (tpl.replace("__TOTAL__", str(total))
              .replace("__SCENES__", "\n".join(blocks))
              .replace("__AUDIO__", "\n".join(audio))
              .replace("__DATA__", json.dumps(data, separators=(",", ":"))))
    open(os.path.join(PROJ, "index.html"), "w").write(out)

    # Music: sparkle chimes on the star's big moments.
    by = {s["id"]: s for s in scenes}
    sparkles = [
        word_time(words["plink"], by["plink"]["vo"], "plink"),
        word_time(words["stones"], by["stones"]["vo"], "brightest"),
        word_time(words["home"], by["home"]["vo"], "sparkled"),
        word_time(words["wave"], by["wave"]["vo"], "twinkled"),
    ]
    subprocess.run([sys.executable, os.path.join(HERE, "lullaby.py"), os.path.join(PROJ, "assets", "lullaby.wav"),
                    str(total), json.dumps(sparkles)], check=True)

    lines = [f"{fmt(s['start'])} {s['chapter']}" for s in scenes if s["chapter"]]
    lines[0] = "0:00 " + lines[0].split(" ", 1)[1]
    open(os.path.join(ROOT, "youtube-chapters.txt"), "w").write("\n".join(lines) + "\n")

    for s in scenes:
        print(f"{s['id']:<12} {fmt(s['start']):>5}  {s['dur']:5.2f}s")
    print(f"total {total:.1f}s ({fmt(total)})")


if __name__ == "__main__":
    main()
