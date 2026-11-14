import React from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { clamp, useCue, useEnter } from "../onion/components";
import { MONO } from "../onion/theme";
import { Sfx } from "../mitti/kraft";
import { BOLD, CamKey, Called, inr, K, Phone, Shot, Stamp, Tag } from "../tatkal/kit";

// System Design · 02 — "Padosi ka chhakka": live streaming at crore scale.

const ease = Easing.inOut(Easing.cubic);
const PITCH = "#1F7A4A";

/** Episode-02 camera shot. */
const S: React.FC<{ keys: CamKey[]; section?: string; hud?: React.ReactNode; children: React.ReactNode }> = (p) => (
  <Shot episode="02" {...p} />
);

// ---------------------------------------------------------------------------
// Shared pieces

/** Top-down cricket pitch with a bowler running in on a loop. */
const Pitch: React.FC<{ w: number; h: number; blur?: number; run?: boolean; frozen?: boolean }> = ({ w, h, blur = 0, run = true }) => {
  const frame = useCurrentFrame();
  const t = run ? (frame % 70) / 70 : 0;
  return (
    <div style={{ position: "relative", width: w, height: h, background: `radial-gradient(ellipse at center, #2E9A5E, ${PITCH})`, overflow: "hidden", filter: blur ? `blur(${blur}px)` : undefined }}>
      <div style={{ position: "absolute", left: w * 0.38, top: h * 0.08, width: w * 0.24, height: h * 0.84, background: "#C9B27A" }} />
      {[0.2, 0.8].map((y) => (
        <div key={y} style={{ position: "absolute", left: w * 0.34, top: h * y, width: w * 0.32, height: 4, background: "white", opacity: 0.85 }} />
      ))}
      {[0.17, 0.83].map((y) => (
        <div key={y} style={{ position: "absolute", left: w * 0.47, top: h * y - 12, width: w * 0.06, height: 14, background: "#F2E3B3", borderRadius: 3 }} />
      ))}
      {/* batter */}
      <div style={{ position: "absolute", left: w * 0.5 - 13, top: h * 0.12, width: 26, height: 26, borderRadius: 13, background: "#2F6BFF", border: "3px solid white" }} />
      {/* bowler running in */}
      <div
        style={{
          position: "absolute",
          left: w * 0.5 - 13,
          top: h * (1.05 - t * 0.22),
          width: 26,
          height: 26,
          borderRadius: 13,
          background: "#FFB020",
          border: "3px solid white",
        }}
      />
    </div>
  );
};

const Server: React.FC<{ x: number; y: number; w: number; h: number; label: string; sub?: string; color?: string; at?: number; dx?: number }> = ({
  x,
  y,
  w,
  h,
  label,
  sub,
  color = K.yellow,
  at = 0,
  dx = 0,
}) => {
  const e = useEnter(at);
  return (
    <div
      style={{
        position: "absolute",
        left: x + dx,
        top: y,
        width: w,
        height: h,
        borderRadius: 18,
        border: `4px solid ${color}`,
        background: K.panel,
        boxShadow: `0 0 40px ${color}33`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: e,
        transform: `scale(${0.8 + 0.2 * e})`,
      }}
    >
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: color, opacity: 0.4 + 0.3 * i }} />
        ))}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 4, color }}>{label}</div>
      {sub && <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 40, color: K.white, marginTop: 4 }}>{sub}</div>}
    </div>
  );
};

