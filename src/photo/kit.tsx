import React from "react";
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import { HEAD } from "../onion/theme";

// "Neo-brutal" UI kit for the photosynthesis explainer: cream grid paper,
// thick black outlines with hard offset shadows, punchy flat fills,
// pills, sparkles, an app window, a prompt bar and a cursor.

export const BODY = "Poppins";
loadFont({ family: BODY, url: staticFile("fonts/Poppins-Bold.woff2"), weight: "700" });
export { HEAD };

export const K = {
  paper: "#FBF3E4",
  grid: "#EADFC9",
  ink: "#151515",
  white: "#FFFFFF",
  green: "#7BD94F",
  greenDark: "#3FA52A",
  leaf: "#4CB844",
  orange: "#FF7A2F",
  yellow: "#FFD84D",
  blue: "#5BC0EB",
  pink: "#FF8FB1",
  purple: "#A78BFA",
  grey: "#D8D2C4",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Spring 0→1 starting `delay` frames into the scene. */
export const usePop = (delay = 0, config = { damping: 12, stiffness: 170, mass: 0.9 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config });
};

/** Frame for a cue given as a fraction of the scene's length. */
export const useCue = () => {
  const { durationInFrames } = useVideoConfig();
  return (fraction: number) => Math.round(fraction * durationInFrames);
};

export const popStyle = (p: number): React.CSSProperties => ({
  opacity: interpolate(p, [0, 0.25], [0, 1], clamp),
  transform: `scale(${0.6 + 0.4 * p})`,
});

export const GridBg: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: K.paper,
      backgroundImage: `linear-gradient(${K.grid} 2px, transparent 2px), linear-gradient(90deg, ${K.grid} 2px, transparent 2px)`,
      backgroundSize: "64px 64px",
      backgroundPosition: "-2px -2px",
    }}
  >
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(255,255,255,0) 60%, rgba(120,90,40,0.12) 100%)" }} />
  </AbsoluteFill>
);

/** Outlined box with a hard offset shadow. */
export const Box: React.FC<{
  children?: React.ReactNode;
  bg?: string;
  r?: number;
  shadow?: number;
  border?: number;
  style?: React.CSSProperties;
}> = ({ children, bg = K.white, r = 22, shadow = 10, border = 5, style }) => (
  <div
    style={{
      background: bg,
      border: `${border}px solid ${K.ink}`,
      borderRadius: r,
      boxShadow: `${shadow}px ${shadow}px 0 ${K.ink}`,
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Four-point sparkle sticker. */
export const Sparkle: React.FC<{ x: number; y: number; size: number; color: string; delay?: number }> = ({ x, y, size, color, delay = 0 }) => {
  const frame = useCurrentFrame();
  const p = usePop(delay);
  const rot = Math.sin((frame + delay) / 18) * 12;
  const s = p * (1 + 0.08 * Math.sin((frame + delay) / 9));
  return (
    <svg
      viewBox="-50 -50 100 100"
      width={size}
      height={size}
      style={{ position: "absolute", left: x - size / 2, top: y - size / 2, transform: `rotate(${rot}deg) scale(${s})`, overflow: "visible" }}
    >
      <path d="M 0 -46 C 6 -12, 12 -6, 46 0 C 12 6, 6 12, 0 46 C -6 12, -12 6, -46 0 C -12 -6, -6 -12, 0 -46 Z" fill={color} stroke={K.ink} strokeWidth={6} strokeLinejoin="round" />
    </svg>
  );
};

/** Big three-part headline: plain line, a coloured tag, plain line. */
export const Headline: React.FC<{
  top?: string;
  tag: string;
  bottom?: string;
  tagColor?: string;
  tagSize?: number;
  y?: number;
}> = ({ top, tag, bottom, tagColor = K.green, tagSize = 150, y = 150 }) => {
  const a = usePop(0);
  const b = usePop(5);
  const c = usePop(10);
  const word: React.CSSProperties = {
    fontFamily: HEAD,
    fontWeight: 700,
    color: K.ink,
    textTransform: "uppercase",
    lineHeight: 0.95,
    letterSpacing: -2,
  };
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 14 }}>
      {top && <div style={{ ...word, fontSize: 104, ...popStyle(a), transformOrigin: "left center" }}>{top}</div>}
      <Box
        bg={tagColor}
        r={18}
        shadow={10}
        style={{ padding: "6px 30px 14px", transform: `rotate(-2deg) scale(${0.5 + 0.5 * b})`, opacity: interpolate(b, [0, 0.2], [0, 1], clamp), transformOrigin: "left center" }}
      >
        <div style={{ ...word, fontSize: tagSize }}>{tag}</div>
      </Box>
      {bottom && <div style={{ ...word, fontSize: 104, ...popStyle(c), transformOrigin: "left center" }}>{bottom}</div>}
    </div>
  );
};

