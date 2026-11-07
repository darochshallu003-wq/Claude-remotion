import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { clamp, FONT, K } from "../reel/kit";

// Flat-ink kitchen props for the pressure-cooker reel.

const INK = K.ink;

/** Pressure cooker, side view. `lift` (0-1) raises the whistle weight. */
export const Cooker: React.FC<{ size: number; lift?: number; steam?: number }> = ({ size, lift = 0, steam = 0 }) => {
  const frame = useCurrentFrame();
  const shake = lift > 0.5 ? Math.sin(frame * 2.3) * 2 : 0;
  return (
    <svg viewBox="0 0 400 320" width={size} height={(size * 320) / 400} style={{ overflow: "visible" }}>
      <g stroke={INK} strokeWidth={6} strokeLinejoin="round">
        {/* steam jet from the vent */}
        {steam > 0 &&
          [0, 1, 2, 3, 4].map((i) => {
            const ph = ((frame * 1.6 + i * 14) % 70) / 70;
            return (
              <circle
                key={i}
                cx={200 + Math.sin(i * 2 + frame / 6) * 10 * ph}
                cy={40 - ph * 130 * steam}
                r={10 + ph * 26}
                fill="white"
                stroke={INK}
                strokeWidth={4}
                opacity={(1 - ph) * steam}
              />
            );
          })}
        {/* handle */}
        <path d="M300 110 L 392 98 C 400 97, 404 112, 396 116 L 300 132 Z" fill="#26282B" />
        {/* body */}
        <path d="M60 120 L 70 286 C 72 304, 90 312, 110 312 L 290 312 C 310 312, 328 304, 330 286 L 340 120 Z" fill={K.steel} />
        <path d="M84 140 L 90 280" stroke="white" strokeWidth={10} opacity={0.6} strokeLinecap="round" />
        {/* lid */}
        <path d="M50 120 C 60 82, 340 82, 350 120 Z" fill={K.steelDark} />
        <rect x="186" y={64 - lift * 34 + shake} width="28" height="30" rx="6" fill="#26282B" transform={`rotate(${shake * 2} 200 ${80 - lift * 34})`} />
        <rect x="194" y="72" width="12" height="18" fill="#55595E" />
      </g>
    </svg>
  );
};

/** Open pot with water; `boil` (0-1) adds bubbles and steam. */
export const Pot: React.FC<{ size: number; boil?: number }> = ({ size, boil = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 400 300" width={size} height={(size * 300) / 400} style={{ overflow: "visible" }}>
      <g stroke={INK} strokeWidth={6} strokeLinejoin="round">
        {[0, 1, 2].map((i) => {
          const ph = ((frame * 1.2 + i * 23) % 70) / 70;
          return (
            <path
              key={i}
              d={`M${140 + i * 60} ${70 - ph * 110} c -20 -20, 20 -30, 0 -50`}
              fill="none"
              stroke={K.muted}
              strokeWidth={8}
              strokeLinecap="round"
              opacity={(1 - ph) * boil}
            />
          );
        })}
        <path d="M30 100 L 20 100 M370 100 L 380 100" strokeWidth={14} strokeLinecap="round" />
        <path d="M40 90 L 54 270 C 56 286, 72 292, 90 292 L 310 292 C 328 292, 344 286, 346 270 L 360 90 Z" fill="#B87333" />
        <path d="M54 120 L 346 120 L 342 160 L 58 160 Z" fill={K.tealLight} stroke="none" opacity={0.55} />
        <ellipse cx="200" cy="90" rx="162" ry="16" fill="#D08A4A" />
        {boil > 0 &&
          Array.from({ length: 7 }, (_, i) => {
            const ph = ((frame * 2 + i * 11) % 30) / 30;
            return <circle key={i} cx={80 + random(`b${i}`) * 240} cy={150 - ph * 40} r={6 + 4 * ph} fill="white" strokeWidth={3} opacity={boil * (1 - ph)} />;
          })}
      </g>
    </svg>
  );
};

