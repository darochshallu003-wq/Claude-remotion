"""A tiny writer for GSAP timeline code, so scene timings come straight from tools/timing.json."""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
TIMING = {s["id"]: s for s in json.loads((ROOT / "tools/timing.json").read_text())["scenes"]}


def js(v):
    return json.dumps(v)


class TL:
    def __init__(self, sid):
        self.sid = sid
        self.t = TIMING[sid]
        self.lines = []
        self.tweens = []
        self.pre = []

    def L(self, i, end=False):
        """Start (or end) of sentence i, in scene seconds."""
        return self.t["lines"][i]["end" if end else "start"]

    @property
    def slot(self):
        return self.t["slot"]

    def ft(self, sel, frm, to, at):
        self.tweens.append((at, sel, frm))
        to = {**to, "immediateRender": False}
        self.lines.append(f"tl.fromTo({js(sel)}, {js(frm)}, {js(to)}, {at:.3f});")

    def set(self, sel, props, at):
        if at == 0:
            self.pre.append(f"gsap.set({js(sel)}, {js(props)});")
        else:
            self.lines.append(f"tl.set({js(sel)}, {js(props)}, {at:.3f});")

    def blink(self, p, times):
        for t in times:
            self.ft(f"#{p}-eyes", {"scaleY": 1, "svgOrigin": "0 -9"}, {"scaleY": 0.1, "duration": 0.07, "ease": "power1.in"}, t)
            self.ft(f"#{p}-eyes", {"scaleY": 0.1, "svgOrigin": "0 -9"}, {"scaleY": 1, "duration": 0.09, "ease": "power1.out"}, t + 0.08)

    def breathe(self, sel, start, end, origin="0 0", amt=0.025, period=4.0, prop="scaleY"):
        n = max(1, int((end - start) / (period / 2)) - 1)
        self.ft(sel, {prop: 1, "svgOrigin": origin},
                {prop: 1 + amt, "duration": period / 2, "ease": "sine.inOut", "yoyo": True, "repeat": n}, start)

    def eyes_close(self, p, at, dur=0.6):
        self.ft(f"#{p}-eyes", {"opacity": 1}, {"opacity": 0, "duration": dur * 0.5}, at)
        self.ft(f"#{p}-eyesc", {"opacity": 0}, {"opacity": 1, "duration": dur * 0.5}, at + dur * 0.4)

    def eyes_open(self, p, at, dur=0.4):
        self.ft(f"#{p}-eyesc", {"opacity": 1}, {"opacity": 0, "duration": dur * 0.5}, at)
        self.ft(f"#{p}-eyes", {"opacity": 0}, {"opacity": 1, "duration": dur * 0.5}, at + dur * 0.3)

    def talk(self, sel, start, end, origin, amt=1.8, beat=0.17):
        n = max(1, int((end - start) / beat) - 1)
        if n % 2 == 0:
            n -= 1  # odd repeat count ends closed
        self.ft(sel, {"scaleY": 1, "svgOrigin": origin},
                {"scaleY": amt, "duration": beat, "ease": "sine.inOut", "yoyo": True, "repeat": max(1, n)}, start)

    def dip_out(self, sid):
        """Darken the last 0.5 s of the scene, so the cut reads as meant."""
        self.ft(f"#{sid}-dip", {"opacity": 0}, {"opacity": 0.55, "duration": 0.5, "ease": "power2.in"}, self.slot - 0.55)

    def dip_in(self, sid, dur=0.8):
        self.ft(f"#{sid}-dip", {"opacity": 0.85}, {"opacity": 0, "duration": dur, "ease": "power2.out"}, 0)

    def baselines(self):
        """One tl.set at 0 per target holding the earliest from-value of every tweened property,
        so a seek to any time before a tween shows the right resting state."""
        base = {}
        for at, sel, frm in sorted(self.tweens, key=lambda x: x[0]):
            b = base.setdefault(sel, {})
            for k, v in frm.items():
                if k == "attr":
                    a = b.setdefault("attr", {})
                    for ak, av in v.items():
                        a.setdefault(ak, av)
                else:
                    b.setdefault(k, v)
        return [f"gsap.set({js(sel)}, {js(b)});" for sel, b in base.items()]

    def code(self):
        return "\n    ".join(self.baselines() + self.pre + self.lines)


def scene_html(sid, svg_body, tl, extra_css="", overlay_html=""):
    from kit import BASE_CSS
    return f"""<template>
  <style>
{BASE_CSS}
{extra_css}
  </style>
  <div id="root" data-composition-id="{sid}" data-width="1920" data-height="1080" data-layout-allow-overflow>
    <div class="cam" id="{sid}-camd">
    <svg class="stage" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
{svg_body}
    </svg>
    </div>
    {overlay_html}
    <div class="grain"></div>
    <div class="dip" id="{sid}-dip"></div>
  </div>
  <script>
    const tl = gsap.timeline({{ paused: true }});
    {tl.code()}
    tl.set({{}}, {{}}, {tl.slot:.3f});
    window.__timelines["{sid}"] = tl;
  </script>
</template>
"""
