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
  Vapor,
} from "../onion/components";
import { C, DEVA, HEAD, MONO } from "../onion/theme";
import {
  CupIcon,
  DoctorIcon,
  DropIcon,
  DryGinger,
  GheeJar,
  GOLD_MILK,
  HaldiGlass,
  LatteCup,
  Liver,
  LongPepper,
  PepperIcon,
  Peppercorns,
  SpoonIcon,
  TadkaPan,
  TURMERIC,
  TurmericRoot,
} from "./art";

const LAB = "HALDI LAB";

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

const Meter: React.FC<{ y: number; at: number; fill: number; label: string; value: string; color?: string; dark?: boolean }> = ({
  y,
  at,
  fill,
  label,
  value,
  color = C.red,
  dark = true,
}) => {
  const e = useEnter(at);
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [at + 6, at + 30], [0, fill], { ...clamp, easing: Easing.out(Easing.cubic) });
  const fg = dark ? C.cream : C.ink;
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: y, opacity: e }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: fg }}>
        <span>{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div style={{ marginTop: 14, height: 44, borderRadius: 999, border: `4px solid ${fg}`, padding: 5 }}>
        <div style={{ height: "100%", width: `${Math.max(grow * 100, 1.5)}%`, borderRadius: 999, background: color }} />
      </div>
    </div>
  );
};

// ===========================================================================

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const float = useFloat(10);
  const switchAt = cue(0.42);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="KITCHEN · FIG. 01" right={LAB} dark />
      {frame < switchAt ? (
        <Headline setup="Haldi = superfood?" punch="Haan… par" dark punchColor={TURMERIC} />
      ) : (
        <From at={switchAt}>
          <Headline setup="Ek problem hai" punch="Body absorb hi nahi karti" dark punchColor={C.red} punchAt={2} delay={0} punchSize={100} />
        </From>
      )}
      <div style={{ position: "absolute", left: 540 - 170, top: 640 + float }}>
        <HaldiGlass id="hg" size={340} />
      </div>
      <Vapor x={540} y={700} tx={540} ty={560} start={0} count={10} spread={120} size={90} life={70} color="#F3EBDD" />
      <Meter y={1230} at={switchAt + 6} fill={0.03} label="ABSORPTION" value="≈ 0" />
      <Sfx at={switchAt} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

export const Dadi: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const specks = Math.round(interpolate(frame, [cue(0.2), cue(0.55)], [0, 10], clamp));
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="KITCHEN · FIG. 01" right={LAB} dark />
      <Headline setup="Phir bhi Dadi…" punch="Ek chutki kaali mirch" dark punchSize={104} />
      <div style={{ position: "absolute", left: 540 - 160, top: 700 }}>
        <HaldiGlass id="dg" size={320} specks={specks} />
      </div>
      {/* falling pepper */}
      {new Array(14).fill(0).map((_, i) => {
        const start = cue(0.15) + i * 2;
        const t = interpolate(frame, [start, start + 22], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        if (t <= 0 || t >= 1) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 500 + (random(`p${i}`) - 0.5) * 120,
              top: 560 + t * 300,
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#2B2A28",
              border: "2px solid #6E6862",
            }}
          />
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1210, textAlign: "center", fontFamily: DEVA, fontSize: 64, color: C.cream, opacity: useEnter(cue(0.3)) }}>
        हल्दी वाला दूध + काली मिर्च
      </div>
      <Stamp text="Kyun?" x={780} y={880} at={cue(0.72)} color={C.orange} rotate={-10} size={90} blend="normal" />
      <Sfx at={cue(0.2)} src="onion/tick.wav" volume={0.4} />
      <Sfx at={cue(0.72)} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

