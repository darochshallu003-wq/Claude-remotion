import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  clamp,
  CountUp,
  Header,
  Headline,
  PaperCard,
  Stamp,
  TypeOn,
  useCue,
  useEnter,
  useFloat,
} from "../onion/components";
import { C, DEVA, HEAD, MONO } from "../onion/theme";
import { AttarBottle, Beetroot, Geosmin, Nose, RAIN, RainOnSoil, RED, SOIL, Springtail, Streptomyces } from "./art";
import { Aman, AttarWale, Riya } from "./people";

// "Kraft paper" look for the short nature-mystery format: warm brown paper,
// black setup line + red punch line, red label tags, warm-black drama scenes.

const LAB = "SMELL FILES";
const INK = "#231F1C";

const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.5 }) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

const From: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (
  <Sequence from={at} layout="none">
    {children}
  </Sequence>
);

const Grain: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "multiply" }}>
    <svg width="100%" height="100%">
      <filter id="kraftgrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={3} seed={9} />
        <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.9 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#kraftgrain)" />
    </svg>
  </AbsoluteFill>
);

const KraftBg: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #D3B386 0%, #C4A271 60%, #A9875A 100%)" }}>
    <Grain opacity={0.35} />
    {/* faint folds and ruled grid */}
    <AbsoluteFill
      style={{
        backgroundImage:
          "linear-gradient(rgba(60,40,20,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(60,40,20,0.07) 2px, transparent 2px)",
        backgroundSize: "120px 120px",
      }}
    />
    <AbsoluteFill style={{ background: "linear-gradient(115deg, transparent 48%, rgba(255,255,255,0.12) 50%, transparent 52%)" }} />
  </AbsoluteFill>
);

const WarmDark: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #2E2824 0%, #171412 75%)" }}>
    <Grain opacity={0.5} />
  </AbsoluteFill>
);

/** Red label tag with white mono text. */
const Tag: React.FC<{ text: string; x: number; y: number; at: number; rotate?: number }> = ({ text, x, y, at, rotate = -2 }) => {
  const e = useEnter(at, { damping: 12, stiffness: 220 });
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "8px 18px",
        background: RED,
        color: "white",
        fontFamily: MONO,
        fontSize: 24,
        letterSpacing: 3,
        whiteSpace: "nowrap",
        transform: `rotate(${rotate}deg) scale(${e})`,
        transformOrigin: "left center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
      }}
    >
      {text}
    </div>
  );
};

/** Wavy scent lines drifting from (x0,y0) toward (x1,y1). */
const ScentWisps: React.FC<{ x0: number; y0: number; x1: number; y1: number; start: number }> = ({ x0, y0, x1, y1, start }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1080} height={1920}>
      {[0, 1, 2].map((i) => {
        const t = ((frame - start + i * 14) % 42) / 42;
        const x = x0 + (x1 - x0) * t;
        const y = y0 + (y1 - y0) * t + (i - 1) * 26;
        return (
          <path
            key={i}
            d={`M${x - 50} ${y} q 12 -14 25 0 q 12 14 25 0 q 12 -14 25 0 q 12 14 25 0`}
            fill="none"
            stroke={RED}
            strokeWidth={6}
            strokeLinecap="round"
            opacity={Math.sin(Math.PI * t)}
          />
        );
      })}
    </svg>
  );
};

