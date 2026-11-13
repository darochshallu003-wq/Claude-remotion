import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { INK } from "../mitti/kraft";

// Props and skies for the Chhath short, in the flat ink-outline style of
// the kraft series.

export const SAFFRON = "#F08A24";
export const SINDOOR = "#D0312D";
export const GOLD = "#F2B63D";
export const BAMBOO = "#D9B26A";
export const BAMBOO_DARK = "#A9823F";
export const THEKUA = "#B9722F";
export const CANE = "#6E9A3A";
export const RIVER_DUSK = "#3B2A4E";
export const RIVER_DAWN = "#6E8FB0";

/** Sun disc with soft glow; `rays` adds a slow-turning ray ring. */
export const Sun: React.FC<{ size: number; color?: string; rays?: boolean; style?: React.CSSProperties }> = ({ size, color = "#FFB347", rays = false, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", width: size, height: size, ...style }}>
      <div style={{ position: "absolute", inset: -size * 0.6, borderRadius: "50%", background: `radial-gradient(circle, ${color}AA 0%, ${color}33 40%, transparent 70%)` }} />
      {rays && (
        <svg viewBox="-100 -100 200 200" width={size * 1.7} height={size * 1.7} style={{ position: "absolute", left: -size * 0.35, top: -size * 0.35, transform: `rotate(${frame * 0.4}deg)` }}>
          {new Array(16).fill(0).map((_, i) => (
            <path key={i} d="M-6 -66 L 0 -96 L 6 -66 Z" fill={color} stroke={INK} strokeWidth={2.5} transform={`rotate(${i * 22.5})`} />
          ))}
        </svg>
      )}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 40% 38%, #FFE7A8 0%, ${color} 60%, #E2672A 100%)`, border: rays ? `6px solid ${INK}` : "none" }} />
    </div>
  );
};

/**
 * A river scene: sky gradient, sun at (sunX, sunY), water from `waterTop`
 * down with a shimmering sun reflection. `mood` picks dusk or dawn colours.
 */
