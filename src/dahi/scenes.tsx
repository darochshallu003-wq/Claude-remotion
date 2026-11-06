import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { clamp, CountUp, Header, Headline, Stamp, useCue, useEnter, useFloat } from "../onion/components";
import { SnowIcon } from "../onion/art";
import { C, DEVA, HEAD, MONO } from "../onion/theme";
import { RED } from "../mitti/art";
import { Grain, INK, KraftBg, Sfx, SpeechBubble, Tag, WarmDark } from "../mitti/kraft";
import { Dadi, Mummy, PersonProps, Riya } from "../mitti/people";
import { Bacterium } from "../tamra/art";
import { Casserole, COLD, Fridge, JamanSpoon, Katori, Oven, Thermometer, WARM } from "./art";

const LAB = "DAHI LAB";
const LACTO = "#E9C46A"; // friendly yellow for the dahi bacteria

/** A little bacterium that wiggles while active and dozes under a blanket when cold. */
const Lacto: React.FC<{ x: number; y: number; size: number; active?: number; sleepy?: number; seed?: number; damage?: number }> = ({
  x,
  y,
  size,
  active = 1,
  sleepy = 0,
  seed = 0,
  damage = 0,
}) => {
  const frame = useCurrentFrame();
  const wiggle = Math.sin(frame / 4 + seed) * 8 * active;
  return (
    <div style={{ position: "absolute", left: x, top: y + wiggle * 0.4, transform: `rotate(${wiggle}deg)` }}>
      <Bacterium size={size} color={LACTO} damage={damage} />
      {sleepy > 0 && (
        <>
          <div style={{ position: "absolute", left: size * 0.05, top: size * 0.27, width: size * 0.9, height: size * 0.17, borderRadius: 14, background: COLD, border: `4px solid ${INK}`, opacity: sleepy }} />
          <div style={{ position: "absolute", left: size * 0.8, top: -size * 0.15 - ((frame / 2 + seed * 10) % 30), fontFamily: HEAD, fontWeight: 700, fontSize: size * 0.22, color: "#E8EEF5", opacity: sleepy }}>z</div>
        </>
      )}
    </div>
  );
};

// ===========================================================================

export const Hook: React.FC = () => {
  const cue = useCue();
  const panel = (x: number, warm: boolean, at: number) => (
    <Panel x={x} warm={warm} at={at} />
  );
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="KITCHEN · FIG. 01" right={LAB} dark={false} />
      <Headline setup="Garmi mein jam gaya…" punch="Sardi mein doodh hi doodh!" dark={false} punchColor={RED} punchSize={100} />
      {panel(60, true, cue(0.05))}
      {panel(560, false, cue(0.35))}
      <div style={{ position: "absolute", left: 540 - 150, top: 1050, opacity: useEnter(cue(0.55)) }}>
        <Mummy size={300} expression="neutral" />
      </div>
      <SpeechBubble text="क्यों?!" x={690} y={1110} at={cue(0.8)} />
      <Sfx at={cue(0.35)} src="onion/tick.wav" volume={0.5} />
      <Sfx at={cue(0.8)} src="sfx/pop.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

const Panel: React.FC<{ x: number; warm: boolean; at: number }> = ({ x, warm, at }) => {
  const e = useEnter(at);
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 580,
        width: 460,
        height: 440,
        background: warm ? "linear-gradient(#F6C77A, #E9A54A)" : "linear-gradient(#9CC3DA, #5E8DB8)",
        border: `6px solid ${INK}`,
        boxShadow: "0 14px 26px rgba(0,0,0,0.3)",
        transform: `rotate(${warm ? -2 : 2}deg) scale(${0.85 + 0.15 * e})`,
        opacity: e,
      }}
    >
      <div style={{ position: "absolute", left: 20, top: 16, fontFamily: HEAD, fontWeight: 700, fontSize: 52, color: INK }}>{warm ? "GARMI ✓" : "SARDI ✗"}</div>
      <div style={{ position: "absolute", right: 24, top: 18, transform: `rotate(${frame * (warm ? 1 : 0.5)}deg)` }}>
        {warm ? (
          <svg width="90" height="90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="22" fill="#FFD23F" stroke={INK} strokeWidth={5} />
            {new Array(8).fill(0).map((_, i) => (
              <line key={i} x1="50" y1="12" x2="50" y2="22" stroke={INK} strokeWidth={6} strokeLinecap="round" transform={`rotate(${i * 45} 50 50)`} />
            ))}
          </svg>
        ) : (
          <SnowIcon size={90} color="#FFFFFF" />
        )}
      </div>
      <div style={{ position: "absolute", left: 40, top: 170 }}>
        <Katori size={380} set={warm ? 1 : 0} wobble={warm ? Math.sin(frame / 6) : 0} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: INK }}>{warm ? "RAAT BHAR → DAHI" : "SUBAH TAK → DOODH"}</div>
    </div>
  );
};

