import React from "react";
import { INK } from "../mitti/kraft";

// Hand-drawn props for the tetanus short, in the same flat ink-outline
// style as the dahi and petrichor sets.

export const SKIN = "#B97A50";
export const STEEL = "#A9AEB4";
export const RUST = "#A4512A";
export const GERM_OLIVE = "#8A9A3C";
export const SPORE = "#E8D9A8";
export const TOXIN = "#8E4C9E";
export const ANTIBODY = "#4F8FD6";
export const NERVE = "#E9C46A";
export const FLESH = "#E7A08A";
export const FLESH_DEEP = "#B5584A";

/** Upright nail, point up. `rust` 0..1 paints rust blotches on it. */
export const Nail: React.FC<{ height: number; rust?: number; style?: React.CSSProperties }> = ({ height, rust = 0, style }) => (
  <svg viewBox="0 0 60 260" width={(height * 60) / 260} height={height} style={{ overflow: "visible", ...style }}>
    <path d="M30 4 L 40 40 L 40 236 L 20 236 L 20 40 Z" fill={STEEL} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={2} y={232} width={56} height={18} rx={6} fill={STEEL} stroke={INK} strokeWidth={5} />
    <path d="M26 50 L 26 225" stroke="#FFFFFF" strokeWidth={4} opacity={0.5} strokeLinecap="round" />
    <g opacity={rust} fill={RUST}>
      <ellipse cx={33} cy={90} rx={8} ry={14} />
      <ellipse cx={27} cy={150} rx={7} ry={20} />
      <ellipse cx={34} cy={205} rx={7} ry={12} />
      <ellipse cx={18} cy={240} rx={12} ry={6} />
      <circle cx={44} cy={242} r={6} />
    </g>
  </svg>
);

/** Bare foot in side view, toes to the right. */
export const Foot: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => (
  <svg viewBox="0 0 320 200" width={width} height={(width * 200) / 320} style={{ overflow: "visible", ...style }}>
    <path
      d="M40 0 L 110 0 L 118 90 C 140 110, 200 112, 250 118 C 290 122, 312 140, 310 160 C 308 178, 290 186, 260 186 L 60 186 C 30 186, 18 168, 22 140 Z"
      fill={SKIN}
      stroke={INK}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    {[262, 284, 300].map((x, i) => (
      <path key={x} d={`M${x} ${150 + i * 4} C ${x + 4} ${160 + i * 4}, ${x + 2} ${172}, ${x - 4} ${178}`} fill="none" stroke={INK} strokeWidth={3} opacity={0.5} />
    ))}
    <path d="M60 186 C 120 176, 200 176, 260 186" fill="none" stroke={INK} strokeWidth={3} opacity={0.35} />
  </svg>
);

/** Horizontal syringe, needle to the right. `fill` 0..1 is how full it is. */
export const Syringe: React.FC<{ width: number; fill?: number; liquid?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  width,
  fill = 0.8,
  liquid = "#CFE6F2",
  style,
  children,
}) => (
  <svg viewBox="0 0 520 140" width={width} height={(width * 140) / 520} style={{ overflow: "visible", ...style }}>
    {/* plunger */}
    <rect x={8} y={36} width={16} height={68} rx={4} fill="#E5E1D8" stroke={INK} strokeWidth={5} />
    <rect x={24} y={62} width={80 + (1 - fill) * 220} height={16} fill="#E5E1D8" stroke={INK} strokeWidth={5} />
    {/* barrel */}
    <rect x={96} y={30} width={290} height={80} rx={10} fill="rgba(255,255,255,0.75)" stroke={INK} strokeWidth={6} />
    <rect x={104 + (1 - fill) * 274} y={38} width={274 * fill} height={64} rx={6} fill={liquid} />
    <rect x={96 + (1 - fill) * 274} y={34} width={14} height={72} fill="#3A3633" />
    {[140, 180, 220, 260, 300, 340].map((x) => (
      <line key={x} x1={x} y1={30} x2={x} y2={50} stroke={INK} strokeWidth={3} />
    ))}
    <rect x={84} y={20} width={14} height={100} rx={4} fill="#E5E1D8" stroke={INK} strokeWidth={5} />
    {/* hub + needle */}
    <path d="M386 50 L 420 60 L 420 80 L 386 90 Z" fill="#E5E1D8" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <line x1={420} y1={70} x2={516} y2={70} stroke={INK} strokeWidth={5} strokeLinecap="round" />
    {children}
  </svg>
);

