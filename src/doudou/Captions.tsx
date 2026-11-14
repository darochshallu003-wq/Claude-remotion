import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPTIONS } from "./captions";

const HOLD = 0.25; // seconds a caption lingers after its words, unless the next one starts first
const FADE = 0.15; // seconds to fade in and out

/** The narration as on-screen captions, one chunk (at most two lines) at a time. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const i = CAPTIONS.findIndex((c, k) => {
    const next = CAPTIONS[k + 1];
    const end = Math.min(c.end + HOLD, next ? next.start : Infinity);
    return t >= c.start && t < end;
  });
  if (i < 0) return null;

  const c = CAPTIONS[i];
  const next = CAPTIONS[i + 1];
  const end = Math.min(c.end + HOLD, next ? next.start : Infinity);
  // Back-to-back chunks swap instantly; a caption fades in after a pause and out before one.
  const prev = CAPTIONS[i - 1];
  const joinedBefore = prev !== undefined && Math.min(prev.end + HOLD, c.start) >= c.start - 1e-3;
  const joinedAfter = next !== undefined && next.start <= c.end + HOLD;
  const fadeIn = joinedBefore ? 1 : interpolate(t, [c.start, c.start + FADE], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = joinedAfter ? 1 : interpolate(t, [end - FADE, end], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 72, pointerEvents: "none" }}>
      <div
        style={{
          opacity: Math.min(fadeIn, fadeOut),
          maxWidth: 1340,
          padding: "14px 30px 16px",
          borderRadius: 14,
          backgroundColor: "rgba(14, 24, 36, 0.74)",
          color: "#f6e9bf",
          fontFamily: "Nunito",
          fontWeight: 700,
          fontSize: 46,
          lineHeight: 1.32,
          textAlign: "center",
          textWrap: "balance",
        }}
      >
        {c.text}
      </div>
    </AbsoluteFill>
  );
};
