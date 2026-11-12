import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp, CountUp, Header, Headline, Stamp, useCue, useEnter, useFloat } from "../onion/components";
import { C, DEVA, HEAD, MONO } from "../onion/theme";
import { RED } from "../mitti/art";
import { INK, KraftBg, Sfx, SpeechBubble, Tag, WarmDark } from "../mitti/kraft";
import { Aman, Person, Riya } from "../mitti/people";
import { Bed, Beta, Car, CrossSign, DrMaa, Ecg, Garland, SurgeonPerson, Tree } from "./art";

const LAB = "PAHELI LAB";

/** Polaroid-style card holding a portrait. */
const Card: React.FC<{ x: number; y: number; at: number; rotate: number; label: string; sub: string; children: React.ReactNode; tint?: string }> = ({
  x,
  y,
  at,
  rotate,
  label,
  sub,
  children,
  tint = "#F4EDE0",
}) => {
  const e = useEnter(at);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 420,
        height: 560,
        background: tint,
        border: `6px solid ${INK}`,
        boxShadow: "0 14px 26px rgba(0,0,0,0.3)",
        transform: `rotate(${rotate}deg) scale(${0.85 + 0.15 * e})`,
        opacity: e,
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", left: 50, top: 30 }}>{children}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 56, color: INK, background: tint, paddingTop: 6 }}>{label}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: RED }}>{sub}</div>
    </div>
  );
};

// ===========================================================================

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const hit = cue(0.22);
  const carX = interpolate(frame, [0, hit], [-520, 470], { ...clamp, easing: Easing.in(Easing.quad) });
  const crumple = interpolate(frame, [hit, hit + 5], [0, 1], clamp);
  const shake = frame >= hit && frame < hit + 14 ? Math.sin(frame * 3) * (14 - (frame - hit)) * 1.4 : 0;
  const roadOut = interpolate(frame, [cue(0.42), cue(0.5)], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
      <KraftBg />
      <Header left="PAHELI · FIG. 01" right={LAB} dark={false} />
      <Headline setup="Ek paheli…" punch="Papa + beta = accident!" dark={false} punchColor={RED} punchSize={96} />
      {/* road scene */}
      <div style={{ position: "absolute", left: 0, top: 560, width: 1080, height: 520, opacity: roadOut }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, height: 120, background: "#4A4440", borderTop: `6px solid ${INK}`, borderBottom: `6px solid ${INK}` }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 54, height: 0, borderTop: "8px dashed #F3EBDD" }} />
        </div>
        <div style={{ position: "absolute", left: 820, top: 30 }}>
          <Tree size={240} />
        </div>
        <div style={{ position: "absolute", left: carX, top: 240 }}>
          <Car size={420} crumple={crumple} wheelSpin={frame < hit ? frame * 18 : hit * 18} />
        </div>
      </div>
      <Stamp text="CRASH!" x={540} y={760} at={hit} size={120} />
      <Sfx at={hit} src="sfx/whoosh.wav" volume={0.5} />
      <Sfx at={hit} src="sfx/pop.wav" volume={0.7} />
      {/* after the crash: papa's garlanded photo, beta off to hospital */}
      <Card x={70} y={1000} at={cue(0.55)} rotate={-3} label="PAPA" sub="NAHI RAHE">
        <div style={{ filter: "grayscale(1) sepia(0.25)" }}>
          <Aman size={320} />
        </div>
        <div style={{ position: "absolute", left: -20, top: 250 }}>
          <Garland width={360} />
        </div>
      </Card>
      <Card x={580} y={1000} at={cue(0.75)} rotate={3} label="BETA" sub="→ HOSPITAL">
        <Beta size={320} expression="neutral" />
      </Card>
      <Sfx at={cue(0.55)} src="sfx/pop.wav" volume={0.4} />
      <Sfx at={cue(0.75)} src="sfx/pop.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Hospital: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const surgeonIn = useEnter(cue(0.3));
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="EMERGENCY · FIG. 02" right="OPERATION THEATRE" dark />
      <Headline setup="Surgeon aata hai…" punch="“Ye mera beta hai!”" dark punchColor={RED} punchSize={100} />
      <div style={{ position: "absolute", left: 80, top: 560 }}>
        <CrossSign size={110} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 580, opacity: useEnter(cue(0.05)) }}>
        <Ecg width={360} progress={(frame % 45) / 45} />
      </div>
      <div style={{ position: "absolute", left: 40, top: 1180, opacity: useEnter(cue(0.05)) }}>
        <Bed width={620} />
      </div>
      {/* the surgeon stays a mystery: a silhouette with a question mark */}
      <div style={{ position: "absolute", left: 560, top: 760, opacity: surgeonIn, transform: `translateX(${(1 - surgeonIn) * 200}px)` }}>
        <SurgeonPerson size={440} hair="short" expression="neutral" silhouette={0.92} seed={4} />
        <div style={{ position: "absolute", left: 160, top: 190, fontFamily: HEAD, fontWeight: 700, fontSize: 170, color: C.cream, opacity: useEnter(cue(0.4)) }}>?</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 1490, right: 120, opacity: useEnter(cue(0.6)), fontFamily: DEVA, fontSize: 52, color: C.cream, textAlign: "center", lineHeight: 1.35 }}>
        “मैं इसका operation नहीं कर सकता…”
      </div>
      <SpeechBubble text="ये मेरा बेटा है!" x={300} y={640} at={cue(0.8)} />
      <Sfx at={cue(0.3)} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={cue(0.8)} src="sfx/pop.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