export const Jaman: React.FC = () => {
  const cue = useCue();
  const lens = useEnter(cue(0.3));
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="ZOOM · FIG. 02" right="JAMAN" dark />
      <Headline setup="Dahi hum nahi banate…" punch="Bacteria banate hain!" dark punchColor={RED} punchSize={104} />
      <div style={{ position: "absolute", left: 60, top: 600, opacity: useEnter(cue(0.05)) }}>
        <JamanSpoon size={460} />
      </div>
      {/* magnifier */}
      <div style={{ position: "absolute", left: 470, top: 560, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, #FBF7EE 0%, #EDE4CF 100%)", border: `14px solid #5A5048`, overflow: "hidden", transform: `scale(${lens})`, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
        {new Array(14).fill(0).map((_, i) => (
          <Lacto key={i} x={20 + random(`j${i}`) * 380} y={30 + random(`jy${i}`) * 400} size={110} seed={i} />
        ))}
      </div>
      <svg width="300" height="120" style={{ position: "absolute", left: 300, top: 650, opacity: lens }}>
        <line x1="0" y1="80" x2="240" y2="20" stroke="#5A5048" strokeWidth={10} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1130, textAlign: "center", opacity: useEnter(cue(0.55)) }}>
        <CountUp from={0} to={1000000000} start={cue(0.55)} frames={30} format={(n) => `${Math.round(n).toLocaleString("en-IN")}+`} style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 110, color: C.cream }} />
      </div>
      <Tag text="1 CHAMMACH = ARBON BACTERIA" x={230} y={1290} at={cue(0.7)} />
      <Sfx at={cue(0.3)} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={cue(0.55)} src="onion/sparkle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Acid: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const start = cue(0.15);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="INSIDE · FIG. 03" right="FERMENTATION" dark={false} />
      <Headline setup="Lactose khate hain…" punch="Lactic acid banate hain" dark={false} punchColor={RED} punchSize={100} />
      <Lacto x={540 - 210} y={800} size={420} />
      {/* sugar cubes flowing in from the left */}
      {new Array(6).fill(0).map((_, i) => {
        const t = ((frame - start + i * 12) % 72) / 72;
        if (frame < start) return null;
        return <div key={`s${i}`} style={{ position: "absolute", left: 60 + t * 330, top: 860 + Math.sin(i) * 40, width: 46, height: 46, background: "#FFFFFF", border: `4px solid ${INK}`, borderRadius: 6, opacity: 1 - t * t, transform: `rotate(${i * 20 + t * 90}deg)` }} />;
      })}
      {/* acid drops flowing out to the right */}
      {new Array(6).fill(0).map((_, i) => {
        const t = ((frame - start - 20 + i * 12) % 72) / 72;
        if (frame < start + 20) return null;
        return (
          <svg key={`a${i}`} width="44" height="56" viewBox="0 0 40 56" style={{ position: "absolute", left: 700 + t * 300, top: 860 + Math.cos(i) * 40, opacity: Math.sin(Math.PI * t) }}>
            <path d="M20 2 C 30 20, 38 30, 38 38 A 18 18 0 0 1 2 38 C 2 30, 10 20, 20 2 Z" fill={WARM} stroke={INK} strokeWidth={3} />
          </svg>
        );
      })}
      <Tag text="LACTOSE = DOODH KI CHEENI" x={60} y={1260} at={cue(0.3)} rotate={-3} />
      <Tag text="LACTIC ACID = KHATTAPAN" x={500} y={1340} at={cue(0.6)} rotate={2} />
      <Sfx at={cue(0.3)} src="sfx/pop.wav" volume={0.4} />
      <Sfx at={cue(0.6)} src="sfx/pop.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Net: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const link = interpolate(frame, [cue(0.2), cue(0.65)], [0, 1], clamp);
  const pts = new Array(16).fill(0).map((_, i) => ({
    x: 70 + random(`n${i}`) * 420 + Math.sin(frame / 20 + i) * 10 * (1 - link),
    y: 70 + random(`ny${i}`) * 420 + Math.cos(frame / 24 + i) * 10 * (1 - link),
  }));
  const edges: [number, number][] = [];
  pts.forEach((a, i) =>
    pts.forEach((b, j) => {
      if (j > i && Math.hypot(a.x - b.x, a.y - b.y) < 170) edges.push([i, j]);
    })
  );
  const setT = interpolate(frame, [cue(0.6), cue(0.75)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="INSIDE · FIG. 04" right="CASEIN" dark={false} />
      <Headline setup="Acid badha toh…" punch="Casein ka jaal!" dark={false} punchColor={RED} />
      <div style={{ position: "absolute", left: 220, top: 570, width: 640, height: 560, borderRadius: 30, background: "#FBF7EE", border: `6px solid ${INK}`, boxShadow: "0 14px 26px rgba(0,0,0,0.25)", overflow: "hidden" }}>
        <svg width="640" height="560" viewBox="0 0 560 560">
          {edges.map(([i, j], k) => {
            const show = interpolate(link, [k / edges.length, Math.min(1, k / edges.length + 0.15)], [0, 1], clamp);
            return <line key={k} x1={pts[i].x} y1={pts[i].y} x2={pts[i].x + (pts[j].x - pts[i].x) * show} y2={pts[i].y + (pts[j].y - pts[i].y) * show} stroke="#C9A86A" strokeWidth={6} strokeLinecap="round" />;
          })}
          {pts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={22} fill="#F1DFAE" stroke={INK} strokeWidth={4} />
          ))}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 540 - 170, top: 1170 }}>
        <Katori size={340} set={setT} wobble={setT > 0.5 ? Math.sin(frame / 5) * 1.5 : 0} />
      </div>
      <Tag text="DOODH → DAHI" x={420} y={1440} at={cue(0.7)} />
      <Sfx at={cue(0.65)} src="onion/sparkle.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Cold: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const temp = interpolate(frame, [cue(0.15), cue(0.35), cue(0.5), cue(0.7)], [20, 40, 40, 8], clamp);
  const sleepy = interpolate(frame, [cue(0.55), cue(0.7)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="TEMPERATURE · FIG. 05" right="30–45°C" dark />
      <Headline setup="30–45°C = best" punch="Thand = sust bacteria" dark punchColor={RED} punchSize={104} />
      <div style={{ position: "absolute", left: 90, top: 600 }}>
        <Thermometer height={600} temp={temp} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 1220, width: 160, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: temp < 25 ? "#9CC3DA" : "#9BD27A" }}>{Math.round(temp)}°C</div>
      {[0, 1, 2].map((i) => (
        <Lacto key={i} x={340 + (i % 2) * 300} y={620 + i * 200} size={300} active={1 - sleepy} sleepy={sleepy} seed={i * 3} />
      ))}
      <Tag text={sleepy > 0.5 ? "RAZAI MEIN DUBKE BACTERIA" : "GARMAHAT = FAST KAAM"} x={330} y={1330} at={cue(0.2)} />
      {frame > cue(0.55) && <SnowFall />}
      <Sfx at={cue(0.55)} src="sfx/whoosh.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

