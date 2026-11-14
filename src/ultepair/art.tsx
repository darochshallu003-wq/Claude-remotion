import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";

// Painted-night backdrops for "उल्टे पैर", all drawn in SVG on a 1920x1080
// canvas: sky, hills, village, fields, the tamarind tree, footprints and
// Dadi's courtyard. Everything takes the current frame for small motion
// (twinkling stars, drifting clouds, flickering windows, swaying leaves).

export const W = 1920;
export const H = 1080;
export const INK = "#14100E";
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Deterministic pseudo-random in [0, 1). */
export const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const Defs: React.FC = () => (
  <defs>
    <linearGradient id="up-sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#060a1f" />
      <stop offset="0.55" stopColor="#14214a" />
      <stop offset="1" stopColor="#2c3f6b" />
    </linearGradient>
    <radialGradient id="up-moonglow">
      <stop offset="0" stopColor="#f6f1d6" stopOpacity="0.55" />
      <stop offset="0.35" stopColor="#c9d4f0" stopOpacity="0.18" />
      <stop offset="1" stopColor="#c9d4f0" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="up-ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#1c3a2a" />
      <stop offset="1" stopColor="#0a1a10" />
    </linearGradient>
    <linearGradient id="up-mud" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#6e5540" />
      <stop offset="1" stopColor="#3d2c1f" />
    </linearGradient>
    <radialGradient id="up-warm">
      <stop offset="0" stopColor="#ffd27a" stopOpacity="0.85" />
      <stop offset="0.4" stopColor="#ff9a3c" stopOpacity="0.3" />
      <stop offset="1" stopColor="#ff9a3c" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="up-redglow">
      <stop offset="0" stopColor="#ff3b2f" stopOpacity="0.8" />
      <stop offset="1" stopColor="#ff3b2f" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="up-vignette" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.55" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.75" />
    </radialGradient>
    <linearGradient id="up-steel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#8d959e" />
      <stop offset="0.45" stopColor="#e4e8ec" />
      <stop offset="1" stopColor="#7d858e" />
    </linearGradient>
    <linearGradient id="up-door" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffcf7a" />
      <stop offset="1" stopColor="#c46a22" />
    </linearGradient>
    <filter id="up-glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="b" />
      <feMerge>
        <feMergeNode in="b" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="up-blur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" />
    </filter>
  </defs>
);

/** Night sky with stars, full moon and drifting clouds. */
export const Sky: React.FC<{ moon?: [number, number]; moonR?: number }> = ({ moon = [1480, 200], moonR = 70 }) => {
  const f = useCurrentFrame();
  return (
    <g>
      <rect width={W} height={H} fill="url(#up-sky)" />
      {Array.from({ length: 110 }, (_, i) => {
        const tw = 0.45 + 0.55 * Math.abs(Math.sin(f / (14 + rnd(i + 5) * 20) + i));
        return <circle key={i} cx={rnd(i) * W} cy={rnd(i + 99) * 620} r={0.8 + rnd(i + 7) * 1.8} fill="#e8ecff" opacity={tw * 0.8} />;
      })}
      <circle cx={moon[0]} cy={moon[1]} r={moonR * 4.2} fill="url(#up-moonglow)" />
      <circle cx={moon[0]} cy={moon[1]} r={moonR} fill="#f4f0d9" />
      <circle cx={moon[0] - moonR * 0.3} cy={moon[1] - moonR * 0.2} r={moonR * 0.18} fill="#ddd6b6" opacity={0.6} />
      <circle cx={moon[0] + moonR * 0.25} cy={moon[1] + moonR * 0.3} r={moonR * 0.24} fill="#ddd6b6" opacity={0.5} />
      <circle cx={moon[0] + moonR * 0.35} cy={moon[1] - moonR * 0.35} r={moonR * 0.1} fill="#ddd6b6" opacity={0.6} />
      {[0, 1, 2, 3].map((k) => {
        const x = ((rnd(k + 40) * W + f * (0.35 + k * 0.12)) % (W + 700)) - 350;
        const y = 90 + k * 95 + rnd(k) * 40;
        return (
          <g key={k} opacity={0.35} fill="#46557f">
            <ellipse cx={x} cy={y} rx={170} ry={26} />
            <ellipse cx={x + 70} cy={y - 16} rx={90} ry={24} />
            <ellipse cx={x - 80} cy={y - 8} rx={70} ry={18} />
          </g>
        );
      })}
    </g>
  );
};

