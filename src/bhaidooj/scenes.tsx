import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { clamp, Header, Headline, Stamp, useCue, useEnter, useFloat } from "../onion/components";
import { C, DEVA, HEAD, MONO } from "../onion/theme";
import { RED } from "../mitti/art";
import { Grain, INK, KraftBg, Sfx, SpeechBubble, Tag, WarmDark } from "../mitti/kraft";
import { Aman, Krishna, Riya, Subhadra, Yamraj, Yamuna } from "../mitti/people";
import { Bhojan, Diya, GiftBox, GOLD, Garland, Laddoo, River, SAPTARANGI, Scroll, Thali, ThornDoor } from "./art";

const LAB = "TYOHAR LAB";

/** Thali circling in front of someone, like an aarti. */
const AartiThali: React.FC<{ cx: number; cy: number; r: number; size: number; at: number }> = ({ cx, cy, r, size, at }) => {
  const frame = useCurrentFrame();
  const e = useEnter(at);
  const a = Math.max(0, frame - at) / 14;
  const x = cx + Math.cos(a) * r - size / 2;
  const y = cy + Math.sin(a) * r * 0.55 - size * 0.31;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: e, transform: `scale(${0.6 + 0.4 * e})` }}>
      <Thali size={size} />
    </div>
  );
};

/** Little rising sparkles around a point. */
const Sparkles: React.FC<{ x: number; y: number; w: number; start: number; color?: string }> = ({ x, y, w, start, color = GOLD }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <>
      {new Array(14).fill(0).map((_, i) => {
        const t = ((frame - start + i * 7) % 50) / 50;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + random(`sp${i}`) * w,
              top: y - t * 220,
              width: 14,
              height: 14,
              background: color,
              transform: `rotate(45deg) scale(${Math.sin(Math.PI * t)})`,
              opacity: Math.sin(Math.PI * t),
            }}
          />
        );
      })}
    </>
  );
};

// ===========================================================================

export const Hook: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const tilak = interpolate(frame, [cue(0.12), cue(0.24)], [0, 1], clamp);
  const checks = [
    { t: "TIKA ✓", at: 0.12 },
    { t: "MITHAI ✓", at: 0.26 },
    { t: "GIFT ✓", at: 0.4 },
  ];
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="FESTIVAL · FIG. 01" right={LAB} dark={false} />
      <Headline setup="Bhai Dooj =" punch="Sirf tika?" dark={false} punchColor={RED} punchSize={130} />
      <div style={{ position: "absolute", left: 40, top: 640 }}>
        <Riya size={420} expression="smile" />
      </div>
      <div style={{ position: "absolute", left: 600, top: 640 }}>
        <Aman size={420} expression="grin" tilak={tilak} />
      </div>
      <div style={{ position: "absolute", left: 320, top: 1150 }}>
        <Thali size={440} />
      </div>
      {checks.map((c, i) => (
        <Tag key={c.t} text={c.t} x={80 + i * 330} y={1500} at={cue(c.at)} rotate={i % 2 ? 2 : -2} />
      ))}
      <SpeechBubble text="बस इतना?!" x={560} y={540} at={cue(0.62)} />
      {checks.map((c) => (
        <Sfx key={c.t} at={cue(c.at)} src="sfx/pop.wav" volume={0.45} />
      ))}
      <Sfx at={cue(0.62)} src="onion/thud.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

const DAYS = ["DHANTERAS", "CHHOTI DIWALI", "DIWALI", "GOVARDHAN", "BHAI DOOJ"];

