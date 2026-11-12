import React, { useContext } from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/fonts";
import { clamp } from "../onion/components";
import { DEVA } from "../onion/theme";
import { HANDLE } from "../explainer/Explainer";
import { Jugnu, Moon, NIGHT, Stars } from "./art";
import { SCENES } from "./scenes";
import story from "./story.json";
import { BeatCtx, FPS, type Line, type Who } from "./timing";

// "परी और जुगनू" — a gentle Hindi bedtime story for small children.
// Lines, voices and timings live in story.json (filled in by
// scripts/story_tts.py); this file chains the scenes with slow crossfades,
// lays the voices over a soft lullaby, and shows each line as a caption.

loadFont({ family: "Poppins", url: staticFile("fonts/Poppins-Bold.woff2"), weight: "700" });

const FADE = 24; // crossfade between scenes, frames
const OUTRO_SECONDS = 5;

type Beat = { id: string; seconds: number; lines: Line[] };

const BEATS = story.beats as Beat[];

let t = 0;
const PLACED = BEATS.map((b) => {
  const frames = Math.round(b.seconds * FPS);
  const p = { ...b, start: t, frames };
  t += frames;
  return p;
});
const SCENES_END = t;
export const BEDTIME_TOTAL_FRAMES = SCENES_END + OUTRO_SECONDS * FPS;

// ---------------------------------------------------------------------------
// Captions

const SPEAKER: Record<Who, { name?: string; color: string }> = {
  n: { color: NIGHT.cream },
  p: { name: "परी", color: "#FFC6D6" },
  j: { name: "जुगनू", color: NIGHT.glow },
  c: { name: "चाँद मामा", color: "#FFF2C2" },
};

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { lines, lead } = useContext(BeatCtx);
  const sec = (frame - lead) / FPS;
  // keep the last line up through the short gaps between lines
  const idx = lines.findIndex((l, i) => sec >= l.start - 0.15 && sec < (lines[i + 1]?.start ?? l.end + 0.9) - 0.15);
  if (idx < 0) return null;
  const line = lines[idx];
  const until = lines[idx + 1] ? lines[idx + 1].start - 0.15 : line.end + 0.9;
  const o = Math.min(
    interpolate(sec, [line.start - 0.15, line.start + 0.2], [0, 1], clamp),
    interpolate(sec, [until - 0.3, until], [1, 0], clamp),
  );
  const s = SPEAKER[line.who];
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 170,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: o,
        transform: `translateY(${(1 - o) * 14}px)`,
      }}
    >
      {s.name && (
        <div
          style={{
            marginBottom: -18,
            zIndex: 1,
            padding: "6px 26px 10px",
            borderRadius: 999,
            background: s.color,
            color: NIGHT.sky0,
            fontFamily: DEVA,
            fontSize: 38,
          }}
        >
          {s.name}
        </div>
      )}
      <div
        style={{
          padding: "30px 40px 26px",
          borderRadius: 36,
          background: "rgba(11,18,51,0.62)",
          border: `2px solid ${s.name ? s.color : "rgba(255,247,230,0.25)"}`,
          color: s.color,
          fontFamily: DEVA,
          fontSize: 54,
          lineHeight: 1.45,
          textAlign: "center",
          textShadow: "0 2px 12px rgba(0,0,0,0.5)",
        }}
      >
        {line.who === "n" ? line.text : `“${line.text}”`}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// End card

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const inn = interpolate(frame, [0, 30], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const text = interpolate(frame, [20, 50], [0, 1], clamp);
  const out = interpolate(frame, [OUTRO_SECONDS * FPS - 30, OUTRO_SECONDS * FPS], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: inn * out, background: `linear-gradient(180deg, ${NIGHT.sky0}, ${NIGHT.sky1})` }}>
      <Stars count={60} seed={9} maxY={1} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
        <Moon size={360} closed={1} />
        <div style={{ opacity: text, fontFamily: DEVA, fontSize: 120, color: NIGHT.cream, textShadow: "0 0 40px rgba(255,226,122,0.5)" }}>
          शुभ रात्रि
        </div>
        <div style={{ opacity: text, fontFamily: DEVA, fontSize: 46, color: "#CFC6F5" }}>मीठे सपने देखना</div>
        <div style={{ opacity: text * 0.8, marginTop: 30, fontFamily: "Poppins", fontSize: 34, color: "#CFC6F5", letterSpacing: 1 }}>{HANDLE}</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 640 + Math.sin(frame / 20) * 60, top: 560 + Math.cos(frame / 26) * 40 }}>
        <Jugnu size={120} flip />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------

export const BedtimeStory: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NIGHT.sky0 }}>
    {PLACED.map((p, i) => {
      const Scene = SCENES[p.id];
      const lead = i > 0 ? FADE : 0;
      return (
        <Sequence key={p.id} from={p.start - lead} durationInFrames={p.frames + lead + FADE}>
          <BeatCtx.Provider value={{ lines: p.lines, lead }}>
            <FadeIn frames={i === 0 ? 30 : FADE}>
              <Scene />
              <Caption />
            </FadeIn>
          </BeatCtx.Provider>
        </Sequence>
      );
    })}

    <Sequence from={SCENES_END - 10}>
      <Outro />
    </Sequence>

    <Audio
      src={staticFile("bedtime/lullaby.mp3")}
      volume={(f) => 0.2 * interpolate(f, [BEDTIME_TOTAL_FRAMES - 60, BEDTIME_TOTAL_FRAMES], [1, 0], clamp)}
    />
    {PLACED.map((p) => (
      <Sequence key={`vo-${p.id}`} from={p.start}>
        <Audio src={staticFile(`bedtime/vo/${p.id}.mp3`)} volume={1} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

const FadeIn: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, frames], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
