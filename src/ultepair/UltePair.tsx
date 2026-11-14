import { loadFont } from "@remotion/fonts";
import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp } from "./art";
import { SCENES } from "./scenes";
import { at, FPS, sceneAt, SceneCtx, TIMELINE, TOTAL_FRAMES } from "./timeline";

// "उल्टे पैर" — an original 16:9 village horror-comedy short.
// Chains the scenes on the voice timeline, then lays voices, ambience, music
// and sound effects underneath and Hindi subtitles on top.

loadFont({ family: "Rozha One", url: staticFile("fonts/RozhaOne-Regular.ttf") });
loadFont({ family: "Mukta", url: staticFile("fonts/Mukta-Bold.ttf"), weight: "700" });

export const ULTEPAIR_TOTAL_FRAMES = TOTAL_FRAMES;
export const ULTEPAIR_FPS = FPS;

const FADE_IN: Record<string, number> = { title: 18, scare: 0, chase: 0 };
const FADE_OUT: Record<string, number> = { scare: 0, tree: 0, end: 0 };

const NAMES: Record<string, [string, string]> = {
  B: ["भोला", "#8fd19e"],
  D: ["दादी", "#ffcf7a"],
  W: ["कमला", "#ff8a7a"],
};

const Faded: React.FC<{ id: string; dur: number; children: React.ReactNode }> = ({ id, dur, children }) => {
  const f = useCurrentFrame();
  const fi = FADE_IN[id] ?? 8;
  const fo = FADE_OUT[id] ?? 6;
  const o = Math.min(fi ? interpolate(f, [0, fi], [0, 1], clamp) : 1, fo ? interpolate(f, [dur - fo, dur], [1, 0], clamp) : 1);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Subtitles: React.FC = () => {
  const f = useCurrentFrame();
  for (const sc of TIMELINE) {
    if (sc.id === "end" && f >= sc.from + sc.lines[2].start) return null; // CTA card has its own text
    for (const l of sc.lines) {
      const s = sc.from + l.start;
      const e = sc.from + l.end + 6;
      if (f >= s && f < e) {
        const o = Math.min(interpolate(f, [s, s + 4], [0, 1], clamp), interpolate(f, [e - 4, e], [1, 0], clamp));
        const name = NAMES[l.who];
        return (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, display: "flex", justifyContent: "center", opacity: o }}>
            <div
              style={{
                maxWidth: 1500,
                padding: "10px 34px 14px",
                borderRadius: 18,
                background: "rgba(0,0,0,0.62)",
                fontFamily: "Mukta",
                fontWeight: 700,
                fontSize: 50,
                lineHeight: 1.3,
                color: l.who === "W" ? "#ffd2cc" : "#fff",
                textAlign: "center",
              }}
            >
              {name && <span style={{ color: name[1], marginRight: 14 }}>{name[0]}:</span>}
              {l.text}
            </div>
          </div>
        );
      }
    }
  }
  return null;
};

const Watermark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 34,
      right: 44,
      padding: "6px 18px",
      borderRadius: 999,
      background: "rgba(0,0,0,0.35)",
      color: "rgba(255,255,255,0.85)",
      fontFamily: "Mukta",
      fontWeight: 700,
      fontSize: 28,
      letterSpacing: 1,
    }}
  >
    @mythmitao
  </div>
);

const sfx = (name: string) => staticFile(`sfx/horror/${name}.wav`);

const SoundDesign: React.FC = () => {
  const prints = sceneAt("prints");
  const chase = sceneAt("chase");
  const dadi = sceneAt("dadi");
  const droneDur = chase.from + chase.dur - prints.from;
  return (
    <>
      {/* night ambience under everything, quieter inside the courtyard */}
      <Audio
        src={sfx("ambience")}
        loop
        volume={(f) => (f >= dadi.from && f < sceneAt("end").from ? 0.18 : 0.38) * interpolate(f, [TOTAL_FRAMES - 40, TOTAL_FRAMES], [1, 0], clamp)}
      />
      <Sequence from={prints.from} durationInFrames={droneDur}>
        <Audio src={sfx("drone")} loop volume={(f) => 0.32 * Math.min(interpolate(f, [0, 60], [0, 1], clamp), interpolate(f, [droneDur - 30, droneDur], [1, 0], clamp))} />
      </Sequence>
      <Sequence from={sceneAt("fields").from + 15}>
        <Audio src={sfx("owl")} volume={0.5} />
      </Sequence>
      <Sequence from={at("p3", 2.2)}>
        <Audio src={sfx("payal")} volume={0.55} />
      </Sequence>
      <Sequence from={at("r1", 2.0)}>
        <Audio src={sfx("heartbeat")} volume={0.7} />
      </Sequence>
      <Sequence from={at("r2")}>
        <Audio src={sfx("payal")} volume={0.6} />
      </Sequence>
      <Sequence from={at("r3")}>
        <Audio src={sfx("heartbeat")} volume={0.8} />
      </Sequence>
      <Sequence from={at("r3", 1.1)}>
        <Audio src={sfx("heartbeat")} volume={0.8} />
      </Sequence>
      <Sequence from={at("s1") - 2}>
        <Audio src={sfx("stinger")} volume={0.75} />
      </Sequence>
      <Sequence from={at("s2", 0.75)}>
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.5} />
      </Sequence>
      <Sequence from={chase.from} durationInFrames={chase.dur}>
        <Audio src={sfx("run")} loop volume={0.45} />
      </Sequence>
      <Sequence from={at("c2")}>
        <Audio src={sfx("payal")} volume={0.5} />
      </Sequence>
      <Sequence from={at("d1") + 22} durationInFrames={18}>
        <Audio src={sfx("run")} volume={0.45} />
      </Sequence>
      <Sequence from={at("d1") + 46}>
        <Audio src={sfx("thud")} volume={0.8} />
      </Sequence>
      <Sequence from={at("d3", 0.9)}>
        <Audio src={staticFile("sfx/whoosh.wav")} volume={0.4} />
      </Sequence>
      <Sequence from={at("d4", 0.8)}>
        <Audio src={sfx("comic")} volume={0.55} />
      </Sequence>
      <Sequence from={at("w3", 1.2)}>
        <Audio src={sfx("comic")} volume={0.4} />
      </Sequence>
      <Sequence from={at("e2")}>
        <Audio src={sfx("chai")} volume={0.55} />
      </Sequence>
      <Sequence from={at("e3", 0.2)}>
        <Audio src={staticFile("sfx/chime.wav")} volume={0.35} />
      </Sequence>
      {/* voices */}
      {TIMELINE.flatMap((sc) =>
        sc.lines.map((l) => (
          <Sequence key={l.id} from={sc.from + l.start}>
            <Audio src={staticFile(`ultepair/vo/${l.id}.mp3`)} volume={1} />
          </Sequence>
        )),
      )}
    </>
  );
};

export const UltePair: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {TIMELINE.map((sc) => {
      const Scene = SCENES[sc.id];
      return (
        <Sequence key={sc.id} from={sc.from} durationInFrames={sc.dur}>
          <SceneCtx.Provider value={sc}>
            <Faded id={sc.id} dur={sc.dur}>
              <Scene />
            </Faded>
          </SceneCtx.Provider>
        </Sequence>
      );
    })}
    <Subtitles />
    <Watermark />
    <SoundDesign />
  </AbsoluteFill>
);