/** A dormant spore: thick-walled oval. */
export const Spore: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg viewBox="0 0 100 70" width={size} height={size * 0.7} style={{ overflow: "visible", ...style }}>
    <ellipse cx={50} cy={35} rx={46} ry={31} fill={SPORE} stroke={INK} strokeWidth={6} />
    <ellipse cx={50} cy={35} rx={30} ry={18} fill="none" stroke={INK} strokeWidth={3} opacity={0.4} />
    {/* closed sleepy eyes */}
    <path d="M30 34 q 6 6 12 0 M58 34 q 6 6 12 0" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/**
 * Clostridium tetani: a rod with a round spore swelling at one end — the
 * textbook "drumstick" shape. `angry` 0..1 brings in villain eyebrows.
 */
export const Clostridium: React.FC<{ size: number; angry?: number; style?: React.CSSProperties }> = ({ size, angry = 1, style }) => (
  <svg viewBox="0 0 320 150" width={size} height={(size * 150) / 320} style={{ overflow: "visible", ...style }}>
    {[40, 70, 100].map((y, i) => (
      <path key={i} d={`M30 ${y} C 12 ${y - 12}, 4 ${y + 16}, -14 ${y + 2}`} fill="none" stroke={INK} strokeWidth={4} />
    ))}
    <rect x={20} y={46} width={220} height={60} rx={30} fill={GERM_OLIVE} stroke={INK} strokeWidth={6} />
    <circle cx={260} cy={76} r={52} fill={SPORE} stroke={INK} strokeWidth={6} />
    <circle cx={260} cy={76} r={34} fill="none" stroke={INK} strokeWidth={3} opacity={0.35} />
    {/* face on the rod */}
    <circle cx={92} cy={74} r={8} fill={INK} />
    <circle cx={142} cy={74} r={8} fill={INK} />
    <g opacity={angry}>
      <path d="M76 56 L 104 64 M158 56 L 130 64" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d="M104 94 q 13 -9 26 0" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    </g>
  </svg>
);

/** A toxin droplet. `defused` greys it out with crossed eyes (the toxoid). */
export const ToxinDrop: React.FC<{ size: number; defused?: boolean; style?: React.CSSProperties }> = ({ size, defused = false, style }) => (
  <svg viewBox="0 0 60 80" width={size} height={(size * 80) / 60} style={{ overflow: "visible", ...style }}>
    <path
      d="M30 3 C 44 26, 56 40, 56 54 A 26 26 0 0 1 4 54 C 4 40, 16 26, 30 3 Z"
      fill={defused ? "#B9B4AE" : TOXIN}
      stroke={INK}
      strokeWidth={4}
      strokeDasharray={defused ? "8 6" : undefined}
    />
    {defused ? (
      <path d="M18 46 l 8 8 m0 -8 l -8 8 M34 46 l 8 8 m0 -8 l -8 8" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
    ) : (
      <>
        <circle cx={22} cy={52} r={4} fill="#fff" />
        <circle cx={38} cy={52} r={4} fill="#fff" />
        <path d="M16 42 l 10 4 M44 42 l -10 4" stroke="#fff" strokeWidth={3} strokeLinecap="round" />
      </>
    )}
  </svg>
);

/** Y-shaped antibody. */
export const Antibody: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = ANTIBODY, style }) => (
  <svg viewBox="0 0 100 120" width={size} height={size * 1.2} style={{ overflow: "visible", ...style }}>
    <g stroke={INK} strokeWidth={22} strokeLinecap="round" fill="none">
      <path d="M50 112 L 50 62 M50 62 L 16 18 M50 62 L 84 18" />
    </g>
    <g stroke={color} strokeWidth={12} strokeLinecap="round" fill="none">
      <path d="M50 112 L 50 62 M50 62 L 16 18 M50 62 L 84 18" />
    </g>
  </svg>
);

export const Padlock: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg viewBox="0 0 100 120" width={size} height={size * 1.2} style={{ overflow: "visible", ...style }}>
    <path d="M26 54 L 26 34 A 24 24 0 0 1 74 34 L 74 54" fill="none" stroke={INK} strokeWidth={12} />
    <path d="M26 54 L 26 34 A 24 24 0 0 1 74 34 L 74 54" fill="none" stroke="#C9CDD2" strokeWidth={6} />
    <rect x={10} y={52} width={80} height={62} rx={10} fill="#E9B949" stroke={INK} strokeWidth={6} />
    <circle cx={50} cy={78} r={8} fill={INK} />
    <rect x={46} y={80} width={8} height={18} rx={3} fill={INK} />
  </svg>
);