export const Curcumin: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const arc = interpolate(frame, [cue(0.5), cue(0.75)], [0, 0.03], { ...clamp, easing: Easing.out(Easing.cubic) });
  const r = 150;
  const circ = 2 * Math.PI * r;
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="INSIDE · FIG. 02" right="TURMERIC" dark={false} />
      <Headline setup="Asli taaqat:" punch="Curcumin" dark={false} punchColor="#C97C00" />
      <PaperCard x={150} y={580} w={780} h={520} delay={cue(0.05)} rotate={-2} caption="हल्दी" label="CURCUMA LONGA" seed="root">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <TurmericRoot id="tr" size={600} />
        </AbsoluteFill>
      </PaperCard>
      <div style={{ position: "absolute", left: 540 - 200, top: 1130, opacity: useEnter(cue(0.45)) }}>
        <svg width="400" height="400" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r={r} fill="none" stroke="#D8CCB2" strokeWidth={46} />
          <circle
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke={TURMERIC}
            strokeWidth={46}
            strokeDasharray={`${circ * Math.max(arc, 0.001)} ${circ}`}
            transform="rotate(-90 200 200)"
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <CountUp from={0} to={3} start={cue(0.5)} frames={cue(0.25)} format={(n) => `~${Math.round(n)}%`} style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 110, color: C.ink, lineHeight: 1 }} />
          <span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 4, color: "#6b6052" }}>CURCUMIN</span>
        </div>
      </div>
      <Sfx at={cue(0.05)} src="sfx/pop.wav" volume={0.4} />
      <Sfx at={cue(0.5)} src="onion/tick.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

const Station: React.FC<{ y: number; at: number; text: string; dark?: boolean }> = ({ y, at, text }) => {
  const e = useEnter(at);
  return (
    <div
      style={{
        position: "absolute",
        left: 290,
        width: 500,
        top: y,
        height: 92,
        borderRadius: 18,
        border: `4px solid ${C.ink}`,
        background: "#F6EEDC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: HEAD,
        fontWeight: 700,
        fontSize: 46,
        color: C.ink,
        opacity: e,
        transform: `scale(${0.9 + 0.1 * e})`,
      }}
    >
      {text}
    </div>
  );
};

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const start = cue(0.18);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="INSIDE · FIG. 03" right="ABSORPTION" dark={false} />
      <Headline setup="Problem ye hai…" punch="Liver bahar nikaal deta" dark={false} punchSize={104} />
      <Station y={590} at={cue(0.05)} text="PET · STOMACH" />
      <div style={{ position: "absolute", left: 540 - 230, top: 740, opacity: useEnter(cue(0.12)) }}>
        <Liver id="pl" size={460} gearAngle={frame * 10} />
      </div>
      <Station y={1150} at={cue(0.55)} text="BLOOD" />
      {/* curcumin particles: most get thrown out at the liver */}
      {new Array(22).fill(0).map((_, i) => {
        const born = start + i * 4;
        const age = frame - born;
        if (age < 0) return null;
        const survivor = i % 9 === 4;
        const x0 = 470 + random(`px${i}`) * 140;
        let x = x0;
        let y = 690 + age * 7;
        let o = 1;
        let color = TURMERIC;
        if (y > 880 && !survivor) {
          const out = age - (880 - 690) / 7;
          y = 880 + out * 2;
          x = x0 + out * (random(`pd${i}`) > 0.5 ? 18 : -18);
          o = Math.max(0, 1 - out / 16);
          color = "#9AA0B3";
        }
        if (survivor && y > 1170) y = 1170;
        if (o <= 0) return null;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 22, height: 22, borderRadius: "50%", background: color, border: `3px solid ${C.ink}`, opacity: o }} />;
      })}
      <Pill text="BAHAR!" x={140} y={930} delay={cue(0.35)} />
      <Meter y={1290} at={cue(0.62)} fill={0.04} label="BLOOD MEIN CURCUMIN" value="NA KE BARABAR" dark={false} />
      <Sfx at={cue(0.35)} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={cue(0.62)} src="onion/thud.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Twist: React.FC = () => {
  const frame = useCurrentFrame();
  const e = useEnter(4, { damping: 9, stiffness: 160 });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="ENTRY · FIG. 03B" right={LAB} dark />
      <Headline setup="Yahin entry hoti hai…" punch="Kaali mirch ki!" dark />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 56%, rgba(240,138,36,${0.28 * e}) 0%, rgba(0,0,0,0) 38%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 300,
          top: 760,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, #F6EEDC 0%, #E2D6BC 70%)",
          border: `6px solid ${C.ink}`,
          boxShadow: "0 0 80px rgba(240,138,36,0.45)",
          transform: `scale(${e})`,
        }}
      />
      <div style={{ position: "absolute", left: 540 - 230, top: 830, transform: `scale(${e}) rotate(${(1 - e) * 30 + Math.sin(frame / 10) * 2}deg)` }}>
        <Peppercorns size={460} />
      </div>
      <Sfx at={4} src="onion/sparkle.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Piperine: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const t0 = cue(0.45);
  const angle = frame < t0 ? frame * 12 : t0 * 12 + (frame - t0) * 1.5;
  const slowed = frame >= t0 ? 1 : 0;
  const fly = interpolate(frame, [cue(0.3), t0], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="THE HERO · FIG. 04" right="PIPERINE" dark />
      <div style={{ position: "absolute", top: 222, left: 70, right: 70 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 500, fontSize: 58, color: C.cream, textTransform: "uppercase" }}>Kaali mirch mein hai…</div>
        <TypeOn text="PIPERINE" start={cue(0.06)} cps={10} style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 130, color: C.orange, display: "block" }} />
      </div>
      <div style={{ position: "absolute", left: 540 - 300, top: 700 }}>
        <Liver id="pp" size={600} gearAngle={angle} slowed={slowed} />
      </div>
      {fly < 1 && fly > 0 && (
        <div style={{ position: "absolute", left: interpolate(fly, [0, 1], [880, 560]), top: interpolate(fly, [0, 1], [560, 820]), transform: `scale(${1 - fly * 0.6})` }}>
          <Peppercorns size={140} />
        </div>
      )}
      <Pill text={frame < t0 ? "SAFAI MODE: FAST" : "SAFAI MODE: SLOW"} x={330} y={1160} delay={cue(0.15)} accent={frame >= t0} dark />
      <Pill text="CURCUMIN ZYADA DER TIKTA HAI" x={200} y={1250} delay={cue(0.7)} dark />
      <Sfx at={t0} src="onion/thud.wav" volume={0.5} />
      <Sfx at={cue(0.7)} src="onion/sparkle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

