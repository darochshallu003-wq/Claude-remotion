import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import type { Note } from "./types";

// Poppins Bold is already bundled in public/fonts (SIL OFL).
// Caveat Bold (SIL OFL, public/storyreel/fonts/OFL-Caveat.txt) is the
// handwriting on the sticky note.
export const UI_FONT = "Poppins";
export const HAND_FONT = "Caveat";
loadFont({
  family: UI_FONT,
  url: staticFile("fonts/Poppins-Bold.woff2"),
  weight: "700",
});
loadFont({
  family: HAND_FONT,
  url: staticFile("storyreel/fonts/caveat-latin-700-normal.woff2"),
  weight: "700",
});

/** A generic camera glyph: rounded square, lens, flash dot. */
export const CameraGlyph: React.FC<{ size: number; color: string; stroke?: number }> = ({
  size,
  color,
  stroke = 2.2,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke={color} strokeWidth={stroke} />
    <circle cx="12" cy="12" r="4.4" stroke={color} strokeWidth={stroke} />
    <circle cx="17.4" cy="6.6" r="1.2" fill={color} />
  </svg>
);

/** Small handle tag in the top-right corner, like the reference reel. */
export const Watermark: React.FC<{ handle: string }> = ({ handle }) => (
  <AbsoluteFill style={{ alignItems: "flex-end", padding: "150px 56px 0 0" }}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: 0.85,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.45))",
      }}
    >
      <CameraGlyph size={34} color="white" />
      <div
        style={{
          fontFamily: UI_FONT,
          fontWeight: 700,
          fontSize: 20,
          letterSpacing: 1,
          color: "white",
          textTransform: "uppercase",
        }}
      >
        {handle}
      </div>
    </div>
  </AbsoluteFill>
);

/** Bold caption that pops in at the top and fades out. */
export const HookCaption: React.FC<{ text: string; durationInFrames: number }> = ({
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 160 } });
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 330 }}>
      <div
        style={{
          maxWidth: 900,
          padding: "20px 34px",
          borderRadius: 28,
          background: "rgba(255,255,255,0.94)",
          color: "#1b1b1b",
          fontFamily: UI_FONT,
          fontWeight: 700,
          fontSize: 56,
          lineHeight: 1.15,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
          transform: `scale(${0.6 + 0.4 * pop})`,
          opacity: Math.min(pop, out),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Yellow sticky note with handwriting; pops in with a little wobble. */
export const StickyNote: React.FC<{ note: Note }> = ({ note }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const start = Math.round((note.appearAt ?? 0) * fps);
  const pop = spring({ frame: frame - start, fps, config: { damping: 9, stiffness: 140 } });
  const w = ((note.size ?? 44) / 100) * width;
  const rotate = (note.rotate ?? -4) + (1 - pop) * 10;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: `${note.x}%`,
          top: `${note.y}%`,
          width: w,
          height: w * 0.82,
          transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${pop})`,
          background: "linear-gradient(160deg, #fff59a 0%, #ffe45c 100%)",
          boxShadow: "0 18px 30px rgba(0,0,0,0.35), inset 0 -14px 20px rgba(0,0,0,0.05)",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: w * 0.08,
          boxSizing: "border-box",
        }}
      >
        {/* strip of tape */}
        <div
          style={{
            position: "absolute",
            top: -w * 0.05,
            width: w * 0.34,
            height: w * 0.1,
            background: "rgba(255,255,255,0.55)",
            transform: "rotate(-3deg)",
          }}
        />
        <div
          style={{
            fontFamily: HAND_FONT,
            fontWeight: 700,
            fontSize: w * 0.17,
            lineHeight: 1.05,
            color: "#2b2a6e",
            textAlign: "center",
            whiteSpace: "pre-line",
          }}
        >
          {note.text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Outro overlay: darkens what's underneath, then a big camera glyph
 * cycles white -> brand colours -> white with the handle underneath.
 */
export const OutroOverlay: React.FC<{
  handle: string;
  colors: string[];
  durationInFrames: number;
}> = ({ handle, colors, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const darken = interpolate(frame, [0, 12], [0, 0.6], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const pop = spring({ frame: frame - 6, fps, config: { damping: 11, stiffness: 150 } });

  // white -> c0 -> c1 -> ... -> white across the outro
  const palette = ["#ffffff", ...colors, "#ffffff"];
  const stops = palette.map((_, i) => 8 + (i * (durationInFrames - 16)) / (palette.length - 1));
  const color = interpolateColors(frame, stops, palette);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(0,0,0,${darken})` }} />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          opacity: pop,
          transform: `scale(${0.7 + 0.3 * pop})`,
        }}
      >
        <div style={{ filter: `drop-shadow(0 0 24px ${color})` }}>
          <CameraGlyph size={240} color={color} stroke={1.8} />
        </div>
        <div
          style={{
            fontFamily: UI_FONT,
            fontWeight: 700,
            fontSize: 46,
            letterSpacing: 2,
            color: "white",
            textTransform: "uppercase",
          }}
        >
          {handle}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
