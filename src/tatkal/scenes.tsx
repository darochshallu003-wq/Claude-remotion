import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { clamp, useCue, useEnter } from "../onion/components";
import { MONO } from "../onion/theme";
import { Sfx } from "../mitti/kraft";
import { BlueprintBg, BOLD, Called, Header, inr, K, Lock, Phone, Stamp, Tag } from "./kit";

const ease = Easing.inOut(Easing.cubic);

// ===========================================================================
// 1. 09:59:57 → 10:00:00, and ten lakh people arrive at once

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const open = cue(0.4);
  const step = open / 3;
  const sec = Math.min(60, 57 + Math.floor(frame / step));
  const isOpen = frame >= open;
  const time = isOpen ? "10:00:00" : `09:59:${String(sec).padStart(2, "0")}`;
  const flash = interpolate(frame - open, [0, 4, 18], [0, 1, 0], clamp);
  const users = interpolate(frame, [open, cue(0.95)], [0, 1000000], { ...clamp, easing: Easing.out(Easing.cubic) });
  const pulse = isOpen ? 1 + 0.05 * Math.sin((frame - open) / 3) : 1;

  return (
    <AbsoluteFill>
      <BlueprintBg />
      <Header />
      <Tag text="AC Tatkal · opens at" x={540} y={250} center at={4} />
      <div
        style={{
          position: "absolute",
          top: 330,
          width: "100%",
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 150,
          letterSpacing: 4,
          color: isOpen ? K.yellow : K.white,
          textShadow: isOpen ? `0 0 ${30 + 40 * flash}px rgba(255,201,40,0.7)` : "none",
        }}
      >
        {time}
      </div>

      {/* people converging on the phone */}
      {new Array(220).fill(0).map((_, i) => {
        const a = random(`a${i}`) * Math.PI * 2;
        const start = open + random(`s${i}`) * cue(0.5);
        const t = interpolate(frame, [start, start + 26], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
        if (t <= 0 || t >= 1) return null;
        const r = 1100 * (1 - t) + 120;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + Math.cos(a) * r - 7,
              top: 990 + Math.sin(a) * r * 1.2 - 7,
              width: 14,
              height: 14,
              borderRadius: 7,
              background: K.white,
              opacity: 0.85,
              boxShadow: "0 0 10px rgba(234,240,255,0.7)",
            }}
          />
        );
      })}

      <Phone x={330} y={640} w={420} h={700}>
        <div style={{ padding: "70px 34px 0", fontFamily: MONO, color: K.white }}>
          <div style={{ fontSize: 26, color: K.mute, letterSpacing: 2 }}>NDLS → HWH</div>
          <div style={{ fontSize: 34, marginTop: 10 }}>Rajdhani Exp</div>
          <div style={{ fontSize: 24, color: K.mute, marginTop: 6 }}>3A · TATKAL</div>
          <div style={{ marginTop: 40, display: "flex", justifyContent: "space-between", fontSize: 26 }}>
            <span>AVL</span>
            <span style={{ color: K.green }}>300</span>
          </div>
          <div style={{ height: 2, background: K.edge, margin: "20px 0" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 34,
            right: 34,
            bottom: 70,
            height: 104,
            borderRadius: 18,
            background: isOpen ? K.yellow : "#26355C",
            color: isOpen ? K.navy0 : K.mute,
            fontFamily: BOLD,
            fontWeight: 700,
            fontSize: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${pulse})`,
            boxShadow: isOpen ? "0 0 40px rgba(255,201,40,0.55)" : "none",
          }}
        >
          BOOK NOW
        </div>
      </Phone>

      <div style={{ position: "absolute", top: 1400, width: "100%", textAlign: "center", opacity: isOpen ? 1 : 0 }}>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 5, color: K.mute }}>USERS ONLINE</div>
        <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 96, color: K.white }}>{inr(users)}</div>
      </div>
      <Sfx at={0} src="onion/tick.wav" volume={0.4} />
      <Sfx at={Math.round(step)} src="onion/tick.wav" volume={0.4} />
      <Sfx at={Math.round(step * 2)} src="onion/tick.wav" volume={0.4} />
      <Sfx at={open} src="sfx/pop.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 2. The interview question

const Train: React.FC<{ progress: number }> = ({ progress }) => (
  <svg width={1080} height={260} style={{ position: "absolute", left: 0, top: 1240 }}>
    <line x1={0} y1={210} x2={1080} y2={210} stroke={K.edge} strokeWidth={4} />
    {new Array(28).fill(0).map((_, i) => (
      <line key={i} x1={i * 40} y1={210} x2={i * 40 + 16} y2={226} stroke={K.edge} strokeWidth={3} />
    ))}
    <g transform={`translate(${-900 + progress * 1000} 0)`}>
      {[0, 1, 2].map((c) => (
        <g key={c} transform={`translate(${c * 300} 0)`}>
          <rect x={10} y={80} width={280} height={110} rx={10} fill="none" stroke={K.yellow} strokeWidth={4} />
          {[0, 1, 2, 3, 4].map((w) => (
            <rect key={w} x={30 + w * 52} y={100} width={36} height={30} rx={4} fill="none" stroke={K.yellow} strokeWidth={3} opacity={0.7} />
          ))}
          <circle cx={60} cy={196} r={14} fill={K.navy0} stroke={K.yellow} strokeWidth={4} />
          <circle cx={240} cy={196} r={14} fill={K.navy0} stroke={K.yellow} strokeWidth={4} />
        </g>
      ))}
      <path d="M910 190 V100 Q910 80 930 80 H1010 Q1060 80 1080 150 V190 Z" fill="none" stroke={K.yellow} strokeWidth={4} />
      <circle cx={960} cy={196} r={14} fill={K.navy0} stroke={K.yellow} strokeWidth={4} />
      <circle cx={1040} cy={196} r={14} fill={K.navy0} stroke={K.yellow} strokeWidth={4} />
    </g>
  </svg>
);

export const Ask: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const card = useEnter(2);
  const stats: [string, string][] = [
    ["1", "TRAIN"],
    ["300", "SEATS"],
    ["10 LAKH", "USERS"],
    ["60 SEC", "TO SELL OUT"],
  ];
  return (
    <AbsoluteFill>
      <BlueprintBg />
      <Header section="THE QUESTION" />
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
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: K.yellow }}>SDE-2 INTERVIEW · ROUND 1</div>
        <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 70, lineHeight: 1.15, color: K.white, marginTop: 12 }}>
          Design a <span style={{ color: K.yellow }}>Tatkal</span> booking system.
        </div>
      </div>
      {stats.map(([big, small], i) => {
        const e = useEnter(cue(0.18 + i * 0.12), { damping: 12, stiffness: 200 });
        const col = i % 2;
        const row = Math.floor(i / 2);
        return (
          <div
            key={small}
            style={{
              position: "absolute",
              left: 70 + col * 480,
              top: 690 + row * 250,
              width: 460,
              height: 220,
              borderRadius: 16,
              border: `3px solid ${i === 2 ? K.red : K.edge}`,
              background: "rgba(13,27,62,0.92)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              opacity: e,
              transform: `scale(${0.7 + 0.3 * e})`,
            }}
          >
            <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 88, color: i === 2 ? K.red : K.white, lineHeight: 1 }}>{big}</div>
            <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 5, color: K.mute, marginTop: 14 }}>{small}</div>
          </div>
        );
      })}
      <Train progress={interpolate(frame, [0, cue(1)], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) })} />
      {[0.18, 0.3, 0.42, 0.54].map((f) => (
        <Sfx key={f} at={cue(f)} src="onion/tick.wav" volume={0.35} />
      ))}
    </AbsoluteFill>
  );
};

// ===========================================================================
// 3. Naive design: everyone hits the database

const Database: React.FC<{ x: number; y: number; load: number; shake?: number }> = ({ x, y, load, shake = 0 }) => {
  const frame = useCurrentFrame();
  const hot = load > 0.85;
  const col = hot ? K.red : K.yellow;
  const dx = shake * Math.sin(frame * 2.3) * 8;
  return (
    <div style={{ position: "absolute", left: x + dx, top: y }}>
      <svg width={300} height={380} viewBox="0 0 300 380">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(0 ${i * 100})`}>
            <path d="M20 60 V140 A130 40 0 0 0 280 140 V60" fill={K.panel} stroke={col} strokeWidth={6} />
            <ellipse cx={150} cy={60} rx={130} ry={40} fill={K.panel} stroke={col} strokeWidth={6} />
          </g>
        ))}
      </svg>
      <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 30, color: col, letterSpacing: 3 }}>DATABASE</div>
      <div style={{ marginTop: 16, width: 300, height: 26, borderRadius: 13, border: `3px solid ${col}`, overflow: "hidden" }}>
        <div style={{ width: `${load * 100}%`, height: "100%", background: col }} />
      </div>
      <div style={{ textAlign: "center", fontFamily: MONO, fontSize: 28, color: col, marginTop: 10 }}>CPU {Math.round(load * 100)}%</div>
    </div>
  );
};

