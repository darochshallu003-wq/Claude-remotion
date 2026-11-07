import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import type { Beat } from "../explainer/Explainer";
import { Person, PersonProps } from "../mitti/people";

// Look of the step-by-step whiteboard reel: warm graph paper, a heavy
// rounded display face, word-synced captions up top, a numbered step
// heading, infographic cards in the middle and the teacher bottom-right.

const FAMILY = "Baloo 2";
/** CSS value — quoted, since an unquoted "2" makes the family name invalid. */
export const FONT = `"${FAMILY}"`;
// Google Fonts' subsets of the variable font; the unicode ranges keep the
// two files from shadowing each other.
loadFont({
  family: FAMILY,
  url: staticFile("cooker/fonts/baloo2-devanagari.woff2"),
  weight: "400 800",
  unicodeRange: "U+0900-097F, U+1CD0-1CF4, U+1CF7-1CF9, U+200C-200D, U+20A8, U+20B9, U+20F0, U+25CC, U+A830-A839, U+A8E0-A8FF",
});
loadFont({
  family: FAMILY,
  url: staticFile("cooker/fonts/baloo2-latin.woff2"),
  weight: "400 800",
  unicodeRange: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
});

export const K = {
  paper: "#F4F0E6",
  grid: "rgba(28,70,78,0.075)",
  ink: "#16181B",
  muted: "#9A968C",
  teal: "#0E5F66",
  tealLight: "#2B8C8F",
  mustard: "#EFB521",
  red: "#E04E2A",
  board: "#1E4A42",
  boardEdge: "#7A5230",
  white: "#FFFFFF",
  steel: "#C7CDD3",
  steelDark: "#8E979F",
  green: "#2E9E5B",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Voiceover starts this many frames into each scene (see Explainer.tsx). */
const VO_DELAY = 4;
const FPS = 30;

/** One scene of a reel script. */
export type Step = Beat & {
  /** Step number shown in the heading badge; omitted on intro/outro. */
  step?: number;
  /** Heading; the word after "|" is drawn in the accent colour. */
  title: string;
};

export type Word = { t: string; s: number; e: number; hi: boolean };
/** Per-scene caption timings, as written by scripts/reel_tts.py. */
export type Words = Record<string, { duration: number; words: Word[] }>;

/** The teacher's look: cast-style Person props, always in a lab coat. */
export type TeacherLook = Pick<PersonProps, "skin" | "hair" | "outfit" | "bindi" | "mustache"> & { skin: string };
export const TEACHERS = {
  female: { skin: "#C68B5E", hair: "bun", outfit: "#C2532E", bindi: true },
  male: { skin: "#A86F48", hair: "short", outfit: "#2F5D8A", mustache: true },
} satisfies Record<string, TeacherLook>;

/** Which reel is playing: its word timings and teacher (see Reel.tsx). */
export const ReelContext = React.createContext<{ words: Words; teacher: TeacherLook }>({ words: {}, teacher: TEACHERS.female });
const useSceneWords = (id: string): Word[] => React.useContext(ReelContext).words[id]?.words ?? [];

/**
 * Returns `at(needle, nth)`: the scene frame at which the nth spoken word
 * containing `needle` starts, so visuals land on the word that names them.
 */
export const useAt = (id: string) => {
  const words = useSceneWords(id);
  return (needle: string, nth = 0) => {
    const hits = words.filter((w) => w.t.toLowerCase().includes(needle.toLowerCase()));
    const w = hits[nth] ?? hits[hits.length - 1];
    if (!w) throw new Error(`[${id}] no spoken word contains "${needle}"`);
    return VO_DELAY + Math.round(w.s * FPS);
  };
};

export const usePop = (at: number, config = { damping: 12, stiffness: 170, mass: 0.8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config });
};

// ---------------------------------------------------------------------------
// Background

