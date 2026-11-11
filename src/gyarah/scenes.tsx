import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { clamp, CountUp, Header, Headline, Stamp, useCue, useEnter, useFloat } from "../onion/components";
import { C, DEVA, HEAD, MONO } from "../onion/theme";
import { RED } from "../mitti/art";
import { INK, KraftBg, Sfx, SpeechBubble, Tag, WarmDark } from "../mitti/kraft";
import { Aman, Dadi, Riya } from "../mitti/people";

const LAB = "11 · 11 · 2026";
const GLOW = "#7FE3C4"; // digital-clock green

// ---------------------------------------------------------------------------
// Art

/** Phone with a lock-screen clock. `digits` is "HH:MM". */
const Phone: React.FC<{ size: number; digits: string; glow?: number; date?: string }> = ({ size, digits, glow = 0, date = "BUDHVAAR, 11 NOVEMBER" }) => {
  const h = size * 1.9;
  return (
    <div
      style={{
        width: size,
        height: h,
        borderRadius: size * 0.14,
        background: INK,
        padding: size * 0.05,
        boxShadow: `0 20px 40px rgba(0,0,0,0.45), 0 0 ${80 * glow}px ${30 * glow}px rgba(127,227,196,${0.55 * glow})`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: size * 0.1,
          background: "linear-gradient(160deg, #2B3557 0%, #4B2F5E 60%, #7A3B4E 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: h * 0.14,
          color: "white",
          overflow: "hidden",
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: size * 0.055, letterSpacing: 2, opacity: 0.8 }}>{date}</div>
        <div style={{ fontFamily: HEAD, fontWeight: 600, fontSize: size * 0.34, lineHeight: 1.1, textShadow: glow ? `0 0 ${30 * glow}px ${GLOW}` : undefined, color: glow ? mixGlow(glow) : "white" }}>
          {digits}
        </div>
      </div>
    </div>
  );
};

const mixGlow = (t: number) => (t > 0.5 ? "#E9FFF7" : "white");

/** Seven-segment style digital clock card. */
const ClockCard: React.FC<{ digits: string; w: number; dim?: boolean; style?: React.CSSProperties }> = ({ digits, w, dim, style }) => (
  <div
    style={{
      width: w,
      padding: `${w * 0.06}px 0`,
      borderRadius: 18,
      background: "#141816",
      border: `5px solid ${INK}`,
      textAlign: "center",
      fontFamily: MONO,
      fontSize: w * 0.3,
      color: dim ? "rgba(127,227,196,0.35)" : GLOW,
      textShadow: dim ? undefined : `0 0 18px ${GLOW}`,
      boxShadow: "0 10px 20px rgba(0,0,0,0.35)",
      ...style,
    }}
  >
    {digits}
  </div>
);

const pad = (n: number) => String(n).padStart(2, "0");
const randomTime = (seed: string) => {
  let hh = Math.floor(random(seed) * 24);
  const mm = Math.floor(random(`${seed}m`) * 60);
  if (hh === 11 && mm === 11) hh = 10;
  return `${pad(hh)}:${pad(mm)}`;
};

/** Little sparkle star. */
const Star: React.FC<{ x: number; y: number; size: number; at: number; seed?: number }> = ({ x, y, size, at, seed = 0 }) => {
  const e = useEnter(at, { damping: 8, stiffness: 200 });
  const frame = useCurrentFrame();
  const tw = 0.8 + 0.2 * Math.sin(frame / 5 + seed);
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ position: "absolute", left: x - size / 2, top: y - size / 2, transform: `scale(${e * tw}) rotate(${frame + seed * 40}deg)` }}>
      <path d="M0 -48 L12 -12 L48 0 L12 12 L0 48 L-12 12 L-48 0 L-12 -12 Z" fill="#FFD23F" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
};

