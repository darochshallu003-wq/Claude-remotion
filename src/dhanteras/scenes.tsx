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
import { Bartan, Coins, Diya, GOLD, Jhadu, Kalash, Lotus, Snake, Waves } from "./art";

const LAB = "FESTIVAL LAB";

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

/** Flame wobble for diyas, deterministic per frame. */
const useFlicker = (seed = 0) => {
  const frame = useCurrentFrame();
  return (Math.sin(frame * 0.7 + seed) + Math.sin(frame * 1.3 + seed * 2)) / 2;
};

/** Warm floating sparks over dark scenes. */
const Sparks: React.FC<{ count?: number; color?: string }> = ({ count = 26, color = GOLD }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const life = 90 + random(`sl${i}`) * 80;
        const t = ((frame + random(`so${i}`) * life) % life) / life;
        const x = random(`sx${i}`) * 1080 + Math.sin(t * 6 + i) * 30;
        const y = 1900 - t * 1500;
        const s = 4 + random(`ss${i}`) * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 ${s * 2}px ${color}`,
              opacity: Math.sin(Math.PI * t) * 0.7,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Glow: React.FC<{ x: number; y: number; r: number; o: number }> = ({ x, y, r, o }) => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,178,63,${o}) 0%, rgba(0,0,0,0) ${r}px)` }} />
);

