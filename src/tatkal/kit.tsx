import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { clamp, useEnter } from "../onion/components";
import { MONO } from "../onion/theme";

// Blueprint look for the system-design series: deep navy, a faint grid,
// yellow mono labels and a "THIS IS CALLED" card for each new idea.

export const BOLD = "Poppins";
loadFont({ family: BOLD, url: staticFile("fonts/Poppins-Bold.woff2"), weight: "700" });

export const K = {
  navy0: "#08112A",
  navy1: "#122453",
  panel: "#0D1B3E",
  line: "rgba(130,165,235,0.16)",
  edge: "#3C5A9E",
  yellow: "#FFC928",
  red: "#FF4D5E",
  green: "#3DDC97",
  pink: "#FF7AC6",
  white: "#EAF0FF",
  mute: "#7F93C2",
};

export const SERIES = "SYSTEM DESIGN";
export const EPISODE = "01";

export const BlueprintBg: React.FC<{ drift?: boolean }> = ({ drift = true }) => {
  const frame = useCurrentFrame();
  const off = drift ? (frame * 0.35) % 80 : 0;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 95% 70% at 50% 40%, ${K.navy1} 0%, ${K.navy0} 75%)` }}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${K.line} 2px, transparent 2px), linear-gradient(90deg, ${K.line} 2px, transparent 2px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: `${off}px ${off}px`,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.6) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Series line top-left plus an optional section label under it. */
export const Header: React.FC<{ section?: string }> = ({ section }) => {
  const e = useEnter(4);
  return (
    <>
      <div style={{ position: "absolute", left: 70, top: 96, fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: K.mute }}>
        {SERIES} · <span style={{ color: K.yellow }}>{EPISODE}</span>
      </div>
      {section && (
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 170,
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: MONO,
            fontSize: 28,
            letterSpacing: 4,
            color: K.yellow,
            opacity: e,
          }}
        >
          <div style={{ width: 46 * e, height: 3, background: K.yellow }} />
          {section}
        </div>
      )}
    </>
  );
};

/** Mono label in a dark box with a coloured edge. */
export const Tag: React.FC<{
  text: string;
  x: number;
  y: number;
  at?: number;
  color?: string;
  size?: number;
  center?: boolean;
  fill?: boolean;
}> = ({ text, x, y, at = 0, color = K.yellow, size = 30, center = false, fill = false }) => {
  const e = useEnter(at, { damping: 13, stiffness: 220 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${center ? "-50%" : "0"}, ${(1 - e) * 16}px) scale(${0.8 + 0.2 * e})`,
        transformOrigin: "center",
        opacity: e,
        padding: `${size * 0.22}px ${size * 0.5}px`,
        background: fill ? color : "rgba(8,17,42,0.92)",
        border: `3px solid ${color}`,
        color: fill ? K.navy0 : color,
        fontFamily: MONO,
        fontSize: size,
        letterSpacing: size * 0.08,
        whiteSpace: "nowrap",
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

/** The "THIS IS CALLED" reveal card for each concept. */
export const Called: React.FC<{ name: string; sub?: string; at: number; y?: number }> = ({ name, sub, at, y = 1420 }) => {
  const e = useEnter(at, { damping: 12, stiffness: 170 });
  const frame = useCurrentFrame();
  const shine = interpolate(frame - at, [6, 30], [-30, 130], clamp);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center" }}>
    <div
      style={{
        whiteSpace: "nowrap",
        transform: `scale(${0.6 + 0.4 * e})`,
        opacity: e,
        minWidth: 640,
        padding: "16px 46px 22px",
        background: `linear-gradient(105deg, ${K.navy0} ${shine - 8}%, #22355f ${shine}%, ${K.navy0} ${shine + 8}%)`,
        border: `4px solid ${K.yellow}`,
        borderRadius: 14,
        boxShadow: "0 18px 50px rgba(0,0,0,0.55), 0 0 40px rgba(255,201,40,0.18)",
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 6, color: K.mute }}>THIS IS CALLED</div>
      <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 70, color: K.yellow, lineHeight: 1.15 }}>{name}</div>
      {sub && <div style={{ fontFamily: MONO, fontSize: 26, color: K.white, opacity: 0.85, marginTop: 4 }}>{sub}</div>}
    </div>
    </div>
  );
};

/** Red rubber-stamp verdict. */
export const Stamp: React.FC<{ text: string; x: number; y: number; at: number; color?: string; rotate?: number; size?: number }> = ({
  text,
  x,
  y,
  at,
  color = K.red,
  rotate = -8,
  size = 64,
}) => {
  const e = useEnter(at, { damping: 9, stiffness: 260 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${2 - e})`,
        opacity: Math.min(1, e * 1.4),
        padding: "10px 30px",
        border: `7px solid ${color}`,
        borderRadius: 10,
        color,
        background: "rgba(8,17,42,0.85)",
        fontFamily: BOLD,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 2,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** Padlock glyph; `open` 0..1 lifts the shackle. */
export const Lock: React.FC<{ size: number; color: string; open?: number }> = ({ size, color, open = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <path
      d="M12 18 V12 a8 8 0 0 1 16 0 V18"
      fill="none"
      stroke={color}
      strokeWidth={4}
      transform={`translate(${open * 8} ${-open * 6})`}
    />
    <rect x="7" y="17" width="26" height="19" rx="4" fill={color} />
    <circle cx="20" cy="26" r="3" fill={K.navy0} />
  </svg>
);

/** Rounded phone outline with a screen slot for children. */
export const Phone: React.FC<{ x: number; y: number; w: number; h: number; children?: React.ReactNode }> = ({ x, y, w, h, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 54,
      border: `6px solid ${K.edge}`,
      background: "#0A1633",
      boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", left: "50%", top: 18, width: 110, height: 18, marginLeft: -55, borderRadius: 9, background: K.edge }} />
    {children}
  </div>
);

export const inr = (n: number) => Math.round(n).toLocaleString("en-IN");