export const Think: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const start = cue(0.35);
  const { n, p } = (() => {
    const secs = (frame - start) / 30;
    const t = Math.max(0, secs);
    return { n: Math.max(1, 3 - Math.floor(t)), p: t % 1 };
  })();
  const ringOn = frame >= start;
  const float = useFloat(6);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="SOCHO · FIG. 03" right={LAB} dark={false} />
      <Headline setup="Papa toh nahi rahe…" punch="Toh surgeon kaun?" dark={false} punchColor={RED} />
      <div style={{ position: "absolute", left: 60, top: 820 + float, opacity: useEnter(cue(0.05)) }}>
        <Riya size={420} expression="neutral" />
      </div>
      {["?", "?", "?"].map((q, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 120 + i * 130,
            top: 640 - i * 30 + Math.sin(frame / 8 + i) * 12,
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 110,
            color: i === 1 ? RED : INK,
            opacity: useEnter(cue(0.1 + i * 0.08)),
          }}
        >
          {q}
        </div>
      ))}
      {/* 3-2-1 countdown */}
      <div style={{ position: "absolute", left: 560, top: 820, width: 420, height: 420, opacity: ringOn ? 1 : 0 }}>
        <svg viewBox="0 0 200 200" width={420} height={420}>
          <circle cx="100" cy="100" r="88" fill="#F4EDE0" stroke={INK} strokeWidth={8} />
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke={RED}
            strokeWidth={12}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={p}
            transform="rotate(-90 100 100)"
            strokeLinecap="round"
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 220, color: INK, transform: `scale(${1.15 - 0.15 * Math.min(1, p * 4)})` }}>{n}</div>
      </div>
      <Tag text="3 SECOND · SOCHO!" x={600} y={1290} at={start} />
      <Sfx at={start} src="onion/tick.wav" volume={0.5} />
      <Sfx at={start + 30} src="onion/tick.wav" volume={0.5} />
      <Sfx at={start + 60} src="onion/tick.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

const GuessRow: React.FC<{ text: string; y: number; at: number; strike: number }> = ({ text, y, at, strike }) => {
  const e = useEnter(at);
  const frame = useCurrentFrame();
  const s = interpolate(frame, [strike, strike + 8], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: y, height: 190, background: "#F4EDE0", border: `6px solid ${INK}`, boxShadow: "0 10px 20px rgba(0,0,0,0.25)", opacity: e, transform: `translateX(${(1 - e) * -120}px) rotate(${(y % 3) - 1}deg)` }}>
      <div style={{ position: "absolute", left: 40, top: 0, bottom: 0, display: "flex", alignItems: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 84, color: INK, opacity: 1 - 0.45 * s }}>{text}</div>
      <svg width="840" height="190" style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1="30" y1="95" x2={30 + 600 * s} y2="95" stroke={RED} strokeWidth={14} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", right: 36, top: 30, fontFamily: HEAD, fontWeight: 700, fontSize: 110, lineHeight: 1, color: RED, transform: `scale(${s})` }}>✗</div>
    </div>
  );
};

