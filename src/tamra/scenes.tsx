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
} from "remotion";
import {
  clamp,
  CountUp,
  DarkBg,
  Header,
  Headline,
  PaperBg,
  PaperCard,
  Pill,
  Stamp,
  TypeOn,
  useCue,
  useEnter,
  useFloat,
} from "../onion/components";
import { C, DEVA, HEAD, MONO } from "../onion/theme";
import {
  Bacterium,
  COPPER,
  COPPER_LIGHT,
  CopperIon,
  Door,
  DropIcon,
  Lemon,
  Lota,
  LotaIcon,
  MoonIcon,
  SparkleIcon,
  WATER,
} from "./art";

const LAB = "TAMRA LAB";
const COPPER_TEXT = "#C46A2B";

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

/** Bacteria wandering inside a box; `kill` 0..1 cracks and fades them. */
const Germs: React.FC<{ x: number; y: number; w: number; h: number; n: number; kill?: number; size?: number; seed: string }> = ({
  x,
  y,
  w,
  h,
  n,
  kill = 0,
  size = 90,
  seed,
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(n).fill(0).map((_, i) => {
        const bx = x + random(`${seed}x${i}`) * (w - size) + Math.sin(frame / 20 + i * 2) * 14 * (1 - kill);
        const by = y + random(`${seed}y${i}`) * (h - size / 2) + Math.cos(frame / 24 + i) * 10 * (1 - kill);
        const rot = random(`${seed}r${i}`) * 360 + frame * (1 - kill) * (i % 2 ? 0.6 : -0.6);
        const myKill = interpolate(kill, [random(`${seed}k${i}`) * 0.5, random(`${seed}k${i}`) * 0.5 + 0.5], [0, 1], clamp);
        return (
          <div key={i} style={{ position: "absolute", left: bx, top: by, transform: `rotate(${rot}deg)`, opacity: 1 - myKill * 0.9 }}>
            <Bacterium size={size} damage={myKill} />
          </div>
        );
      })}
    </>
  );
};

// ===========================================================================

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const float = useFloat(10);
  const switchAt = cue(0.55);
  const glow = interpolate(frame, [switchAt, switchAt + 20], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="HOME · FIG. 01" right={LAB} dark />
      {frame < switchAt ? (
        <Headline setup="Paani hamesha" punch="Tambe ke lote mein kyun?" dark punchColor={COPPER_LIGHT} punchSize={104} />
      ) : (
        <From at={switchAt}>
          <Headline setup="Ye parampara nahi thi…" punch="Invisible purifier" dark punchColor={COPPER_LIGHT} punchAt={2} delay={0} />
        </From>
      )}
      <div style={{ position: "absolute", left: 540 - 190, top: 680 + float }}>
        <Lota id="hk" size={380} glow={glow} />
      </div>
      <Sfx at={switchAt} src="onion/sparkle.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Tradition: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="AYURVEDA · FIG. 02" right="TAMRA JAL" dark={false} />
      <Headline setup="Ayurveda mein" punch="Tamra jal" dark={false} punchColor={COPPER_TEXT} />
      <PaperCard x={200} y={590} w={680} h={640} delay={cue(0.08)} rotate={-3} caption="ताम्र जल" label="COPPER WATER" seed="tj">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Lota id="tr" size={360} />
        </AbsoluteFill>
      </PaperCard>
      <StepChip x={140} y={1290} at={cue(0.5)} Icon={MoonIcon} text="RAAT BHAR" />
      <div style={{ position: "absolute", left: 495, top: 1300, fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: C.ink, opacity: useEnter(cue(0.6)) }}>→</div>
      <StepChip x={600} y={1290} at={cue(0.68)} Icon={DropIcon} text="SUBAH PIYO" />
      <Sfx at={cue(0.5)} src="sfx/pop.wav" volume={0.4} />
      <Sfx at={cue(0.68)} src="sfx/pop.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

const StepChip: React.FC<{ x: number; y: number; at: number; Icon: React.FC<{ size: number; color: string }>; text: string }> = ({ x, y, at, Icon, text }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, padding: "12px 26px", borderRadius: 999, background: C.ink, opacity: e, transform: `scale(${0.8 + 0.2 * e})` }}>
      <Icon size={48} color={COPPER_LIGHT} />
      <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 44, color: C.paper }}>{text}</span>
    </div>
  );
};

