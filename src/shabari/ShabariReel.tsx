import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { SCENES } from "./scenes";

// "Shabari maa waited her whole life for Shri Ram": a ~35 s vertical reel.
// Seven illustrated scenes cross-fade into each other under a fixed caption,
// then a black end card types out the title. Music: public/shabari/music.wav
// from scripts/shabari_music.py.

const FONT = "Poppins";
loadFont({ family: FONT, url: staticFile("fonts/Poppins-Bold.woff2"), weight: "700" });

const XFADE = 15;
const END_FRAMES = 150;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const placed = (() => {
  let t = 0;
  return SCENES.map((s, i) => {
    const start = i === 0 ? 0 : t - XFADE;
    t = start + s.frames;
    return { ...s, start };
  });
})();

const scenesEnd = placed[placed.length - 1].start + placed[placed.length - 1].frames;
const endStart = scenesEnd - XFADE;
export const SHABARI_TOTAL_FRAMES = endStart + END_FRAMES;

const FadeIn: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const o = first ? interpolate(frame, [0, 20], [0, 1], clamp) : interpolate(frame, [0, XFADE], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Heart: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 32 30" width={size} height={size * 0.94} style={{ display: "inline-block", verticalAlign: "-0.12em", marginLeft: 8 }}>
    <path d="M16 28 C 6 20, 1 14, 1 8.5 C 1 4.5, 4 1.5, 8 1.5 C 11.5 1.5, 14 3.5, 16 6.5 C 18 3.5, 20.5 1.5, 24 1.5 C 28 1.5, 31 4.5, 31 8.5 C 31 14, 26 20, 16 28 Z" fill="#E0233A" />
    <path d="M7 6 C 5 7, 4.5 9, 5 11" stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7} />
  </svg>
);

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [6, 22, endStart - 4, endStart + 10], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 210, opacity: o }}>
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 14,
          padding: "12px 26px 14px",
          whiteSpace: "nowrap",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 44,
          lineHeight: 1.22,
          color: "#111111",
          boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
        }}
      >
        Shabari maa waited her whole life
        <br />
        for Shri Ram
        <Heart size={40} />
      </div>
    </AbsoluteFill>
  );
};

const TITLE = "SHABARI KE BER";
const LINE = "Prem mein, jootha bhi prasad ban gaya";

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const bg = interpolate(frame, [0, XFADE], [0, 1], clamp);
  const typed = Math.floor(interpolate(frame, [22, 22 + TITLE.length * 3], [0, TITLE.length], clamp));
  const cursorOn = Math.floor(frame / 12) % 2 === 0 || (typed > 0 && typed < TITLE.length);
  const line = interpolate(frame, [75, 100], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  const out = interpolate(frame, [END_FRAMES - 20, END_FRAMES], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${bg})`, justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: out, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 64, letterSpacing: 4, color: "#FFFFFF", whiteSpace: "pre" }}>
          {TITLE.slice(0, typed)}
          <span style={{ opacity: cursorOn ? 1 : 0, fontWeight: 400, marginLeft: 4 }}>|</span>
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 34,
            color: "#F4C477",
            opacity: line,
            transform: `translateY(${(1 - line) * 14}px)`,
          }}
        >
          {LINE}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const ShabariReel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "black" }}>
    {placed.map(({ id, Comp, start, frames }, i) => (
      <Sequence key={id} from={start} durationInFrames={frames + (i === placed.length - 1 ? XFADE : 0)}>
        <FadeIn first={i === 0}>
          <Comp />
        </FadeIn>
      </Sequence>
    ))}
    <Caption />
    <Sequence from={endStart}>
      <EndCard />
    </Sequence>
    <Audio
      src={staticFile("shabari/music.wav")}
      volume={(f) => 0.9 * interpolate(f, [0, 20, SHABARI_TOTAL_FRAMES - 45, SHABARI_TOTAL_FRAMES], [0, 1, 1, 0], clamp)}
    />
  </AbsoluteFill>
);