/** Item that pops in with a spring; used for the hook trio and recap. */
const PopItem: React.FC<{ x: number; y: number; at: number; children: React.ReactNode; label?: string; dark?: boolean }> = ({
  x,
  y,
  at,
  children,
  label,
  dark = true,
}) => {
  const e = useEnter(at, { damping: 10, stiffness: 170 });
  const float = useFloat(6, 0.06, x);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        transform: `translate(-50%, -50%) scale(${e})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      {children}
      {label && (
        <span style={{ fontFamily: DEVA, fontSize: 52, color: dark ? C.cream : C.ink, whiteSpace: "nowrap" }}>{label}</span>
      )}
    </div>
  );
};

// ===========================================================================

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const switchAt = cue(0.62);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Glow x={540} y={1000} r={600} o={0.18} />
      <Sparks />
      <Header left="TODAY · FIG. 01" right={LAB} dark />
      {frame < switchAt ? (
        <Headline setup="Aaj Dhanteras hai" punch="Sab kharid rahe…" dark punchColor={GOLD} />
      ) : (
        <From at={switchAt}>
          <Headline setup="Par kabhi socha…" punch="Kyun?" dark punchColor={C.orange} punchAt={2} delay={0} punchSize={150} />
        </From>
      )}
      <PopItem x={250} y={880} at={cue(0.18)} label="सोना">
        <Coins size={220} />
      </PopItem>
      <PopItem x={560} y={930} at={cue(0.32)} label="बर्तन">
        <Bartan id="hb" size={300} />
      </PopItem>
      <PopItem x={860} y={900} at={cue(0.48)} label="झाड़ू">
        <Jhadu size={300} style={{ transform: "rotate(14deg)" }} />
      </PopItem>
      <div style={{ position: "absolute", left: 540 - 110, top: 1250 }}>
        <Diya id="hd" size={220} flicker={useFlicker()} />
      </div>
      <Sfx at={cue(0.18)} src="sfx/pop.wav" volume={0.4} />
      <Sfx at={cue(0.32)} src="sfx/pop.wav" volume={0.4} />
      <Sfx at={cue(0.48)} src="sfx/pop.wav" volume={0.4} />
      <Sfx at={switchAt} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

/** Lunar-calendar strip: day tiles 1..15, tile 13 lights up. */
export const Name: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const eq = useEnter(cue(0.05));
  const lightAt = cue(0.42);
  const days = ["धनतेरस", "छोटी दिवाली", "दिवाली", "गोवर्धन", "भाई दूज"];
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="THE NAME · FIG. 02" right="PANCHANG" dark={false} />
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 26, opacity: eq, transform: `translateY(${(1 - eq) * 30}px)` }}>
        <span style={{ fontFamily: DEVA, fontSize: 120, color: "#B8861E" }}>धन</span>
        <span style={{ fontFamily: HEAD, fontSize: 90, color: C.ink }}>+</span>
        <span style={{ fontFamily: DEVA, fontSize: 120, color: C.rust }}>तेरस</span>
      </div>
      <div style={{ position: "absolute", top: 420, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: "#6b6052", opacity: useEnter(cue(0.2)) }}>
        TERAS = TRAYODASHI = 13TH LUNAR DAY
      </div>
      {/* 15-day krishna paksha grid */}
      <div style={{ position: "absolute", top: 520, left: 90, right: 90, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18 }}>
        {new Array(15).fill(0).map((_, i) => {
          const e = useEnter(cue(0.22) + i * 1.2);
          const isTeras = i === 12;
          const on = isTeras && frame >= lightAt;
          const pulse = on ? 1 + Math.sin((frame - lightAt) / 5) * 0.03 : 1;
          return (
            <div
              key={i}
              style={{
                height: 120,
                borderRadius: 16,
                border: `4px solid ${on ? C.rust : "rgba(42,36,32,0.35)"}`,
                background: on ? GOLD : "#F6EEDC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: HEAD,
                fontWeight: 700,
                fontSize: 54,
                color: on ? C.ink : "rgba(42,36,32,0.55)",
                opacity: e,
                transform: `scale(${(0.8 + 0.2 * e) * pulse})`,
                boxShadow: on ? "0 0 40px rgba(232,181,58,0.8)" : "none",
              }}
            >
              {i + 1}
            </div>
          );
        })}
      </div>
      <Pill text="KARTIK · KRISHNA PAKSHA" x={300} y={1000} delay={cue(0.3)} />
      {/* five days of Diwali */}
      <div style={{ position: "absolute", top: 1110, left: 60, right: 60, display: "flex", justifyContent: "space-between" }}>
        {days.map((d, i) => {
          const e = useEnter(cue(0.65) + i * 4);
          const first = i === 0;
          return (
            <div key={d} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: e, transform: `translateY(${(1 - e) * 30}px)` }}>
              <Diya id={`nd${i}`} size={first ? 150 : 120} flicker={Math.sin(frame * 0.8 + i)} />
              <span style={{ fontFamily: DEVA, fontSize: first ? 40 : 32, color: first ? C.rust : C.ink, whiteSpace: "nowrap" }}>{d}</span>
              <span style={{ fontFamily: MONO, fontSize: 20, color: "#6b6052" }}>DAY {i + 1}</span>
            </div>
          );
        })}
      </div>
      <Stamp text="Day 13" x={780} y={1500} at={lightAt} color={C.rust} rotate={-8} size={70} />
      <Sfx at={lightAt} src="onion/sparkle.wav" volume={0.45} />
      <Sfx at={cue(0.65)} src="onion/tick.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Twist: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const coinsOut = interpolate(frame, [cue(0.45), cue(0.75)], [1, 0], clamp);
  const cross = interpolate(frame, [cue(0.5), cue(0.7)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="TWIST · FIG. 03" right={LAB} dark />
      <Headline setup="Par twist ye hai…" punch="Asli dhan paisa nahi!" dark punchSize={104} />
      <div style={{ position: "absolute", left: 540 - 160, top: 720, opacity: 0.35 + 0.65 * coinsOut, filter: `grayscale(${1 - coinsOut})` }}>
        <Coins size={320} n={7} />
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <line x1={330} y1={700} x2={330 + 420 * cross} y2={700 + 480 * cross} stroke={C.red} strokeWidth={26} strokeLinecap="round" />
        <line x1={750} y1={700} x2={750 - 420 * cross} y2={700 + 480 * cross} stroke={C.red} strokeWidth={26} strokeLinecap="round" />
      </svg>
      <Sfx at={cue(0.5)} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

export const Manthan: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const riseAt = cue(0.25);
  const rise = interpolate(frame, [riseAt, riseAt + 50], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const glow = interpolate(frame, [cue(0.4), cue(0.6)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Glow x={540} y={900} r={520} o={0.35 * glow} />
      <Header left="PURANA · FIG. 04" right="SAMUDRA MANTHAN" dark />
      <Headline setup="Samudra manthan se…" punch="Dhanvantari" dark punchColor={GOLD} />
      {/* churning rod */}
      <div style={{ position: "absolute", left: 528, top: 560, width: 24, height: 640, background: "#6B4A2A", border: `4px solid ${C.ink}`, borderRadius: 12, transform: `rotate(${Math.sin(frame / 8) * 4}deg)`, transformOrigin: "50% 100%", opacity: 1 - rise * 0.7 }} />
      <div style={{ position: "absolute", left: 540 - 130, top: 1150 - rise * 440, transform: `scale(${0.7 + 0.3 * rise})`, transformOrigin: "50% 100%" }}>
        <Kalash id="mk" size={260} glow={glow} />
      </div>
      <AbsoluteFill>
        <Waves width={1080} phase={frame / 9} color="#2E5D7A" y={1200} amp={26} />
        <Waves width={1080} phase={frame / 6 + 2} color="#3E7A9A" y={1260} amp={20} />
      </AbsoluteFill>
      <Pill text="AMRIT KALASH" x={120} y={1470} delay={cue(0.45)} accent dark />
      <Pill text="GOD OF AYURVEDA" x={560} y={1470} delay={cue(0.7)} dark />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1580, textAlign: "center", fontFamily: DEVA, fontSize: 60, color: C.cream, opacity: useEnter(cue(0.72)) }}>
        आयुर्वेद के देवता
      </div>
      <Sfx at={riseAt} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={cue(0.4)} src="onion/sparkle.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Health: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const beat = (f: number) => {
    const t = (f % 30) / 30;
    return t < 0.12 ? 1 + t * 1.2 : t < 0.24 ? 1.14 - (t - 0.12) * 1.2 : 1;
  };
  const e = useEnter(cue(0.1), { damping: 10, stiffness: 150 });
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="MEANING · FIG. 05" right="HEALTH = WEALTH" dark={false} />
      <Headline setup="Pehla dhan:" punch="Sehat" dark={false} punchColor={C.green} punchSize={150} />
      <div style={{ position: "absolute", left: 540 - 220, top: 680, transform: `scale(${e * beat(frame)})` }}>
        <svg width="440" height="400" viewBox="0 0 440 400">
          <path d="M220 370 C 40 250, 10 140, 60 80 C 110 20, 190 40, 220 110 C 250 40, 330 20, 380 80 C 430 140, 400 250, 220 370 Z" fill="#D9412B" stroke={C.ink} strokeWidth={10} />
          <path d="M80 200 L 160 200 L 190 140 L 230 270 L 260 200 L 360 200" fill="none" stroke="#F6EEDC" strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1170, textAlign: "center", fontFamily: DEVA, fontSize: 84, color: C.ink, opacity: useEnter(cue(0.5)) }}>
        पहला सुख, निरोगी काया
      </div>
      <Sfx at={cue(0.1)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.5)} src="onion/sparkle.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

/** Two calendar pages: the old moving date vs the fixed 23 Sept. */
const CalPage: React.FC<{ x: number; at: number; top: string; big: string; sub: string; accent: string; struck?: number }> = ({ x, at, top, big, sub, accent, struck = 0 }) => {
  const e = useEnter(at, { damping: 13, stiffness: 120 });
  return (
    <div style={{ position: "absolute", left: x, top: 700, width: 400, height: 460, opacity: e, transform: `translateY(${(1 - e) * -80}px) rotate(${(1 - e) * -8}deg)`, filter: "drop-shadow(0 16px 26px rgba(0,0,0,0.3))" }}>
      <div style={{ height: 100, background: accent, borderRadius: "20px 20px 0 0", border: `4px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 30, letterSpacing: 4, color: "#F6EEDC" }}>{top}</div>
      <div style={{ height: 360, background: "#F6EEDC", border: `4px solid ${C.ink}`, borderTop: "none", borderRadius: "0 0 20px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, position: "relative" }}>
        <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 120, color: C.ink, lineHeight: 1 }}>{big}</span>
        <span style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: "#6b6052", textAlign: "center" }}>{sub}</span>
        {struck > 0 && <div style={{ position: "absolute", left: 30, top: 170, width: 340 * struck, height: 14, background: C.red, borderRadius: 8, transform: "rotate(-12deg)" }} />}
      </div>
    </div>
  );
};

