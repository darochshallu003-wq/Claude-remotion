import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { clamp, Header, Headline, Stamp, useCue, useEnter, useFloat } from "../onion/components";
import { C, DEVA, HEAD, MONO } from "../onion/theme";
import { RED, SOIL, SOIL_DARK } from "../mitti/art";
import { Grain, INK, KraftBg, Sfx, SpeechBubble, Tag, WarmDark } from "../mitti/kraft";
import { Aman, Mummy } from "../mitti/people";
import {
  Antibody,
  ANTIBODY,
  Clostridium,
  FLESH,
  FLESH_DEEP,
  Foot,
  Nail,
  NERVE,
  Padlock,
  Spore,
  Syringe,
  ToxinDrop,
  TOXIN,
} from "./art";

const LAB = "TETANUS LAB";

/** Floating "z" letters above a sleeping thing. */
const Zzz: React.FC<{ x: number; y: number; size: number; seed?: number; opacity?: number }> = ({ x, y, size, seed = 0, opacity = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 1].map((i) => {
        const t = ((frame + seed * 13 + i * 22) % 44) / 44;
        return (
          <div
            key={i}
            style={{ position: "absolute", left: x + t * size * 0.6, top: y - t * size, fontFamily: HEAD, fontWeight: 700, fontSize: size * (0.4 + t * 0.3), color: C.cream, opacity: opacity * Math.sin(Math.PI * t) }}
          >
            z
          </div>
        );
      })}
    </>
  );
};

