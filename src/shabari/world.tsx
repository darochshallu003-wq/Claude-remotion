import React from "react";
import { random } from "remotion";
import { BERRY, BERRY_ORANGE, INK, LEAF, LEAF_DARK } from "./art";

// Forest-ashram scenery in the same flat, outlined style. All coordinates
// are in the 1080×1920 frame.

export type Sky = { top: string; mid: string; low: string };

export const SKY = {
  dawn: { top: "#9EC6D8", mid: "#F6D7A4", low: "#F4B777" },
  day: { top: "#8CC4DE", mid: "#D7ECEA", low: "#F3E3BC" },
  dusk: { top: "#4B3F78", mid: "#B4628A", low: "#F09A5B" },
  gold: { top: "#E9B66B", mid: "#F6D69A", low: "#F8E6BE" },
} satisfies Record<string, Sky>;

export const SkyFill: React.FC<{ sky: Sky; id: string }> = ({ sky, id }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={sky.top} />
        <stop offset="55%" stopColor={sky.mid} />
        <stop offset="100%" stopColor={sky.low} />
      </linearGradient>
    </defs>
    <rect x={-200} y={-200} width={1480} height={2320} fill={`url(#${id})`} />
  </>
);

export const Sun: React.FC<{ x: number; y: number; r?: number; color?: string }> = ({ x, y, r = 90, color = "#FFE7A6" }) => (
  <g>
    <defs>
      <radialGradient id={`sun${x}${y}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={color} stopOpacity={0.85} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r * 4} fill={`url(#sun${x}${y})`} />
    <circle cx={x} cy={y} r={r} fill={color} />
  </g>
);

export const Cloud: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = "#FFF4E2" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.9}>
    <path d="M -120 20 Q -120 -20 -80 -20 Q -70 -60 -20 -56 Q 10 -90 60 -60 Q 110 -66 110 -20 Q 140 -14 130 20 Z" fill={color} />
  </g>
);

export const Birds: React.FC<{ frame: number; x: number; y: number }> = ({ frame, x, y }) => (
  <g stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7}>
    {[0, 1, 2].map((i) => {
      const bx = x + i * 60 + frame * 1.6;
      const by = y + (i % 2) * 30 + Math.sin((frame + i * 20) / 10) * 6;
      const flap = 10 + 6 * Math.sin((frame + i * 9) / 3);
      return <path key={i} d={`M ${bx - 18} ${by - flap * 0.6} Q ${bx - 8} ${by - 2} ${bx} ${by} Q ${bx + 8} ${by - 2} ${bx + 18} ${by - flap * 0.6}`} />;
    })}
  </g>
);

