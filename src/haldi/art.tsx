import React from "react";
import { C } from "../onion/theme";

// Illustrations for the haldi explainer, in the same "ink engraving" style as
// the onion series: gradient fill, hatched shade, dark ink outline.

const INK = "#2A2420";
export const TURMERIC = "#E3A21A";
export const GOLD_MILK = "#F2C14E";

const Hatch: React.FC<{ id: string }> = ({ id }) => (
  <pattern id={id} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
    <line x1="0" y1="0" x2="0" y2="9" stroke={INK} strokeWidth={2} opacity={0.3} />
  </pattern>
);

export const TurmericRoot: React.FC<{ id: string; size: number; style?: React.CSSProperties }> = ({ id, size, style }) => (
  <svg viewBox="0 0 460 300" width={size} height={(size * 300) / 460} style={style}>
    <defs>
      <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#D9A066" />
        <stop offset="100%" stopColor="#8A5A2B" />
      </linearGradient>
      <radialGradient id={`${id}c`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFC531" />
        <stop offset="100%" stopColor="#E07B00" />
      </radialGradient>
      <Hatch id={`${id}h`} />
    </defs>
    {/* main rhizome with fingers */}
    <path d="M40 170 C 60 120, 160 110, 240 130 C 300 145, 340 130, 380 110 C 410 98, 430 120, 418 145 C 405 170, 360 175, 330 190 C 290 210, 200 220, 120 215 C 70 212, 30 200, 40 170 Z" fill={`url(#${id}s)`} stroke={INK} strokeWidth={6} />
    <path d="M200 135 C 205 95, 225 60, 250 40 C 270 30, 285 45, 275 62 C 260 85, 250 110, 248 135 Z" fill={`url(#${id}s)`} stroke={INK} strokeWidth={6} />
    <path d="M130 210 C 120 240, 110 260, 95 275 C 85 285, 70 275, 76 262 C 88 240, 98 225, 102 212 Z" fill={`url(#${id}s)`} stroke={INK} strokeWidth={6} />
    {/* rings on the skin */}
    {[90, 150, 210, 290, 350].map((x) => (
      <path key={x} d={`M${x} ${130 + (x % 3) * 4} q 6 40 0 80`} fill="none" stroke={INK} strokeWidth={3} opacity={0.45} />
    ))}
    <path d="M60 195 C 150 215, 260 210, 330 190" fill={`url(#${id}h)`} stroke="none" />
    {/* cut face showing the orange inside */}
    <ellipse cx="418" cy="128" rx="22" ry="30" fill={`url(#${id}c)`} stroke={INK} strokeWidth={5} />
    <ellipse cx="418" cy="128" rx="11" ry="16" fill="none" stroke="#B85E00" strokeWidth={3} opacity={0.7} />
  </svg>
);

/** Glass of haldi doodh with optional steam and pepper specks. */
export const HaldiGlass: React.FC<{ id: string; size: number; specks?: number; style?: React.CSSProperties }> = ({ id, size, specks = 0, style }) => (
  <svg viewBox="0 0 300 400" width={size} height={(size * 400) / 300} style={style}>
    <defs>
      <linearGradient id={`${id}m`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#E8A92A" />
        <stop offset="45%" stopColor={GOLD_MILK} />
        <stop offset="100%" stopColor="#D08A10" />
      </linearGradient>
      <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
        <stop offset="30%" stopColor="rgba(255,255,255,0.12)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
      </linearGradient>
    </defs>
    {/* milk */}
    <path d="M62 120 L 238 120 L 222 370 C 221 382, 210 390, 198 390 L 102 390 C 90 390, 79 382, 78 370 Z" fill={`url(#${id}m)`} />
    <ellipse cx="150" cy="120" rx="88" ry="16" fill="#F7D57A" stroke={INK} strokeWidth={3} />
    {new Array(specks).fill(0).map((_, i) => (
      <circle key={i} cx={95 + ((i * 37) % 110)} cy={116 + ((i * 13) % 10)} r={4} fill="#2B2A28" />
    ))}
    {/* glass */}
    <path d="M50 60 L 250 60 L 226 372 C 224 390, 210 398, 196 398 L 104 398 C 90 398, 76 390, 74 372 Z" fill={`url(#${id}g)`} stroke={INK} strokeWidth={6} />
    <ellipse cx="150" cy="60" rx="100" ry="14" fill="none" stroke={INK} strokeWidth={5} />
    <path d="M80 90 L 98 360" stroke="#FFFFFF" strokeWidth={8} opacity={0.5} strokeLinecap="round" />
  </svg>
);

export const Peppercorns: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => {
  const pts = [
    [70, 90], [120, 70], [170, 95], [95, 135], [150, 140], [205, 130], [60, 160], [125, 185], [185, 180],
  ];
  return (
    <svg viewBox="0 0 260 240" width={size} height={(size * 240) / 260} style={style}>
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={30} fill="#3A3633" stroke={INK} strokeWidth={4} />
          <path d={`M${x - 18} ${y - 6} q 10 -10 20 -2 q 8 8 16 0`} fill="none" stroke="#6E6862" strokeWidth={4} strokeLinecap="round" />
          <path d={`M${x - 14} ${y + 10} q 12 -6 26 4`} fill="none" stroke="#6E6862" strokeWidth={3} strokeLinecap="round" />
          <circle cx={x - 10} cy={y - 12} r={6} fill="#8C857D" opacity={0.6} />
        </g>
      ))}
    </svg>
  );
};