/** Small comic burst behind an impact. */
const Burst: React.FC<{ x: number; y: number; size: number; at: number; text: string }> = ({ x, y, size, at, text }) => {
  const e = useEnter(at, { damping: 9, stiffness: 260 });
  const pts = new Array(24)
    .fill(0)
    .map((_, i) => {
      const r = i % 2 ? size * 0.32 : size * 0.5;
      const a = (i / 24) * Math.PI * 2;
      return `${size / 2 + Math.cos(a) * r},${size / 2 + Math.sin(a) * r}`;
    })
    .join(" ");
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${e}) rotate(-8deg)`, opacity: e }}>
      <svg width={size} height={size}>
        <polygon points={pts} fill="#FFD23F" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 700, fontSize: size * 0.2, color: RED }}>{text}</div>
    </div>
  );
};

// ===========================================================================

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const step = interpolate(frame, [cue(0.06), cue(0.2)], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const syringe = useEnter(cue(0.72));
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="INJURY · FIG. 01" right={LAB} dark={false} />
      <Headline setup="Pair mein keel chubhi…" punch="Injection kyun?!" dark={false} punchColor={RED} />
      {/* wooden plank with the nail */}
      <div style={{ position: "absolute", left: 40, top: 1150, width: 560, height: 70, background: "#8A5A35", border: `6px solid ${INK}`, boxShadow: "0 12px 20px rgba(0,0,0,0.3)" }}>
        {[90, 260, 430].map((x) => (
          <div key={x} style={{ position: "absolute", left: x, top: 20, width: 70, height: 6, borderRadius: 3, background: "rgba(0,0,0,0.25)" }} />
        ))}
      </div>
      <Nail height={210} rust={0.8} style={{ position: "absolute", left: 300, top: 960 }} />
      <Foot width={400} style={{ position: "absolute", left: 120, top: 560 + step * 270 }} />
      <Burst x={330} y={960} size={230} at={cue(0.2)} text="AAH!" />
      <div style={{ position: "absolute", left: 640, top: 760, opacity: useEnter(cue(0.3)) }}>
        <Mummy size={330} expression="neutral" />
      </div>
      <SpeechBubble text="इंजेक्शन लगवा लो!" x={470} y={600} at={cue(0.4)} />
      <Syringe width={460} fill={0.8} style={{ position: "absolute", left: 300, top: 1290, opacity: syringe, transform: `translateX(${(1 - syringe) * 200}px) rotate(-6deg)` }} />
      <div style={{ position: "absolute", left: 800, top: 1250, fontFamily: HEAD, fontWeight: 700, fontSize: 150, color: RED, opacity: useEnter(cue(0.8)) }}>?</div>
      <Sfx at={cue(0.2)} src="onion/thud.wav" volume={0.55} />
      <Sfx at={cue(0.4)} src="sfx/pop.wav" volume={0.5} />
      <Sfx at={cue(0.72)} src="sfx/whoosh.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Rust: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const flakes = new Array(10).fill(0);
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="MYTH · FIG. 02" right="ZANG?" dark />
      <Headline setup="Zang se tetanus?" punch="Zang bekasoor hai!" dark punchColor={RED} punchSize={104} />
      <div style={{ position: "absolute", left: 540 - 60, top: 600, transform: `rotate(${Math.sin(frame / 14) * 3}deg)`, opacity: useEnter(cue(0.02)) }}>
        <Nail height={560} rust={1} />
      </div>
      {flakes.map((_, i) => {
        const t = ((frame + i * 9) % 90) / 90;
        return (
          <div
            key={i}
            style={{ position: "absolute", left: 500 + random(`rf${i}`) * 90, top: 700 + random(`ry${i}`) * 300 + t * 380, width: 16, height: 12, borderRadius: 4, background: "#A4512A", opacity: 1 - t, transform: `rotate(${t * 180 + i * 30}deg)` }}
          />
        );
      })}
      <Stamp text="MYTH" x={300} y={860} at={cue(0.4)} color={RED} rotate={-12} size={130} blend="normal" />
      <Tag text="ZANG ≠ TETANUS" x={600} y={1240} at={cue(0.55)} rotate={3} />
      <Tag text="ZANG WALI KEEL = AKSAR GANDI KEEL" x={170} y={1330} at={cue(0.7)} />
      <Sfx at={cue(0.4)} src="onion/thud.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

export const Villain: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const lens = useEnter(cue(0.08));
  const spores = useEnter(cue(0.5));
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="SOIL · FIG. 03" right="C. TETANI" dark={false} />
      <Headline setup="Asli villain:" punch="Clostridium tetani" dark={false} punchColor={RED} punchSize={96} />
      {/* magnifier on the bacterium */}
      <div style={{ position: "absolute", left: 140, top: 540, width: 800, height: 500, borderRadius: 40, background: "radial-gradient(circle, #FBF7EE 0%, #EDE4CF 100%)", border: `10px solid #5A5048`, transform: `scale(${lens})`, boxShadow: "0 20px 40px rgba(0,0,0,0.35)", overflow: "hidden" }}>
        <Clostridium size={560} angry={useEnter(cue(0.25))} style={{ position: "absolute", left: 110, top: 120, transform: `translateY(${Math.sin(frame / 8) * 8}px) rotate(${Math.sin(frame / 16) * 3}deg)` }} />
        <div style={{ position: "absolute", right: 30, bottom: 20, fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#6B5A45" }}>SPORE WALA SIRA →</div>
      </div>
      {/* soil with sleeping spores */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1100, height: 330, background: `linear-gradient(${SOIL}, ${SOIL_DARK})`, borderTop: `8px solid ${INK}` }}>
        <Grain opacity={0.4} />
        {new Array(7).fill(0).map((_, i) => {
          const x = 60 + i * 140 + random(`vx${i}`) * 40;
          const y = 50 + random(`vy${i}`) * 170;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, opacity: spores, transform: `scale(${spores})` }}>
              <Spore size={90} />
              <Zzz x={70} y={-6} size={50} seed={i} />
            </div>
          );
        })}
      </div>
      <Tag text="MITTI · DHOOL · GOBAR" x={80} y={1060} at={cue(0.5)} rotate={-3} />
      <Tag text="SAALON TAK SOTE RAHTE HAIN" x={420} y={1450} at={cue(0.75)} rotate={2} />
      <Sfx at={cue(0.08)} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={cue(0.5)} src="onion/sparkle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Deep: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const push = interpolate(frame, [cue(0.06), cue(0.26)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pull = interpolate(frame, [cue(0.32), cue(0.45)], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const nailY = 380 + push * 480 - pull * 560;
  const wake = interpolate(frame, [cue(0.62), cue(0.75)], [0, 1], clamp);
  const SKIN_TOP = 700;
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="WOUND · FIG. 04" right="NO OXYGEN" dark={false} />
      <Headline setup="Gehri chot…" punch="Oxygen nahi = party!" dark={false} punchColor={RED} punchSize={100} />
      {/* skin cross-section */}
      <div style={{ position: "absolute", left: 60, right: 60, top: SKIN_TOP, height: 680, border: `6px solid ${INK}`, background: `linear-gradient(${FLESH} 0%, ${FLESH} 12%, ${FLESH_DEEP} 100%)`, overflow: "hidden", boxShadow: "0 14px 26px rgba(0,0,0,0.25)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 60, background: "#D9967A", borderBottom: `4px solid ${INK}` }} />
        {/* wound channel */}
        <div style={{ position: "absolute", left: 455 - 22, top: 0, width: 44, height: 520 * push, background: "#5E1F1A", opacity: 0.85, borderRadius: "0 0 22px 22px" }} />
        {/* oxygen bubbles only near the surface */}
        {new Array(9).fill(0).map((_, i) => {
          const x = 30 + i * 105;
          const y = 80 + ((frame * 0.8 + i * 23) % 120);
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: 44, height: 44, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.8)", color: "white", fontFamily: MONO, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.9 }}>
              O₂
            </div>
          );
        })}
        {/* spores left deep in the wound, waking up */}
        {[0, 1, 2].map((i) => {
          const x = 300 + i * 120;
          const y = 420 + (i % 2) * 70;
          const show = push > 0.95 ? 1 : 0;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, opacity: show }}>
              <div style={{ opacity: 1 - wake, position: "absolute" }}>
                <Spore size={70} />
              </div>
              <div style={{ opacity: wake, position: "absolute", left: -30, top: -6, transform: `scale(${0.6 + 0.4 * wake}) rotate(${Math.sin(frame / 5 + i) * 6}deg)` }}>
                <Clostridium size={200} />
              </div>
              {wake < 0.5 && <Zzz x={50} y={-10} size={40} seed={i} />}
            </div>
          );
        })}
      </div>
      {/* the nail going in and out */}
      <div style={{ position: "absolute", left: 455 + 60 - 32, top: nailY, transform: "rotate(180deg)", opacity: pull < 1 ? 1 : 0 }}>
        <Nail height={330} rust={0.8} />
      </div>
      <div style={{ position: "absolute", right: 90, top: SKIN_TOP + 100, fontFamily: HEAD, fontWeight: 700, fontSize: 46, color: "white", textShadow: "0 3px 0 rgba(0,0,0,0.3)", opacity: useEnter(cue(0.4)) }}>O₂ ✓</div>
      <div style={{ position: "absolute", right: 90, top: SKIN_TOP + 520, fontFamily: HEAD, fontWeight: 700, fontSize: 46, color: "#FFD23F", textShadow: "0 3px 0 rgba(0,0,0,0.3)", opacity: useEnter(cue(0.45)) }}>O₂ ✗</div>
      <Tag text="SPORES JAAG GAYE!" x={110} y={1420} at={cue(0.72)} />
      <Sfx at={cue(0.24)} src="onion/thud.wav" volume={0.45} />
      <Sfx at={cue(0.65)} src="onion/sparkle.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Toxin: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const start = cue(0.15);
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="TOXIN · FIG. 05" right="TETANOSPASMIN" dark />
      <Headline setup="Jaagte hi…" punch="Zehar banate hain!" dark punchColor={RED} punchSize={108} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 640, background: `radial-gradient(circle at 50% 50%, rgba(142,76,158,${0.35 * useEnter(start)}) 0%, transparent 60%)` }} />
      {new Array(14).fill(0).map((_, i) => {
        if (frame < start) return null;
        const t = ((frame - start + i * 7) % 98) / 98;
        const a = (i / 14) * Math.PI * 2;
        const r = 160 + t * 360;
        return (
          <ToxinDrop
            key={i}
            size={58}
            style={{ position: "absolute", left: 540 - 29 + Math.cos(a) * r, top: 960 - 38 + Math.sin(a) * r * 0.75, opacity: Math.sin(Math.PI * t), transform: `rotate(${(a * 180) / Math.PI + 90}deg)` }}
          />
        );
      })}
      <Clostridium size={520} style={{ position: "absolute", left: 540 - 260, top: 960 - 122, transform: `scale(${1 + Math.sin(frame / 4) * 0.03})` }} />
      <Tag text="TETANOSPASMIN" x={330} y={1310} at={cue(0.35)} />
      <Tag text="DUNIYA KE SABSE TAQATWAR ZEHRON MEIN SE EK" x={80} y={1400} at={cue(0.6)} rotate={1} />
      <Sfx at={start} src="onion/sparkle.wav" volume={0.35} />
      <Sfx at={cue(0.6)} src="onion/thud.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