/** Bar chart: curcumin alone vs with piperine. */
const Bars: React.FC<{ secondAt: number | null; firstAt: number }> = ({ secondAt, firstAt }) => {
  const frame = useCurrentFrame();
  const base = 1360;
  const maxH = 520;
  const h1 = interpolate(frame, [firstAt, firstAt + 20], [0, 18], clamp);
  const h2 = secondAt === null ? 0 : interpolate(frame, [secondAt, secondAt + 40], [0, maxH], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bar = (x: number, h: number, color: string, label: string, show: boolean) => (
    <>
      <div style={{ position: "absolute", left: x, width: 260, top: base - h, height: h, background: color, border: h > 0 ? `4px solid ${C.ink}` : "none", borderBottom: "none", borderRadius: "14px 14px 0 0" }} />
      <div style={{ position: "absolute", left: x - 30, width: 320, top: base + 18, textAlign: "center", fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: C.ink, opacity: show ? 1 : 0 }}>{label}</div>
    </>
  );
  return (
    <>
      <div style={{ position: "absolute", left: 110, right: 110, top: base, height: 5, background: C.ink }} />
      {bar(180, h1, "#B9AD95", "SIRF CURCUMIN", frame >= firstAt)}
      {bar(640, h2, TURMERIC, "+ PIPERINE", secondAt !== null && frame >= secondAt)}
    </>
  );
};

export const Study: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="EVIDENCE · FIG. 05" right="PLANTA MEDICA · 1998" dark={false} />
      <Headline setup="1998 · Bangalore" punch="Asli test" dark={false} />
      <Pill text="2 GRAM CURCUMIN" x={130} y={600} delay={cue(0.35)} />
      <Pill text="BLOOD LEVEL" x={640} y={600} delay={cue(0.5)} />
      <Bars firstAt={cue(0.62)} secondAt={null} />
      <div style={{ position: "absolute", left: 180, width: 260, top: 1250, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: C.red, opacity: useEnter(cue(0.7)) }}>≈ 0</div>
      <Sfx at={cue(0.62)} src="onion/tick.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Result: React.FC = () => {
  const cue = useCue();
  const grow = cue(0.35);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="EVIDENCE · FIG. 05" right="PLANTA MEDICA · 1998" dark={false} />
      <Headline setup="+ Sirf 20 mg piperine" punch="2000% zyada!" dark={false} punchColor="#C97C00" />
      <Bars firstAt={-30} secondAt={grow} />
      <div style={{ position: "absolute", left: 600, width: 340, top: 700, textAlign: "center", opacity: useEnter(grow + 10) }}>
        <CountUp from={0} to={2000} start={grow} frames={40} format={(n) => `+${Math.round(n)}%`} style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 96, color: C.ink }} />
      </div>
      <Stamp text="= 20 guna" x={330} y={940} at={cue(0.7)} color={C.rust} rotate={-8} size={80} />
      <Sfx at={grow} src="onion/sparkle.wav" volume={0.5} />
      <Sfx at={cue(0.7)} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