/** Comic speech bubble with Devanagari text. */
const SpeechBubble: React.FC<{ text: string; x: number; y: number; at: number }> = ({ text, x, y, at }) => {
  const e = useEnter(at, { damping: 9, stiffness: 240 });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${e})`, transformOrigin: "left bottom" }}>
      <div style={{ padding: "10px 30px", borderRadius: 40, background: "white", border: `5px solid ${INK}`, fontFamily: DEVA, fontSize: 64, color: RED }}>{text}</div>
      <div style={{ position: "absolute", left: 30, bottom: -22, width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderTop: `24px solid ${INK}` }} />
    </div>
  );
};

// ===========================================================================

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const switchAt = cue(0.55);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="MONSOON · FIG. 01" right={LAB} dark={false} />
      {frame < switchAt ? (
        <Headline setup="Pehli baarish ki" punch="Woh khushboo…" dark={false} punchColor={RED} />
      ) : (
        <From at={switchAt}>
          <Headline setup="Par ye khushboo" punch="Aati kahan se hai?" dark={false} punchColor={RED} punchAt={2} delay={0} />
        </From>
      )}
      <PaperCard x={70} y={590} w={740} h={620} delay={cue(0.04)} rotate={-2} seed="rain">
        <RainOnSoil frame={frame} w={688} h={568} />
      </PaperCard>
      <Tag text="JUNE · PEHLI BAARISH" x={100} y={1250} at={cue(0.25)} />
      {/* Riya breathes in the first-rain smell */}
      <div style={{ position: "absolute", left: 650, top: 1010, opacity: useEnter(cue(0.08)) }}>
        <Riya size={340} expression={frame < switchAt ? "smell" : "neutral"} />
      </div>
      <ScentWisps x0={560} y0={1110} x1={760} y1={1200} start={cue(0.1)} />
      <Sfx at={switchAt} src="onion/tick.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

const Check: React.FC<{ y: number; at: number; text: string; ok: boolean }> = ({ y, at, text, ok }) => {
  const e = useEnter(at);
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [at + 8, at + 16], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 200, top: y, display: "flex", alignItems: "center", gap: 26, opacity: e }}>
      <div style={{ width: 70, height: 70, border: `5px solid ${INK}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: ok ? "#2F8F3A" : RED }}>
        {frame >= at + 8 ? (ok ? "✓" : "✗") : ""}
      </div>
      <span style={{ position: "relative", fontFamily: HEAD, fontWeight: 700, fontSize: 84, color: ok ? RED : INK, textTransform: "uppercase" }}>
        {text}
        {!ok && <span style={{ position: "absolute", left: 0, top: "52%", height: 7, width: `${strike * 100}%`, background: RED }} />}
      </span>
    </div>
  );
};

export const Not: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="SUSPECTS · FIG. 02" right={LAB} dark={false} />
      <Headline setup="Mitti? Baarish?" punch="Dono nahi!" dark={false} punchColor={RED} />
      <div style={{ position: "absolute", left: 130, right: 130, top: 620, height: 640, background: "#F1E7D2", boxShadow: "0 18px 30px rgba(0,0,0,0.3)", transform: "rotate(-1.5deg)" }}>
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: "#7A6A55" }}>KHUSHBOO KA SOURCE:</div>
      </div>
      <Check y={740} at={cue(0.05)} text="Mitti" ok={false} />
      <Check y={890} at={cue(0.22)} text="Baarish" ok={false} />
      <Check y={1040} at={cue(0.55)} text="Bacteria!" ok />
      <Sfx at={cue(0.05) + 8} src="onion/tick.wav" volume={0.5} />
      <Sfx at={cue(0.22) + 8} src="onion/tick.wav" volume={0.5} />
      <Sfx at={cue(0.55) + 8} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

export const Bacteria: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const grow = interpolate(frame, [cue(0.05), cue(0.45)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="MICROSCOPE · FIG. 03" right="UNDER THE SOIL" dark />
      <Headline setup="Mitti ke bacteria" punch="Streptomyces" dark punchColor={RED} />
      <div style={{ position: "absolute", left: 540 - 330, top: 570, width: 660, height: 660, borderRadius: "50%", background: "radial-gradient(circle, #3A332C 0%, #221D19 100%)", border: "10px solid #5A5048", overflow: "hidden", boxShadow: "inset 0 0 60px rgba(0,0,0,0.8)" }}>
        <div style={{ position: "absolute", left: 30, top: 30 }}>
          <Streptomyces size={600} grow={grow} />
        </div>
        {/* geosmin wafting up */}
        {new Array(8).fill(0).map((_, i) => {
          const s = cue(0.45) + i * 6;
          const t = ((frame - s) % 60) / 60;
          if (frame < s) return null;
          return <div key={i} style={{ position: "absolute", left: 120 + random(`g${i}`) * 400, top: 560 - t * 520, width: 22, height: 22, borderRadius: "50%", background: "#E8C27A", opacity: Math.sin(Math.PI * t) }} />;
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1250, textAlign: "center", opacity: useEnter(cue(0.4)) }}>
        <TypeOn text="GEOSMIN" start={cue(0.4)} cps={12} style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 110, color: C.cream }} />
      </div>
      <Tag text="GE = DHARTI · OSME = KHUSHBOO" x={230} y={1400} at={cue(0.72)} />
      <Sfx at={cue(0.4)} src="onion/sparkle.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Name: React.FC = () => {
  const cue = useCue();
  const row = (y: number, at: number, a: string, b: string) => {
    return <NameRow y={y} at={at} a={a} b={b} />;
  };
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="NAME · FIG. 04" right="NATURE · 1964" dark={false} />
      <Headline setup="1964 · Australia" punch="Petrichor" dark={false} punchColor={RED} punchSize={150} />
      <div style={{ position: "absolute", left: 110, right: 110, top: 640, height: 600, background: "#F1E7D2", boxShadow: "0 18px 30px rgba(0,0,0,0.3)", transform: "rotate(1.2deg)" }} />
      {row(720, cue(0.45), "PETRA", "पत्थर")}
      {row(950, cue(0.65), "ICHOR", "देवताओं का खून")}
      <Tag text="BEAR & THOMAS · CSIRO" x={150} y={1300} at={cue(0.2)} />
      <Sfx at={cue(0.45)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.65)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

const NameRow: React.FC<{ y: number; at: number; a: string; b: string }> = ({ y, at, a, b }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: 170, right: 170, top: y, opacity: e, transform: `translateX(${(1 - e) * -50}px)` }}>
      <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 100, color: INK, lineHeight: 1 }}>{a} =</div>
      <div style={{ fontFamily: DEVA, fontSize: 80, color: RED, marginTop: 6 }}>{b}</div>
    </div>
  );
};