/** A crowd of little phones; `state(i)` picks each phone's screen colour. */
const PhoneGrid: React.FC<{ y: number; rows?: number; state: (i: number) => string; spin?: boolean }> = ({ y, rows = 4, state, spin }) => {
  const frame = useCurrentFrame();
  const cols = 10;
  return (
    <>
      {new Array(cols * rows).fill(0).map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const col = state(i);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 95 + c * 92,
              top: y + r * 120,
              width: 62,
              height: 100,
              borderRadius: 12,
              border: `3px solid ${K.edge}`,
              background: K.navy0,
              padding: 6,
            }}
          >
            <div style={{ width: "100%", height: "100%", borderRadius: 6, background: col, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {spin && (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    border: "4px solid rgba(255,255,255,0.25)",
                    borderTopColor: K.white,
                    transform: `rotate(${frame * 14 + i * 20}deg)`,
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

/** Dot travelling from a to b over [s, e] frames. */
const Packet: React.FC<{ a: [number, number]; b: [number, number]; s: number; e: number; color?: string; size?: number }> = ({
  a,
  b,
  s,
  e,
  color = K.yellow,
  size = 22,
}) => {
  const frame = useCurrentFrame();
  if (frame < s || frame > e) return null;
  const p = ease((frame - s) / Math.max(1, e - s));
  return (
    <div
      style={{
        position: "absolute",
        left: a[0] + (b[0] - a[0]) * p - size / 2,
        top: a[1] + (b[1] - a[1]) * p - size / 2,
        width: size,
        height: size,
        borderRadius: size / 2,
        background: color,
        boxShadow: `0 0 18px ${color}`,
      }}
    />
  );
};

// ===========================================================================
// 1. Neighbour shouts SIX before your stream has bowled the ball

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const shout = cue(0.45);
  const bubble = useEnter(shout, { damping: 8, stiffness: 220 });
  const glow = 0.6 + 0.4 * Math.sin(frame / 5);
  return (
    <S
      keys={[
        { t: 0, x: 540, y: 900, z: 1.55, rz: -2 },
        { t: 0.4, x: 540, y: 880, z: 1.75, rz: 1, ease: "lin" },
        { t: 0.47, x: -380, y: 560, z: 1.25, rz: -4, ease: "snap" },
        { t: 0.66, x: -360, y: 560, z: 1.4, rz: -2, ease: "lin" },
        { t: 0.73, x: 540, y: 820, z: 1.9, rz: 0, ease: "snap" },
        { t: 1, x: 170, y: 800, z: 0.68, ease: "io" },
      ]}
    >
      {/* neighbour's house, off to the left of the world */}
      <div style={{ position: "absolute", left: -720, top: 300, width: 640, height: 640 }}>
        <svg width={640} height={640} viewBox="0 0 640 640">
          <path d="M40 260 L320 60 L600 260" fill="none" stroke={K.edge} strokeWidth={8} />
          <rect x={80} y={250} width={480} height={380} fill={K.panel} stroke={K.edge} strokeWidth={8} />
          <rect x={150} y={330} width={160} height={150} fill={`rgba(255,201,40,${0.35 + 0.3 * glow})`} stroke={K.yellow} strokeWidth={6} />
          <rect x={360} y={330} width={130} height={300} fill="none" stroke={K.edge} strokeWidth={6} />
          <line x1={230} y1={330} x2={230} y2={480} stroke={K.yellow} strokeWidth={4} />
        </svg>
        <div style={{ position: "absolute", left: 120, top: 660, fontFamily: MONO, fontSize: 28, letterSpacing: 4, color: K.mute }}>
          PADOSI · CABLE TV
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: -560,
          top: 120,
          padding: "18px 40px",
          borderRadius: 30,
          background: K.yellow,
          color: K.navy0,
          fontFamily: BOLD,
          fontWeight: 700,
          fontSize: 92,
          transform: `scale(${bubble}) rotate(-6deg)`,
          opacity: bubble,
          boxShadow: "0 0 60px rgba(255,201,40,0.6)",
        }}
      >
        CHHAKKA!!
      </div>

      {/* your phone */}
      <Phone x={290} y={420} w={500} h={880}>
        <div style={{ position: "absolute", left: 24, top: 62, display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ padding: "4px 12px", background: K.red, color: "white", fontFamily: MONO, fontSize: 22 }}>● LIVE</div>
          <div style={{ fontFamily: MONO, fontSize: 22, color: K.mute }}>30s behind</div>
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, top: 120, borderRadius: 14, overflow: "hidden" }}>
          <Pitch w={440} h={520} />
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, top: 670, fontFamily: MONO, color: K.white }}>
          <div style={{ fontSize: 34 }}>IND 196/6 · 19.5 ov</div>
          <div style={{ fontSize: 28, color: K.yellow, marginTop: 8 }}>NEED 4 OFF 1 BALL</div>
        </div>
      </Phone>
      <Tag text="Ball abhi dali bhi nahi" x={540} y={1340} center at={cue(0.75)} color={K.red} size={30} />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1440, textAlign: "center", opacity: useEnter(cue(0.8)) }}>
        <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 84, color: K.white }}>{inr(interpolate(frame, [cue(0.8), cue(0.97)], [0, 30000000], clamp))}</div>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 5, color: K.mute }}>WATCHING LIVE</div>
      </div>
      <Sfx at={shout} src="sfx/pop.wav" volume={0.7} />
      <Sfx at={cue(0.73)} src="sfx/whoosh.wav" volume={0.3} />
    </S>
  );
};

// ===========================================================================
// 2. The interview question

