import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp, Header, Headline, Stamp, useCue, useEnter, useFloat } from "../onion/components";
import { DEVA, HEAD, MONO } from "../onion/theme";
import { RED } from "../mitti/art";
import { Grain, INK, KraftBg, Sfx, Tag, WarmDark } from "../mitti/kraft";
import { Mummy } from "../mitti/people";
import { Banana, Coconut, Diya, GOLD, RiverSky, SAFFRON, Soop, Sugarcane, Sun, Thali, Thekua } from "./art";

const TITLE = "CHHATH PUJA";
const SILHOUETTE = "brightness(0.1) saturate(0)";

/** A vrati standing waist-deep in the river, soop raised, as a silhouette. */
const Vrati: React.FC<{ x: number; waterY: number; size: number; lift?: number; seed?: number }> = ({ x, waterY, size, lift = 1, seed = 0 }) => {
  const frame = useCurrentFrame();
  const h = (size * 560) / 400;
  const cut = h * 0.9;
  const bob = Math.sin(frame / 18 + seed) * 4;
  return (
    <>
      <div style={{ position: "absolute", left: x, top: waterY - cut + bob, width: size, height: cut, overflow: "hidden", filter: SILHOUETTE }}>
        <Mummy size={size} seed={seed} />
      </div>
      {(() => {
        // soop held overhead, with arms from the shoulders up to its rim
        const top = waterY - cut + bob;
        const soopW = size * 0.66;
        const soopH = soopW * 0.62;
        const soopTop = top + h * 0.04 - soopH - lift * h * 0.07;
        const soopL = x + (size - soopW) / 2;
        const sy = top + h * 0.62;
        return (
          <>
            <svg width={size} height={sy - soopTop} style={{ position: "absolute", left: x, top: soopTop, overflow: "visible" }}>
              <path d={`M${size * 0.3} ${sy - soopTop} L ${size * 0.2} ${soopH * 0.55}`} stroke="#111" strokeWidth={size * 0.07} strokeLinecap="round" />
              <path d={`M${size * 0.7} ${sy - soopTop} L ${size * 0.8} ${soopH * 0.55}`} stroke="#111" strokeWidth={size * 0.07} strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", left: soopL, top: soopTop, filter: "brightness(0.7) saturate(1.1)", transform: `rotate(${seed % 2 ? 5 : -5}deg)` }}>
              <Soop width={soopW}>
                <Coconut size={soopW * 0.26} style={{ position: "absolute", left: soopW * 0.37, top: -soopW * 0.14 }} />
                <Banana size={soopW * 0.36} style={{ position: "absolute", left: soopW * 0.06, top: -soopW * 0.02, transform: "rotate(-14deg)" }} />
                <Banana size={soopW * 0.34} style={{ position: "absolute", left: soopW * 0.6, top: -soopW * 0.01, transform: "rotate(12deg) scaleX(-1)" }} />
              </Soop>
            </div>
          </>
        );
      })()}
      {/* ripple ring at the waist */}
      <div style={{ position: "absolute", left: x + size * 0.05, top: waterY - 6, width: size * 0.9, height: 22, borderRadius: "50%", border: "3px solid rgba(255,220,170,0.45)", transform: `scaleX(${1 + Math.sin(frame / 10 + seed) * 0.05})` }} />
    </>
  );
};

const FloatingDiyas: React.FC<{ y: number; count?: number; at: number }> = ({ y, count = 5, at }) => {
  const frame = useCurrentFrame();
  const e = useEnter(at);
  return (
    <>
      {new Array(count).fill(0).map((_, i) => (
        <Diya
          key={i}
          size={70}
          seed={i}
          style={{ position: "absolute", left: 80 + i * (900 / count) + ((frame * 0.6 + i * 40) % 60), top: y + (i % 2) * 70 + Math.sin(frame / 12 + i) * 6, opacity: e }}
        />
      ))}
    </>
  );
};

// ===========================================================================

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const sunY = interpolate(frame, [0, cue(1)], [860, 1110], clamp);
  return (
    <AbsoluteFill>
      <RiverSky sunY={sunY} mood="dusk" />
      <Header left="SUNSET · FIG. 01" right={TITLE} dark />
      <Headline setup="Duniya ugte suraj ko poojti hai…" punch="Yahan doobte ko bhi!" dark punchColor={GOLD} punchSize={104} />
      <Vrati x={90} waterY={1250} size={300} lift={useEnter(cue(0.3))} seed={1} />
      <Vrati x={690} waterY={1290} size={320} lift={useEnter(cue(0.4))} seed={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1480, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 120, color: GOLD, textShadow: "0 6px 0 rgba(0,0,0,0.35)", opacity: useEnter(cue(0.82)), transform: `scale(${0.8 + 0.2 * useEnter(cue(0.82))})` }}>?</div>
      <Sfx at={cue(0.3)} src="onion/sparkle.wav" volume={0.3} />
    </AbsoluteFill>
  );
};

