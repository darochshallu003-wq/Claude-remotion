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
import { loadFont } from "@remotion/fonts";
import timeline from "./timeline.json";

// Poppins Bold (SIL OFL, see public/fonts/OFL.txt), bundled so renders
// don't need to reach Google Fonts.
const fontFamily = "Poppins";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Poppins-Bold.woff2"),
  weight: "700",
});

export const FPS = timeline.fps;
const VIDEO_FRAMES = timeline.totalFrames;
const SEGMENTS = timeline.segments;

// Outro: the last shot fades to black, then "Thanks for watching!" pops
// in and holds on black.
const FADE_START = VIDEO_FRAMES - 30; // last second of the final shot
const TEXT_IN = VIDEO_FRAMES - 10;
const OUTRO_HOLD = 75; // frames of black after the video ends
export const TOTAL_FRAMES = VIDEO_FRAMES + OUTRO_HOLD;

/**
 * Map a time in the original clip (seconds) to a frame in the edit.
 * Times inside a cut snap to the start of the next kept segment.
 */
const srcToOut = (seconds: number) => {
  const f = seconds * FPS;
  for (const seg of SEGMENTS) {
    if (f < seg.srcStart) return seg.outStart;
    if (f < seg.srcEnd) {
      return Math.round(seg.outStart + (f - seg.srcStart) / seg.speed);
    }
  }
  return VIDEO_FRAMES - 1;
};

/** Slow-motion stretches, with back-to-back slow segments merged. */
const SLOW_WINDOWS = SEGMENTS.filter((seg) => seg.speed < 1).reduce<
  { start: number; end: number }[]
>((acc, seg) => {
  const last = acc[acc.length - 1];
  if (last && last.end === seg.outStart) last.end = seg.outEnd;
  else acc.push({ start: seg.outStart, end: seg.outEnd });
  return acc;
}, []);

// `at` = moment the ingredient lands in the bowl, in seconds of the
// original clip. Labels show one at a time: each stays until the next
// ingredient goes in, for at most MAX_LABEL_SECONDS.
const INGREDIENTS = [
  { name: "Greek Yogurt", color: "#7fb6d9", at: 16.75 },
  { name: "Salt", color: "#b9c2cc", at: 17.6 }, // from the shaker
  { name: "Black Pepper", color: "#3a3a3a", at: 18.3 }, // from the spoon
  { name: "Chilli Flakes", color: "#e0452b", at: 18.6 },
  { name: "Fresh Coriander", color: "#2f8f3a", at: 19.0 },
  { name: "Cucumber", color: "#3f9b3a", at: 24.0 },
  { name: "Sesame Seeds", color: "#d9b77a", at: 29.7 },
  { name: "Pomegranate Seeds", color: "#c0182f", at: 30.9 },
];
const MAX_LABEL_SECONDS = 2.0;

const LABELS = INGREDIENTS.map((item, i) => {
  const inFrame = srcToOut(item.at);
  const next = INGREDIENTS[i + 1];
  const cap = inFrame + Math.round(MAX_LABEL_SECONDS * FPS);
  const outFrame = next ? Math.min(cap, srcToOut(next.at)) : cap;
  return { ...item, inFrame, outFrame };
});

const MUSIC_VOLUME = 0.85;

const Label: React.FC<{
  name: string;
  color: string;
  inFrame: number;
  outFrame: number;
}> = ({ name, color, inFrame, outFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - inFrame,
    fps,
    config: { damping: 14, stiffness: 190 },
  });
  const exit = interpolate(frame, [outFrame - 6, outFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "11px 26px 11px 18px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.9)",
        boxShadow: "0 5px 16px rgba(0,0,0,0.25)",
        opacity: Math.min(enter, exit),
        transform: `translateY(${(1 - enter) * 24}px) scale(${
          0.9 + 0.1 * enter
        })`,
        transformOrigin: "left center",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          background: color,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 42,
          color: "#1d3b1a",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
    </div>
  );
};

