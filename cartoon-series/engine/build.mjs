// Fridge Gang episode builder.
//
//   node engine/build.mjs ep01 --lines   write episodes/ep01/lines.json (what engine/voice.py voices)
//   python3 engine/voice.py ep01         voice every line -> assets/vo + vo.json
//   node engine/build.mjs ep01           write the HyperFrames project in episodes/ep01/
//
// An episode (episodes/<ep>/episode.mjs) is a list of shots. Each shot names its cast and their
// marks, its lines (timed by the voice: each starts `gap` s after the previous one ends), its
// sound effects, and an act(R, L) function that does the acting on the rig (engine/rig.js).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { CAST, VOICES, MOUTHS, BROWS, MOODS, INK, drawChar } from "./cast.mjs";
import * as stage from "./stage.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HF = "0.9.39";
const GSAP = "https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js";
const SFX_SRC = path.join(process.env.HOME, ".claude/skills/media-use/audio/assets/sfx");
const ACCENT = { tamatar: "#E8402E", aloo: "#B5702F", bhindi: "#3E9B37", mummy: "#D7263D", pizza: "#E08A1E" };

const ep = process.argv[2] || "ep01";
const EPDIR = path.join(ROOT, "episodes", ep);
// --wide builds the 16:9 version (1920x1080) into episodes/<ep>/wide/; the default is 9:16.
const WIDE = process.argv.includes("--wide");
const [W, H] = WIDE ? [1920, 1080] : [1080, 1920];
const OUT = WIDE ? path.join(EPDIR, "wide") : EPDIR;
const TAG = WIDE ? `${ep}-wide` : ep;
const episode = (await import(pathToFileURL(path.join(EPDIR, "episode.mjs")).href)).default;
const r3 = (x) => Math.round(x * 1000) / 1000;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Every line gets a stable id: <shot>-<n>.
const allLines = [];
episode.shots.forEach((s) => (s.lines || []).forEach((ln, n) => allLines.push({ ...ln, id: `${s.id}-${n}`, shot: s.id })));

if (process.argv.includes("--lines")) {
  const out = allLines.map((ln) => ({ id: ln.id, who: ln.who, say: ln.say, ...VOICES[ln.who] }));
  fs.writeFileSync(path.join(EPDIR, "lines.json"), JSON.stringify(out, null, 1));
  console.log(`${out.length} lines -> ${path.join(EPDIR, "lines.json")}`);
  process.exit(0);
}

const vo = JSON.parse(fs.readFileSync(path.join(EPDIR, "vo.json"), "utf8"));

// ---------- timing: the voice is the clock ----------
let clock = 0;
const shots = episode.shots.map((s) => {
  let cursor = s.lead ?? 0.3;
  let prev = null;
  const lines = (s.lines || []).map((ln, n) => {
    const id = `${s.id}-${n}`;
    const v = vo[id];
    if (!v) throw new Error(`no voice for ${id}: run engine/voice.py ${ep}`);
    // A line never starts before the previous bubble has been on screen long enough to read.
    const minStart = prev ? prev.start + 0.8 * (0.5 + 0.3 * prev.cap.split(/\s+/).length) : 0;
    const start = ln.at ?? Math.max(minStart, cursor + (n === 0 ? 0 : ln.gap ?? 0.25));
    const end = start + v.dur;
    cursor = end;
    const words = ln.cap.split(/\s+/).length;
    const hold = Math.max(0.3, 0.5 + 0.3 * words - v.dur);
    prev = { start, cap: ln.cap };
    return { i: n, id, who: ln.who, cap: ln.cap, yell: !!ln.yell, noBubble: !!ln.noBubble, start: r3(start), end: r3(end), hold: r3(hold), mouth: v.mouth, file: v.file };
  });
  const dur = r3(Math.max(s.minDur ?? 0, s.dur ?? cursor + (s.tail ?? 0.7)));
  const shot = { ...s, lines, dur, at: r3(clock) };
  clock += dur;
  return shot;
});
const TOTAL = r3(clock);

