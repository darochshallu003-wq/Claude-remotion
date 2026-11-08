import React from "react";
import { loadFont } from "@remotion/fonts";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HANDLE } from "../explainer/Explainer";
import { FlyingHanuman, Medallion, Vimana, Who } from "./characters";
import { LAND_PATH } from "./geo";
import { HAS_VOICEOVER } from "./script";
import { INTERNAL_END, TOTAL_FRAMES, unwarp, VO_STARTS, warp } from "./timing";

// "History map" reel: Shri Ram's return from Lanka to Ayodhya on the
// Pushpaka Vimana. Same visual grammar as the animated empire maps:
// parchment relief, a red route drawing itself across the land while the
// camera follows, portrait medallions with name banners popping at each
// stop, a ticking counter, hatched territories spreading, and fake video
// player chrome over the top.

const SERIF = "Cinzel";
const SANS = "Poppins";
const DEVA = "Yatra One";
loadFont({ family: SERIF, url: staticFile("fonts/Cinzel-Bold.woff2"), weight: "700" });
loadFont({ family: SERIF, url: staticFile("fonts/Cinzel-Black.woff2"), weight: "900" });
loadFont({ family: SANS, url: staticFile("fonts/Poppins-Bold.woff2"), weight: "700" });
loadFont({ family: DEVA, url: staticFile("fonts/YatraOne-Devanagari.woff2"), weight: "400" });

export const RAM_FPS = 30;
// Output length follows the voiceover (see timing.ts); the animation below is
// authored on an internal 0..INTERNAL_END timeline.
export const RAM_TOTAL_FRAMES = TOTAL_FRAMES;
const W = 1080;
const H = 1920;

// ---------- projection (must match scripts/ramayan_geo.js) ----------
const K = 120;
const COS = Math.cos((22 * Math.PI) / 180);
type Pt = [number, number];
const P = (lat: number, lon: number): Pt => [(lon - 60) * K * COS, (38 - lat) * K];
const KM_PER_PX = 111 / K;

const ease = Easing.inOut(Easing.cubic);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------- places ----------
const PL = {
  lanka: P(7.8, 80.75),
  setu: P(9.18, 79.42),
  talaimannar: P(9.08, 79.72),
  kishkindha: P(15.33, 76.46),
  panchavati: P(20.0, 73.79),
  chitrakoot: P(25.2, 80.85),
  prayag: P(25.43, 81.88),
  nandigram: P(26.62, 82.02),
  ayodhya: P(26.8, 82.2),
};

// Route waypoints; stops are the named places along it.
const WAYPOINTS: Pt[] = [
  PL.lanka,
  P(8.9, 80.15),
  PL.setu,
  P(11.6, 78.6),
  P(13.6, 77.3),
  PL.kishkindha,
  P(17.6, 75.0),
  PL.panchavati,
  P(22.3, 76.6),
  P(24.2, 79.2),
  PL.chitrakoot,
  PL.prayag,
  PL.nandigram,
  PL.ayodhya,
];
const STOP_INDEX = { lanka: 0, setu: 2, kishkindha: 5, panchavati: 7, chitrakoot: 10, prayag: 11, nandigram: 12, ayodhya: 13 };

/** Catmull-Rom through the waypoints, sampled finely with running length. */
const SAMPLES = (() => {
  const out: { p: Pt; len: number; wp: number }[] = [];
  const n = WAYPOINTS.length;
  let len = 0;
  for (let i = 0; i < n - 1; i++) {
    const p0 = WAYPOINTS[Math.max(0, i - 1)];
    const p1 = WAYPOINTS[i];
    const p2 = WAYPOINTS[i + 1];
    const p3 = WAYPOINTS[Math.min(n - 1, i + 2)];
    const steps = 40;
    for (let s = i === 0 ? 0 : 1; s <= steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const c = (a: number, b: number, cc: number, d: number) =>
        0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
      const p: Pt = [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])];
      const prev = out[out.length - 1];
      if (prev) len += Math.hypot(p[0] - prev.p[0], p[1] - prev.p[1]);
      out.push({ p, len, wp: s === steps ? i + 1 : -1 });
    }
  }
  return out;
})();
const stopLen = (wp: number) => (wp === 0 ? 0 : SAMPLES.find((s) => s.wp === wp)!.len);

// Legs of the journey: which stop to which, over which frames.
const LEGS: { from: keyof typeof STOP_INDEX; to: keyof typeof STOP_INDEX; start: number; end: number }[] = [
  { from: "lanka", to: "setu", start: 80, end: 120 },
  { from: "setu", to: "kishkindha", start: 150, end: 215 },
  { from: "kishkindha", to: "panchavati", start: 255, end: 305 },
  { from: "panchavati", to: "chitrakoot", start: 340, end: 400 },
  { from: "chitrakoot", to: "prayag", start: 410, end: 432 },
  { from: "prayag", to: "ayodhya", start: 525, end: 575 },
];
const ARRIVE = 575;

const headLength = (f: number) => {
  let len = 0;
  for (const leg of LEGS) {
    const a = stopLen(STOP_INDEX[leg.from]);
    const b = stopLen(STOP_INDEX[leg.to]);
    if (f >= leg.end) len = b;
    else if (f > leg.start) len = a + (b - a) * ease((f - leg.start) / (leg.end - leg.start));
  }
  return len;
};

