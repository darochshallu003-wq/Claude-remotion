import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Presenter, Pose } from "./Presenter";
import { SCENES } from "./scenes";
import script from "./script.json";
import timing from "./timing.json";
import { BeatContext, BeatTiming, BOLD, FPS, K, MONO, pop, segments } from "./ui";

// "Aasmaan neela kyun hai? — 6 steps mein": a step-by-step science short in
// the talking-presenter format. A presenter stands at the bottom and talks
// through a speech bubble captioned word by word; the top carries a
// `// step N` kicker, a title and a numbered badge with progress dots; the
// middle is a sticker card that changes per step. Voice and word timings come
// from scripts/vo_words.py aasmaan.
//
// Facts: sunlight is a mix of all visible colours; red light is ~700 nm,
// blue ~450 nm; N2 and O2 molecules are ~0.3 nm, thousands of times smaller
// than visible wavelengths, so they Rayleigh-scatter with strength ∝ 1/λ⁴,
// (700/450)⁴ ≈ 5.9 times more for blue than red. Scattered blue reaches the
// eye from every direction of the sky. At sunset sunlight crosses far more
// air, the blue is scattered out on the way and red/orange is left. Violet
// scatters even more, but the sun emits less of it, the upper atmosphere
// absorbs some and our eyes are less sensitive to it (left for "part 2").

export const HANDLE = "@mythmitao";
const STEPS = 6;
const TAIL = 66; // frames held after the last line

type Meta = { step: number; kicker?: string; title?: string; done?: boolean };
const META: Record<string, Meta> = {
  hook: { step: 0 },
  white: { step: 1, kicker: "sunlight", title: "dhoop *safed* hai?" },
  wave: { step: 2, kicker: "wavelength", title: "har rang ek *lehar*" },
  air: { step: 3, kicker: "N₂ + O₂", title: "hawa ke *molecules*" },
  scatter: { step: 4, kicker: "Rayleigh scattering", title: "neela *bikharta* hai" },
  eye: { step: 5, kicker: "aankh", title: "har taraf se *neela*" },
  sunset: { step: 6, kicker: "sunset", title: "shaam ko *laal* kyun?" },
  recap: { step: 6, kicker: "poora flow", title: "*6 steps*, ek aasmaan", done: true },
  cta: { step: 0 },
};

type Chunk = { cap: string; pose: Pose; start: number; end: number; words: number[][]; beat: number };

const T = timing as Record<string, BeatTiming>;
const beats = (script.beats as { id: string; chunks: { cap: string; pose: string }[] }[]).map((b, i, all) => {
  const start = all.slice(0, i).reduce((s, x) => s + Math.round(T[x.id].seconds * FPS), 0);
  return { id: b.id, start, frames: Math.round(T[b.id].seconds * FPS), meta: META[b.id], timing: T[b.id], chunks: b.chunks };
});
const scenesEnd = beats[beats.length - 1].start + beats[beats.length - 1].frames;
export const AASMAAN_TOTAL_FRAMES = scenesEnd + TAIL;

// every caption chunk on the global timeline, in frames (voice starts 4 frames into a beat)
const CHUNKS: Chunk[] = beats.flatMap((b, bi) =>
  b.chunks.map((c, i) => {
    const t = b.timing.chunks[i];
    const f = (s: number) => b.start + 4 + s * FPS;
    return {
      cap: c.cap,
      pose: c.pose as Pose,
      start: f(t.start),
      end: f(t.end),
      words: t.words.map(([s, e]) => [f(s), f(e)]),
      beat: bi,
    };
  }),
);

const DotGrid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: K.paper,
      backgroundImage: `radial-gradient(${K.dot} 2.6px, transparent 3px)`,
      backgroundSize: "40px 40px",
      backgroundPosition: "20px 20px",
    }}
  />
);

const Title: React.FC<{ text: string; size: number }> = ({ text, size }) => (
  <span style={{ fontFamily: BOLD, fontSize: size, color: K.ink, letterSpacing: -1 }}>
    {segments(text).map((s, i) =>
      s.hl ? (
        <span key={i} style={{ color: K.pink, fontStyle: "italic", display: "inline-block", transform: "skewX(-8deg)", margin: "0 6px" }}>
          {s.text}
        </span>
      ) : (
        <span key={i}>{s.text}</span>
      ),
    )}
  </span>
);