export const Ayurveda: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const roll = cue(0.3);
  const rolling = frame >= roll && frame < cue(0.55);
  const dates = ["15 OCT", "4 NOV", "25 OCT", "12 NOV", "29 OCT", "6 NOV"];
  const shown = rolling ? dates[Math.floor((frame - roll) / 5) % dates.length] : frame < roll ? "2016" : "6 NOV";
  const struck = interpolate(frame, [cue(0.58), cue(0.66)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="FACT · FIG. 06" right="MINISTRY OF AYUSH" dark={false} />
      <Headline setup="National Ayurveda Day" punch="Date badal gayi" dark={false} punchColor={C.green} punchSize={104} />
      <CalPage x={80} at={cue(0.05)} top="DHANTERAS" big={shown} sub={rolling ? "HAR SAAL ALAG" : frame < roll ? "SE DHANTERAS PE" : "OCT ~ NOV"} accent="#B5501C" struck={struck} />
      <CalPage x={600} at={cue(0.68)} top="2025 SE" big="23" sub="SEPTEMBER · FIXED" accent={C.green} />
      <Pill text="2016 – 2024: DHANTERAS PE" x={130} y={1240} delay={cue(0.15)} />
      <Pill text="2025 SE: HAR SAAL 23 SEPT" x={130} y={1320} delay={cue(0.75)} accent />
      <Sfx at={roll} src="onion/tick.wav" volume={0.4} />
      <Sfx at={cue(0.58)} src="onion/slice.wav" volume={0.35} />
      <Sfx at={cue(0.68)} src="onion/thud.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const BartanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const shine = interpolate(frame, [cue(0.55), cue(0.65), cue(0.8)], [0, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Glow x={540} y={1000} r={500} o={0.2} />
      <Header left="TRADITION · FIG. 07" right="BARTAN" dark />
      <Headline setup="Aur bartan?" punch="Kalash ki yaad" dark punchColor={GOLD} />
      <div style={{ position: "absolute", left: 120, top: 700, opacity: useEnter(cue(0.12)) }}>
        <Kalash id="bk" size={250} glow={0.4} />
      </div>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path d={`M420 900 L ${420 + 120 * useEnter(cue(0.3))} 900`} stroke={C.cream} strokeWidth={10} strokeLinecap="round" strokeDasharray="20 18" />
        <path d="M540 880 L 560 900 L 540 920" fill="none" stroke={C.cream} strokeWidth={10} strokeLinecap="round" opacity={useEnter(cue(0.35))} />
      </svg>
      <div style={{ position: "absolute", left: 560, top: 720, opacity: useEnter(cue(0.38)), transform: `scale(${0.8 + 0.2 * useEnter(cue(0.38))})` }}>
        <Bartan id="bb" size={430} shine={shine} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1230, textAlign: "center", fontFamily: DEVA, fontSize: 66, color: C.cream, opacity: useEnter(cue(0.5)) }}>
        नया बर्तन घर लाना = शुभ
      </div>
      <Sfx at={cue(0.38)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.55)} src="onion/sparkle.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