export const How: React.FC = () => {
  const cue = useCue();
  const { durationInFrames } = useVideoConfig();
  const first = cue(0.25);
  const period = 70;
  const xs = [540, 330, 750];
  const cycles: number[] = [];
  for (let s = first; s < durationInFrames - 20; s += period) cycles.push(s);
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="SLOW MOTION · FIG. 05" right="MIT · 2015" dark />
      <Headline setup="Hawa mein kaise?" punch="Bulbule phoot-te hain" dark punchColor={RED} punchSize={104} />
      <div style={{ position: "absolute", left: 0, right: 0, top: GROUND, height: 260, background: `linear-gradient(${SOIL}, #5E3B21)`, borderTop: "6px solid #3A2414" }} />
      {/* drops keep landing: each one traps bubbles that burst into scent */}
      {cycles.map((s, k) => (
        <From key={s} at={s}>
          <DropCycle cx={xs[k % xs.length]} seed={`c${k}`} />
        </From>
      ))}
      <Tag text="HIGH-SPEED CAMERA" x={110} y={1470} at={cue(0.1)} />
      {cycles.map((s) => (
        <Sfx key={s} at={s + 16} src="sfx/pop.wav" volume={0.4} />
      ))}
    </AbsoluteFill>
  );
};

const GROUND = 1180;

/** One raindrop: falls, splashes, releases bubbles that pop into aerosol. */
const DropCycle: React.FC<{ cx: number; seed: string }> = ({ cx, seed }) => {
  const frame = useCurrentFrame();
  const fall = 16;
  const dropT = interpolate(frame, [0, fall], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  if (frame > fall + 4 + 13 * 3 + 34 + 40) return null;
  return (
    <>
      {frame < fall && (
        <svg width="120" height="160" viewBox="0 0 120 160" style={{ position: "absolute", left: cx - 60, top: 560 + dropT * (GROUND - 700) }}>
          <path d="M60 6 C 84 50, 104 80, 104 106 A 44 44 0 0 1 16 106 C 16 80, 36 50, 60 6 Z" fill={RAIN} stroke={INK} strokeWidth={5} />
        </svg>
      )}
      {frame >= fall && (
        <div
          style={{
            position: "absolute",
            left: cx - 140,
            top: GROUND - 30,
            width: 280,
            height: 60,
            borderRadius: "50%",
            border: `5px solid ${RAIN}`,
            opacity: interpolate(frame, [fall, fall + 20], [1, 0], clamp),
            transform: `scale(${interpolate(frame, [fall, fall + 20], [0.3, 1.4], clamp)})`,
          }}
        />
      )}
      {new Array(14).fill(0).map((_, i) => {
        const s = fall + 4 + i * 3;
        if (frame < s) return null;
        const t = interpolate(frame, [s, s + 34], [0, 1], clamp);
        const x = cx - 110 + random(`${seed}b${i}`) * 220;
        const y = GROUND - 10 - t * (260 + random(`${seed}bh${i}`) * 160);
        if (t < 1) {
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 26, height: 26, borderRadius: "50%", border: `3px solid ${RAIN}`, background: "rgba(156,195,218,0.15)" }} />;
        }
        const age = frame - (s + 34);
        return new Array(5).fill(0).map((__, k) => {
          const ang = (k / 5) * Math.PI * 2;
          return <div key={`${i}-${k}`} style={{ position: "absolute", left: x + Math.cos(ang) * age * 2.5, top: y + Math.sin(ang) * age * 2.5 - age * 1.5, width: 8, height: 8, borderRadius: "50%", background: "#E8C27A", opacity: Math.max(0, 1 - age / 40) }} />;
        });
      })}
    </>
  );
};