// ---------- scene files ----------
const CSS = `
#root { position: absolute; inset: 0; overflow: hidden; background: #E2EFF7; font-family: "Nunito", sans-serif; }
#root .stage { position: absolute; left: 0; top: 0; width: ${W}px; height: ${H}px; }
#root .bub { position: absolute; left: 0; top: 0; z-index: 5; }
#root .bub-in { position: relative; width: max-content; max-width: 820px; padding: 24px 40px 28px; background: #fff;
  border: 7px solid ${INK}; border-radius: 48px; color: ${INK}; font-weight: 900; font-size: 60px; line-height: 1.1;
  text-align: center; box-shadow: 0 10px 0 rgba(42, 27, 20, 0.18); }
#root .bub-in .tail { position: absolute; bottom: -27px; width: 40px; height: 40px; margin-left: -20px; background: #fff;
  border-right: 7px solid ${INK}; border-bottom: 7px solid ${INK}; transform: rotate(45deg); }
#root .bub-in span { position: relative; z-index: 1; }
${Object.entries(ACCENT).map(([w, c]) => `#root .bub.${w} b { color: ${c}; }`).join("\n")}
#root .bub.mummy .bub-in { background: #FFF1D6; }
#root .bub.mummy .bub-in .tail { background: #FFF1D6; }
#root .slam { position: absolute; left: 0; width: 100%; text-align: center; z-index: 6; }
#root .slam span { display: inline-block; font-family: "Archivo Black", sans-serif; color: #fff; font-size: 128px;
  line-height: 1.02; letter-spacing: 0.01em; -webkit-text-stroke: 12px ${INK}; paint-order: stroke fill;
  text-shadow: 0 12px 0 ${INK}; margin: 0 14px; }
`;

const capHTML = (cap) => esc(cap).replace(/\b([A-Z][A-Z!?']{2,}(?:\s[A-Z][A-Z!?']{2,})*)/g, "<b>$1</b>");

function world(s) {
  const p = s.id;
  if (s.world === "door") return stage.fridgeDoor() + (s.svg || "");
  const chars = Object.keys(s.cast || {})
    .map((w) => {
      const c = (s.clip || {})[w];
      if (!c) return drawChar(p, w);
      return `<clipPath id="${p}-clip-${w}" clipPathUnits="userSpaceOnUse"><rect x="${c[0]}" y="${c[1]}" width="${c[2]}" height="${c[3]}"/></clipPath>
      <g clip-path="url(#${p}-clip-${w})">${drawChar(p, w)}</g>`;
    })
    .join("\n");
  return [
    stage.fridgeBack(),
    stage.topShelf({ p, bottle: s.bottle !== false }),
    s.svgBack || "",
    stage.midShelf(),
    chars,
    stage.midShelfFront(),
    stage.crisper(p),
    stage.pizzaBox(p),
    s.svg || "",
    stage.hand(p),
  ].join("\n");
}

function scene(s) {
  const p = s.id;
  const bubbles = s.lines
    .filter((ln) => !ln.noBubble)
    .map((ln) => {
      const st = Math.max(0, ln.start - 0.06);
      const du = Math.min(s.dur, ln.end + ln.hold) - st;
      return `  <div id="${p}-b${ln.i}" class="clip bub ${ln.who}" data-start="${r3(st)}" data-duration="${r3(du)}" data-track-index="${3 + (ln.i % 2)}">
    <div class="bub-in"><span>${capHTML(ln.cap)}</span><i class="tail"></i></div>
  </div>`;
    })
    .join("\n");
  const rigData = { WORLD: s.world || "fridge", MOUTHS, BROWS, MOODS, CAST: Object.fromEntries(Object.entries(CAST).map(([k, v]) => [k, { headTop: v.headTop }])) };
  const shotData = { id: p, w: W, h: H, dur: s.dur, cast: s.cast, lines: s.lines.map(({ file, ...l }) => l) };
  const marks = Object.entries(s.cast || {})
    .map(([w, [x, y, sc = 1, flip = false]]) => `R.place(${JSON.stringify(w)}, ${x}, ${y}, ${sc}, ${flip});`)
    .join("\n      ");
  return `<template id="${p}-template">
  <style>${CSS}${s.css || ""}${WIDE ? s.cssWide || "" : ""}</style>
  <div id="root" data-composition-id="${p}" data-width="${W}" data-height="${H}" data-duration="${s.dur}">
    <svg id="${p}-svg" class="stage" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-layout-allow-overflow>
      <defs>
        <filter id="${p}-boil" x="-2%" y="-2%" width="104%" height="104%">
          <feTurbulence id="${p}-turb" type="fractalNoise" baseFrequency="0.016" numOctaves="2" seed="1" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
      <g id="${p}-cam"><g filter="url(#${p}-boil)">
${world(s)}
      </g></g>
      <rect id="${p}-dark" x="0" y="0" width="${W}" height="${H}" fill="#1D3366" opacity="0" pointer-events="none"/>
    </svg>
