"""Render the YouTube thumbnail (1280x720 PNG) from the film's own artwork.

Usage: python3 tools/thumbnail.py
Builds thumbnail/thumbnail.html from the art functions in tools/template.html,
then screenshots it with the pre-installed Playwright Chromium.
"""

import os
import re
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "thumbnail")

tpl = open(os.path.join(HERE, "template.html")).read()
defs = re.search(r"<defs>.*?</defs>", tpl, re.S).group(0)
art = tpl[tpl.index("      function starPath"):tpl.index("      // =====", tpl.index("function bearM"))]

page = f"""<!doctype html>
<html><head><meta charset="utf-8" />
<style>
@font-face {{ font-family: "FrauncesThumb"; src: url("fonts/Fraunces-700.woff2") format("woff2"); font-weight: 700; }}
@font-face {{ font-family: "FrauncesThumb"; src: url("fonts/Fraunces-400-italic.woff2") format("woff2"); font-weight: 400; font-style: italic; }}
html, body {{ margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #0b0e30; }}
#stage {{ position: relative; width: 1920px; height: 1080px;
  background: radial-gradient(ellipse at 70% 30%, #2c3280 0%, #1a1f5c 45%, #0b0e30 100%); font-family: "FrauncesThumb", Georgia, serif; }}
svg {{ position: absolute; inset: 0; }}
.title {{ position: absolute; left: 90px; top: 70px; color: #fff4d6; }}
.pill {{ display: inline-block; padding: 12px 34px; border-radius: 999px; background: #ffd36b; color: #241a4a;
  font-size: 46px; font-style: italic; font-weight: 400; letter-spacing: 0.02em; }}
.big {{ font-size: 230px; font-weight: 700; line-height: 0.95; margin-top: 18px; letter-spacing: -0.02em;
  text-shadow: 0 6px 0 #241a4a, 0 0 60px rgba(255, 211, 107, 0.45); }}
.sub {{ font-size: 92px; font-style: italic; font-weight: 400; color: #ffd36b; margin-top: 6px;
  text-shadow: 0 4px 0 #241a4a; }}
</style></head>
<body><div id="stage">
<svg width="1920" height="1080" viewBox="0 0 1920 1080">{defs}<g id="art"></g></svg>
<div class="title"><div class="pill">a bedtime story</div><div class="big">Bramble</div><div class="sub">and the Little<br/>Lost Star</div></div>
</div>
<script>
const P = (n) => (+n).toFixed(1);
let seed = 1;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
{art}
seed = 99;
let stars = "";
for (let i = 0; i < 160; i++) {{
  const x = rnd() * 1920, y = rnd() * 760, r = 1 + rnd() * 2.4;
  stars += `<circle cx="${{P(x)}}" cy="${{P(y)}}" r="${{P(r)}}" fill="#fff" opacity="${{P(0.35 + rnd() * 0.6)}}" />`;
}}
const moon = `<g transform="translate(1700 170)"><circle r="260" fill="url(#moonglow)" /><circle r="110" fill="#fff3cf" />
  <circle cx="-36" cy="-34" r="16" fill="#f1e2b4" /><circle cx="40" cy="36" r="12" fill="#f1e2b4" />
  <path d="M-48 4 Q-34 16 -20 4 M18 4 Q32 16 46 4" stroke="#8e7a52" stroke-width="6" fill="none" stroke-linecap="round" />
  <path d="M-14 40 Q0 50 14 40" stroke="#8e7a52" stroke-width="5" fill="none" stroke-linecap="round" />
  <ellipse cx="-56" cy="30" rx="13" ry="8" fill="#f6b8a8" opacity="0.6" /><ellipse cx="56" cy="30" rx="13" ry="8" fill="#f6b8a8" opacity="0.6" /></g>`;
document.getElementById("art").innerHTML = stars + moon +
  `<g transform="translate(0 40)">${{meadowM(3, false)}}</g>` +
  `<circle cx="1420" cy="560" r="330" fill="url(#glow)" opacity="0.9" />` +
  `<g transform="translate(1090 850)">${{hogM("h", 2.05, false)}}</g>` +
  `<g transform="translate(1440 540) rotate(10) scale(2.3)">${{starM("pip", false)}}</g>`;
</script></body></html>"""
os.makedirs(OUT, exist_ok=True)
html_path = os.path.join(OUT, "thumbnail.html")
open(html_path, "w").write(page)

shot = os.path.join(OUT, "thumbnail-1920.png")
js = f"""
const {{ chromium }} = require('playwright');
(async () => {{
  const b = await chromium.launch();
  const p = await b.newPage({{ viewport: {{ width: 1920, height: 1080 }}, deviceScaleFactor: 1 }});
  await p.goto('file://{html_path}');
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({{ path: '{shot}' }});
  await b.close();
}})();
"""
subprocess.run(["node", "-e", js], check=True)
final = os.path.join(ROOT, "youtube-thumbnail.png")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", shot, "-vf", "scale=1280:720:flags=lanczos", final], check=True)
os.remove(shot)
print("wrote", final)