const SnowFall: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {new Array(30).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: random(`sf${i}`) * 1080,
            top: ((frame * (2 + random(`sv${i}`) * 3) + random(`sy${i}`) * 1920) % 1920),
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#E8EEF5",
            opacity: 0.7,
          }}
        />
      ))}
    </>
  );
};

export const Hot: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const temp = interpolate(frame, [cue(0.05), cue(0.3)], [40, 75], clamp);
  const damage = interpolate(frame, [cue(0.3), cue(0.5)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="TEMPERATURE · FIG. 06" right="TOO HOT" dark={false} />
      <Headline setup="Bahut garam doodh?" punch="Bacteria khatam!" dark={false} punchColor={RED} />
      <div style={{ position: "absolute", left: 90, top: 600 }}>
        <Thermometer height={560} temp={temp} />
      </div>
      <div style={{ position: "absolute", left: 90, top: 1180, width: 160, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: RED }}>{Math.round(temp)}°C</div>
      {[0, 1].map((i) => (
        <Lacto key={i} x={380} y={640 + i * 260} size={420} active={1 - damage} damage={damage} seed={i} />
      ))}
      <Stamp text="Gunguna ✓" x={640} y={1270} at={cue(0.65)} color="#2F8F3A" rotate={-6} size={88} />
      <Sfx at={cue(0.3)} src="onion/thud.wav" volume={0.5} />
      <Sfx at={cue(0.65)} src="onion/thud.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Twist: React.FC = () => {
  const cue = useCue();
  const slam = useEnter(0, { damping: 9, stiffness: 220 });
  const pause = useEnter(cue(0.45), { damping: 10, stiffness: 200 });
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
      <div style={{ position: "absolute", left: 70, right: 70, top: 600, fontFamily: HEAD, fontWeight: 700, fontSize: 70, color: "white", opacity: useEnter(cue(0.15)), textTransform: "uppercase" }}>
        Fridge = pause button
      </div>
      <div style={{ position: "absolute", left: 120, top: 760, opacity: useEnter(cue(0.2)) }}>
        <Fridge size={330} />
      </div>
      <div style={{ position: "absolute", left: 560, top: 860 }}>
        <Lacto x={0} y={0} size={340} active={1 - pause} />
        <div style={{ position: "absolute", left: 110, top: 200, width: 130, height: 130, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, transform: `scale(${pause})` }}>
          <div style={{ width: 20, height: 60, background: RED }} />
          <div style={{ width: 20, height: 60, background: RED }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1330, padding: "18px 26px", background: "rgba(0,0,0,0.25)", fontFamily: MONO, fontSize: 26, letterSpacing: 2, color: "white", opacity: useEnter(cue(0.6)) }}>
        ISLIYE FRIDGE MEIN DAHI JALDI KHARAB NAHI HOTA
      </div>
      <Sfx at={0} src="onion/thud.wav" volume={0.6} />
      <Sfx at={cue(0.45)} src="sfx/pop.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Khandaan: React.FC = () => {
  const cue = useCue();
  const gens = [
    { who: Dadi, label: "DADI", year: "1995", at: 0.18 },
    { who: Mummy, label: "MUMMY", year: "2010", at: 0.4 },
    { who: Riya, label: "AAP", year: "2026", at: 0.62 },
  ];
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="HERITAGE · FIG. 07" right="BACK-SLOPPING" dark={false} />
      <Headline setup="Ghar ka jaman…" punch="Bacteria ka khandaan!" dark={false} punchColor={RED} />
      {gens.map((g, i) => (
        <Gen key={g.label} x={50 + i * 340} at={cue(g.at)} Who={g.who} label={g.label} year={g.year} last={i === gens.length - 1} />
      ))}
      <Tag text="SAALON SE EK HI BACTERIA PARIVAAR" x={170} y={1360} at={cue(0.8)} />
      {gens.map((g) => (
        <Sfx key={g.label} at={cue(g.at)} src="sfx/pop.wav" volume={0.4} />
      ))}
    </AbsoluteFill>
  );
};