const REGIONS = ["BIHAR", "JHARKHAND", "PURVI UP", "NEPAL"];

export const Meaning: React.FC = () => {
  const cue = useCue();
  const sun = useEnter(cue(0.02));
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="FESTIVAL · FIG. 02" right={TITLE} dark={false} />
      <Headline setup="Kaun sa parv?" punch="Chhath!" dark={false} punchColor={RED} punchSize={150} />
      <div style={{ position: "absolute", left: 540 - 170, top: 620, transform: `scale(${sun})` }}>
        <Sun size={340} rays />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1060, padding: "20px 0", background: "#F1E7D2", boxShadow: "0 10px 22px rgba(0,0,0,0.2)", textAlign: "center", transform: `rotate(-1deg) scale(${useEnter(cue(0.12))})` }}>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 72, color: INK }}>SURYA DEV + CHHATHI MAIYA</div>
      </div>
      {REGIONS.map((r, i) => (
        <Tag key={r} text={r} x={70 + i * 240} y={1250 + (i % 2) * 24} at={cue(0.35 + i * 0.08)} rotate={i % 2 ? 2 : -2} />
      ))}
      <Stamp text="+ DUNIYA BHAR" x={540} y={1420} at={cue(0.78)} color={RED} rotate={-5} size={84} />
      {REGIONS.map((r, i) => (
        <Sfx key={r} at={cue(0.35 + i * 0.08)} src="sfx/pop.wav" volume={0.35} />
      ))}
      <Sfx at={cue(0.78)} src="onion/thud.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

const DAYS = [
  { n: "DIN 1", name: "Nahay-Khay", sub: "SNAAN + KADDU-BHAAT", art: "kaddu", at: 0.12 },
  { n: "DIN 2", name: "Kharna", sub: "GUD KI KHEER + ROTI", art: "kheer", at: 0.55 },
  { n: "DIN 3", name: "Sandhya Arghya", sub: "DOOBTA SURAJ", art: "dusk", at: 0.06 },
  { n: "DIN 4", name: "Usha Arghya", sub: "UGTA SURAJ", art: "dawn", at: 0.08 },
] as const;

