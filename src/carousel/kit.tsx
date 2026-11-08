import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DAHI_SECONDS, DAHI_SRC, DISPLAY, FPS, HANDLE, K, MONO, SERIF, TOTAL_SLIDES, UI } from "./theme";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 spring that starts at frame `at`. */
export const useIn = (at: number, damping = 16) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, mass: 0.7 } });
};

/** Linear 0→1 between two frames, eased. */
export const useRamp = (from: number, to: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
};

/** Rise-and-fade entrance style. */
export const rise = (p: number, dist = 34): React.CSSProperties => ({
  opacity: p,
  transform: `translateY(${(1 - p) * dist}px)`,
});

/** Characters of `text` typed so far, starting at `at`, `cps` chars per second. */
export const useTyped = (text: string, at: number, cps = 26) => {
  const frame = useCurrentFrame();
  const n = Math.max(0, Math.floor(((frame - at) / FPS) * cps));
  return { shown: text.slice(0, n), done: n >= text.length, doneAt: at + Math.ceil((text.length / cps) * FPS) };
};

export const Caret: React.FC<{ color?: string; h?: number }> = ({ color = K.ink, h = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        display: "inline-block",
        width: 3,
        height: `${h}em`,
        marginLeft: 3,
        verticalAlign: "-0.15em",
        background: color,
        opacity: Math.floor(frame / 15) % 2 === 0 ? 1 : 0,
      }}
    />
  );
};

export const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.4 }) => (
  <Sequence from={Math.max(0, Math.round(at))} durationInFrames={60} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

/** Claude-style eight-armed spark (a plain geometric glyph). */
export const Spark: React.FC<{ size: number; color?: string; spin?: number }> = ({ size, color = K.coral, spin = 0 }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ transform: `rotate(${spin}deg)` }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x={-6} y={-47} width={12} height={40} rx={6} fill={color} transform={`rotate(${i * 45})`} />
    ))}
  </svg>
);

// ---------------------------------------------------------------------------
// Slide frame

const Paper: React.FC = () => (
  <AbsoluteFill
    style={{
      background: K.paper,
      backgroundImage: `linear-gradient(${K.paperLine} 1px, transparent 1px), linear-gradient(90deg, ${K.paperLine} 1px, transparent 1px)`,
      backgroundSize: "36px 36px",
    }}
  >
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.35) 0%, rgba(0,0,0,0) 55%, rgba(80,60,40,0.10) 100%)" }} />
  </AbsoluteFill>
);

const Avatar: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: K.ink,
      color: K.paper,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: DISPLAY,
      fontSize: size * 0.5,
      lineHeight: 1,
    }}
  >
    M
  </div>
);

const TopBar: React.FC<{ index: number; showClaude: boolean }> = ({ index, showClaude }) => {
  const frame = useCurrentFrame();
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div style={{ position: "absolute", top: 40, left: 52, right: 52, display: "flex", alignItems: "center", gap: 14 }}>
      {showClaude && (
        <>
          <Spark size={34} spin={frame * 0.6} />
          <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: K.ink }}>Claude</span>
          <span style={{ color: K.muted, fontSize: 26, margin: "0 4px" }}>·</span>
        </>
      )}
      <Avatar size={36} />
      <span style={{ fontFamily: MONO, fontSize: 24, color: K.ink }}>{HANDLE}</span>
      <div style={{ flex: 1 }} />
      <span
        style={{
          fontFamily: MONO,
          fontSize: 23,
          letterSpacing: 2,
          padding: "6px 16px",
          borderRadius: 999,
          background: index === 1 ? K.coral : "transparent",
          color: index === 1 ? "#fff" : K.muted,
        }}
      >
        {pad(index)} / {pad(TOTAL_SLIDES)}
      </span>
    </div>
  );
};

const Footer: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: "absolute", bottom: 46, left: 52, right: 52, display: "flex", alignItems: "center", gap: 24 }}>
    <div style={{ flex: 1, height: 2, background: K.hair }} />
    <span style={{ fontFamily: MONO, fontSize: 21, letterSpacing: 5, color: K.muted, whiteSpace: "nowrap" }}>{text}</span>
    <div style={{ flex: 1, height: 2, background: K.hair }} />
  </div>
);

export const Slide: React.FC<{ index: number; footer: string; showClaude?: boolean; children: React.ReactNode }> = ({
  index,
  footer,
  showClaude = true,
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Gentle fade at both ends so slides loop cleanly on Instagram.
  const fade = interpolate(frame, [0, 6, durationInFrames - 6, durationInFrames], [0.0, 1, 1, 1], clamp);
  return (
    <AbsoluteFill style={{ fontFamily: UI, color: K.ink }}>
      <Paper />
      <AbsoluteFill style={{ opacity: fade }}>
        <TopBar index={index} showClaude={showClaude} />
        {children}
        <Footer text={footer} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Two-line headline: ink line, then coral line. */
export const Title: React.FC<{ top: string; bottom: string; y?: number; size?: number; bottomSize?: number }> = ({
  top,
  bottom,
  y = 112,
  size = 76,
  bottomSize,
}) => {
  const a = useIn(2);
  const b = useIn(9);
  const line: React.CSSProperties = { fontFamily: DISPLAY, textAlign: "center", lineHeight: 1.04, letterSpacing: -0.5, whiteSpace: "nowrap" };
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0 }}>
      <div style={{ ...line, ...rise(a, 24), fontSize: size, color: K.ink }}>{top}</div>
      <div style={{ ...line, ...rise(b, 24), fontSize: bottomSize ?? size, color: K.coral }}>{bottom}</div>
    </div>
  );
};