/** Gas flame; `level` 0-1 scales it. */
export const Flame: React.FC<{ width: number; level: number }> = ({ width, level }) => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 400 120" width={width} height={(width * 120) / 400} style={{ overflow: "visible" }}>
      {Array.from({ length: 7 }, (_, i) => {
        const h = (40 + 50 * level) * (0.85 + 0.15 * Math.sin(frame / 3 + i * 1.7));
        const x = 80 + i * 40;
        return (
          <g key={i}>
            <path d={`M${x - 16} 110 C ${x - 18} ${110 - h * 0.5}, ${x} ${110 - h * 0.8}, ${x} ${110 - h} C ${x} ${110 - h * 0.8}, ${x + 18} ${110 - h * 0.5}, ${x + 16} 110 Z`} fill="#3D7BE0" stroke={INK} strokeWidth={4} />
            <path d={`M${x - 8} 110 C ${x - 9} ${110 - h * 0.35}, ${x} ${110 - h * 0.5}, ${x} ${110 - h * 0.6} C ${x} ${110 - h * 0.5}, ${x + 9} ${110 - h * 0.35}, ${x + 8} 110 Z`} fill="#9FD0FF" />
          </g>
        );
      })}
      <rect x="40" y="108" width="320" height="16" rx="6" fill="#26282B" stroke={INK} strokeWidth={4} />
    </svg>
  );
};

/** Thermometer reading `temp` °C on a 20-130 scale. */
export const Thermometer: React.FC<{ height: number; temp: number; color?: string }> = ({ height, temp, color = K.red }) => {
  const top = 30;
  const bottom = 470;
  const y = interpolate(temp, [20, 130], [bottom, top], clamp);
  return (
    <svg viewBox="0 0 160 600" height={height} width={(height * 160) / 600} style={{ overflow: "visible" }}>
      <g stroke={INK} strokeWidth={6}>
        <rect x="50" y="10" width="60" height="500" rx="30" fill="white" />
        <circle cx="80" cy="530" r="52" fill={color} />
        <rect x="66" y={y} width="28" height={520 - y} fill={color} stroke="none" />
      </g>
      {[30, 50, 70, 90, 110, 130].map((t) => {
        const ty = interpolate(t, [20, 130], [bottom, top]);
        return <path key={t} d={`M110 ${ty} L 128 ${ty}`} stroke={INK} strokeWidth={4} />;
      })}
      {[100].map((t) => {
        const ty = interpolate(t, [20, 130], [bottom, top]);
        return <path key={t} d={`M30 ${ty} L 130 ${ty}`} stroke={INK} strokeWidth={4} strokeDasharray="8 8" />;
      })}
    </svg>
  );
};

/** Dial gauge, `value` 0-1 sweeps the needle; labels at both ends. */
export const Gauge: React.FC<{ size: number; value: number; lo: string; hi: string }> = ({ size, value, lo, hi }) => {
  const a = -120 + 240 * value;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ overflow: "visible" }}>
      <circle cx="100" cy="100" r="88" fill="white" stroke={INK} strokeWidth={6} />
      <path d="M 30 140 A 80 80 0 1 1 170 140" fill="none" stroke={K.mustard} strokeWidth={10} opacity={0.6} />
      <path d="M 140 30 A 80 80 0 0 1 170 140" fill="none" stroke={K.red} strokeWidth={10} />
      <g transform={`rotate(${a} 100 100)`}>
        <path d="M100 100 L 100 30" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      </g>
      <circle cx="100" cy="100" r="10" fill={INK} />
      <text x="24" y="222" fontFamily={FONT} fontWeight={800} fontSize={26} textAnchor="middle" fill="#E8E4D8">{lo}</text>
      <text x="176" y="222" fontFamily={FONT} fontWeight={800} fontSize={26} textAnchor="middle" fill={K.red}>{hi}</text>
    </svg>
  );
};