/** A small flying bat silhouette loop. */
export const Bats: React.FC<{ y?: number }> = ({ y = 250 }) => {
  const f = useCurrentFrame();
  return (
    <g fill="#05060c">
      {[0, 1, 2].map((k) => {
        const x = ((f * (4 + k) + k * 500) % (W + 200)) - 100;
        const flap = Math.sin(f * 0.8 + k) * 10;
        const yy = y + k * 40 + Math.sin(f / 12 + k) * 20;
        return <path key={k} d={`M${x} ${yy} q -14 ${-10 - flap} -28 ${-2 - flap} q 10 4 14 10 q 6 -8 14 -8 q 8 0 14 8 q 4 -6 14 -10 q -14 ${-8 - flap} -28 ${2 + flap} z`} />;
      })}
    </g>
  );
};

export const Hills: React.FC<{ y: number; shift?: number }> = ({ y, shift = 0 }) => (
  <g>
    <path
      transform={`translate(${-shift * 0.2} 0)`}
      d={`M-400 ${y} C -200 ${y - 140}, 100 ${y - 160}, 350 ${y - 60} C 600 ${y - 190}, 900 ${y - 210}, 1150 ${y - 70} C 1400 ${y - 170}, 1700 ${y - 190}, 2000 ${y - 80} C 2200 ${y - 140}, 2400 ${y - 100}, 2600 ${y} L 2600 ${y + 200} L -400 ${y + 200} Z`}
      fill="#16223f"
    />
    <path
      transform={`translate(${-shift * 0.35} 0)`}
      d={`M-400 ${y + 30} C -100 ${y - 60}, 200 ${y - 40}, 500 ${y + 10} C 800 ${y - 70}, 1100 ${y - 60}, 1400 ${y + 10} C 1700 ${y - 50}, 2100 ${y - 40}, 2600 ${y + 30} L 2600 ${y + 200} L -400 ${y + 200} Z`}
      fill="#111b30"
    />
  </g>
);

const Hut: React.FC<{ x: number; y: number; s: number; seed: number }> = ({ x, y, s, seed }) => {
  const f = useCurrentFrame();
  const lit = 0.75 + 0.25 * Math.sin(f / (6 + rnd(seed) * 6) + seed);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-60} y={-70} width={120} height={70} fill="#2e2620" />
      <path d="M-80 -66 L 0 -125 L 80 -66 Z" fill="#1d1612" />
      <circle cx={-25} cy={-35} r={38} fill="url(#up-warm)" opacity={lit} />
      <rect x={-35} y={-48} width={20} height={20} fill="#ffb54d" opacity={lit} />
      {rnd(seed + 3) > 0.4 && <rect x={18} y={-45} width={22} height={45} fill="#3a2a1e" />}
    </g>
  );
};

const Palm: React.FC<{ x: number; y: number; s: number; seed: number }> = ({ x, y, s, seed }) => {
  const f = useCurrentFrame();
  const sway = Math.sin(f / 30 + seed) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke="#0a1220" strokeLinecap="round">
      <path d="M0 0 C 6 -80, -4 -160, 8 -230" strokeWidth={9} />
      <g transform={`translate(8 -230) rotate(${sway})`} strokeWidth={7}>
        {[-150, -110, -70, -30, 10, 50].map((a) => (
          <path key={a} d={`M0 0 q ${Math.cos((a * Math.PI) / 180) * 60} ${Math.sin((a * Math.PI) / 180) * 60 - 20} ${Math.cos((a * Math.PI) / 180) * 110} ${Math.sin((a * Math.PI) / 180) * 110 + 30}`} />
        ))}
      </g>
    </g>
  );
};