export const Days: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="CALENDAR · FIG. 03" right="4 DIN" dark={false} />
      <Headline setup="4 din ka parv…" punch="Nahay-Khay → Kharna" dark={false} punchColor={RED} punchSize={100} />
      {DAYS.map((d, i) => {
        const e = useEnter(cue(i < 2 ? 0.02 + i * 0.05 : 0.12 + i * 0.04));
        const active = i < 2 && frame >= cue(d.at);
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div
            key={d.n}
            style={{
              position: "absolute",
              left: 60 + col * 490,
              top: 590 + row * 450,
              width: 470,
              height: 420,
              background: "#F1E7D2",
              border: `6px solid ${active ? RED : "transparent"}`,
              boxShadow: "0 10px 22px rgba(0,0,0,0.2)",
              opacity: e * (i < 2 ? 1 : 0.55),
              transform: `translateY(${(1 - e) * 40}px) rotate(${i % 2 ? 1 : -1}deg) scale(${active ? 1.03 : 1})`,
              boxSizing: "border-box",
            }}
          >
            <div style={{ position: "absolute", left: 24, top: 18, fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: RED }}>{d.n}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center" }}>
              {d.art === "kaddu" && <Thali size={300} kind="kaddu" />}
              {d.art === "kheer" && <Thali size={300} kind="kheer" />}
              {(d.art === "dusk" || d.art === "dawn") && (
                <div style={{ position: "relative", width: 300, height: 190, overflow: "hidden", borderRadius: 16, background: d.art === "dusk" ? "linear-gradient(#7A2E52, #F7A03C)" : "linear-gradient(#5E6FA3, #FFD08A)" }}>
                  <Sun size={110} color={d.art === "dusk" ? "#FF8A3D" : "#FFC24A"} style={{ left: 95, top: 90 }} />
                  <div style={{ position: "absolute", left: 0, right: 0, top: 140, bottom: 0, background: "#3B2A4E" }} />
                </div>
              )}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 285, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 54, color: INK, textTransform: "uppercase" }}>{d.name}</div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 355, textAlign: "center", fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: "#6B5A45" }}>{d.sub}</div>
          </div>
        );
      })}
      <Sfx at={cue(0.12)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.55)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const Fast: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const start = cue(0.15);
  const secs = Math.max(0, 36 * 3600 - Math.max(0, frame - start) * 260);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(Math.floor(secs % 60)).padStart(2, "0");
  const glass = useEnter(cue(0.45));
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="VRAT · FIG. 04" right="NIRJALA" dark />
      <Headline setup="Kharna ke baad…" punch="36 ghante nirjala!" dark punchColor={GOLD} punchSize={110} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 620, padding: "34px 0", background: "rgba(255,255,255,0.05)", border: "4px solid rgba(243,235,221,0.2)", textAlign: "center", opacity: useEnter(cue(0.05)) }}>
        <div style={{ fontFamily: MONO, fontSize: 150, color: "#F3EBDD", letterSpacing: 4 }}>
          {hh}:{mm}:{ss}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: "rgba(243,235,221,0.6)", marginTop: 6 }}>GHANTE · MINUTE · SECOND</div>
      </div>
      {/* a glass of water, crossed out */}
      <div style={{ position: "absolute", left: 540 - 130, top: 960, width: 260, opacity: glass, transform: `scale(${0.8 + 0.2 * glass})` }}>
        <svg viewBox="0 0 200 260" width={260} height={338}>
          <path d="M30 20 L 170 20 L 152 240 L 48 240 Z" fill="rgba(156,195,218,0.25)" stroke="#E8EEF5" strokeWidth={8} strokeLinejoin="round" />
          <path d="M40 100 L 160 100 L 152 240 L 48 240 Z" fill="#6FB7D9" opacity={0.7} />
        </svg>
      </div>
      <Stamp text="NA PAANI" x={540} y={1110} at={cue(0.55)} color={RED} rotate={-10} size={110} blend="normal" />
      <Tag text="NA KHAANA, NA PAANI KI EK BOOND" x={150} y={1380} at={cue(0.7)} />
      <Sfx at={cue(0.55)} src="onion/thud.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

const ITEMS = [
  { label: "THEKUA", at: 0.12 },
  { label: "GANNA", at: 0.22 },
  { label: "KELA", at: 0.3 },
  { label: "NARIYAL", at: 0.38 },
  { label: "MITTI KE DIYE", at: 0.55 },
];

export const SoopScene: React.FC = () => {
  const cue = useCue();
  const pop = (i: number) => useEnter(cue(ITEMS[i].at), { damping: 10, stiffness: 200 });
  const t = pop(0);
  const g = pop(1);
  const k = pop(2);
  const n = pop(3);
  const d = pop(4);
  const float = useFloat(5);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="PRASAD · FIG. 05" right="SOOP" dark={false} />
      <Headline setup="Baans ke soop mein…" punch="Thekua, ganna, phal!" dark={false} punchColor={RED} punchSize={104} />
      {/* sugarcane stalks behind the soop */}
      <Sugarcane height={600 * g} style={{ position: "absolute", left: 170, top: 1180 - 600 * g }} />
      <Sugarcane height={640 * g} style={{ position: "absolute", left: 800, top: 1180 - 640 * g }} />
      <div style={{ position: "absolute", left: 540 - 330, top: 760 + float }}>
        <Soop width={660}>
          <Coconut size={150} style={{ position: "absolute", left: 255, top: -70, transform: `scale(${n})` }} />
          <Banana size={200} style={{ position: "absolute", left: 60, top: 0, transform: `scale(${k}) rotate(-12deg)` }} />
          <Banana size={190} style={{ position: "absolute", left: 400, top: 6, transform: `scale(${k}) rotate(10deg) scaleX(-1)` }} />
          {[0, 1, 2, 3].map((i) => (
            <Thekua key={i} size={120} style={{ position: "absolute", left: 120 + i * 110, top: 110 + (i % 2) * 20, transform: `scale(${t}) rotate(${i * 15 - 20}deg)` }} />
          ))}
        </Soop>
      </div>
      {[0, 1, 2, 3, 4].map((i) => (
        <Diya key={i} size={110} seed={i} style={{ position: "absolute", left: 90 + i * 190, top: 1240, opacity: d, transform: `translateY(${(1 - d) * 40}px)` }} />
      ))}
      {ITEMS.map((it, i) => (
        <Tag key={it.label} text={it.label} x={[150, 120, 640, 640, 380][i]} y={[1100, 620, 640, 700, 1380][i]} at={cue(it.at)} rotate={i % 2 ? 3 : -3} />
      ))}
      <Stamp text="SAB PRAKRITI SE" x={540} y={1520} at={cue(0.75)} color="#2F8F3A" rotate={-4} size={80} />
      {ITEMS.map((it) => (
        <Sfx key={it.label} at={cue(it.at)} src="sfx/pop.wav" volume={0.4} />
      ))}
    </AbsoluteFill>
  );
};