export const NoseScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const sniff = interpolate(frame, [cue(0.15), cue(0.3)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="YOU · FIG. 06" right="SENSITIVITY" dark={false} />
      <Headline setup="Hamari naak" punch="Superpower" dark={false} punchColor={RED} />
      <div style={{ position: "absolute", right: 0, top: 560, opacity: useEnter(cue(0.05)) }}>
        <Nose size={420} sniff={sniff} />
      </div>
      <div style={{ position: "absolute", left: 100, top: 640, opacity: useEnter(cue(0.12)) }}>
        <Geosmin size={420} color={INK} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1080, textAlign: "center", opacity: useEnter(cue(0.45)) }}>
        <CountUp from={1} to={5} start={cue(0.45)} frames={20} style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 200, color: RED, lineHeight: 1 }} />
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: INK }}>/ 1,000,000,000,000</div>
      </div>
      <Tag text="5 PARTS PER TRILLION" x={300} y={1420} at={cue(0.7)} />
      <Sfx at={cue(0.15)} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={cue(0.45)} src="onion/thud.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const Twist: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const walk = interpolate(frame, [cue(0.35), cue(0.75)], [-420, 300], { ...clamp, easing: Easing.out(Easing.quad) });
  const slam = useEnter(0, { damping: 9, stiffness: 220 });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #E04A40 0%, ${RED} 50%, #8E1C18 100%)` }}>
        <Grain opacity={0.35} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 220, fontFamily: HEAD, fontWeight: 700, fontSize: 170, color: "white", lineHeight: 0.95, transform: `scale(${0.6 + 0.4 * slam})`, transformOrigin: "left top", textTransform: "uppercase" }}>
        Plot
        <br />
        twist!
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 600, fontFamily: HEAD, fontWeight: 500, fontSize: 56, color: "#FBE3D9", opacity: useEnter(cue(0.2)), textTransform: "uppercase" }}>
        Khushboo hamare liye nahi…
        <br />
        <span style={{ fontWeight: 700, color: "white", fontSize: 76 }}>Springtails ke liye!</span>
      </div>
      <div style={{ position: "absolute", left: walk, top: 940 }}>
        <Springtail size={380} step={frame / 2} />
      </div>
      <div style={{ position: "absolute", right: 60, top: 900, opacity: useEnter(cue(0.3)) }}>
        <Streptomyces size={300} grow={1} />
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1290, padding: "18px 26px", background: "rgba(0,0,0,0.25)", fontFamily: MONO, fontSize: 26, letterSpacing: 2, color: "white", opacity: useEnter(cue(0.65)) }}>
        KIDE AATE HAIN → SPORES DOOR-DOOR TAK FAILTE HAIN
      </div>
      <Sfx at={0} src="onion/thud.wav" volume={0.6} />
      <Sfx at={cue(0.35)} src="sfx/whoosh.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Kannauj: React.FC = () => {
  const cue = useCue();
  const float = useFloat(8);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="INDIA · FIG. 07" right="KANNAUJ, UP" dark={false} />
      <Headline setup="Sadiyon se bottle mein" punch="Mitti attar" dark={false} punchColor={RED} />
      <PaperCard x={60} y={590} w={660} h={640} delay={cue(0.08)} rotate={-2} caption="मिट्टी अत्तर" label="KANNAUJ" seed="attar">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", transform: `translateY(${float}px)` }}>
          <AttarBottle size={470} />
        </AbsoluteFill>
      </PaperCard>
      <div style={{ position: "absolute", left: 700, top: 990, opacity: useEnter(cue(0.25)) }}>
        <AttarWale size={330} />
      </div>
      <Tag text="PAKI HUI MITTI SE DISTILL" x={100} y={1290} at={cue(0.55)} />
      <Sfx at={cue(0.08)} src="sfx/pop.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Beet: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="BUT · FIG. 08" right="TEAM HATE" dark={false} />
      <Headline setup="Par kuch logon ko" punch="Bilkul pasand nahi!" dark={false} punchColor={RED} punchSize={110} />
      <div style={{ position: "absolute", left: 70, top: 660, opacity: useEnter(cue(0.15)), transform: `rotate(${-6}deg)` }}>
        <Beetroot size={330} />
      </div>
      <div style={{ position: "absolute", left: 560, top: 600, opacity: useEnter(cue(0.25)) }}>
        <Aman size={420} expression="disgust" />
      </div>
      <SpeechBubble text="छी!" x={820} y={560} at={cue(0.35)} />
      <Stamp text="Same geosmin" x={540} y={1290} at={cue(0.6)} color={RED} rotate={-6} size={84} />
      <Tag text="CHUKANDAR KA 'MITTI' SWAAD" x={210} y={1410} at={cue(0.75)} />
      <Sfx at={cue(0.6)} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

