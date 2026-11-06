import React from "react";
import {
  AbsoluteFill,
  Audio,
  CalculateMetadataFunction,
  Freeze,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HookCaption, OutroOverlay, StickyNote, UI_FONT, Watermark } from "./overlays";
import type { Shot, StoryReelProps } from "./types";

export const STORY_FPS = 30;

type Placed = Shot & { start: number; frames: number; xf: number };

/** Lay shots end to end. A crossfade overlaps the previous shot's tail,
 *  so it never changes the reel's length. */
export const layout = (shots: Shot[], fps: number) => {
  let cursor = 0;
  const placed: Placed[] = shots.map((s, i) => {
    const frames = Math.round(s.seconds * fps);
    const xf = i === 0 ? 0 : Math.min(Math.round((s.crossfade ?? 0) * fps), frames);
    const p = { ...s, start: cursor, frames, xf };
    cursor += frames;
    return p;
  });
  return { placed, shotsEnd: cursor };
};

export const calculateStoryMetadata: CalculateMetadataFunction<StoryReelProps> = ({ props }) => {
  const { shotsEnd } = layout(props.shots, STORY_FPS);
  return {
    durationInFrames: shotsEnd + Math.round(props.outroSeconds * STORY_FPS),
    fps: STORY_FPS,
  };
};

const IMAGE_RE = /\.(png|jpe?g|webp|gif)$/i;

/** Placeholder so the edit can be timed before any clip exists. */
const PlaceholderCard: React.FC<{ index: number; shot: Shot }> = ({ index, shot }) => {
  const hue = (index * 47 + 20) % 360;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, hsl(${hue},45%,32%), hsl(${(hue + 40) % 360},50%,14%))`,
        alignItems: "center",
        justifyContent: "center",
        padding: 90,
        textAlign: "center",
        color: "white",
        fontFamily: UI_FONT,
        fontWeight: 700,
        gap: 28,
      }}
    >
      <div style={{ fontSize: 40, letterSpacing: 6, opacity: 0.6 }}>SHOT {index + 1}</div>
      <div style={{ fontSize: 66, lineHeight: 1.15 }}>{shot.label}</div>
      <div style={{ fontSize: 28, opacity: 0.5 }}>
        {shot.seconds}s · add a clip as "src" for “{shot.id}”
      </div>
    </AbsoluteFill>
  );
};

/** The picture for one shot: clip, still or placeholder, with optional push-in. */
const ShotMedia: React.FC<{ shot: Placed; index: number }> = ({ shot, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [z0, z1] = shot.zoom ?? [1, 1];
  const scale = interpolate(frame, [0, shot.frames + shot.xf], [z0, z1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fill: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };

  let media: React.ReactNode;
  if (!shot.src) media = <PlaceholderCard index={index} shot={shot} />;
  else if (IMAGE_RE.test(shot.src)) media = <Img src={staticFile(shot.src)} style={fill} />;
  else
    media = (
      <OffthreadVideo
        src={staticFile(shot.src)}
        trimBefore={Math.round((shot.trimStart ?? 0) * fps)}
        muted
        style={fill}
      />
    );

  return <AbsoluteFill style={{ transform: `scale(${scale})` }}>{media}</AbsoluteFill>;
};

const ShotLayer: React.FC<{ shot: Placed; index: number }> = ({ shot, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = shot.xf > 0 ? interpolate(frame, [0, shot.xf], [0, 1], { extrapolateRight: "clamp" }) : 1;
  return (
    <AbsoluteFill style={{ opacity, backgroundColor: "black" }}>
      <ShotMedia shot={shot} index={index} />
      {shot.note && (
        <Sequence from={shot.xf} layout="none">
          <StickyNote note={shot.note} />
        </Sequence>
      )}
      {(shot.sfx ?? []).map((s, i) => (
        <Sequence key={i} from={shot.xf + Math.round(s.at * fps)} layout="none">
          <Audio src={staticFile(s.src)} volume={s.volume ?? 1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const StoryReel: React.FC<StoryReelProps> = ({
  shots,
  handle,
  hook,
  music,
  musicVolume = 0.8,
  outroSeconds,
  logoColors,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const { placed, shotsEnd } = layout(shots, fps);
  const outroFrames = durationInFrames - shotsEnd;
  const last = placed[placed.length - 1];

  // Music: short fade in, drops out (with 4-frame ramps) on any shot
  // marked musicDrop, and fades away across the outro.
  const ramp = 4;
  const musicAt = (f: number) => {
    let v = interpolate(f, [0, 10], [0, 1], { extrapolateRight: "clamp" });
    for (const p of placed) {
      if (!p.musicDrop) continue;
      const a = p.start;
      const b = p.start + p.frames;
      v *= interpolate(f, [a - ramp, a, b, b + ramp], [1, 0, 0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
    v *= interpolate(f, [shotsEnd, durationInFrames - 6], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return v * musicVolume;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {placed.map((shot, i) => (
        <Sequence
          key={shot.id}
          name={`${i + 1}. ${shot.id}`}
          from={shot.start - shot.xf}
          durationInFrames={shot.frames + shot.xf}
        >
          <ShotLayer shot={shot} index={i} />
        </Sequence>
      ))}

      {last && outroFrames > 0 && (
        <Sequence name="outro" from={shotsEnd} durationInFrames={outroFrames}>
          {/* hold the very last frame of the final shot */}
          <Freeze frame={last.frames + last.xf - 1}>
            <AbsoluteFill>
              <ShotMedia shot={last} index={placed.length - 1} />
            </AbsoluteFill>
          </Freeze>
          <OutroOverlay handle={handle} colors={logoColors} durationInFrames={outroFrames} />
        </Sequence>
      )}

      <Sequence name="watermark" durationInFrames={shotsEnd} layout="none">
        <Watermark handle={handle} />
      </Sequence>

      {hook && (
        <Sequence name="hook" durationInFrames={Math.round(hook.seconds * fps)} layout="none">
          <HookCaption text={hook.text} durationInFrames={Math.round(hook.seconds * fps)} />
        </Sequence>
      )}

      {music && <Audio src={staticFile(music)} volume={musicAt} />}
    </AbsoluteFill>
  );
};
