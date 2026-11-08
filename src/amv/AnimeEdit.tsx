import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import {
  AUDIO,
  AUDIO_START_SECONDS,
  AMV_TOTAL_FRAMES,
  beatFrames,
  CAPTIONS,
  FPS,
  HANDLE,
  SHOTS,
  type Caption,
  type Shot,
} from "./edit";
import { rnd, SCENES } from "./scenes";

// Beat-synced anime edit (AMV short) in the style of the reference:
// hard cuts on the beat, zoom punches, camera shake, white flashes,
// RGB split, a cinematic grade with grain + vignette, and lyric-style
// captions (top banner, glowing italic, slam words).

loadFont({ family: "Poppins", url: staticFile("fonts/Poppins-Bold.woff2"), weight: "700" });
const FONT = "Poppins, sans-serif";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Start frame of every shot, rounded so shots tile the timeline exactly. */
const timeline = (() => {
  let beat = 0;
  return SHOTS.map((shot) => {
    const from = Math.round(beatFrames(beat));
    beat += shot.beats;
    const to = Math.round(beatFrames(beat));
    return { shot, from, dur: to - from };
  });
})();

const ShotBody: React.FC<{ shot: Shot; t: number; g: number }> = ({ shot, t, g }) => {
  if ("clip" in shot) {
    return (
      <OffthreadVideo
        src={staticFile(shot.clip)}
        muted
        startFrom={Math.round((shot.from ?? 0) * FPS)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    );
  }
  const Scene = SCENES[shot.scene];
  return <Scene t={t} g={g} />;
};

/** Chromatic aberration: red and cyan copies offset left/right, screened. */
const RgbSplit: React.FC<{ amount: number; children: React.ReactNode }> = ({ amount, children }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <filter id="onlyR">
        <feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
      </filter>
      <filter id="onlyGB">
        <feColorMatrix values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
      </filter>
    </svg>
    <AbsoluteFill style={{ filter: "url(#onlyR)", transform: `translateX(${-amount}px)`, mixBlendMode: "screen" }}>
      {children}
    </AbsoluteFill>
    <AbsoluteFill style={{ filter: "url(#onlyGB)", transform: `translateX(${amount}px)`, mixBlendMode: "screen" }}>
      {children}
    </AbsoluteFill>
  </AbsoluteFill>
);

const ShotLayer: React.FC<{ shot: Shot; dur: number; from: number }> = ({ shot, dur, from }) => {
  const t = useCurrentFrame();
  const g = from + t;
  const fx = new Set(shot.fx ?? []);

  let scale = 1;
  if (fx.has("punch")) scale *= interpolate(t, [0, 6], [1.22, 1.04], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (fx.has("slowzoom")) scale *= interpolate(t, [0, dur], [1.0, 1.12], clamp);

  let dx = 0;
  let dy = 0;
  let rot = 0;
  if (fx.has("shake")) {
    const k = interpolate(t, [0, 10], [38, 4], clamp);
    dx = (rnd(g * 1.7) - 0.5) * 2 * k;
    dy = (rnd(g * 2.3 + 5) - 0.5) * 2 * k;
    rot = (rnd(g * 3.1) - 0.5) * k * 0.08;
  }
  if (fx.has("spin")) rot += interpolate(t, [0, 7], [-9, 0], { ...clamp, easing: Easing.out(Easing.cubic) });

  const rgbAmt = fx.has("rgb") ? interpolate(t, [0, 8], [22, 5], clamp) : 0;
  const body = <ShotBody shot={shot} t={t} g={g} />;

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${scale})`,
          filter: fx.has("invert") && t < 3 ? "invert(1) hue-rotate(180deg)" : undefined,
        }}
      >
        {rgbAmt > 0 ? <RgbSplit amount={rgbAmt}>{body}</RgbSplit> : body}
      </AbsoluteFill>
      {fx.has("flash") && (
        <AbsoluteFill style={{ background: "#fff", opacity: interpolate(t, [0, 5], [0.95, 0], clamp) }} />
      )}
    </AbsoluteFill>
  );
};

/** Film grain that changes every frame. */
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.22, pointerEvents: "none" }}>
      <svg width="100%" height="100%">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 97} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Subtle brightness bump on every beat so even long shots feel the music. */
const useBeatPulse = () => {
  const f = useCurrentFrame();
  const bf = beatFrames(1);
  const into = f % bf;
  return interpolate(into, [0, 4], [1.12, 1], clamp);
};

const CaptionView: React.FC<{ c: Caption; dur: number }> = ({ c, dur }) => {
  const t = useCurrentFrame();
  const out = interpolate(t, [dur - 5, dur], [1, 0], clamp);

  if (c.style === "banner") {
    // White strip across the top with italic quoted title, as in the reference.
    const slide = interpolate(t, [0, 8], [-180, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
    return (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 190,
          paddingTop: 70,
          background: "#fff",
          transform: `translateY(${slide}px)`,
          opacity: out,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: FONT,
          fontStyle: "italic",
          fontSize: 52,
          letterSpacing: 6,
          color: "#111",
          boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        }}
      >
        {c.text}
      </div>
    );
  }

  if (c.style === "glow") {
    // Letter-by-letter reveal with a red/white glow (reference: "Summoning Jutsu").
    const shown = Math.floor(interpolate(t, [0, Math.min(dur * 0.6, 24)], [0, c.text.length], clamp));
    return (
      <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 560, opacity: out }}>
        <div
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: 74,
            letterSpacing: 4,
            color: "#ffecec",
            textShadow: "0 0 12px #ff2a2a, 0 0 32px #ff0000, 0 0 64px #a00000",
            padding: "0 60px",
            textAlign: "center",
          }}
        >
          {c.text.split("").map((ch, i) => (
            <span key={i} style={{ opacity: i < shown ? 1 : 0 }}>
              {ch}
            </span>
          ))}
        </div>
      </AbsoluteFill>
    );
  }

  // slam: huge word that hits on the beat and settles
  const s = interpolate(t, [0, 4], [2.4, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const o = interpolate(t, [0, 2], [0, 1], clamp) * out;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: 180,
          letterSpacing: 4,
          color: "#fff",
          transform: `scale(${s}) skewX(-8deg)`,
          opacity: o,
          WebkitTextStroke: "4px #000",
          textShadow: "-8px 0 0 rgba(255,0,60,0.85), 8px 0 0 rgba(0,220,255,0.85), 0 0 50px rgba(0,0,0,0.8)",
          textAlign: "center",
          lineHeight: 1,
          padding: "0 40px",
        }}
      >
        {c.text}
      </div>
    </AbsoluteFill>
  );
};

export const AnimeEdit: React.FC = () => {
  const f = useCurrentFrame();
  const pulse = useBeatPulse();
  const fadeIn = interpolate(f, [0, 8], [0, 1], clamp);
  const fadeOut = interpolate(f, [AMV_TOTAL_FRAMES - 20, AMV_TOTAL_FRAMES - 2], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill
        style={{
          filter: `contrast(1.18) saturate(1.25) brightness(${pulse})`,
          opacity: fadeIn * fadeOut,
        }}
      >
        {timeline.map(({ shot, from, dur }, i) => (
          <Sequence key={i} from={from} durationInFrames={i === timeline.length - 1 ? AMV_TOTAL_FRAMES - from : dur}>
            <ShotLayer shot={shot} dur={dur} from={from} />
          </Sequence>
        ))}
        {/* vignette */}
        <AbsoluteFill
          style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.75) 100%)" }}
        />
        <Grain />
      </AbsoluteFill>

      {CAPTIONS.map((c, i) => {
        const from = Math.round(beatFrames(c.atBeat));
        const dur = Math.round(beatFrames(c.beats));
        return (
          <Sequence key={`c${i}`} from={from} durationInFrames={dur}>
            <CaptionView c={c} dur={dur} />
          </Sequence>
        );
      })}

      {/* creator signature, bottom-right like the reference tags */}
      <div
        style={{
          position: "absolute",
          bottom: 330,
          right: 60,
          fontFamily: FONT,
          fontStyle: "italic",
          fontSize: 34,
          color: "#ffe36b",
          textShadow: "0 0 10px #ff9a00, 2px 2px 0 #000",
          opacity: 0.85 * fadeOut,
          letterSpacing: 2,
        }}
      >
        {HANDLE}
      </div>

      <Audio
        src={staticFile(AUDIO)}
        startFrom={Math.round(AUDIO_START_SECONDS * FPS)}
        volume={(fr) => interpolate(fr, [AMV_TOTAL_FRAMES - 24, AMV_TOTAL_FRAMES], [1, 0], clamp)}
      />
    </AbsoluteFill>
  );
};