/** Far village on the horizon: huts with lit windows and palms. */
export const Village: React.FC<{ y: number; s?: number; shift?: number; from?: number; to?: number }> = ({ y, s = 1, shift = 0, from = -200, to = 2300 }) => {
  const items = [];
  for (let i = 0, x = from; x < to; i++, x += 150 + rnd(i) * 160) {
    if (rnd(i + 21) > 0.6) items.push(<Palm key={`p${i}`} x={x - shift} y={y} s={s * (0.6 + rnd(i) * 0.3)} seed={i} />);
    else items.push(<Hut key={`h${i}`} x={x - shift} y={y} s={s * (0.55 + rnd(i + 4) * 0.25)} seed={i} />);
  }
  return <g>{items}</g>;
};

/** Crop field from the horizon down, with tufts that get bigger towards the camera. */
export const Field: React.FC<{ horizon: number; shift?: number }> = ({ horizon, shift = 0 }) => {
  const rows = useMemo(() => {
    const out: { d: string; w: number; c: string; period: number }[] = [];
    const n = 14;
    for (let j = 0; j < n; j++) {
      const t = j / (n - 1);
      const y = horizon + 10 + Math.pow(t, 1.7) * (H - horizon + 40);
      const sz = 4 + t * 26;
      const gap = 8 + t * 34;
      let d = "";
      for (let x = -200; x < W + 400; x += gap) {
        const xx = x + rnd(j * 1000 + x) * gap * 0.5;
        const yy = y + rnd(j * 77 + x) * 6;
        d += `M${xx.toFixed(1)} ${yy.toFixed(1)} l ${(-sz * 0.35).toFixed(1)} ${(-sz).toFixed(1)} M${xx.toFixed(1)} ${yy.toFixed(1)} l 0 ${(-sz * 1.2).toFixed(1)} M${xx.toFixed(1)} ${yy.toFixed(1)} l ${(sz * 0.35).toFixed(1)} ${(-sz).toFixed(1)} `;
      }
      const shadeC = ["#2f5f3c", "#2a5536", "#356b43", "#244a30"][j % 4];
      out.push({ d, w: 1 + t * 3.2, c: shadeC, period: gap * 6 });
    }
    return out;
  }, [horizon]);
  return (
    <g>
      <rect x={-200} y={horizon} width={W + 400} height={H - horizon + 100} fill="url(#up-ground)" />
      {rows.map((r, j) => {
        const t = j / (rows.length - 1);
        const off = -((shift * (0.25 + t * 1.1)) % r.period);
        return <path key={j} d={r.d} transform={`translate(${off} 0)`} stroke={r.c} strokeWidth={r.w} strokeLinecap="round" fill="none" />;
      })}
    </g>
  );
};

/** Raised mud path (medh) across the field. */
export const MudPath: React.FC<{ y: number; h?: number; shift?: number }> = ({ y, h = 90, shift = 0 }) => (
  <g>
    <rect x={-200} y={y} width={W + 400} height={h} fill="url(#up-mud)" />
    <path d={`M-200 ${y} L ${W + 200} ${y}`} stroke="#8a6c50" strokeWidth={4} />
    {Array.from({ length: 40 }, (_, i) => {
      const x = (((i * 97 - shift) % (W + 200)) + W + 200) % (W + 200) - 100;
      return <ellipse key={i} cx={x} cy={y + 20 + rnd(i) * (h - 30)} rx={6 + rnd(i + 3) * 10} ry={3} fill="#2f2117" opacity={0.5} />;
    })}
  </g>
);

