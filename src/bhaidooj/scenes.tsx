import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { clamp, Header, Headline, Stamp, useCue, useEnter, useFloat } from "../onion/components";
import { C, DEVA, HEAD, MONO } from "../onion/theme";
import { RED } from "../mitti/art";
import { Grain, INK, KraftBg, Sfx, SpeechBubble, Tag, WarmDark } from "../mitti/kraft";
import { Aman, Riya } from "../mitti/people";
import { Yamraj, Yamuna } from "./deities";
import { Bhojan, GOLD, River, Scroll, Thali } from "./art";
import { HOOK_CUES } from "./script";

const LAB = "TYOHAR LAB";

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

// Cold open, synced to the hook clip (voice starts 4 frames in); the
// story/yamraj cue times come from HOOK_CUES in script.ts:
// 0.0 s "रुको" · 0.6 s "भाई दूज पर सिर्फ़ टीका लगवाकर भाग रहे हो?" ·
// 3.7 s "इस दिन की असली कहानी…" · 5.3 s "यमराज से जुड़ी है!"
const at = (s: number) => Math.round(s * 30) + 4;

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { story, yamraj } = HOOK_CUES;
  const dark = interpolate(frame, [at(story - 0.2), at(Math.min(story + 0.9, yamraj - 0.2))], [0, 0.82], clamp);
  const slamAt = at(yamraj);
  const slammed = frame >= slamAt;
  const slam = useEnter(slamAt, { damping: 11, stiffness: 200 });
  const flash = interpolate(frame, [slamAt, slamAt + 10], [1, 0], clamp);
  const shake = slammed && frame < slamAt + 14 ? Math.sin(frame * 3.1) * 18 * (1 - (frame - slamAt) / 14) : 0;
  // brother runs off with his tika, then freezes when the room goes dark
  const run = interpolate(frame, [0, at(story - 0.3)], [330, 660], clamp);
  const running = frame < at(story - 0.3);
  const bob = running ? Math.abs(Math.sin(frame / 3)) * -26 : Math.sin(frame * 1.7) * 3 * (dark > 0.3 ? 1 : 0);
  const shadow = interpolate(frame, [at(story), at(yamraj - 0.1)], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      <KraftBg />
      {!slammed && (
        <>
          <Header left="BHAI DOOJ · COLD OPEN" right={LAB} dark={dark > 0.4} />
          {/* visible from frame 0 (it is the thumbnail), with a quick punch bounce */}
          <div style={{ position: "absolute", top: 222, left: 70, right: 70, textTransform: "uppercase" }}>
            <div style={{ fontFamily: HEAD, fontWeight: 500, fontSize: 58, color: dark > 0.4 ? C.cream : INK }}>Bhai Dooj pe sirf tika…</div>
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 124, lineHeight: 1.02, color: RED, marginTop: 4, transform: `scale(${1 + 0.12 * Math.max(0, 1 - frame / 8)})`, transformOrigin: "left center" }}>
              Aur bhaag gaye?!
            </div>
          </div>
          {/* Yamraj's silhouette rising behind the brother */}
          <div style={{ position: "absolute", left: 300, top: 1500 - shadow * 900, opacity: shadow * 0.9, filter: "brightness(0)" }}>
            <Yamraj size={560} />
          </div>
          {/* speed lines behind the runner */}
          {running &&
            [0, 1, 2, 3].map((i) => (
              <div key={i} style={{ position: "absolute", left: run - 150 - ((frame * 9 + i * 40) % 120), top: 900 + i * 90, width: 120, height: 10, borderRadius: 5, background: INK, opacity: 0.35 }} />
            ))}
          <div style={{ position: "absolute", left: 30, top: 760 }}>
            <Riya size={380} expression={dark > 0.3 ? "neutral" : "disgust"} />
          </div>
          <div style={{ position: "absolute", left: 60, top: 1260 }}>
            <Thali size={300} />
          </div>
          <div style={{ position: "absolute", left: run, top: 800 + bob, transform: `scaleX(${running ? -1 : 1})` }}>
            <Aman size={380} expression={dark > 0.3 ? "disgust" : "grin"} tilak={1} />
          </div>
          {dark > 0.3 && (
            <div style={{ position: "absolute", left: run + 270, top: 860 - ((frame % 30) / 30) * 20, width: 30, height: 44, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#9CC3DA", border: `4px solid ${INK}`, opacity: dark }} />
          )}
          <SpeechBubble text="रुको!!" x={250} y={640} at={2} />
          <Tag text="TIKA ✓  ...AB BHAAGO?" x={560} y={1330} at={at(1.6)} rotate={3} />
          <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 60%, rgba(60,8,8,${dark * 0.85}) 0%, rgba(10,4,4,${dark}) 80%)`, pointerEvents: "none" }} />
        </>
      )}
      {slammed && (
        <>
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, #7A1414 0%, #3A0808 55%, #120404 100%)" }}>
            <Grain opacity={0.4} />
          </AbsoluteFill>
          <Lightning frame={frame - slamAt} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 210, color: GOLD, letterSpacing: 6, transform: `scale(${1.8 - 0.8 * slam})`, opacity: Math.min(1, slam * 2), textShadow: "0 8px 40px rgba(240,138,36,0.6)" }}>
            YAMRAJ
          </div>
          <div style={{ position: "absolute", left: 540 - 320, top: 520, transform: `scale(${1.5 - 0.5 * slam})`, transformOrigin: "50% 30%" }}>
            <Yamraj size={640} aura={1} expression="stern" />
          </div>
          <div style={{ position: "absolute", left: 740, top: 1330, transform: `rotate(8deg) translateX(${(1 - slam) * 200}px)` }}>
            <Aman size={260} expression="disgust" tilak={1} />
          </div>
          <Tag text="ASLI KAHANI YAHAN SE →" x={90} y={1560} at={slamAt + 10} />
        </>
      )}
      <AbsoluteFill style={{ background: "white", opacity: slammed ? flash : 0, pointerEvents: "none" }} />
      <Sfx at={2} src="onion/thud.wav" volume={0.5} />
      <Sfx at={4} src="sfx/whoosh.wav" volume={0.4} />
      <Sfx at={at(1.6)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={at(story - 0.2)} src="sfx/whoosh.wav" volume={0.3} />
      <Sfx at={slamAt - 2} src="sfx/thunder.wav" volume={0.9} />
      <Sfx at={slamAt} src="onion/thud.wav" volume={0.7} />
    </AbsoluteFill>
  );
};

/** Two jagged bolts that strike and fade. */
const Lightning: React.FC<{ frame: number }> = ({ frame }) => {
  const o = interpolate(frame, [0, 3, 6, 9, 16], [1, 0.3, 1, 0.6, 0], clamp);
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: o }}>
      {[
        "M120 0 L 200 260 L 140 280 L 260 560 L 190 580 L 330 900",
        "M980 0 L 880 300 L 950 320 L 820 620 L 900 640 L 760 980",
      ].map((d) => (
        <g key={d}>
          <path d={d} fill="none" stroke="#FFF1B8" strokeWidth={26} strokeLinejoin="round" opacity={0.35} />
          <path d={d} fill="none" stroke="white" strokeWidth={9} strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
};

export const Kahani: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const walk = interpolate(frame, [cue(0.05), cue(0.3)], [-420, 60], clamp);
  const bob = frame < cue(0.3) ? Math.abs(Math.sin(frame / 4)) * -14 : 0;
  const tilak = interpolate(frame, [cue(0.45), cue(0.56)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="LEGEND · FIG. 02" right="YAMA + YAMUNA" dark={false} />
      <Headline setup="Yamraj pahunche…" punch="Behen Yamuna ke ghar" dark={false} punchColor={RED} punchSize={96} />
      <div style={{ position: "absolute", left: 0, top: 1480 }}>
        <River width={1080} height={200} />
      </div>
      <div style={{ position: "absolute", left: walk - 20, top: 640 + bob }}>
        <Yamraj size={430} expression={tilak > 0.5 ? (frame > cue(0.72) ? "laugh" : "smile") : "stern"} tilak={tilak} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 650, opacity: useEnter(cue(0.15)) }}>
        <Yamuna size={420} holding={frame < cue(0.45) ? "namaste" : "lotus"} expression={frame > cue(0.72) ? "laugh" : "smile"} aura={useEnter(cue(0.15)) * 0.8} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 1250, opacity: useEnter(cue(0.7)), transform: `scale(${useEnter(cue(0.7), { damping: 10, stiffness: 180 })})` }}>
        <Bhojan size={380} />
      </div>
      <Tag text="1. TIKA" x={70} y={600} at={cue(0.45)} />
      <Tag text="2. APNE HAATH KA KHANA" x={560} y={1190} at={cue(0.7)} />
      <Sfx at={cue(0.45)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.7)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const Vardaan: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [cue(0.05), cue(0.25)], [0, 1], clamp);
  const bless = interpolate(frame, [cue(0.1), cue(0.28)], [0, 1], clamp);
  const open = interpolate(frame, [cue(0.3), cue(0.5)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="LEGEND · FIG. 03" right="VARDAAN" dark />
      <Headline setup="Khush hokar Yamraj ne diya…" punch="Vardaan!" dark punchColor={GOLD} punchSize={140} />
      <div style={{ position: "absolute", left: 40, top: 600 }}>
        <Yamraj size={440} expression="smile" tilak={1} bless={bless} aura={glow} />
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
      <Tag text="TIKA = LAMBI UMAR KI DUA" x={250} y={1300} at={cue(0.55)} />
      <Stamp text="YAM DWITIYA" x={540} y={1480} at={cue(0.8)} color={GOLD} blend="normal" rotate={-5} size={92} />
      <Sfx at={cue(0.05)} src="onion/sparkle.wav" volume={0.4} />
      <Sfx at={cue(0.3)} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={cue(0.55)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.8)} src="onion/thud.wav" volume={0.5} />
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

export const Cta: React.FC = () => {
  const cue = useCue();
  const float = useFloat(6);
  const phone = useEnter(cue(0.3));
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="YOUR MOVE · FIG. 05" right="SHARE" dark />
      <Headline setup="Is baar tike ke baad…" punch="Behen ke ghar khana!" dark punchColor={GOLD} punchSize={104} />
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
        BHAI-BEHEN KO BHEJO
      </div>
      <Sfx at={cue(0.4)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.55)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.7)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  kahani: Kahani,
  vardaan: Vardaan,
  twist: Twist,
  cta: Cta,
};