const pointAt = (len: number) => {
  let i = SAMPLES.findIndex((s) => s.len >= len);
  if (i <= 0) i = 1;
  const a = SAMPLES[i - 1];
  const b = SAMPLES[i];
  const t = b.len === a.len ? 0 : Math.min(1, Math.max(0, (len - a.len) / (b.len - a.len)));
  return { p: [a.p[0] + (b.p[0] - a.p[0]) * t, a.p[1] + (b.p[1] - a.p[1]) * t] as Pt, i, dir: [b.p[0] - a.p[0], b.p[1] - a.p[1]] as Pt };
};

// ---------- camera ----------
type Cam = { f: number; at: Pt; z: number };
const CAM: Cam[] = [
  { f: 0, at: P(8.1, 80.5), z: 1.75 },
  { f: 70, at: P(8.3, 80.45), z: 1.5 },
  { f: 120, at: P(9.2, 79.75), z: 1.5 },
  { f: 150, at: P(9.7, 79.4), z: 1.3 },
  { f: 215, at: P(15.0, 76.6), z: 1.2 },
  { f: 255, at: P(15.6, 76.2), z: 1.1 },
  { f: 305, at: P(19.4, 74.4), z: 1.15 },
  { f: 340, at: P(20.4, 75.0), z: 1.0 },
  { f: 400, at: P(24.9, 80.6), z: 1.4 },
  { f: 440, at: P(25.6, 81.7), z: 2.1 },
  { f: 455, at: P(25.9, 81.95), z: 2.3 },
  { f: 525, at: P(26.1, 82.0), z: 2.35 },
  { f: ARRIVE, at: P(26.68, 82.15), z: 2.7 },
  { f: 650, at: P(26.72, 82.15), z: 2.9 },
  { f: 735, at: P(18.4, 79.6), z: 0.6 },
  { f: INTERNAL_END, at: P(18.4, 79.6), z: 0.57 },
];

const camera = (f: number) => {
  let i = CAM.findIndex((c) => c.f > f);
  if (i === -1) return CAM[CAM.length - 1];
  if (i === 0) return CAM[0];
  const a = CAM[i - 1];
  const b = CAM[i];
  const t = ease((f - a.f) / (b.f - a.f));
  return {
    f,
    at: [a.at[0] + (b.at[0] - a.at[0]) * t, a.at[1] + (b.at[1] - a.at[1]) * t] as Pt,
    z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t),
  };
};

// ---------- scenery ----------
const smooth = (pts: Pt[]) => {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }
  return d;
};
const ll = (arr: number[][]) => arr.map(([la, lo]) => P(la, lo));

const RIVERS = [
  // Ganga
  ll([[30.0, 78.2], [28.9, 78.6], [27.6, 79.6], [26.45, 80.35], [25.43, 81.88], [25.3, 83.0], [25.6, 85.1], [25.25, 87.0], [24.6, 88.1], [23.2, 88.5], [21.9, 88.3]]),
  // Yamuna
  ll([[30.4, 77.6], [28.6, 77.25], [27.5, 77.7], [27.18, 78.0], [26.75, 79.0], [25.9, 80.6], [25.43, 81.88]]),
  // Sarayu / Ghaghara past Ayodhya
  ll([[28.6, 80.6], [27.6, 81.3], [26.8, 82.2], [26.3, 83.6], [25.75, 84.7]]),
  // Godavari
  ll([[20.0, 73.6], [19.6, 75.0], [19.0, 77.3], [18.8, 79.4], [17.6, 81.0], [17.0, 81.8], [16.6, 82.3]]),
  // Krishna
  ll([[17.9, 73.7], [16.8, 74.6], [16.3, 76.0], [16.0, 78.0], [16.5, 80.6], [15.9, 81.1]]),
  // Tungabhadra (past Kishkindha)
  ll([[14.0, 75.5], [15.34, 76.46], [15.85, 78.05]]),
  // Kaveri
  ll([[12.4, 75.6], [12.2, 76.9], [11.9, 78.1], [10.9, 79.0], [11.1, 79.8]]),
  // Narmada
  ll([[22.7, 81.6], [23.1, 80.0], [22.8, 77.5], [22.1, 75.0], [21.7, 73.0]]),
];

const RANGES = [
  ll([[35.0, 74.0], [34.0, 77.0], [31.2, 79.0], [29.6, 81.0], [28.2, 85.0], [27.9, 88.0], [27.9, 92.0], [28.6, 95.5]]),
  ll([[21.0, 73.8], [19.0, 73.6], [17.0, 73.8], [15.0, 74.3], [13.0, 75.3], [11.2, 76.6], [9.3, 77.2]]),
  ll([[22.8, 75.0], [23.5, 77.0], [24.0, 79.2], [24.5, 81.6]]),
  ll([[21.5, 85.3], [19.4, 83.6], [17.6, 82.0], [15.4, 79.3], [13.5, 79.0]]),
  ll([[7.6, 80.4], [7.0, 80.8]]),
];

