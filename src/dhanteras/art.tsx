import React from "react";

// Illustrations for the Dhanteras explainer, in the series' "ink engraving"
// style: gradient fill, hatched shade, dark ink outline.

const INK = "#2A2420";
export const GOLD = "#E8B53A";
export const BRASS = "#C98A2B";
export const FLAME = "#FFB23F";

const Hatch: React.FC<{ id: string }> = ({ id }) => (
  <pattern id={id} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
    <line x1="0" y1="0" x2="0" y2="9" stroke={INK} strokeWidth={2} opacity={0.3} />
  </pattern>
);

/** Clay diya. `flicker` (0..1) wobbles the flame; `lit` 0 hides it. */
export const Diya: React.FC<{ id: string; size: number; flicker?: number; lit?: number; style?: React.CSSProperties }> = ({
  id,
  size,
  flicker = 0,
  lit = 1,
  style,
}) => (
  <svg viewBox="0 0 240 220" width={size} height={(size * 220) / 240} style={{ overflow: "visible", ...style }}>
    <defs>
      <linearGradient id={`${id}c`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D2733A" />
        <stop offset="100%" stopColor="#7E3A18" />
      </linearGradient>
      <radialGradient id={`${id}f`} cx="50%" cy="70%" r="60%">
        <stop offset="0%" stopColor="#FFF6C8" />
        <stop offset="45%" stopColor={FLAME} />
        <stop offset="100%" stopColor="#E0541B" />
      </radialGradient>
      <radialGradient id={`${id}g`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255,190,80,0.55)" />
        <stop offset="100%" stopColor="rgba(255,190,80,0)" />
      </radialGradient>
      <Hatch id={`${id}h`} />
    </defs>
    {lit > 0 && <circle cx="170" cy="80" r={110} fill={`url(#${id}g)`} opacity={lit * (0.85 + flicker * 0.15)} />}
    <path d="M20 130 C 40 200, 200 200, 222 130 C 230 122, 214 112, 196 118 L 180 122 C 150 128, 80 128, 40 122 C 25 120, 15 124, 20 130 Z" fill={`url(#${id}c)`} stroke={INK} strokeWidth={6} />
    <path d="M40 150 C 80 180, 170 180, 205 148" fill={`url(#${id}h)`} stroke="none" />
    <ellipse cx="110" cy="124" rx="80" ry="12" fill="#5A2A12" stroke={INK} strokeWidth={4} />
    <path d="M150 124 L 182 112" stroke={INK} strokeWidth={6} strokeLinecap="round" />
    {lit > 0 && (
      <path
        d={`M182 108 C ${160 + flicker * 6} 80, ${170 - flicker * 4} 50, ${182 + flicker * 5} ${26 - flicker * 6} C ${196 + flicker * 3} 52, ${204 - flicker * 4} 82, 182 108 Z`}
        fill={`url(#${id}f)`}
        opacity={lit}
      />
    )}
  </svg>
);

/** Brass kalash. `glow` adds the amrit shine above its mouth. */
export const Kalash: React.FC<{ id: string; size: number; glow?: number; style?: React.CSSProperties }> = ({ id, size, glow = 0, style }) => (
  <svg viewBox="0 0 300 380" width={size} height={(size * 380) / 300} style={{ overflow: "visible", ...style }}>
    <defs>
      <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8A5A14" />
        <stop offset="35%" stopColor="#F2C75A" />
        <stop offset="60%" stopColor={GOLD} />
        <stop offset="100%" stopColor="#7A4A0E" />
      </linearGradient>
      <radialGradient id={`${id}a`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255,248,210,0.95)" />
        <stop offset="100%" stopColor="rgba(255,220,120,0)" />
      </radialGradient>
      <Hatch id={`${id}h`} />
    </defs>
    {glow > 0 && <circle cx="150" cy="70" r={150} fill={`url(#${id}a)`} opacity={glow} />}
    {/* mango leaves */}
    {[-50, -25, 0, 25, 50].map((a, i) => (
      <path key={i} d="M150 92 C 130 60, 140 20, 150 0 C 160 20, 170 60, 150 92 Z" fill="#4E8A3A" stroke={INK} strokeWidth={4} transform={`rotate(${a} 150 100)`} />
    ))}
    {/* coconut */}
    <ellipse cx="150" cy="78" rx="46" ry="40" fill="#9A6A3A" stroke={INK} strokeWidth={5} />
    <path d="M118 60 q 32 -18 64 0" fill="none" stroke="#5A3A1A" strokeWidth={4} />
    {/* neck + body */}
    <path d="M100 110 L 200 110 L 186 150 C 270 170, 290 260, 240 320 C 210 356, 90 356, 60 320 C 10 260, 30 170, 114 150 Z" fill={`url(#${id}b)`} stroke={INK} strokeWidth={6} />
    <ellipse cx="150" cy="110" rx="56" ry="12" fill="#F2C75A" stroke={INK} strokeWidth={5} />
    <path d="M60 230 C 110 250, 190 250, 240 230" fill="none" stroke={INK} strokeWidth={4} opacity={0.6} />
    <path d="M70 290 C 120 330, 200 320, 236 280" fill={`url(#${id}h)`} stroke="none" />
    {/* lotus mark */}
    <path d="M150 196 C 138 210, 138 222, 150 232 C 162 222, 162 210, 150 196 Z M132 214 C 126 226, 134 234, 150 232 M168 214 C 174 226, 166 234, 150 232" fill="#B5501C" stroke={INK} strokeWidth={3} />
    <path d="M86 180 C 70 200, 70 240, 90 260" stroke="#FFF1C2" strokeWidth={9} opacity={0.5} fill="none" strokeLinecap="round" />
  </svg>
);

/** Stack of gold coins. `n` coins are shown, bottom first. */
export const Coins: React.FC<{ size: number; n?: number; style?: React.CSSProperties }> = ({ size, n = 6, style }) => (
  <svg viewBox="0 0 260 320" width={size} height={(size * 320) / 260} style={{ overflow: "visible", ...style }}>
    {new Array(n).fill(0).map((_, i) => {
      const y = 280 - i * 34;
      return (
        <g key={i}>
          <path d={`M30 ${y} L 30 ${y + 18} C 30 ${y + 46}, 230 ${y + 46}, 230 ${y + 18} L 230 ${y} Z`} fill="#B8861E" stroke={INK} strokeWidth={5} />
          <ellipse cx="130" cy={y} rx="100" ry="26" fill={GOLD} stroke={INK} strokeWidth={5} />
          <ellipse cx="130" cy={y} rx="66" ry="15" fill="none" stroke="#B8861E" strokeWidth={4} />
        </g>
      );
    })}
  </svg>
);

/** Brass lota + thali, the "new bartan". */
export const Bartan: React.FC<{ id: string; size: number; shine?: number }> = ({ id, size, shine = 0 }) => (
  <svg viewBox="0 0 420 340" width={size} height={(size * 340) / 420} style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8A5A14" />
        <stop offset="40%" stopColor="#F2C75A" />
        <stop offset="100%" stopColor="#7A4A0E" />
      </linearGradient>
    </defs>
    {/* thali */}
    <ellipse cx="210" cy="290" rx="200" ry="40" fill="#B8861E" stroke={INK} strokeWidth={6} />
    <ellipse cx="210" cy="282" rx="170" ry="28" fill={GOLD} stroke={INK} strokeWidth={4} />
    {/* lota */}
    <path d="M170 60 L 250 60 L 240 96 C 320 120, 330 220, 270 262 C 240 282, 180 282, 150 262 C 90 220, 100 120, 180 96 Z" fill={`url(#${id}b)`} stroke={INK} strokeWidth={6} />
    <ellipse cx="210" cy="60" rx="52" ry="12" fill="#F2C75A" stroke={INK} strokeWidth={5} />
    <path d="M130 180 C 170 200, 250 200, 290 180" fill="none" stroke={INK} strokeWidth={4} opacity={0.5} />
    {/* sparkle */}
    <g opacity={shine} transform="translate(160 150)">
      <path d="M0 -36 L 8 -8 L 36 0 L 8 8 L 0 36 L -8 8 L -36 0 L -8 -8 Z" fill="#FFF8DA" />
    </g>
  </svg>
);

/** Coiled cobra seen side-on; `rise` 0..1 lifts the hood. */
export const Snake: React.FC<{ size: number; rise?: number; style?: React.CSSProperties }> = ({ size, rise = 1, style }) => {
  const hy = 150 - 90 * rise;
  return (
    <svg viewBox="0 0 320 300" width={size} height={(size * 300) / 320} style={{ overflow: "visible", ...style }}>
      <ellipse cx="160" cy="250" rx="130" ry="36" fill="#3F5A2E" stroke={INK} strokeWidth={6} />
      <ellipse cx="160" cy="236" rx="90" ry="24" fill="#52753A" stroke={INK} strokeWidth={5} />
      <path d={`M150 230 C 130 200, 150 ${hy + 80}, 160 ${hy + 40}`} fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" />
      <path d={`M150 230 C 130 200, 150 ${hy + 80}, 160 ${hy + 40}`} fill="none" stroke="#5E8442" strokeWidth={24} strokeLinecap="round" />
      <path d={`M160 ${hy - 10} C 110 ${hy}, 110 ${hy + 70}, 160 ${hy + 60} C 210 ${hy + 70}, 210 ${hy}, 160 ${hy - 10} Z`} fill="#5E8442" stroke={INK} strokeWidth={6} />
      <path d={`M150 ${hy + 24} q 10 10 20 0`} fill="none" stroke="#C9D98A" strokeWidth={4} />
      <circle cx="148" cy={hy + 10} r={5} fill={INK} />
      <circle cx="172" cy={hy + 10} r={5} fill={INK} />
    </svg>
  );
};

/** Traditional grass broom (phool jhadu). */
export const Jhadu: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg viewBox="0 0 200 420" width={(size * 200) / 420} height={size} style={style}>
    {new Array(15).fill(0).map((_, i) => {
      const x = 30 + i * 10;
      return <path key={i} d={`M100 150 C ${100 + (x - 100) * 0.4} 260, ${x} 340, ${x + (i % 2 ? 4 : -4)} 410`} fill="none" stroke={i % 3 ? "#D8B26A" : "#B88A44"} strokeWidth={6} strokeLinecap="round" />;
    })}
    <path d="M80 20 L 120 20 L 124 160 L 76 160 Z" fill="#C0392B" stroke={INK} strokeWidth={6} />
    {[50, 90, 130].map((y) => (
      <line key={y} x1="78" y1={y} x2="122" y2={y} stroke="#F2C75A" strokeWidth={6} />
    ))}
  </svg>
);