const Header: React.FC<{ frame: number }> = ({ frame }) => {
  const bi = beats.findIndex((b) => frame >= b.start && frame < b.start + b.frames);
  const b = beats[bi < 0 ? beats.length - 1 : bi];
  const m = b.meta;
  const local = frame - b.start;
  const show = m.step > 0;
  const prevStep = bi > 0 ? beats[bi - 1].meta.step : 0;
  // header slides in at each beat; badge pops only when the step number changes
  const p = pop(local, 2, 16, 150);
  const out = interpolate(local, [b.frames - 8, b.frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nextShows = beats[bi + 1]?.meta.step > 0;
  const fade = show ? (nextShows ? 1 : out) : 0;
  const badge = m.step !== prevStep || m.done ? pop(local, 4, 9, 200) : 1;
  const kickerChars = Math.floor(interpolate(local, [0, 16], [0, 40], { extrapolateRight: "clamp" }));
  const kicker = `// step ${m.step} · ${m.kicker ?? ""}`;
  const badgeColor = m.done ? K.teal : K.orange;
  if (!show) return null;
  return (
    <div style={{ position: "absolute", left: 64, right: 64, top: 168, height: 200, opacity: fade }}>
      <div style={{ fontFamily: MONO, fontSize: 36, color: K.purple, letterSpacing: 0.5 }}>
        {kicker.slice(0, kickerChars)}
        <span style={{ opacity: local % 20 < 10 && kickerChars < kicker.length + 4 ? 1 : 0 }}>▍</span>
      </div>
      <div style={{ marginTop: 6, maxWidth: 740, opacity: p, transform: `translateY(${(1 - p) * 26}px)` }}>
        <Title text={m.title ?? ""} size={(m.title ?? "").replace(/\*/g, "").length > 17 ? 62 : 74} />
      </div>
      {/* step badge with progress dots */}
      <div style={{ position: "absolute", right: 0, top: -6, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 32,
            background: badgeColor,
            border: `6px solid ${K.ink}`,
            boxShadow: `8px 8px 0 ${K.ink}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: BOLD,
            fontSize: 108,
            color: K.ink,
            transform: `scale(${0.4 + 0.6 * badge}) rotate(${(1 - badge) * -20}deg)`,
          }}
        >
          <span style={{ marginTop: 10 }}>{m.step}</span>
        </div>
        <div style={{ display: "flex", gap: 9 }}>
          {Array.from({ length: STEPS }, (_, i) => {
            const done = m.done || i + 1 < m.step;
            const cur = !m.done && i + 1 === m.step;
            return (
              <div
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  border: `3.5px solid ${K.ink}`,
                  background: done ? K.teal : cur ? K.orange : "transparent",
                  transform: cur ? `scale(${1 + 0.25 * Math.sin(frame / 5)})` : undefined,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** Speech bubble beside the presenter, filled word by word as it is spoken. */
const Bubble: React.FC<{ frame: number }> = ({ frame }) => {
  let ci = -1;
  for (let i = 0; i < CHUNKS.length; i++) if (CHUNKS[i].start - 2 <= frame) ci = i;
  if (ci < 0) return null;
  const c = CHUNKS[ci];
  const next = CHUNKS[ci + 1];
  const until = Math.min(next ? next.start - 2 : Infinity, c.end + 24);
  if (frame >= until) return null;
  const p = pop(frame, c.start - 2, 12, 260);
  const segs = segments(c.cap).map((g) => ({ hl: g.hl, words: g.text.split(" ").filter(Boolean) }));
  const total = segs.reduce((n, g) => n + g.words.length, 0);
  // a caption word lights up when its spoken word starts; if the caption and
  // the voice have different word counts, spread the caption over the chunk
  const when = (i: number) => (total === c.words.length ? c.words[i][0] : c.start + ((c.end - c.start) * i) / total);
  let wi = 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 560,
        top: 1388,
        maxWidth: 470,
        transformOrigin: "0% 70%",
        transform: `scale(${0.6 + 0.4 * p})`,
        opacity: Math.min(1, p * 2.5),
      }}
    >
      <div
        style={{
          position: "relative",
          background: K.white,
          border: `5px solid ${K.ink}`,
          borderRadius: 28,
          boxShadow: `7px 7px 0 ${K.ink}`,
          padding: "16px 26px 18px",
          fontFamily: BOLD,
          fontSize: 46,
          lineHeight: 1.22,
          color: K.ink,
        }}
      >
        {/* tail pointing at the presenter */}
        <svg width="46" height="44" viewBox="0 0 46 44" style={{ position: "absolute", left: -40, top: 30 }}>
          <path d="M44 4 L 4 24 L 44 40" fill={K.white} stroke={K.ink} strokeWidth={5} strokeLinejoin="round" />
          <rect x="40" y="8" width="10" height="28" fill={K.white} />
        </svg>
        {segs.map((g, gi) => {
          const first = wi;
          wi += g.words.length;
          const words = g.words.map((w, k) => {
            const said = frame >= when(first + k) - 1;
            return (
              <span key={k} style={{ color: g.hl ? K.white : said ? K.ink : K.muted, opacity: g.hl && !said ? 0.55 : 1 }}>
                {w}
                {k < g.words.length - 1 ? " " : ""}
              </span>
            );
          });
          return (
            <React.Fragment key={gi}>
              {g.hl ? (
                <span
                  style={{
                    background: frame >= when(first) - 1 ? K.purple : "#CFC6FF",
                    borderRadius: 12,
                    padding: "0 10px",
                    boxDecorationBreak: "clone",
                    WebkitBoxDecorationBreak: "clone",
                  }}
                >
                  {words}
                </span>
              ) : (
                words
              )}{" "}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const Speaker: React.FC<{ frame: number }> = ({ frame }) => {
  let ci = -1;
  for (let i = 0; i < CHUNKS.length; i++) if (CHUNKS[i].start - 4 <= frame) ci = i;
  const pose: Pose = ci < 0 ? "rest" : CHUNKS[ci].pose;
  const prevPose: Pose = ci < 1 ? "rest" : CHUNKS[ci - 1].pose;
  const poseT = ci < 0 ? 1 : pop(frame, CHUNKS[ci].start - 4, 14, 190);
  let mouth = 0;
  for (const c of CHUNKS) {
    if (frame < c.start - 1 || frame > c.end + 1) continue;
    for (const [s, e] of c.words) {
      if (frame >= s && frame <= e) mouth = 0.25 + 0.75 * Math.abs(Math.sin((Math.PI * (frame - s)) / Math.max(2, (e - s) / 1.6)));
    }
  }
  const enter = pop(frame, 0, 14, 120);
  return (
    <div style={{ position: "absolute", left: -30, bottom: -40, transform: `translateY(${(1 - enter) * 300}px)` }}>
      <Presenter width={600} frame={frame} pose={pose} prevPose={prevPose} poseT={poseT} mouth={mouth} />
    </div>
  );
};

const Watermark: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 96,
      left: 64,
      padding: "6px 18px",
      borderRadius: 999,
      border: `3px solid ${K.ink}`,
      background: K.white,
      fontFamily: MONO,
      fontSize: 26,
      color: K.ink,
    }}
  >
    {HANDLE}
  </div>
);

/** Card area: each beat's scene pops in, and shrinks away at its end. */
const Stage: React.FC<{ frames: number; last: boolean; children: React.ReactNode }> = ({ frames, last, children }) => {
  const f = useCurrentFrame();
  const p = pop(f, 0, 14, 160);
  const out = last ? 0 : interpolate(f, [frames - 7, frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(1, p * 2) * (1 - out),
        transform: `translateY(${(1 - p) * 60 - out * 40}px) scale(${0.92 + 0.08 * p - out * 0.06})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const AasmaanSteps: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DotGrid />
      {beats.map((b, i) => {
        const Scene = SCENES[b.id];
        const last = i === beats.length - 1;
        const len = b.frames + (last ? TAIL : 0);
        return (
          <Sequence key={b.id} from={b.start} durationInFrames={len}>
            <BeatContext.Provider value={{ frames: len, chunks: b.timing.chunks }}>
              <Stage frames={len} last={last}>
                <Scene />
              </Stage>
            </BeatContext.Provider>
          </Sequence>
        );
      })}
      <Header frame={frame} />
      <Watermark />
      <Speaker frame={frame} />
      <Bubble frame={frame} />

      <Audio
        src={staticFile("onion/music.wav")}
        volume={(f) => 0.11 * interpolate(f, [AASMAAN_TOTAL_FRAMES - 45, AASMAAN_TOTAL_FRAMES], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
      {beats.map((b, i) => (
        <React.Fragment key={`sfx-${b.id}`}>
          {i > 0 && (
            <Sequence from={b.start - 3}>
              <Audio src={staticFile("sfx/whoosh.wav")} volume={0.22} />
            </Sequence>
          )}
          {b.meta.step > 0 && (b.meta.step !== beats[i - 1]?.meta.step || b.meta.done) && (
            <Sequence from={b.start + 4}>
              <Audio src={staticFile("sfx/pop.wav")} volume={0.4} />
            </Sequence>
          )}
          <Sequence from={b.start + 4}>
            <Audio src={staticFile(`aasmaan/vo/${b.id}.mp3`)} volume={1} />
          </Sequence>
        </React.Fragment>
      ))}
      <Sequence from={scenesEnd + 6}>
        <Audio src={staticFile("sfx/chime.wav")} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};