export const Cta: React.FC = () => {
  const cue = useCue();
  const vs = useEnter(cue(0.12), { damping: 10, stiffness: 200 });
  const phone = useEnter(cue(0.5));
  const msg = useEnter(cue(0.62));
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="YOUR TURN · FIG. 09" right="COMMENT" dark />
      <Headline setup="Aap kis team mein ho?" punch="Send it to that friend" dark punchColor={RED} punchSize={100} />
      <div style={{ position: "absolute", left: 120, top: 560, opacity: useEnter(cue(0.03)) }}>
        <Riya size={260} expression="grin" />
      </div>
      <div style={{ position: "absolute", left: 700, top: 560, opacity: useEnter(cue(0.13)) }}>
        <Aman size={260} expression="disgust" />
      </div>
      <div style={{ position: "absolute", left: 60, top: 930, width: 420, padding: "22px 0", textAlign: "center", background: "#F1E7D2", transform: "rotate(-3deg)", opacity: useEnter(cue(0.05)) }}>
        <div style={{ fontFamily: DEVA, fontSize: 52, color: INK }}>मिट्टी की खुशबू</div>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#7A6A55" }}>TEAM PETRICHOR</div>
      </div>
      <div style={{ position: "absolute", left: 600, top: 930, width: 420, padding: "22px 0", textAlign: "center", background: "#F1E7D2", transform: "rotate(3deg)", opacity: useEnter(cue(0.15)) }}>
        <div style={{ fontFamily: DEVA, fontSize: 52, color: INK }}>चुकंदर? छी!</div>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#7A6A55" }}>TEAM BEETROOT-HATE</div>
      </div>
      <div style={{ position: "absolute", left: 540 - 50, top: 720, width: 100, height: 100, borderRadius: "50%", background: RED, color: "white", fontFamily: HEAD, fontWeight: 700, fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${vs})` }}>VS</div>
      {/* phone with the friend chat */}
      <div style={{ position: "absolute", left: 540 - 230, top: 1080, width: 460, height: 400, borderRadius: 48, background: "#121212", border: "8px solid #2C2C2C", opacity: phone, transform: `translateY(${(1 - phone) * 80}px)` }}>
        <div style={{ padding: "26px 28px", display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #2A2A2A" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#555" }} />
          <span style={{ fontFamily: MONO, fontSize: 24, color: "#ddd" }}>That Friend</span>
        </div>
        <div style={{ margin: "30px 24px 0", padding: "16px 20px", borderRadius: 20, background: "#2A2A2A", fontFamily: MONO, fontSize: 22, color: "#eee", opacity: msg, maxWidth: 330 }}>
          yaar kya khushboo hai baarish ki!
        </div>
        <div style={{ margin: "18px 24px 0 auto", padding: "16px 20px", borderRadius: 20, background: RED, fontFamily: MONO, fontSize: 22, color: "white", opacity: useEnter(cue(0.75)), maxWidth: 300, width: "fit-content" }}>
          bhai, ye bacteria hai
        </div>
      </div>
      <Sfx at={cue(0.12)} src="onion/thud.wav" volume={0.45} />
      <Sfx at={cue(0.62)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.75)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  not: Not,
  bacteria: Bacteria,
  name: Name,
  how: How,
  nose: NoseScene,
  twist: Twist,
  kannauj: Kannauj,
  beet: Beet,
  cta: Cta,
};
