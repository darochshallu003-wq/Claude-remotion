import React from "react";
import { useCurrentFrame } from "remotion";
import { INK } from "../mitti/kraft";
import { Person, PersonProps } from "../mitti/people";

export const SCRUBS = "#3E8E85";
export const SCRUBS_DARK = "#2C6A63";
export const HOSPITAL = "#5FA8C9";

/** Overlay drawn in Person's own 400x560 viewBox, moving with its breathing. */
const Overlay: React.FC<{ size: number; seed: number; children: React.ReactNode }> = ({ size, seed, children }) => {
  const frame = useCurrentFrame() + seed * 37;
  const breathe = Math.sin(frame / 18) * 3;
  return (
    <svg viewBox="0 0 400 560" width={size} height={(size * 560) / 400} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <g transform={`translate(0 ${breathe})`}>{children}</g>
    </svg>
  );
};

/** A person dressed as a surgeon: scrubs, cap, stethoscope, mask under the chin. */
export const SurgeonPerson: React.FC<PersonProps & { silhouette?: number }> = ({ silhouette = 0, ...p }) => {
  const seed = p.seed ?? 0;
  return (
    <div style={{ position: "relative", width: p.size, height: (p.size * 560) / 400, filter: silhouette > 0 ? `brightness(${1 - silhouette})` : undefined }}>
      <Person {...p} outfit={SCRUBS} dupatta={undefined} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} />
      <Overlay size={p.size} seed={seed}>
        {/* V-neck of the scrubs */}
        <path d="M168 340 L 200 392 L 232 340" fill="none" stroke={INK} strokeWidth={5} />
        <path d="M120 470 L 175 470 L 175 520 L 120 520 Z" fill={SCRUBS_DARK} stroke={INK} strokeWidth={4} />
        {/* stethoscope */}
        <path d="M160 345 C 140 420, 150 470, 200 480 C 250 470, 260 420, 240 345" fill="none" stroke="#2A2A2A" strokeWidth={8} strokeLinecap="round" />
        <circle cx="200" cy="486" r="16" fill="#C9CED4" stroke={INK} strokeWidth={5} />
        {/* mask pulled under the chin */}
        <path d="M150 288 C 170 320, 230 320, 250 288 L 244 270 C 220 292, 180 292, 156 270 Z" fill="#9FD3DE" stroke={INK} strokeWidth={4} />
        <path d="M150 284 L 122 228 M250 284 L 278 228" stroke="#E8F4F7" strokeWidth={4} />
        {/* surgical cap */}
        <path d="M116 168 C 104 92, 160 62, 205 64 C 255 66, 302 96, 284 168 C 270 150, 250 142, 200 140 C 150 142, 130 150, 116 168 Z" fill={SCRUBS} stroke={INK} strokeWidth={6} />
        <path d="M118 168 C 140 150, 170 146, 200 146 C 230 146, 262 150, 282 168" fill="none" stroke={SCRUBS_DARK} strokeWidth={8} />
        {[150, 200, 250].map((x) => (
          <circle key={x} cx={x} cy={102 + Math.abs(x - 200) * 0.25} r={6} fill="#FFFFFF" opacity={0.7} />
        ))}
      </Overlay>
    </div>
  );
};

/** Maa: the series' Mummy, as a surgeon. */
export const DrMaa: React.FC<Partial<PersonProps> & { size: number; silhouette?: number }> = (p) => (
  <SurgeonPerson skin="#A8704A" hair="bun" bindi expression="smile" seed={7} {...p} />
);

/** The boy. */
export const Beta: React.FC<Partial<PersonProps> & { size: number }> = (p) => (
  <Person skin="#A8704A" hair="short" outfit="#E3A52A" expression="neutral" seed={2} {...p} />
);