${bubbles}
${s.html || ""}
  </div>
  <script src="${GSAP}"></script>
  <script>
  (function () {
    const RIG_DATA = ${JSON.stringify(rigData)};
    const SHOT = ${JSON.stringify(shotData)};
${fs.readFileSync(path.join(ROOT, "engine/rig.js"), "utf8").replace(/^/gm, "    ")}
    const build = () => {
      const tl = gsap.timeline({ paused: true });
      const R = makeRig(${JSON.stringify(p)}, tl);
      R.lightAt0(${s.light === "off" ? "false" : "true"});
      ${marks}
      const helpers = ${episode.helpers ? episode.helpers.toString() : "() => {}"};
      helpers(R);
      const act = ${s.act ? s.act.toString() : "() => {}"};
      act(R, SHOT.lines);
      R.finish();
      window.__timelines = window.__timelines || {};
      window.__timelines[${JSON.stringify(p)}] = tl;
    };
    document.fonts.ready.then(build);
  })();
  </script>
</template>
`;
}

fs.mkdirSync(path.join(OUT, "compositions"), { recursive: true });
for (const s of shots) fs.writeFileSync(path.join(OUT, "compositions", `${s.id}.html`), scene(s));

// ---------- sound: voices and effects on the root ----------
const sfxUsed = new Set();
const probe = (f) => +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString().trim();
const sfxDur = {};
const audio = [];
for (const s of shots) {
  for (const ln of s.lines)
    audio.push(`    <audio id="vo-${ln.id}" class="clip" src="${ln.file}" data-start="${r3(s.at + ln.start)}" data-duration="${r3(ln.end - ln.start)}" data-track-index="10" data-volume="${episode.voVolume ?? 1}"></audio>`);
  const fx = s.sfx ? s.sfx(s.lines) : [];
  fx.forEach(([name, t, vol = 0.6], k) => {
    sfxUsed.add(name);
    sfxDur[name] ??= probe(path.join(SFX_SRC, `${name}.mp3`));
    const d = Math.min(sfxDur[name], TOTAL - (s.at + t));
    audio.push(`    <audio id="fx-${s.id}-${k}" class="clip" src="assets/sfx/${name}.mp3" data-start="${r3(s.at + t)}" data-duration="${r3(d)}" data-track-index="${11 + (k % 3)}" data-volume="${vol}"></audio>`);
  });
}
fs.mkdirSync(path.join(OUT, "assets/sfx"), { recursive: true });
if (WIDE) {
  fs.mkdirSync(path.join(OUT, "assets/vo"), { recursive: true });
  for (const f of fs.readdirSync(path.join(EPDIR, "assets/vo"))) fs.copyFileSync(path.join(EPDIR, "assets/vo", f), path.join(OUT, "assets/vo", f));
}
for (const n of sfxUsed) fs.copyFileSync(path.join(SFX_SRC, `${n}.mp3`), path.join(OUT, "assets/sfx", `${n}.mp3`));
fs.copyFileSync(path.join(SFX_SRC, "CREDITS.md"), path.join(OUT, "assets/sfx/CREDITS.md"));

const hosts = shots
  .map((s) => `    <div id="${s.id}" data-composition-id="${s.id}" data-composition-src="compositions/${s.id}.html" data-start="${s.at}" data-duration="${s.dur}" data-track-index="1" data-track-kind="graphics" data-width="${W}" data-height="${H}"></div>`)
  .join("\n");

const index = `<!doctype html>
<html lang="hi" data-resolution="${WIDE ? "landscape" : "portrait"}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <title>Fridge Gang · ${esc(episode.title)}</title>
    <script src="${GSAP}"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: #E2EFF7; }
    </style>
  </head>
  <body>
    <!-- Generated by engine/build.mjs from episode.mjs. Edit episode.mjs and rebuild, or edit here in the Studio. -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
${hosts}
${audio.join("\n")}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
fs.writeFileSync(path.join(OUT, "index.html"), index);
fs.writeFileSync(
  path.join(OUT, "hyperframes.json"),
  JSON.stringify({ $schema: "https://hyperframes.heygen.com/schema/hyperframes.json", paths: { blocks: "compositions", components: "compositions/components", assets: "assets" }, media: { autoProxy: true } }, null, 2) + "\n",
);
fs.writeFileSync(path.join(OUT, "meta.json"), JSON.stringify({ id: `fridge-gang-${TAG}`, name: `Fridge Gang ${TAG}: ${episode.title}` }, null, 2) + "\n");
fs.writeFileSync(
  path.join(OUT, "package.json"),
  JSON.stringify({ name: `fridge-gang-${TAG}`, private: true, type: "module", scripts: {
    dev: `npx --yes hyperframes@${HF} preview`, check: `npx --yes hyperframes@${HF} check`,
    render: `npx --yes hyperframes@${HF} render -o renders/fridge-gang-${TAG}.mp4` } }, null, 2) + "\n",
);
console.log(`${shots.length} shots, ${allLines.length} lines, ${TOTAL}s, ${W}x${H} -> ${OUT}`);
for (const s of shots) console.log(`  ${s.id.padEnd(4)} ${String(s.at).padStart(7)}s  +${s.dur}s  ${s.name || ""}`);
