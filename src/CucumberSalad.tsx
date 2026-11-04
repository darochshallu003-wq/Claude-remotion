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
export const TOTAL_FRAMES = timeline.totalFrames;
const SEGMENTS = timeline.segments;
const SLOW = SEGMENTS.filter((seg) => seg.speed !== 1);

/** Map a time in the original clip (seconds) to a frame in the edit. */
const srcToOut = (seconds: number) => {
  const f = seconds * FPS;
  const seg =
    SEGMENTS.find((x) => f >= x.srcStart && f < x.srcEnd) ??
    SEGMENTS[SEGMENTS.length - 1];
  return Math.round(seg.outStart + (f - seg.srcStart) / seg.speed);
};

type Item = { name: string; color: string; at: number };
type Group = { until: number; items: Item[] };

// `at` = moment the ingredient lands in the bowl, in seconds of the
// original clip. `until` = when the group's labels leave, same clock.
const GROUPS: Group[] = [
  {
    until: 23.8, // dressing is mixed; cucumber comes next
    items: [
      { name: "Greek Yogurt", color: "#7fb6d9", at: 16.75 },
      { name: "Salt", color: "#b9c2cc", at: 17.6 }, // from the shaker
      { name: "Black Pepper", color: "#3a3a3a", at: 18.3 }, // from the spoon
      { name: "Chilli Flakes", color: "#e0452b", at: 18.6 },
      { name: "Fresh Coriander", color: "#2f8f3a", at: 19.0 },
    ],
  },
  {
    until: 29.5,
    items: [{ name: "Cucumber", color: "#3f9b3a", at: 24.0 }],
  },
  {
    until: 36.2, // before the final hero shot
    items: [
      { name: "Sesame Seeds", color: "#d9b77a", at: 29.7 },
      { name: "Pomegranate Seeds", color: "#c0182f", at: 30.9 },
    ],
  },
];

// Music: the track runs out before the slowed-down edit does, so at a
// downbeat it crossfades 8 bars (32 beats at ~123 BPM) back into itself.
const MUSIC_JUMP_AT = 31.241; // edit time, seconds
const MUSIC_JUMP_TO = 15.638; // track time, seconds
const XFADE = 0.4; // seconds
const MUSIC_VOLUME = 0.85;

const Label: React.FC<{ item: Item; inFrame: number; outFrame: number }> = ({
  item,
  inFrame,
  outFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - inFrame,
    fps,
    config: { damping: 13, stiffness: 170 },
  });
  const exit = interpolate(frame, [outFrame - 10, outFrame], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 21,
        padding: "20px 42px 20px 27px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.94)",
        boxShadow: "0 9px 27px rgba(0,0,0,0.28)",
        opacity: Math.min(enter, exit),
        transform: `translateX(${(1 - enter) * -90}px) scale(${
          0.85 + 0.15 * enter
        })`,
      }}
    >
      <div
        style={{
          width: 33,
          height: 33,
          borderRadius: 999,
          background: item.color,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 60,
          color: "#1d3b1a",
          whiteSpace: "nowrap",
        }}
      >
        {item.name}
      </span>
    </div>
  );
};

/** 0..1 strength of the slow-motion look at this frame (eased in and out). */
const slowMoAmount = (frame: number) => {
  for (const seg of SLOW) {
    if (frame >= seg.outStart - 6 && frame < seg.outEnd + 6) {
      return interpolate(
        frame,
        [seg.outStart - 6, seg.outStart + 6, seg.outEnd - 6, seg.outEnd + 6],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
  }
  return 0;
};

/** Slow zoom-in across each slow-motion shot. */
const slowMoZoom = (frame: number) => {
  for (const seg of SLOW) {
    if (frame >= seg.outStart && frame < seg.outEnd + 12) {
      const push = interpolate(frame, [seg.outStart, seg.outEnd], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.sin),
      });
      const release = interpolate(
        frame,
        [seg.outEnd, seg.outEnd + 12],
        [1, 0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        }
      );
      return 1 + 0.07 * push * release;
    }
  }
  return 1;
};

const Music: React.FC = () => {
  const jump = Math.round(MUSIC_JUMP_AT * FPS);
  const half = Math.round((XFADE / 2) * FPS);
  const fadeOutStart = TOTAL_FRAMES - Math.round(1.5 * FPS);
  const tail = (f: number) =>
    interpolate(f, [fadeOutStart, TOTAL_FRAMES], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  return (
    <>
      <Sequence durationInFrames={jump + half}>
        <Audio
          src={staticFile("cucumber-salad.mp4")}
          volume={(f) =>
            MUSIC_VOLUME *
            interpolate(f, [jump - half, jump + half], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          }
        />
      </Sequence>
      <Sequence from={jump - half}>
        <Audio
          src={staticFile("cucumber-salad.mp4")}
          trimBefore={Math.round(MUSIC_JUMP_TO * FPS) - half}
          volume={(f) =>
            MUSIC_VOLUME *
            interpolate(f, [0, 2 * half], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }) *
            tail(f + jump - half)
          }
        />
      </Sequence>
    </>
  );
};

export const CucumberSalad: React.FC = () => {
  const frame = useCurrentFrame();
  const slow = slowMoAmount(frame);
  const zoom = slowMoZoom(frame);

  const labels = GROUPS.flatMap((g) =>
    g.items.map((item) => ({
      item,
      inFrame: srcToOut(item.at),
      outFrame: srcToOut(g.until),
    }))
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo src={staticFile("cucumber-salad-graded.mp4")} muted />
      </AbsoluteFill>

      {/* Soft vignette during slow motion */}
      <AbsoluteFill
        style={{
          opacity: slow * 0.55,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.75) 100%)",
        }}
      />

      {/* Labels: lower-middle, clear of the logo at the top and the
          YouTube Shorts buttons and caption at the bottom. */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "0 0 495px 54px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 21 }}>
          {labels
            .filter((l) => frame >= l.inFrame && frame < l.outFrame)
            .map((l) => (
              <Label key={l.item.name} {...l} />
            ))}
        </div>
      </AbsoluteFill>

      <Music />

      {labels.map((l) => (
        <Sequence key={`pop-${l.item.name}`} from={l.inFrame}>
          <Audio src={staticFile("sfx/pop.wav")} volume={0.55} />
        </Sequence>
      ))}
      {SLOW.map((seg) => (
        <Sequence key={`whoosh-${seg.outStart}`} from={seg.outStart - 9}>
          <Audio src={staticFile("sfx/whoosh.wav")} volume={0.5} />
        </Sequence>
      ))}
      <Sequence from={SLOW[SLOW.length - 1].outStart + 8}>
        <Audio src={staticFile("sfx/chime.wav")} volume={0.45} />
      </Sequence>
    </AbsoluteFill>
  );
};