export const Ask: React.FC = () => {
  const cue = useCue();
  const card = useEnter(2);
  const stats: [string, string, string][] = [
    ["1", "MATCH", K.white],
    ["3 CRORE", "LIVE VIEWERS", K.white],
    ["2 Mbps", "PER PERSON", K.white],
    ["60 Tbps", "TOTAL!", K.red],
  ];
  return (
    <S
      section="THE QUESTION"
      keys={[
        { t: 0, x: 540, y: 380, z: 1.7, rx: 26 },
        { t: 0.18, x: 540, y: 560, z: 1.12, rx: 0, ease: "out" },
        { t: 0.7, x: 540, y: 900, z: 1.04, ease: "io" },
        { t: 1, x: 560, y: 960, z: 1.12, ry: -6, ease: "io" },
      ]}
    >
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 260,
          padding: "26px 40px 34px",
          border: `3px solid ${K.edge}`,
          borderRadius: 16,
          background: "rgba(8,17,42,0.9)",
          opacity: card,
          transform: `translateY(${(1 - card) * 40}px)`,
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: K.yellow }}>SDE-2 INTERVIEW · ROUND 2</div>
        <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 66, lineHeight: 1.15, color: K.white, marginTop: 12 }}>
          Design <span style={{ color: K.yellow }}>live cricket</span> streaming.
        </div>
      </div>
      {stats.map(([big, small, col], i) => {
        const e = useEnter(cue(0.2 + i * 0.12), { damping: 12, stiffness: 200 });
        return (
          <div
            key={small}
            style={{
              position: "absolute",
              left: 70 + (i % 2) * 480,
              top: 690 + Math.floor(i / 2) * 250,
              width: 460,
              height: 220,
              borderRadius: 16,
              border: `3px solid ${col === K.red ? K.red : K.edge}`,
              background: "rgba(13,27,62,0.92)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              opacity: e,
              transform: `scale(${0.7 + 0.3 * e})`,
            }}
          >
            <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 84, color: col, lineHeight: 1 }}>{big}</div>
            <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 5, color: K.mute, marginTop: 14 }}>{small}</div>
          </div>
        );
      })}
      <Tag text="3 crore × 2 Mbps" x={540} y={1230} center at={cue(0.62)} size={30} />
      {[0.2, 0.32, 0.44, 0.56].map((f) => (
        <Sfx key={f} at={cue(f)} src="onion/tick.wav" volume={0.35} />
      ))}
    </S>
  );
};

// ===========================================================================
// 3. Naive: one server for everyone

