import React from "react";
import { random } from "remotion";

// Illustrations for the petrichor explainer ("kraft paper" look): flat fills,
// ink outlines, a little hatching.

const INK = "#231F1C";
export const RED = "#D0312D";
export const SOIL = "#8A5A35";
export const SOIL_DARK = "#5E3B21";
export const RAIN = "#9CC3DA";
export const MICROBE = "#5FA36A";

/** Monsoon card: grey sky, falling rain, cracked dry earth with splashes. */
export const RainOnSoil: React.FC<{ frame: number; w: number; h: number; intensity?: number }> = ({ frame, w, h, intensity = 1 }) => {
  const ground = h * 0.62;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#59656F" />
          <stop offset="100%" stopColor="#9AA6AD" />
        </linearGradient>
      </defs>
      <rect width={w} height={ground} fill="url(#sky)" />
      {[0.15, 0.5, 0.82].map((cx, i) => (
        <g key={i} fill="#4A545C" opacity={0.85}>
          <ellipse cx={w * cx} cy={h * 0.12 + i * 8} rx={w * 0.18} ry={h * 0.07} />
          <ellipse cx={w * cx + w * 0.1} cy={h * 0.1 + i * 8} rx={w * 0.12} ry={h * 0.06} />
        </g>
      ))}
      {new Array(Math.round(46 * intensity)).fill(0).map((_, i) => {
        const x = random(`rx${i}`) * w;
        const speed = 22 + random(`rs${i}`) * 10;
        const y = ((frame * speed + random(`ry${i}`) * ground) % ground);
        return <line key={i} x1={x} y1={y} x2={x - 6} y2={y + 34} stroke={RAIN} strokeWidth={3} opacity={0.8} />;
      })}
      <rect y={ground} width={w} height={h - ground} fill={SOIL} />
      {/* cracks */}
      {new Array(9).fill(0).map((_, i) => {
        const x = random(`cx${i}`) * w;
        const y = ground + 20 + random(`cy${i}`) * (h - ground - 40);
        return <path key={i} d={`M${x} ${y} l 30 8 l 18 -12 l 26 10 M${x + 30} ${y + 8} l -6 22`} stroke={SOIL_DARK} strokeWidth={4} fill="none" />;
      })}
      {/* splashes */}
      {new Array(7).fill(0).map((_, i) => {
        const period = 18;
        const t = ((frame + i * 5) % period) / period;
        const x = (0.1 + random(`sx${i}`) * 0.8) * w;
        const y = ground + 10 + random(`sy${i}`) * (h - ground - 30);
        return (
          <g key={i} opacity={1 - t} stroke={RAIN} strokeWidth={3} fill="none">
            <ellipse cx={x} cy={y} rx={6 + t * 30} ry={2 + t * 8} />
          </g>
        );
      })}
      <rect width={w} height={h} fill="none" stroke={INK} strokeWidth={6} />
    </svg>
  );
};

/** Branching Streptomyces filaments with spore chains. */
export const Streptomyces: React.FC<{ size: number; grow?: number }> = ({ size, grow = 1 }) => {
  const branches = [
    "M60 300 C 120 260, 160 250, 220 200 C 260 165, 300 160, 340 120",
    "M160 250 C 170 200, 150 160, 170 110",
    "M220 200 C 260 230, 300 250, 350 260",
    "M300 160 C 320 120, 310 80, 330 50",
    "M100 280 C 90 240, 70 210, 60 170",
    "M270 240 C 280 290, 270 320, 300 350",
  ];
  return (
    <svg viewBox="0 0 400 400" width={size} height={size}>
      {branches.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={MICROBE} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, Math.max(0, grow * 1.4 - i * 0.08))} />
      ))}
      {[
        [340, 120],
        [170, 110],
        [330, 50],
        [60, 170],
        [350, 260],
        [300, 350],
      ].map(([x, y], i) =>
        [0, 1, 2, 3].map((k) => (
          <circle key={`${i}-${k}`} cx={x + k * 9} cy={y - k * 11} r={7} fill="#B7D88C" stroke={INK} strokeWidth={2} opacity={grow > 0.8 ? 1 : 0} />
        ))
      )}
    </svg>
  );
};