export const GraphBg: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: K.paper }}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${K.grid} 2px, transparent 2px),
          linear-gradient(90deg, ${K.grid} 2px, transparent 2px)`,
        backgroundSize: "60px 60px",
        backgroundPosition: "-2px -2px",
      }}
    />
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.06) 100%)",
      }}
    />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Captions: the line being spoken, revealed word by word.

const chunk = (words: Word[]) => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  let len = 0;
  for (const w of words) {
    if (cur.length && len + w.t.length > 34) {
      out.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(w);
    len += w.t.length + 1;
    if (/[।?!.…]$/.test(w.t) && len > 12) {
      out.push(cur);
      cur = [];
      len = 0;
    }
  }
  if (cur.length) out.push(cur);
  return out;
};

export const Captions: React.FC<{ id: string }> = ({ id }) => {
  const frame = useCurrentFrame();
  const t = (frame - VO_DELAY) / FPS;
  const chunks = chunk(useSceneWords(id));
  let ci = 0;
  chunks.forEach((c, i) => {
    if (c[0].s - 0.05 <= t) ci = i;
  });
  const line = chunks[ci] ?? [];
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 210,
        width: 900,
        minHeight: 170,
        display: "flex",
        flexWrap: "wrap",
        alignContent: "flex-start",
        columnGap: 16,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 60,
        lineHeight: 1.35,
        color: K.ink,
      }}
    >
      {line.map((w, i) => {
        const appear = interpolate(t, [w.s - 0.08, w.s + 0.06], [0, 1], clamp);
        return (
          <span
            key={i}
            style={{
              opacity: appear,
              transform: `translateY(${(1 - appear) * 10}px)`,
              color: w.hi ? K.teal : K.ink,
              fontStyle: w.hi ? "italic" : "normal",
              fontWeight: w.hi ? 800 : 600,
              backgroundImage: w.hi ? `linear-gradient(transparent 72%, rgba(239,181,33,0.55) 72%, rgba(239,181,33,0.55) 90%, transparent 90%)` : undefined,
              backgroundSize: `${appear * 100}% 100%`,
              backgroundRepeat: "no-repeat",
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Step heading: "THE 100° |LIMIT" + numbered badge.

export const StepHeading: React.FC<{ title: string; step?: number }> = ({ title, step }) => {
  const p = usePop(2, { damping: 15, stiffness: 160, mass: 0.7 });
  const badge = usePop(10, { damping: 9, stiffness: 200, mass: 0.6 });
  const [plain, accent] = title.split("|");
  // shrink long headings so heading + badge fit the 950px line
  const fontSize = Math.min(104, Math.floor((step === undefined ? 1560 : 1400) / title.length));
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 420,
        display: "flex",
        alignItems: "center",
        gap: 20,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize,
        lineHeight: 1,
        letterSpacing: 1,
        color: K.ink,
        opacity: interpolate(p, [0, 0.4], [0, 1], clamp),
        transform: `translateX(${(1 - p) * -60}px)`,
      }}
    >
      <span style={{ whiteSpace: "pre", paddingTop: 14 }}>
        {plain}
        <span style={{ color: K.teal }}>{accent}</span>
      </span>
      {step !== undefined && (
        <span
          style={{
            width: 84,
            height: 84,
            borderRadius: 16,
            background: K.ink,
            color: K.white,
            fontSize: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 8,
            transform: `scale(${badge}) rotate(${(1 - badge) * -25}deg)`,
            boxShadow: "0 6px 0 rgba(0,0,0,0.18)",
          }}
        >
          {step}
        </span>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// The teacher: series cast style, in a lab coat, mouth moving with the VO.

export const Teacher: React.FC<{ id: string; point?: boolean; enter?: boolean }> = ({ id, point = false, enter = false }) => {
  const frame = useCurrentFrame();
  const t = (frame - VO_DELAY) / FPS;
  const look = React.useContext(ReelContext).teacher;
  const talking = useSceneWords(id).some((w) => t >= w.s && t <= w.e + 0.04);
  const expression = talking ? (Math.floor(frame / 4) % 2 === 0 ? "grin" : "smile") : "smile";
  const rise = enter ? usePopRaw(frame, 6) : 1;
  const breathe = Math.sin((frame + 13 * 37) / 18) * 3;
  const wave = Math.sin(frame / 7) * 4;
  const size = 600;
  return (
    <div
      style={{
        position: "absolute",
        right: -40,
        bottom: -130,
        width: size,
        height: (size * 560) / 400,
        transform: `translateY(${(1 - rise) * 500}px)`,
      }}
    >
      <Person size={size} {...look} glasses expression={expression} seed={13} style={{ position: "absolute", inset: 0 }} />
      {/* lab coat + pointing arm, drawn over the kurta in the same 400x560 space */}
      <svg viewBox="0 0 400 560" width={size} height={(size * 560) / 400} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform={`translate(0 ${breathe})`} stroke={K.ink} strokeWidth={6} strokeLinejoin="round">
          <path d="M70 560 C 70 450, 90 380, 140 350 C 160 340, 172 336, 182 336 L 196 430 L 170 560 Z" fill={K.white} />
          <path d="M330 560 C 330 450, 310 380, 260 350 C 240 340, 228 336, 218 336 L 204 430 L 230 560 Z" fill={K.white} />
          <path d="M182 336 L 160 372 L 186 392" fill="none" strokeWidth={5} />
          <path d="M218 336 L 240 372 L 214 392" fill="none" strokeWidth={5} />
          {/* pocket + pen */}
          <rect x="250" y="440" width="50" height="46" rx="4" fill={K.white} strokeWidth={5} />
          <path d="M266 440 L 266 412" stroke={K.teal} strokeWidth={9} strokeLinecap="round" />
          <path d="M282 440 L 282 418" stroke={K.red} strokeWidth={9} strokeLinecap="round" />
          {point && (
            <g transform={`rotate(${wave} 110 420)`}>
              <path d="M110 420 C 70 400, 40 360, 36 300" fill="none" stroke={K.ink} strokeWidth={66} strokeLinecap="round" />
              <path d="M110 420 C 70 400, 40 360, 36 300" fill="none" stroke={K.white} strokeWidth={54} strokeLinecap="round" />
              <rect x="27" y="196" width="20" height="62" rx="10" fill={look.skin} strokeWidth={5} />
              <ellipse cx="38" cy="268" rx="30" ry="28" fill={look.skin} strokeWidth={5} />
              <path d="M22 262 C 30 270, 46 270, 54 262" fill="none" strokeWidth={4} />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

const usePopRaw = (frame: number, at: number) =>
  interpolate(frame, [at, at + 16], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });

// ---------------------------------------------------------------------------
// Building blocks

/** Card that springs in at `at`. */
export const Card: React.FC<{
  at: number;
  x: number;
  y: number;
  w: number;
  h: number;
  bg?: string;
  color?: string;
  rotate?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, x, y, w, h, bg = K.white, color = K.ink, rotate = 0, style, children }) => {
  const p = usePop(at);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 22,
        background: bg,
        color,
        fontFamily: FONT,
        boxShadow: "0 10px 0 rgba(0,0,0,0.12), 0 16px 30px rgba(0,0,0,0.10)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: interpolate(p, [0, 0.25], [0, 1], clamp),
        transform: `scale(${0.6 + 0.4 * p}) rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Two-line tile text, like "Searches / for patent firms". */