export const Crash: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const fail = cue(0.55);
  const need = interpolate(frame, [cue(0.15), cue(0.5)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const broken = frame >= fail;
  return (
    <S
      section="NAIVE DESIGN"
      keys={[
        { t: 0, x: 540, y: 440, z: 1.8, rx: 0 },
        { t: 0.25, x: 540, y: 520, z: 1.5, ease: "io" },
        { t: 0.5, x: 540, y: 1000, z: 1.25, rx: 30, ease: "io" },
        { t: 0.56, shake: 28, ease: "snap" },
        { t: 0.72, x: 540, y: 960, z: 1.0, rx: 0, shake: 8, ease: "snap" },
        { t: 1, z: 0.97, shake: 0, ease: "out" },
      ]}
    >
      <Server x={340} y={300} w={400} h={230} label="ONE SERVER" sub="Mumbai" color={broken ? K.red : K.yellow} dx={broken ? Math.sin(frame * 2.1) * 6 : 0} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {new Array(10).fill(0).map((_, c) => (
          <line
            key={c}
            x1={540}
            y1={530}
            x2={126 + c * 92}
            y2={1000}
            stroke={broken ? K.red : K.yellow}
            strokeWidth={3}
            strokeDasharray="10 10"
            strokeDashoffset={-frame * 3}
            opacity={0.5}
          />
        ))}
      </svg>
      {/* bandwidth meter */}
      <div style={{ position: "absolute", left: 120, right: 120, top: 600 }}>
        {[
          ["NEEDED", need, K.red, "60 Tbps"],
          ["SERVER CAN DO", 0.02, K.green, "0.1 Tbps"],
        ].map(([l, v, c, n], i) => (
          <div key={l as string} style={{ marginTop: i ? 22 : 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 26, color: c as string }}>
              <span>{l as string}</span>
              <span>{n as string}</span>
            </div>
            <div style={{ height: 22, borderRadius: 11, border: `3px solid ${c}`, marginTop: 6, overflow: "hidden" }}>
              <div style={{ width: `${(v as number) * 100}%`, height: "100%", background: c as string }} />
            </div>
          </div>
        ))}
      </div>
      <PhoneGrid y={1000} state={() => (broken ? "#1A2647" : PITCH)} spin={broken} />
      <Stamp text="BUFFERING…" x={540} y={1530} at={cue(0.62)} size={72} />
      <Sfx at={fail} src="onion/thud.wav" volume={0.6} />
    </S>
  );
};

// ===========================================================================
// 4. CDN: copies near every city

const CITIES = ["DELHI", "PATNA", "KOLKATA", "GUWAHATI", "CHENNAI", "BENGALURU", "MUMBAI", "JAIPUR"];
const cityPos = (i: number): [number, number] => {
  const a = -Math.PI / 2 + (i / CITIES.length) * Math.PI * 2;
  return [540 + Math.cos(a) * 360, 960 + Math.sin(a) * 470];
};

export const Cdn: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  return (
    <S
      section="FIX 1 · PAAS MEIN SERVER"
      hud={<Called name="CDN" sub="Content Delivery Network" at={cue(0.82)} y={1500} />}
      keys={[
        { t: 0, x: 540, y: 960, z: 1.9, rx: 52, rz: -30 },
        { t: 0.45, x: 540, y: 960, z: 1.2, rx: 48, rz: 10, ease: "io" },
        { t: 0.62, x: 820, y: 700, z: 1.6, rx: 35, rz: 20, ease: "io" },
        { t: 0.7, x: 230, y: 1250, z: 1.6, rx: 35, rz: 24, ease: "snap" },
        { t: 0.84, x: 540, y: 960, z: 0.92, rx: 0, rz: 0, ease: "io" },
        { t: 1, z: 0.96, ease: "lin" },
      ]}
    >
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {CITIES.map((_, i) => {
          const [x, y] = cityPos(i);
          const p = interpolate(frame, [cue(0.08 + i * 0.03), cue(0.2 + i * 0.03)], [0, 1], clamp);
          return (
            <line key={i} x1={540} y1={960} x2={540 + (x - 540) * p} y2={960 + (y - 960) * p} stroke={K.yellow} strokeWidth={4} strokeDasharray="12 10" strokeDashoffset={-frame * 2} />
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 540 - 90, top: 960 - 90, width: 180, height: 180, borderRadius: 90, border: `5px solid ${K.yellow}`, background: K.panel, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 26, color: K.yellow, textAlign: "center", boxShadow: "0 0 50px rgba(255,201,40,0.4)" }}>
        ORIGIN
        <br />
        STADIUM
      </div>
      {CITIES.map((c, i) => {
        const [x, y] = cityPos(i);
        const e = useEnter(cue(0.18 + i * 0.03), { damping: 11, stiffness: 220 });
        return (
          <React.Fragment key={c}>
            {/* viewers gathered around their city's edge server */}
            {new Array(12).fill(0).map((_, k) => {
              const a = random(`ca${i}${k}`) * Math.PI * 2;
              const r = 80 + random(`cr${i}${k}`) * 70;
              const at = cue(0.45 + random(`ct${i}${k}`) * 0.2);
              const v = interpolate(frame, [at, at + 8], [0, 1], clamp);
              return (
                <div key={k} style={{ position: "absolute", left: x + Math.cos(a) * r - 7, top: y + Math.sin(a) * r - 7, width: 14, height: 14, borderRadius: 7, background: K.white, opacity: 0.85 * v, transform: `scale(${v})` }} />
              );
            })}
            <div
              style={{
                position: "absolute",
                left: x - 60,
                top: y - 40,
                width: 120,
                height: 80,
                borderRadius: 12,
                border: `4px solid ${K.green}`,
                background: K.panel,
                opacity: e,
                transform: `scale(${e})`,
                boxShadow: "0 0 30px rgba(61,220,151,0.35)",
              }}
            />
            <div style={{ position: "absolute", left: x - 120, width: 240, top: y + 48, textAlign: "center", fontFamily: MONO, fontSize: 24, letterSpacing: 2, color: K.green, opacity: e }}>
              {c}
            </div>
          </React.Fragment>
        );
      })}
      {CITIES.map((_, i) => (
        <Sfx key={i} at={cue(0.18 + i * 0.03)} src="onion/tick.wav" volume={0.25} />
      ))}
      <Sfx at={cue(0.82)} src="onion/sparkle.wav" volume={0.45} />
    </S>
  );
};

// ===========================================================================
// 5. 4-second chunks, fetched once, served lakhs of times

export const Chunks: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const miss = cue(0.22);
  const back = cue(0.36);
  const fan = cue(0.42);
  const served = interpolate(frame, [fan, cue(0.75)], [1, 500000], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <S
      section="FIX 2 · TUKDE"
      hud={<Called name="Caching" sub="ek baar lao, laakhon ko do" at={cue(0.8)} y={1500} />}
      keys={[
        { t: 0, x: 540, y: 380, z: 1.6, ry: -14 },
        { t: 0.18, x: 540, y: 420, z: 1.4, ry: 0, ease: "io" },
        { t: 0.3, x: 540, y: 700, z: 1.7, ease: "io" },
        { t: 0.4, x: 540, y: 760, z: 2.1, ease: "snap" },
        { t: 0.6, x: 540, y: 1020, z: 1.05, rx: 34, ease: "io" },
        { t: 0.82, x: 540, y: 960, z: 1.0, rx: 0, ease: "io" },
        { t: 1, z: 1.04, ease: "lin" },
      ]}
    >
      {/* live feed cut into chunks, scrolling like a film strip */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 260, height: 210, borderRadius: 16, border: `3px solid ${K.edge}`, background: "rgba(5,11,28,0.95)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 24, top: 14, fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: K.mute }}>ORIGIN · LIVE FEED</div>
        {new Array(8).fill(0).map((_, i) => {
          const x = ((i * 230 - frame * 2) % 1840 + 1840) % 1840 - 230;
          const n = 1041 + i;
          const hot = n === 1043;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: 60,
                width: 210,
                height: 126,
                borderRadius: 10,
                border: `3px solid ${hot ? K.yellow : K.edge}`,
                background: hot ? "rgba(255,201,40,0.12)" : K.panel,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                color: hot ? K.yellow : K.white,
              }}
            >
              <div style={{ fontSize: 22, color: K.mute }}>4 SEC</div>
              <div style={{ fontSize: 30 }}>seg_{n}</div>
            </div>
          );
        })}
      </div>
      <Server x={290} y={640} w={500} h={240} label="EDGE · PATNA" sub={frame >= back ? "seg_1043 ✓" : "cache: empty"} color={frame >= back ? K.green : K.yellow} />
      <Packet a={[540, 1080]} b={[540, 880]} s={cue(0.1)} e={miss} color={K.white} />
      <Packet a={[540, 640]} b={[540, 470]} s={miss + 2} e={cue(0.29)} color={K.red} />
      <Packet a={[540, 470]} b={[540, 640]} s={cue(0.29)} e={back} color={K.yellow} size={30} />
      <Tag text="Miss → origin se lao" x={810} y={600} at={miss} color={K.red} size={24} />
      {/* fan out to everyone in the city */}
      {new Array(40).fill(0).map((_, i) => {
        const c = i % 10;
        const r = Math.floor(i / 10);
        const target: [number, number] = [126 + c * 92, 1110 + r * 70];
        const s = fan + random(`cf${i}`) * cue(0.25);
        return <Packet key={i} a={[540, 880]} b={target} s={s} e={s + 12} color={K.green} size={16} />;
      })}
      {new Array(40).fill(0).map((_, i) => {
        const c = i % 10;
        const r = Math.floor(i / 10);
        const got = frame > fan + random(`cf${i}`) * cue(0.25) + 12;
        return <div key={i} style={{ position: "absolute", left: 126 + c * 92 - 9, top: 1110 + r * 70 - 9, width: 18, height: 18, borderRadius: 9, background: got ? K.green : K.white, opacity: got ? 1 : 0.5 }} />;
      })}
      <div style={{ position: "absolute", left: 70, right: 70, top: 1390, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 28, opacity: useEnter(fan) }}>
        <span style={{ color: K.yellow }}>ORIGIN SE: 1 BAAR</span>
        <span style={{ color: K.green }}>USERS KO: {inr(served)}</span>
      </div>
      <Sfx at={miss} src="onion/tick.wav" volume={0.5} />
      <Sfx at={back} src="sfx/pop.wav" volume={0.5} />
      <Sfx at={cue(0.8)} src="onion/sparkle.wav" volume={0.45} />
    </S>
  );
};

