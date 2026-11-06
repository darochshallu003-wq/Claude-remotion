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
import { clamp } from "../onion/components";
import { C, FPS, HEAD, MONO } from "../onion/theme";

// Shared engine for the faceless explainer series: chains a script's scenes
// with their transitions, lays the voiceover clips, music bed and
// transition whooshes under them, and ends on a fade-to-black outro.

export type Enter = "cut" | "iris" | "wipe" | "fade";
export type Beat = { id: string; seconds: number; enter: Enter; vo: string };

export const TRANSITION_FRAMES = 14;

/** Channel handle shown as a watermark and on the end card. */
export const HANDLE = "@mythmitao";

type Config = {
  script: Beat[];
  scenes: Record<string, React.FC>;
  /** Folder under public/ holding <scene id>.mp3 voiceover clips. */
  voDir: string;
  hasVoiceover: boolean;
  music?: string;
  outroSeconds?: number;
  handle?: string;
};

/** Simple outline camera glyph used next to the handle. */
const InstaGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={4.5}>
    <rect x="4" y="4" width="40" height="40" rx="12" />
    <circle cx="24" cy="24" r="9.5" />
    <circle cx="35.5" cy="12.5" r="2.5" fill={color} stroke="none" />
  </svg>
);

/** Small handle watermark, readable on both light and dark scenes. */
const Watermark: React.FC<{ handle: string }> = ({ handle }) => (
  <div
    style={{
      position: "absolute",
      top: 84,
      right: 70,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 18px 8px 12px",
      borderRadius: 999,
      background: "rgba(0,0,0,0.38)",
      color: "white",
      fontFamily: MONO,
      fontSize: 26,
      letterSpacing: 1,
      opacity: 0.9,
    }}
  >
    <InstaGlyph size={30} color="white" />
    {handle}
  </div>
);

const Enterer: React.FC<{ enter: Enter; children: React.ReactNode }> = ({ enter, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  if (enter === "iris") {
    return <AbsoluteFill style={{ clipPath: `circle(${p * 120}% at 50% 55%)` }}>{children}</AbsoluteFill>;
  }
  if (enter === "wipe") {
    const y = p * 100;
    return (
      <>
        <AbsoluteFill style={{ clipPath: `inset(0 0 ${100 - y}% 0)` }}>{children}</AbsoluteFill>
        {p < 1 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${y}%`,
              height: 6,
              marginTop: -3,
              background: C.orange,
              boxShadow: `0 0 40px 12px rgba(240,138,36,0.65)`,
            }}
          />
        )}
      </>
    );
  }
  if (enter === "fade") return <AbsoluteFill style={{ opacity: p }}>{children}</AbsoluteFill>;
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

const Outro: React.FC<{ handle: string }> = ({ handle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const toBlack = interpolate(frame, [0, 24], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const pop = spring({ frame: frame - 16, fps, config: { damping: 9, stiffness: 140, mass: 0.8 } });
  const line = spring({ frame: frame - 24, fps, config: { damping: 18, stiffness: 120 } });
  const follow = spring({ frame: frame - 34, fps, config: { damping: 12, stiffness: 160 } });
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${toBlack})`, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          opacity: interpolate(pop, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
          transform: `scale(${0.4 + 0.6 * pop})`,
        }}
      >
        <span
          style={{
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 104,
            color: C.cream,
            textAlign: "center",
            lineHeight: 1.08,
            textTransform: "uppercase",
            textShadow: "0 4px 26px rgba(240,138,36,0.45)",
          }}
        >
          Thanks for
          <br />
          watching!
        </span>
        <div style={{ width: 280 * line, height: 10, borderRadius: 999, background: `linear-gradient(90deg, ${C.purple}, ${C.orange})` }} />
        <div
          style={{
            marginTop: 26,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "14px 34px",
            borderRadius: 999,
            border: `3px solid ${C.cream}`,
            color: C.cream,
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 50,
            letterSpacing: 1,
            opacity: follow,
            transform: `translateY(${(1 - follow) * 30}px)`,
          }}
        >
          <InstaGlyph size={50} color={C.cream} />
          FOLLOW {handle.toUpperCase()}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const makeExplainer = ({
  script,
  scenes,
  voDir,
  hasVoiceover,
  music = "onion/music.wav",
  outroSeconds = 2.8,
  handle = HANDLE,
}: Config) => {
  let t = 0;
  const placed = script.map((b) => {
    const frames = Math.round(b.seconds * FPS);
    const p = { id: b.id, enter: b.enter, start: t, frames };
    t += frames;
    return p;
  });
  const scenesEnd = t;
  const totalFrames = scenesEnd + Math.round(outroSeconds * FPS);

  const Component: React.FC = () => {
    const musicVolume = hasVoiceover ? 0.16 : 0.42;
    return (
      <AbsoluteFill style={{ backgroundColor: "black" }}>
        {placed.map((p, i) => {
          const Scene = scenes[p.id];
          const overlap = i > 0 && p.enter !== "cut" ? TRANSITION_FRAMES : 0;
          return (
            <Sequence
              key={p.id}
              from={p.start - overlap}
              durationInFrames={p.frames + overlap + (i === placed.length - 1 ? 30 : 0)}
            >
              <Enterer enter={i === 0 ? "fade" : p.enter}>
                <Scene />
              </Enterer>
            </Sequence>
          );
        })}

        <Sequence durationInFrames={scenesEnd}>
          <Watermark handle={handle} />
        </Sequence>

        <Sequence from={scenesEnd - 6}>
          <Outro handle={handle} />
        </Sequence>

        <Audio
          src={staticFile(music)}
          volume={(f) => musicVolume * interpolate(f, [totalFrames - 50, totalFrames], [1, 0], clamp)}
        />

        {placed
          .filter((p, i) => i > 0 && (p.enter === "iris" || p.enter === "wipe"))
          .map((p) => (
            <Sequence key={`wh-${p.id}`} from={p.start - TRANSITION_FRAMES - 4}>
              <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
          ))}

        {hasVoiceover &&
          placed.map((p) => (
            <Sequence key={`vo-${p.id}`} from={p.start + 4}>
              <Audio src={staticFile(`${voDir}/${p.id}.mp3`)} volume={1} />
            </Sequence>
          ))}

        <Sequence from={scenesEnd + 10}>
          <Audio src={staticFile("sfx/chime.wav")} volume={0.45} />
        </Sequence>
      </AbsoluteFill>
    );
  };

  return { Component, totalFrames };
};