const MOUNTAINS = (() => {
  const out: { p: Pt; s: number }[] = [];
  RANGES.forEach((r, ri) => {
    for (let i = 0; i < r.length - 1; i++) {
      const [a, b] = [r[i], r[i + 1]];
      const n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 42));
      for (let k = 0; k < n; k++) {
        const t = k / n;
        const j = random(`m${ri}-${i}-${k}`);
        out.push({ p: [a[0] + (b[0] - a[0]) * t + (j - 0.5) * 30, a[1] + (b[1] - a[1]) * t + (random(`n${ri}${i}${k}`) - 0.5) * 30], s: 0.8 + j * 0.5 });
      }
    }
  });
  return out;
})();

const blob = (c: Pt, r: number, seed: number) => {
  const pts: string[] = [];
  for (let i = 0; i < 64; i++) {
    const a = (i / 64) * Math.PI * 2;
    const rr = r * (1 + 0.1 * Math.sin(3 * a + seed) + 0.06 * Math.sin(7 * a + seed * 2.3) + 0.03 * Math.sin(13 * a + seed));
    pts.push(`${(c[0] + Math.cos(a) * rr).toFixed(1)} ${(c[1] + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
};

const polyD = (pts: Pt[]) => `M${pts.map((p) => p.join(" ")).join("L")}Z`;
const SRI_LANKA = polyD(ll([[10.1, 79.6], [10.0, 80.6], [8.0, 82.3], [5.6, 81.1], [5.9, 79.5], [8.5, 79.55], [9.3, 79.85]]));
const SUBCONTINENT = polyD(
  ll([[37, 71], [35.5, 78], [31, 80], [28.7, 84], [27.8, 89], [28.2, 96.5], [22, 93], [5, 93], [5, 60], [24.5, 61], [30, 66], [34, 69]]),
);

// ---------- small helpers ----------
const outline = "0 3px 0 rgba(0,0,0,0.85), 0 0 10px rgba(0,0,0,0.7), 2px 0 0 rgba(0,0,0,0.6), -2px 0 0 rgba(0,0,0,0.6)";

const pop = (f: number, start: number, end: number, fps: number) => {
  const inn = spring({ frame: f - start, fps, config: { damping: 11, stiffness: 160 } });
  const out = interpolate(f, [end - 8, end], [1, 0], clamp);
  return f < start ? 0 : inn * out;
};

// ---------- the composition ----------
export const RamReturn: React.FC = () => {
  const outFrame = useCurrentFrame();
  const f = warp(outFrame);
  const { fps } = useVideoConfig();
  const cam = camera(f);
  const z = cam.z;
  const toScreen = (p: Pt): Pt => [(p[0] - cam.at[0]) * z + W / 2, (p[1] - cam.at[1]) * z + H / 2];
  const worldT = `translate(${W / 2} ${H / 2}) scale(${z}) translate(${-cam.at[0]} ${-cam.at[1]})`;

  // route so far
  const hl = headLength(f);
  const head = pointAt(hl);
  const drawn: Pt[] = SAMPLES.slice(0, head.i).map((s) => s.p);
  drawn.push(head.p);
  const routeD = `M${drawn.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join("L")}`;
  const headS = toScreen(head.p);
  const headAngle = (Math.atan2(head.dir[1], head.dir[0]) * 180) / Math.PI;
  const km = Math.round(hl * KM_PER_PX);

  // territories
  const lankaWin = interpolate(f, [28, 70], [0, 560], { ...clamp, easing: ease });
  const kishkindhaR = interpolate(f, [215, 245], [0, 125], { ...clamp, easing: Easing.out(Easing.cubic) });
  const kosalaR = interpolate(f, [ARRIVE + 4, ARRIVE + 45], [0, 120], { ...clamp, easing: Easing.out(Easing.cubic) });
  const rajyaR = interpolate(f, [665, 760], [0, 2700], { ...clamp, easing: Easing.inOut(Easing.quad) });

  // Hanuman runs ahead to Bharat at Nandigram
  const hanT = interpolate(f, [448, 495], [0, 1], { ...clamp, easing: ease });
  const hp0 = PL.prayag;
  const hp1 = P(26.1, 82.75);
  const hp2 = PL.nandigram;
  const qb = (t: number): Pt => [
    (1 - t) ** 2 * hp0[0] + 2 * (1 - t) * t * hp1[0] + t * t * hp2[0],
    (1 - t) ** 2 * hp0[1] + 2 * (1 - t) * t * hp1[1] + t * t * hp2[1],
  ];
  const hanPts: Pt[] = Array.from({ length: 41 }, (_, i) => qb((i / 40) * hanT));
  const hanHead = qb(hanT);
  const hanPrev = qb(Math.max(0, hanT - 0.02));
  const hanAngle = (Math.atan2(hanHead[1] - hanPrev[1], hanHead[0] - hanPrev[0]) * 180) / Math.PI;

  // Vimana
  const vimanaIn = spring({ frame: f - 52, fps, config: { damping: 12, stiffness: 120 } });
  const landing = interpolate(f, [ARRIVE, ARRIVE + 25], [1, 0.75], clamp);
  const vimanaOut = interpolate(f, [655, 680], [1, 0], clamp);
  const moving = LEGS.some((l) => f > l.start && f < l.end);
  const dx = head.dir[0];
  const facing = dx < -0.05 ? -1 : 1;
  const tilt = moving ? Math.max(-32, Math.min(32, (Math.atan2(head.dir[1], Math.abs(dx) + 1e-6) * 180) / Math.PI)) * 0.6 : 0;

  const mapFadeIn = interpolate(f, [0, 18], [0, 1], clamp);
  const endCard = interpolate(f, [762, 790], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ background: "#173843", overflow: "hidden" }}>
      {/* ================= world (scales with camera) ================= */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <clipPath id="land">
            <path d={LAND_PATH} />
          </clipPath>
          <clipPath id="srilanka">
            <path d={SRI_LANKA} />
          </clipPath>
          <clipPath id="subcont">
            <path d={SUBCONTINENT} />
          </clipPath>
          <pattern id="hatchRed" patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="#D45A4A" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="#A3302B" strokeWidth="4" />
          </pattern>
          <pattern id="hatchPurple" patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="#9A7CC0" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="#6C4D93" strokeWidth="4" />
          </pattern>
          <pattern id="hatchGold" patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(45)">
            <rect width="16" height="16" fill="#E9B949" />
            <line x1="0" y1="0" x2="0" y2="16" stroke="#C98E22" strokeWidth="4" />
          </pattern>
          <filter id="relief" x="0" y="0" width="1" height="1" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves={4} seed={7} result="noise" />
            <feDiffuseLighting in="noise" lightingColor="#FFF4D6" surfaceScale={2.2} result="lit">
              <feDistantLight azimuth={225} elevation={48} />
            </feDiffuseLighting>
            <feBlend in="SourceGraphic" in2="lit" mode="multiply" result="shaded" />
            <feComposite in="shaded" in2="SourceGraphic" operator="in" />
          </filter>
          <radialGradient id="sea" cx="0.5" cy="0.45" r="0.75">
            <stop offset="0" stopColor="#21505E" />
            <stop offset="1" stopColor="#11303A" />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#sea)" />

        <g transform={worldT}>
          {/* shallow water halo */}
          <path d={LAND_PATH} fill="none" stroke="#2D6676" strokeWidth={26} strokeLinejoin="round" opacity={0.7} />
          <path d={LAND_PATH} fill="none" stroke="#3A7A88" strokeWidth={10} strokeLinejoin="round" opacity={0.6} />
          {/* parchment land with relief */}
          <path d={LAND_PATH} fill="#E6D3A0" filter="url(#relief)" />
          <path d={LAND_PATH} fill="none" stroke="#3B2E22" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />

          {/* rivers */}
          {RIVERS.map((r, i) => (
            <path key={i} d={smooth(r)} fill="none" stroke="#2C6070" strokeWidth={6} strokeLinecap="round" opacity={0.85} />
          ))}

          {/* mountain ranges */}
          {MOUNTAINS.map((m, i) => (
            <g key={i} transform={`translate(${m.p[0]} ${m.p[1]}) scale(${m.s})`} opacity={0.75}>
              <path d="M-16 8 L 0 -14 L 16 8 Z" fill="#CDB57C" stroke="#5A4630" strokeWidth={2} strokeLinejoin="round" />
              <path d="M0 -14 L 5 8 L 16 8 Z" fill="#9E8656" />
            </g>
          ))}

          {/* territories: Ravana's Lanka, flipped by the victory */}
          <g clipPath="url(#land)">
            <g clipPath="url(#srilanka)">
              <path d={SRI_LANKA} fill="url(#hatchPurple)" opacity={0.9} />
              <path d={blob(P(9.8, 80.0), lankaWin, 1)} fill="url(#hatchRed)" stroke="#7E1D1A" strokeWidth={6} />
            </g>
            {kishkindhaR > 0 && <path d={blob(PL.kishkindha, kishkindhaR, 2)} fill="url(#hatchGold)" stroke="#9C6A12" strokeWidth={5} opacity={0.9} />}
            <g clipPath="url(#subcont)">
              {rajyaR > 0 && <path d={blob(PL.ayodhya, rajyaR, 4)} fill="url(#hatchRed)" stroke="#7E1D1A" strokeWidth={10} opacity={0.82} />}
            </g>
            {kosalaR > 0 && <path d={blob(PL.ayodhya, kosalaR, 3)} fill="url(#hatchRed)" stroke="#7E1D1A" strokeWidth={5} opacity={0.92} />}
          </g>

          {/* Ram Setu: a causeway of stones across the strait */}
          {(() => {
            const t = interpolate(f, [92, 118], [0, 1], clamp);
            const a = PL.talaimannar;
            const b = PL.setu;
            const n = 9;
            return Array.from({ length: n }, (_, i) => {
              const k = i / (n - 1);
              if (k > t) return null;
              const x = a[0] + (b[0] - a[0]) * k;
              const y = a[1] + (b[1] - a[1]) * k + Math.sin(k * Math.PI) * -4;
              return <ellipse key={i} cx={x} cy={y} rx={5} ry={3.8} fill="#BFAE8C" stroke="#3B2E22" strokeWidth={1.4} />;
            });
          })()}

          {/* Hanuman's flight path */}
          {hanT > 0 && (
            <path
              d={`M${hanPts.map((p) => p.join(" ")).join("L")}`}
              fill="none"
              stroke="#E58A2C"
              strokeWidth={5}
              strokeDasharray="10 9"
              vectorEffect="non-scaling-stroke"
              opacity={interpolate(f, [560, 580], [1, 0], clamp)}
            />
          )}

          {/* the route */}
          {hl > 0 && (
            <>
              <path d={routeD} fill="none" stroke="#5E1210" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              <path d={routeD} fill="none" stroke="#D8443A" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </>
          )}
        </g>
      </svg>

      {/* ================= screen-space overlays ================= */}
      <RegionLabels toScreen={toScreen} z={z} f={f} />
      <Diyas toScreen={toScreen} z={z} f={f} />
      <Cities toScreen={toScreen} f={f} fps={fps} />

      {/* arrowhead */}
      {hl > 0 && f < 690 && (
        <div style={{ position: "absolute", left: headS[0], top: headS[1], transform: `translate(-50%,-50%) rotate(${headAngle}deg)` }}>
          <svg width="44" height="44" viewBox="-22 -22 44 44" style={{ display: "block" }}>
            <path d="M18 0 L -12 -15 L -5 0 L -12 15 Z" fill="#D8443A" stroke="#5E1210" strokeWidth={3.5} strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Hanuman in flight */}
      {hanT > 0 && hanT < 1 && (() => {
        const s = toScreen(hanHead);
        const flip = Math.abs(hanAngle) > 90;
        return (
          <div style={{ position: "absolute", left: s[0], top: s[1], transform: `translate(-50%,-50%) rotate(${hanAngle}deg) scaleY(${flip ? -1 : 1})` }}>
            <FlyingHanuman width={150} />
          </div>
        );
      })()}

      {/* Pushpaka Vimana riding the head of the route */}
      {f >= 52 && (
        <div
          style={{
            position: "absolute",
            left: headS[0],
            top: headS[1] - 70 * landing,
            transform: `translate(-50%,-60%) scale(${vimanaIn * landing * vimanaOut}) scaleX(${facing}) rotate(${tilt * facing}deg)`,
            filter: "drop-shadow(0 18px 8px rgba(0,0,0,0.35))",
          }}
        >
          <Vimana width={210} />
        </div>
      )}
      {f >= 140 && f < 178 && (
        <Banner
          x={headS[0]}
          y={headS[1] + 125}
          scale={pop(f, 141, 178, fps)}
          name="Pushpaka Vimana"
          small
        />
      )}

      {/* Medallions */}
      <Trio toScreen={toScreen} f={f} fps={fps} />
      <Med who="hanuman" at={PL.kishkindha} off={[-250, -230]} start={218} end={300} name="Hanuman" sub="& the Vanara Sena" toScreen={toScreen} f={f} fps={fps} />
      <Med who="sita" at={PL.panchavati} off={[260, -230]} start={308} end={390} name="Sita" sub="taken from here by Ravana" toScreen={toScreen} f={f} fps={fps} />
      <Med who="lakshman" at={PL.chitrakoot} off={[-200, -40]} start={400} end={450} name="Lakshman" sub="built their hut here" toScreen={toScreen} f={f} fps={fps} />
      <Med who="bharat" at={PL.nandigram} off={[-260, 150]} start={490} end={570} name="Bharat" sub="ruled 14 years with Ram's paduka" toScreen={toScreen} f={f} fps={fps} />
      <Med who="ram" at={PL.ayodhya} off={[0, -300]} start={ARRIVE + 10} end={665} name="Shri Ram" sub="home after 14 years" toScreen={toScreen} f={f} fps={fps} size={220} />

      {/* RAM RAJYA label during the spread */}
      {f > 690 && (
        <div
          style={{
            position: "absolute",
            left: toScreen(P(22.5, 79.5))[0],
            top: toScreen(P(22.5, 79.5))[1],
            transform: `translate(-50%,-50%) scale(${spring({ frame: f - 692, fps, config: { damping: 14 } })})`,
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 92,
            letterSpacing: 14,
            color: "#FFF6E4",
            textShadow: outline,
            whiteSpace: "nowrap",
          }}
        >
          RAM RAJYA
        </div>
      )}

      {/* vignette + intro dim (the reference loops in from black) */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
      <AbsoluteFill style={{ background: "#0B0A09", opacity: 1 - mapFadeIn }} />

      <PlayerChrome f={f} outFrame={outFrame} km={km} fps={fps} />

      {/* end card */}
      {endCard > 0 && (
        <AbsoluteFill style={{ background: `rgba(10,6,4,${0.62 * endCard})`, alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <div style={{ opacity: endCard, transform: `translateY(${(1 - endCard) * 40}px)`, textAlign: "center" }}>
            <div style={{ fontFamily: DEVA, fontSize: 150, color: "#FFD36A", textShadow: "0 0 40px rgba(255,180,60,0.8), 0 5px 0 #6A2A10", lineHeight: 1.25 }}>
              शुभ दीपावली
            </div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 52, letterSpacing: 10, color: "#FFF1D6", marginTop: 16, textShadow: outline }}>
              HAPPY DIWALI
            </div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 38, color: "#F2E6CF", marginTop: 46, opacity: 0.9 }}>{HANDLE}</div>
          </div>
        </AbsoluteFill>
      )}

      {/* sound */}
      {HAS_VOICEOVER &&
        VO_STARTS.map((v) => (
          <Sequence key={v.id} from={v.at} durationInFrames={TOTAL_FRAMES - v.at}>
            <Audio src={staticFile(`ramayan/vo/${v.id}.mp3`)} volume={1} />
          </Sequence>
        ))}
      {LEGS.map((l) => (
        <Sequence key={l.start} from={unwarp(l.start - 4)} durationInFrames={40}>
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.18} />
        </Sequence>
      ))}
      {[14, 58, 218, 308, 400, 490, ARRIVE + 10, 692].map((s) => (
        <Sequence key={s} from={unwarp(s)} durationInFrames={20}>
          <Audio src={staticFile("sfx/pop.wav")} volume={0.25} />
        </Sequence>
      ))}
      <Sequence from={unwarp(448)} durationInFrames={40}>
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.16} />
      </Sequence>
      <Sequence from={unwarp(ARRIVE)} durationInFrames={60}>
        <Audio src={staticFile("sfx/chime.wav")} volume={0.35} />
      </Sequence>
      <Sequence from={unwarp(764)} durationInFrames={60}>
        <Audio src={staticFile("sfx/chime.wav")} volume={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------- overlay components ----------
type ToScreen = (p: Pt) => Pt;

const Banner: React.FC<{ x: number; y: number; scale: number; name: string; sub?: string; small?: boolean }> = ({ x, y, scale, name, sub, small }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%,0) scale(${scale})`,
      transformOrigin: "50% 0",
      background: "#B3262A",
      border: "3px solid #FBF6EA",
      boxShadow: "0 6px 14px rgba(0,0,0,0.45)",
      padding: small ? "6px 18px" : "8px 26px 10px",
      textAlign: "center",
      whiteSpace: "nowrap",
    }}
  >
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: small ? 26 : 38, letterSpacing: 4, color: "#FFF6E4", lineHeight: 1.1 }}>{name.toUpperCase()}</div>
    {sub && <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 22, color: "#F6D9C8", marginTop: 2 }}>{sub}</div>}
  </div>
);