// ===========================================================================
// 6. Adaptive bitrate: into the tunnel, quality drops, video keeps playing

const LADDER = ["1080p", "720p", "480p", "240p"];

export const Abr: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const net = interpolate(frame, [cue(0.25), cue(0.55)], [4, 1.3], clamp); // signal bars
  const level = net > 3.4 ? 0 : net > 2.5 ? 1 : 2;
  const tunnel = interpolate(frame, [cue(0.15), cue(0.5)], [0, 1], { ...clamp, easing: ease });
  return (
    <S
      section="FIX 3 · NETWORK KE HISAAB SE"
      hud={<Called name="Adaptive bitrate" sub="ruko mat, quality ghatao" at={cue(0.8)} y={1500} />}
      keys={[
        { t: 0, x: 400, y: 1240, z: 1.7, ry: 16 },
        { t: 0.22, x: 620, y: 1240, z: 1.55, ry: 6, ease: "lin" },
        { t: 0.34, x: 540, y: 660, z: 1.25, ry: 0, ease: "io" },
        { t: 0.55, x: 680, y: 450, z: 1.9, ease: "io" },
        { t: 0.66, x: 540, y: 1030, z: 1.5, ease: "snap" },
        { t: 0.82, x: 540, y: 960, z: 1.0, ease: "io" },
        { t: 1, z: 1.04, ease: "lin" },
      ]}
    >
      <Phone x={290} y={300} w={500} h={700}>
        <div style={{ position: "absolute", left: 24, top: 60, display: "flex", gap: 6, alignItems: "flex-end" }}>
          {[1, 2, 3, 4].map((b) => (
            <div key={b} style={{ width: 12, height: 10 + b * 8, background: b <= net ? K.white : "#2A3A63", borderRadius: 2 }} />
          ))}
        </div>
        <div style={{ position: "absolute", right: 24, top: 56, padding: "4px 12px", border: `3px solid ${level ? K.yellow : K.green}`, color: level ? K.yellow : K.green, fontFamily: MONO, fontSize: 24 }}>
          {LADDER[level]}
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, top: 110, borderRadius: 14, overflow: "hidden" }}>
          <Pitch w={440} h={460} blur={level * 2.2} />
        </div>
        <div style={{ position: "absolute", left: 24, top: 600, fontFamily: MONO, fontSize: 26, color: K.green }}>▶ playing · no buffering</div>
      </Phone>
      {/* quality ladder */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 1030, display: "flex", justifyContent: "space-between" }}>
        {LADDER.map((q, i) => (
          <div
            key={q}
            style={{
              width: 200,
              padding: "12px 0",
              textAlign: "center",
              borderRadius: 12,
              border: `3px solid ${i === level ? K.yellow : K.edge}`,
              background: i === level ? K.yellow : K.panel,
              color: i === level ? K.navy0 : K.mute,
              fontFamily: MONO,
              fontSize: 28,
            }}
          >
            {q}
          </div>
        ))}
      </div>
      {/* train heading into a tunnel */}
      <svg width={1080} height={300} style={{ position: "absolute", left: 0, top: 1150 }}>
        <line x1={0} y1={250} x2={1080} y2={250} stroke={K.edge} strokeWidth={4} />
        <g transform={`translate(${-500 + tunnel * 760} 0)`}>
          {[0, 1].map((c) => (
            <g key={c} transform={`translate(${c * 300} 0)`}>
              <rect x={10} y={130} width={280} height={100} rx={12} fill={K.panel} stroke={K.yellow} strokeWidth={4} />
              {[0, 1, 2, 3].map((w) => (
                <rect key={w} x={34 + w * 62} y={150} width={42} height={30} rx={4} fill="rgba(255,201,40,0.35)" />
              ))}
              <circle cx={60} cy={236} r={13} fill={K.navy0} stroke={K.yellow} strokeWidth={4} />
              <circle cx={240} cy={236} r={13} fill={K.navy0} stroke={K.yellow} strokeWidth={4} />
            </g>
          ))}
        </g>
        <path d="M720 250 V120 Q720 40 860 40 Q1000 40 1000 120 V250 Z" fill="rgba(4,8,20,0.92)" stroke={K.mute} strokeWidth={6} />
        <rect x={1000} y={40} width={80} height={210} fill="rgba(4,8,20,0.92)" />
      </svg>
      <Tag text="Tunnel · network down" x={70} y={1100 + 330} at={cue(0.3)} color={K.red} size={26} />
      <Sfx at={cue(0.35)} src="onion/tick.wav" volume={0.4} />
      <Sfx at={cue(0.5)} src="onion/tick.wav" volume={0.4} />
      <Sfx at={cue(0.8)} src="onion/sparkle.wav" volume={0.45} />
    </S>
  );
};