/** The big old tamarind tree, with a red cloth tied on its trunk. */
export const TamarindTree: React.FC<{ x: number; y: number; s: number; sway?: number; eyes?: number }> = ({ x, y, s, sway = 1, eyes = 0 }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 26) * 3 * sway;
  const blobs = useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => {
        const a = rnd(i) * Math.PI;
        const r = 120 + rnd(i + 50) * 260;
        return { cx: Math.cos(a) * r * 1.35, cy: -560 - Math.sin(a) * r * 0.75 + rnd(i + 9) * 60, r: 70 + rnd(i + 3) * 70, c: ["#0d2418", "#112d1e", "#16382a", "#0a1c13"][i % 4] };
      }),
    [],
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* roots + trunk */}
      <path
        d="M-120 0 C -90 -20, -70 -60, -72 -160 C -76 -260, -100 -330, -150 -400 L -100 -420 C -60 -360, -40 -330, -20 -300 C -10 -380, 0 -430, -20 -500 L 30 -500 C 40 -440, 44 -380, 40 -310 C 80 -360, 120 -400, 190 -420 L 210 -380 C 140 -350, 90 -300, 70 -200 C 64 -120, 80 -50, 140 0 Z"
        fill="#2a1d16"
        stroke={INK}
        strokeWidth={6}
      />
      <path d="M-40 -60 C -30 -140, -40 -220, -60 -280 M 20 -80 C 30 -160, 20 -230, 10 -300" stroke="#3d2c22" strokeWidth={8} fill="none" />
      <path d="M-160 4 C -120 -10, -100 -20, -90 -40 M 150 4 C 120 -10, 100 -25, 80 -50" stroke="#2a1d16" strokeWidth={16} strokeLinecap="round" fill="none" />
      {/* red cloth tied on the trunk */}
      <path d="M-74 -190 C -20 -200, 30 -200, 70 -186 L 68 -170 C 30 -182, -20 -182, -74 -172 Z" fill="#b3261e" />
      <path d={`M 64 -180 C 90 -150, 84 -120, ${96 + sw * 2} -96 L ${84 + sw * 2} -92 C 72 -120, 70 -150, 52 -172 Z`} fill="#8f1d17" />
      {/* canopy */}
      <g transform={`rotate(${sw * 0.4} 0 -420)`}>
        {blobs.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.c} />
        ))}
        {blobs.slice(0, 18).map((b, i) => (
          <circle key={`h${i}`} cx={b.cx + 22} cy={b.cy - 26} r={b.r * 0.45} fill="#24503a" opacity={0.35} />
        ))}
        {/* hanging tendrils */}
        {[-300, -220, -120, 160, 260, 330].map((hx, i) => (
          <path key={hx} d={`M${hx} -420 C ${hx + 8 + sw * 3} -340, ${hx - 6 + sw * 4} -300, ${hx + sw * 6} ${-250 + (i % 3) * 30}`} stroke="#0b1d13" strokeWidth={5} fill="none" />
        ))}
        {eyes > 0 && (
          <g opacity={eyes} filter="url(#up-glow)">
            <ellipse cx={-50} cy={-600} rx={20} ry={9 * eyes} fill="#f6e05e" />
            <ellipse cx={30} cy={-600} rx={20} ry={9 * eyes} fill="#f6e05e" />
            <ellipse cx={-50} cy={-600} rx={4} ry={8 * eyes} fill="#7a1010" />
            <ellipse cx={30} cy={-600} rx={4} ry={8 * eyes} fill="#7a1010" />
          </g>
        )}
      </g>
    </g>
  );
};

/** One bare footprint, toes pointing up (rotate to aim). */
export const Footprint: React.FC<{ x: number; y: number; rot: number; s: number; glow?: number; opacity?: number }> = ({ x, y, rot, s, glow = 0, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
    {glow > 0 && <ellipse cx={0} cy={-6} rx={46} ry={70} fill="url(#up-redglow)" opacity={glow} />}
    <path d="M-14 40 C -26 30, -24 0, -20 -20 C -16 -40, 18 -40, 20 -18 C 22 4, 18 28, 10 40 C 4 48, -8 48, -14 40 Z" fill={glow > 0.5 ? "#5a1712" : "#2a1b12"} opacity={0.85} />
    {[
      [-17, -48, 8],
      [-4, -54, 6.5],
      [7, -53, 5.5],
      [16, -48, 5],
      [22, -40, 4.5],
    ].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={glow > 0.5 ? "#5a1712" : "#2a1b12"} opacity={0.85} />
    ))}
  </g>
);