export const Sandhya: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const sunY = interpolate(frame, [0, cue(1)], [920, 1180], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill>
      <RiverSky sunY={sunY} mood="dusk" sunSize={340} />
      <Header left="DIN 3 · FIG. 06" right="SANDHYA ARGHYA" dark />
      <Headline setup="Teesre din shaam…" punch="Doobte suraj ko arghya" dark punchColor={GOLD} punchSize={96} />
      <Vrati x={40} waterY={1290} size={280} lift={useEnter(cue(0.2))} seed={3} />
      <Vrati x={380} waterY={1330} size={320} lift={useEnter(cue(0.25))} seed={4} />
      <Vrati x={760} waterY={1270} size={270} lift={useEnter(cue(0.3))} seed={5} />
      <FloatingDiyas y={1420} at={cue(0.35)} />
      <Tag text="DIN BHAR KI ROSHNI KA SHUKRIYA" x={160} y={1620} at={cue(0.62)} />
      <Sfx at={cue(0.2)} src="onion/sparkle.wav" volume={0.3} />
    </AbsoluteFill>
  );
};

export const Usha: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const sunY = interpolate(frame, [0, cue(0.7)], [1250, 960], { ...clamp, easing: Easing.out(Easing.quad) });
  const line = useEnter(cue(0.6));
  return (
    <AbsoluteFill>
      <RiverSky sunY={sunY} mood="dawn" sunSize={320} />
      <Header left="DIN 4 · FIG. 07" right="USHA ARGHYA" dark />
      <Headline setup="Chauthe din bhor…" punch="Ugte suraj ko arghya" dark punchColor={GOLD} punchSize={100} />
      <Vrati x={130} waterY={1300} size={300} lift={useEnter(cue(0.15))} seed={6} />
      <Vrati x={660} waterY={1280} size={290} lift={useEnter(cue(0.2))} seed={7} />
      <Stamp text="VRAT POORA" x={540} y={680} at={cue(0.45)} color={SAFFRON} rotate={-6} size={90} blend="normal" />
      <div style={{ position: "absolute", left: 80, right: 80, top: 1480, padding: "22px 28px", background: "rgba(20,14,30,0.55)", fontFamily: HEAD, fontWeight: 700, fontSize: 54, lineHeight: 1.15, color: "white", textAlign: "center", opacity: line, transform: `translateY(${(1 - line) * 30}px)`, textTransform: "uppercase" }}>
        Jo doobe use bhi samman,
        <br />
        <span style={{ color: GOLD }}>jo uge use bhi.</span>
      </div>
      <Sfx at={cue(0.45)} src="onion/thud.wav" volume={0.45} />
      <Sfx at={cue(0.6)} src="sfx/chime.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

const NEEDS = [
  { t: "Aap", at: 0.45 },
  { t: "Paani", at: 0.58 },
  { t: "Suraj", at: 0.7 },
];

export const Twist: React.FC = () => {
  const cue = useCue();
  const slam = useEnter(0, { damping: 9, stiffness: 220 });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #F7A03C 0%, ${SAFFRON} 45%, #B5501C 100%)` }}>
        <Grain opacity={0.35} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 220, fontFamily: HEAD, fontWeight: 700, fontSize: 150, color: "white", lineHeight: 0.95, transform: `scale(${0.6 + 0.4 * slam})`, transformOrigin: "left top", textTransform: "uppercase" }}>
        Sabse
        <br />
        khaas?
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 560, fontFamily: HEAD, fontWeight: 700, fontSize: 84, color: INK, opacity: useEnter(cue(0.12)), textTransform: "uppercase" }}>
        Pandit zaroori nahi!
      </div>
      {NEEDS.map((n, i) => {
        const e = useEnter(cue(n.at), { damping: 10, stiffness: 200 });
        return (
          <div
            key={n.t}
            style={{ position: "absolute", left: 70, right: 70, top: 760 + i * 220, height: 190, display: "flex", alignItems: "center", gap: 30, padding: "0 34px", background: "#FFF4E2", boxShadow: "0 10px 22px rgba(0,0,0,0.25)", transform: `translateX(${(1 - e) * 160}px) rotate(${i % 2 ? 1 : -1}deg)`, opacity: e }}
          >
            <div style={{ width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {i === 0 && (
                <div style={{ width: 110, height: 140, overflow: "hidden" }}>
                  <Mummy size={110} />
                </div>
              )}
              {i === 1 && (
                <svg viewBox="0 0 60 80" width={90} height={120}>
                  <path d="M30 3 C 44 26, 56 40, 56 54 A 26 26 0 0 1 4 54 C 4 40, 16 26, 30 3 Z" fill="#6FB7D9" stroke={INK} strokeWidth={4} />
                </svg>
              )}
              {i === 2 && (
                <div style={{ position: "relative", width: 110, height: 110 }}>
                  <Sun size={110} rays />
                </div>
              )}
            </div>
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 96, color: INK, textTransform: "uppercase" }}>{n.t}</div>
          </div>
        );
      })}
      <Sfx at={0} src="onion/thud.wav" volume={0.6} />
      {NEEDS.map((n) => (
        <Sfx key={n.t} at={cue(n.at)} src="sfx/pop.wav" volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};

export const Cta: React.FC = () => {
  const cue = useCue();
  const float = useFloat(6);
  const phone = useEnter(cue(0.2));
  const wish = useEnter(cue(0.6), { damping: 10, stiffness: 160 });
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="YOUR TURN · FIG. 08" right="COMMENT" dark />
      <Headline setup="Aapke ghar mein kaun karta hai?" punch="Comment karo!" dark punchColor={GOLD} punchSize={110} />
      <div style={{ position: "absolute", left: 50, top: 620 + float, opacity: useEnter(cue(0.02)) }}>
        <Mummy size={360} expression="grin" phone />
      </div>
      <div style={{ position: "absolute", left: 460, top: 600, width: 560, height: 500, borderRadius: 48, background: "#121212", border: "8px solid #2C2C2C", opacity: phone, transform: `translateY(${(1 - phone) * 80}px)` }}>
        <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #2A2A2A" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#8E2A3C" }} />
          <span style={{ fontFamily: MONO, fontSize: 26, color: "#ddd" }}>Mummy</span>
        </div>
        <div style={{ margin: "26px 24px 0", padding: "16px 20px", borderRadius: 20, background: "#2A2A2A", fontFamily: MONO, fontSize: 24, color: "#eee", opacity: useEnter(cue(0.28)), maxWidth: 420 }}>
          beta, ghat pe kab aaoge?
        </div>
        <div style={{ margin: "16px 24px 0 auto", padding: "16px 20px", borderRadius: 20, background: RED, fontFamily: MONO, fontSize: 24, color: "white", opacity: useEnter(cue(0.4)), maxWidth: 420, width: "fit-content" }}>
          Mummy, thekua bacha ke rakhna!
        </div>
        <div style={{ margin: "16px 24px 0", padding: "16px 20px", borderRadius: 20, background: "#2A2A2A", fontFamily: DEVA, fontSize: 30, color: "#eee", opacity: useEnter(cue(0.52)), maxWidth: 420, width: "fit-content" }}>
          पहले अर्घ्य, फिर ठेकुआ!
        </div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 1190, textAlign: "center", transform: `scale(${0.7 + 0.3 * wish})`, opacity: wish }}>
        <div style={{ fontFamily: DEVA, fontSize: 92, color: GOLD, lineHeight: 1.2 }}>छठ पूजा की</div>
        <div style={{ fontFamily: DEVA, fontSize: 92, color: GOLD, lineHeight: 1.2 }}>हार्दिक शुभकामनाएँ</div>
      </div>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Diya key={i} size={100} seed={i} style={{ position: "absolute", left: 50 + i * 165, top: 1460, opacity: useEnter(cue(0.65) + i * 3) }} />
      ))}
      <Sfx at={cue(0.28)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.4)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.52)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.6)} src="sfx/chime.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  meaning: Meaning,
  days: Days,
  fast: Fast,
  soop: SoopScene,
  sandhya: Sandhya,
  usha: Usha,
  twist: Twist,
  cta: Cta,
};