// ===========================================================================
// 7 & 8. Wicket! Everyone rushes in at once; then request coalescing

const ORIGIN_C: [number, number] = [540, 400];
const EDGE_C: [number, number] = [540, 760];
const gridPt = (i: number): [number, number] => [126 + (i % 10) * 92, 1100 + Math.floor(i / 10) * 120];

export const Herd: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const wicket = useEnter(2, { damping: 8, stiffness: 240 });
  const expire = cue(0.45);
  const down = cue(0.66);
  const ttl = Math.max(0, 3 - Math.floor(interpolate(frame, [cue(0.3), expire], [0, 3.99], clamp)));
  const reqs = interpolate(frame, [cue(0.18), cue(0.4)], [0, 5000000], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <S
      section="THE CATCH"
      keys={[
        { t: 0, x: 540, y: 320, z: 2.0, shake: 26 },
        { t: 0.14, x: 540, y: 320, z: 1.7, shake: 0, ease: "out" },
        { t: 0.3, x: 540, y: 1180, z: 1.2, rx: 30, ease: "io" },
        { t: 0.42, x: 540, y: 760, z: 1.9, rx: 0, ease: "io" },
        { t: 0.6, x: 540, y: 600, z: 1.1, rx: 20, ease: "io" },
        { t: 0.67, x: 540, y: 520, z: 1.4, shake: 30, ease: "snap" },
        { t: 0.85, x: 540, y: 900, z: 0.98, rx: 0, shake: 6, ease: "io" },
        { t: 1, shake: 0, ease: "out" },
      ]}
    >
      <div style={{ position: "absolute", left: 0, width: 1080, top: 240, textAlign: "center", transform: `scale(${wicket})`, opacity: frame < cue(0.25) ? 1 : 0 }}>
        <span style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 150, color: K.red, textShadow: "0 0 50px rgba(255,77,94,0.6)" }}>WICKET!</span>
      </div>
      <Server x={340} y={300} w={400} h={200} label="MAIN SERVER" sub={frame >= down ? "DOWN" : "OK"} color={frame >= down ? K.red : K.yellow} at={cue(0.24)} dx={frame >= down ? Math.sin(frame * 2) * 6 : 0} />
      <Server x={290} y={640} w={500} h={240} label="EDGE · SCORECARD" sub={frame >= expire ? "EXPIRED" : `cache TTL 0:0${ttl}`} color={frame >= expire ? K.red : K.green} />
      <PhoneGrid
        y={1050}
        state={(i) => (frame > cue(0.18) + random(`ho${i}`) * cue(0.15) ? (frame >= down ? "#1A2647" : "#2F6BFF") : "#111A33")}
        spin={frame >= down}
      />
      <div style={{ position: "absolute", left: 0, width: 1080, top: 1560, textAlign: "center", fontFamily: MONO, fontSize: 30, color: K.yellow, opacity: useEnter(cue(0.18)) }}>
        {inr(reqs)} APP OPENS · SAME SECOND
      </div>
      {/* after expiry every request bypasses the edge */}
      {new Array(60).fill(0).map((_, i) => {
        const s = expire + random(`hs${i}`) * cue(0.2);
        const p = gridPt(i % 40);
        return <Packet key={i} a={p} b={[ORIGIN_C[0] + (random(`hx${i}`) - 0.5) * 300, ORIGIN_C[1] + 40]} s={s} e={s + 14} color={K.red} size={16} />;
      })}
      <Stamp text="SERVER GAYA" x={540} y={960} at={cue(0.72)} size={70} />
      <Sfx at={0} src="onion/thud.wav" volume={0.5} />
      <Sfx at={expire} src="onion/tick.wav" volume={0.5} />
      <Sfx at={down} src="onion/thud.wav" volume={0.6} />
    </S>
  );
};

