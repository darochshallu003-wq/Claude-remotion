import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { useEnter } from "../onion/components";
import { DEVA, MONO } from "../onion/theme";
import { RED } from "./art";

// Shared pieces of the "kraft paper" short format (petrichor, dahi, ...):
// warm brown paper, warm-black drama scenes, red label tags, speech bubbles.

export const INK = "#231F1C";

export const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.5 }) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

export const From: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (
  <Sequence from={at} layout="none">
    {children}
  </Sequence>
);

export const Grain: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "multiply" }}>
    <svg width="100%" height="100%">
      <filter id="kraftgrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={9} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.9 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#kraftgrain)" />
    </svg>
  </AbsoluteFill>
);

export const KraftBg: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #D3B386 0%, #C4A271 60%, #A9875A 100%)" }}>
    <Grain opacity={0.35} />
    {/* faint folds and ruled grid */}
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(rgba(60,40,20,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(60,40,20,0.07) 2px, transparent 2px)",
        backgroundSize: "120px 120px",
      }}
    />
    <AbsoluteFill style={{ background: "linear-gradient(115deg, transparent 48%, rgba(255,255,255,0.12) 50%, transparent 52%)" }} />
  </AbsoluteFill>
);

export const WarmDark: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2E2824 0%, #171412 75%)" }}>
    <Grain opacity={0.5} />
  </AbsoluteFill>
);

/** Red label tag with white mono text. */
export const Tag: React.FC<{ text: string; x: number; y: number; at: number; rotate?: number }> = ({ text, x, y, at, rotate = -2 }) => {
  const e = useEnter(at, { damping: 12, stiffness: 220 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "8px 18px",
        background: RED,
        color: "white",
        fontFamily: MONO,
        fontSize: 24,
        letterSpacing: 3,
        whiteSpace: "nowrap",
        transform: `rotate(${rotate}deg) scale(${e})`,
        transformOrigin: "left center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
      }}
    >
      {text}
    </div>
  );
};

/** Wavy scent lines drifting from (x0,y0) toward (x1,y1). */
export const ScentWisps: React.FC<{ x0: number; y0: number; x1: number; y1: number; start: number }> = ({ x0, y0, x1, y1, start }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1080} height={1920}>
      {[0, 1, 2].map((i) => {
        const t = ((frame - start + i * 14) % 42) / 42;
        const x = x0 + (x1 - x0) * t;
        const y = y0 + (y1 - y0) * t + (i - 1) * 26;
        return (
          <path
            key={i}
            d={`M${x - 50} ${y} q 12 -14 25 0 q 12 14 25 0 q 12 -14 25 0 q 12 14 25 0`}
            fill="none"
            stroke={RED}
            strokeWidth={6}
            strokeLinecap="round"
            opacity={Math.sin(Math.PI * t)}
          />
        );
      })}
    </svg>
  );
};

/** Comic speech bubble with Devanagari text. */
export const SpeechBubble: React.FC<{ text: string; x: number; y: number; at: number }> = ({ text, x, y, at }) => {
  const e = useEnter(at, { damping: 9, stiffness: 240 });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${e})`, transformOrigin: "left bottom" }}>
      <div style={{ padding: "10px 30px", borderRadius: 40, background: "white", border: `5px solid ${INK}`, fontFamily: DEVA, fontSize: 64, color: RED }}>{text}</div>
      <div style={{ position: "absolute", left: 30, bottom: -22, width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: `24px solid ${INK}` }} />
    </div>
  );
};

