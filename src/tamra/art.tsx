import React from "react";
import { C } from "../onion/theme";

// Illustrations for the tamra jal explainer, in the series' "ink engraving"
// style: gradient fill, hatched shade, dark ink outline.

const INK = "#2A2420";
export const COPPER = "#B87333";
export const COPPER_LIGHT = "#E59A5C";
export const WATER = "#6FB7D9";
export const GERM = "#7BAE3F";

/** Traditional copper lota. */
export const Lota: React.FC<{ id: string; size: number; glow?: number; style?: React.CSSProperties }> = ({ id, size, glow = 0, style }) => (
  <svg viewBox="0 0 360 420" width={size} height={(size * 420) / 360} style={{ overflow: "visible", ...style }}>
    <defs>
      <radialGradient id={`${id}c`} cx="35%" cy="40%" r="75%">
        <stop offset="0%" stopColor="#F6C08F" />
        <stop offset="35%" stopColor={COPPER_LIGHT} />
        <stop offset="75%" stopColor={COPPER} />
        <stop offset="100%" stopColor="#6E3B15" />
      </radialGradient>
      <linearGradient id={`${id}n`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8A4A1C" />
        <stop offset="45%" stopColor={COPPER_LIGHT} />
        <stop offset="100%" stopColor="#7A3F16" />
      </linearGradient>
      <radialGradient id={`${id}glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={COPPER_LIGHT} stopOpacity={0.55} />
        <stop offset="100%" stopColor={COPPER_LIGHT} stopOpacity={0} />
      </radialGradient>
      <pattern id={`${id}h`} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
        <line x1="0" y1="0" x2="0" y2="9" stroke={INK} strokeWidth={2} opacity={0.3} />
      </pattern>
    </defs>
    {glow > 0 && <circle cx="180" cy="250" r="260" fill={`url(#${id}glow)`} opacity={glow} />}
    {/* lip */}
    <ellipse cx="180" cy="40" rx="110" ry="22" fill={`url(#${id}n)`} stroke={INK} strokeWidth={6} />
    <ellipse cx="180" cy="40" rx="80" ry="12" fill="#5A2E10" />
    {/* neck */}
    <path d="M110 46 C 118 90, 120 110, 112 130 L 248 130 C 240 110, 242 90, 250 46 Z" fill={`url(#${id}n)`} stroke={INK} strokeWidth={6} />
    {/* belly */}
    <path d="M112 130 C 30 160, 20 280, 60 340 C 90 385, 140 400, 180 400 C 220 400, 270 385, 300 340 C 340 280, 330 160, 248 130 Z" fill={`url(#${id}c)`} stroke={INK} strokeWidth={6} />
    <path d="M250 160 C 320 210, 320 320, 270 370 C 250 388, 215 398, 190 400 C 270 350, 300 250, 250 160 Z" fill={`url(#${id}h)`} />
    {/* bands */}
    <path d="M60 220 C 140 245, 220 245, 300 220" fill="none" stroke="#6E3B15" strokeWidth={5} opacity={0.7} />
    <path d="M70 250 C 140 272, 220 272, 290 250" fill="none" stroke="#6E3B15" strokeWidth={3} opacity={0.5} />
    {/* highlight */}
    <path d="M85 200 C 70 240, 72 290, 92 330" fill="none" stroke="#FFE1C2" strokeWidth={12} strokeLinecap="round" opacity={0.65} />
  </svg>
);

/** Rod-shaped bacterium with flagella. `damage` 0..1 cracks and greys it. */
export const Bacterium: React.FC<{ size: number; damage?: number; color?: string; style?: React.CSSProperties }> = ({
  size,
  damage = 0,
  color = GERM,
  style,
}) => (
  <svg viewBox="0 0 300 160" width={size} height={(size * 160) / 300} style={{ overflow: "visible", ...style }}>
    {[30, 60, 100].map((y, i) => (
      <path key={i} d={`M40 ${y} C 20 ${y - 10}, 10 ${y + 20}, -10 ${y + 5}`} fill="none" stroke={INK} strokeWidth={4} opacity={1 - damage} />
    ))}
    {[40, 90, 120].map((y, i) => (
      <path key={i} d={`M260 ${y} C 280 ${y - 12}, 290 ${y + 18}, 312 ${y + 4}`} fill="none" stroke={INK} strokeWidth={4} opacity={1 - damage} />
    ))}
    <rect x="30" y="30" width="240" height="100" rx="50" fill={damage > 0.5 ? "#8C8F8A" : color} stroke={INK} strokeWidth={6} opacity={1 - damage * 0.5} />
    <rect x="48" y="44" width="204" height="72" rx="36" fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.35 * (1 - damage)} />
    {/* DNA squiggle */}
    <path
      d={damage < 0.5 ? "M80 80 C 100 55, 120 105, 140 80 C 160 55, 180 105, 200 80 C 210 68, 220 75, 225 80" : "M80 80 C 95 62, 108 92, 118 82 M150 76 C 165 60, 175 100, 190 82 M205 78 L 225 80"}
      fill="none"
      stroke="#3A5A1A"
      strokeWidth={5}
      strokeLinecap="round"
      opacity={1 - damage * 0.6}
    />
    {/* cracks in the wall */}
    {damage > 0 && (
      <g stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={damage}>
        <path d="M110 30 l 10 22 l -8 14" fill="none" />
        <path d="M200 130 l -8 -20 l 10 -12" fill="none" />
        <path d="M245 45 l -14 14" fill="none" />
      </g>
    )}
  </svg>
);

/** A copper ion: Cu with a charge mark. */
export const CopperIon: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={style}>
    <circle cx="50" cy="50" r="40" fill={COPPER_LIGHT} stroke={INK} strokeWidth={5} />
    <circle cx="38" cy="36" r="10" fill="#FFE1C2" opacity={0.7} />
    <text x="50" y="62" textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize="34" fill={INK}>
      Cu
    </text>
    <text x="80" y="26" textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize="26" fill={INK}>
      +
    </text>
  </svg>
);

/** Hospital door with a copper push plate and handle. */
export const Door: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 320 520" width={size} height={(size * 520) / 320}>
    <rect x="10" y="10" width="300" height="500" rx="10" fill="#D9DDE6" stroke={INK} strokeWidth={6} />
    <rect x="40" y="40" width="240" height="180" rx="6" fill="#BFD7E6" stroke={INK} strokeWidth={4} />
    <path d="M60 60 L 120 200 M120 60 L 180 200" stroke="#FFFFFF" strokeWidth={8} opacity={0.6} />
    <rect x="200" y="270" width="80" height="150" rx="10" fill={COPPER} stroke={INK} strokeWidth={5} />
    <rect x="212" y="300" width="56" height="16" rx="8" fill={COPPER_LIGHT} stroke={INK} strokeWidth={4} />
    <path d="M150 120 h 20 M160 110 v 20" stroke={C.red} strokeWidth={6} />
  </svg>
);