const Gen: React.FC<{ x: number; at: number; Who: React.FC<Partial<PersonProps> & { size: number }>; label: string; year: string; last: boolean }> = ({ x, at, Who, label, year, last }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: x, top: 600, width: 300, opacity: e, transform: `translateY(${(1 - e) * 40}px)` }}>
      <Who size={260} expression="smile" />
      <div style={{ marginTop: -10, marginLeft: 20 }}>
        <Katori size={240} set={1} />
      </div>
      <div style={{ textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 48, color: INK, marginTop: 6 }}>{label}</div>
      <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#6B5A45" }}>{year}</div>
      {!last && <div style={{ position: "absolute", left: 270, top: 430, fontFamily: HEAD, fontWeight: 700, fontSize: 72, color: RED }}>→</div>}
    </div>
  );
};

const TIPS = [
  { title: "Doodh gunguna", sub: "UNGLI 10 SECOND TIK SAKE", at: 0.2, art: "thermo" },
  { title: "1 chammach jaman", sub: "ACHHE SE MILA DEIN", at: 0.38, art: "spoon" },
  { title: "Casserole ya kapda", sub: "GARMAHAT ANDAR BAND", at: 0.56, art: "casserole" },
  { title: "Oven ki light on", sub: "SIRF LIGHT, OVEN NAHI!", at: 0.76, art: "oven" },
] as const;