export const Crash: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const melt = cue(0.55);
  const load = interpolate(frame, [cue(0.05), melt], [0.08, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const broken = frame >= melt;
  return (
    <AbsoluteFill>
      <BlueprintBg />
      <Header section="NAIVE DESIGN" />
      {/* request streams */}
      {new Array(70).fill(0).map((_, i) => {
        const y0 = 420 + random(`y${i}`) * 820;
        const period = 34 + random(`p${i}`) * 20;
        const t = ((frame + random(`o${i}`) * period) % period) / period;
        const density = interpolate(frame, [0, melt], [0.25, 1], clamp);
        if (random(`d${i}`) > density) return null;
        const x = 70 + t * 520;
        const y = y0 + (720 - y0) * t * 0.85;
        const bounced = broken && t > 0.6;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: bounced ? 590 - (t - 0.6) * 500 : x,
              top: y,
              width: 16,
              height: 16,
              borderRadius: 8,
              background: bounced ? K.red : K.white,
              opacity: 0.85,
            }}
          />
        );
      })}
      <Database x={640} y={520} load={load} shake={broken ? 1 : 0} />
      <Tag text="Every user → DB" x={70} y={300} at={cue(0.05)} color={K.white} size={28} />
      {broken &&
        [0, 1, 2, 3, 4].map((i) => (
          <Tag
            key={i}
            text="timeout"
            x={70 + random(`tx${i}`) * 380}
            y={430 + i * 170 + random(`ty${i}`) * 40}
            at={melt + 4 + i * 5}
            color={K.red}
            size={26}
          />
        ))}
      <Stamp text="SERVER DOWN" x={540} y={1360} at={cue(0.72)} />
      <Sfx at={melt} src="onion/thud.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 4. Virtual waiting room

