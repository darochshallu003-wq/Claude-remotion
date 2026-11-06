import React from "react";
import { random } from "remotion";
import { C } from "../onion/theme";
import { Bartan, Coins, Diya, GOLD, Jhadu, Kalash, Lotus, Snake } from "../dhanteras/art";
import { Peppercorns } from "../haldi/art";

// Art library for the Diwali series, in the series' ink-engraving style.
// Every piece is registered in ART under a short name so episode scripts can
// ask for it by string; "emoji:🐄" renders an emoji badge for one-off items.

const INK = "#2A2420";

type P = { size: number; f: number; id: string };

const Svg: React.FC<{ vb: string; size: number; children: React.ReactNode }> = ({ vb, size, children }) => {
  const [, , w, h] = vb.split(" ").map(Number);
  return (
    <svg viewBox={vb} width={size} height={(size * h) / w} style={{ overflow: "visible" }}>
      {children}
    </svg>
  );
};

const flick = (f: number, s = 0) => (Math.sin(f * 0.7 + s) + Math.sin(f * 1.3 + s * 2)) / 2;

export const Owl: React.FC<P> = ({ size, f }) => {
  const blink = f % 70 < 4 ? 0.15 : 1;
  return (
    <Svg vb="0 0 300 340" size={size}>
      <path d="M150 40 C 60 40, 40 120, 50 200 C 60 290, 110 320, 150 320 C 190 320, 240 290, 250 200 C 260 120, 240 40, 150 40 Z" fill="#B88A5A" stroke={INK} strokeWidth={7} />
      <path d="M70 60 L 90 10 L 120 52 Z M230 60 L 210 10 L 180 52 Z" fill="#B88A5A" stroke={INK} strokeWidth={6} />
      <path d="M100 180 C 110 260, 190 260, 200 180 C 190 230, 110 230, 100 180 Z" fill="#E8D3A6" stroke={INK} strokeWidth={5} />
      {[0, 1, 2].map((r) => (
        <path key={r} d={`M${118 + r * 6} ${205 + r * 18} q 32 14 ${64 - r * 12} 0`} fill="none" stroke="#8A6A40" strokeWidth={4} />
      ))}
      {[105, 195].map((x) => (
        <g key={x}>
          <circle cx={x} cy={125} r={42} fill="#F6EEDC" stroke={INK} strokeWidth={6} />
          <ellipse cx={x} cy={125} rx={20} ry={20 * blink} fill={GOLD} stroke={INK} strokeWidth={4} />
          <ellipse cx={x} cy={125} rx={9} ry={9 * blink} fill={INK} />
        </g>
      ))}
      <path d="M140 150 L 160 150 L 150 178 Z" fill="#E08A1E" stroke={INK} strokeWidth={4} />
      <path d="M120 318 l -10 18 M135 320 l 0 18 M165 320 l 0 18 M180 318 l 10 18" stroke="#E08A1E" strokeWidth={7} strokeLinecap="round" />
    </Svg>
  );
};

/** Govardhan: a hill held up on one finger, with rain on its slopes. */
export const Mountain: React.FC<P> = ({ size, f, id }) => (
  <Svg vb="0 0 420 420" size={size}>
    <defs>
      <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7FA65A" />
        <stop offset="100%" stopColor="#4E7A3A" />
      </linearGradient>
    </defs>
    {new Array(16).fill(0).map((_, i) => {
      const x = (i * 29 + f * 3) % 420;
      const y = ((f * 14 + i * 47) % 140) - 40;
      return <line key={i} x1={x} y1={y} x2={x - 8} y2={y + 26} stroke="#8EC3E6" strokeWidth={4} strokeLinecap="round" opacity={0.8} />;
    })}
    <path d="M30 200 C 80 110, 130 60, 190 50 C 240 60, 300 100, 390 200 Z" fill={`url(#${id}m)`} stroke={INK} strokeWidth={7} />
    <path d="M150 90 l 20 30 l 20 -26 M250 120 l 18 24 l 16 -18" fill="none" stroke={INK} strokeWidth={4} opacity={0.4} />
    {[90, 160, 260, 330].map((x, i) => (
      <circle key={i} cx={x} cy={180 - (i % 2) * 20} r={16} fill="#3E6A2E" stroke={INK} strokeWidth={4} />
    ))}
    <path d="M30 200 L 390 200" stroke={INK} strokeWidth={7} />
    <rect x="200" y="200" width="20" height="150" rx="10" fill="#C98A5A" stroke={INK} strokeWidth={5} />
    <path d="M180 350 C 180 330, 240 330, 240 350 L 240 400 L 180 400 Z" fill="#C98A5A" stroke={INK} strokeWidth={5} />
  </Svg>
);