const Med: React.FC<{
  who: Who;
  at: Pt;
  off: Pt;
  start: number;
  end: number;
  name: string;
  sub: string;
  toScreen: ToScreen;
  f: number;
  fps: number;
  size?: number;
}> = ({ who, at, off, start, end, name, sub, toScreen, f, fps, size = 170 }) => {
  if (f < start || f > end) return null;
  const s = toScreen(at);
  const k = pop(f, start, end, fps);
  const x = s[0] + off[0];
  const y = s[1] + off[1];
  return (
    <>
      {/* tether to the place */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: Math.min(1, k) }}>
        <line x1={s[0]} y1={s[1]} x2={x} y2={y} stroke="#FBF6EA" strokeWidth={3} strokeDasharray="6 6" />
      </svg>
      <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${k})` }}>
        <Medallion who={who} size={size} seed={start} />
      </div>
      <Banner x={x} y={y + (size / 2) * k - 6} scale={k} name={name} sub={sub} />
    </>
  );
};

const Trio: React.FC<{ toScreen: ToScreen; f: number; fps: number }> = ({ toScreen, f, fps }) => {
  const end = 140;
  if (f < 12 || f > end) return null;
  const s = toScreen(PL.lanka);
  const cx = s[0];
  const cy = s[1] - 360;
  const cast: { who: Who; start: number; dx: number }[] = [
    { who: "lakshman", start: 26, dx: -150 },
    { who: "sita", start: 20, dx: 150 },
    { who: "ram", start: 14, dx: 0 },
  ];
  const bannerK = pop(f, 30, end, fps);
  return (
    <>
      {cast.map((c) => {
        const k = pop(f, c.start, end, fps);
        return (
          <div key={c.who} style={{ position: "absolute", left: cx + c.dx, top: cy, transform: `translate(-50%,-50%) scale(${k})` }}>
            <Medallion who={c.who} size={c.who === "ram" ? 200 : 165} seed={c.start} />
          </div>
        );
      })}
      <Banner x={cx} y={cy + 92} scale={bannerK} name="Ram · Sita · Lakshman" sub="Ravana defeated. 14 years of exile, done." />
    </>
  );
};

const CITIES: { at: Pt; name: string; caption: string; arrive: number; dx?: number; dy?: number }[] = [
  { at: PL.lanka, name: "Lanka", caption: "VICTORY", arrive: 30 },
  { at: PL.setu, name: "Rameswaram", caption: "RAM SETU", arrive: 120, dx: -1 },
  { at: PL.kishkindha, name: "Kishkindha", caption: "ALLIES", arrive: 215 },
  { at: PL.panchavati, name: "Panchavati", caption: "WHERE IT BEGAN", arrive: 305 },
  { at: PL.chitrakoot, name: "Chitrakoot", caption: "", arrive: 400, dx: -1 },
  { at: PL.prayag, name: "Prayag", caption: "BHARADWAJ ASHRAM", arrive: 432 },
  { at: PL.nandigram, name: "Nandigram", caption: "", arrive: 495, dx: -1, dy: 1 },
  { at: PL.ayodhya, name: "Ayodhya", caption: "HOME", arrive: ARRIVE },
];

const Cities: React.FC<{ toScreen: ToScreen; f: number; fps: number }> = ({ toScreen, f, fps }) => (
  <>
    {CITIES.map((c) => {
      const s = toScreen(c.at);
      if (s[0] < -300 || s[0] > W + 300 || s[1] < -300 || s[1] > H + 300) return null;
      const big = c.name === "Ayodhya";
      const arrived = f >= c.arrive;
      const pulse = (f - c.arrive) / 30;
      const capK = c.caption && arrived ? spring({ frame: f - c.arrive, fps, config: { damping: 10, stiffness: 170 } }) : 0;
      const capOut = interpolate(f, [c.arrive + 75, c.arrive + 90], [1, 0], clamp);
      const glow = big && f > ARRIVE ? 0.6 + 0.4 * Math.sin(f / 5) : 0;
      return (
        <React.Fragment key={c.name}>
          {arrived && pulse < 2 && (
            <div
              style={{
                position: "absolute",
                left: s[0],
                top: s[1],
                width: 40 + (pulse % 1) * 120,
                height: 40 + (pulse % 1) * 120,
                transform: "translate(-50%,-50%)",
                borderRadius: "50%",
                border: "4px solid #FBF6EA",
                opacity: 1 - (pulse % 1),
              }}
            />
          )}
          {glow > 0 && (
            <div
              style={{
                position: "absolute",
                left: s[0],
                top: s[1],
                width: 220,
                height: 220,
                transform: "translate(-50%,-50%)",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,214,110,0.75) 0%, rgba(255,170,60,0.25) 45%, rgba(255,170,60,0) 70%)",
                opacity: glow,
              }}
            />
          )}
          {/* temple glyph */}
          <svg width={big ? 46 : 32} height={big ? 46 : 32} viewBox="-16 -16 32 32" style={{ position: "absolute", left: s[0], top: s[1], transform: "translate(-50%,-50%)" }}>
            <path d="M-10 12 L -10 -2 L 0 -13 L 10 -2 L 10 12 Z" fill="#FBF6EA" stroke="#2A2018" strokeWidth={2.5} strokeLinejoin="round" />
            <rect x="-3.5" y="3" width="7" height="9" fill="#2A2018" />
          </svg>
          <div
            style={{
              position: "absolute",
              left: s[0] + (c.dx === -1 ? -26 : 26),
              top: s[1] + (c.dy === 1 ? 6 : -50),
              transform: c.dx === -1 ? "translateX(-100%)" : undefined,
              fontFamily: SERIF,
              fontWeight: 700,
              fontSize: big ? 46 : 34,
              color: "#FFFFFF",
              textShadow: outline,
              whiteSpace: "nowrap",
            }}
          >
            {c.name}
          </div>
          {capK > 0 && capOut > 0 && (
            <div
              style={{
                position: "absolute",
                left: s[0],
                top: s[1] + 26,
                transform: `translate(-50%,0) scale(${capK * capOut})`,
                transformOrigin: "50% 0",
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 44,
                color: "#FFFFFF",
                textShadow: outline,
                whiteSpace: "nowrap",
              }}
            >
              {c.caption}
            </div>
          )}
        </React.Fragment>
      );
    })}
  </>
);

const REGIONS: { at: Pt; text: string; size: number; italic?: boolean; color?: string; from?: number }[] = [
  { at: P(6.55, 80.75), text: "LANKA", size: 40 },
  { at: P(19.6, 80.6), text: "DANDAKARANYA", size: 36, color: "#5B4A2E" },
  { at: P(23.9, 77.8), text: "VINDHYA", size: 30, color: "#5B4A2E" },
  { at: P(27.35, 81.1), text: "KOSALA", size: 40 },
  { at: P(31.2, 81.5), text: "HIMALAYA", size: 44, color: "#5B4A2E" },
  { at: P(15.5, 69.8), text: "ARABIAN SEA", size: 40, italic: true, color: "#9EC4CC" },
  { at: P(15.5, 86.2), text: "BAY OF BENGAL", size: 40, italic: true, color: "#9EC4CC" },
  { at: P(5.0, 76.5), text: "INDIAN OCEAN", size: 40, italic: true, color: "#9EC4CC" },
  { at: P(8.6, 78.6), text: "GULF OF MANNAR", size: 22, italic: true, color: "#9EC4CC" },
];

const RegionLabels: React.FC<{ toScreen: ToScreen; z: number; f: number }> = ({ toScreen, z, f }) => (
  <>
    {REGIONS.map((r) => {
      const s = toScreen(r.at);
      const size = r.size * Math.pow(z, 0.7);
      const op = r.from ? interpolate(f, [r.from, r.from + 15], [0, 1], clamp) : 1;
      if (op <= 0) return null;
      return (
        <div
          key={r.text}
          style={{
            position: "absolute",
            left: s[0],
            top: s[1],
            transform: "translate(-50%,-50%)",
            fontFamily: SERIF,
            fontWeight: 700,
            fontStyle: r.italic ? "italic" : "normal",
            fontSize: size,
            letterSpacing: size * 0.32,
            color: r.color ?? "#FFF4DE",
            textShadow: r.color ? "none" : "0 2px 0 rgba(0,0,0,0.7), 0 0 8px rgba(0,0,0,0.5)",
            whiteSpace: "nowrap",
            opacity: op * (r.color ? 0.85 : 1),
          }}
        >
          {r.text}
        </div>
      );
    })}
  </>
);

// Diyas spring up around Ayodhya and along the last road in, then fireworks.
const DIYAS = Array.from({ length: 160 }, (_, i) => {
  const along = i < 40;
  if (along) {
    const t = i / 40;
    const a = PL.nandigram;
    const b = PL.ayodhya;
    const side = i % 2 ? 1 : -1;
    return { p: [a[0] + (b[0] - a[0]) * t + side * 7, a[1] + (b[1] - a[1]) * t - side * 7] as Pt, delay: t * 14, seed: i };
  }
  const ang = random(`da${i}`) * Math.PI * 2;
  const r = 14 + Math.sqrt(random(`dr${i}`)) * 85;
  return { p: [PL.ayodhya[0] + Math.cos(ang) * r, PL.ayodhya[1] + Math.sin(ang) * r * 0.85] as Pt, delay: 6 + r * 0.45, seed: i };
});

const BURSTS = [
  { at: P(26.95, 82.05), f: ARRIVE + 22, hue: "#FFD36A" },
  { at: P(26.72, 82.42), f: ARRIVE + 34, hue: "#FF8A5B" },
  { at: P(26.98, 82.38), f: ARRIVE + 48, hue: "#9EE6FF" },
  { at: P(26.62, 81.98), f: ARRIVE + 60, hue: "#FFE9A3" },
];

const Diyas: React.FC<{ toScreen: ToScreen; z: number; f: number }> = ({ toScreen, f }) => {
  if (f < ARRIVE - 4 || f > 690) return null;
  const fade = interpolate(f, [670, 690], [1, 0], clamp);
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: fade }}>
      <defs>
        <radialGradient id="diya">
          <stop offset="0" stopColor="#FFF6C8" />
          <stop offset="0.35" stopColor="#FFC24A" />
          <stop offset="1" stopColor="#FF8A1E" stopOpacity="0" />
        </radialGradient>
      </defs>
      {DIYAS.map((d) => {
        const t = f - ARRIVE - d.delay;
        if (t < 0) return null;
        const s = toScreen(d.p);
        const k = Math.min(1, t / 6);
        const flicker = 0.75 + 0.25 * Math.sin(f / 2.2 + d.seed * 1.7);
        return <circle key={d.seed} cx={s[0]} cy={s[1]} r={13 * k * flicker} fill="url(#diya)" />;
      })}
      {BURSTS.map((b, bi) => {
        const t = f - b.f;
        if (t < 0 || t > 32) return null;
        const s = toScreen(b.at);
        const R = 30 + t * 6;
        return (
          <g key={bi} opacity={1 - t / 32}>
            {Array.from({ length: 16 }, (_, i) => {
              const a = (i / 16) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={s[0] + Math.cos(a) * R * 0.6}
                  y1={s[1] + Math.sin(a) * R * 0.6 + t * 0.8}
                  x2={s[0] + Math.cos(a) * R}
                  y2={s[1] + Math.sin(a) * R + t * 1.2}
                  stroke={b.hue}
                  strokeWidth={5}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        );
      })}
    </svg>
  );
};

// Fake long-form video player chrome, like a clip from a documentary.
const PlayerChrome: React.FC<{ f: number; outFrame: number; km: number; fps: number }> = ({ f, outFrame, km, fps }) => {
  const diwali = interpolate(f, [ARRIVE + 8, ARRIVE + 22], [0, 1], clamp);
  const clock = (frames: number) => {
    const secs = Math.floor(frames / fps);
    return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  };
  const t = clock(outFrame);
  const total = clock(RAM_TOTAL_FRAMES);
  const progress = outFrame / RAM_TOTAL_FRAMES;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 150,
          maxWidth: 640,
          background: "rgba(20,20,20,0.72)",
          borderRadius: 14,
          padding: "14px 22px",
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 34,
          lineHeight: 1.25,
          color: "#FFFFFF",
        }}
      >
        How did Shri Ram return to Ayodhya?
      </div>
      <div style={{ position: "absolute", right: 44, top: 138, textAlign: "right" }}>
        <div
          style={{
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 84,
            color: "#FFFFFF",
            textShadow: outline,
            opacity: 1 - diwali,
            lineHeight: 1,
          }}
        >
          {km.toLocaleString("en-US")}
          <span style={{ fontSize: 40, marginLeft: 8 }}>KM</span>
        </div>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            fontFamily: SERIF,
            fontWeight: 900,
            fontSize: 84,
            color: "#FFD36A",
            textShadow: `${outline}, 0 0 30px rgba(255,190,80,0.9)`,
            opacity: diwali,
            transform: `scale(${0.6 + 0.4 * diwali})`,
            transformOrigin: "100% 0",
            lineHeight: 1,
          }}
        >
          DIWALI
        </div>
      </div>
      <div style={{ position: "absolute", left: 44, right: 44, bottom: 300, display: "flex", alignItems: "center", gap: 22 }}>
        <svg width="34" height="38" viewBox="0 0 34 38">
          <path d="M3 2 L 32 19 L 3 36 Z" fill="#FFFFFF" />
        </svg>
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.35)", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, background: "#E5322D", borderRadius: 4 }} />
          <div style={{ position: "absolute", left: `${progress * 100}%`, top: "50%", width: 22, height: 22, borderRadius: "50%", background: "#E5322D", transform: "translate(-50%,-50%)" }} />
        </div>
        <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#FFFFFF", textShadow: "0 2px 4px rgba(0,0,0,0.7)" }}>
          {t} / <span style={{ fontSize: 34 }}>{total}</span>
        </div>
      </div>
      <div style={{ position: "absolute", right: 44, bottom: 250, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: "rgba(255,255,255,0.75)" }}>{HANDLE}</div>
    </>
  );
};
