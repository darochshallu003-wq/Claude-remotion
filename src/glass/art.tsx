import React from "react";
import { random, useCurrentFrame } from "remotion";
import { K } from "../reel/kit";

// Props for the cold-glass reel.

const INK = K.ink;

/** One water droplet, ~r px wide. */
export const Drop: React.FC<{ x: number; y: number; r: number; opacity?: number }> = ({ x, y, r, opacity = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <path d={`M0 ${-r * 1.5} C ${r * 0.9} ${-r * 0.3}, ${r} ${r * 0.2}, 0 ${r} C ${-r} ${r * 0.2}, ${-r * 0.9} ${-r * 0.3}, 0 ${-r * 1.5} Z`} fill="#BFE3F2" stroke={INK} strokeWidth={Math.max(2, r / 4)} />
    <circle cx={-r * 0.3} cy={-r * 0.1} r={r * 0.22} fill="white" />
  </g>
);

/**
 * Tumbler of iced water. `drops` 0-1 fogs the outside with droplets,
 * `water` is the water colour.
 */
export const Glass: React.FC<{ size: number; drops?: number; water?: string; seed?: string }> = ({
  size,
  drops = 0,
  water = "#9FD3EA",
  seed = "g",
}) => {
  const frame = useCurrentFrame();
  const N = 22;
  return (
    <svg viewBox="0 0 240 340" width={size} height={(size * 340) / 240} style={{ overflow: "visible" }}>
      <g stroke={INK} strokeWidth={6} strokeLinejoin="round">
        {/* water */}
        <path d="M34 90 L 52 312 C 54 324, 62 328, 72 328 L 168 328 C 178 328, 186 324, 188 312 L 206 90 Z" fill={water} opacity={0.85} stroke="none" />
        {/* ice */}
        <rect x="62" y="70" width="58" height="54" rx="10" fill="#EAF7FD" transform="rotate(-12 91 97)" strokeWidth={5} />
        <rect x="120" y="78" width="54" height="50" rx="10" fill="#EAF7FD" transform="rotate(14 147 103)" strokeWidth={5} />
        <path d="M34 90 L 206 90" strokeWidth={4} opacity={0.5} />
        {/* glass */}
        <path d="M20 14 L 50 314 C 52 328, 64 334, 76 334 L 164 334 C 176 334, 188 328, 190 314 L 220 14 Z" fill="rgba(255,255,255,0.25)" />
        <path d="M44 40 L 64 290" stroke="white" strokeWidth={10} strokeLinecap="round" opacity={0.7} />
      </g>
      {Array.from({ length: N }, (_, i) => {
        const appear = drops * N - i;
        if (appear <= 0) return null;
        const y0 = 40 + random(`${seed}y${i}`) * 260;
        const half = 100 - (y0 - 14) * 0.1; // glass half-width at this height
        const x = 120 + (random(`${seed}x${i}`) * 2 - 1) * (half - 14);
        const slide = i % 4 === 0 ? Math.min(40, Math.max(0, (frame - 30) * 0.4)) : 0;
        const r = 5 + random(`${seed}r${i}`) * 6;
        return <Drop key={i} x={x} y={y0 + slide} r={r * Math.min(1, appear)} />;
      })}
    </svg>
  );
};

/** Faint drifting vapour dots in a w x h box; `n` dots. */
export const Vapour: React.FC<{ w: number; h: number; n: number; color?: string; speed?: number; seed?: string }> = ({
  w,
  h,
  n,
  color = "white",
  speed = 1,
  seed = "v",
}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: n }, (_, i) => {
        const x = (random(`${seed}x${i}`) * w + Math.sin(frame / 20 + i) * 18 * speed) % w;
        const y = (random(`${seed}y${i}`) * h + frame * (0.3 + random(`${seed}s${i}`)) * speed) % h;
        return <circle key={i} cx={x} cy={y} r={9} fill={color} opacity={0.75} />;
      })}
    </svg>
  );
};