/** Close-up of moonlit mud for the footprint shots. */
export const MudCloseup: React.FC<{ shift?: number }> = ({ shift = 0 }) => (
  <g>
    <rect width={W} height={H} fill="#4a3a2b" />
    {Array.from({ length: 260 }, (_, i) => {
      const x = (((rnd(i) * (W + 400) - shift) % (W + 400)) + W + 400) % (W + 400) - 200;
      return <ellipse key={i} cx={x} cy={rnd(i + 300) * H} rx={2 + rnd(i + 5) * 9} ry={1.5 + rnd(i + 6) * 4} fill={rnd(i + 7) > 0.5 ? "#3a2c20" : "#5d4936"} opacity={0.7} />;
    })}
    {/* grass edges */}
    {Array.from({ length: 70 }, (_, i) => {
      const x = ((((i * 37 - shift) % (W + 200)) + W + 200) % (W + 200)) - 100;
      return (
        <g key={i} stroke="#2c5a37" strokeWidth={6} strokeLinecap="round">
          <path d={`M${x} 140 l -12 -110 M${x} 140 l 10 -140 M${x} 140 l 26 -100`} />
          <path d={`M${x + 18} ${H - 120} l -14 130 M${x + 18} ${H - 120} l 8 150`} />
        </g>
      );
    })}
    <rect width={W} height={H} fill="#1a2b5c" opacity={0.42} />
  </g>
);

/** Dadi's courtyard: mud hut with a lit doorway, charpai, chulha and tulsi. */
export const Courtyard: React.FC<{ fire?: boolean; steam?: number }> = ({ fire = true, steam = 0 }) => {
  const f = useCurrentFrame();
  const flick = 0.85 + 0.15 * Math.sin(f * 0.7) * Math.sin(f * 0.31);
  return (
    <g>
      <rect width={W} height={H} fill="url(#up-sky)" />
      <circle cx={300} cy={150} r={55} fill="#f4f0d9" />
      <circle cx={300} cy={150} r={220} fill="url(#up-moonglow)" />
      {/* back wall + hut */}
      <rect x={0} y={420} width={W} height={330} fill="#3b2a1f" />
      <rect x={880} y={260} width={1040} height={500} fill="#6b4a33" stroke={INK} strokeWidth={6} />
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${900 + rnd(i) * 980} ${300 + rnd(i + 20) * 420} q 30 ${-6 + rnd(i) * 12} 60 0`} stroke="#5a3d29" strokeWidth={4} fill="none" />
      ))}
      {/* thatch roof */}
      <path d="M820 300 L 1400 120 L 1980 300 L 1980 340 L 820 340 Z" fill="#7d5d32" stroke={INK} strokeWidth={6} />
      {Array.from({ length: 50 }, (_, i) => (
        <path key={i} d={`M${830 + i * 23} ${335} l ${-6 + rnd(i) * 12} ${-40 - rnd(i + 2) * 60}`} stroke="#5b4222" strokeWidth={4} />
      ))}
      {/* doorway with warm light */}
      <rect x={1230} y={450} width={200} height={310} fill="url(#up-door)" stroke="#3a2416" strokeWidth={14} opacity={flick} />
      <circle cx={1330} cy={620} r={420} fill="url(#up-warm)" opacity={0.55 * flick} />
      {/* window */}
      <rect x={1620} y={460} width={120} height={100} fill="#ffb54d" opacity={0.85 * flick} stroke="#3a2416" strokeWidth={10} />
      <path d="M1680 460 L 1680 560 M1620 510 L 1740 510" stroke="#3a2416" strokeWidth={8} />
      {/* ground */}
      <rect x={0} y={750} width={W} height={330} fill="#4a3424" />
      {Array.from({ length: 50 }, (_, i) => (
        <ellipse key={i} cx={rnd(i) * W} cy={770 + rnd(i + 8) * 300} rx={8 + rnd(i + 2) * 14} ry={3} fill="#3a281b" />
      ))}
      {/* low boundary wall on the left */}
      <rect x={0} y={560} width={560} height={200} fill="#5b3f2b" stroke={INK} strokeWidth={6} />
      <path d="M0 560 C 140 540, 400 540, 560 560" stroke="#7a5a3f" strokeWidth={12} fill="none" />
      {/* tulsi planter */}
      <g transform="translate(700 760)">
        <rect x={-60} y={-130} width={120} height={130} fill="#c9a77a" stroke={INK} strokeWidth={5} />
        <rect x={-70} y={-145} width={140} height={20} fill="#b38f62" stroke={INK} strokeWidth={5} />
        {Array.from({ length: 9 }, (_, i) => (
          <ellipse key={i} cx={-30 + (i % 3) * 30} cy={-170 - Math.floor(i / 3) * 28} rx={22} ry={14} fill={i % 2 ? "#2f6a3a" : "#3c7e46"} />
        ))}
        <circle cx={0} cy={-80} r={10} fill="#e14b2a" />
      </g>
      {/* charpai */}
      <g transform="translate(400 880)">
        <rect x={-210} y={-50} width={420} height={70} fill="#c69c62" stroke={INK} strokeWidth={6} />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${-200 + i * 36} -45 l 30 60`} stroke="#9b7444" strokeWidth={4} />
        ))}
        <rect x={-210} y={-50} width={20} height={150} fill="#8a5a2c" stroke={INK} strokeWidth={5} />
        <rect x={190} y={-50} width={20} height={150} fill="#8a5a2c" stroke={INK} strokeWidth={5} />
      </g>
      {/* chulha with pot */}
      <g transform="translate(1020 900)">
        <path d="M-90 0 L -90 -70 C -90 -100, 90 -100, 90 -70 L 90 0 Z" fill="#8a6142" stroke={INK} strokeWidth={6} />
        {fire && (
          <g filter="url(#up-glow)">
            <path d={`M-40 -20 C -50 ${-70 - flick * 20}, -10 ${-80 - flick * 10}, 0 ${-120 - flick * 30} C 10 -80, 50 -70, 40 -20 Z`} fill="#ff8c2a" />
            <path d={`M-20 -20 C -24 -60, 0 -70, 4 ${-90 - flick * 20} C 12 -60, 26 -50, 20 -20 Z`} fill="#ffd25e" />
          </g>
        )}
        <circle cx={0} cy={-60} r={150} fill="url(#up-warm)" opacity={0.6 * flick} />
        <path d="M-70 -110 C -70 -170, 70 -170, 70 -110 Z" fill="#a9adb2" stroke={INK} strokeWidth={5} />
        <rect x={-76} y={-178} width={152} height={14} rx={6} fill="#c4c8cc" stroke={INK} strokeWidth={4} />
        {steam > 0 &&
          [0, 1, 2].map((k) => {
            const p = ((f + k * 20) % 60) / 60;
            return (
              <path
                key={k}
                d={`M${-30 + k * 30} -190 c 20 -30, -20 -60, 0 -90 c 20 -30, -10 -50, 4 -70`}
                stroke="#e9ecef"
                strokeWidth={8}
                strokeLinecap="round"
                fill="none"
                opacity={steam * (1 - p) * 0.6}
                transform={`translate(0 ${-p * 60})`}
              />
            );
          })}
      </g>
      <rect width={W} height={H} fill="#13204a" opacity={0.18} />
    </g>
  );
};