/** The app window: title bar with icon, address lines, three squares. */
export const Window: React.FC<{
  children?: React.ReactNode;
  title?: string;
  top?: number;
  height?: number;
  delay?: number;
  progress?: number;
}> = ({ children, title = "Leaf.app", top = 640, height = 920, delay = 8, progress }) => {
  const p = usePop(delay, { damping: 15, stiffness: 120, mass: 1 });
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        width: 960,
        top,
        height,
        opacity: interpolate(p, [0, 0.2], [0, 1], clamp),
        transform: `translateY(${(1 - p) * 120}px)`,
      }}
    >
      <Box r={30} shadow={14} style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 104, borderBottom: `5px solid ${K.ink}`, display: "flex", alignItems: "center", padding: "0 28px", gap: 20, flexShrink: 0 }}>
          <div style={{ width: 60, height: 60, borderRadius: 30, background: K.green, border: `5px solid ${K.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="-50 -50 100 100" width={34} height={34}>
              <path d="M 0 -46 C 6 -12, 12 -6, 46 0 C 12 6, 6 12, 0 46 C -6 12, -12 6, -46 0 C -12 -6, -6 -12, 0 -46 Z" fill={K.ink} />
            </svg>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 30, color: K.ink }}>{title}</div>
            {progress === undefined ? (
              <div style={{ width: 160, height: 8, borderRadius: 4, background: K.grey }} />
            ) : (
              <div style={{ width: 360, height: 16, borderRadius: 8, border: `3px solid ${K.ink}`, overflow: "hidden", background: K.white }}>
                <div style={{ width: `${progress * 100}%`, height: "100%", background: K.green }} />
              </div>
            )}
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 40, height: 34, borderRadius: 8, border: `5px solid ${K.ink}` }} />
          ))}
        </div>
        <div style={{ position: "relative", flex: 1 }}>{children}</div>
      </Box>
    </div>
  );
};

/** Pill label, like ROLE / TASK / STYLE. */
export const Pill: React.FC<{ text: string; bg?: string; size?: number; style?: React.CSSProperties }> = ({ text, bg = K.white, size = 34, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: `${size * 0.22}px ${size * 0.7}px`,
      borderRadius: 999,
      border: `5px solid ${K.ink}`,
      background: bg,
      boxShadow: `5px 5px 0 ${K.ink}`,
      fontFamily: BODY,
      fontWeight: 700,
      fontSize: size,
      color: K.ink,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </div>
);

/** Text typed out character by character between two frames. */
export const useTyped = (text: string, from: number, cps = 1.4) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor((frame - from) * cps)));
  return { shown: text.slice(0, n), done: n >= text.length, typing: n > 0 && n < text.length };
};

/** Prompt bar: "+" button, typed text, green send button that pulses on `sendAt`. */
export const PromptBar: React.FC<{
  text: string;
  typeFrom: number;
  sendAt?: number;
  bottom?: number;
  size?: number;
}> = ({ text, typeFrom, sendAt, bottom = 36, size = 34 }) => {
  const frame = useCurrentFrame();
  const { shown, typing } = useTyped(text, typeFrom);
  const caret = typing || Math.floor(frame / 14) % 2 === 0;
  const press = sendAt === undefined ? 0 : interpolate(frame, [sendAt, sendAt + 4, sendAt + 10], [0, 1, 0], clamp);
  const circle = (bg: string, child: React.ReactNode, s = 1) => (
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: 42,
        border: `5px solid ${K.ink}`,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transform: `scale(${s})`,
        boxShadow: `4px 4px 0 ${K.ink}`,
      }}
    >
      {child}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 36, right: 36, bottom }}>
      <Box r={60} shadow={8} style={{ height: 120, display: "flex", alignItems: "center", padding: "0 16px", gap: 18 }}>
        {circle(
          K.green,
          <svg viewBox="0 0 40 40" width={40} height={40}>
            <path d="M20 6 V34 M6 20 H34" stroke={K.ink} strokeWidth={6} strokeLinecap="round" />
          </svg>,
        )}
        <div style={{ flex: 1, fontFamily: BODY, fontWeight: 700, fontSize: size, color: K.ink, whiteSpace: "nowrap", overflow: "hidden" }}>
          {shown}
          <span style={{ opacity: caret ? 1 : 0, color: K.orange }}>|</span>
        </div>
        {circle(
          K.green,
          <svg viewBox="0 0 40 40" width={40} height={40}>
            <path d="M20 33 V8 M9 18 L20 7 L31 18" stroke={K.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>,
          1 - 0.15 * press,
        )}
      </Box>
    </div>
  );
};

/** Mouse pointer that glides between points and clicks at `clickAt`. */
export const Cursor: React.FC<{ path: [number, number, number][]; clickAt?: number }> = ({ path, clickAt }) => {
  const frame = useCurrentFrame();
  const frames = path.map((p) => p[0]);
  const x = interpolate(frame, frames, path.map((p) => p[1]), { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const y = interpolate(frame, frames, path.map((p) => p[2]), { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const ring = clickAt === undefined ? 0 : interpolate(frame, [clickAt, clickAt + 14], [0, 1], clamp);
  const pressed = clickAt !== undefined && frame >= clickAt && frame < clickAt + 6;
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
      {ring > 0 && ring < 1 && (
        <div
          style={{
            position: "absolute",
            left: -50 * ring,
            top: -50 * ring,
            width: 100 * ring,
            height: 100 * ring,
            borderRadius: "50%",
            border: `5px solid ${K.orange}`,
            opacity: 1 - ring,
          }}
        />
      )}
      <svg viewBox="0 0 40 52" width={56} height={72} style={{ transform: `scale(${pressed ? 0.85 : 1})`, transformOrigin: "0 0" }}>
        <path d="M2 2 L2 42 L12 32 L20 50 L28 46 L20 29 L34 29 Z" fill={K.white} stroke={K.ink} strokeWidth={4} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Coloured panel row, like the orange ROLE / TASK / STYLE block. */
export const Row: React.FC<{
  label: string;
  labelBg: string;
  text: string;
  icon?: React.ReactNode;
  delay: number;
  bg?: string;
}> = ({ label, labelBg, text, icon, delay, bg = K.orange }) => {
  const p = usePop(delay);
  return (
    <div style={{ ...popStyle(p), transformOrigin: "left center" }}>
      <Box bg={bg} r={24} shadow={8} style={{ display: "flex", alignItems: "center", gap: 22, padding: "18px 24px" }}>
        <Pill text={label} bg={labelBg} size={32} style={{ minWidth: 250 }} />
        <div style={{ flex: 1, fontFamily: BODY, fontWeight: 700, fontSize: 34, color: K.ink, lineHeight: 1.15 }}>{text}</div>
        {icon && <div style={{ width: 96, height: 96, flexShrink: 0 }}>{icon}</div>}
      </Box>
    </div>
  );
};

/** Bold caption text inside a window. */
export const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 40,
  color = K.ink,
  style,
}) => <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: size, color, lineHeight: 1.15, ...style }}>{children}</div>;