/** Paper card with a kundli grid and the prophecy typed on. */
export const Hima: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="LOK KATHA · FIG. 08" right="RAJA HIMA" dark={false} />
      <Headline setup="Ab sone ki kahani" punch="Raja Hima ka beta" dark={false} punchColor={C.rust} punchSize={104} />
      <PaperCard x={170} y={580} w={740} h={620} delay={cue(0.1)} rotate={-2} caption="कुंडली" label="PROPHECY" seed="kundli">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <svg width="420" height="420" viewBox="0 0 420 420">
            <rect x="10" y="10" width="400" height="400" fill="none" stroke={C.ink} strokeWidth={6} />
            <path d="M10 10 L 410 410 M410 10 L 10 410 M210 10 L 10 210 L 210 410 L 410 210 Z" fill="none" stroke={C.ink} strokeWidth={4} />
            <circle cx="210" cy="110" r="16" fill={C.red} />
          </svg>
        </AbsoluteFill>
      </PaperCard>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1280, textAlign: "center" }}>
        <TypeOn text="SHAADI KA CHAUTHA DIN: SAANP KA DANSH" start={cue(0.45)} cps={18} style={{ fontFamily: MONO, fontSize: 34, letterSpacing: 2, color: C.ink }} />
      </div>
      <Stamp text="Day 4" x={790} y={640} at={cue(0.7)} color={C.red} rotate={8} size={72} />
      <Sfx at={cue(0.1)} src="sfx/pop.wav" volume={0.35} />
      <Sfx at={cue(0.7)} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