/** Drifting fireflies. */
export const Fireflies: React.FC<{ n?: number; y0?: number; y1?: number }> = ({ n = 14, y0 = 500, y1 = 1000 }) => {
  const f = useCurrentFrame();
  return (
    <g filter="url(#up-glow)">
      {Array.from({ length: n }, (_, i) => {
        const x = rnd(i) * W + Math.sin(f / 40 + i) * 60;
        const y = y0 + rnd(i + 30) * (y1 - y0) + Math.cos(f / 33 + i * 2) * 30;
        const on = 0.3 + 0.7 * Math.max(0, Math.sin(f / 15 + i * 1.7));
        return <circle key={i} cx={x} cy={y} r={4} fill="#e9ff8a" opacity={on} />;
      })}
    </g>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 1 }) => <rect width={W} height={H} fill="url(#up-vignette)" opacity={strength} />;

/** Camera: zoom `z` centred on canvas point (cx, cy), with optional shake. */
export const Cam: React.FC<{ z: number; cx: number; cy: number; shake?: number; children: React.ReactNode }> = ({ z, cx, cy, shake = 0, children }) => {
  const f = useCurrentFrame();
  const sx = shake * (Math.sin(f * 2.1) + Math.sin(f * 3.7)) * 6;
  const sy = shake * (Math.cos(f * 2.7) + Math.sin(f * 1.3)) * 6;
  return <g transform={`translate(${W / 2 + sx} ${H / 2 + sy}) scale(${z}) translate(${-cx} ${-cy})`}>{children}</g>;
};
