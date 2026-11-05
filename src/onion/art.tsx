import React from "react";
import { C } from "./theme";

// Hand-drawn SVG illustrations in one "ink engraving" style: gradient fill,
// diagonal hatching for shade, dark ink outline. Each takes an `id` so the
// gradient/pattern ids stay unique when several are on screen.

const INK = "#2A2420";

const Hatch: React.FC<{ id: string; color?: string; gap?: number; angle?: number }> = ({
  id,
  color = INK,
  gap = 9,
  angle = 35,
}) => (
  <pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
    <line x1="0" y1="0" x2="0" y2={gap} stroke={color} strokeWidth={2} opacity={0.35} />
  </pattern>
);

export const Onion: React.FC<{ id: string; size: number; style?: React.CSSProperties }> = ({
  id,
  size,
  style,
}) => (
  <svg viewBox="0 0 400 460" width={size} height={size * 1.15} style={style}>
    <defs>
      <radialGradient id={`${id}g`} cx="40%" cy="45%" r="65%">
        <stop offset="0%" stopColor="#E7B6EE" />
        <stop offset="45%" stopColor={C.purple} />
        <stop offset="100%" stopColor="#4A1F57" />
      </radialGradient>
      <Hatch id={`${id}h`} />
    </defs>
    {/* sprout tail */}
    <path d="M200 40 C 190 80, 188 110, 182 140 L 218 140 C 212 110, 210 80, 200 40 Z" fill="#B98A5A" stroke={INK} strokeWidth={5} />
    {/* bulb */}
    <path
      id={`${id}bulb`}
      d="M200 120 C 120 150, 50 230, 60 320 C 70 400, 140 430, 200 430 C 260 430, 330 400, 340 320 C 350 230, 280 150, 200 120 Z"
      fill={`url(#${id}g)`}
      stroke={INK}
      strokeWidth={6}
    />
    {/* shading hatch on the right */}
    <path
      d="M260 160 C 320 210, 350 280, 338 330 C 326 395, 270 425, 220 428 C 290 380, 300 260, 260 160 Z"
      fill={`url(#${id}h)`}
    />
    {/* skin lines */}
    {[-110, -60, -15, 30, 75, 120].map((dx, i) => (
      <path
        key={i}
        d={`M200 125 C ${200 + dx * 0.6} 200, ${200 + dx} 320, ${200 + dx * 0.45} 428`}
        fill="none"
        stroke={INK}
        strokeWidth={2.5}
        opacity={0.45}
      />
    ))}
    {/* highlight */}
    <path d="M120 230 C 105 270, 108 320, 125 355" fill="none" stroke="#F8E3FA" strokeWidth={10} strokeLinecap="round" opacity={0.6} />
    {/* roots */}
    {[-30, -15, 0, 15, 30].map((dx, i) => (
      <path key={i} d={`M${200 + dx * 0.6} 428 q ${dx} 18 ${dx * 1.4} 30`} fill="none" stroke="#C9A77A" strokeWidth={4} strokeLinecap="round" />
    ))}
  </svg>
);

export const OnionHalf: React.FC<{ id: string; size: number; style?: React.CSSProperties }> = ({
  id,
  size,
  style,
}) => (
  <svg viewBox="0 0 400 400" width={size} height={size} style={style}>
    <defs>
      <radialGradient id={`${id}c`} cx="50%" cy="55%" r="55%">
        <stop offset="0%" stopColor="#FBF2F4" />
        <stop offset="100%" stopColor="#E7C7E8" />
      </radialGradient>
    </defs>
    <ellipse cx="200" cy="210" rx="170" ry="160" fill={C.purple} stroke={INK} strokeWidth={6} />
    {[150, 128, 106, 84, 62, 40, 20].map((r, i) => (
      <ellipse
        key={i}
        cx="200"
        cy={214 + i * 2}
        rx={r * 1.06}
        ry={r}
        fill={i === 0 ? `url(#${id}c)` : "none"}
        stroke={i === 0 ? INK : "#B07ABF"}
        strokeWidth={i === 0 ? 3 : 3}
        opacity={i === 0 ? 1 : 0.8}
      />
    ))}
    <ellipse cx="200" cy="228" rx="8" ry="10" fill="#C79BD2" />
  </svg>
);

export const Knife: React.FC<{ id: string; width: number; style?: React.CSSProperties }> = ({
  id,
  width,
  style,
}) => (
  <svg viewBox="0 0 640 150" width={width} height={(width * 150) / 640} style={style}>
    <defs>
      <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F4F6F8" />
        <stop offset="55%" stopColor="#B9C0C8" />
        <stop offset="100%" stopColor="#7D858F" />
      </linearGradient>
      <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A86B3C" />
        <stop offset="100%" stopColor="#5E3519" />
      </linearGradient>
    </defs>
    <path d="M20 80 L 400 40 L 420 40 L 420 100 L 60 104 C 40 102, 26 94, 20 80 Z" fill={`url(#${id}b)`} stroke={INK} strokeWidth={5} />
    <path d="M40 86 L 400 74" stroke="#FFFFFF" strokeWidth={3} opacity={0.7} />
    <rect x="418" y="34" width="200" height="76" rx="22" fill={`url(#${id}h)`} stroke={INK} strokeWidth={5} />
    {[470, 530, 590].map((cx) => (
      <circle key={cx} cx={cx} cy="72" r="8" fill="#E6D2B5" stroke={INK} strokeWidth={3} />
    ))}
  </svg>
);