export const Tips: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="YOUR MOVE · FIG. 08" right="WINTER JUGAAD" dark={false} />
      <Headline setup="Sardi mein kaise?" punch="4 jugaad" dark={false} punchColor={RED} />
      {TIPS.map((t, i) => (
        <TipRow key={t.title} y={590 + i * 205} at={cue(t.at)} title={t.title} sub={t.sub} art={t.art} />
      ))}
      {TIPS.map((t) => (
        <Sfx key={t.title} at={cue(t.at)} src="sfx/pop.wav" volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};

const TipRow: React.FC<{ y: number; at: number; title: string; sub: string; art: string }> = ({ y, at, title, sub, art }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y, height: 180, display: "flex", alignItems: "center", gap: 28, padding: "0 28px", background: "#F1E7D2", boxShadow: "0 10px 22px rgba(0,0,0,0.2)", transform: `translateX(${(1 - e) * 140}px) rotate(${y % 2 ? -1 : 1}deg)`, opacity: e }}>
      <div style={{ width: 150, display: "flex", justifyContent: "center", flexShrink: 0 }}>
        {art === "thermo" && <Thermometer height={150} temp={40} />}
        {art === "spoon" && <JamanSpoon size={150} />}
        {art === "casserole" && <Casserole size={140} />}
        {art === "oven" && <Oven size={150} />}
      </div>
      <div>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 58, color: INK, textTransform: "uppercase", lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: RED, marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};

export const Cta: React.FC = () => {
  const cue = useCue();
  const float = useFloat(6);
  const phone = useEnter(cue(0.3));
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="YOUR TURN · FIG. 09" right="COMMENT" dark />
      <Headline setup="Aapka jugaad kya hai?" punch="Mummy ko bhejo!" dark punchColor={RED} />
      <div style={{ position: "absolute", left: 60, top: 640 + float, opacity: useEnter(cue(0.05)) }}>
        <Mummy size={380} expression="grin" phone />
      </div>
      <div style={{ position: "absolute", left: 470, top: 620, width: 540, height: 560, borderRadius: 48, background: "#121212", border: "8px solid #2C2C2C", opacity: phone, transform: `translateY(${(1 - phone) * 80}px)` }}>
        <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #2A2A2A" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#8E2A3C" }} />
          <span style={{ fontFamily: MONO, fontSize: 26, color: "#ddd" }}>Mummy</span>
        </div>
        <div style={{ margin: "28px 24px 0", padding: "16px 20px", borderRadius: 20, background: "#2A2A2A", fontFamily: MONO, fontSize: 24, color: "#eee", opacity: useEnter(cue(0.4)), maxWidth: 400 }}>
          beta, dahi phir nahi jama!
        </div>
        <div style={{ margin: "18px 24px 0 auto", padding: "16px 20px", borderRadius: 20, background: RED, fontFamily: MONO, fontSize: 24, color: "white", opacity: useEnter(cue(0.58)), maxWidth: 400, width: "fit-content" }}>
          Mummy, oven ki light on karo!
        </div>
        <div style={{ margin: "18px 24px 0", padding: "16px 20px", borderRadius: 20, background: "#2A2A2A", fontFamily: DEVA, fontSize: 30, color: "#eee", opacity: useEnter(cue(0.75)), maxWidth: 400, width: "fit-content" }}>
          अरे वाह, जम गया!
        </div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 1290, transform: `translateX(-50%) scale(${useEnter(cue(0.66), { damping: 10, stiffness: 180 })})`, background: RED, color: "white", borderRadius: 999, padding: "14px 44px", fontFamily: HEAD, fontWeight: 700, fontSize: 52, letterSpacing: 2, whiteSpace: "nowrap" }}>
        COMMENT KARO ↓
      </div>
      <Sfx at={cue(0.4)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.58)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.75)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  jaman: Jaman,
  acid: Acid,
  net: Net,
  cold: Cold,
  hot: Hot,
  twist: Twist,
  khandaan: Khandaan,
  tips: Tips,
  cta: Cta,
};
