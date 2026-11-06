import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, DEVA, HEAD, MONO } from "./theme";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** Spring that starts at `delay` frames into the scene. */
export const useEnter = (delay = 0, config = { damping: 14, stiffness: 160 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

/** Frame for a cue given as a fraction of the scene's length. */
export const useCue = () => {
  const { durationInFrames } = useVideoConfig();
  return (fraction: number) => Math.round(fraction * durationInFrames);
};

// ---------------------------------------------------------------------------
// Backgrounds

const Grain: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "overlay" }}>
    <svg width="100%" height="100%">
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);

export const DarkBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 90% 60% at 50% 45%, ${C.slate2} 0%, ${C.slate} 70%)`,
    }}
  >
    <Grain opacity={0.18} />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)",
      }}
    />
  </AbsoluteFill>
);

export const PaperBg: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.paper }}>
    {/* lab-notebook grid */}
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(rgba(42,36,32,0.06) 2px, transparent 2px),
          linear-gradient(90deg, rgba(42,36,32,0.06) 2px, transparent 2px)`,
        backgroundSize: "54px 54px",
      }}
    />
    <Grain opacity={0.25} />
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0,0,0,0) 65%, rgba(90,60,20,0.18) 100%)",
      }}
    />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Header strip: "KITCHEN · FIG. 01 ............ TEARS LAB"