export const Garlic: React.FC<{ id: string; size: number; style?: React.CSSProperties }> = ({
  id,
  size,
  style,
}) => (
  <svg viewBox="0 0 400 460" width={size} height={size * 1.15} style={style}>
    <defs>
      <radialGradient id={`${id}g`} cx="40%" cy="45%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#EFE4D6" />
        <stop offset="100%" stopColor="#C9B49C" />
      </radialGradient>
      <Hatch id={`${id}h`} />
    </defs>
    <path d="M200 30 C 192 70, 192 110, 186 150 L 214 150 C 208 110, 208 70, 200 30 Z" fill="#D9C9A8" stroke={INK} strokeWidth={5} />
    <path
      d="M200 135 C 110 150, 50 240, 62 320 C 74 395, 140 425, 200 425 C 260 425, 326 395, 338 320 C 350 240, 290 150, 200 135 Z"
      fill={`url(#${id}g)`}
      stroke={INK}
      strokeWidth={6}
    />
    {/* clove seams */}
    {[-95, -45, 0, 45, 95].map((dx, i) => (
      <path key={i} d={`M200 145 C ${200 + dx * 0.7} 220, ${200 + dx} 330, ${200 + dx * 0.5} 422`} fill="none" stroke={INK} strokeWidth={3} opacity={0.5} />
    ))}
    {[-70, 70].map((dx, i) => (
      <path key={i} d={`M${200 + dx * 0.5} 200 C ${200 + dx} 260, ${200 + dx} 330, ${200 + dx * 0.6} 400`} fill="none" stroke="#B48BBE" strokeWidth={6} opacity={0.35} />
    ))}
    <path d="M270 190 C 320 240, 340 300, 330 340 C 318 395, 270 420, 225 423 C 290 380, 300 270, 270 190 Z" fill={`url(#${id}h)`} />
    {[-24, -8, 8, 24].map((dx, i) => (
      <path key={i} d={`M${200 + dx} 423 q ${dx} 16 ${dx * 1.5} 26`} fill="none" stroke="#B89F7E" strokeWidth={4} strokeLinecap="round" />
    ))}
  </svg>
);