const Beaker: React.FC<{ x: number; liquid: string; dissolve: number; label: string; ok: boolean; at: number }> = ({ x, liquid, dissolve, label, ok, at }) => {
  const frame = useCurrentFrame();
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: x, top: 700, opacity: e, transform: `translateY(${(1 - e) * 40}px)` }}>
      <svg width="400" height="460" viewBox="0 0 400 460">
        <path d="M70 40 L 330 40 L 330 400 C 330 425, 310 440, 285 440 L 115 440 C 90 440, 70 425, 70 400 Z" fill={liquid} />
        {/* dissolved colour */}
        <path d="M70 120 L 330 120 L 330 400 C 330 425, 310 440, 285 440 L 115 440 C 90 440, 70 425, 70 400 Z" fill={GOLD_MILK} opacity={dissolve * 0.85} />
        <rect x="70" y="112" width="260" height="10" fill="rgba(255,255,255,0.4)" />
        {/* undissolved clumps */}
        {new Array(9).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={110 + ((i * 29) % 180) + Math.sin(frame / 12 + i) * 18 * dissolve}
            cy={410 - (i % 3) * 16 - dissolve * (160 + i * 18)}
            r={14 * (1 - dissolve * 0.85)}
            fill={TURMERIC}
            stroke={C.ink}
            strokeWidth={3}
            opacity={1 - dissolve * 0.8}
          />
        ))}
        <path d="M60 30 L 340 30 M70 30 L 70 400 C 70 425, 90 440, 115 440 L 285 440 C 310 440, 330 425, 330 400 L 330 30" fill="none" stroke={C.cream} strokeWidth={8} />
      </svg>
      <div style={{ textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 56, color: ok ? "#9BD27A" : C.red, marginTop: 12 }}>
        {label} {ok ? "✓" : "✗"}
      </div>
    </div>
  );
};