export const RiverSky: React.FC<{ sunY: number; waterTop?: number; mood?: "dusk" | "dawn"; sunSize?: number }> = ({ sunY, waterTop = 1180, mood = "dusk", sunSize = 300 }) => {
  const frame = useCurrentFrame();
  const sky =
    mood === "dusk"
      ? "linear-gradient(#2A1B3D 0%, #7A2E52 35%, #E0573A 62%, #F7A03C 78%)"
      : "linear-gradient(#22345A 0%, #5E6FA3 30%, #E59AA0 60%, #FFD08A 80%)";
  const water = mood === "dusk" ? RIVER_DUSK : RIVER_DAWN;
  const sunColor = mood === "dusk" ? "#FF8A3D" : "#FFC24A";
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: sky }} />
      <Sun size={sunSize} color={sunColor} style={{ left: 540 - sunSize / 2, top: sunY - sunSize / 2 }} />
      {/* far bank */}
      <div style={{ position: "absolute", left: 0, right: 0, top: waterTop - 40, height: 46, background: "#2A1A26", clipPath: "polygon(0 60%, 12% 30%, 25% 55%, 40% 25%, 55% 50%, 70% 20%, 85% 45%, 100% 30%, 100% 100%, 0 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: waterTop, bottom: 0, background: `linear-gradient(${water}, #1A1426)` }}>
        {/* sun's reflection: broken bands */}
        {new Array(14).fill(0).map((_, i) => {
          const w = (sunSize * 0.9) * (1 - i * 0.045) * (0.7 + 0.3 * Math.sin(frame / 7 + i));
          return (
            <div
              key={i}
              style={{ position: "absolute", left: 540 - w / 2 + Math.sin(frame / 11 + i * 2) * 14, top: 14 + i * 30, width: w, height: 8, borderRadius: 4, background: sunColor, opacity: interpolate(sunY, [waterTop - 300, waterTop + 100], [0.75, 0.15], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * (1 - i * 0.05) }}
            />
          );
        })}
        {/* ripples */}
        {new Array(10).fill(0).map((_, i) => (
          <div key={`r${i}`} style={{ position: "absolute", left: random(`rx${i}`) * 1000, top: 40 + random(`ry${i}`) * 600, width: 60 + random(`rw${i}`) * 80, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.18)", transform: `translateX(${Math.sin(frame / 15 + i) * 20}px)` }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** Bamboo soop (winnowing basket), wide end up. */
export const Soop: React.FC<{ width: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ width, style, children }) => (
  <div style={{ position: "relative", width, height: width * 0.62, ...style }}>
    <svg viewBox="0 0 300 186" width={width} height={width * 0.62} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <path d="M10 40 C 60 10, 240 10, 290 40 L 250 176 C 200 186, 100 186, 50 176 Z" fill={BAMBOO} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M${40 + i * 37} 30 L ${70 + i * 27} 178`} stroke={BAMBOO_DARK} strokeWidth={3} />
      ))}
      {[70, 110, 150].map((y) => (
        <path key={y} d={`M${25 + (y - 40) * 0.28} ${y} L ${275 - (y - 40) * 0.28} ${y}`} stroke={BAMBOO_DARK} strokeWidth={3} />
      ))}
      <path d="M10 40 C 60 10, 240 10, 290 40" fill="none" stroke={BAMBOO_DARK} strokeWidth={10} strokeLinecap="round" />
      <path d="M10 40 C 60 10, 240 10, 290 40" fill="none" stroke={INK} strokeWidth={3} />
    </svg>
    {children}
  </div>
);

/** Thekua: a round, ridged, deep-fried gur-and-atta biscuit. */
export const Thekua: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg viewBox="0 0 100 80" width={size} height={size * 0.8} style={{ overflow: "visible", ...style }}>
    <ellipse cx={50} cy={40} rx={46} ry={34} fill={THEKUA} stroke={INK} strokeWidth={5} />
    <ellipse cx={50} cy={40} rx={34} ry={24} fill="none" stroke="#7E4618" strokeWidth={3} />
    {[-2, -1, 0, 1, 2].map((i) => (
      <path key={i} d={`M50 40 L ${50 + i * 14} 18`} stroke="#7E4618" strokeWidth={3} strokeLinecap="round" />
    ))}
    <path d="M50 40 L 50 62" stroke="#7E4618" strokeWidth={3} />
  </svg>
);

/** Sugarcane stalk with a leafy top. */
export const Sugarcane: React.FC<{ height: number; style?: React.CSSProperties }> = ({ height, style }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 20) * 3;
  return (
    <svg viewBox="0 0 80 400" width={height * 0.2} height={height} style={{ overflow: "visible", transform: `rotate(${sway}deg)`, transformOrigin: "50% 100%", ...style }}>
      <path d="M40 120 C 0 60, -20 40, -30 0 M40 120 C 60 50, 90 30, 110 10 M40 120 C 30 60, 40 20, 50 -20" fill="none" stroke={CANE} strokeWidth={10} strokeLinecap="round" />
      <rect x={28} y={110} width={24} height={290} rx={8} fill="#7A3B5C" stroke={INK} strokeWidth={5} />
      {[160, 215, 270, 325].map((y) => (
        <line key={y} x1={28} y1={y} x2={52} y2={y} stroke={INK} strokeWidth={4} />
      ))}
    </svg>
  );
};

export const Banana: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg viewBox="0 0 120 70" width={size} height={size * 0.58} style={{ overflow: "visible", ...style }}>
    <path d="M6 20 C 30 66, 90 66, 114 22 C 96 44, 34 46, 6 20 Z" fill="#F6D24B" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M110 22 l 8 -10" stroke={INK} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

export const Coconut: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: "visible", ...style }}>
    <circle cx={50} cy={54} r={42} fill="#8A5A35" stroke={INK} strokeWidth={5} />
    {[0, 1, 2, 3, 4].map((i) => (
      <path key={i} d={`M${22 + i * 14} 24 C ${18 + i * 15} 50, ${22 + i * 14} 76, ${26 + i * 12} 92`} fill="none" stroke="#5E3B21" strokeWidth={3} />
    ))}
    <path d="M44 14 C 40 0, 34 -6, 24 -8 M52 14 C 56 0, 64 -6, 74 -8" fill="none" stroke={CANE} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

/** Clay diya with a flickering flame. */
export const Diya: React.FC<{ size: number; seed?: number; style?: React.CSSProperties }> = ({ size, seed = 0, style }) => {
  const frame = useCurrentFrame();
  const f = 1 + Math.sin(frame / 3 + seed * 2) * 0.08 + Math.sin(frame / 1.7 + seed) * 0.05;
  return (
    <svg viewBox="0 0 100 90" width={size} height={size * 0.9} style={{ overflow: "visible", ...style }}>
      <ellipse cx={50} cy={30} rx={38 * f} ry={38 * f} fill="#FFB347" opacity={0.25} />
      <path d={`M50 ${44 - 34 * f} C 62 22, 60 36, 50 46 C 40 36, 38 22, 50 ${44 - 34 * f} Z`} fill="#FFD23F" stroke="#E2672A" strokeWidth={3} />
      <path d="M6 50 C 20 88, 80 88, 94 50 C 70 58, 30 58, 6 50 Z" fill="#B5502A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M86 52 l 12 -8" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
};

/** Plate seen from the side with a mound of food on it. */
export const Thali: React.FC<{ size: number; kind: "kaddu" | "kheer"; style?: React.CSSProperties }> = ({ size, kind, style }) => (
  <svg viewBox="0 0 240 150" width={size} height={size * 0.625} style={{ overflow: "visible", ...style }}>
    <ellipse cx={120} cy={110} rx={116} ry={34} fill="#C9CDD2" stroke={INK} strokeWidth={5} />
    <ellipse cx={120} cy={104} rx={96} ry={24} fill="#E5E7EA" />
    {kind === "kaddu" ? (
      <>
        <path d="M40 104 C 50 60, 110 50, 130 100 Z" fill="#FBF7EE" stroke={INK} strokeWidth={4} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={58 + i * 18} cy={84 + (i % 2) * 8} r={3} fill="#E8DFC9" />
        ))}
        <path d="M128 104 C 136 74, 196 70, 204 102 Z" fill="#9DB65A" stroke={INK} strokeWidth={4} />
        <path d="M150 90 l 10 6 M172 84 l 6 10" stroke="#6E8A2A" strokeWidth={4} strokeLinecap="round" />
      </>
    ) : (
      <>
        {/* kheer bowl + roti */}
        <circle cx={168} cy={92} r={44} fill="#E9C9A0" stroke={INK} strokeWidth={4} />
        <circle cx={160} cy={84} r={6} fill="#C99A62" />
        <circle cx={180} cy={98} r={5} fill="#C99A62" />
        <path d="M34 98 C 34 50, 120 50, 120 98 Z" fill="#B5502A" stroke={INK} strokeWidth={5} />
        <ellipse cx={77} cy={74} rx={38} ry={10} fill="#C98B4E" stroke={INK} strokeWidth={3} />
      </>
    )}
  </svg>
);