export const Past: React.FC = () => {
  const cue = useCue();
  const e = useEnter(cue(0.08));
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="PAST · FIG. 03" right="NO FILTERS" dark />
      <Headline setup="Na filter, na RO" punch="Ganda paani" dark punchColor={C.red} />
      <div
        style={{
          position: "absolute",
          left: 540 - 300,
          top: 600,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle at 40% 35%, #9CCBE0 0%, ${WATER} 45%, #3E7A99 100%)`,
          border: `6px solid ${C.cream}`,
          overflow: "hidden",
          transform: `scale(${e})`,
        }}
      >
        <Germs x={40} y={60} w={520} h={460} n={9} seed="past" size={110} />
      </div>
      {["HAIZA", "TYPHOID", "DAST"].map((d, i) => (
        <Pill key={d} text={d} x={[120, 420, 760][i]} y={1260} delay={cue(0.45 + i * 0.12)} accent dark />
      ))}
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={cue(0.45 + i * 0.12)} src="sfx/pop.wav" volume={0.35} />
      ))}
    </AbsoluteFill>
  );
};

export const Ask: React.FC = () => {
  const frame = useCurrentFrame();
  const q = useEnter(2, { damping: 20, stiffness: 60 });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="QUESTION · FIG. 03B" right={LAB} dark />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 900, color: COPPER_LIGHT, opacity: 0.12 * q, transform: `scale(${0.8 + 0.25 * q + frame * 0.001})`, marginTop: 260 }}>?</div>
      </AbsoluteFill>
      <Headline setup="To kya…" punch="Tamba paani saaf karta hai?" dark punchColor={COPPER_LIGHT} punchSize={104} />
      <Sfx at={4} src="onion/tick.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

export const Study: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const into = interpolate(frame, [cue(0.7), cue(0.9)], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const germs = [
    { name: "HAIZA", sci: "V. CHOLERAE", at: 0.3 },
    { name: "TYPHOID", sci: "SALMONELLA", at: 0.42 },
    { name: "E. COLI", sci: "DAST", at: 0.54 },
  ];
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="EVIDENCE · FIG. 04" right="J HEALTH POPUL NUTR · 2012" dark={false} />
      <Headline setup="2012 · India" punch="Asli test" dark={false} punchColor={COPPER_TEXT} />
      <Pill text="PAANI MEIN JAANBOOJHKAR BACTERIA" x={170} y={590} delay={cue(0.15)} />
      {germs.map((g, i) => (
        <GermCard key={g.name} {...g} x={70 + i * 320} at={cue(g.at)} into={into} />
      ))}
      <div style={{ position: "absolute", left: 540 - 140, top: 1080, opacity: useEnter(cue(0.6)) }}>
        <Lota id="st" size={280} />
      </div>
      {germs.map((g) => (
        <Sfx key={g.name} at={cue(g.at)} src="sfx/pop.wav" volume={0.35} />
      ))}
      <Sfx at={cue(0.7)} src="sfx/whoosh.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

const GermCard: React.FC<{ name: string; sci: string; x: number; at: number; into: number }> = ({ name, sci, x, at, into }) => {
  const e = useEnter(at);
  const tx = (540 - (x + 150)) * into;
  const ty = 400 * into;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 680,
        width: 300,
        height: 300,
        borderRadius: 24,
        background: "#F6EEDC",
        border: `4px solid ${C.ink}`,
        boxShadow: "0 10px 22px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        opacity: e * (1 - into),
        transform: `translate(${tx}px, ${ty}px) scale(${(0.85 + 0.15 * e) * (1 - into * 0.7)})`,
      }}
    >
      <Bacterium size={200} />
      <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 46, color: C.ink }}>{name}</div>
      <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: "#6b6052" }}>{sci}</div>
    </div>
  );
};