export const Coalesce: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const up = cue(0.3);
  const top = cue(0.42);
  const back = cue(0.52);
  const waiting = Math.round(interpolate(frame, [cue(0.05), cue(0.28)], [0, 499999], clamp));
  const released = frame >= back;
  return (
    <S
      section="FIX 4 · EK JAAYE, SAB PAAYEIN"
      hud={<Called name="Request coalescing" sub="ek jaisi requests, ek hi baar" at={cue(0.8)} y={1500} />}
      keys={[
        { t: 0, x: 540, y: 1150, z: 1.5, rx: 34 },
        { t: 0.25, x: 540, y: 820, z: 1.6, rx: 10, ease: "io" },
        { t: 0.42, x: 540, y: 420, z: 1.7, rx: 0, ease: "io" },
        { t: 0.52, x: 540, y: 760, z: 1.5, ease: "snap" },
        { t: 0.68, x: 540, y: 1000, z: 1.05, rx: 26, ease: "io" },
        { t: 0.82, x: 540, y: 960, z: 1.0, rx: 0, ease: "io" },
        { t: 1, z: 1.04, ease: "lin" },
      ]}
    >
      <Server x={340} y={300} w={400} h={200} label="MAIN SERVER" sub={frame >= top ? "1 request ✓" : "OK"} color={K.green} />
      <Server x={290} y={640} w={500} h={240} label="EDGE · SCORECARD" sub={released ? "sabko bheja ✓" : `${inr(waiting)} waiting`} color={released ? K.green : K.yellow} />
      {/* everyone's request arrives and is held at the edge */}
      {new Array(40).fill(0).map((_, i) => {
        const s = cue(0.04) + random(`cs${i}`) * cue(0.2);
        return <Packet key={`u${i}`} a={gridPt(i)} b={[EDGE_C[0] + (random(`cx${i}`) - 0.5) * 380, EDGE_C[1] + 100]} s={s} e={s + 12} color={K.white} size={14} />;
      })}
      {/* exactly one goes upstream and back */}
      <Packet a={[540, 640]} b={[540, 500]} s={up} e={top} color={K.yellow} size={30} />
      <Packet a={[540, 500]} b={[540, 640]} s={top} e={back} color={K.green} size={30} />
      <Tag text="Sirf 1 upar gayi" x={780} y={560} at={up} size={24} />
      {/* answer fans out to everyone at once */}
      {new Array(40).fill(0).map((_, i) => (
        <Packet key={`d${i}`} a={[540, 880]} b={gridPt(i)} s={back + 2} e={back + 16 + (i % 6)} color={K.green} size={16} />
      ))}
      <PhoneGrid y={1050} state={() => (released && frame > back + 16 ? "#1E6B4C" : "#2F6BFF")} />
      <Sfx at={top} src="onion/tick.wav" volume={0.5} />
      <Sfx at={back} src="sfx/pop.wav" volume={0.6} />
      <Sfx at={cue(0.8)} src="onion/sparkle.wav" volume={0.45} />
    </S>
  );
};

// ===========================================================================
// 9. Recap