export const Header: React.FC<{ left: string; right: string; dark: boolean }> = ({
  left,
  right,
  dark,
}) => {
  const enter = useEnter(0);
  const color = dark ? "rgba(243,235,221,0.6)" : "rgba(42,36,32,0.6)";
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: 70,
        right: 70,
        opacity: enter,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: MONO,
          fontSize: 24,
          letterSpacing: 4,
          color,
        }}
      >
        <span>{left}</span>
        <span>{right}</span>
      </div>
      <div
        style={{
          marginTop: 14,
          height: 2,
          background: color,
          transformOrigin: "left",
          transform: `scaleX(${enter})`,
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Two-line headline: small setup line, then a big punch line a beat later.

export const Headline: React.FC<{
  setup: string;
  punch: string;
  dark: boolean;
  punchColor?: string;
  punchAt?: number; // frames after setup
  delay?: number;
  punchSize?: number;
}> = ({ setup, punch, dark, punchColor, punchAt = 8, delay = 4, punchSize = 118 }) => {
  const a = useEnter(delay);
  const b = useEnter(delay + punchAt, { damping: 13, stiffness: 150 });
  const frame = useCurrentFrame();
  const settle = interpolate(frame, [delay + punchAt, delay + punchAt + 14], [0, 1], clamp);
  const accent = punchColor ?? (dark ? C.orange : C.rust);
  return (
    <div style={{ position: "absolute", top: 222, left: 70, right: 70 }}>
      <div
        style={{
          fontFamily: HEAD,
          fontWeight: 500,
          fontSize: 58,
          letterSpacing: 1,
          color: dark ? C.cream : C.ink,
          opacity: a,
          transform: `translateY(${(1 - a) * 30}px)`,
          textTransform: "uppercase",
        }}
      >
        {setup}
      </div>
      <div
        style={{
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: punchSize,
          lineHeight: 1.02,
          color: settle < 1 ? mix(dark ? "#5b5f70" : "#b9ad95", accent, settle) : accent,
          opacity: b,
          transform: `translateY(${(1 - b) * 40}px)`,
          textTransform: "uppercase",
          marginTop: 4,
        }}
      >
        {punch}
      </div>
    </div>
  );
};

/** Linear blend between two #rrggbb colours. */
export const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const pc = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${pc.join(",")})`;
};

// ---------------------------------------------------------------------------
// Torn-edge paper card that drops in tilted and settles.

const deckle = (seed: string, teeth = 46, depth = 1.1) => {
  const pts: string[] = [];
  const edge = (i: number, n: number) => (i / n) * 100;
  for (let i = 0; i <= teeth; i++)
    pts.push(`${edge(i, teeth)}% ${random(`${seed}t${i}`) * depth}%`);
  for (let i = 0; i <= teeth; i++)
    pts.push(`${100 - random(`${seed}r${i}`) * depth}% ${edge(i, teeth)}%`);
  for (let i = teeth; i >= 0; i--)
    pts.push(`${edge(i, teeth)}% ${100 - random(`${seed}b${i}`) * depth}%`);
  for (let i = teeth; i >= 0; i--)
    pts.push(`${random(`${seed}l${i}`) * depth}% ${edge(i, teeth)}%`);
  return `polygon(${pts.join(",")})`;
};

export const PaperCard: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  delay?: number;
  rotate?: number;
  caption?: string;
  label?: string;
  seed?: string;
  dim?: number; // 0..1 darken for "inactive" cards
  children: React.ReactNode;
}> = ({ x, y, w, h, delay = 0, rotate = -3, caption, label, seed = "card", dim = 0, children }) => {
  const e = useEnter(delay, { damping: 13, stiffness: 120 });
  const capH = caption || label ? 86 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: interpolate(e, [0, 0.25], [0, 1], clamp),
        transform: `translateY(${(1 - e) * -90}px) rotate(${rotate + (1 - e) * -9}deg) scale(${
          1.06 - 0.06 * e
        })`,
        filter: `drop-shadow(0 18px 30px rgba(0,0,0,0.38)) brightness(${1 - dim * 0.45})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#F6EEDC",
          clipPath: deckle(seed),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 26,
            right: 26,
            top: 26,
            bottom: 26 + capH,
            background: "#EADFC5",
            overflow: "hidden",
            borderRadius: 4,
          }}
        >
          {children}
        </div>
        {capH > 0 && (
          <div
            style={{
              position: "absolute",
              left: 34,
              right: 34,
              bottom: 26,
              height: capH,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontFamily: DEVA, fontSize: 46, color: C.ink }}>{caption}</span>
            <span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#6b6052" }}>
              {label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Rubber stamp that slams down.

export const Stamp: React.FC<{
  text: string;
  x: number;
  y: number;
  at: number;
  color?: string;
  rotate?: number;
  size?: number;
  /** "multiply" reads as ink on paper; use "normal" on dark scenes. */
  blend?: "multiply" | "normal";
}> = ({ text, x, y, at, color = C.red, rotate = -9, size = 74, blend = "multiply" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < at) return null;
  const s = spring({ frame: frame - at, fps, config: { damping: 11, stiffness: 260, mass: 0.6 } });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rotate}deg) scale(${2.4 - 1.4 * s})`,
        opacity: interpolate(s, [0, 0.35], [0, 0.92], clamp),
        border: `7px solid ${color}`,
        borderRadius: 10,
        padding: "6px 26px",
        fontFamily: HEAD,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: 3,
        color,
        whiteSpace: "nowrap",
        mixBlendMode: blend,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Small rounded pill label, e.g. "NATURE · 2002".

export const Pill: React.FC<{
  text: string;
  x: number;
  y: number;
  delay?: number;
  dark?: boolean;
  accent?: boolean;
}> = ({ text, x, y, delay = 0, dark = false, accent = false }) => {
  const e = useEnter(delay);
  const fg = accent ? C.orange : dark ? C.cream : C.ink;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        opacity: e,
        transform: `translateY(${(1 - e) * 16}px)`,
        border: `2px solid ${fg}`,
        color: fg,
        borderRadius: 999,
        padding: "8px 22px",
        fontFamily: MONO,
        fontSize: 24,
        letterSpacing: 3,
        whiteSpace: "nowrap",
        background: accent ? "rgba(240,138,36,0.12)" : "transparent",
      }}
    >
      {text}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Rising orange vapour: soft blurred puffs drifting from (x,y) toward (tx,ty).

export const Vapor: React.FC<{
  x: number;
  y: number;
  tx: number;
  ty: number;
  start: number;
  count?: number;
  life?: number;
  spread?: number;
  size?: number;
  color?: string;
}> = ({ x, y, tx, ty, start, count = 26, life = 70, spread = 60, size = 70, color = C.orange }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const born = start + Math.floor(random(`v${i}`) * life);
        const age = (frame - born) % life;
        if (frame < born) return null;
        const t = age / life;
        const wobble = Math.sin(t * 6 + i) * spread * 0.5;
        const px = x + (tx - x) * t + (random(`vx${i}`) - 0.5) * spread + wobble;
        const py = y + (ty - y) * Easing.out(Easing.quad)(t) + (random(`vy${i}`) - 0.5) * spread * 0.4;
        const s = size * (0.5 + random(`vs${i}`) * 0.8) * (0.6 + t * 0.9);
        const o = Math.sin(Math.PI * t) * 0.55;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px - s / 2,
              top: py - s / 2,
              width: s,
              height: s,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${color} 0%, rgba(240,138,36,0) 70%)`,
              opacity: o,
              filter: "blur(6px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Typewriter text.

export const TypeOn: React.FC<{
  text: string;
  start: number;
  cps?: number; // characters per second
  style?: React.CSSProperties;
}> = ({ text, start, cps = 16, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = Math.max(0, Math.min(text.length, Math.floor(((frame - start) / fps) * cps)));
  const caret = frame >= start && Math.floor(frame / 8) % 2 === 0 && shown < text.length + 6;
  return (
    <span style={style}>
      {text.slice(0, shown)}
      <span style={{ opacity: caret ? 1 : 0 }}>▍</span>
    </span>
  );
};

// ---------------------------------------------------------------------------
// Count-up number.

export const CountUp: React.FC<{
  from: number;
  to: number;
  start: number;
  frames: number;
  style?: React.CSSProperties;
  format?: (n: number) => string;
}> = ({ from, to, start, frames, style, format = (n) => String(Math.round(n)) }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [start, start + frames], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  return <span style={style}>{format(from + (to - from) * t)}</span>;
};

/** Gentle constant float so illustrations never sit perfectly still. */
export const useFloat = (amp = 8, speed = 0.05, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin(frame * speed + phase) * amp;
};