/** Small lotus (Lakshmi). */
export const Lotus: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg viewBox="0 0 300 200" width={size} height={(size * 200) / 300} style={style}>
    {[-60, -30, 0, 30, 60].map((a, i) => (
      <path key={i} d="M150 180 C 110 140, 120 60, 150 20 C 180 60, 190 140, 150 180 Z" fill={i === 2 ? "#F48FB1" : "#EC6F9A"} stroke={INK} strokeWidth={5} transform={`rotate(${a} 150 180)`} />
    ))}
    <ellipse cx="150" cy="184" rx="90" ry="14" fill="#4E8A3A" stroke={INK} strokeWidth={4} />
  </svg>
);

/** Waves for the ocean churning, offset by `phase`. */
export const Waves: React.FC<{ width: number; phase: number; color: string; y: number; amp?: number }> = ({ width, phase, color, y, amp = 22 }) => {
  const pts: string[] = [];
  for (let x = 0; x <= width; x += 20) pts.push(`${x},${y + Math.sin(x / 70 + phase) * amp}`);
  return (
    <svg width={width} height={y + 600} style={{ position: "absolute", left: 0, top: 0 }}>
      <polygon points={`0,${y + 600} ${pts.join(" ")} ${width},${y + 600}`} fill={color} stroke={INK} strokeWidth={5} />
    </svg>
  );
};