/** Cartoon brain with a "save" folder. */
const Brain: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 200 160">
    <path
      d="M100 20 C70 0 30 10 28 45 C5 55 5 95 28 105 C30 140 75 155 100 135 C125 155 170 140 172 105 C195 95 195 55 172 45 C170 10 130 0 100 20 Z"
      fill="#F4A6B4"
      stroke={INK}
      strokeWidth={6}
    />
    <path d="M100 22 V135" stroke={INK} strokeWidth={5} />
    <path d="M45 55 q20 10 10 30 M60 105 q20 -5 25 15 M150 55 q-20 10 -10 30 M140 105 q-20 -5 -25 15" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

// ===========================================================================
// Scenes

export const Hook: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const flip = interpolate(frame, [cue(0.3), cue(0.42)], [0, 1], clamp);
  const minutes = flip < 1 ? "11:10" : "11:11";
  const glow = interpolate(frame, [cue(0.42), cue(0.55)], [0, 1], clamp);
  const f = useFloat(10, 0.06);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="PHONE · FIG. 01" right={LAB} dark={false} />
      <Headline setup="Phone uthaya aur…" punch="Phir se 11:11!" dark={false} punchColor={RED} punchSize={124} />
      <div style={{ position: "absolute", left: 540 - 210, top: 640 + f, transform: `rotate(-4deg)` }}>
        <Phone size={420} digits={minutes} glow={glow} />
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} x={[260, 830, 220, 860, 540][i]} y={[700, 760, 1180, 1250, 600][i]} size={[80, 100, 70, 90, 60][i]} at={cue(0.45) + i * 3} seed={i} />
      ))}
      <div style={{ position: "absolute", left: 70, top: 1390, opacity: useEnter(cue(0.5)) }}>
        <Riya size={300} expression="grin" phone />
      </div>
      <SpeechBubble text="Universe का sign?!" x={360} y={1450} at={cue(0.7)} />
      <Sfx at={cue(0.42)} src="onion/sparkle.wav" volume={0.45} />
      <Sfx at={cue(0.7)} src="sfx/pop.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Maths: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const cols = 40;
  const rows = 36; // 40 x 36 = 1,440 minutes
  const cell = 22;
  const gridW = cols * cell;
  const reveal = interpolate(frame, [cue(0.08), cue(0.4)], [0, 1], clamp);
  const target = 11 * 60 + 11;
  const pulse = 1 + 0.25 * Math.sin(frame / 3);
  const glances = useEnter(cue(0.6));
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="MATHS · FIG. 02" right="1 DIN = 1440 MINUTE" dark />
      <Headline setup="Din mein 1,440 minute…" punch="11:11 sirf ek!" dark punchColor={GLOW} punchSize={110} />
      <svg width={gridW} height={rows * cell} style={{ position: "absolute", left: (1080 - gridW) / 2, top: 560 }}>
        {new Array(cols * rows).fill(0).map((_, i) => {
          const shown = i / (cols * rows) < reveal;
          const hit = i === target;
          const x = (i % cols) * cell;
          const y = Math.floor(i / cols) * cell;
          return (
            <rect
              key={i}
              x={x + 3}
              y={y + 3}
              width={cell - 6}
              height={cell - 6}
              rx={3}
              fill={hit && reveal >= 1 ? GLOW : "rgba(243,235,221,0.22)"}
              opacity={shown ? 1 : 0}
              transform={hit && reveal >= 1 ? `translate(${x + cell / 2} ${y + cell / 2}) scale(${pulse * 1.6}) translate(${-x - cell / 2} ${-y - cell / 2})` : undefined}
            />
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: C.cream, opacity: glances, transform: `translateY(${(1 - glances) * 30}px)` }}>
        PAR HUM PHONE DEKHTE HAIN
        <br />
        <CountUp from={0} to={50} start={cue(0.62)} frames={30} format={(n) => `${Math.round(n)}+ BAAR`} style={{ fontSize: 130, color: C.orange }} />
      </div>
      <Sfx at={cue(0.4)} src="onion/tick.wav" volume={0.5} />
      <Sfx at={cue(0.62)} src="onion/sparkle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Chance: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const n = 15;
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="CHANCE · FIG. 03" right="50 NAZAR / DIN" dark={false} />
      <Headline setup="Itni baar dekhoge to…" punch="Kabhi to dikhega!" dark={false} punchColor={RED} punchSize={104} />
      {new Array(n).fill(0).map((_, i) => {
        const at = cue(0.05) + i * 4;
        const e = interpolate(frame, [at, at + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
        const hit = i === 11;
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <div key={i} style={{ position: "absolute", left: 90 + col * 310, top: 600 + row * 160, transform: `scale(${e * (hit ? 1.08 : 1)})` }}>
            <ClockCard digits={hit ? "11:11" : randomTime(`c${i}`)} w={280} dim={!hit} style={hit ? { border: `6px solid ${RED}` } : undefined} />
          </div>
        );
      })}
      <Stamp text="Chamatkaar nahi!" x={540} y={1470} at={cue(0.7)} size={84} />
      <Sfx at={cue(0.05) + 11 * 4} src="onion/sparkle.wav" volume={0.4} />
      <Sfx at={cue(0.7)} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

export const Memory: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const fall = (i: number) => interpolate(frame, [cue(0.15) + i * 3, cue(0.15) + i * 3 + 40], [0, 1], clamp);
  const keep = useEnter(cue(0.55));
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="DIMAAG · FIG. 04" right="MEMORY" dark />
      <Headline setup="Hazaaron time bhool gaye…" punch="11:11 save ho gaya!" dark punchColor={GLOW} punchSize={104} />
      <div style={{ position: "absolute", left: 540 - 200, top: 640 }}>
        <Brain size={400} />
      </div>
      {new Array(10).fill(0).map((_, i) => {
        const t = fall(i);
        const x = 90 + random(`mx${i}`) * 760;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 600 + t * 900, opacity: 1 - t, transform: `rotate(${(random(`mr${i}`) - 0.5) * 60 * t}deg)` }}>
            <ClockCard digits={randomTime(`m${i}`)} w={200} dim />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 540 - 170, top: 1040, transform: `scale(${keep})` }}>
        <ClockCard digits="11:11" w={340} style={{ border: `6px solid ${GLOW}` }} />
      </div>
      <Tag text="SAVED ✓" x={640} y={1010} at={cue(0.7)} rotate={6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", fontFamily: DEVA, fontSize: 56, color: C.cream, opacity: useEnter(cue(0.75)) }}>
        10:47? 4:22? कुछ याद नहीं…
      </div>
      <Sfx at={cue(0.55)} src="sfx/pop.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Bias: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const spots: [number, number, string, number][] = [
    [140, 1060, "₹111", 0.45],
    [640, 1000, "BUS 11", 0.52],
    [180, 1300, "PAGE 111", 0.59],
    [620, 1280, "11:11", 0.66],
    [380, 1520, "SEAT 11", 0.73],
  ];
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="BIAS · FIG. 05" right="BAADER-MEINHOF" dark={false} />
      <Headline setup="Confirmation bias +" punch="Frequency illusion" dark={false} punchColor={RED} punchSize={104} />
      <div style={{ position: "absolute", left: 70, right: 70, top: 560, fontFamily: DEVA, fontSize: 50, color: INK, lineHeight: 1.35, opacity: useEnter(cue(0.08)) }}>
        जो दिमाग में बैठा है, वही हर जगह दिखता है।
      </div>
      <div style={{ position: "absolute", left: 540 - 120, top: 720, opacity: useEnter(cue(0.2)) }}>
        <Aman size={240} expression="smile" />
      </div>
      {spots.map(([x, y, t, at], i) => {
        const e = useEnter(cue(at), { damping: 9, stiffness: 220 });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              padding: "14px 30px",
              background: "#FBF5E8",
              border: `5px solid ${INK}`,
              borderRadius: 14,
              fontFamily: HEAD,
              fontWeight: 700,
              fontSize: 60,
              color: RED,
              transform: `scale(${e}) rotate(${Math.sin(frame / 10 + i) * 3}deg)`,
              boxShadow: "0 8px 0 rgba(0,0,0,0.2)",
            }}
          >
            {t}
          </div>
        );
      })}
      {spots.map(([, , , at], i) => (
        <Sfx key={i} at={cue(at)} src="sfx/pop.wav" volume={0.3} />
      ))}
    </AbsoluteFill>
  );
};