/** Pippali: long pepper, a knobbly catkin. */
export const LongPepper: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 120 300" width={(size * 120) / 300} height={size}>
    <path d="M60 20 C 50 0, 70 0, 62 20" fill="none" stroke="#6B5A3A" strokeWidth={5} />
    <rect x="36" y="24" width="48" height="250" rx="24" fill="#5A4632" stroke={INK} strokeWidth={5} />
    {new Array(11).fill(0).map((_, r) =>
      [44, 60, 76].map((x, c) => (
        <circle key={`${r}-${c}`} cx={x + (r % 2 ? 4 : -4) * (c === 1 ? 0 : 1)} cy={40 + r * 21} r={8} fill="#7A6247" stroke={INK} strokeWidth={2} />
      ))
    )}
  </svg>
);

/** Saunth: dried ginger. */
export const DryGinger: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 300 220" width={size} height={(size * 220) / 300}>
    <path d="M30 140 C 40 100, 110 100, 150 110 C 170 70, 200 40, 230 50 C 255 60, 245 90, 220 110 C 250 110, 275 125, 270 150 C 262 180, 210 175, 180 170 C 140 190, 70 195, 40 175 C 25 165, 26 150, 30 140 Z" fill="#E8D3A6" stroke={INK} strokeWidth={6} />
    {[70, 120, 175, 220].map((x) => (
      <path key={x} d={`M${x} 120 q 6 26 0 52`} fill="none" stroke="#A88A5A" strokeWidth={4} />
    ))}
  </svg>
);

/** Liver with a working "clean-up" gear. `gearAngle` spins the gear. */
export const Liver: React.FC<{ id: string; size: number; gearAngle?: number; slowed?: number; style?: React.CSSProperties }> = ({
  id,
  size,
  gearAngle = 0,
  slowed = 0,
  style,
}) => (
  <svg viewBox="0 0 400 280" width={size} height={(size * 280) / 400} style={style}>
    <defs>
      <radialGradient id={`${id}l`} cx="40%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#D9767A" />
        <stop offset="100%" stopColor="#7A2A30" />
      </radialGradient>
    </defs>
    <path d="M30 120 C 30 50, 150 30, 260 40 C 340 48, 380 70, 370 110 C 360 150, 300 160, 250 190 C 200 222, 140 250, 90 230 C 40 210, 30 170, 30 120 Z" fill={`url(#${id}l)`} stroke={INK} strokeWidth={7} />
    <path d="M220 45 C 210 100, 215 150, 250 190" fill="none" stroke={INK} strokeWidth={4} opacity={0.5} />
    <g transform={`translate(140 125) rotate(${gearAngle})`}>
      {new Array(8).fill(0).map((_, i) => (
        <rect key={i} x="-9" y="-56" width="18" height="22" rx="3" fill={slowed > 0.5 ? "#9AA0B3" : C.cream} transform={`rotate(${i * 45})`} />
      ))}
      <circle r="40" fill={slowed > 0.5 ? "#9AA0B3" : C.cream} stroke={INK} strokeWidth={5} />
      <circle r="14" fill={INK} />
    </g>
  </svg>
);