export const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const layers: [string, string, string][] = [
    ["01", "CDN", "server tumhare shehar mein"],
    ["02", "Caching", "ek baar lao, laakhon ko do"],
    ["03", "Adaptive bitrate", "network gire, video nahi"],
    ["04", "Request coalescing", "bheed mein ek hi request"],
  ];
  const step = [0.04, 0.2, 0.36, 0.52];
  return (
    <S
      section="OUR DESIGN"
      keys={[
        { t: 0, x: 540, y: 520, z: 1.6, rx: 50, rz: 20 },
        { t: 0.66, x: 540, y: 820, z: 1.02, rx: 40, rz: 10, ease: "lin" },
        { t: 0.8, x: 540, y: 960, z: 1.0, rx: 0, rz: 0, ease: "io" },
        { t: 1, z: 1.06, ease: "lin" },
      ]}
    >
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={130} y1={320} x2={130} y2={interpolate(frame, [cue(0.04), cue(0.66)], [320, 1240], clamp)} stroke={K.yellow} strokeWidth={4} strokeDasharray="12 10" strokeDashoffset={-frame * 2} />
      </svg>
      {layers.map(([n, title, sub], i) => {
        const e = useEnter(cue(step[i]), { damping: 13, stiffness: 190 });
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: 70,
              right: 140,
              top: 280 + i * 245,
              height: 205,
              borderRadius: 18,
              border: `4px solid ${K.yellow}`,
              background: K.panel,
              display: "flex",
              alignItems: "center",
              gap: 30,
              padding: "0 34px",
              opacity: e,
              transform: `translateX(${(1 - e) * 120}px)`,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 54, color: K.yellow }}>{n}</div>
            <div>
              <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 56, color: K.white, lineHeight: 1.1 }}>{title}</div>
              <div style={{ fontFamily: MONO, fontSize: 28, color: K.mute, marginTop: 6 }}>{sub}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1290, width: "100%", textAlign: "center", opacity: useEnter(cue(0.78)) }}>
        <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 120, color: K.green, lineHeight: 1 }}>0</div>
        <div style={{ fontFamily: MONO, fontSize: 32, letterSpacing: 5, color: K.white }}>BUFFERING · 3 CRORE LOG</div>
      </div>
      {step.map((s) => (
        <Sfx key={s} at={cue(s)} src="onion/tick.wav" volume={0.4} />
      ))}
      <Sfx at={cue(0.78)} src="onion/sparkle.wav" volume={0.5} />
    </S>
  );
};

// ===========================================================================
// 10. Your turn: 2-second or 10-second chunks?

export const Cta: React.FC = () => {
  const cue = useCue();
  const title = useEnter(2);
  const opts: [string, string, string, string, number][] = [
    ["2", K.yellow, "padosi se pehle chhakka", "server pe 5x requests", 0.22],
    ["10", K.red, "server pe kam load", "padosi pehle chillayega", 0.4],
  ];
  return (
    <S
      keys={[
        { t: 0, x: 540, y: 360, z: 1.5, rz: -2 },
        { t: 0.2, y: 700, z: 1.1, rz: 0, ease: "io" },
        { t: 0.55, y: 900, z: 1.05, ease: "lin" },
        { t: 0.66, y: 960, z: 1.0, ease: "io" },
        { t: 1, z: 1.1, ease: "lin" },
      ]}
    >
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 230,
          padding: "22px 40px",
          border: `3px solid ${K.white}`,
          borderRadius: 14,
          background: "rgba(8,17,42,0.92)",
          fontFamily: BOLD,
          fontWeight: 700,
          fontSize: 66,
          color: K.white,
          opacity: title,
          transform: `scale(${0.85 + 0.15 * title})`,
        }}
      >
        Ab stream <span style={{ color: K.yellow }}>tumhara</span> hai
      </div>
      <div style={{ position: "absolute", left: 70, top: 440, fontFamily: MONO, fontSize: 30, letterSpacing: 3, color: K.mute, opacity: useEnter(cue(0.1)) }}>
        VIDEO KE TUKDE KITNE SECOND KE?
      </div>
      {opts.map(([sec, col, pro, con, at], i) => {
        const e = useEnter(cue(at), { damping: 12, stiffness: 190 });
        return (
          <div
            key={sec}
            style={{
              position: "absolute",
              left: 70,
              right: 70,
              top: 520 + i * 330,
              height: 290,
              borderRadius: 18,
              border: `4px solid ${col}`,
              background: K.panel,
              display: "flex",
              alignItems: "center",
              gap: 36,
              padding: "0 40px",
              opacity: e,
              transform: `translateY(${(1 - e) * 50}px)`,
            }}
          >
            <div style={{ textAlign: "center", width: 190 }}>
              <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 160, color: col, lineHeight: 0.95 }}>{sec}</div>
              <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 4, color: col }}>SEC</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 30, color: K.green }}>+ {pro}</div>
              <div style={{ fontFamily: MONO, fontSize: 30, color: K.red }}>− {con}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1220, width: "100%", textAlign: "center", opacity: useEnter(cue(0.7)) }}>
        <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 64, color: K.white }}>
          Comment karo — <span style={{ color: K.yellow }}>wajah ke saath</span>
        </div>
      </div>
      <Sfx at={cue(0.22)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.4)} src="sfx/pop.wav" volume={0.45} />
    </S>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  ask: Ask,
  crash: Crash,
  cdn: Cdn,
  chunks: Chunks,
  abr: Abr,
  herd: Herd,
  coalesce: Coalesce,
  recap: Recap,
  cta: Cta,
};