export const Rocket: React.FC<P> = ({ size, f }) => (
  <Svg vb="0 0 200 420" size={size}>
    {new Array(12).fill(0).map((_, i) => {
      const t = ((f + i * 4) % 24) / 24;
      return <circle key={i} cx={100 + Math.sin(i * 2.3) * 24 * t} cy={330 + t * 80} r={7 * (1 - t)} fill={i % 2 ? GOLD : "#FF7A2F"} />;
    })}
    <path d="M100 20 L 140 90 L 140 300 L 60 300 L 60 90 Z" fill="#D9412B" stroke={INK} strokeWidth={7} />
    <path d="M60 160 L 140 160 M60 230 L 140 230" stroke="#F2C75A" strokeWidth={10} />
    <path d="M60 250 L 20 320 L 60 300 Z M140 250 L 180 320 L 140 300 Z" fill="#3B6EA8" stroke={INK} strokeWidth={6} />
    <line x1="100" y1="300" x2="100" y2="330" stroke={INK} strokeWidth={5} />
  </Svg>
);

/** Anar (flower pot) spraying sparks in `colors`. */
export const Anar: React.FC<P & { colors?: string[] }> = ({ size, f, colors = [GOLD, "#FFF2B0", "#FF8A2F"] }) => (
  <Svg vb="0 0 300 420" size={size}>
    {new Array(46).fill(0).map((_, i) => {
      const life = 26 + random(`al${i}`) * 14;
      const t = ((f + random(`ao${i}`) * life) % life) / life;
      const a = -Math.PI / 2 + (random(`aa${i}`) - 0.5) * 1.1;
      const v = 230 + random(`av${i}`) * 90;
      const x = 150 + Math.cos(a) * v * t;
      const y = 250 + Math.sin(a) * v * t + 260 * t * t;
      return <circle key={i} cx={x} cy={y} r={6 * (1 - t) + 1.5} fill={colors[i % colors.length]} opacity={1 - t * 0.6} />;
    })}
    <path d="M110 250 L 190 250 L 230 400 L 70 400 Z" fill="#7A5A3A" stroke={INK} strokeWidth={7} />
    <path d="M90 320 L 210 320" stroke={GOLD} strokeWidth={10} />
    <ellipse cx="150" cy="250" rx="40" ry="9" fill="#3A2A1E" stroke={INK} strokeWidth={5} />
  </Svg>
);

/** A burst of one colour, labelled by the element that makes it. */
export const Burst: React.FC<P & { color: string }> = ({ size, f, color }) => (
  <Svg vb="0 0 300 300" size={size}>
    <circle cx="150" cy="150" r={140} fill={color} opacity={0.12} />
    {new Array(24).fill(0).map((_, i) => {
      const a = (i / 24) * Math.PI * 2;
      const r1 = 30 + ((f * 2) % 20);
      const r2 = 120 + Math.sin(f / 6 + i) * 10;
      return <line key={i} x1={150 + Math.cos(a) * r1} y1={150 + Math.sin(a) * r1} x2={150 + Math.cos(a) * r2} y2={150 + Math.sin(a) * r2} stroke={color} strokeWidth={8} strokeLinecap="round" />;
    })}
    <circle cx="150" cy="150" r={22} fill="#FFFFFF" opacity={0.9} />
  </Svg>
);

export const Smog: React.FC<P> = ({ size, f }) => (
  <Svg vb="0 0 420 320" size={size}>
    {[[20, 120, 60, 200], [90, 80, 50, 240], [150, 150, 70, 170], [230, 60, 60, 260], [300, 130, 50, 190], [360, 100, 50, 220]].map(([x, y, w, h], i) => (
      <g key={i}>
        <rect x={x} y={y} width={w} height={h} fill="#4A4E5C" stroke={INK} strokeWidth={5} />
        {new Array(Math.floor(h / 40)).fill(0).map((_, k) => (
          <rect key={k} x={x + 12} y={y + 16 + k * 40} width={w - 24} height={14} fill="#F2C75A" opacity={0.5} />
        ))}
      </g>
    ))}
    {new Array(7).fill(0).map((_, i) => (
      <ellipse key={i} cx={((i * 70 + f * 1.2) % 520) - 50} cy={150 + (i % 3) * 40} rx={110} ry={46} fill="#9A9488" opacity={0.55} />
    ))}
  </Svg>
);