/** Doorway at night: gold pile grows, diyas light one by one. */
const Doorway: React.FC<{ pile: number; diyas: number; snake?: number; dazzle?: number }> = ({ pile, diyas, snake = -1, dazzle = 0 }) => {
  const frame = useCurrentFrame();
  const spots = [
    [150, 1290], [300, 1350], [780, 1350], [930, 1290], [220, 1130], [860, 1130],
  ];
  return (
    <>
      {/* door frame */}
      <div style={{ position: "absolute", left: 300, top: 560, width: 480, height: 760, background: "#1A120C", border: `14px solid #6B4A2A`, borderBottom: "none", borderRadius: "240px 240px 0 0" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1320, height: 600, background: "linear-gradient(#3A2A1E, #1E1610)" }} />
      <Glow x={540} y={1250} r={260 + 340 * pile} o={0.15 + 0.35 * pile + 0.25 * dazzle} />
      {/* pile */}
      <div style={{ position: "absolute", left: 540 - 180, top: 1310 - 220 * pile, transform: `scale(${0.4 + 0.6 * pile})`, transformOrigin: "50% 100%", opacity: pile > 0 ? 1 : 0 }}>
        <svg width="360" height="240" viewBox="0 0 360 240">
          <path d="M10 230 C 60 80, 300 80, 350 230 Z" fill={GOLD} stroke={C.ink} strokeWidth={6} />
          {new Array(16).fill(0).map((_, i) => (
            <ellipse key={i} cx={60 + random(`cx${i}`) * 240} cy={130 + random(`cy${i}`) * 90} rx={22} ry={8} fill={i % 3 ? "#F2C75A" : "#D9D9D9"} stroke={C.ink} strokeWidth={3} />
          ))}
        </svg>
      </div>
      {spots.map(([x, y], i) => (
        <div key={i} style={{ position: "absolute", left: x - 70, top: y - 60, opacity: i < diyas ? 1 : 0.15 }}>
          <Diya id={`dw${i}`} size={140} lit={i < diyas ? 1 : 0} flicker={Math.sin(frame * 0.9 + i * 2)} />
        </div>
      ))}
      {snake >= 0 && (
        <div style={{ position: "absolute", left: 540 - 130, top: 1060 - 120 * snake, transform: `scale(${0.6 + 0.4 * snake})`, filter: `brightness(${1 + dazzle * 0.6})` }}>
          <Snake size={260} rise={snake} />
        </div>
      )}
    </>
  );
};