export const Result: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const kill = interpolate(frame, [cue(0.25), cue(0.7)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="EVIDENCE · FIG. 04" right="16 GHANTE BAAD" dark={false} />
      <Headline setup="16 ghante baad" punch="Zinda bacteria: 0" dark={false} punchColor={COPPER_TEXT} />
      <div style={{ position: "absolute", left: 540 - 300, top: 600, width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #F4C9A0 0%, ${COPPER_LIGHT} 55%, ${COPPER} 100%)`, border: `6px solid ${C.ink}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 30, borderRadius: "50%", background: `radial-gradient(circle, rgba(170,215,235,0.9) 0%, rgba(111,183,217,0.85) 100%)` }} />
        <Germs x={60} y={80} w={480} h={430} n={9} kill={kill} seed="res" size={110} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1230, textAlign: "center" }}>
        <CountUp from={0} to={16} start={0} frames={cue(0.6)} format={(n) => `${Math.round(n)} GHANTE`} style={{ fontFamily: MONO, fontSize: 36, letterSpacing: 6, color: C.ink }} />
      </div>
      <Stamp text="Zero" x={800} y={700} at={cue(0.72)} color={C.green} rotate={10} size={90} />
      <Sfx at={cue(0.25)} src="onion/slice.wav" volume={0.3} />
      <Sfx at={cue(0.72)} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

export const How: React.FC = () => {
  const e = useEnter(2, { damping: 9, stiffness: 160 });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="HOW · FIG. 04B" right={LAB} dark />
      <Headline setup="Par ye hota…" punch="Kaise?" dark punchColor={COPPER_LIGHT} punchSize={200} />
      <div style={{ position: "absolute", left: 540 - 180, top: 760, transform: `scale(${e})` }}>
        <Bacterium size={360} />
      </div>
      <Sfx at={2} src="onion/tick.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

export const Ions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const attack = interpolate(frame, [cue(0.15), cue(0.5)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const damage = interpolate(frame, [cue(0.45), cue(0.8)], [0, 1], clamp);
  const cx = 540;
  const cy = 940;
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="INSIDE · FIG. 05" right="COPPER IONS" dark />
      <Headline setup="Copper ions" punch="Bacteria ko todte hain" dark punchColor={COPPER_LIGHT} punchSize={104} />
      <div style={{ position: "absolute", left: cx - 300, top: cy - 160, transform: `rotate(${Math.sin(frame / 15) * 3}deg)` }}>
        <Bacterium size={600} damage={damage} />
      </div>
      {new Array(12).fill(0).map((_, i) => {
        const ang = (i / 12) * Math.PI * 2;
        const r0 = 560;
        const r1 = 230 + (i % 3) * 30;
        const r = r0 + (r1 - r0) * attack;
        const jitter = Math.sin(frame / 6 + i) * 6;
        return (
          <div key={i} style={{ position: "absolute", left: cx + Math.cos(ang) * r * 1.2 - 40 + jitter, top: cy + Math.sin(ang) * r * 0.75 - 40, opacity: interpolate(frame, [cue(0.1), cue(0.2)], [0, 1], clamp) }}>
            <CopperIon size={80} />
          </div>
        );
      })}
      <Pill text="DEEWAR TOOTI" x={150} y={1300} delay={cue(0.5)} accent dark />
      <Pill text="DNA KO NUQSAAN" x={590} y={1300} delay={cue(0.7)} accent dark />
      <Sfx at={cue(0.45)} src="onion/thud.wav" volume={0.45} />
      <Sfx at={cue(0.7)} src="onion/slice.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Effect: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="SCIENCE · FIG. 06" right="THE NAME" dark={false} />
      <div style={{ position: "absolute", top: 222, left: 70, right: 70 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 500, fontSize: 58, color: C.ink, textTransform: "uppercase" }}>Science mein iska naam…</div>
        <TypeOn text="OLIGODYNAMIC EFFECT" start={cue(0.12)} cps={16} style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 100, color: COPPER_TEXT, display: "block", lineHeight: 1.05 }} />
      </div>
      <div style={{ position: "absolute", left: 540 - 170, top: 700, opacity: useEnter(cue(0.3)) }}>
        <Lota id="ef" size={340} />
      </div>
      <Pill text="THODI SI DHAATU, BADA ASAR" x={250} y={1240} delay={cue(0.55)} />
      {new Array(10).fill(0).map((_, i) => (
        <Sfx key={i} at={cue(0.12) + i * 4} src="onion/tick.wav" volume={0.2} />
      ))}
    </AbsoluteFill>
  );
};

export const Hospital: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const kill = interpolate(frame, [cue(0.55), cue(0.85)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="TODAY · FIG. 07" right="EPA · 2008" dark />
      <Headline setup="Aaj hospitals mein" punch="Tambe ke handles" dark punchColor={COPPER_LIGHT} />
      <div style={{ position: "absolute", left: 540 - 180, top: 560, opacity: useEnter(cue(0.4)) }}>
        <Door size={360} />
      </div>
      <Germs x={560} y={830} w={320} h={300} n={5} kill={kill} seed="door" size={80} />
      <Pill text="2008 · EPA: COPPER = ANTIMICROBIAL" x={150} y={1200} delay={cue(0.15)} accent dark />
      <Sfx at={cue(0.15)} src="onion/thud.wav" volume={0.45} />
      <Sfx at={cue(0.55)} src="onion/sparkle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Safe: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const fill = interpolate(frame, [cue(0.25), cue(0.55)], [0, 0.32], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tick = useEnter(cue(0.6), { damping: 10, stiffness: 200 });
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="SAFETY · FIG. 08" right="WHO LIMIT" dark={false} />
      <Headline setup="Ghabraiye mat" punch="WHO safe limit ke andar" dark={false} punchColor={COPPER_TEXT} punchSize={100} />
      <div style={{ position: "absolute", left: 120, right: 120, top: 760, opacity: useEnter(cue(0.15)) }}>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: C.ink }}>PAANI MEIN COPPER</div>
        <div style={{ position: "relative", marginTop: 16, height: 70, borderRadius: 999, border: `5px solid ${C.ink}`, padding: 7 }}>
          <div style={{ height: "100%", width: `${fill * 100}%`, borderRadius: 999, background: C.green }} />
          <div style={{ position: "absolute", left: "80%", top: -30, bottom: -30, width: 6, background: C.red }} />
          <div style={{ position: "absolute", left: "80%", top: 96, transform: "translateX(-50%)", fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: C.red, whiteSpace: "nowrap" }}>WHO LIMIT</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 540 - 90, top: 1050, width: 180, height: 180, borderRadius: 30, background: C.green, color: "white", fontFamily: HEAD, fontWeight: 700, fontSize: 130, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${tick})` }}>✓</div>
      <Sfx at={cue(0.6)} src="sfx/pop.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Caution: React.FC = () => {
  const cue = useCue();
  const lines = [
    { t: "NIMBU PAANI / JUICE TAMBE MEIN ✗", at: 0.12 },
    { t: "KHATTA = ZYADA COPPER GHULTA HAI", at: 0.32 },
    { t: "TAMBA ≠ FILTER YA RO", at: 0.62 },
  ];
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="NOTE · FIG. 09" right="CAUTION" dark />
      <Headline setup="Par dhyaan rahe…" punch="Khatta kabhi nahi" dark punchColor={C.red} />
      <div style={{ position: "absolute", left: 540 - 180, top: 590, opacity: useEnter(cue(0.08)) }}>
        <Lemon size={360} />
      </div>
      <Stamp text="No" x={720} y={700} at={cue(0.18)} color={C.red} rotate={-12} size={110} blend="normal" />
      {lines.map((l, i) => (
        <Line key={l.t} text={l.t} y={930 + i * 120} at={cue(l.at)} />
      ))}
      <Sfx at={cue(0.18)} src="onion/thud.wav" volume={0.55} />
      <Sfx at={cue(0.62)} src="onion/tick.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

const Line: React.FC<{ text: string; y: number; at: number }> = ({ text, y, at }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: y, padding: "22px 30px", borderLeft: `8px solid ${C.red}`, background: "rgba(243,235,221,0.06)", fontFamily: MONO, fontSize: 28, letterSpacing: 2, color: C.cream, opacity: e, transform: `translateX(${(1 - e) * -60}px)` }}>
      {text}
    </div>
  );
};

const STEPS = [
  { Icon: DropIcon, title: "Saaf paani", sub: "PEHLE SE PEENE LAYAK", at: 0.18 },
  { Icon: LotaIcon, title: "Saaf tambe ka bartan", sub: "LOTA YA JUG", at: 0.34 },
  { Icon: MoonIcon, title: "Raat bhar rakhein", sub: "SUBAH PIYEIN", at: 0.5 },
  { Icon: SparkleIcon, title: "Hafte mein safai", sub: "NIMBU + NAMAK, PHIR DHO LEIN", at: 0.7 },
];

const Row: React.FC<{ Icon: React.FC<{ size: number; color: string }>; title: string; sub: string; y: number; at: number }> = ({ Icon, title, sub, y, at }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: y, height: 170, display: "flex", alignItems: "center", gap: 34, padding: "0 34px", borderRadius: 24, background: "#F6EEDC", border: "3px solid rgba(42,36,32,0.25)", boxShadow: "0 10px 22px rgba(0,0,0,0.12)", opacity: e, transform: `translateX(${(1 - e) * 120}px)` }}>
      <div style={{ width: 112, height: 112, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={70} color={COPPER_LIGHT} />
      </div>
      <div>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 56, color: C.ink, textTransform: "uppercase", lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#6b6052", marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};

export const HowTo: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="YOUR MOVE · FIG. 10" right="TAMRA JAL" dark={false} />
      <Headline setup="Sahi tarika?" punch="4 steps" dark={false} punchColor={COPPER_TEXT} />
      {STEPS.map((s, i) => (
        <Row key={s.title} {...s} y={600 + i * 200} at={cue(s.at)} />
      ))}
      {STEPS.map((s) => (
        <Sfx key={s.title} at={cue(s.at)} src="sfx/pop.wav" volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};

export const Cta: React.FC = () => {
  const cue = useCue();
  const float = useFloat(10);
  const bubble = useEnter(cue(0.6), { damping: 10, stiffness: 180 });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="YOUR TURN · FIG. 11" right="COMMENT" dark />
      <Headline setup="Microscope nahi tha…" punch="Par purifier tha!" dark punchColor={COPPER_LIGHT} />
      <div style={{ position: "absolute", left: 540 - 160, top: 600 + float }}>
        <Lota id="ct" size={320} glow={1} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, textAlign: "center", fontFamily: DEVA, fontSize: 58, color: C.cream, opacity: useEnter(cue(0.35)) }}>
        आपके घर में तांबे का बर्तन है?
      </div>
      <div style={{ position: "absolute", left: 540, top: 1210, transform: `translateX(-50%) scale(${bubble})`, background: COPPER_LIGHT, color: C.slate, borderRadius: 999, padding: "16px 44px", fontFamily: HEAD, fontWeight: 700, fontSize: 54, letterSpacing: 2, display: "flex", alignItems: "center", gap: 18, whiteSpace: "nowrap" }}>
        COMMENT KARO
        <svg width="40" height="48" viewBox="0 0 40 48">
          <path d="M20 4 V 40 M6 26 L 20 42 L 34 26" fill="none" stroke={C.slate} strokeWidth={7} strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1350, textAlign: "center", fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: C.muted, opacity: useEnter(cue(0.65)) }}>
        INFO ONLY · NOT MEDICAL ADVICE
      </div>
      <Sfx at={cue(0.6)} src="sfx/pop.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  tradition: Tradition,
  past: Past,
  ask: Ask,
  study: Study,
  result: Result,
  how: How,
  ions: Ions,
  effect: Effect,
  hospital: Hospital,
  safe: Safe,
  caution: Caution,
  howto: HowTo,
  cta: Cta,
};