export const Field: React.FC<P> = ({ size, f }) => (
  <Svg vb="0 0 420 300" size={size}>
    <rect x="0" y="170" width="420" height="130" fill="#B88A44" stroke={INK} strokeWidth={6} />
    {new Array(14).fill(0).map((_, i) => (
      <path key={i} d={`M${15 + i * 30} 230 l -6 -40 M${15 + i * 30} 230 l 6 -36`} stroke="#8A6A2A" strokeWidth={4} />
    ))}
    {[80, 200, 320].map((x, i) => (
      <path key={x} d={`M${x - 40} 190 C ${x - 30} ${120 - flick(f, i) * 10}, ${x - 5} 140, ${x} ${90 + flick(f, i + 1) * 12} C ${x + 10} 140, ${x + 30} 120, ${x + 40} 190 Z`} fill="#FF8A2F" stroke="#D9412B" strokeWidth={5} />
    ))}
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={130 + i * 90 + Math.sin(f / 15 + i) * 20} cy={60 - i * 10 - ((f * 0.8) % 30)} rx={70} ry={30} fill="#6E6A66" opacity={0.6} />
    ))}
  </Svg>
);

/** Temperature inversion: warm lid trapping smoke over a city. */
export const Inversion: React.FC<P> = ({ size, f }) => (
  <Svg vb="0 0 420 360" size={size}>
    <rect x="0" y="0" width="420" height="120" fill="#F2A65A" opacity={0.35} />
    <text x="210" y="70" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="26" fill={C.cream}>GARAM HAWA · LID</text>
    <line x1="0" y1="120" x2="420" y2="120" stroke="#F08A24" strokeWidth={8} strokeDasharray="20 12" />
    <rect x="0" y="120" width="420" height="200" fill="#5B6B86" opacity={0.3} />
    {new Array(10).fill(0).map((_, i) => {
      const y = 300 - ((f * 2 + i * 23) % 170);
      return <circle key={i} cx={40 + i * 38} cy={Math.max(y, 140)} r={18} fill="#9A9488" opacity={0.75} />;
    })}
    <text x="210" y="350" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="26" fill={C.cream}>THANDI HAWA · SMOKE NEECHE</text>
  </Svg>
);

/** Cut-away diya showing oil climbing the wick. */
export const Wick: React.FC<P> = ({ size, f }) => {
  const climb = (f % 40) / 40;
  return (
    <Svg vb="0 0 400 320" size={size}>
      <path d="M40 150 C 60 290, 340 290, 360 150 Z" fill="#B8602E" stroke={INK} strokeWidth={7} />
      <path d="M70 170 C 90 250, 310 250, 330 170 Z" fill="#E8B53A" opacity={0.9} />
      <path d="M170 230 C 200 200, 230 160, 270 90" fill="none" stroke="#F6EEDC" strokeWidth={18} strokeLinecap="round" />
      <path d="M170 230 C 200 200, 230 160, 270 90" fill="none" stroke={INK} strokeWidth={3} strokeDasharray="6 8" />
      {[0, 1, 2, 3].map((i) => {
        const t = (climb + i / 4) % 1;
        return <circle key={i} cx={170 + 100 * t} cy={230 - 140 * t + Math.sin(t * 3) * 6} r={8} fill="#C98A00" stroke={INK} strokeWidth={2} />;
      })}
      <path d={`M270 88 C ${250 + flick(f) * 4} 60, 262 30, ${272 + flick(f, 1) * 5} 0 C 286 30, 294 60, 270 88 Z`} fill="#FFB23F" />
    </Svg>
  );
};

/** Hammer beating a silver sheet. */
export const Varq: React.FC<P> = ({ size, f }) => {
  const hit = Math.abs(Math.sin(f / 5));
  return (
    <Svg vb="0 0 420 340" size={size}>
      <rect x="40" y="230" width="340" height="40" rx="8" fill="#6B4A2A" stroke={INK} strokeWidth={6} />
      <rect x="90" y="214" width="240" height="18" rx="4" fill="#E6E9EE" stroke={INK} strokeWidth={4} />
      <path d="M100 216 L 320 216" stroke="#FFFFFF" strokeWidth={4} opacity={0.8} />
      <g transform={`rotate(${-30 + hit * 30} 330 120)`}>
        <rect x="170" y="80" width="120" height="70" rx="10" fill="#7A7F8C" stroke={INK} strokeWidth={6} />
        <rect x="285" y="102" width="130" height="26" rx="12" fill="#B07A44" stroke={INK} strokeWidth={5} />
      </g>
    </Svg>
  );
};

export const KajuKatli: React.FC<P> = ({ size }) => (
  <Svg vb="0 0 300 220" size={size}>
    {[[150, 60], [80, 130], [220, 130]].map(([x, y], i) => (
      <g key={i}>
        <path d={`M${x} ${y - 50} L ${x + 70} ${y} L ${x} ${y + 50} L ${x - 70} ${y} Z`} fill="#F1E2C4" stroke={INK} strokeWidth={6} />
        <path d={`M${x - 50} ${y} L ${x} ${y - 36} L ${x + 50} ${y} L ${x} ${y + 36} Z`} fill="#E6E9EE" opacity={0.9} />
      </g>
    ))}
  </Svg>
);