/** Eye with tear gland; `irritation` 0..1 reddens it, `nerve` 0..1 lights the nerves. */
export const Eye: React.FC<{
  id: string;
  width: number;
  irritation?: number;
  nerve?: number;
  blink?: number; // 0 open .. 1 shut
  style?: React.CSSProperties;
}> = ({ id, width, irritation = 0, nerve = 0, blink = 0, style }) => {
  const lid = 120 * blink;
  return (
    <svg viewBox="0 0 640 400" width={width} height={(width * 400) / 640} style={style}>
      <defs>
        <radialGradient id={`${id}iris`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3A2412" />
          <stop offset="55%" stopColor="#8A5A2B" />
          <stop offset="100%" stopColor="#3A2412" />
        </radialGradient>
        <clipPath id={`${id}clip`}>
          <path d="M60 210 C 170 70, 470 70, 580 210 C 470 350, 170 350, 60 210 Z" />
        </clipPath>
      </defs>
      {/* nerves behind the eye */}
      {[
        "M320 330 C 300 380, 250 395, 200 398",
        "M330 330 C 350 385, 410 395, 470 398",
        "M320 335 C 320 370, 320 385, 320 400",
      ].map((d, i) => (
        <path key={i} d={d} fill="none" stroke={nerve > 0 ? C.orange : "#6B6F80"} strokeWidth={6 + nerve * 4} opacity={0.5 + nerve * 0.5} strokeLinecap="round" />
      ))}
      {/* tear gland, upper outer corner */}
      <ellipse cx="520" cy="95" rx="70" ry="40" fill="#E9A9B4" stroke={INK} strokeWidth={4} opacity={0.95} />
      <text x="520" y="40" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="22" fill="#A9AEC0" letterSpacing="2">
        TEAR GLAND
      </text>
      <g clipPath={`url(#${id}clip)`}>
        <rect x="0" y="0" width="640" height="400" fill={`rgb(${250},${246 - irritation * 70},${240 - irritation * 80})`} />
        {/* red veins */}
        {[
          "M70 210 C 120 200, 150 220, 190 205",
          "M80 240 C 130 250, 160 230, 205 245",
          "M570 200 C 520 190, 490 215, 450 200",
          "M565 240 C 520 255, 480 235, 440 250",
        ].map((d, i) => (
          <path key={i} d={d} fill="none" stroke={C.red} strokeWidth={3} opacity={irritation * 0.85} />
        ))}
        <circle cx="320" cy="210" r="100" fill={`url(#${id}iris)`} />
        <circle cx="320" cy="210" r="44" fill="#120B06" />
        <circle cx="290" cy="180" r="18" fill="#FFFFFF" opacity={0.85} />
        {/* eyelids for blinking */}
        <rect x="0" y={-10} width="640" height={70 + lid} fill="#D9A27F" />
        <rect x="0" y={340 - lid} width="640" height={80 + lid} fill="#D9A27F" />
      </g>
      <path d="M60 210 C 170 70, 470 70, 580 210 C 470 350, 170 350, 60 210 Z" fill="none" stroke={INK} strokeWidth={7} />
      {/* lashes */}
      {[0.15, 0.3, 0.45, 0.6, 0.75, 0.88].map((t, i) => {
        const x = 60 + 520 * t;
        const y = 210 - Math.sin(Math.PI * t) * 140;
        return <line key={i} x1={x} y1={y} x2={x - 12 + 24 * t} y2={y - 34} stroke={INK} strokeWidth={6} strokeLinecap="round" />;
      })}
    </svg>
  );
};

export const Medal: React.FC<{ id: string; size: number; style?: React.CSSProperties }> = ({ id, size, style }) => (
  <svg viewBox="0 0 300 420" width={size} height={size * 1.4} style={style}>
    <defs>
      <radialGradient id={`${id}g`} cx="40%" cy="38%" r="70%">
        <stop offset="0%" stopColor="#FFF2B8" />
        <stop offset="45%" stopColor="#E7B53C" />
        <stop offset="100%" stopColor="#9A6A12" />
      </radialGradient>
    </defs>
    <path d="M95 0 L 150 150 L 205 0 Z" fill={C.rust} stroke={INK} strokeWidth={5} />
    <path d="M60 0 L 120 170 L 150 150 L 95 0 Z" fill={C.purple} stroke={INK} strokeWidth={5} />
    <path d="M240 0 L 180 170 L 150 150 L 205 0 Z" fill={C.purple} stroke={INK} strokeWidth={5} />
    <circle cx="150" cy="270" r="128" fill={`url(#${id}g)`} stroke={INK} strokeWidth={7} />
    <circle cx="150" cy="270" r="100" fill="none" stroke="#8C6012" strokeWidth={4} strokeDasharray="6 8" />
    <text x="150" y="292" textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize="70" fill="#6B4508">
      IG
    </text>
  </svg>
);

export const Rabbit: React.FC<{ size: number; flip?: boolean; style?: React.CSSProperties }> = ({ size, flip, style }) => (
  <svg viewBox="0 0 320 300" width={size} height={(size * 300) / 320} style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }}>
    <g fill={C.cream} stroke={INK} strokeWidth={6}>
      <ellipse cx="120" cy="210" rx="95" ry="70" />
      <circle cx="40" cy="215" r="22" />
      <ellipse cx="225" cy="160" rx="62" ry="54" />
      <ellipse cx="210" cy="60" rx="20" ry="62" transform="rotate(-12 210 60)" />
      <ellipse cx="248" cy="62" rx="20" ry="62" transform="rotate(14 248 62)" />
      <ellipse cx="150" cy="270" rx="34" ry="14" />
    </g>
    <circle cx="250" cy="150" r="8" fill={INK} />
    <circle cx="284" cy="172" r="7" fill="#D88C9A" />
    <path d="M210 66 C 207 40, 208 22, 212 10" stroke="#E5A9B4" strokeWidth={10} fill="none" strokeLinecap="round" />
  </svg>
);

// --- small line icons for the tips list ---------------------------------

const icon = (children: React.ReactNode, size: number, color: string) => (
  <svg viewBox="0 0 100 100" width={size} height={size} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const SnowIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(
    <>
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a} 50 50)`}>
          <line x1="50" y1="8" x2="50" y2="92" />
          <polyline points="38,18 50,30 62,18" />
          <polyline points="38,82 50,70 62,82" />
        </g>
      ))}
    </>,
    size,
    color
  );

export const KnifeIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(
    <>
      <path d="M12 70 L 62 24 L 72 34 L 30 80 C 22 84, 14 80, 12 70 Z" />
      <line x1="68" y1="30" x2="90" y2="10" strokeWidth={12} />
    </>,
    size,
    color
  );

export const RootIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(
    <>
      <path d="M50 10 C 22 26, 18 56, 50 66 C 82 56, 78 26, 50 10 Z" />
      <path d="M42 66 l -8 22 M50 66 v 24 M58 66 l 8 22" />
    </>,
    size,
    color
  );

export const FanIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(
    <>
      <circle cx="50" cy="50" r="40" />
      <circle cx="50" cy="50" r="6" />
      {[0, 120, 240].map((a) => (
        <path key={a} d="M50 44 C 40 30, 46 16, 58 18 C 66 26, 60 38, 50 44 Z" transform={`rotate(${a} 50 50)`} />
      ))}
    </>,
    size,
    color
  );

export const ShieldIcon: React.FC<{ size: number; color: string }> = ({ size, color }) =>
  icon(<path d="M50 8 L 86 22 C 86 58, 72 80, 50 92 C 28 80, 14 58, 14 22 Z" />, size, color);