export const TileText: React.FC<{ big: string; small?: string; size?: number }> = ({ big, small, size = 64 }) => (
  <>
    <div style={{ fontWeight: 800, fontSize: size, lineHeight: 1.05, textAlign: "center", paddingTop: 8 }}>{big}</div>
    {small && <div style={{ fontWeight: 500, fontSize: 36, opacity: 0.9, marginTop: 6, textAlign: "center" }}>{small}</div>}
  </>
);

/** Small white checklist panel; each row ticks (or crosses) on its cue. */
export const Checklist: React.FC<{
  x?: number;
  y?: number;
  at: number;
  items: { label: string; at: number; ok?: boolean }[];
}> = ({ x = 50, y = 1340, at, items }) => {
  const frame = useCurrentFrame();
  const p = usePop(at);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "22px 30px 18px 24px",
        borderRadius: 20,
        background: K.white,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        fontFamily: FONT,
        fontSize: 40,
        fontWeight: 600,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      {items.map((it, i) => {
        const done = frame >= it.at;
        const tick = interpolate(frame, [it.at, it.at + 8], [0, 1], clamp);
        const col = it.ok === false ? K.red : K.teal;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, color: done ? col : K.muted }}>
            <svg width={44} height={44} viewBox="0 0 44 44">
              <rect x="3" y="3" width="38" height="38" rx="8" fill={done ? col : "none"} stroke={done ? col : K.muted} strokeWidth={4} />
              {it.ok === false ? (
                <path d="M13 13 L31 31 M31 13 L13 31" stroke="white" strokeWidth={5} strokeLinecap="round" strokeDasharray={60} strokeDashoffset={60 * (1 - tick)} />
              ) : (
                <path d="M11 23 L19 31 L33 14" fill="none" stroke="white" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={40} strokeDashoffset={40 * (1 - tick)} />
              )}
            </svg>
            <span style={{ paddingTop: 6 }}>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
};

/** Torn-paper label that slaps on, e.g. "जादू?". */
export const Stamp: React.FC<{ at: number; text: string; x?: number; y?: number; rotate?: number; color?: string; size?: number }> = ({
  at,
  text,
  x = 40,
  y = 1420,
  rotate = -4,
  color = K.red,
  size = 76,
}) => {
  const p = usePop(at, { damping: 10, stiffness: 220, mass: 0.7 });
  const jag = Array.from({ length: 24 }, (_, i) => `${(i / 23) * 100}% ${i % 2 ? 100 : 93}%`).join(", ");
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "22px 40px 26px",
        background: K.white,
        color,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        whiteSpace: "nowrap",
        clipPath: `polygon(0 4%, 100% 0, ${jag.split(", ").reverse().join(", ")})`,
        filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.18))",
        opacity: p > 0.02 ? 1 : 0,
        transform: `scale(${interpolate(p, [0, 1], [1.8, 1])}) rotate(${rotate}deg)`,
      }}
    >
      {text}
    </div>
  );
};

/** Pop sound on a cue. */
export const Sfx: React.FC<{ at: number; src?: string; volume?: number }> = ({ at, src = "sfx/pop.wav", volume = 0.35 }) => (
  <Sequence from={at}>
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

/** Scene shell: background, captions, heading, content, teacher. */
export const Stage: React.FC<{
  id: string;
  title: string;
  step?: number;
  point?: boolean;
  enterTeacher?: boolean;
  /** Drawn over the teacher (e.g. checklists in the bottom-left corner). */
  front?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ id, title, step, point, enterTeacher, front, children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <GraphBg />
    <Captions id={id} />
    <StepHeading title={title} step={step} />
    {children}
    <Teacher id={id} point={point} enter={enterTeacher} />
    {front}
  </AbsoluteFill>
);