export const Guesses: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="GUESS · FIG. 04" right={LAB} dark={false} />
      <Headline setup="Aapka guess?" punch="Sab galat!" dark={false} punchColor={RED} />
      <GuessRow text="SAUTELE PAPA?" y={620} at={cue(0.02)} strike={cue(0.25)} />
      <GuessRow text="BHOOT?" y={860} at={cue(0.22)} strike={cue(0.42)} />
      <GuessRow text="GOD LENE WALE?" y={1100} at={cue(0.4)} strike={cue(0.6)} />
      <Stamp text="ATAK GAYE?" x={540} y={1440} at={cue(0.72)} size={96} rotate={-6} />
      <Sfx at={cue(0.25)} src="sfx/pop.wav" volume={0.4} />
      <Sfx at={cue(0.42)} src="sfx/pop.wav" volume={0.4} />
      <Sfx at={cue(0.6)} src="sfx/pop.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const lit = interpolate(frame, [cue(0.3), cue(0.5)], [0.92, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const spot = interpolate(frame, [0, cue(0.3)], [0, 1], clamp);
  const float = useFloat(5);
  return (
    <AbsoluteFill>
      <WarmDark />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 45% 38% at 50% 58%, rgba(255,236,190,${0.28 * spot}) 0%, rgba(0,0,0,0) 100%)` }} />
      <Header left="JAWAB · FIG. 05" right="REVEAL" dark />
      <Headline setup="Jawab simple hai…" punch="Surgeon = Maa!" dark punchColor={RED} punchSize={124} />
      <div style={{ position: "absolute", left: 540 - 250, top: 640 + float }}>
        <DrMaa size={500} silhouette={lit} expression={lit > 0.3 ? "neutral" : "smile"} />
      </div>
      <Stamp text="MAA!" x={830} y={1230} at={cue(0.55)} size={130} blend="normal" rotate={10} />
      <Tag text="DR. MAA · CHIEF SURGEON" x={300} y={1400} at={cue(0.65)} />
      <Sfx at={cue(0.3)} src="onion/sparkle.wav" volume={0.45} />
      <Sfx at={cue(0.55)} src="sfx/pop.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

/** Thought bubble from a brain-dot to the image it jumps to. */
const Thought: React.FC<{ x: number; y: number; at: number; children: React.ReactNode }> = ({ x, y, at, children }) => {
  const e = useEnter(at, { damping: 11, stiffness: 180 });
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${e})`, transformOrigin: "left bottom" }}>
      <div style={{ width: 420, height: 380, borderRadius: "50%", background: "#F4EDE0", border: `6px solid ${INK}`, overflow: "hidden", position: "relative" }}>{children}</div>
      <div style={{ position: "absolute", left: -10, bottom: -40, width: 44, height: 44, borderRadius: "50%", background: "#F4EDE0", border: `5px solid ${INK}` }} />
      <div style={{ position: "absolute", left: -50, bottom: -80, width: 26, height: 26, borderRadius: "50%", background: "#F4EDE0", border: `5px solid ${INK}` }} />
    </div>
  );
};