/** Flat side-view car. `crumple` (0..1) dents the bonnet. */
export const Car: React.FC<{ size: number; color?: string; crumple?: number; wheelSpin?: number }> = ({ size, color = "#C2272D", crumple = 0, wheelSpin = 0 }) => (
  <svg viewBox="0 0 420 200" width={size} height={(size * 200) / 420} style={{ overflow: "visible" }}>
    <path
      d={`M20 140 L 20 105 C 20 95, 30 90, 50 88 L 110 84 L 160 40 C 170 32, 180 30, 200 30 L 300 30 C 315 30, 325 36, 335 48 L 365 84 L ${395 - 40 * crumple} ${92 + 20 * crumple} C ${405 - 40 * crumple} 96, ${408 - 40 * crumple} 104, ${408 - 40 * crumple} 116 L ${408 - 40 * crumple} 140 Z`}
      fill={color}
      stroke={INK}
      strokeWidth={6}
      strokeLinejoin="round"
    />
    <path d="M125 84 L 168 46 L 240 46 L 240 84 Z" fill="#BFE3F0" stroke={INK} strokeWidth={5} />
    <path d="M255 84 L 255 46 L 300 46 C 310 46, 316 50, 322 58 L 342 84 Z" fill="#BFE3F0" stroke={INK} strokeWidth={5} />
    {crumple > 0.3 && <path d="M330 70 L 352 58 M338 92 L 362 100" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
    {[95, 320].map((x) => (
      <g key={x} transform={`rotate(${wheelSpin} ${x} 145)`}>
        <circle cx={x} cy={145} r={34} fill="#2A2A2A" stroke={INK} strokeWidth={6} />
        <circle cx={x} cy={145} r={13} fill="#C9CED4" />
        <path d={`M${x - 28} 145 L ${x + 28} 145`} stroke="#555" strokeWidth={4} />
      </g>
    ))}
  </svg>
);

export const Tree: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 200 320" width={size} height={(size * 320) / 200}>
    <rect x="82" y="170" width="36" height="150" fill="#7A4E2D" stroke={INK} strokeWidth={6} />
    <circle cx="100" cy="110" r="90" fill="#5E9A3A" stroke={INK} strokeWidth={6} />
    <circle cx="60" cy="90" r="20" fill="#7BB656" />
    <circle cx="130" cy="70" r="14" fill="#7BB656" />
  </svg>
);

/** Hospital bed seen from the side, with the boy lying in it. */
export const Bed: React.FC<{ width: number }> = ({ width }) => (
  <svg viewBox="0 0 520 260" width={width} height={(width * 260) / 520}>
    <rect x="20" y="130" width="480" height="40" rx="10" fill="#E8EEF5" stroke={INK} strokeWidth={6} />
    <rect x="20" y="40" width="20" height="210" fill="#C9CED4" stroke={INK} strokeWidth={5} />
    <rect x="480" y="90" width="20" height="160" fill="#C9CED4" stroke={INK} strokeWidth={5} />
    {/* boy: head + blanket */}
    <ellipse cx="100" cy="104" rx="46" ry="40" fill="#A8704A" stroke={INK} strokeWidth={5} />
    <path d="M58 96 C 60 60, 140 56, 144 96 C 130 80, 80 80, 58 96 Z" fill="#1B1513" stroke={INK} strokeWidth={4} />
    <path d="M84 108 C 90 114, 100 114, 106 108 M70 104 L 80 104" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
    <rect x="70" y="118" width="70" height="10" rx="5" fill="#FFFFFF" stroke={INK} strokeWidth={3} />
    <path d="M140 100 C 220 90, 400 92, 470 108 L 470 136 L 140 136 Z" fill={HOSPITAL} stroke={INK} strokeWidth={6} />
    <path d="M200 112 L 450 116" stroke="#FFFFFF" strokeWidth={4} opacity={0.5} />
  </svg>
);

/** Red-cross hospital sign. */
export const CrossSign: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <rect x="4" y="4" width="92" height="92" rx="16" fill="#FFFFFF" stroke={INK} strokeWidth={6} />
    <path d="M38 20 H62 V38 H80 V62 H62 V80 H38 V62 H20 V38 H38 Z" fill="#C2272D" />
  </svg>
);

/** Heartbeat monitor line that draws across. */
export const Ecg: React.FC<{ width: number; progress: number; color?: string }> = ({ width, progress, color = "#6BE38A" }) => (
  <svg viewBox="0 0 400 100" width={width} height={width / 4}>
    <rect x="0" y="0" width="400" height="100" rx="12" fill="#101412" stroke={INK} strokeWidth={6} />
    <path
      d="M10 55 L 90 55 L 105 30 L 120 80 L 135 15 L 150 55 L 230 55 L 245 30 L 260 80 L 275 15 L 290 55 L 390 55"
      fill="none"
      stroke={color}
      strokeWidth={5}
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
  </svg>
);

/** Marigold garland draped over a portrait frame. */
export const Garland: React.FC<{ width: number }> = ({ width }) => (
  <svg viewBox="0 0 300 120" width={width} height={(width * 120) / 300} style={{ overflow: "visible" }}>
    {new Array(15).fill(0).map((_, i) => {
      const t = i / 14;
      const x = 10 + t * 280;
      const y = 10 + Math.sin(Math.PI * t) * 90;
      return <circle key={i} cx={x} cy={y} r={13} fill={i % 2 ? "#F08A24" : "#FFC23F"} stroke={INK} strokeWidth={3} />;
    })}
  </svg>
);