export const LatteCup: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 360 300" width={size} height={(size * 300) / 360}>
    <ellipse cx="170" cy="270" rx="160" ry="22" fill="#D9CDB5" stroke={INK} strokeWidth={5} />
    <path d="M40 90 L 300 90 C 300 200, 250 255, 170 255 C 90 255, 40 200, 40 90 Z" fill="#F4EBDD" stroke={INK} strokeWidth={6} />
    <path d="M300 120 C 350 120, 350 190, 290 195" fill="none" stroke={INK} strokeWidth={14} />
    <path d="M300 120 C 350 120, 350 190, 290 195" fill="none" stroke="#F4EBDD" strokeWidth={6} />
    <ellipse cx="170" cy="90" rx="130" ry="26" fill={GOLD_MILK} stroke={INK} strokeWidth={5} />
    <path d="M170 104 C 150 86, 130 92, 140 80 C 150 70, 165 78, 170 86 C 175 78, 190 70, 200 80 C 210 92, 190 86, 170 104 Z" fill="#FFF6DF" />
  </svg>
);

export const GheeJar: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 220 260" width={size} height={(size * 260) / 220}>
    <rect x="40" y="30" width="140" height="34" rx="8" fill="#B5501C" stroke={INK} strokeWidth={5} />
    <path d="M30 70 L 190 70 L 182 230 C 181 242, 171 250, 160 250 L 60 250 C 49 250, 39 242, 38 230 Z" fill="#F3D27A" stroke={INK} strokeWidth={6} />
    <path d="M38 120 L 182 120" stroke="#E2B44A" strokeWidth={5} />
    <text x="110" y="200" textAnchor="middle" fontFamily="Tiro Devanagari Hindi" fontSize="46" fill={INK}>
      घी
    </text>
  </svg>
);

/** Kadhai with tadka: oil, mustard seeds and a turmeric swirl. */
export const TadkaPan: React.FC<{ size: number; swirl?: number }> = ({ size, swirl = 1 }) => (
  <svg viewBox="0 0 420 240" width={size} height={(size * 240) / 420}>
    <path d="M20 80 L 400 80 C 390 180, 320 220, 210 220 C 100 220, 30 180, 20 80 Z" fill="#3B3A3E" stroke={INK} strokeWidth={6} />
    <ellipse cx="210" cy="80" rx="190" ry="28" fill="#D9A23A" stroke={INK} strokeWidth={5} />
    <path d={`M120 80 C 160 ${80 - 18 * swirl}, 260 ${80 + 18 * swirl}, 300 80`} fill="none" stroke="#FFB300" strokeWidth={10} opacity={swirl} strokeLinecap="round" />
    {[140, 175, 230, 265, 200].map((x, i) => (
      <circle key={i} cx={x} cy={74 + (i % 2) * 10} r={6} fill="#2B2A28" />
    ))}
    <rect x="0" y="66" width="30" height="20" rx="8" fill="#2B2A28" />
    <rect x="390" y="66" width="30" height="20" rx="8" fill="#2B2A28" />
  </svg>
);

// --- recipe / caution icons -------------------------------------------------

const icon = (children: React.ReactNode, size: number, color: string) => (
  <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const CupIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(<><path d="M18 34 H 72 V 66 C 72 80, 60 88, 45 88 C 30 88, 18 80, 18 66 Z" /><path d="M72 42 C 90 42, 90 64, 72 64" /><path d="M34 22 q 6 -8 0 -16 M52 22 q 6 -8 0 -16" /></>, size, color);
export const SpoonIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(<><ellipse cx="34" cy="34" rx="20" ry="14" transform="rotate(-45 34 34)" /><line x1="46" y1="46" x2="88" y2="88" /></>, size, color);
export const PepperIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(<><circle cx="34" cy="40" r="14" /><circle cx="64" cy="34" r="14" /><circle cx="50" cy="66" r="14" /></>, size, color);
export const DropIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(<path d="M50 10 C 64 34, 78 48, 78 64 A 28 28 0 0 1 22 64 C 22 48, 36 34, 50 10 Z" />, size, color);
export const DoctorIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(<><rect x="16" y="16" width="68" height="68" rx="14" /><path d="M50 32 V 68 M32 50 H 68" /></>, size, color);