const SNAKE: [number, number][] = [
  [540, 760],
  [540, 860],
  [880, 860],
  [880, 1010],
  [180, 1010],
  [180, 1160],
  [880, 1160],
  [880, 1310],
  [180, 1310],
];

const along = (s: number): [number, number] => {
  let rest = s;
  for (let i = 0; i < SNAKE.length - 1; i++) {
    const [x1, y1] = SNAKE[i];
    const [x2, y2] = SNAKE[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (rest <= len) return [x1 + ((x2 - x1) * rest) / len, y1 + ((y2 - y1) * rest) / len];
    rest -= len;
  }
  return SNAKE[SNAKE.length - 1];
};

export const Queue: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const gap = 46;
  const flow = frame * 1.6; // how far the line has moved
  const youIndex = 30;
  const server = useEnter(4);
  const path = SNAKE.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
  return (
    <AbsoluteFill>
      <BlueprintBg />
      <Header section="FIX 1 · THE LINE" />
      <div
        style={{
          position: "absolute",
          left: 290,
          top: 300,
          width: 500,
          height: 220,
          borderRadius: 18,
          border: `4px solid ${K.green}`,
          background: K.panel,
          opacity: server,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 4, color: K.green }}>BOOKING SERVER</div>
        <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 52, color: K.white, marginTop: 8 }}>CPU 62% · OK</div>
      </div>
      {/* gate */}
      <div style={{ position: "absolute", left: 430, top: 700, width: 220, height: 12, background: K.yellow, borderRadius: 6 }} />
      <Tag text="Admit 2,000 / sec" x={680} y={672} at={cue(0.12)} size={24} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={path} fill="none" stroke={K.edge} strokeWidth={60} strokeLinejoin="round" opacity={0.25} />
        <path d="M540 700 V530" stroke={K.green} strokeWidth={4} strokeDasharray="10 12" />
      </svg>
      {new Array(80).fill(0).map((_, i) => {
        const s = 100 + i * gap - flow;
        const you = i === youIndex;
        let x: number;
        let y: number;
        let o = 1;
        if (s >= 0) {
          [x, y] = along(s);
        } else {
          // admitted: rise from the gate into the server
          const t = Math.min(1, -s / 200);
          x = 540;
          y = 760 - t * 260;
          o = 1 - t;
        }
        if (o <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - (you ? 16 : 11),
              top: y - (you ? 16 : 11),
              width: you ? 32 : 22,
              height: you ? 32 : 22,
              borderRadius: 20,
              background: you ? K.yellow : K.white,
              opacity: o * (you ? 1 : 0.8),
              boxShadow: you ? "0 0 24px rgba(255,201,40,0.9)" : "none",
            }}
          />
        );
      })}
      {(() => {
        const s = 100 + youIndex * gap - flow;
        const [x, y] = along(Math.max(0, s));
        const e = useEnter(cue(0.3));
        return (
          <div style={{ position: "absolute", left: x - 40, top: y - 84, opacity: e * (s > 0 ? 1 : 0) }}>
            <div style={{ padding: "6px 14px", background: K.yellow, color: K.navy0, fontFamily: MONO, fontSize: 24, whiteSpace: "nowrap" }}>
              YOU · TOKEN #48,213
            </div>
          </div>
        );
      })()}
      <Called name="Virtual waiting room" sub="sab andar nahi, line se andar" at={cue(0.78)} />
      <Sfx at={cue(0.78)} src="onion/sparkle.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 5 & 6. Seat map with a hold timer