export const Gold: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const pile = interpolate(frame, [cue(0.15), cue(0.5)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const diyas = Math.floor(interpolate(frame, [cue(0.45), cue(0.75)], [0, 6.99], clamp));
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="LOK KATHA · FIG. 09" right="THE NIGHT" dark />
      <Headline setup="Patni ka plan:" punch="Sona + diye + kahaniyan" dark punchColor={GOLD} punchSize={92} />
      <Doorway pile={pile} diyas={diyas} />
      <Pill text="RAAT BHAR GEET" x={360} y={1500} delay={cue(0.78)} accent dark />
      <Sfx at={cue(0.15)} src="onion/tick.wav" volume={0.4} />
      <Sfx at={cue(0.3)} src="onion/tick.wav" volume={0.4} />
      <Sfx at={cue(0.45)} src="onion/sparkle.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Yama: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const snake = interpolate(frame, [cue(0.05), cue(0.3)], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const dazzle = interpolate(frame, [cue(0.3), cue(0.42)], [0, 1], clamp);
  const leave = interpolate(frame, [cue(0.72), cue(0.92)], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const dawn = interpolate(frame, [cue(0.72), cue(1)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="LOK KATHA · FIG. 10" right="YAMRAJ" dark />
      <Headline setup="Yamraj aaye saanp bankar…" punch="Aankhen chaundhiya gayi" dark punchColor={GOLD} punchSize={92} />
      <AbsoluteFill style={{ opacity: 1 - leave }}>
        <Doorway pile={1} diyas={6} snake={snake} dazzle={dazzle} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: leave }}>
        <Doorway pile={1} diyas={6} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(rgba(255,200,120,${0.25 * dawn}), rgba(0,0,0,0) 60%)` }} />
      <Stamp text="Khaali laute" x={540} y={1560} at={cue(0.8)} color={C.orange} rotate={-6} size={76} blend="normal" />
      <Sfx at={cue(0.05)} src="sfx/whoosh.wav" volume={0.4} />
      <Sfx at={cue(0.3)} src="onion/sparkle.wav" volume={0.5} />
      <Sfx at={cue(0.8)} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

export const Deep: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const lit = interpolate(frame, [cue(0.3), cue(0.4)], [0, 1], clamp);
  const needle = interpolate(frame, [cue(0.05), cue(0.3)], [-140, 180], { ...clamp, easing: Easing.out(Easing.back(1.2)) });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Glow x={540} y={1180} r={480} o={0.3 * lit} />
      <Sparks count={16} />
      <Header left="RITUAL · FIG. 11" right="YAM DEEPDAAN" dark />
      <Headline setup="Isliye aaj bhi…" punch="Yam ka diya" dark punchColor={GOLD} />
      {/* compass */}
      <div style={{ position: "absolute", left: 540 - 220, top: 560, width: 440, height: 440, opacity: useEnter(cue(0.02)) }}>
        <svg width="440" height="440" viewBox="0 0 440 440">
          <circle cx="220" cy="220" r="200" fill="rgba(243,235,221,0.06)" stroke={C.cream} strokeWidth={6} />
          {["N", "E", "S", "W"].map((d, i) => {
            const a = (i * Math.PI) / 2;
            return (
              <text key={d} x={220 + Math.sin(a) * 160} y={232 - Math.cos(a) * 160} textAnchor="middle" fontFamily={HEAD} fontWeight={700} fontSize={44} fill={d === "S" ? GOLD : C.muted}>
                {d}
              </text>
            );
          })}
          <g transform={`rotate(${needle} 220 220)`}>
            <path d="M220 70 L 238 220 L 220 240 L 202 220 Z" fill={C.orange} stroke={C.ink} strokeWidth={4} />
            <path d="M220 370 L 238 220 L 202 220 Z" fill={C.cream} stroke={C.ink} strokeWidth={4} opacity={0.6} />
          </g>
        </svg>
      </div>
      <div style={{ position: "absolute", left: 540 - 150, top: 1080 }}>
        <Diya id="yd" size={300} lit={lit} flicker={useFlicker(3)} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center", fontFamily: DEVA, fontSize: 64, color: C.cream, opacity: useEnter(cue(0.5)) }}>
        घर के बाहर, दक्षिण दिशा में
      </div>
      <Pill text="DHANTERAS KI SHAAM" x={330} y={1520} delay={cue(0.6)} accent dark />
      <Sfx at={cue(0.3)} src="onion/sparkle.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const JhaduScene: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const sweepT = interpolate(frame, [cue(0.5), cue(0.85)], [0, 1], clamp);
  const sweep = Math.sin(sweepT * Math.PI * 4) * 22;
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="BELIEF · FIG. 12" right="JHADU" dark={false} />
      <Headline setup="Aur jhaadu?" punch="Lakshmi ka roop" dark={false} punchColor="#C2185B" />
      <div style={{ position: "absolute", left: 540 - 150, top: 590, opacity: useEnter(cue(0.15)) }}>
        <Lotus size={300} />
      </div>
      <div style={{ position: "absolute", left: 540 - 110, top: 800, transform: `rotate(${20 + sweep}deg)`, transformOrigin: "50% 10%", opacity: useEnter(cue(0.25)) }}>
        <Jhadu size={500} />
      </div>
      {/* dust swept away */}
      {new Array(18).fill(0).map((_, i) => {
        const s = cue(0.5) + i * 2;
        const t = interpolate(frame, [s, s + 30], [0, 1], clamp);
        if (t <= 0 || t >= 1) return null;
        return <div key={i} style={{ position: "absolute", left: 620 + t * (300 + random(`dx${i}`) * 200), top: 1280 - t * random(`dy${i}`) * 200, width: 20, height: 20, borderRadius: "50%", background: "rgba(90,80,70,0.5)", opacity: 1 - t }} />;
      })}
      <Pill text="NAYI JHADU = DARIDRATA KI SAFAI" x={160} y={1420} delay={cue(0.55)} accent />
      <Sfx at={cue(0.5)} src="sfx/whoosh.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

const RecapRow: React.FC<{ y: number; at: number; icon: React.ReactNode; item: string; why: string }> = ({ y, at, icon, item, why }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: y, height: 190, display: "flex", alignItems: "center", gap: 30, padding: "0 30px", borderRadius: 24, background: "#F6EEDC", border: "3px solid rgba(42,36,32,0.25)", boxShadow: "0 10px 22px rgba(0,0,0,0.12)", opacity: e, transform: `translateX(${(1 - e) * 120}px)` }}>
      <div style={{ width: 150, height: 150, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>{icon}</div>
      <div>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: C.ink, textTransform: "uppercase", lineHeight: 1.05 }}>{item}</div>
        <div style={{ fontFamily: DEVA, fontSize: 40, color: "#6b6052", marginTop: 4 }}>{why}</div>
      </div>
    </div>
  );
};

export const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const rows = [
    { item: "Bartan", why: "सेहत के लिए", at: 0.12, icon: <Bartan id="rb" size={130} /> },
    { item: "Sona", why: "सुरक्षा के लिए", at: 0.34, icon: <Coins size={90} n={4} /> },
    { item: "Jhaadu", why: "सफ़ाई के लिए", at: 0.56, icon: <Jhadu size={130} style={{ transform: "rotate(20deg)" }} /> },
    { item: "Diya", why: "यम के लिए", at: 0.76, icon: <Diya id="rd" size={120} flicker={Math.sin(frame * 0.8)} /> },
  ];
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="RECAP · FIG. 13" right="CHEAT SHEET" dark={false} />
      <Headline setup="Toh yaad rakhiye" punch="Kya · kyun" dark={false} punchColor={C.rust} />
      {rows.map((r, i) => (
        <RecapRow key={r.item} y={580 + i * 220} at={cue(r.at)} icon={r.icon} item={r.item} why={r.why} />
      ))}
      {rows.map((r) => (
        <Sfx key={r.item} at={cue(r.at)} src="sfx/pop.wav" volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const bubble = useEnter(cue(0.35), { damping: 10, stiffness: 180 });
  const wish = useEnter(cue(0.62), { damping: 9, stiffness: 140 });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Glow x={540} y={1000} r={600} o={0.25} />
      <Sparks count={34} />
      <Header left="YOUR TURN · FIG. 14" right="COMMENT" dark />
      <Headline setup="Aapne is Dhanteras…" punch="Kya kharida?" dark punchColor={GOLD} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 640, display: "flex", justifyContent: "space-between" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Diya key={i} id={`cd${i}`} size={170} flicker={Math.sin(frame * 0.8 + i * 1.7)} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 540, top: 920, transform: `translateX(-50%) scale(${bubble})`, background: C.orange, color: C.slate, borderRadius: 999, padding: "16px 44px", fontFamily: HEAD, fontWeight: 700, fontSize: 54, letterSpacing: 2, display: "flex", alignItems: "center", gap: 18, whiteSpace: "nowrap" }}>
        COMMENT KARO
        <svg width="40" height="48" viewBox="0 0 40 48">
          <path d="M20 4 V 40 M6 26 L 20 42 L 34 26" fill="none" stroke={C.slate} strokeWidth={7} strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, textAlign: "center", transform: `scale(${wish})`, opacity: wish }}>
        <div style={{ fontFamily: DEVA, fontSize: 110, color: GOLD, textShadow: "0 0 30px rgba(232,181,58,0.6)" }}>शुभ धनतेरस</div>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: C.cream, letterSpacing: 4, marginTop: 10 }}>HAPPY DHANTERAS!</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: C.muted, opacity: useEnter(cue(0.7)) }}>
        BELIEFS &amp; FOLKLORE · PURANIC + LOK KATHA
      </div>
      <Sfx at={cue(0.35)} src="sfx/pop.wav" volume={0.55} />
      <Sfx at={cue(0.62)} src="onion/sparkle.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  name: Name,
  twist: Twist,
  manthan: Manthan,
  health: Health,
  ayurveda: Ayurveda,
  bartan: BartanScene,
  hima: Hima,
  gold: Gold,
  yama: Yama,
  deep: Deep,
  jhadu: JhaduScene,
  recap: Recap,
  cta: Cta,
};
