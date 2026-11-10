import React from "react";
import { C } from "../onion/theme";

// Illustrations for the fridge explainer, in the series' "ink engraving"
// style: gradient fills, hatched shade, dark ink outline.

export const INK = "#2A2420";
export const ICE = "#8CCFE8";
export const ICE_DARK = "#3E8DB0";
export const DANGER = "#D9412B";
export const STEEL = "#D9DEE2";

const Hatch: React.FC<{ id: string; angle?: number; op?: number }> = ({ id, angle = 35, op = 0.28 }) => (
  <pattern id={id} width={9} height={9} patternUnits="userSpaceOnUse" patternTransform={`rotate(${angle})`}>
    <line x1="0" y1="0" x2="0" y2="9" stroke={INK} strokeWidth={2} opacity={op} />
  </pattern>
);

/**
 * Two-door fridge. `on` 0..1 lights the status LED and the cold glow;
 * `open` 0..1 swings the main door to show the shelves; `warm` 0..1 tints
 * the inside from cold blue to warm.
 */
export const Fridge: React.FC<{ id: string; size: number; on?: number; open?: number; warm?: number; frost?: number; style?: React.CSSProperties }> = ({
  id,
  size,
  on = 1,
  open = 0,
  warm = 0,
  frost = 0,
  style,
}) => {
  const inside = warm > 0.5 ? "#F2D3A4" : "#DDEFF7";
  return (
    <svg viewBox="0 0 400 760" width={size} height={(size * 760) / 400} style={{ overflow: "visible", ...style }}>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F4F6F7" />
          <stop offset="60%" stopColor={STEEL} />
          <stop offset="100%" stopColor="#9AA3AA" />
        </linearGradient>
        <radialGradient id={`${id}g`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={ICE} stopOpacity={0.6} />
          <stop offset="100%" stopColor={ICE} stopOpacity={0} />
        </radialGradient>
        <Hatch id={`${id}h`} />
      </defs>
      {on > 0 && <ellipse cx={200} cy={380} rx={300} ry={420} fill={`url(#${id}g)`} opacity={on * 0.7} />}
      {/* feet */}
      <rect x={40} y={728} width={40} height={24} rx={6} fill={INK} />
      <rect x={320} y={728} width={40} height={24} rx={6} fill={INK} />
      {/* body */}
      <rect x={20} y={10} width={360} height={724} rx={36} fill={`url(#${id}b)`} stroke={INK} strokeWidth={7} />
      {/* inside (visible when the door opens) */}
      <rect x={42} y={262} width={316} height={450} rx={14} fill={inside} stroke={INK} strokeWidth={5} />
      {[372, 482, 592].map((y) => (
        <line key={y} x1={46} y1={y} x2={354} y2={y} stroke="#9FB7C2" strokeWidth={7} />
      ))}
      {/* food on shelves */}
      <g opacity={open}>
        <rect x={80} y={300} width={56} height={72} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        <rect x={86} y={318} width={44} height={18} fill={ICE_DARK} />
        <ellipse cx={240} cy={356} rx={60} ry={18} fill="#C9662A" stroke={INK} strokeWidth={4} />
        <circle cx={110} cy={458} r={22} fill="#D9412B" stroke={INK} strokeWidth={4} />
        <circle cx={150} cy={462} r={18} fill="#E7C548" stroke={INK} strokeWidth={4} />
        <rect x={220} y={420} width={110} height={60} rx={12} fill="#7BAE3F" stroke={INK} strokeWidth={4} />
        <rect x={80} y={530} width={120} height={60} rx={10} fill="#F3EBDD" stroke={INK} strokeWidth={4} />
      </g>
      {/* freezer door */}
      <rect x={20} y={10} width={360} height={240} rx={36} fill={`url(#${id}b)`} stroke={INK} strokeWidth={7} />
      <rect x={300} y={70} width={22} height={120} rx={11} fill="#8C949A" stroke={INK} strokeWidth={5} />
      {frost > 0 && (
        <g opacity={frost}>
          {[60, 120, 180, 240].map((x) => (
            <path key={x} d={`M ${x} 250 l 8 26 l 8 -26`} fill="#EAF7FD" stroke={ICE_DARK} strokeWidth={3} />
          ))}
        </g>
      )}
      {/* main door: swings open by scaling from its hinge side */}
      <g transform={`translate(20 0) scale(${1 - open * 0.92} 1) translate(-20 0)`}>
        <rect x={20} y={258} width={360} height={476} rx={30} fill={`url(#${id}b)`} stroke={INK} strokeWidth={7} />
        <rect x={300} y={300} width={22} height={170} rx={11} fill="#8C949A" stroke={INK} strokeWidth={5} />
        <path d="M 330 520 L 370 520 L 370 720 L 330 720 Z" fill={`url(#${id}h)`} />
      </g>
      {/* status LED */}
      <circle cx={70} cy={50} r={11} fill={on > 0.5 ? "#59D96A" : "#5A2E26"} stroke={INK} strokeWidth={4} />
      {/* shine */}
      <path d="M 50 40 L 50 220" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" opacity={0.6} />
    </svg>
  );
};

/** Vertical thermometer from −5 to 35 °C; the 5–35 band is shaded as danger. */
export const Thermometer: React.FC<{ id: string; size: number; temp: number; showDanger?: number; labelColor?: string }> = ({ id, size, temp, showDanger = 1, labelColor = INK }) => {
  const top = 40;
  const bottom = 560;
  const toY = (t: number) => bottom - ((t + 5) / 40) * (bottom - top);
  const y = toY(Math.max(-5, Math.min(35, temp)));
  const hot = temp > 5;
  const fill = hot ? DANGER : ICE_DARK;
  return (
    <svg viewBox="0 0 220 720" width={size} height={(size * 720) / 220} style={{ overflow: "visible" }}>
      <defs>
        <Hatch id={`${id}h`} angle={-35} op={0.35} />
      </defs>
      <rect x={140} y={toY(35)} width={40} height={toY(5) - toY(35)} fill={DANGER} opacity={0.22 * showDanger} />
      <rect x={140} y={toY(35)} width={40} height={toY(5) - toY(35)} fill={`url(#${id}h)`} opacity={showDanger} />
      <rect x={70} y={20} width={60} height={560} rx={30} fill="#FBF7EE" stroke={INK} strokeWidth={7} />
      <rect x={86} y={y} width={28} height={bottom - y + 30} rx={14} fill={fill} />
      <circle cx={100} cy={630} r={62} fill={fill} stroke={INK} strokeWidth={7} />
      <circle cx={82} cy={612} r={14} fill="#FFFFFF" opacity={0.5} />
      {[-5, 5, 15, 25, 35].map((t) => (
        <g key={t}>
          <line x1={130} y1={toY(t)} x2={150} y2={toY(t)} stroke={labelColor} strokeWidth={5} />
          <text x={56} y={toY(t) + 10} textAnchor="end" fontFamily="IBM Plex Mono" fontSize={30} fill={labelColor}>
            {t}°
          </text>
        </g>
      ))}
    </svg>
  );
};

/** Clock face; `hours` advances the hour hand and fills an arc from 0. */
export const Clock: React.FC<{ size: number; hours: number; mark?: number }> = ({ size, hours, mark = 4 }) => {
  const a = (h: number) => ((h * 30 - 90) * Math.PI) / 180;
  const r = 150;
  const arc = (h: number) => {
    const large = h > 6 ? 1 : 0;
    return `M 0 ${-r + 12} A ${r - 12} ${r - 12} 0 ${large} 1 ${(r - 12) * Math.cos(a(h))} ${(r - 12) * Math.sin(a(h))}`;
  };
  return (
    <svg viewBox="-200 -200 400 400" width={size} height={size} style={{ overflow: "visible" }}>
      <circle r={r + 14} fill="#F6EEDC" stroke={INK} strokeWidth={8} />
      {hours > 0.05 && <path d={arc(Math.min(hours, 11.9))} stroke={hours > mark ? DANGER : ICE_DARK} strokeWidth={22} fill="none" opacity={0.55} strokeLinecap="round" />}
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={(r - 4) * Math.cos(a(i))} y1={(r - 4) * Math.sin(a(i))} x2={(r - 26) * Math.cos(a(i))} y2={(r - 26) * Math.sin(a(i))} stroke={INK} strokeWidth={i % 3 === 0 ? 8 : 4} />
      ))}
      <line x1={0} y1={0} x2={86 * Math.cos(a(hours))} y2={86 * Math.sin(a(hours))} stroke={INK} strokeWidth={12} strokeLinecap="round" />
      <line x1={0} y1={0} x2={118 * Math.cos(a(hours * 12))} y2={118 * Math.sin(a(hours * 12))} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <circle r={12} fill={INK} />
    </svg>
  );
};