export const Milk: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const dissolve = interpolate(frame, [cue(0.4), cue(0.85)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="WHY MILK · FIG. 06" right="FAT-SOLUBLE" dark />
      <Headline setup="Aur doodh kyun?" punch="Fat mein ghulta hai" dark />
      <Beaker x={90} liquid="rgba(150,200,230,0.35)" dissolve={0} label="PAANI" ok={false} at={cue(0.12)} />
      <Beaker x={590} liquid="#F6EEDC" dissolve={dissolve} label="DOODH" ok at={cue(0.25)} />
      <Sfx at={cue(0.12)} src="sfx/pop.wav" volume={0.35} />
      <Sfx at={cue(0.4)} src="onion/sparkle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Tadka: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const swirl = interpolate(frame, [cue(0.3), cue(0.6)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="KITCHEN · FIG. 07" right="TADKA" dark />
      <Headline setup="Dhyaan dijiye…" punch="Tadka = fat trick" dark />
      <div style={{ position: "absolute", left: 540 - 400, top: 820 }}>
        <TadkaPan size={800} swirl={swirl} />
      </div>
      <div style={{ position: "absolute", left: 800, top: 590, opacity: useEnter(cue(0.1)) }}>
        <GheeJar size={190} />
      </div>
      {/* turmeric sprinkle */}
      {new Array(30).fill(0).map((_, i) => {
        const s = cue(0.2) + i;
        const t = interpolate(frame, [s, s + 18], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        if (t <= 0 || t >= 1) return null;
        return <div key={i} style={{ position: "absolute", left: 470 + (random(`ts${i}`) - 0.5) * 160, top: 620 + t * 260, width: 9, height: 9, borderRadius: 3, background: TURMERIC }} />;
      })}
      <Vapor x={540} y={860} tx={540} ty={640} start={cue(0.3)} count={14} spread={300} size={110} life={60} color="#F3EBDD" />
      <Pill text="HALDI + GHEE/TEL = HAMESHA" x={220} y={1280} delay={cue(0.6)} accent dark />
      <Sfx at={cue(0.2)} src="onion/slice.wav" volume={0.3} />
      <Sfx at={cue(0.6)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const Trikatu: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="TRADITION · FIG. 08" right="AYURVEDA" dark={false} />
      <Headline setup="Ayurveda mein" punch="Trikatu" dark={false} />
      <PaperCard x={50} y={620} w={320} h={470} delay={cue(0.15)} rotate={-4} caption="काली मिर्च" seed="t1">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Peppercorns size={240} />
        </AbsoluteFill>
      </PaperCard>
      <PaperCard x={380} y={600} w={320} h={470} delay={cue(0.28)} rotate={2} caption="पीपली" seed="t2">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <LongPepper size={300} />
        </AbsoluteFill>
      </PaperCard>
      <PaperCard x={710} y={620} w={320} h={470} delay={cue(0.4)} rotate={4} caption="सोंठ" seed="t3">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <DryGinger size={250} />
        </AbsoluteFill>
      </PaperCard>
      <Pill text="TEEN TEEKHE MASALE" x={330} y={1160} delay={cue(0.5)} />
      <Pill text="DOOSRI JADI-BOOTIYON KA ASAR BADHANE KE LIYE" x={95} y={1240} delay={cue(0.62)} accent />
      <Sfx at={cue(0.15)} src="sfx/pop.wav" volume={0.35} />
      <Sfx at={cue(0.28)} src="sfx/pop.wav" volume={0.35} />
      <Sfx at={cue(0.4)} src="sfx/pop.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Latte: React.FC = () => {
  const cue = useCue();
  const float = useFloat(8);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="WORLD · FIG. 09" right="CAFÉ MENU" dark />
      <Headline setup="Aaj duniya bhar mein" punch="Turmeric latte" dark punchColor={TURMERIC} />
      <div style={{ position: "absolute", left: 540 - 300, top: 720 + float, opacity: useEnter(cue(0.05)) }}>
        <LatteCup size={600} />
      </div>
      <Vapor x={520} y={760} tx={520} ty={600} start={0} count={10} spread={140} size={90} life={70} color="#F3EBDD" />
      <Stamp text="Dadi ka nuskha" x={560} y={1270} at={cue(0.55)} color={C.orange} rotate={-7} size={76} blend="normal" />
      <Sfx at={cue(0.55)} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

const RECIPE = [
  { Icon: CupIcon, title: "1 cup garam doodh", sub: "FAT = CURCUMIN GHULEGA", at: 0.18 },
  { Icon: SpoonIcon, title: "1/2 chammach haldi", sub: "CURCUMIN KA SOURCE", at: 0.36 },
  { Icon: PepperIcon, title: "1 chutki kaali mirch", sub: "PIPERINE = ABSORPTION BOOST", at: 0.54 },
  { Icon: DropIcon, title: "Thoda ghee", sub: "OPTIONAL · AUR FAT", at: 0.74 },
];

const Row: React.FC<{ Icon: React.FC<{ size: number; color: string }>; title: string; sub: string; y: number; at: number }> = ({ Icon, title, sub, y, at }) => {
  const e = useEnter(at);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: y,
        height: 170,
        display: "flex",
        alignItems: "center",
        gap: 34,
        padding: "0 34px",
        borderRadius: 24,
        background: "#F6EEDC",
        border: "3px solid rgba(42,36,32,0.25)",
        boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
        opacity: e,
        transform: `translateX(${(1 - e) * 120}px)`,
      }}
    >
      <div style={{ width: 112, height: 112, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={70} color={TURMERIC} />
      </div>
      <div>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 58, color: C.ink, textTransform: "uppercase", lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#6b6052", marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};

export const Recipe: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="YOUR MOVE · FIG. 10" right="RECIPE" dark={false} />
      <Headline setup="Sahi tarika?" punch="Golden recipe" dark={false} punchColor="#C97C00" />
      {RECIPE.map((r, i) => (
        <Row key={r.title} {...r} y={600 + i * 200} at={cue(r.at)} />
      ))}
      {RECIPE.map((r) => (
        <Sfx key={r.title} at={cue(r.at)} src="sfx/pop.wav" volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};

export const Caution: React.FC = () => {
  const cue = useCue();
  const e = useEnter(cue(0.05));
  const lines = [
    { t: "PIPERINE KUCH DAWAIYON KA ASAR BADAL SAKTA HAI", at: 0.15 },
    { t: "SUPPLEMENTS? PEHLE DOCTOR SE POOCHHEIN", at: 0.45 },
    { t: "DOODH MEIN 1 CHUTKI KAAFI HAI", at: 0.72 },
  ];
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="NOTE · FIG. 11" right="SAFETY" dark />
      <Headline setup="Bas ek baat…" punch="Doctor se poochhein" dark punchSize={108} />
      <div style={{ position: "absolute", left: 540 - 120, top: 600, width: 240, height: 240, borderRadius: "50%", background: C.slate2, border: `5px solid ${C.orange}`, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${e})` }}>
        <DoctorIcon size={140} color={C.orange} />
      </div>
      {lines.map((l, i) => (
        <CautionLine key={l.t} text={l.t} y={930 + i * 120} at={cue(l.at)} />
      ))}
      <Sfx at={cue(0.05)} src="onion/tick.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

const CautionLine: React.FC<{ text: string; y: number; at: number }> = ({ text, y, at }) => {
  const e = useEnter(at);
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: y,
        padding: "22px 30px",
        borderLeft: `8px solid ${C.orange}`,
        background: "rgba(243,235,221,0.06)",
        fontFamily: MONO,
        fontSize: 27,
        letterSpacing: 2,
        color: C.cream,
        opacity: e,
        transform: `translateX(${(1 - e) * -60}px)`,
      }}
    >
      {text}
    </div>
  );
};

export const Cta: React.FC = () => {
  const cue = useCue();
  const float = useFloat(10);
  const bubble = useEnter(cue(0.6), { damping: 10, stiffness: 180 });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="YOUR TURN · FIG. 12" right="COMMENT" dark />
      <Headline setup="Dadi ke paas lab nahi tha…" punch="Par science tha!" dark punchColor={TURMERIC} />
      <div style={{ position: "absolute", left: 540 - 150, top: 620 + float }}>
        <HaldiGlass id="cg" size={300} specks={10} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, textAlign: "center", fontFamily: DEVA, fontSize: 58, color: C.cream, opacity: useEnter(cue(0.35)) }}>
        आपके घर में भी काली मिर्च डलती है?
      </div>
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 1210,
          transform: `translateX(-50%) scale(${bubble})`,
          background: C.orange,
          color: C.slate,
          borderRadius: 999,
          padding: "16px 44px",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 54,
          letterSpacing: 2,
          display: "flex",
          alignItems: "center",
          gap: 18,
          whiteSpace: "nowrap",
        }}
      >
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
  dadi: Dadi,
  curcumin: Curcumin,
  problem: Problem,
  twist: Twist,
  piperine: Piperine,
  study: Study,
  result: Result,
  milk: Milk,
  tadka: Tadka,
  trikatu: Trikatu,
  latte: Latte,
  recipe: Recipe,
  caution: Caution,
  cta: Cta,
};
