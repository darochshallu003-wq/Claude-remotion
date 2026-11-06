import React from "react";

// Illustrations for the dahi short, in the kraft-paper flat-ink style.

const INK = "#231F1C";
export const MILK = "#FBF7EE";
export const DAHI = "#F3EEDF";
export const COLD = "#4A7FB5";
export const WARM = "#E08A2C";

/** Steel katori with liquid milk (set=0) or thick set dahi (set=1). */
export const Katori: React.FC<{ size: number; set?: number; wobble?: number; style?: React.CSSProperties }> = ({ size, set = 0, wobble = 0, style }) => (
  <svg viewBox="0 0 400 260" width={size} height={(size * 260) / 400} style={{ overflow: "visible", ...style }}>
    <defs>
      <linearGradient id="katoriSteel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#8E959C" />
        <stop offset="35%" stopColor="#E8ECEF" />
        <stop offset="70%" stopColor="#B4BBC1" />
        <stop offset="100%" stopColor="#7E858C" />
      </linearGradient>
    </defs>
    <ellipse cx="200" cy="244" rx="110" ry="14" fill="rgba(0,0,0,0.18)" />
    <path d="M20 80 C 30 190, 100 236, 200 236 C 300 236, 370 190, 380 80 Z" fill="url(#katoriSteel)" stroke={INK} strokeWidth={6} />
    <ellipse cx="200" cy="80" rx="180" ry="40" fill="#C9CFD4" stroke={INK} strokeWidth={6} />
    {/* contents */}
    <ellipse cx="200" cy="86" rx="160" ry="32" fill={set > 0.5 ? DAHI : MILK} stroke={INK} strokeWidth={3} />
    {set > 0.5 ? (
      <path
        d={`M80 86 C 120 ${70 - wobble * 6}, 170 ${64 + wobble * 6}, 210 74 C 250 ${84 - wobble * 6}, 290 ${70 + wobble * 4}, 320 86`}
        fill="none"
        stroke="#D9CFB4"
        strokeWidth={6}
        strokeLinecap="round"
      />
    ) : (
      <ellipse cx="170" cy="80" rx="60" ry="8" fill="#FFFFFF" opacity={0.8} />
    )}
  </svg>
);

/** A spoon heaped with jaman (starter dahi). */
export const JamanSpoon: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 420 160" width={size} height={(size * 160) / 420}>
    <path d="M150 84 L 410 70 L 412 88 L 152 100 Z" fill="#C9CFD4" stroke={INK} strokeWidth={5} />
    <ellipse cx="90" cy="88" rx="80" ry="46" fill="#C9CFD4" stroke={INK} strokeWidth={6} />
    <path d="M30 80 C 40 40, 140 36, 152 80 C 140 92, 40 96, 30 80 Z" fill={DAHI} stroke={INK} strokeWidth={4} />
    <path d="M60 64 C 80 54, 110 54, 128 62" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
  </svg>
);

/** Thermometer with a reading in °C (0-80 scale). */
export const Thermometer: React.FC<{ height: number; temp: number }> = ({ height, temp }) => {
  const level = Math.max(0, Math.min(1, temp / 80));
  const color = temp < 25 ? COLD : temp > 50 ? "#D0312D" : "#3E9A4A";
  return (
    <svg viewBox="0 0 120 520" width={(height * 120) / 520} height={height}>
      <rect x="35" y="20" width="50" height="420" rx="25" fill="#F7F3EA" stroke={INK} strokeWidth={6} />
      <rect x="48" y={40 + 380 * (1 - level)} width="24" height={380 * level + 20} rx="12" fill={color} />
      <circle cx="60" cy="460" r="48" fill={color} stroke={INK} strokeWidth={6} />
      {[0, 20, 40, 60, 80].map((t) => (
        <line key={t} x1="85" x2="104" y1={420 - (t / 80) * 380} y2={420 - (t / 80) * 380} stroke={INK} strokeWidth={4} />
      ))}
    </svg>
  );
};

export const Fridge: React.FC<{ size: number; open?: number }> = ({ size, open = 0 }) => (
  <svg viewBox="0 0 300 480" width={size} height={(size * 480) / 300} style={{ overflow: "visible" }}>
    <rect x="20" y="10" width="260" height="460" rx="24" fill="#E6EEF3" stroke={INK} strokeWidth={6} />
    <line x1="20" y1="170" x2="280" y2="170" stroke={INK} strokeWidth={5} />
    <rect x="240" y="60" width="14" height="70" rx="7" fill="#9AA6AD" />
    <rect x="240" y="210" width="14" height="110" rx="7" fill="#9AA6AD" />
    {/* frost */}
    <path d="M60 40 l 12 12 m 0 -12 l -12 12 M56 46 h 20 M66 36 v 20" stroke={COLD} strokeWidth={4} opacity={0.7} />
    <path d="M150 380 l 10 10 m 0 -10 l -10 10 M146 385 h 18 M155 376 v 18" stroke={COLD} strokeWidth={4} opacity={0.7} />
    {open > 0 && <rect x="20" y="170" width={260 * open} height="300" fill="#B9D6EA" opacity={0.6} />}
  </svg>
);

/** Insulated casserole (hot-pot) with a lid. */
export const Casserole: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 320 240" width={size} height={(size * 240) / 320}>
    <path d="M30 90 L 290 90 L 280 210 C 278 224, 266 232, 252 232 L 68 232 C 54 232, 42 224, 40 210 Z" fill="#C2272D" stroke={INK} strokeWidth={6} />
    <path d="M40 130 L 280 130" stroke="#F1E7D2" strokeWidth={6} opacity={0.7} />
    {[80, 130, 180, 230].map((x) => (
      <circle key={x} cx={x} cy={180} r={8} fill="#F1E7D2" opacity={0.8} />
    ))}
    <ellipse cx="160" cy="88" rx="140" ry="24" fill="#E04A40" stroke={INK} strokeWidth={6} />
    <rect x="130" y="50" width="60" height="22" rx="10" fill="#8E1C18" stroke={INK} strokeWidth={5} />
  </svg>
);

/** Oven with the light on (warm glow) and a katori inside. */
export const Oven: React.FC<{ size: number; glow?: number }> = ({ size, glow = 1 }) => (
  <svg viewBox="0 0 420 300" width={size} height={(size * 300) / 420}>
    <rect x="10" y="10" width="400" height="280" rx="20" fill="#3A3836" stroke={INK} strokeWidth={6} />
    <rect x="40" y="50" width="260" height="200" rx="12" fill={`rgba(255,196,110,${0.25 + 0.55 * glow})`} stroke={INK} strokeWidth={5} />
    <circle cx="80" cy="80" r="16" fill={`rgba(255,240,180,${glow})`} stroke={INK} strokeWidth={3} />
    <ellipse cx="170" cy="215" rx="80" ry="16" fill="#C9CFD4" stroke={INK} strokeWidth={4} />
    <path d="M100 210 C 110 245, 230 245, 240 210" fill="#C9CFD4" stroke={INK} strokeWidth={4} />
    {[340, 340, 340].map((x, i) => (
      <circle key={i} cx={x + 14} cy={80 + i * 60} r={18} fill="#6A6764" stroke={INK} strokeWidth={4} />
    ))}
  </svg>
);