/** Geosmin skeleton: two fused rings with an OH and methyl groups. */
export const Geosmin: React.FC<{ size: number; color?: string }> = ({ size, color = "#F1E7D2" }) => {
  const hex = (cx: number, cy: number, r: number) =>
    new Array(6).fill(0).map((_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
  const a = hex(110, 100, 50);
  const b = hex(110 + 50 * Math.sqrt(3), 100, 50);
  const path = (pts: number[][]) => `M${pts.map((p) => p.join(" ")).join(" L ")} Z`;
  return (
    <svg viewBox="0 0 330 200" width={size} height={(size * 200) / 330}>
      <g fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round">
        <path d={path(a)} />
        <path d={path(b)} />
        <path d={`M${b[0][0]} ${b[0][1]} l 40 22`} />
        <path d={`M${a[3][0]} ${a[3][1]} l -40 22`} />
        <path d={`M${a[5][0]} ${a[5][1]} l 0 -40`} />
      </g>
      <text x={b[0][0] + 44} y={b[0][1] + 40} fontFamily="Oswald" fontWeight={700} fontSize="30" fill={color}>
        OH
      </text>
      <text x="165" y="196" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="22" fill={color} letterSpacing="3">
        C12H22O
      </text>
    </svg>
  );
};

/** Side profile of a nose with sniff lines. */
export const Nose: React.FC<{ size: number; sniff?: number }> = ({ size, sniff = 0 }) => (
  <svg viewBox="0 0 320 360" width={size} height={(size * 360) / 320}>
    <path d="M220 10 C 200 80, 160 150, 120 210 C 100 240, 110 270, 150 275 C 175 278, 185 268, 200 272 C 215 276, 220 300, 230 320 L 320 330 L 320 0 Z" fill="#E2B48C" stroke={INK} strokeWidth={7} />
    <path d="M150 250 C 162 258, 176 256, 186 248" fill="none" stroke={INK} strokeWidth={5} />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${90 - i * 34 - sniff * 20} ${240 + i * 10} q -20 -14 -40 0`} fill="none" stroke={RED} strokeWidth={5} strokeLinecap="round" opacity={sniff} />
    ))}
  </svg>
);

/** Springtail: tiny six-legged soil hexapod with antennae and a forked tail. */
export const Springtail: React.FC<{ size: number; step?: number; color?: string }> = ({ size, step = 0, color = "#B7A28A" }) => {
  const leg = (x: number, phase: number) => `M${x} 120 l ${-8 + Math.sin(step + phase) * 8} 34`;
  return (
    <svg viewBox="0 0 320 200" width={size} height={(size * 200) / 320}>
      <g stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none">
        {[110, 150, 190].map((x, i) => (
          <path key={x} d={leg(x, i * 2)} />
        ))}
        <path d="M250 90 C 280 60, 300 50, 318 54" />
        <path d="M250 96 C 285 80, 300 86, 316 96" />
        <path d="M60 120 C 40 150, 30 160, 10 170 M62 122 C 50 158, 44 170, 30 184" />
      </g>
      <path d="M60 110 C 60 70, 120 60, 180 64 C 230 66, 262 80, 262 100 C 262 122, 220 130, 170 130 C 110 130, 60 130, 60 110 Z" fill={color} stroke={INK} strokeWidth={6} />
      {[100, 140, 180, 220].map((x) => (
        <path key={x} d={`M${x} 68 C ${x + 4} 90, ${x + 4} 110, ${x} 128`} fill="none" stroke={INK} strokeWidth={3} opacity={0.5} />
      ))}
      <circle cx="244" cy="90" r="7" fill={INK} />
    </svg>
  );
};

/** Attar bottle with baked clay discs (Kannauj mitti attar). */
export const AttarBottle: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 420 360" width={size} height={(size * 360) / 420}>
    {/* clay discs */}
    {[
      [60, 300],
      [130, 318],
      [330, 310],
    ].map(([x, y], i) => (
      <g key={i}>
        <ellipse cx={x} cy={y} rx={52} ry={20} fill="#9C5B34" stroke={INK} strokeWidth={5} />
        <ellipse cx={x} cy={y - 6} rx={52} ry={20} fill="#C07A4A" stroke={INK} strokeWidth={5} />
      </g>
    ))}
    {/* bottle */}
    <path d="M190 40 L 230 40 L 230 80 C 300 110, 300 250, 210 290 C 120 250, 120 110, 190 80 Z" fill="rgba(241,231,210,0.4)" stroke={INK} strokeWidth={6} />
    <path d="M150 170 C 150 240, 180 270, 210 285 C 240 270, 270 240, 270 170 Z" fill="#C98A3A" opacity={0.9} />
    <path d="M182 8 L 238 8 L 230 40 L 190 40 Z" fill="#B88A2B" stroke={INK} strokeWidth={5} />
    <path d="M170 120 C 160 150, 160 190, 172 220" fill="none" stroke="#FFFFFF" strokeWidth={8} opacity={0.5} strokeLinecap="round" />
  </svg>
);

export const Beetroot: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 300 380" width={size} height={(size * 380) / 300}>
    {[-30, 0, 30].map((a, i) => (
      <path key={i} d="M150 150 C 130 90, 120 50, 150 10 C 180 50, 170 90, 150 150 Z" fill="#5E8F3E" stroke={INK} strokeWidth={5} transform={`rotate(${a} 150 150)`} />
    ))}
    <path d="M150 140 C 70 150, 50 240, 90 290 C 115 320, 140 330, 150 370 C 160 330, 185 320, 210 290 C 250 240, 230 150, 150 140 Z" fill="#8E1F45" stroke={INK} strokeWidth={6} />
    <path d="M100 220 C 120 200, 180 200, 200 220 M95 260 C 125 245, 175 245, 205 260" fill="none" stroke="#B23A63" strokeWidth={4} />
    <path d="M100 200 C 92 230, 96 260, 112 280" fill="none" stroke="#E07AA0" strokeWidth={8} strokeLinecap="round" opacity={0.6} />
  </svg>
);