/** 0..1 strength of the slow-motion look at this frame (eased in and out). */
const slowMoAmount = (frame: number) => {
  for (const w of SLOW_WINDOWS) {
    if (frame >= w.start - 6 && frame < w.end + 6) {
      return interpolate(
        frame,
        [w.start - 6, w.start + 6, w.end - 6, w.end + 6],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
  }
  return 0;
};

/** Slow zoom-in across each slow-motion stretch, eased back out after. */
const slowMoZoom = (frame: number) => {
  for (const w of SLOW_WINDOWS) {
    if (frame >= w.start && frame < w.end + 12) {
      const push = interpolate(frame, [w.start, w.end], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.sin),
      });
      const release = interpolate(frame, [w.end, w.end + 12], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      return 1 + 0.07 * push * release;
    }
  }
  return 1;
};

const ThanksForWatching: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - TEXT_IN,
    fps,
    config: { damping: 9, stiffness: 140, mass: 0.8 },
  });
  const underline = spring({
    frame: frame - TEXT_IN - 8,
    fps,
    config: { damping: 18, stiffness: 120 },
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          opacity: interpolate(pop, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          }),
          transform: `scale(${0.4 + 0.6 * pop})`,
        }}
      >
        <span
          style={{
            fontFamily,
            fontWeight: 700,
            fontSize: 96,
            color: "white",
            textAlign: "center",
            lineHeight: 1.1,
            textShadow: "0 4px 24px rgba(63,155,58,0.45)",
          }}
        >
          Thanks for
          <br />
          watching!
        </span>
        <div
          style={{
            width: 260 * underline,
            height: 10,
            borderRadius: 999,
            background: "linear-gradient(90deg, #3f9b3a, #8fd16a)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const CucumberSalad: React.FC = () => {
  const frame = useCurrentFrame();
  const slow = slowMoAmount(frame);
  const zoom = slowMoZoom(frame);
  const toBlack = interpolate(frame, [FADE_START, VIDEO_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Sequence durationInFrames={VIDEO_FRAMES}>
        <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
          <OffthreadVideo
            src={staticFile("cucumber-salad-graded.mp4")}
            muted
          />
        </AbsoluteFill>
      </Sequence>

      {/* Soft vignette during slow motion */}
      <AbsoluteFill
        style={{
          opacity: slow * 0.5,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 58%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* One compact label at a time, lower left: off the bowl's centre,
          clear of the logo at the top and the YouTube Shorts buttons
          and caption at the bottom. */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "0 0 430px 48px",
        }}
      >
        <div style={{ position: "relative" }}>
          {LABELS.filter(
            (l) => frame >= l.inFrame && frame < l.outFrame
          ).map((l) => (
            <Label key={l.name} {...l} />
          ))}
        </div>
      </AbsoluteFill>

      {/* Fade to black, then the outro text */}
      <AbsoluteFill style={{ backgroundColor: "black", opacity: toBlack }} />
      <ThanksForWatching />

      {/* Original music, faded out at the end */}
      <Audio
        src={staticFile("cucumber-salad.mp4")}
        volume={(f) =>
          MUSIC_VOLUME *
          interpolate(f, [TOTAL_FRAMES - 45, TOTAL_FRAMES], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      {LABELS.map((l) => (
        <Sequence key={`pop-${l.name}`} from={l.inFrame}>
          <Audio src={staticFile("sfx/pop.wav")} volume={0.5} />
        </Sequence>
      ))}
      {SLOW_WINDOWS.map((w) => (
        <Sequence key={`whoosh-${w.start}`} from={Math.max(0, w.start - 9)}>
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.45} />
        </Sequence>
      ))}
      <Sequence from={TEXT_IN}>
        <Audio src={staticFile("sfx/chime.wav")} volume={0.5} />
      </Sequence>
    </AbsoluteFill>
  );
};