const COLS = 6;
const ROWS = 8;
const SEAT = 84;
const GAP = 18;
const GX = (1080 - (COLS * SEAT + (COLS - 1) * GAP)) / 2;
const GY = 330;
const MY_SEAT = 32;

const seatPos = (n: number): [number, number] => {
  const i = n - 1;
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  return [GX + c * (SEAT + GAP) + (c >= 3 ? 30 : 0) - 15, GY + r * (SEAT + GAP)];
};

const booked = (n: number) => n !== MY_SEAT && random(`seat${n}`) < 0.72;

const SeatMap: React.FC<{ mine: number; lockOpen?: number; heldBy?: string; free?: number }> = ({
  mine,
  lockOpen = 0,
  heldBy = K.yellow,
  free = 0,
}) => (
  <>
    <div style={{ position: "absolute", left: GX - 15, top: GY - 64, fontFamily: MONO, fontSize: 28, letterSpacing: 4, color: K.mute }}>
      COACH B4 · 3A
    </div>
    {new Array(COLS * ROWS).fill(0).map((_, k) => {
      const n = k + 1;
      const [x, y] = seatPos(n);
      const isMine = n === MY_SEAT;
      const taken = booked(n);
      const fill = isMine ? (free > 0 ? K.green : heldBy) : taken ? "#2A3A63" : "transparent";
      const show = isMine ? Math.max(mine, free) : 1;
      return (
        <div
          key={n}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: SEAT,
            height: SEAT,
            borderRadius: 12,
            border: `3px solid ${isMine && show > 0 ? fill : taken ? "#2A3A63" : K.green}`,
            background: isMine ? `rgba(0,0,0,0)` : fill,
            boxShadow: isMine && show > 0 ? `0 0 ${30 * show}px ${fill}` : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: MONO,
            fontSize: 26,
            color: taken ? "#51628F" : K.green,
          }}
        >
          {isMine ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 9,
                background: show > 0 ? fill : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${0.6 + 0.4 * show})`,
              }}
            >
              {show > 0 && free === 0 ? <Lock size={50} color={K.navy0} open={lockOpen} /> : <span style={{ color: show > 0 ? K.navy0 : K.green }}>{n}</span>}
            </div>
          ) : (
            n
          )}
        </div>
      );
    })}
  </>
);

const Timer: React.FC<{ left: number; color: string; x: number; y: number }> = ({ left, color, x, y }) => {
  const m = Math.floor(left / 60);
  const s = Math.floor(left % 60);
  const R = 62;
  const circ = 2 * Math.PI * R;
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 30 }}>
      <svg width={150} height={150}>
        <circle cx={75} cy={75} r={R} fill="none" stroke="#24345E" strokeWidth={12} />
        <circle
          cx={75}
          cy={75}
          r={R}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - left / 300)}
          transform="rotate(-90 75 75)"
          strokeLinecap="round"
        />
      </svg>
      <div>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: K.mute }}>SEAT 32 · HELD FOR YOU</div>
        <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 92, color, lineHeight: 1.05 }}>
          {m}:{String(s).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
};

export const Hold: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const pick = cue(0.3);
  const mine = useEnter(pick, { damping: 10, stiffness: 200 });
  const left = 300 - Math.max(0, frame - pick) / 30;
  const timerIn = useEnter(cue(0.52));
  return (
    <AbsoluteFill>
      <BlueprintBg />
      <Header section="FIX 2 · HOLD THE SEAT" />
      <SeatMap mine={frame >= pick ? mine : 0} />
      <div style={{ opacity: timerIn }}>
        <Timer left={left} color={K.yellow} x={150} y={1170} />
      </div>
      <Called name="Lock + TTL" sub="time-to-live · 5 min ka timer" at={cue(0.82)} />
      <Sfx at={pick} src="onion/tick.wav" volume={0.55} />
      <Sfx at={cue(0.82)} src="onion/sparkle.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const Expire: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const end = cue(0.35);
  const left = interpolate(frame, [0, end], [182, 0], { ...clamp, easing: Easing.in(Easing.quad) });
  const release = cue(0.45);
  const lockOpen = interpolate(frame, [end, release], [0, 1], clamp);
  const free = frame >= release ? 1 : 0;
  // the next person in line walks into the seat
  const [sx, sy] = seatPos(MY_SEAT);
  const walk = interpolate(frame, [cue(0.6), cue(0.85)], [0, 1], { ...clamp, easing: ease });
  const taken = frame >= cue(0.85);
  return (
    <AbsoluteFill>
      <BlueprintBg />
      <Header section="FIX 2 · TIMER RUNS OUT" />
      <SeatMap mine={1} lockOpen={lockOpen} heldBy={frame >= end ? K.red : K.yellow} free={taken ? 0 : free} />
      {taken && (
        <div
          style={{
            position: "absolute",
            left: sx,
            top: sy,
            width: SEAT,
            height: SEAT,
            borderRadius: 12,
            background: K.pink,
            boxShadow: `0 0 30px ${K.pink}`,
          }}
        />
      )}
      {!taken && walk > 0 && (
        <div
          style={{
            position: "absolute",
            left: interpolate(walk, [0, 1], [540, sx + SEAT / 2]) - 16,
            top: interpolate(walk, [0, 1], [1500, sy + SEAT / 2]) - 16,
            width: 32,
            height: 32,
            borderRadius: 16,
            background: K.pink,
            boxShadow: `0 0 24px ${K.pink}`,
          }}
        />
      )}
      <Timer left={left} color={frame >= end ? K.red : K.yellow} x={150} y={1170} />
      <Tag text="Payment nahi hua" x={540} y={1360} center at={end} color={K.red} size={30} />
      <Tag text="Next in line →" x={540} y={1450} center at={cue(0.58)} color={K.pink} size={30} />
      <Sfx at={end} src="onion/thud.wav" volume={0.5} />
      <Sfx at={cue(0.85)} src="sfx/pop.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 7. Two people, one seat, same millisecond

const BigSeat: React.FC<{ x: number; y: number; children?: React.ReactNode; color?: string }> = ({ x, y, children, color = K.green }) => (
  <div
    style={{
      position: "absolute",
      left: x - 130,
      top: y - 130,
      width: 260,
      height: 260,
      borderRadius: 30,
      border: `6px solid ${color}`,
      background: K.panel,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: BOLD,
      fontWeight: 700,
      fontSize: 110,
      color,
    }}
  >
    {children}
  </div>
);

const Person: React.FC<{ x: number; y: number; color: string; name: string; at: number }> = ({ x, y, color, name, at }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: x - 90, top: y, width: 180, textAlign: "center", opacity: e, transform: `translateY(${(1 - e) * 40}px)` }}>
      <svg width={120} height={140} viewBox="0 0 120 140">
        <circle cx={60} cy={38} r={30} fill="none" stroke={color} strokeWidth={7} />
        <path d="M10 136 Q10 80 60 80 Q110 80 110 136" fill="none" stroke={color} strokeWidth={7} />
      </svg>
      <div style={{ fontFamily: MONO, fontSize: 32, color, letterSpacing: 3 }}>{name}</div>
    </div>
  );
};

export const Race: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const go = cue(0.32);
  const hit = cue(0.55);
  const p = interpolate(frame, [go, hit], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const seat: [number, number] = [540, 640];
  const A: [number, number] = [210, 1130];
  const B: [number, number] = [830, 1130];
  const line = (from: [number, number], color: string) => (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={from[0] + (seat[0] - from[0]) * p * 0.82}
      y2={from[1] + (seat[1] + 120 - from[1]) * p * 0.82}
      stroke={color}
      strokeWidth={8}
      strokeDasharray="18 14"
      strokeDashoffset={-frame * 2}
    />
  );
  return (
    <AbsoluteFill>
      <BlueprintBg />
      <Header section="THE CATCH" />
      <BigSeat x={seat[0]} y={seat[1]} color={frame >= hit ? K.red : K.green}>
        32
      </BigSeat>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {line(A, K.yellow)}
        {line(B, K.pink)}
      </svg>
      <Person x={A[0]} y={A[1]} color={K.yellow} name="USER A" at={4} />
      <Person x={B[0]} y={B[1]} color={K.pink} name="USER B" at={8} />
      <Tag text="10:00:03.412" x={A[0]} y={1340} center at={go} size={28} />
      <Tag text="10:00:03.412" x={B[0]} y={1340} center at={go} size={28} color={K.pink} />
      <Tag text="Booked ✓" x={260} y={420} center at={hit + 2} color={K.yellow} size={30} />
      <Tag text="Booked ✓" x={820} y={420} center at={hit + 6} color={K.pink} size={30} />
      <Stamp text="DOUBLE BOOKING" x={540} y={950} at={cue(0.75)} size={70} />
      <Sfx at={hit} src="onion/tick.wav" volume={0.6} />
      <Sfx at={cue(0.75)} src="onion/thud.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 8. Compare-and-set

export const Cas: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const code = useEnter(2);
  const hl = interpolate(frame, [cue(0.12), cue(0.28)], [0, 1], { ...clamp, easing: ease });
  const rows: [string, string, string, string, number][] = [
    ["USER A", "1 row updated", "Seat 32 is yours", K.green, 0.4],
    ["USER B", "0 rows updated", "Sorry, already taken", K.red, 0.55],
  ];
  const lines = ["UPDATE seats", "SET holder = :user", "WHERE seat_no = 32", "  AND holder IS NULL;"];
  return (
    <AbsoluteFill>
      <BlueprintBg />
      <Header section="FIX 3 · ONE SEAT, ONE WINNER" />
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 270,
          padding: "30px 40px",
          borderRadius: 16,
          border: `3px solid ${K.edge}`,
          background: "rgba(5,11,28,0.95)",
          fontFamily: MONO,
          fontSize: 44,
          lineHeight: 1.6,
          color: K.white,
          opacity: code,
          transform: `translateY(${(1 - code) * 30}px)`,
        }}
      >
        {lines.map((l, i) => (
          <div key={i} style={{ position: "relative", whiteSpace: "pre", color: i === 3 ? K.yellow : K.white }}>
            {i === 3 && (
              <div style={{ position: "absolute", left: 0, top: "12%", height: "76%", width: `${hl * 100}%`, background: "rgba(255,201,40,0.16)", borderRadius: 6 }} />
            )}
            {l}
          </div>
        ))}
      </div>
      <Tag text="sirf tab, jab seat abhi bhi khali ho" x={540} y={720} center at={cue(0.22)} size={28} />
      {rows.map(([who, res, msg, col, at], i) => {
        const e = useEnter(cue(at), { damping: 12, stiffness: 200 });
        return (
          <div
            key={who}
            style={{
              position: "absolute",
              left: 70,
              right: 70,
              top: 850 + i * 220,
              height: 190,
              borderRadius: 16,
              border: `4px solid ${col}`,
              background: K.panel,
              display: "flex",
              alignItems: "center",
              padding: "0 36px",
              gap: 30,
              opacity: e,
              transform: `translateX(${(1 - e) * (i ? 80 : -80)}px)`,
            }}
          >
            <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 96, color: col, width: 90, textAlign: "center" }}>{i ? "✕" : "✓"}</div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 3, color: K.mute }}>
                {who} · {res}
              </div>
              <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 52, color: K.white }}>{msg}</div>
            </div>
          </div>
        );
      })}
      <Called name="Compare-and-set" sub="check aur update, ek hi step mein" at={cue(0.74)} y={1340} />
      <Sfx at={cue(0.4)} src="sfx/pop.wav" volume={0.5} />
      <Sfx at={cue(0.55)} src="onion/thud.wav" volume={0.45} />
      <Sfx at={cue(0.74)} src="onion/sparkle.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 9. Idempotency key

export const Pay: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const taps = [cue(0.14), cue(0.22)];
  const arrive = [cue(0.38), cue(0.5)];
  const box = useEnter(4);
  const req = (i: number) => {
    const p = interpolate(frame, [taps[i], arrive[i]], [0, 1], { ...clamp, easing: ease });
    if (frame < taps[i] || frame > arrive[i] + 2) return null;
    const x = 540 + (i ? 120 : -120);
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x - 150,
          top: interpolate(p, [0, 1], [930, 560]),
          width: 300,
          padding: "10px 0",
          borderRadius: 12,
          background: K.navy0,
          border: `3px solid ${K.yellow}`,
          fontFamily: MONO,
          fontSize: 24,
          color: K.yellow,
          textAlign: "center",
        }}
      >
        POST /pay
        <br />
        key: tk-7f3a91
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <BlueprintBg />
      <Header section="FIX 4 · PAY ONLY ONCE" />
      <div
        style={{
          position: "absolute",
          left: 190,
          top: 290,
          width: 700,
          height: 250,
          borderRadius: 18,
          border: `4px solid ${K.edge}`,
          background: K.panel,
          opacity: box,
          padding: "26px 36px",
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 4, color: K.mute }}>PAYMENT SERVICE · SEEN KEYS</div>
        <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 34, color: frame >= arrive[0] ? K.green : "#3A4B78" }}>
          {frame >= arrive[0] ? "✓ tk-7f3a91 → ₹1,145 paid" : "— empty —"}
        </div>
      </div>
      {req(0)}
      {req(1)}
      <Tag text="₹1,145 debited ✓" x={250} y={560} at={arrive[0]} color={K.green} size={28} />
      <Stamp text="SAME KEY → IGNORED" x={540} y={720} at={arrive[1]} size={54} />
      <Phone x={340} y={960} w={400} h={520}>
        <div style={{ padding: "64px 32px 0", fontFamily: MONO, color: K.white }}>
          <div style={{ fontSize: 24, color: K.mute, letterSpacing: 2 }}>SEAT 32 · B4</div>
          <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 64, marginTop: 6 }}>₹1,145</div>
          <div style={{ fontSize: 22, color: K.red, marginTop: 6, opacity: frame > taps[0] && frame < arrive[0] ? 1 : 0 }}>loading… network slow</div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 32,
            right: 32,
            bottom: 60,
            height: 96,
            borderRadius: 16,
            background: K.yellow,
            color: K.navy0,
            fontFamily: BOLD,
            fontWeight: 700,
            fontSize: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          PAY
        </div>
        {taps.map((t, i) => {
          const r = interpolate(frame, [t, t + 16], [0, 1], clamp);
          if (r <= 0 || r >= 1) return null;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 200 - 120 * r,
                top: 400 - 120 * r,
                width: 240 * r,
                height: 240 * r,
                borderRadius: "50%",
                border: `5px solid ${K.white}`,
                opacity: 1 - r,
              }}
            />
          );
        })}
      </Phone>
      <Tag text="tap" x={790} y={1330} at={taps[0]} color={K.white} size={26} />
      <Tag text="tap again!" x={790} y={1390} at={taps[1]} color={K.red} size={26} />
      <Called name="Idempotency key" sub="same key = same payment" at={cue(0.78)} y={1500} />
      {taps.map((t) => (
        <Sfx key={t} at={t} src="onion/tick.wav" volume={0.6} />
      ))}
      <Sfx at={arrive[0]} src="sfx/pop.wav" volume={0.5} />
      <Sfx at={arrive[1]} src="onion/thud.wav" volume={0.5} />
      <Sfx at={cue(0.78)} src="onion/sparkle.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 10. The whole design, layer by layer

export const Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const layers: [string, string, string][] = [
    ["01", "Virtual waiting room", "kitne log andar aayein"],
    ["02", "Lock + TTL", "kab tak seat tumhari"],
    ["03", "Compare-and-set", "ek seat, ek winner"],
    ["04", "Idempotency key", "ek payment, ek baar"],
  ];
  const step = [0.04, 0.24, 0.42, 0.6];
  return (
    <AbsoluteFill>
      <BlueprintBg />
      <Header section="OUR DESIGN" />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line
          x1={130}
          y1={320}
          x2={130}
          y2={interpolate(frame, [cue(0.04), cue(0.7)], [320, 1240], clamp)}
          stroke={K.yellow}
          strokeWidth={4}
          strokeDasharray="12 10"
          strokeDashoffset={-frame * 2}
        />
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
              transform: `translateX(${(1 - e) * -120}px)`,
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
      <div style={{ position: "absolute", top: 1290, width: "100%", textAlign: "center", opacity: useEnter(cue(0.8)) }}>
        <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 150, color: K.green, lineHeight: 1 }}>0</div>
        <div style={{ fontFamily: MONO, fontSize: 32, letterSpacing: 5, color: K.white }}>SEATS SOLD TWICE</div>
      </div>
      {step.map((s) => (
        <Sfx key={s} at={cue(s)} src="onion/tick.wav" volume={0.4} />
      ))}
      <Sfx at={cue(0.8)} src="onion/sparkle.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 11. Your turn: how long should the lock last?

export const Cta: React.FC = () => {
  const cue = useCue();
  const title = useEnter(2);
  const opts: [string, string, string, string, number][] = [
    ["10", K.yellow, "kam payments fail", "par seats atki rehti hain", 0.2],
    ["2", K.red, "seats jaldi ghoomti", "par payment beech mein toote", 0.38],
  ];
  return (
    <AbsoluteFill>
      <BlueprintBg />
      <Header />
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
        Ab system <span style={{ color: K.yellow }}>tumhara</span> hai
      </div>
      <div style={{ position: "absolute", left: 70, top: 440, fontFamily: MONO, fontSize: 30, letterSpacing: 3, color: K.mute, opacity: useEnter(cue(0.1)) }}>
        SEAT LOCK KA TIMER KITNA?
      </div>
      {opts.map(([min, col, pro, con, at], i) => {
        const e = useEnter(cue(at), { damping: 12, stiffness: 190 });
        return (
          <div
            key={min}
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
              <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 160, color: col, lineHeight: 0.95 }}>{min}</div>
              <div style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 4, color: col }}>MIN</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontFamily: MONO, fontSize: 30, color: K.green }}>+ {pro}</div>
              <div style={{ fontFamily: MONO, fontSize: 30, color: K.red }}>− {con}</div>
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1220, width: "100%", textAlign: "center", opacity: useEnter(cue(0.6)) }}>
        <div style={{ fontFamily: BOLD, fontWeight: 700, fontSize: 64, color: K.white }}>
          Comment karo — <span style={{ color: K.yellow }}>wajah ke saath</span>
        </div>
      </div>
      <Sfx at={cue(0.2)} src="sfx/pop.wav" volume={0.45} />
      <Sfx at={cue(0.38)} src="sfx/pop.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  ask: Ask,
  crash: Crash,
  queue: Queue,
  hold: Hold,
  expire: Expire,
  race: Race,
  cas: Cas,
  pay: Pay,
  recap: Recap,
  cta: Cta,
};