export const Bias: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const statAt = cue(0.62);
  const stat = useEnter(statAt);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="DIMAAG · FIG. 06" right="BIAS" dark={false} />
      <Headline setup="Itna mushkil kyun?" punch="Unconscious bias!" dark={false} punchColor={RED} punchSize={104} />
      {/* the word, and the picture the brain jumps to */}
      <div style={{ position: "absolute", left: 70, top: 600, padding: "14px 34px", background: INK, color: C.cream, fontFamily: HEAD, fontWeight: 700, fontSize: 80, letterSpacing: 4, opacity: useEnter(cue(0.08)), transform: `rotate(-3deg)` }}>“SURGEON”</div>
      <div style={{ position: "absolute", left: 90, top: 820, opacity: useEnter(cue(0.12)) }}>
        <Riya size={300} expression="neutral" />
      </div>
      <Thought x={480} y={600} at={cue(0.2)}>
        <div style={{ position: "absolute", left: 70, top: 20 }}>
          <SurgeonPerson size={280} hair="short" mustache expression="neutral" skin="#9C6440" seed={3} />
        </div>
      </Thought>
      <Tag text="AUTO-ASSUME: AADMI" x={520} y={1020} at={cue(0.32)} rotate={2} />
      {/* the stat */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 1220, height: 330, background: "#F4EDE0", border: `6px solid ${INK}`, boxShadow: "0 14px 26px rgba(0,0,0,0.3)", opacity: stat, transform: `translateY(${(1 - stat) * 60}px)` }}>
        <div style={{ position: "absolute", left: 40, top: 20, fontFamily: HEAD, fontWeight: 700, fontSize: 200, color: RED, lineHeight: 1 }}>
          <CountUp from={0} to={15} start={statAt} frames={24} format={(n) => `${Math.round(n)}%`} />
        </div>
        <div style={{ position: "absolute", left: 460, right: 30, top: 40, fontFamily: HEAD, fontWeight: 700, fontSize: 56, color: INK, lineHeight: 1.08, textTransform: "uppercase" }}>
          ne hi socha
          <br />
          “maa”
        </div>
        <div style={{ position: "absolute", left: 40, right: 30, bottom: 28, fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: "rgba(42,36,32,0.65)" }}>BOSTON UNIVERSITY STUDY (APPROX.)</div>
        {/* 10 people, ~1.5 of them got it */}
        <div style={{ position: "absolute", left: 460, top: 190, display: "flex", gap: 8 }}>
          {new Array(10).fill(0).map((_, i) => (
            <div key={i} style={{ width: 34, height: 34, borderRadius: "50%", background: i < 2 && frame > statAt + 20 ? RED : "#B9AD95", border: `3px solid ${INK}` }} />
          ))}
        </div>
      </div>
      <Sfx at={cue(0.2)} src="sfx/pop.wav" volume={0.4} />
      <Sfx at={statAt} src="onion/sparkle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const TwoPapa: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="BONUS · FIG. 07" right="FAMILY" dark />
      <Headline setup="Aur haan…" punch="Do papa bhi ho sakte hain!" dark punchColor={RED} punchSize={92} />
      <div style={{ position: "absolute", left: 40, top: 760, opacity: useEnter(cue(0.05)) }}>
        <SurgeonPerson size={400} hair="short" skin="#B07A52" expression="smile" seed={9} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 760, opacity: useEnter(cue(0.15)), filter: "grayscale(1) sepia(0.2)" }}>
        <Aman size={400} expression="smile" />
      </div>
      <div style={{ position: "absolute", left: 390, top: 1000, opacity: useEnter(cue(0.3)) }}>
        <Beta size={300} expression="smile" />
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 470 + i * 60, top: 880 - ((frame * 2 + i * 40) % 140), fontSize: 60, color: RED, opacity: useEnter(cue(0.4 + i * 0.05)) * 0.9, fontFamily: HEAD }}>♥</div>
      ))}
      <Tag text="SURGEON = DOOSRE PAPA" x={300} y={1520} at={cue(0.5)} />
      <Sfx at={cue(0.5)} src="sfx/pop.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Cta: React.FC = () => {
  const cue = useCue();
  const float = useFloat(6);
  const phone = useEnter(cue(0.2));
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="YOUR TURN · FIG. 08" right="COMMENT" dark={false} />
      <Headline setup="Kitne second lage?" punch="Dosto se poocho!" dark={false} punchColor={RED} />
      <div style={{ position: "absolute", left: 40, top: 680 + float, opacity: useEnter(cue(0.05)) }}>
        <Person size={380} skin="#9C6440" hair="short" outfit="#3E6E8E" expression="grin" phone seed={5} />
      </div>
      <div style={{ position: "absolute", left: 450, top: 620, width: 580, height: 600, borderRadius: 48, background: "#121212", border: "8px solid #2C2C2C", opacity: phone, transform: `translateY(${(1 - phone) * 80}px)` }}>
        <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #2A2A2A" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#E3A52A" }} />
          <span style={{ fontFamily: MONO, fontSize: 26, color: "#ddd" }}>Dosto ka group</span>
        </div>
        <div style={{ margin: "26px 24px 0 auto", padding: "16px 20px", borderRadius: 20, background: RED, fontFamily: MONO, fontSize: 24, color: "white", opacity: useEnter(cue(0.3)), maxWidth: 420, width: "fit-content" }}>
          Paheli: surgeon kaun hai?
        </div>
        <div style={{ margin: "18px 24px 0", padding: "16px 20px", borderRadius: 20, background: "#2A2A2A", fontFamily: MONO, fontSize: 24, color: "#eee", opacity: useEnter(cue(0.45)), maxWidth: 420, width: "fit-content" }}>
          bhoot hai kya??
        </div>
        <div style={{ margin: "18px 24px 0", padding: "16px 20px", borderRadius: 20, background: "#2A2A2A", fontFamily: MONO, fontSize: 24, color: "#eee", opacity: useEnter(cue(0.58)), maxWidth: 420, width: "fit-content" }}>
          arre… MAA hai!!
        </div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 1320, transform: `translateX(-50%) scale(${useEnter(cue(0.66), { damping: 10, stiffness: 180 })})`, background: RED, color: "white", borderRadius: 999, padding: "14px 44px", fontFamily: HEAD, fontWeight: 700, fontSize: 52, letterSpacing: 2, whiteSpace: "nowrap" }}>
        COMMENT KARO ↓
      </div>
      <Sfx at={cue(0.3)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.45)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.58)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  hospital: Hospital,
  think: Think,
  guesses: Guesses,
  reveal: Reveal,
  bias: Bias,
  twopapa: TwoPapa,
  cta: Cta,
};