export const SoanPapdi: React.FC<P> = ({ size }) => (
  <Svg vb="0 0 300 240" size={size}>
    <path d="M40 90 L 150 50 L 260 90 L 150 130 Z" fill="#F6E3B0" stroke={INK} strokeWidth={6} />
    <path d="M40 90 L 40 180 L 150 220 L 150 130 Z" fill="#E8C987" stroke={INK} strokeWidth={6} />
    <path d="M150 130 L 260 90 L 260 180 L 150 220 Z" fill="#D9B46A" stroke={INK} strokeWidth={6} />
    {new Array(7).fill(0).map((_, i) => (
      <path key={i} d={`M44 ${104 + i * 11} L 148 ${144 + i * 11}`} stroke="#B8924A" strokeWidth={2} />
    ))}
    {[100, 150, 200].map((x) => (
      <circle key={x} cx={x} cy={88} r={6} fill="#6E9A3A" />
    ))}
  </Svg>
);

export const Laddoo: React.FC<P> = ({ size }) => (
  <Svg vb="0 0 300 220" size={size}>
    <ellipse cx="150" cy="190" rx="140" ry="24" fill="#B8861E" stroke={INK} strokeWidth={5} />
    {[[90, 140], [210, 140], [150, 100]].map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r={52} fill="#F2A23A" stroke={INK} strokeWidth={6} />
        {new Array(10).fill(0).map((_, k) => (
          <circle key={k} cx={x + Math.cos(k) * 30} cy={y + Math.sin(k * 1.7) * 30} r={4} fill="#D9801A" />
        ))}
      </g>
    ))}
  </Svg>
);

/** Red bahi-khata ledger with "शुभ लाभ". */
export const Ledger: React.FC<P> = ({ size }) => (
  <Svg vb="0 0 300 360" size={size}>
    <rect x="40" y="20" width="220" height="320" rx="14" fill="#B5281C" stroke={INK} strokeWidth={7} />
    <rect x="40" y="20" width="34" height="320" fill="#8A1E14" stroke={INK} strokeWidth={5} />
    <rect x="100" y="70" width="130" height="220" rx="8" fill="none" stroke={GOLD} strokeWidth={6} />
    <text x="165" y="160" textAnchor="middle" fontFamily="Tiro Devanagari Hindi" fontSize="52" fill={GOLD}>शुभ</text>
    <text x="165" y="230" textAnchor="middle" fontFamily="Tiro Devanagari Hindi" fontSize="52" fill={GOLD}>लाभ</text>
  </Svg>
);

export const Chart: React.FC<P> = ({ size, f }) => {
  const pts = [20, 60, 40, 90, 70, 120, 100, 160, 140, 200];
  const n = Math.min(pts.length, 2 + Math.floor(f / 6));
  const path = pts.slice(0, n).map((y, i) => `${i ? "L" : "M"}${30 + i * 40} ${280 - y}`).join(" ");
  return (
    <Svg vb="0 0 420 320" size={size}>
      <rect x="10" y="10" width="400" height="300" rx="20" fill="#1E2433" stroke={INK} strokeWidth={6} />
      {[80, 150, 220].map((y) => (
        <line key={y} x1="30" y1={y} x2="390" y2={y} stroke="#3A4258" strokeWidth={3} />
      ))}
      <path d={path} fill="none" stroke="#5EC46A" strokeWidth={10} strokeLinejoin="round" strokeLinecap="round" />
      <text x="390" y="50" textAnchor="end" fontFamily="IBM Plex Mono" fontSize="26" fill="#5EC46A">▲ SENSEX</text>
    </Svg>
  );
};