export const Today: React.FC = () => {
  const cue = useCue();
  const date = useEnter(cue(0.08), { damping: 10, stiffness: 140 });
  const card = useEnter(cue(0.45));
  const f = useFloat(6, 0.05);
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="AAJ · FIG. 06" right="11 NOV 2026" dark />
      <Headline setup="Par aaj sach mein khaas hai…" punch="11 · 11" dark punchColor={GLOW} punchSize={130} />
      {/* calendar page */}
      <div style={{ position: "absolute", left: 540 - 220, top: 620 + f, width: 440, borderRadius: 22, overflow: "hidden", border: `6px solid ${INK}`, background: "#FBF5E8", transform: `scale(${date}) rotate(-3deg)`, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
        <div style={{ background: RED, color: "white", fontFamily: HEAD, fontWeight: 700, fontSize: 56, textAlign: "center", padding: "12px 0", letterSpacing: 4 }}>NOVEMBER</div>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 240, lineHeight: 1.05, textAlign: "center", color: INK }}>11</div>
        <div style={{ fontFamily: MONO, fontSize: 28, textAlign: "center", color: INK, paddingBottom: 18, letterSpacing: 3 }}>BUDHVAAR · 2026</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 1180,
          padding: "28px 34px",
          borderRadius: 24,
          background: "rgba(243,235,221,0.08)",
          border: `3px solid ${C.orange}`,
          opacity: card,
          transform: `translateY(${(1 - card) * 40}px)`,
        }}
      >
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: C.orange }}>📚 NATIONAL EDUCATION DAY</div>
        <div style={{ fontFamily: DEVA, fontSize: 46, color: C.cream, marginTop: 10 }}>मौलाना अबुल कलाम आज़ाद का जन्मदिन — भारत के पहले शिक्षा मंत्री</div>
      </div>
      <div style={{ position: "absolute", right: 60, top: 1480, opacity: useEnter(cue(0.65)) }}>
        <Dadi size={260} expression="smile" />
      </div>
      <Tag text="पढ़ाई ज़िंदाबाद!" x={110} y={1560} at={cue(0.75)} />
      <Sfx at={cue(0.08)} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={cue(0.45)} src="onion/sparkle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Cta: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const f = useFloat(10, 0.06);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="WISH · FIG. 07" right={LAB} dark={false} />
      <Headline setup="Wish zaroor maangiye…" punch="Mehnat bhi kijiye!" dark={false} punchColor={RED} punchSize={110} />
      <div style={{ position: "absolute", left: 540 - 180, top: 620 + f }}>
        <ClockCard digits="11:11" w={360} />
      </div>
      {new Array(6).fill(0).map((_, i) => (
        <Star key={i} x={540 + Math.cos((i / 6) * Math.PI * 2 + frame / 40) * 300} y={700 + Math.sin((i / 6) * Math.PI * 2 + frame / 40) * 170} size={60} at={cue(0.15) + i * 3} seed={i} />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, display: "flex", justifyContent: "center", gap: 40 }}>
        <div style={{ opacity: useEnter(cue(0.3)) }}>
          <Riya size={280} expression="smile" />
        </div>
        <div style={{ opacity: useEnter(cue(0.38)) }}>
          <Aman size={280} expression="grin" />
        </div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1440, textAlign: "center", fontFamily: DEVA, fontSize: 52, color: INK, opacity: useEnter(cue(0.6)) }}>
        आपकी wish क्या है?<br />Comment में बताओ 👇
      </div>
      <Sfx at={cue(0.15)} src="onion/sparkle.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  math: Maths,
  chance: Chance,
  memory: Memory,
  bias: Bias,
  today: Today,
  cta: Cta,
};
