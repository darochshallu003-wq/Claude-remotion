import React from "react";
import { K } from "./kit";

// Flat, thick-outlined science drawings for the photosynthesis explainer.

const INK = K.ink;
const SW = 5;

export const Svg: React.FC<{ size: number; vb?: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  size,
  vb = "-50 -50 100 100",
  children,
  style,
}) => (
  <svg viewBox={vb} width={size} height={size} style={{ overflow: "visible", ...style }}>
    {children}
  </svg>
);

export const Sun: React.FC<{ size: number; frame: number }> = ({ size, frame }) => (
  <Svg size={size}>
    <g transform={`rotate(${frame * 1.2})`}>
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={i} d="M -6 -32 L 0 -48 L 6 -32 Z" fill={K.orange} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" transform={`rotate(${i * 36})`} />
      ))}
    </g>
    <circle r={27} fill={K.yellow} stroke={INK} strokeWidth={SW} />
    <path d="M -12 -8 Q -6 -16 2 -14" stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" />
  </Svg>
);

export const Drop: React.FC<{ size: number }> = ({ size }) => (
  <Svg size={size}>
    <path d="M 0 -44 C 18 -16, 32 2, 32 16 C 32 34, 18 44, 0 44 C -18 44, -32 34, -32 16 C -32 2, -18 -16, 0 -44 Z" fill={K.blue} stroke={INK} strokeWidth={SW} />
    <path d="M -16 14 Q -16 28 -4 32" stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" />
  </Svg>
);

const Atom: React.FC<{ x: number; y: number; r: number; fill: string; label: string; dark?: boolean }> = ({ x, y, r, fill, label, dark }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={fill} stroke={INK} strokeWidth={4} />
    <text x={x} y={y + r * 0.36} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={r * 1.05} fill={dark ? "#FFFFFF" : INK}>
      {label}
    </text>
  </g>
);

export const O_RED = "#FF5A4E";
export const C_GREY = "#3A3A3A";

export const CO2: React.FC<{ size: number }> = ({ size }) => (
  <Svg size={size} vb="-60 -30 120 60">
    <path d="M -36 0 L 36 0" stroke={INK} strokeWidth={9} />
    <Atom x={-36} y={0} r={20} fill={O_RED} label="O" />
    <Atom x={36} y={0} r={20} fill={O_RED} label="O" />
    <Atom x={0} y={0} r={22} fill={C_GREY} label="C" dark />
  </Svg>
);

export const O2: React.FC<{ size: number }> = ({ size }) => (
  <Svg size={size} vb="-45 -30 90 60">
    <path d="M -18 0 L 18 0" stroke={INK} strokeWidth={9} />
    <Atom x={-18} y={0} r={20} fill={O_RED} label="O" />
    <Atom x={18} y={0} r={20} fill={O_RED} label="O" />
  </Svg>
);

/** Water molecule; `split` 0..1 pulls the H atoms away. */
export const H2O: React.FC<{ size: number; split?: number; oxygen?: number }> = ({ size, split = 0, oxygen = 1 }) => (
  <Svg size={size} vb="-55 -45 110 90">
    {split < 0.5 && <path d="M -26 18 L 0 -6 L 26 18" stroke={INK} strokeWidth={8} fill="none" opacity={1 - split * 2} />}
    <Atom x={-26 - split * 22} y={18 + split * 14} r={14} fill="#FFFFFF" label="H" />
    <Atom x={26 + split * 22} y={18 + split * 14} r={14} fill="#FFFFFF" label="H" />
    <g opacity={oxygen}>
      <Atom x={0} y={-6 - split * 18} r={22} fill={O_RED} label="O" />
    </g>
  </Svg>
);

export const HAtom: React.FC<{ size: number }> = ({ size }) => (
  <Svg size={size} vb="-20 -20 40 40">
    <Atom x={0} y={0} r={15} fill="#FFFFFF" label="H" />
  </Svg>
);

/** Glucose drawn as a hexagon ring. */
export const Glucose: React.FC<{ size: number; label?: boolean }> = ({ size, label = true }) => (
  <Svg size={size}>
    <path d="M 0 -42 L 36 -21 L 36 21 L 0 42 L -36 21 L -36 -21 Z" fill={K.yellow} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    {label && (
      <text y={8} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={17} fill={INK}>
        C₆H₁₂O₆
      </text>
    )}
  </Svg>
);

export const Leaf: React.FC<{ size: number; sway?: number }> = ({ size, sway = 0 }) => (
  <Svg size={size}>
    <g transform={`rotate(${sway} 0 44)`}>
      <path d="M 0 46 L 0 30" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M 0 34 C -40 20, -40 -30, 0 -46 C 40 -30, 40 20, 0 34 Z" fill={K.leaf} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
      <path d="M 0 30 L 0 -38" stroke={K.greenDark} strokeWidth={3.5} />
      {[-24, -10, 4].map((y) => (
        <g key={y}>
          <path d={`M 0 ${y + 10} L -18 ${y}`} stroke={K.greenDark} strokeWidth={3} />
          <path d={`M 0 ${y + 10} L 18 ${y}`} stroke={K.greenDark} strokeWidth={3} />
        </g>
      ))}
      <path d="M -18 -18 Q -20 -30 -8 -38" stroke="#BDF29A" strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  </Svg>
);

const CHLORO_SPOTS: [number, number, number][] = [
  [-26, -20, 15], [4, -26, -10], [28, -14, 20], [-30, 8, -25], [26, 14, 8], [-6, 28, 30], [22, -34, 0], [-22, 32, -12],
];

