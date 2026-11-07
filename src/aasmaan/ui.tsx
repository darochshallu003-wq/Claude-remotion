import React, { createContext, useContext } from "react";
import { spring, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

// Look of the step-style shorts: light dot-grid paper, ink-outlined sticker
// cards with hard offset shadows, a `// step` code-comment kicker, and one
// highlighted word per title.

export const BOLD = "Poppins";
export const MONO = "IBM Plex Mono";

loadFont({ family: BOLD, url: staticFile("fonts/Poppins-Bold.woff2"), weight: "700" });
loadFont({ family: MONO, url: staticFile("onion/fonts/plexmono-500-latin.woff2"), weight: "500" });

export const FPS = 30;

export const K = {
  paper: "#EEF0F5",
  dot: "#C8CCD8",
  ink: "#1D1D24",
  muted: "#A9ADBA",
  white: "#FFFFFF",
  orange: "#FF9F43",
  pink: "#FF4F7B",
  purple: "#7B5CFF",
  teal: "#1FA58C",
  yellow: "#FFD43B",
  sky: "#4EA8F5",
  skyDeep: "#2C6FD6",
  red: "#F0473C",
  violet: "#9B4DFF",
  sun: "#FFC83D",
};

/** Hard-shadow sticker card. */
export const Sticker: React.FC<{
  style?: React.CSSProperties;
  bg?: string;
  children?: React.ReactNode;
  shadow?: number;
}> = ({ style, bg = K.white, children, shadow = 9 }) => (
  <div
    style={{
      position: "absolute",
      background: bg,
      border: `5px solid ${K.ink}`,
      borderRadius: 26,
      boxShadow: `${shadow}px ${shadow}px 0 ${K.ink}`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Springy 0 → 1 that starts at local frame `from`. */
export const pop = (frame: number, from: number, damping = 11, stiffness = 170) =>
  spring({ frame: frame - from, fps: FPS, config: { damping, stiffness, mass: 0.7 } });

/** Transform for an element popping in with a little overshoot and tilt. */
export const popIn = (p: number, rot = 0): React.CSSProperties => ({
  transform: `scale(${0.3 + 0.7 * p}) rotate(${rot * (1 - p * 0.4)}deg)`,
  opacity: Math.min(1, p * 3),
});

/** "*word*" segments of a title or caption. */
export const segments = (text: string) =>
  text.split(/(\*[^*]+\*)/).filter(Boolean).map((s) => ({ hl: s.startsWith("*"), text: s.replace(/\*/g, "") }));

export type ChunkTiming = { start: number; end: number; words: number[][] };
export type BeatTiming = { seconds: number; chunks: ChunkTiming[] };

/** Timing of the beat a scene belongs to, in local frames. */
export const BeatContext = createContext<{ frames: number; chunks: ChunkTiming[] }>({ frames: 1, chunks: [] });

export const useBeat = () => {
  const b = useContext(BeatContext);
  /** Local frame at which chunk `i` starts being spoken (voice starts 4 frames in). */
  const at = (i: number) => 4 + Math.round((b.chunks[Math.min(i, b.chunks.length - 1)]?.start ?? 0) * FPS);
  return { ...b, at };
};