/** One switch on the "muscle control" board. */
const Switch: React.FC<{ x: number; label: string; color: string; on: number; blocked?: number }> = ({ x, label, color, on, blocked = 0 }) => (
  <div style={{ position: "absolute", left: x, top: 40, width: 300, textAlign: "center" }}>
    <div style={{ margin: "0 auto", width: 190, height: 190, borderRadius: "50%", background: color, border: `8px solid ${INK}`, boxShadow: on ? `0 0 ${30 * on}px ${color}` : "none", opacity: 0.5 + 0.5 * on, position: "relative" }}>
      {blocked > 0 && (
        <svg width={190} height={190} viewBox="0 0 190 190" style={{ position: "absolute", left: -8, top: -8, opacity: blocked }}>
          <path d="M40 40 L 150 150 M150 40 L 40 150" stroke={INK} strokeWidth={20} strokeLinecap="round" />
        </svg>
      )}
    </div>
    <div style={{ marginTop: 18, fontFamily: HEAD, fontWeight: 700, fontSize: 50, color: INK }}>{label}</div>
  </div>
);

export const Nerve: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const fly = interpolate(frame, [cue(0.15), cue(0.4)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const blocked = interpolate(frame, [cue(0.4), cue(0.46)], [0, 1], clamp);
  const tense = interpolate(frame, [cue(0.5), cue(0.7)], [0, 1], clamp);
  const shake = tense * Math.sin(frame * 2.2) * 6;
  const relaxPulse = blocked < 1 ? 0.5 + 0.5 * Math.sin(frame / 5) : 0;
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="NERVES · FIG. 06" right="NO RELAX" dark={false} />
      <Headline setup="Nason pe attack…" punch="Relax button band!" dark={false} punchColor={RED} punchSize={104} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 570, height: 380, background: "#F1E7D2", border: `6px solid ${INK}`, boxShadow: "0 12px 24px rgba(0,0,0,0.25)" }}>
        <div style={{ position: "absolute", left: 24, top: 14, fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#6B5A45" }}>MUSCLE CONTROL</div>
        <Switch x={60} label="KHINCHO" color="#E06B4F" on={1} />
        <Switch x={540} label="RELAX" color="#6DBF73" on={relaxPulse} blocked={blocked} />
      </div>
      <ToxinDrop
        size={110}
        style={{ position: "absolute", left: interpolate(fly, [0, 1], [-140, 728]), top: interpolate(fly, [0, 0.5, 1], [1100, 520, 640]), transform: `rotate(${fly * 360}deg)`, opacity: fly > 0 && blocked < 1 ? 1 : 0 }}
      />
      {/* the arm: a muscle that bunches up */}
      <svg width={900} height={420} viewBox="0 0 900 420" style={{ position: "absolute", left: 90, top: 1000, transform: `translateX(${shake}px)` }}>
        <path
          d={`M40 300 C 120 ${300 - 90 * tense}, 300 ${190 - 120 * tense}, 460 ${220 - 60 * tense} C 560 ${235 - 30 * tense}, 700 ${270 - 20 * tense}, 860 260 L 860 360 C 700 372, 400 380, 40 380 Z`}
          fill="#D88E68"
          stroke={INK}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${200 + i * 110} ${330 - tense * 40} q 40 ${-30 - tense * 30} 80 0`} fill="none" stroke={INK} strokeWidth={4} opacity={0.35 + tense * 0.4} />
        ))}
      </svg>
      <Tag text="MUSCLES KHINCHTI CHALI JAATI HAIN" x={150} y={1420} at={cue(0.6)} />
      <Sfx at={cue(0.4)} src="onion/thud.wav" volume={0.55} />
      <Sfx at={cue(0.55)} src="onion/slice.wav" volume={0.3} />
    </AbsoluteFill>
  );
};

const STAGES = [
  { label: "JABDA", sub: "LOCKJAW", at: 0.12 },
  { label: "GARDAN", sub: "NECK", at: 0.42 },
  { label: "PEETH", sub: "BACK", at: 0.56 },
  { label: "SAANS", sub: "BREATHING", at: 0.7 },
];

export const Lockjaw: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const lock = useEnter(cue(0.12), { damping: 9, stiffness: 240 });
  const tremble = frame > cue(0.12) ? Math.sin(frame * 1.7) * 2 : 0;
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="SYMPTOMS · FIG. 07" right="LOCKJAW" dark />
      <Headline setup="Sabse pehle jabda…" punch="Lockjaw!" dark punchColor={RED} />
      <div style={{ position: "absolute", left: 40, top: 640, transform: `translateX(${tremble}px)` }}>
        <Aman size={440} expression="neutral" />
        <Padlock size={100} style={{ position: "absolute", left: 220 - 50, top: 196, transform: `scale(${lock}) rotate(${(1 - lock) * 40}deg)`, opacity: lock }} />
      </div>
      {STAGES.map((s, i) => {
        const on = useEnter(cue(s.at));
        return (
          <div
            key={s.label}
            style={{
              position: "absolute",
              left: 560,
              top: 640 + i * 170,
              width: 440,
              height: 140,
              padding: "18px 26px",
              background: on > 0.5 ? RED : "rgba(255,255,255,0.06)",
              border: `4px solid ${on > 0.5 ? RED : "rgba(243,235,221,0.25)"}`,
              transform: `translateX(${(1 - on) * 40}px)`,
              boxSizing: "border-box",
            }}
          >
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: on > 0.5 ? "white" : "rgba(243,235,221,0.4)", lineHeight: 1 }}>
              {i + 1}. {s.label}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: on > 0.5 ? "rgba(255,255,255,0.85)" : "rgba(243,235,221,0.3)", marginTop: 8 }}>{s.sub}</div>
          </div>
        );
      })}
      {STAGES.map((s) => (
        <Sfx key={s.label} at={cue(s.at)} src="onion/thud.wav" volume={0.35} />
      ))}
    </AbsoluteFill>
  );
};

export const Vaccine: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const inject = useEnter(cue(0.2));
  const learn = cue(0.55);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="VACCINE · FIG. 08" right="TOXOID" dark={false} />
      <Headline setup="Injection mein kya hai?" punch="Beasar zehar!" dark={false} punchColor={RED} />
      <div style={{ position: "absolute", left: 60, top: 600, opacity: inject, transform: `translateX(${(1 - inject) * -200}px) rotate(-4deg)` }}>
        <Syringe width={900} fill={0.9} liquid="#E4DDD0" />
        {[0, 1, 2, 3, 4].map((i) => (
          <ToxinDrop key={i} size={50} defused style={{ position: "absolute", left: 230 + i * 100, top: 72 + (i % 2) * 20, transform: `rotate(${Math.sin(frame / 10 + i) * 10}deg)` }} />
        ))}
      </div>
      <Tag text="ZEHAR, PAR BINA DAANT KA (TOXOID)" x={120} y={900} at={cue(0.3)} rotate={-2} />
      {/* antibodies appear as the body learns */}
      {new Array(10).fill(0).map((_, i) => {
        const at = learn + i * 4;
        const e = useEnter(at, { damping: 10, stiffness: 200 });
        const x = 120 + (i % 5) * 180;
        const y = 1020 + Math.floor(i / 5) * 210;
        return <Antibody key={i} size={110} style={{ position: "absolute", left: x, top: y + Math.sin(frame / 9 + i) * 6, transform: `scale(${e}) rotate(${(i % 2 ? 8 : -8) + Math.sin(frame / 12 + i) * 6}deg)`, opacity: e }} />;
      })}
      <Tag text="SHARIR NE PEHCHAANA → ANTIBODIES TAIYAAR" x={90} y={1460} at={cue(0.75)} rotate={1} />
      <Sfx at={cue(0.2)} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={learn} src="onion/sparkle.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Shield: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const NERVE_X = 900;
  const drops = [0, 1, 2, 3];
  const catchX = 560;
  return (
    <AbsoluteFill>
      <WarmDark />
      <Header left="DEFENCE · FIG. 09" right="ANTIBODIES" dark />
      <Headline setup="Asli zehar aaya?" punch="Pakda gaya!" dark punchColor={RED} />
      {/* the nerve on the right */}
      <svg width={180} height={820} style={{ position: "absolute", left: NERVE_X - 60, top: 600 }}>
        <path d={`M90 0 C 40 200, 140 400, 90 600 S 60 760, 90 820`} fill="none" stroke={NERVE} strokeWidth={26} strokeLinecap="round" />
        <path d={`M90 0 C 40 200, 140 400, 90 600 S 60 760, 90 820`} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="2 22" />
      </svg>
      <div style={{ position: "absolute", left: NERVE_X - 120, top: 1440, fontFamily: MONO, fontSize: 24, letterSpacing: 3, color: NERVE }}>NAS (NERVE)</div>
      {drops.map((i) => {
        const at = cue(0.08) + i * 10;
        const t = interpolate(frame, [at, at + 26], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
        const caught = t >= 1;
        const y = 680 + i * 190;
        return (
          <React.Fragment key={i}>
            <ToxinDrop size={80} style={{ position: "absolute", left: interpolate(t, [0, 1], [-100, catchX - 70]), top: y, opacity: t > 0 ? 1 : 0, transform: `rotate(${caught ? 0 : 90}deg)` }} />
            <Antibody size={130} style={{ position: "absolute", left: catchX - 20, top: y - 50 + Math.sin(frame / 8 + i) * 4, transform: `rotate(-90deg) scale(${useEnter(cue(0.02) + i * 3)})` }} />
            {caught && <Sfx at={at + 26} src="sfx/pop.wav" volume={0.4} />}
          </React.Fragment>
        );
      })}
      <Stamp text="BLOCKED" x={330} y={1440} at={cue(0.6)} color={ANTIBODY} rotate={-6} size={96} blend="normal" />
    </AbsoluteFill>
  );
};

export const Twist: React.FC = () => {
  const cue = useCue();
  const slam = useEnter(0, { damping: 9, stiffness: 220 });
  const bars = useEnter(cue(0.35));
  const need = useEnter(cue(0.2));
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
      <div style={{ position: "absolute", left: 70, right: 70, top: 600, fontFamily: HEAD, fontWeight: 700, fontSize: 66, color: "white", opacity: useEnter(cue(0.1)), textTransform: "uppercase", lineHeight: 1.05 }}>
        Bimari se immunity nahi milti
      </div>
      {/* bar chart: toxin dose vs what the body needs to remember */}
      <div style={{ position: "absolute", left: 160, top: 860, width: 760, height: 420, borderBottom: "6px solid white" }}>
        <div style={{ position: "absolute", left: 60, bottom: 0, width: 220, height: 30 * bars, background: TOXIN, border: "5px solid white" }} />
        <div style={{ position: "absolute", left: 460, bottom: 0, width: 220, height: 380 * need, border: "6px dashed white", boxSizing: "border-box" }} />
        <div style={{ position: "absolute", left: 30, top: 440, width: 280, textAlign: "center", fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: "white" }}>ZEHAR KI MATRA</div>
        <div style={{ position: "absolute", left: 430, top: 440, width: 280, textAlign: "center", fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: "white" }}>YAAD RAKHNE KE LIYE CHAHIYE</div>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1400, padding: "18px 26px", background: "rgba(0,0,0,0.25)", fontFamily: MONO, fontSize: 26, letterSpacing: 2, color: "white", opacity: useEnter(cue(0.65)) }}>
        ISLIYE TETANUS SE BACHE LOGON KO BHI INJECTION ZAROORI
      </div>
      <Sfx at={0} src="onion/thud.wav" volume={0.6} />
      <Sfx at={cue(0.35)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

const RULES = [
  { title: "Har 10 saal", sub: "BOOSTER (Td) LAGWAIYE", at: 0.3 },
  { title: "Gehri / gandi chot?", sub: "DOSE 5 SAAL SE PURANA → DOCTOR", at: 0.6 },
];

export const Booster: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const span = interpolate(frame, [cue(0.02), cue(0.25)], [0, 1], clamp);
  const YEARS = [0, 10, 20];
  const L = 120;
  const R = 960;
  // protection decays between doses, refilled at each one
  const level = (x: number) => {
    const yrs = x * 20;
    return 1 - 0.75 * ((yrs % 10) / 10);
  };
  const pts = new Array(81).fill(0).map((_, i) => i / 80);
  return (
    <AbsoluteFill>
      <KraftBg />
      <Header left="YOUR MOVE · FIG. 10" right="BOOSTER" dark={false} />
      <Headline setup="Asar hamesha nahi rehta…" punch="Booster yaad rakho!" dark={false} punchColor={RED} punchSize={104} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 570, height: 380, background: "#F1E7D2", boxShadow: "0 10px 22px rgba(0,0,0,0.2)" }}>
        <div style={{ position: "absolute", left: 110, top: 14, fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#6B5A45" }}>SURAKSHA (PROTECTION)</div>
        <svg width={960} height={380} style={{ position: "absolute", left: -60, top: 0 }}>
          <path
            d={pts
              .filter((p) => p <= span)
              .map((p, i) => `${i ? "L" : "M"}${L + p * (R - L)} ${300 - level(p) * 220}`)
              .join(" ")}
            fill="none"
            stroke={ANTIBODY}
            strokeWidth={8}
            strokeLinejoin="round"
          />
          <line x1={L} y1={300} x2={R} y2={300} stroke={INK} strokeWidth={4} />
        </svg>
        {YEARS.map((y, i) => (
          <div key={y} style={{ position: "absolute", left: L - 60 + (i / 2) * (R - L) - 50, top: 310, width: 100, textAlign: "center", opacity: span >= i / 2 ? 1 : 0.2 }}>
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 36, color: INK }}>{y} SAAL</div>
          </div>
        ))}
        {YEARS.map((y, i) => (
          <Syringe key={`s${y}`} width={110} fill={1} style={{ position: "absolute", left: L - 60 + (i / 2) * (R - L) - 55, top: 30, transform: "rotate(90deg)", opacity: span >= i / 2 ? 1 : 0 }} />
        ))}
      </div>
      {RULES.map((r, i) => {
        const e = useEnter(cue(r.at));
        return (
          <div
            key={r.title}
            style={{ position: "absolute", left: 70, right: 70, top: 1010 + i * 210, height: 180, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 34px", background: "#F1E7D2", boxShadow: "0 10px 22px rgba(0,0,0,0.2)", transform: `translateX(${(1 - e) * 140}px) rotate(${i ? 1 : -1}deg)`, opacity: e }}
          >
            <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: INK, textTransform: "uppercase", lineHeight: 1.05 }}>{r.title}</div>
            <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: RED, marginTop: 8 }}>{r.sub}</div>
          </div>
        );
      })}
      {RULES.map((r) => (
        <Sfx key={r.title} at={cue(r.at)} src="sfx/pop.wav" volume={0.45} />
      ))}
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
      <Header left="YOUR TURN · FIG. 11" right="COMMENT" dark />
      <Headline setup="Last injection kab laga?" punch="Ghar pe sabko bhejo!" dark punchColor={RED} punchSize={100} />
      <div style={{ position: "absolute", left: 60, top: 640 + float, opacity: useEnter(cue(0.05)) }}>
        <Mummy size={380} expression="grin" phone />
      </div>
      <div style={{ position: "absolute", left: 470, top: 620, width: 540, height: 560, borderRadius: 48, background: "#121212", border: "8px solid #2C2C2C", opacity: phone, transform: `translateY(${(1 - phone) * 80}px)` }}>
        <div style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 14, borderBottom: "2px solid #2A2A2A" }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#8E2A3C" }} />
          <span style={{ fontFamily: MONO, fontSize: 26, color: "#ddd" }}>Mummy</span>
        </div>
        <div style={{ margin: "28px 24px 0", padding: "16px 20px", borderRadius: 20, background: "#2A2A2A", fontFamily: MONO, fontSize: 24, color: "#eee", opacity: useEnter(cue(0.4)), maxWidth: 400 }}>
          beta, papa ko keel chubh gayi!
        </div>
        <div style={{ margin: "18px 24px 0 auto", padding: "16px 20px", borderRadius: 20, background: RED, fontFamily: MONO, fontSize: 24, color: "white", opacity: useEnter(cue(0.58)), maxWidth: 400, width: "fit-content" }}>
          last tetanus injection kab laga tha?
        </div>
        <div style={{ margin: "18px 24px 0", padding: "16px 20px", borderRadius: 20, background: "#2A2A2A", fontFamily: DEVA, fontSize: 30, color: "#eee", opacity: useEnter(cue(0.75)), maxWidth: 400, width: "fit-content" }}>
          पता नहीं… doctor के पास चलते हैं!
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
  rust: Rust,
  villain: Villain,
  deep: Deep,
  toxin: Toxin,
  nerve: Nerve,
  lockjaw: Lockjaw,
  vaccine: Vaccine,
  shield: Shield,
  twist: Twist,
  booster: Booster,
  cta: Cta,
};