/** Italic serif caption; the second half in coral. */
export const Caption: React.FC<{ a: string; b: string; at: number; y?: number }> = ({ a, b, at, y = 1180 }) => {
  const p = useIn(at);
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 50, ...rise(p, 16) }}>
      <span style={{ color: K.ink }}>{a} </span>
      <span style={{ color: K.coral }}>{b}</span>
    </div>
  );
};

/** Dotted connector line with a dot at the bottom, drawn downward. */
export const Connector: React.FC<{ x?: number; y: number; h: number; at: number }> = ({ x = 540, y, h, at }) => {
  const p = useRamp(at, at + 10);
  return (
    <div style={{ position: "absolute", left: x - 1, top: y }}>
      <div style={{ width: 2, height: h * p, backgroundImage: `linear-gradient(${K.coral} 50%, transparent 50%)`, backgroundSize: "2px 8px", opacity: 0.7 }} />
      <div style={{ position: "absolute", left: -6, top: h - 6, width: 14, height: 14, borderRadius: 7, background: K.coral, transform: `scale(${p})` }} />
    </div>
  );
};

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      position: "absolute",
      background: K.card,
      borderRadius: 22,
      boxShadow: "0 2px 0 rgba(0,0,0,0.04), 0 18px 40px rgba(70,50,30,0.13)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const MonoLabel: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = K.muted, size = 19 }) => (
  <span style={{ fontFamily: MONO, fontSize: size, letterSpacing: 3, color, textTransform: "uppercase" }}>{children}</span>
);

// ---------------------------------------------------------------------------
// Reel player: plays the real Dahi explainer, muted, inside a 9:16 frame.

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export const ReelPlayer: React.FC<{
  x: number;
  y: number;
  w: number;
  /** Second of the explainer to start from. */
  from: number;
  /** Frame at which the player appears and starts playing. */
  at: number;
  rotate?: number;
  bar?: boolean;
  border?: string;
  /** Crop the 9:16 frame to this aspect (h / w), keeping it vertically centred. */
  aspect?: number;
  dim?: number;
}> = ({ x, y, w, from, at, rotate = 0, bar = true, border = K.card, aspect = 16 / 9, dim = 0 }) => {
  const frame = useCurrentFrame();
  const p = useIn(at, 15);
  const fullH = (w * 16) / 9;
  const h = w * aspect;
  const elapsed = from + Math.max(0, frame - at) / FPS;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 18,
        overflow: "hidden",
        border: `7px solid ${border}`,
        boxShadow: "0 22px 46px rgba(60,40,25,0.25)",
        background: K.term,
        opacity: p,
        transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + 0.06 * p}) rotate(${rotate}deg)`,
      }}
    >
      <Sequence from={at} layout="none">
        <div style={{ position: "absolute", left: 0, top: (h - fullH) / 2, width: w, height: fullH }}>
          <OffthreadVideo src={staticFile(DAHI_SRC)} startFrom={Math.round(from * FPS)} muted style={{ width: "100%", height: "100%" }} />
        </div>
      </Sequence>
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(20,16,12,${dim})` }} />}
      {bar && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "26px 16px 12px",
            background: "linear-gradient(transparent, rgba(0,0,0,0.65))",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <svg width={16} height={18} viewBox="0 0 16 18">
            <path d="M0 0 L16 9 L0 18 Z" fill="#fff" />
          </svg>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.3)" }}>
            <div style={{ width: `${(elapsed / DAHI_SECONDS) * 100}%`, height: "100%", borderRadius: 3, background: K.coral }} />
          </div>
          <span style={{ fontFamily: MONO, fontSize: 15, color: "#fff" }}>
            {fmt(elapsed)} / {fmt(Math.round(DAHI_SECONDS))}
          </span>
        </div>
      )}
    </div>
  );
};

/** Little arrow pointer that glides to (x, y) and "clicks" at `clickAt`. */
export const Pointer: React.FC<{ path: [number, number, number][]; clickAt?: number }> = ({ path, clickAt }) => {
  const frame = useCurrentFrame();
  const frames = path.map((p) => p[2]);
  const x = interpolate(frame, frames, path.map((p) => p[0]), { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const y = interpolate(frame, frames, path.map((p) => p[1]), { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const show = interpolate(frame, [frames[0], frames[0] + 6], [0, 1], clamp);
  const press = clickAt !== undefined ? interpolate(frame, [clickAt - 3, clickAt, clickAt + 5], [1, 0.82, 1], clamp) : 1;
  const ring = clickAt !== undefined ? interpolate(frame, [clickAt, clickAt + 14], [0, 1], clamp) : 0;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: show, pointerEvents: "none" }}>
      {ring > 0 && ring < 1 && (
        <div style={{ position: "absolute", left: -30 * ring, top: -30 * ring, width: 60 * ring, height: 60 * ring, borderRadius: "50%", border: `3px solid ${K.coral}`, opacity: 1 - ring }} />
      )}
      <svg width={38} height={46} viewBox="0 0 26 32" style={{ transform: `scale(${press})`, transformOrigin: "0 0", filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.3))" }}>
        <path d="M1 1 L1 25 L7.5 19 L12 30 L16.5 28 L12 17.5 L21 17.5 Z" fill={K.ink} stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
      </svg>
    </div>
  );
};