/** Plant cell: wall, nucleus and chloroplasts. */
export const Cell: React.FC<{ size: number; glow?: number }> = ({ size, glow = 0 }) => (
  <Svg size={size}>
    <rect x={-46} y={-46} width={92} height={92} rx={16} fill="#BDE8A0" stroke={INK} strokeWidth={SW} />
    <rect x={-38} y={-38} width={76} height={76} rx={11} fill="#E3F6D5" stroke={K.greenDark} strokeWidth={2.5} />
    <circle cx={8} cy={4} r={11} fill={K.purple} stroke={INK} strokeWidth={3.5} />
    {CHLORO_SPOTS.map(([x, y, rot], i) => (
      <ellipse
        key={i}
        cx={x}
        cy={y}
        rx={8}
        ry={5}
        transform={`rotate(${rot} ${x} ${y})`}
        fill={K.leaf}
        stroke={INK}
        strokeWidth={2.5}
        style={{ filter: glow > 0 ? `drop-shadow(0 0 ${3 * glow}px #A6FF6B)` : undefined }}
      />
    ))}
  </Svg>
);

/** Chloroplast with grana stacks. */
export const Chloroplast: React.FC<{ size: number; glow?: number }> = ({ size, glow = 0 }) => (
  <Svg size={size}>
    {glow > 0 && <ellipse rx={56} ry={40} fill="#C8FF8F" opacity={0.6 * glow} />}
    <ellipse rx={46} ry={30} fill={K.leaf} stroke={INK} strokeWidth={SW} />
    <ellipse rx={38} ry={23} fill="#8EDB6E" />
    {[-22, 0, 22].map((x, i) => (
      <g key={i} transform={`translate(${x} ${i === 1 ? -4 : 4})`}>
        {[-8, -2, 4].map((y) => (
          <rect key={y} x={-7} y={y} width={14} height={5} rx={2.5} fill={K.greenDark} stroke={INK} strokeWidth={1.8} />
        ))}
      </g>
    ))}
    <path d="M -15 -3 L -7 -3 M 7 -1 L 15 -1" stroke={K.greenDark} strokeWidth={2.5} />
  </Svg>
);

/** Stoma: two guard cells around a pore; `open` 0..1. */
export const Stoma: React.FC<{ size: number; open: number }> = ({ size, open }) => {
  const gap = 2 + open * 14;
  const cell = (side: 1 | -1) => (
    <path
      d={`M 0 -40 C ${side * (gap + 34)} -40, ${side * (gap + 36)} 40, 0 40 C ${side * gap} 24, ${side * gap} -24, 0 -40 Z`}
      fill={open > 0.5 ? "#A6E57E" : "#C6D99A"}
      stroke={INK}
      strokeWidth={SW}
      strokeLinejoin="round"
    />
  );
  return (
    <Svg size={size}>
      <ellipse rx={gap * 0.95} ry={32} fill="#3B2A1C" />
      {cell(-1)}
      {cell(1)}
      {[-1, 1].map((s) =>
        [-18, 0, 18].map((y) => <ellipse key={`${s}${y}`} cx={s * (gap + 14)} cy={y} rx={4} ry={2.6} fill={K.leaf} stroke={INK} strokeWidth={1.5} />),
      )}
    </Svg>
  );
};

export const Bolt: React.FC<{ size: number }> = ({ size }) => (
  <Svg size={size}>
    <path d="M 8 -44 L -26 6 L -2 6 L -10 44 L 26 -8 L 2 -8 Z" fill={K.yellow} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
  </Svg>
);

export const Moon: React.FC<{ size: number }> = ({ size }) => (
  <Svg size={size}>
    <path d="M 12 -40 C -20 -36, -36 -6, -26 22 C -16 44, 16 50, 36 30 C 6 34, -14 8, -6 -16 C -2 -28, 4 -36, 12 -40 Z" fill="#FFF1A8" stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
  </Svg>
);

export const Cactus: React.FC<{ size: number }> = ({ size }) => (
  <Svg size={size}>
    <path d="M -12 44 L -12 -30 C -12 -46, 12 -46, 12 -30 L 12 44 Z" fill={K.leaf} stroke={INK} strokeWidth={SW} />
    <path d="M -12 6 L -26 6 C -34 6, -34 -2, -34 -8 L -34 -22 C -34 -30, -24 -30, -24 -22 L -24 -4 L -12 -4" fill={K.leaf} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M 12 16 L 26 16 C 34 16, 34 8, 34 2 L 34 -10 C 34 -18, 24 -18, 24 -10 L 24 6 L 12 6" fill={K.leaf} stroke={INK} strokeWidth={SW} strokeLinejoin="round" />
    <path d="M 0 -30 L 0 40" stroke={K.greenDark} strokeWidth={3} />
    <rect x={-30} y={40} width={60} height={8} rx={3} fill="#E3B26A" stroke={INK} strokeWidth={3.5} />
  </Svg>
);

export const Check: React.FC<{ size: number; on: number }> = ({ size, on }) => (
  <Svg size={size}>
    <rect x={-40} y={-40} width={80} height={80} rx={16} fill={on > 0.5 ? K.green : K.white} stroke={INK} strokeWidth={6} />
    <path d="M -22 2 L -6 18 L 24 -16" stroke={INK} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - on)} />
  </Svg>
);

export const Arrow: React.FC<{ w: number; color?: string }> = ({ w, color = K.ink }) => (
  <svg viewBox="0 0 100 40" width={w} height={w * 0.4}>
    <path d="M 4 20 L 80 20" stroke={color} strokeWidth={9} strokeLinecap="round" />
    <path d="M 66 6 L 86 20 L 66 34" stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