export const Lemon: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 220 160" width={size} height={(size * 160) / 220}>
    <path d="M20 80 C 30 30, 80 15, 110 15 C 150 15, 190 35, 200 80 C 190 125, 150 145, 110 145 C 70 145, 30 130, 20 80 Z" fill="#F3D23C" stroke={INK} strokeWidth={6} />
    <path d="M200 80 l 14 -6 M20 80 l -14 6" stroke={INK} strokeWidth={6} strokeLinecap="round" />
    <path d="M60 50 C 70 40, 90 36, 105 36" fill="none" stroke="#FFF7C2" strokeWidth={8} strokeLinecap="round" />
  </svg>
);

/** Plain glass jar, for the "ordinary container" comparison. */
export const Jar: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 300 380" width={size} height={(size * 380) / 300}>
    <path d="M60 80 L 240 80 L 240 340 C 240 356, 228 368, 212 368 L 88 368 C 72 368, 60 356, 60 340 Z" fill="rgba(111,183,217,0.35)" stroke={C.cream} strokeWidth={7} />
    <rect x="80" y="40" width="140" height="44" rx="8" fill="#9AA0B3" stroke={INK} strokeWidth={5} />
    <path d="M84 110 L 92 330" stroke="#FFFFFF" strokeWidth={8} opacity={0.4} strokeLinecap="round" />
  </svg>
);

// --- icons --------------------------------------------------------------

const icon = (children: React.ReactNode, size: number, color: string) => (
  <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const MoonIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(<path d="M64 14 A 38 38 0 1 0 86 66 A 30 30 0 1 1 64 14 Z" />, size, color);
export const DropIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(<path d="M50 10 C 64 34, 78 48, 78 64 A 28 28 0 0 1 22 64 C 22 48, 36 34, 50 10 Z" />, size, color);
export const LotaIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(<><path d="M30 14 H 70 M36 14 C 38 24, 38 28, 34 32 C 10 40, 10 74, 26 84 C 40 92, 60 92, 74 84 C 90 74, 90 40, 66 32 C 62 28, 62 24, 64 14" /></>, size, color);
export const SparkleIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(<><path d="M50 10 L 58 42 L 90 50 L 58 58 L 50 90 L 42 58 L 10 50 L 42 42 Z" /></>, size, color);