/** Compressor capsule with pipes; `shake` jitters it, `heat` adds wavy lines. */
export const Compressor: React.FC<{ id: string; size: number; shake?: number; heat?: number; frame: number }> = ({ id, size, shake = 0, heat = 0, frame }) => {
  const dx = Math.sin(frame * 2.3) * 4 * shake;
  const dy = Math.cos(frame * 3.1) * 3 * shake;
  return (
    <svg viewBox="0 0 360 300" width={size} height={(size * 300) / 360} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5C6670" />
          <stop offset="100%" stopColor="#23282D" />
        </linearGradient>
      </defs>
      {heat > 0 &&
        [0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${120 + i * 60} 40 q 14 -20 0 -40 q -14 -20 0 -40`}
            transform={`translate(0 ${-((frame * 2 + i * 20) % 40)})`}
            stroke={DANGER}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            opacity={heat}
          />
        ))}
      <g transform={`translate(${dx} ${dy})`}>
        <path d="M 60 120 C 0 120, 0 60, 40 60 L 70 60" stroke="#8C949A" strokeWidth={14} fill="none" />
        <path d="M 300 120 C 360 120, 360 50, 320 40 L 290 40" stroke="#8C949A" strokeWidth={14} fill="none" />
        <rect x={60} y={80} width={240} height={180} rx={70} fill={`url(#${id}c)`} stroke={INK} strokeWidth={7} />
        <path d="M 90 120 Q 100 100 130 96" stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.4} />
        <rect x={80} y={252} width={200} height={26} rx={8} fill="#3A3F44" stroke={INK} strokeWidth={5} />
      </g>
    </svg>
  );
};

/** Semicircle power meter; `value` 0..1 swings the needle. */
export const Meter: React.FC<{ size: number; value: number; label?: string }> = ({ size, value, label = "POWER" }) => {
  const ang = Math.PI * (1 - value);
  return (
    <svg viewBox="-170 -170 340 220" width={size} height={(size * 220) / 340} style={{ overflow: "visible" }}>
      <path d="M -150 0 A 150 150 0 0 1 150 0 Z" fill="#F6EEDC" stroke={INK} strokeWidth={7} />
      <path d="M -120 0 A 120 120 0 0 1 -60 -104" stroke="#7BAE3F" strokeWidth={22} fill="none" />
      <path d="M -60 -104 A 120 120 0 0 1 60 -104" stroke="#E7C548" strokeWidth={22} fill="none" />
      <path d="M 60 -104 A 120 120 0 0 1 120 0" stroke={DANGER} strokeWidth={22} fill="none" />
      <line x1={0} y1={0} x2={128 * Math.cos(ang)} y2={-128 * Math.sin(ang)} stroke={INK} strokeWidth={9} strokeLinecap="round" />
      <circle r={14} fill={INK} />
      <text y={40} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={26} letterSpacing={4} fill={INK}>
        {label}
      </text>
    </svg>
  );
};

/** Milk pouch; `sour` 0..1 greens it and adds stink lines. */
export const Milk: React.FC<{ size: number; sour?: number; frame?: number }> = ({ size, sour = 0, frame = 0 }) => (
  <svg viewBox="0 0 240 320" width={size} height={(size * 320) / 240} style={{ overflow: "visible" }}>
    {sour > 0 &&
      [0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${70 + i * 50} 20 q 16 -20 0 -40 q -16 -20 0 -40`}
          transform={`translate(0 ${-((frame + i * 14) % 30)})`}
          stroke="#7BAE3F"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
          opacity={sour}
        />
      ))}
    <path d="M 40 40 L 200 40 L 220 290 Q 120 310 20 290 Z" fill={sour > 0.5 ? "#E6E9C8" : "#FFFFFF"} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M 40 40 L 70 10 L 170 10 L 200 40" fill="#FFFFFF" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <rect x={50} y={120} width={140} height={70} rx={8} fill={ICE_DARK} />
    <text x={120} y={168} textAnchor="middle" fontFamily="Oswald" fontWeight={700} fontSize={40} fill="#FFFFFF">
      DOODH
    </text>
  </svg>
);

// Small round icons for chips and checklists (stroke style, `color` ink).

type IconP = { size: number; color: string };
export const DripIcon: React.FC<IconP> = ({ size, color }) => (
  <svg viewBox="0 0 48 48" width={size} height={size}>
    <path d="M24 6 C 30 16, 36 22, 36 30 A 12 12 0 0 1 12 30 C 12 22, 18 16, 24 6 Z" fill="none" stroke={color} strokeWidth={4} />
  </svg>
);
export const StinkIcon: React.FC<IconP> = ({ size, color }) => (
  <svg viewBox="0 0 48 48" width={size} height={size}>
    {[12, 24, 36].map((x) => (
      <path key={x} d={`M ${x} 42 q 6 -8 0 -16 q -6 -8 0 -16`} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
    ))}
  </svg>
);
export const GearIcon: React.FC<IconP> = ({ size, color }) => (
  <svg viewBox="0 0 48 48" width={size} height={size}>
    <circle cx={24} cy={24} r={9} fill="none" stroke={color} strokeWidth={4} />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI) / 4;
      return <line key={i} x1={24 + 13 * Math.cos(a)} y1={24 + 13 * Math.sin(a)} x2={24 + 20 * Math.cos(a)} y2={24 + 20 * Math.sin(a)} stroke={color} strokeWidth={5} strokeLinecap="round" />;
    })}
  </svg>
);
export const SnowIcon: React.FC<IconP> = ({ size, color }) => (
  <svg viewBox="0 0 48 48" width={size} height={size}>
    {[0, 60, 120].map((r) => (
      <line key={r} x1={24} y1={6} x2={24} y2={42} stroke={color} strokeWidth={4} strokeLinecap="round" transform={`rotate(${r} 24 24)`} />
    ))}
  </svg>
);
export const StarIcon: React.FC<IconP> = ({ size, color }) => (
  <svg viewBox="0 0 48 48" width={size} height={size}>
    <path d="M24 5 L29.5 18 L43 19 L32.5 28 L36 42 L24 34.5 L12 42 L15.5 28 L5 19 L18.5 18 Z" fill="none" stroke={color} strokeWidth={4} strokeLinejoin="round" />
  </svg>
);
export const GapIcon: React.FC<IconP> = ({ size, color }) => (
  <svg viewBox="0 0 48 48" width={size} height={size}>
    <line x1={8} y1={6} x2={8} y2={42} stroke={color} strokeWidth={5} />
    <rect x={20} y={8} width={22} height={34} rx={4} fill="none" stroke={color} strokeWidth={4} />
    <path d="M10 24 L18 24 M14 20 L18 24 L14 28" stroke={color} strokeWidth={3} fill="none" />
  </svg>
);
export const SealIcon: React.FC<IconP> = ({ size, color }) => (
  <svg viewBox="0 0 48 48" width={size} height={size}>
    <rect x={8} y={6} width={32} height={36} rx={6} fill="none" stroke={color} strokeWidth={4} />
    <rect x={13} y={11} width={22} height={26} rx={3} fill="none" stroke={color} strokeWidth={2} strokeDasharray="3 3" />
  </svg>
);
export const BowlIcon: React.FC<IconP> = ({ size, color }) => (
  <svg viewBox="0 0 48 48" width={size} height={size}>
    <path d="M6 24 L42 24 Q 40 40 24 40 Q 8 40 6 24 Z" fill="none" stroke={color} strokeWidth={4} />
    {[16, 24, 32].map((x) => (
      <path key={x} d={`M ${x} 18 q 3 -4 0 -8`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
    ))}
  </svg>
);

export const RupeeCoin: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <circle cx={50} cy={50} r={44} fill="#E7C548" stroke={INK} strokeWidth={6} />
    <circle cx={50} cy={50} r={34} fill="none" stroke="#B8962E" strokeWidth={3} />
    <path d="M34 30 H66 M34 42 H66 M40 30 C 62 30, 62 54, 40 54 L 62 74" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ACCENT = C.orange;