/** Rolling hills band. */
export const Hills: React.FC<{ y: number; color: string; seed: number; amp?: number }> = ({ y, color, seed, amp = 60 }) => {
  const pts: string[] = [];
  for (let i = 0; i <= 8; i++) {
    const x = -200 + i * 185;
    const h = y - amp * (0.4 + random(`h${seed}${i}`) * 0.8);
    pts.push(`${x} ${h}`);
  }
  let d = `M -200 2200 L ${pts[0]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1].split(" ").map(Number);
    const [cx, cy] = pts[i].split(" ").map(Number);
    d += ` Q ${(px + cx) / 2} ${Math.min(py, cy) - amp * 0.4} ${cx} ${cy}`;
  }
  d += " L 1280 2200 Z";
  return <path d={d} fill={color} stroke={INK} strokeWidth={4} strokeOpacity={0.35} />;
};

/** Round-canopy tree with a unified ink outline. */
export const Tree: React.FC<{
  x: number;
  y: number;
  s?: number;
  color?: string;
  dark?: string;
  fruit?: boolean;
  fruitR?: number;
  sway?: number;
  seed?: string;
}> = ({ x, y, s = 1, color = LEAF, dark = LEAF_DARK, fruit = false, fruitR = 11, sway = 0, seed = "t" }) => {
  const blobs: [number, number, number][] = [
    [0, -360, 120],
    [-110, -290, 95],
    [110, -290, 95],
    [-60, -210, 90],
    [70, -205, 90],
    [0, -460, 85],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -26 0 L -18 -240 Q -60 -300 -80 -310 M 18 -240 Q 60 -300 80 -320 M 18 -240 L 26 0 Z" fill="#7A4E2C" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M -26 0 L -18 -240 L 18 -240 L 26 0 Z" fill="#7A4E2C" stroke={INK} strokeWidth={6} />
      <path d="M 4 -30 L 8 -200" stroke="#5C3A20" strokeWidth={4} />
      <g transform={`rotate(${sway} 0 -200)`}>
        {blobs.map(([bx, by, r], i) => (
          <circle key={`o${i}`} cx={bx} cy={by} r={r + 5} fill={INK} />
        ))}
        {blobs.map(([bx, by, r], i) => (
          <circle key={`d${i}`} cx={bx} cy={by} r={r} fill={dark} />
        ))}
        {blobs.map(([bx, by, r], i) => (
          <circle key={`l${i}`} cx={bx - r * 0.18} cy={by - r * 0.2} r={r * 0.78} fill={color} />
        ))}
        {fruit &&
          Array.from({ length: 22 }).map((_, i) => {
            const a = random(`${seed}a${i}`) * Math.PI * 2;
            const rr = random(`${seed}r${i}`) * 170;
            return (
              <circle
                key={`f${i}`}
                cx={Math.cos(a) * rr}
                cy={-320 + Math.sin(a) * rr * 0.8}
                r={fruitR}
                fill={i % 3 === 0 ? BERRY_ORANGE : BERRY}
                stroke={INK}
                strokeWidth={2.5 * (fruitR / 11)}
              />
            );
          })}
      </g>
    </g>
  );
};

export const Bush: React.FC<{ x: number; y: number; s?: number; flowers?: string }> = ({ x, y, s = 1, flowers }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[[-60, -30, 50], [0, -50, 60], [60, -30, 50]].map(([bx, by, r], i) => (
      <circle key={`o${i}`} cx={bx} cy={by} r={r + 5} fill={INK} />
    ))}
    {[[-60, -30, 50], [0, -50, 60], [60, -30, 50]].map(([bx, by, r], i) => (
      <circle key={i} cx={bx} cy={by} r={r} fill={LEAF_DARK} />
    ))}
    {[[-64, -36, 38], [-4, -58, 46], [56, -36, 38]].map(([bx, by, r], i) => (
      <circle key={`l${i}`} cx={bx} cy={by} r={r} fill={LEAF} />
    ))}
    <rect x={-120} y={-2} width={240} height={10} fill={LEAF_DARK} />
    {flowers &&
      [[-70, -50], [-20, -80], [30, -40], [70, -60], [0, -20]].map(([fx, fy], i) => (
        <circle key={`fl${i}`} cx={fx} cy={fy} r={9} fill={flowers} stroke={INK} strokeWidth={2} />
      ))}
  </g>
);

/** Mud-walled hut with thatched roof; door centred at (x, y-ish). */
export const Hut: React.FC<{ x: number; y: number; s?: number; doorGlow?: number }> = ({ x, y, s = 1, doorGlow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-300} width={520} height={300} fill="#C98F58" stroke={INK} strokeWidth={6} />
    <path d="M -260 -60 L 260 -60" stroke="#A8703F" strokeWidth={5} />
    <path d="M -220 -200 q 30 -10 60 0 M 140 -240 q 30 -10 60 0 M -200 -120 q 20 -8 40 0" stroke="#A8703F" strokeWidth={4} fill="none" />
    <path d="M -80 0 L -80 -190 Q 0 -250 80 -190 L 80 0 Z" fill={doorGlow > 0 ? "#5A2E14" : "#3A2416"} stroke={INK} strokeWidth={6} />
    {doorGlow > 0 && <path d="M -70 0 L -70 -184 Q 0 -238 70 -184 L 70 0 Z" fill="#F2A34A" opacity={doorGlow * 0.5} />}
    <rect x={130} y={-210} width={80} height={70} fill="#3A2416" stroke={INK} strokeWidth={5} />
    <path d="M 170 -210 L 170 -140 M 130 -175 L 210 -175" stroke="#7A4E2C" strokeWidth={5} />
    <path d="M -340 -270 L 0 -520 L 340 -270 Q 0 -240 -340 -270 Z" fill="#D8B061" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {Array.from({ length: 13 }).map((_, i) => {
      const t = i / 12;
      const bx = -330 + 660 * t;
      return <path key={i} d={`M ${bx * 0.08} -500 L ${bx} -262`} stroke="#A9823C" strokeWidth={3.5} />;
    })}
    <path d="M -340 -270 Q 0 -240 340 -270" stroke="#A9823C" strokeWidth={8} fill="none" />
    <rect x={-300} y={0} width={600} height={34} fill="#B07A47" stroke={INK} strokeWidth={5} />
  </g>
);

/** Path winding from the bottom of the frame to a vanishing point. */
export const ForestPath: React.FC<{ vx: number; vy: number; color?: string }> = ({ vx, vy, color = "#E4C38F" }) => (
  <path
    d={`M 120 2000 C 260 1700, ${vx - 160} ${vy + 260}, ${vx - 14} ${vy} L ${vx + 14} ${vy} C ${vx + 160} ${vy + 260}, 840 1700, 1000 2000 Z`}
    fill={color}
    stroke={INK}
    strokeWidth={5}
  />
);

const PETAL_COLORS = ["#F6A21E", "#F2C14E", "#EE7E9C", "#F5D6E0", "#E8561F"];

/** Petals scattered along the path; denser near the viewer. */
export const Petals: React.FC<{ vx: number; vy: number; n?: number; seed?: string }> = ({ vx, vy, n = 70, seed = "p" }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const t = Math.pow(random(`${seed}t${i}`), 0.7);
      const y = vy + (1980 - vy) * t;
      const half = 14 + 430 * t;
      const x = vx + (random(`${seed}x${i}`) * 2 - 1) * half * 0.85;
      const r = 4 + 12 * t;
      return (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={r}
          ry={r * 0.6}
          transform={`rotate(${random(`${seed}r${i}`) * 180} ${x} ${y})`}
          fill={PETAL_COLORS[i % PETAL_COLORS.length]}
          stroke={INK}
          strokeWidth={t > 0.4 ? 1.8 : 0}
        />
      );
    })}
  </g>
);

export const Lake: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <ellipse cx={x} cy={y} rx={w} ry={h} fill="#7DB7C7" stroke={INK} strokeWidth={5} />
    <ellipse cx={x} cy={y - h * 0.15} rx={w * 0.8} ry={h * 0.55} fill="#A6D3DC" opacity={0.6} />
    {[-0.4, 0.1, 0.5].map((f, i) => (
      <g key={i} transform={`translate(${x + f * w} ${y + (i - 1) * h * 0.2})`}>
        <ellipse rx={30} ry={9} fill={LEAF} stroke={INK} strokeWidth={2.5} />
        {i !== 1 && <path d="M -8 -4 L 0 -26 L 8 -4 Z M -16 -4 L -10 -18 L 0 -6 Z M 16 -4 L 10 -18 L 0 -6 Z" fill="#F3A7BE" stroke={INK} strokeWidth={2} />}
      </g>
    ))}
  </g>
);

/** Drifting particles (petals / leaves) that fall through the frame. */
export const Falling: React.FC<{
  frame: number;
  n: number;
  colors: string[];
  seed: string;
  speed?: number;
  size?: number;
  leaf?: boolean;
}> = ({ frame, n, colors, seed, speed = 2.2, size = 16, leaf = false }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const sp = speed * (0.6 + random(`${seed}s${i}`) * 0.8);
      const y = ((random(`${seed}y${i}`) * 2300 + frame * sp) % 2300) - 200;
      const x = random(`${seed}x${i}`) * 1080 + Math.sin((frame + i * 37) / 26) * 50;
      const rot = frame * (1.5 + random(`${seed}r${i}`) * 2) + i * 40;
      const s = size * (0.6 + random(`${seed}z${i}`) * 0.8);
      return (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
          {leaf ? (
            <path d={`M 0 ${-s} Q ${s * 0.7} 0 0 ${s} Q ${-s * 0.7} 0 0 ${-s} Z`} fill={colors[i % colors.length]} stroke={INK} strokeWidth={2} />
          ) : (
            <ellipse rx={s * 0.6} ry={s * 0.38} fill={colors[i % colors.length]} />
          )}
        </g>
      );
    })}
  </g>
);

/** Soft god-rays fanning down from a point. */
export const Rays: React.FC<{ x: number; y: number; frame: number; opacity?: number }> = ({ x, y, frame, opacity = 0.22 }) => (
  <g style={{ mixBlendMode: "screen" }}>
    {Array.from({ length: 7 }).map((_, i) => {
      const a = -40 + i * 13 + Math.sin((frame + i * 30) / 50) * 2;
      const w = 34 + (i % 3) * 18;
      const op = opacity * (0.6 + 0.4 * Math.sin((frame + i * 25) / 30));
      return (
        <path
          key={i}
          d={`M ${x} ${y} L ${x - w} ${y + 2200} L ${x + w} ${y + 2200} Z`}
          transform={`rotate(${a} ${x} ${y})`}
          fill="#FFF0C4"
          opacity={op}
        />
      );
    })}
  </g>
);

export const Ground: React.FC<{ y: number; color?: string }> = ({ y, color = "#9DB45E" }) => (
  <rect x={-200} y={y} width={1480} height={2200 - y} fill={color} stroke={INK} strokeWidth={4} />
);

/** Small grass tufts. */
export const Grass: React.FC<{ n: number; y0: number; y1: number; seed: string }> = ({ n, y0, y1, seed }) => (
  <g stroke={LEAF_DARK} strokeWidth={4} strokeLinecap="round" fill="none">
    {Array.from({ length: n }).map((_, i) => {
      const x = random(`${seed}gx${i}`) * 1080;
      const y = y0 + random(`${seed}gy${i}`) * (y1 - y0);
      return <path key={i} d={`M ${x - 10} ${y} q 2 -18 -6 -26 M ${x} ${y} q 0 -22 4 -32 M ${x + 10} ${y} q -2 -16 8 -24`} />;
    })}
  </g>
);