export const Naam: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="CALENDAR · FIG. 02" right="KARTIK MAAS" dark />
      <Headline setup="Ek aur naam…" punch="Yam Dwitiya" dark punchColor={GOLD} punchSize={130} />
      {DAYS.map((d, i) => {
        const at = cue(0.42 + i * 0.07);
        const last = i === DAYS.length - 1;
        const lit = interpolate(frame, [at, at + 8], [0, 1], clamp);
        return (
          <div key={d} style={{ position: "absolute", left: 40 + i * 202, top: last ? 700 : 760, width: 200, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", transform: `scale(${last ? 1.25 : 1})` }}>
              <Diya size={170} lit={lit} seed={i} />
            </div>
            <div style={{ marginTop: 18, fontFamily: HEAD, fontWeight: 700, fontSize: 46, color: last ? GOLD : C.cream, opacity: 0.4 + 0.6 * lit }}>{`DIN ${i + 1}`}</div>
            <div style={{ fontFamily: MONO, fontSize: 19, letterSpacing: 1, color: last ? GOLD : "#B9AE9C", opacity: 0.4 + 0.6 * lit }}>{d}</div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 846,
          top: 668,
          width: 200,
          height: 420,
          borderRadius: 30,
          border: `6px solid ${GOLD}`,
          opacity: useEnter(cue(0.75)),
          boxShadow: `0 0 50px rgba(233,180,42,0.45)`,
        }}
      />
      <Tag text="KARTIK SHUKLA DWITIYA" x={120} y={1180} at={cue(0.2)} />
      <Tag text="DIWALI KE 2 DIN BAAD" x={300} y={1270} at={cue(0.48)} rotate={2} />
      <Stamp text="AAKHRI DIN" x={540} y={1460} at={cue(0.78)} color={GOLD} blend="normal" rotate={-6} size={84} />
      {DAYS.map((d, i) => (
        <Sfx key={d} at={cue(0.42 + i * 0.07)} src="onion/tick.wav" volume={0.4} />
      ))}
      <Sfx at={cue(0.78)} src="onion/thud.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Kahani: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const walk = interpolate(frame, [cue(0.05), cue(0.3)], [-420, 60], clamp);
  const bob = frame < cue(0.3) ? Math.abs(Math.sin(frame / 4)) * -14 : 0;
  const tilak = interpolate(frame, [cue(0.45), cue(0.55)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="LEGEND · FIG. 03" right="YAMA + YAMUNA" dark={false} />
      <Headline setup="Yamraj pahunche…" punch="Behen Yamuna ke ghar" dark={false} punchColor={RED} punchSize={96} />
      <div style={{ position: "absolute", left: 0, top: 1480 }}>
        <River width={1080} height={200} />
      </div>
      <div style={{ position: "absolute", left: walk, top: 700 + bob }}>
        <Yamraj size={430} expression={tilak > 0.5 ? "smile" : "neutral"} tilak={tilak} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 720, opacity: useEnter(cue(0.15)) }}>
        <Yamuna size={420} expression="grin" />
      </div>
      <AartiThali cx={270} cy={1180} r={110} size={300} at={cue(0.6)} />
      <div style={{ position: "absolute", left: 640, top: 1250, opacity: useEnter(cue(0.8)), transform: `scale(${useEnter(cue(0.8), { damping: 10, stiffness: 180 })})` }}>
        <Bhojan size={380} />
      </div>
      <Tag text="1. TIKA" x={70} y={600} at={cue(0.45)} />
      <Tag text="2. AARTI" x={400} y={600} at={cue(0.62)} rotate={2} />
      <Tag text="3. APNE HAATH KA KHANA" x={560} y={1190} at={cue(0.8)} />
      <Sfx at={cue(0.45)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.62)} src="onion/sparkle.wav" volume={0.35} />
      <Sfx at={cue(0.8)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const Vardaan: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [cue(0.05), cue(0.25)], [0, 1], clamp);
  const open = interpolate(frame, [cue(0.3), cue(0.5)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="LEGEND · FIG. 04" right="VARDAAN" dark />
      <Headline setup="Khush hokar Yamraj ne diya…" punch="Vardaan!" dark punchColor={GOLD} punchSize={140} />
      <div style={{ position: "absolute", left: 40, top: 640, width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, rgba(233,180,42,${0.55 * glow}) 0%, rgba(233,180,42,0) 70%)` }} />
      <div style={{ position: "absolute", left: 60, top: 640 }}>
        <Yamraj size={420} expression="smile" tilak={1} />
      </div>
      <Sparkles x={60} y={900} w={400} start={cue(0.05)} />
      <div style={{ position: "absolute", left: 500, top: 660 }}>
        <Scroll width={520} open={open}>
          <div style={{ fontFamily: DEVA, fontSize: 40, lineHeight: 1.45, color: INK }}>
            जो भाई इस दिन बहन से टीका करवाएगा…
          </div>
          <div style={{ marginTop: 18, fontFamily: HEAD, fontWeight: 700, fontSize: 52, lineHeight: 1.05, color: RED, textTransform: "uppercase" }}>
            Akaal mrityu ka dar nahi
          </div>
        </Scroll>
      </div>
      <Tag text="TIKA = LAMBI UMAR KI DUA" x={250} y={1300} at={cue(0.7)} />
      <Sfx at={cue(0.05)} src="onion/sparkle.wav" volume={0.4} />
      <Sfx at={cue(0.3)} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={cue(0.7)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const Twist: React.FC = () => {
  const cue = useCue();
  const slam = useEnter(0, { damping: 9, stiffness: 220 });
  const food = useEnter(cue(0.3), { damping: 10, stiffness: 170 });
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
      <div style={{ position: "absolute", left: 70, right: 70, top: 600, fontFamily: HEAD, fontWeight: 700, fontSize: 76, color: "white", opacity: useEnter(cue(0.15)), textTransform: "uppercase" }}>
        Asli hero = <span style={{ color: "#FFD23F" }}>khana</span>
      </div>
      <div style={{ position: "absolute", left: 90, top: 780, transform: `scale(${food}) rotate(${(1 - food) * -10}deg)` }}>
        <Bhojan size={900} />
      </div>
      <Stamp text="TIKA = 2nd" x={820} y={1250} at={cue(0.25)} color="white" blend="normal" rotate={10} size={58} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 1330, padding: "20px 28px", background: "rgba(0,0,0,0.28)", opacity: useEnter(cue(0.55)) }}>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: "white", textTransform: "uppercase" }}>Bhagini Hasta Bhojanam</div>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 2, color: "#FFE3D6", marginTop: 6 }}>DAKSHIN BHARAT · "BEHEN KE HAATH KA KHANA"</div>
      </div>
      <Sfx at={0} src="onion/thud.wav" volume={0.6} />
      <Sfx at={cue(0.3)} src="sfx/pop.wav" volume={0.5} />
      <Sfx at={cue(0.55)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const KrishnaScene: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const tilak = interpolate(frame, [cue(0.6), cue(0.7)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="LEGEND · FIG. 05" right="DWARKA" dark={false} />
      <Headline setup="Ek aur kahani…" punch="Krishna & Subhadra" dark={false} punchColor={RED} punchSize={104} />
      <div style={{ position: "absolute", left: 50, top: 680, opacity: useEnter(cue(0.05)), transform: `translateX(${(1 - useEnter(cue(0.05))) * -200}px)` }}>
        <Krishna size={430} expression="smile" tilak={tilak} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 700, opacity: useEnter(cue(0.4)) }}>
        <Subhadra size={420} expression="grin" />
      </div>
      <div style={{ position: "absolute", left: 320, top: 1260, opacity: useEnter(cue(0.55)) }}>
        <Thali size={420} />
      </div>
      {new Array(6).fill(0).map((_, i) => {
        const at = cue(0.7) + i * 4;
        const e = useEnter(at, { damping: 9, stiffness: 200 });
        return (
          <div key={i} style={{ position: "absolute", left: 70 + i * 160, top: 1540, transform: `scale(${e}) translateY(${(1 - e) * -120}px)` }}>
            <Laddoo size={110} />
          </div>
        );
      })}
      <Tag text="NARAKASUR KO HARAKE LAUTE" x={70} y={600} at={cue(0.15)} />
      <Tag text="TIKA + MITHAI SE SWAGAT" x={520} y={1200} at={cue(0.62)} rotate={2} />
      <Sfx at={cue(0.15)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.62)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.7)} src="onion/sparkle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

const REGIONS = [
  { name: "Bhau Beej", where: "MAHARASHTRA · GOA", at: 0.12, art: "diya" },
  { name: "Bhai Phonta", where: "BENGAL", at: 0.24, art: "phonta" },
  { name: "Bhai Tika", where: "NEPAL", at: 0.36, art: "sapta" },
] as const;

export const Naksha: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const dots = interpolate(frame, [cue(0.5), cue(0.68)], [0, 1], clamp);
  const garland = interpolate(frame, [cue(0.72), cue(0.92)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="ACROSS INDIA · FIG. 06" right="EK TYOHAR, KAI NAAM" dark />
      <Headline setup="Naam alag-alag…" punch="Pyaar wahi!" dark punchColor={GOLD} punchSize={130} />
      {REGIONS.map((r, i) => (
        <RegionRow key={r.name} y={590 + i * 230} at={cue(r.at)} name={r.name} where={r.where} art={r.art} dots={dots} />
      ))}
      {/* Nepal close-up: seven-colour tika + makhamali garland */}
      <div style={{ position: "absolute", left: 120, top: 1290, opacity: useEnter(cue(0.5)) }}>
        <div style={{ position: "relative" }}>
          <Riya size={300} hair="long" expression="smile" bindi={false} />
          <div style={{ position: "absolute", left: 112, top: 104, display: "flex", flexDirection: "column", gap: 2 }}>
            {SAPTARANGI.map((c, k) => (
              <div key={c} style={{ width: 16, height: 9, borderRadius: 4, background: c, opacity: dots * 7 > k ? 1 : 0 }} />
            ))}
          </div>
          <div style={{ position: "absolute", left: 20, top: 270 }}>
            <Garland width={260} grow={garland} />
          </div>
        </div>
      </div>
      <Tag text="7 RANG KA TIKA" x={480} y={1360} at={cue(0.55)} />
      <Tag text="MAKHAMALI MAALA: MURJHAATI NAHI" x={400} y={1450} at={cue(0.78)} rotate={2} />
      {REGIONS.map((r) => (
        <Sfx key={r.name} at={cue(r.at)} src="sfx/pop.wav" volume={0.45} />
      ))}
      <Sfx at={cue(0.55)} src="onion/sparkle.wav" volume={0.35} />
      <Sfx at={cue(0.78)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

const RegionRow: React.FC<{ y: number; at: number; name: string; where: string; art: string; dots: number }> = ({ y, at, name, where, art, dots }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y, height: 200, display: "flex", alignItems: "center", gap: 30, padding: "0 30px", background: "#F1E7D2", boxShadow: "0 10px 22px rgba(0,0,0,0.3)", transform: `translateX(${(1 - e) * 160}px) rotate(${y % 3 ? -1 : 1}deg)`, opacity: e }}>
      <div style={{ width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {art === "diya" && <Diya size={150} />}
        {art === "phonta" && (
          <svg viewBox="0 0 100 100" width={130} height={130}>
            <circle cx="50" cy="50" r="44" fill="#F3E3C0" stroke={INK} strokeWidth={5} />
            <circle cx="50" cy="50" r="16" fill="#FBF7EE" stroke={INK} strokeWidth={4} />
            <circle cx="50" cy="50" r="7" fill={RED} />
          </svg>
        )}
        {art === "sapta" && (
          <div style={{ display: "flex", flexWrap: "wrap", width: 130, gap: 8, justifyContent: "center" }}>
            {SAPTARANGI.map((c, k) => (
              <div key={c} style={{ width: 34, height: 34, borderRadius: "50%", background: c, border: `4px solid ${INK}`, transform: `scale(${Math.min(1, Math.max(0, dots * 7 - k))})` }} />
            ))}
          </div>
        )}
      </div>
      <div>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 76, color: INK, textTransform: "uppercase", lineHeight: 1 }}>{name}</div>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: RED, marginTop: 8 }}>{where}</div>
      </div>
    </div>
  );
};

export const Kaanta: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const tilak = interpolate(frame, [cue(0.1), cue(0.25)], [0, 1], clamp);
  const thorns = interpolate(frame, [cue(0.4), cue(0.6)], [0, 1], clamp);
  const shake = frame > cue(0.4) && frame < cue(0.6) ? Math.sin(frame * 2) * 4 : 0;
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="BENGAL · FIG. 07" right="BHAI PHONTA" dark={false} />
      <Headline setup="Maathe pe phonta…" punch="Yam ke dwaar pe kaanta!" dark={false} punchColor={RED} punchSize={92} />
      <div style={{ position: "absolute", left: 30, top: 720 }}>
        <Riya size={330} expression="grin" />
      </div>
      <div style={{ position: "absolute", left: 300, top: 760 }}>
        <Aman size={330} expression="smile" tilak={tilak} />
      </div>
      <div style={{ position: "absolute", left: 680, top: 700, transform: `translateX(${shake}px)` }}>
        <ThornDoor size={340} thorns={thorns} />
        <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: INK, marginTop: 8 }}>YAM KA DWAAR</div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 1310, padding: "22px 28px", background: "#FBF7EE", border: `5px solid ${INK}`, boxShadow: "0 10px 20px rgba(0,0,0,0.2)", opacity: useEnter(cue(0.15)) }}>
        <div style={{ fontFamily: DEVA, fontSize: 48, color: INK, lineHeight: 1.4 }}>
          “भाई के माथे पर फोंटा,
          <br />
          <span style={{ color: RED }}>यम के दरवाज़े पर काँटा!”</span>
        </div>
      </div>
      <Tag text="MATLAB: BHAI KI LAMBI UMAR" x={200} y={1560} at={cue(0.75)} />
      <Sfx at={cue(0.1)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.4)} src="onion/slice.wav" volume={0.45} />
      <Sfx at={cue(0.75)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

const STEPS = [
  { title: "Tika + aarti", sub: "YE TOH BAS SHURUAAT HAI", at: 0.08, art: "thali" },
  { title: "Behen ke ghar jao", sub: "YAMRAJ BHI KHUD GAYE THE", at: 0.3, art: "walk" },
  { title: "Saath baith ke khao", sub: "BEHEN KE HAATH KA KHANA", at: 0.52, art: "food" },
  { title: "Gift toh banta hai!", sub: "NO EXCUSES, BHAI", at: 0.78, art: "gift" },
] as const;

export const Package: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="YOUR MOVE · FIG. 08" right="FULL PACKAGE" dark={false} />
      <Headline setup="Is baar sirf tika nahi…" punch="Poora package" dark={false} punchColor={RED} />
      {STEPS.map((s, i) => (
        <StepRow key={s.title} y={590 + i * 215} at={cue(s.at)} title={s.title} sub={s.sub} art={s.art} />
      ))}
      {STEPS.map((s) => (
        <Sfx key={s.title} at={cue(s.at)} src="sfx/pop.wav" volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};

const StepRow: React.FC<{ y: number; at: number; title: string; sub: string; art: string }> = ({ y, at, title, sub, art }) => {
  const e = useEnter(at);
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y, height: 190, display: "flex", alignItems: "center", gap: 28, padding: "0 28px", background: "#F1E7D2", boxShadow: "0 10px 22px rgba(0,0,0,0.2)", transform: `translateX(${(1 - e) * 140}px) rotate(${y % 2 ? -1 : 1}deg)`, opacity: e }}>
      <div style={{ width: 170, height: 170, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "visible" }}>
        {art === "thali" && <Thali size={170} />}
        {art === "walk" && (
          <div style={{ transform: `translateY(${Math.abs(Math.sin(frame / 5)) * -6}px)`, marginTop: 40 }}>
            <Aman size={120} expression="grin" tilak={1} />
          </div>
        )}
        {art === "food" && <Bhojan size={170} steam={false} />}
        {art === "gift" && <GiftBox size={130} open={Math.max(0, Math.sin(frame / 10)) * 0.4} />}
      </div>
      <div>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: INK, textTransform: "uppercase", lineHeight: 1.05 }}>{title}</div>
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
      <Headline setup="Aapke ghar kya banta hai?" punch="Bhai-behen ko bhejo!" dark punchColor={GOLD} punchSize={104} />
      <div style={{ position: "absolute", left: 50, top: 650 + float, opacity: useEnter(cue(0.05)) }}>
        <Riya size={380} expression="grin" phone />
      </div>
      <div style={{ position: "absolute", left: 470, top: 620, width: 540, height: 580, borderRadius: 48, background: "#121212", border: "8px solid #2C2C2C", opacity: phone, transform: `translateY(${(1 - phone) * 80}px)` }}>
        <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #2A2A2A" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#3E6E8E" }} />
          <span style={{ fontFamily: MONO, fontSize: 26, color: "#ddd" }}>Bhai</span>
        </div>
        <div style={{ margin: "28px 24px 0 auto", padding: "16px 20px", borderRadius: 20, background: RED, fontFamily: MONO, fontSize: 24, color: "white", opacity: useEnter(cue(0.4)), maxWidth: 400, width: "fit-content" }}>
          aaj ghar aa raha hai na?
        </div>
        <div style={{ margin: "18px 24px 0", padding: "16px 20px", borderRadius: 20, background: "#2A2A2A", fontFamily: MONO, fontSize: 24, color: "#eee", opacity: useEnter(cue(0.55)), maxWidth: 400, width: "fit-content" }}>
          haan! kheer ready rakhna
        </div>
        <div style={{ margin: "18px 24px 0 auto", padding: "16px 20px", borderRadius: 20, background: RED, fontFamily: DEVA, fontSize: 30, color: "white", opacity: useEnter(cue(0.7)), maxWidth: 400, width: "fit-content" }}>
          और gift भूलना मत!
        </div>
      </div>
      <div style={{ position: "absolute", left: 540, top: 1310, transform: `translateX(-50%) scale(${useEnter(cue(0.62), { damping: 10, stiffness: 180 })})`, background: RED, color: "white", borderRadius: 999, padding: "14px 44px", fontFamily: HEAD, fontWeight: 700, fontSize: 52, letterSpacing: 2, whiteSpace: "nowrap" }}>
        COMMENT KARO ↓
      </div>
      <Sfx at={cue(0.4)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.55)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.7)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  naam: Naam,
  kahani: Kahani,
  vardaan: Vardaan,
  twist: Twist,
  krishna: KrishnaScene,
  naksha: Naksha,
  kaanta: Kaanta,
  package: Package,
  cta: Cta,
};