export const Globe: React.FC<P> = ({ size, f, id }) => (
  <Svg vb="0 0 320 320" size={size}>
    <defs>
      <clipPath id={`${id}g`}>
        <circle cx="160" cy="160" r="140" />
      </clipPath>
    </defs>
    <circle cx="160" cy="160" r="140" fill="#3E7AA8" stroke={INK} strokeWidth={7} />
    <g clipPath={`url(#${id}g)`}>
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${((f * 1.5) % 320) - k * 320} 0)`}>
          <path d="M60 80 C 100 60, 140 90, 120 130 C 100 170, 60 150, 50 120 Z M180 120 C 220 100, 260 130, 250 180 C 240 230, 200 240, 190 200 C 180 170, 170 140, 180 120 Z M90 210 C 120 200, 140 230, 120 260 C 100 280, 80 250, 90 210 Z" fill="#6EAA4A" stroke={INK} strokeWidth={4} />
        </g>
      ))}
    </g>
    <ellipse cx="160" cy="160" rx="140" ry="50" fill="none" stroke="#F6EEDC" strokeWidth={3} opacity={0.4} />
    <line x1="20" y1="160" x2="300" y2="160" stroke="#F6EEDC" strokeWidth={3} opacity={0.4} />
  </Svg>
);

/** Night-lights photo: coloured dots in a frame, the viral "space photo". */
export const NightMap: React.FC<P & { fake?: boolean }> = ({ size, f, fake = true }) => (
  <Svg vb="0 0 400 400" size={size}>
    <rect x="10" y="10" width="380" height="380" rx="16" fill="#05070D" stroke={INK} strokeWidth={8} />
    {new Array(160).fill(0).map((_, i) => {
      const x = 40 + random(`nx${i}`) * 320;
      const y = 40 + random(`ny${i}`) * 320;
      const pal = ["#FFFFFF", "#7FD3FF", "#3BD16F", "#FF4FD8", "#FFB23F", "#FF4A3A"];
      const c = fake ? pal[i % pal.length] : "#FFD98A";
      return <circle key={i} cx={x} cy={y} r={1.5 + random(`nr${i}`) * (fake ? 4 : 2)} fill={c} opacity={fake ? 0.95 : 0.4 + 0.3 * Math.sin(f / 10 + i)} />;
    })}
  </Svg>
);

export const Satellite: React.FC<P> = ({ size, f }) => (
  <Svg vb="0 0 400 260" size={size}>
    <g transform={`rotate(${Math.sin(f / 20) * 6} 200 130)`}>
      <rect x="20" y="100" width="120" height="60" fill="#3B6EA8" stroke={INK} strokeWidth={6} />
      <rect x="260" y="100" width="120" height="60" fill="#3B6EA8" stroke={INK} strokeWidth={6} />
      {[50, 80, 110, 290, 320, 350].map((x) => (
        <line key={x} x1={x} y1="100" x2={x} y2="160" stroke={INK} strokeWidth={3} />
      ))}
      <rect x="150" y="80" width="100" height="100" rx="12" fill="#C9CED8" stroke={INK} strokeWidth={6} />
      <line x1="140" y1="130" x2="150" y2="130" stroke={INK} strokeWidth={6} />
      <line x1="250" y1="130" x2="260" y2="130" stroke={INK} strokeWidth={6} />
      <circle cx="200" cy="200" r={18} fill="#7A7F8C" stroke={INK} strokeWidth={5} />
    </g>
  </Svg>
);

export const Dog: React.FC<P> = ({ size, f }) => {
  const wag = Math.sin(f / 3) * 20;
  return (
    <Svg vb="0 0 360 300" size={size}>
      <path d={`M300 150 q 40 ${-30 + wag} 40 ${-70 + wag}`} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
      <path d={`M300 150 q 40 ${-30 + wag} 40 ${-70 + wag}`} fill="none" stroke="#C99A5A" strokeWidth={12} strokeLinecap="round" />
      <ellipse cx="220" cy="180" rx="100" ry="60" fill="#C99A5A" stroke={INK} strokeWidth={7} />
      {[150, 190, 250, 290].map((x) => (
        <rect key={x} x={x - 14} y={200} width="28" height="80" rx="12" fill="#C99A5A" stroke={INK} strokeWidth={6} />
      ))}
      <circle cx="110" cy="120" r={64} fill="#C99A5A" stroke={INK} strokeWidth={7} />
      <path d="M60 80 C 40 120, 50 160, 70 150 Z M150 70 C 175 100, 175 140, 160 140 Z" fill="#8A6A3A" stroke={INK} strokeWidth={5} />
      <circle cx="90" cy="115" r={8} fill={INK} />
      <circle cx="132" cy="115" r={8} fill={INK} />
      <ellipse cx="110" cy="150" rx="14" ry="10" fill={INK} />
      {/* marigold mala */}
      {new Array(9).fill(0).map((_, i) => (
        <circle key={i} cx={70 + i * 11} cy={188 + Math.sin((i / 8) * Math.PI) * 18} r={10} fill={i % 2 ? "#FF8A1F" : "#FFC21F"} stroke={INK} strokeWidth={2} />
      ))}
      <circle cx="110" cy="70" r={10} fill="#D9412B" />
    </Svg>
  );
};

export const Dice: React.FC<P> = ({ size, f }) => {
  const r = Math.sin(f / 8) * 8;
  const face = (x: number, y: number, n: number, rot: number) => {
    const pips: Record<number, [number, number][]> = {
      3: [[-28, -28], [0, 0], [28, 28]],
      5: [[-28, -28], [28, -28], [0, 0], [-28, 28], [28, 28]],
      6: [[-28, -30], [28, -30], [-28, 0], [28, 0], [-28, 30], [28, 30]],
    };
    return (
      <g transform={`translate(${x} ${y}) rotate(${rot})`}>
        <rect x="-60" y="-60" width="120" height="120" rx="20" fill="#F6EEDC" stroke={INK} strokeWidth={7} />
        {pips[n].map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={10} fill={n === 6 ? C.red : INK} />
        ))}
      </g>
    );
  };
  return (
    <Svg vb="0 0 360 220" size={size}>
      {face(110, 110, 6, -12 + r)}
      {face(250, 115, 5, 14 - r)}
    </Svg>
  );
};

/** Sudarshan chakra, spinning. */
export const Chakra: React.FC<P> = ({ size, f }) => (
  <Svg vb="0 0 300 300" size={size}>
    <g transform={`rotate(${f * 9} 150 150)`}>
      {new Array(16).fill(0).map((_, i) => (
        <path key={i} d="M150 10 L 166 60 L 134 60 Z" fill={GOLD} stroke={INK} strokeWidth={4} transform={`rotate(${i * 22.5} 150 150)`} />
      ))}
      <circle cx="150" cy="150" r="92" fill="#F2C75A" stroke={INK} strokeWidth={7} />
      <circle cx="150" cy="150" r="58" fill="none" stroke={INK} strokeWidth={5} />
      {new Array(8).fill(0).map((_, i) => (
        <line key={i} x1="150" y1="150" x2={150 + Math.cos((i * Math.PI) / 4) * 58} y2={150 + Math.sin((i * Math.PI) / 4) * 58} stroke={INK} strokeWidth={5} />
      ))}
      <circle cx="150" cy="150" r="16" fill={C.red} stroke={INK} strokeWidth={4} />
    </g>
  </Svg>
);

/** Bowl of ubtan paste. */
export const Ubtan: React.FC<P> = ({ size }) => (
  <Svg vb="0 0 320 220" size={size}>
    <path d="M20 90 C 30 200, 290 200, 300 90 Z" fill="#9A6A3A" stroke={INK} strokeWidth={7} />
    <ellipse cx="160" cy="90" rx="140" ry="28" fill="#E8B04A" stroke={INK} strokeWidth={6} />
    <path d="M100 86 C 130 70, 190 104, 220 84" fill="none" stroke="#C98A20" strokeWidth={8} strokeLinecap="round" />
    <rect x="200" y="0" width="16" height="96" rx="8" fill="#C9A06A" stroke={INK} strokeWidth={4} transform="rotate(24 208 48)" />
  </Svg>
);

/** Sun rising over a horizon; `rise` 0..1. */
export const Sunrise: React.FC<P & { rise?: number }> = ({ size, rise = 0.5 }) => (
  <Svg vb="0 0 400 260" size={size}>
    <rect x="0" y="0" width="400" height="200" rx="12" fill={rise > 0.5 ? "#F6C27A" : "#2A3550"} />
    <circle cx="200" cy={230 - rise * 120} r={60} fill="#FFB23F" stroke={INK} strokeWidth={6} />
    {new Array(10).fill(0).map((_, i) => (
      <circle key={i} cx={30 + i * 38} cy={30 + (i % 3) * 22} r={3} fill="#FFFFFF" opacity={1 - rise} />
    ))}
    <rect x="0" y="200" width="400" height="60" fill="#4E7A3A" stroke={INK} strokeWidth={6} />
  </Svg>
);

/** Fort gate with a broken chain (Bandi Chhor). */
export const Fort: React.FC<P & { open?: number }> = ({ size, open = 1 }) => (
  <Svg vb="0 0 400 340" size={size}>
    <rect x="20" y="80" width="360" height="250" fill="#C9A06A" stroke={INK} strokeWidth={7} />
    {new Array(9).fill(0).map((_, i) => (
      <rect key={i} x={20 + i * 40} y={50} width="24" height="34" fill="#C9A06A" stroke={INK} strokeWidth={5} />
    ))}
    <path d="M130 330 L 130 200 C 130 140, 270 140, 270 200 L 270 330 Z" fill="#1A120C" stroke={INK} strokeWidth={6} />
    <rect x={130 - 70 * open} y="200" width="70" height="130" fill="#6B4A2A" stroke={INK} strokeWidth={5} />
    <rect x={200 + 70 * open} y="200" width="70" height="130" fill="#6B4A2A" stroke={INK} strokeWidth={5} />
    {/* broken chain */}
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={160 + i * 26 - open * 30} cy={260 + open * i * 10} rx={14} ry={9} fill="none" stroke="#9AA0B3" strokeWidth={6} />
    ))}
    {[0, 1, 2].map((i) => (
      <ellipse key={`b${i}`} cx={190 + i * 26 + open * 40} cy={260 + open * (2 - i) * 10} rx={14} ry={9} fill="none" stroke="#9AA0B3" strokeWidth={6} />
    ))}
  </Svg>
);

/** Bow and arrow (Ram's return). */
export const Bow: React.FC<P> = ({ size }) => (
  <Svg vb="0 0 300 360" size={size}>
    <path d="M90 20 C 260 100, 260 260, 90 340" fill="none" stroke="#8A5A2A" strokeWidth={16} strokeLinecap="round" />
    <path d="M90 20 C 260 100, 260 260, 90 340" fill="none" stroke={INK} strokeWidth={4} />
    <line x1="90" y1="20" x2="90" y2="340" stroke="#F6EEDC" strokeWidth={4} />
    <line x1="40" y1="180" x2="270" y2="180" stroke="#6B4A2A" strokeWidth={8} />
    <path d="M270 180 L 240 164 L 240 196 Z" fill="#9AA0B3" stroke={INK} strokeWidth={4} />
    <path d="M40 180 l -20 -16 M40 180 l -20 16 M54 180 l -20 -16 M54 180 l -20 16" stroke={C.red} strokeWidth={5} />
  </Svg>
);

/** Kali Puja: a red hibiscus. */
export const Hibiscus: React.FC<P> = ({ size, f }) => (
  <Svg vb="0 0 300 300" size={size}>
    <g transform={`rotate(${f * 0.5} 150 150)`}>
      {new Array(5).fill(0).map((_, i) => (
        <path key={i} d="M150 150 C 100 100, 110 30, 150 20 C 190 30, 200 100, 150 150 Z" fill="#D9232B" stroke={INK} strokeWidth={5} transform={`rotate(${i * 72} 150 150)`} />
      ))}
    </g>
    <line x1="150" y1="150" x2="200" y2="80" stroke="#FFD24A" strokeWidth={6} />
    <circle cx="200" cy="80" r={10} fill="#FFD24A" stroke={INK} strokeWidth={3} />
    <circle cx="150" cy="150" r={16} fill="#8A1A1A" />
  </Svg>
);

/** Plain map pin with a label text, used for Pawapuri etc. */
export const Pin: React.FC<P & { color?: string }> = ({ size, color = C.red }) => (
  <Svg vb="0 0 200 280" size={size}>
    <ellipse cx="100" cy="262" rx="50" ry="12" fill="rgba(0,0,0,0.25)" />
    <path d="M100 260 C 60 190, 20 150, 20 100 A 80 80 0 0 1 180 100 C 180 150, 140 190, 100 260 Z" fill={color} stroke={INK} strokeWidth={7} />
    <circle cx="100" cy="100" r={30} fill="#F6EEDC" stroke={INK} strokeWidth={5} />
  </Svg>
);

/** Bhai Dooj thali: diya, roli, rice, sweet. */
export const Thali: React.FC<P> = ({ size, f, id }) => (
  <Svg vb="0 0 420 260" size={size}>
    <ellipse cx="210" cy="170" rx="200" ry="70" fill="#B8861E" stroke={INK} strokeWidth={7} />
    <ellipse cx="210" cy="160" rx="170" ry="54" fill={GOLD} stroke={INK} strokeWidth={5} />
    <circle cx="120" cy="150" r={30} fill="#D9232B" stroke={INK} strokeWidth={4} />
    <circle cx="200" cy="170" r={30} fill="#F6EEDC" stroke={INK} strokeWidth={4} />
    <circle cx="290" cy="150" r={26} fill="#F2A23A" stroke={INK} strokeWidth={4} />
    <g transform="translate(150 40) scale(0.55)">
      <Diya id={`${id}d`} size={240} flicker={flick(f)} />
    </g>
  </Svg>
);

/** Mosquito/mould: damp wall with spots. */
export const Damp: React.FC<P> = ({ size, f }) => (
  <Svg vb="0 0 400 300" size={size}>
    <rect x="10" y="10" width="380" height="280" rx="10" fill="#E6DCC4" stroke={INK} strokeWidth={6} />
    {new Array(22).fill(0).map((_, i) => (
      <circle key={i} cx={40 + random(`mx${i}`) * 320} cy={180 + random(`my${i}`) * 100} r={6 + random(`mr${i}`) * 18} fill="#5E6A3A" opacity={0.5} />
    ))}
    <path d="M10 160 C 120 140, 260 180, 390 150" fill="none" stroke="#8A7A5A" strokeWidth={4} strokeDasharray="10 8" />
    <text x="200" y="80" textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="26" fill="#6b6052">
      {"SEELAN · " + (Math.floor(f / 15) % 2 ? "FUNGUS" : "KEEDE")}
    </text>
  </Svg>
);

export const Heart: React.FC<P> = ({ size, f }) => {
  const t = (f % 30) / 30;
  const s = t < 0.12 ? 1 + t : t < 0.24 ? 1.12 - (t - 0.12) : 1;
  return (
    <div style={{ transform: `scale(${s})` }}>
      <Svg vb="0 0 440 400" size={size}>
        <path d="M220 370 C 40 250, 10 140, 60 80 C 110 20, 190 40, 220 110 C 250 40, 330 20, 380 80 C 430 140, 400 250, 220 370 Z" fill="#D9412B" stroke={INK} strokeWidth={10} />
      </Svg>
    </div>
  );
};

/** Row of n lit diyas. */
export const Diyas: React.FC<P & { n?: number }> = ({ size, f, id, n = 5 }) => (
  <div style={{ display: "flex", gap: size * 0.04 }}>
    {new Array(n).fill(0).map((_, i) => (
      <Diya key={i} id={`${id}${i}`} size={size / (n + 0.5)} flicker={flick(f, i * 1.7)} />
    ))}
  </div>
);

export const EmojiBadge: React.FC<{ size: number; char: string; dark?: boolean }> = ({ size, char }) => (
  <div
    style={{
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.72,
      lineHeight: 1,
      filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.35))",
      fontFamily: "Noto Color Emoji",
    }}
  >
    {char}
  </div>
);

export type ArtName = keyof typeof ART;

export const ART = {
  diya: (p: P) => <Diya id={p.id} size={p.size} flicker={flick(p.f)} />,
  diyaOff: (p: P) => <Diya id={p.id} size={p.size} lit={0} />,
  diyas: (p: P) => <Diyas {...p} />,
  kalash: (p: P) => <Kalash id={p.id} size={p.size} glow={0.5} />,
  coins: (p: P) => <Coins size={p.size} />,
  bartan: (p: P) => <Bartan id={p.id} size={p.size} shine={Math.max(0, Math.sin(p.f / 10))} />,
  snake: (p: P) => <Snake size={p.size} />,
  jhadu: (p: P) => <Jhadu size={p.size} style={{ transform: "rotate(14deg)" }} />,
  lotus: (p: P) => <Lotus size={p.size} />,
  pepper: (p: P) => <Peppercorns size={p.size} />,
  owl: (p: P) => <Owl {...p} />,
  mountain: (p: P) => <Mountain {...p} />,
  rocket: (p: P) => <Rocket {...p} />,
  anar: (p: P) => <Anar {...p} />,
  red: (p: P) => <Burst {...p} color="#FF3B3B" />,
  green: (p: P) => <Burst {...p} color="#3BE36A" />,
  blue: (p: P) => <Burst {...p} color="#3B8BFF" />,
  yellow: (p: P) => <Burst {...p} color="#FFC83B" />,
  white: (p: P) => <Burst {...p} color="#F4F4F4" />,
  smog: (p: P) => <Smog {...p} />,
  field: (p: P) => <Field {...p} />,
  inversion: (p: P) => <Inversion {...p} />,
  wick: (p: P) => <Wick {...p} />,
  varq: (p: P) => <Varq {...p} />,
  kaju: (p: P) => <KajuKatli {...p} />,
  soan: (p: P) => <SoanPapdi {...p} />,
  laddoo: (p: P) => <Laddoo {...p} />,
  ledger: (p: P) => <Ledger {...p} />,
  chart: (p: P) => <Chart {...p} />,
  globe: (p: P) => <Globe {...p} />,
  nightFake: (p: P) => <NightMap {...p} />,
  nightReal: (p: P) => <NightMap {...p} fake={false} />,
  satellite: (p: P) => <Satellite {...p} />,
  dog: (p: P) => <Dog {...p} />,
  dice: (p: P) => <Dice {...p} />,
  chakra: (p: P) => <Chakra {...p} />,
  ubtan: (p: P) => <Ubtan {...p} />,
  dawn: (p: P) => <Sunrise {...p} rise={0.25} />,
  sunrise: (p: P) => <Sunrise {...p} rise={0.9} />,
  fort: (p: P) => <Fort {...p} open={Math.min(1, p.f / 40)} />,
  bow: (p: P) => <Bow {...p} />,
  hibiscus: (p: P) => <Hibiscus {...p} />,
  pin: (p: P) => <Pin {...p} />,
  thali: (p: P) => <Thali {...p} />,
  damp: (p: P) => <Damp {...p} />,
  heart: (p: P) => <Heart {...p} />,
};

/** Render art by name, or "emoji:X" as an emoji badge. */
export const renderArt = (name: string, size: number, f: number, id: string) => {
  if (name.startsWith("emoji:")) return <EmojiBadge size={size} char={name.slice(6)} />;
  const fn = (ART as Record<string, (p: P) => React.ReactNode>)[name];
  if (!fn) throw new Error(`unknown art: ${name}`);
  return fn({ size, f, id });
};
