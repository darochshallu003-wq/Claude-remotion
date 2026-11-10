import React from "react";
import { AbsoluteFill, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";

// "Under the microscope" kit for the Krebs cycle explainer: soft green glow,
// drifting particles, frosted-glass panels, thin white pointer labels,
// carbon-ball molecules, a cycle wheel and a running scoreboard.

export const FONT = "Poppins";
loadFont({ family: FONT, url: staticFile("fonts/Poppins-Bold.woff2"), weight: "700" });

export const M = {
  deep: "#12201A",
  mid: "#2C4A37",
  glow: "#8FD3A1",
  white: "#F4FFF6",
  dim: "rgba(244,255,246,0.6)",
  glass: "rgba(255,255,255,0.09)",
  edge: "rgba(255,255,255,0.28)",
  carbon: "#2B2B2B",
  co2: "#C9D6CE",
  nadh: "#FF9F43",
  fadh: "#B48CFF",
  atp: "#FFD84D",
  water: "#6EC6F0",
  active: "#9BF7B5",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const usePop = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 150 } });
};

export const useCue = () => {
  const { durationInFrames } = useVideoConfig();
  return (f: number) => Math.round(f * durationInFrames);
};

export const fadeUp = (p: number): React.CSSProperties => ({
  opacity: interpolate(p, [0, 0.3], [0, 1], clamp),
  transform: `translateY(${(1 - p) * 30}px) scale(${0.85 + 0.15 * p})`,
});

export const MicroBg: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 60% at 50% 42%, ${M.mid} 0%, ${M.deep} 85%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <filter id="blur10">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        {Array.from({ length: 26 }).map((_, i) => {
          const x = (random(`bx${i}`) * 1180 + frame * (0.15 + random(`bv${i}`) * 0.3)) % 1180 - 50;
          const y = random(`by${i}`) * 1920 + Math.sin(frame / 40 + i) * 20;
          const r = 6 + random(`br${i}`) * 30;
          return <circle key={i} cx={x} cy={y} r={r} fill={M.glow} opacity={0.06 + random(`bo${i}`) * 0.1} filter={r > 18 ? "url(#blur10)" : undefined} />;
        })}
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)" }} />
    </AbsoluteFill>
  );
};

export const Glass: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties; r?: number }> = ({ children, style, r = 28 }) => (
  <div
    style={{
      background: M.glass,
      border: `2px solid ${M.edge}`,
      borderRadius: r,
      boxShadow: "0 10px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
      backdropFilter: "blur(6px)",
      boxSizing: "border-box",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Text: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 40,
  color = M.white,
  style,
}) => <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size, color, lineHeight: 1.15, ...style }}>{children}</div>;

/** Top title, like the reference: white bold text, plus a smaller step line. */
export const Title: React.FC<{ title?: string; sub?: string }> = ({ title = "Krebs Cycle", sub }) => {
  const p = usePop(0);
  const q = usePop(6);
  return (
    <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <Text size={62} style={{ ...fadeUp(p), textShadow: "0 4px 18px rgba(0,0,0,0.5)" }}>
        {title}
      </Text>
      {sub && (
        <div style={fadeUp(q)}>
          <Glass r={999} style={{ padding: "8px 28px" }}>
            <Text size={34} color={M.active}>
              {sub}
            </Text>
          </Glass>
        </div>
      )}
    </div>
  );
};

/** Pill for an enzyme or a note. */
export const Pill: React.FC<{ text: string; color?: string; size?: number; style?: React.CSSProperties }> = ({ text, color = M.white, size = 30, style }) => (
  <div
    style={{
      display: "inline-block",
      padding: `${size * 0.25}px ${size * 0.7}px`,
      borderRadius: 999,
      background: "rgba(0,0,0,0.35)",
      border: `2px solid ${color}`,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: size,
      color,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </div>
);

/** Thin pointer label: dot, line, text. */
export const Pointer: React.FC<{ x: number; y: number; tx: number; ty: number; text: string; delay: number; size?: number }> = ({
  x,
  y,
  tx,
  ty,
  text,
  delay,
  size = 32,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 12], [0, 1], clamp);
  const o = interpolate(frame, [delay + 8, delay + 16], [0, 1], clamp);
  const left = tx < x;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
        <circle cx={x} cy={y} r={7 * Math.min(1, t * 3)} fill={M.white} />
        <line x1={x} y1={y} x2={x + (tx - x) * t} y2={y + (ty - y) * t} stroke={M.white} strokeWidth={3} />
      </svg>
      <div style={{ position: "absolute", top: ty - size * 0.75, ...(left ? { right: 1080 - tx + 12 } : { left: tx + 12 }), opacity: o }}>
        <Text size={size} style={{ whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,0.6)" }}>
          {text}
        </Text>
      </div>
    </>
  );
};

/** A molecule as a row of carbon balls with its name. */
export const Carbons: React.FC<{ n: number; name: string; size?: number; tint?: string }> = ({ n, name, size = 44, tint = M.glow }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
    <svg width={n * size * 0.92 + size * 0.2} height={size * 1.5} style={{ overflow: "visible" }}>
      {Array.from({ length: n }).map((_, i) => {
        const cx = size * 0.6 + i * size * 0.92;
        const cy = size * 0.75 + (i % 2 ? -size * 0.18 : size * 0.18);
        return (
          <g key={i}>
            {i > 0 && <line x1={cx - size * 0.92} y1={size * 0.75 + ((i - 1) % 2 ? -size * 0.18 : size * 0.18)} x2={cx} y2={cy} stroke={tint} strokeWidth={6} />}
            <circle cx={cx} cy={cy} r={size * 0.42} fill={M.carbon} stroke={tint} strokeWidth={4} />
            <circle cx={cx - size * 0.13} cy={cy - size * 0.14} r={size * 0.1} fill="#FFFFFF" opacity={0.5} />
            <text x={cx} y={cy + size * 0.15} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size * 0.42} fill="#FFFFFF">
              C
            </text>
          </g>
        );
      })}
    </svg>
    <Text size={34} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
      {name}
    </Text>
    <Pill text={`${n}C`} color={tint} size={26} />
  </div>
);

export type Kind = "CO2" | "NADH" | "FADH2" | "ATP" | "GTP" | "H2O";

const TOKEN: Record<Kind, { label: string; color: string; dark: boolean }> = {
  CO2: { label: "CO₂", color: M.co2, dark: true },
  NADH: { label: "NADH", color: M.nadh, dark: true },
  FADH2: { label: "FADH₂", color: M.fadh, dark: true },
  ATP: { label: "ATP", color: M.atp, dark: true },
  GTP: { label: "GTP", color: "#8BE0C2", dark: true },
  H2O: { label: "H₂O", color: M.water, dark: true },
};

export const Token: React.FC<{ kind: Kind; size?: number; style?: React.CSSProperties }> = ({ kind, size = 36, style }) => {
  const t = TOKEN[kind];
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: size * 3,
        padding: `${size * 0.22}px ${size * 0.5}px`,
        borderRadius: size,
        background: t.color,
        boxShadow: `0 0 ${size * 0.8}px ${t.color}88`,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        color: "#1A1A1A",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {t.label}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scoreboard: one turn of the cycle.

export const SLOTS: { kind: Kind; x: number }[] = [
  { kind: "CO2", x: 160 },
  { kind: "NADH", x: 413 },
  { kind: "FADH2", x: 667 },
  { kind: "ATP", x: 920 },
];
export const SCORE_Y = 1660;
const FLY = 26;

export type Event = { kind: Kind; at: number; from?: [number, number] };

/** Tokens fly from the reaction to their scoreboard slot; counts tick up on landing. */
export const Scoreboard: React.FC<{ before: Partial<Record<Kind, number>>; events: Event[]; delay?: number }> = ({ before, events, delay = 4 }) => {
  const frame = useCurrentFrame();
  const p = usePop(delay);
  return (
    <>
      <div style={{ position: "absolute", left: 40, right: 40, top: SCORE_Y - 80, ...fadeUp(p) }}>
        <Glass style={{ height: 170, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          {SLOTS.map((s) => {
            const landed = events.filter((e) => (e.kind === s.kind || (s.kind === "ATP" && e.kind === "GTP")) && frame >= e.at + FLY);
            const n = (before[s.kind] ?? 0) + landed.length;
            const bump = landed.length ? interpolate(frame - (landed[landed.length - 1].at + FLY), [0, 4, 10], [1, 1.25, 1], clamp) : 1;
            return (
              <div key={s.kind} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <Token kind={s.kind} size={28} />
                <Text size={52} style={{ transform: `scale(${bump})` }}>
                  {n}
                </Text>
              </div>
            );
          })}
        </Glass>
      </div>
      {events.map((e, i) => {
        const slot = SLOTS.find((s) => s.kind === e.kind || (s.kind === "ATP" && e.kind === "GTP"));
        if (!slot) return null;
        const [fx, fy] = e.from ?? [540, 1300];
        const pop = interpolate(frame, [e.at - 10, e.at], [0, 1], clamp);
        const t = interpolate(frame, [e.at, e.at + FLY], [0, 1], { ...clamp, easing: (v) => v * v });
        if (frame < e.at - 10 || frame > e.at + FLY) return null;
        const x = fx + (slot.x - fx) * t;
        const y = fy + (SCORE_Y - 40 - fy) * t - Math.sin(Math.PI * t) * 160;
        const kind: Kind = e.kind === "GTP" && t > 0.5 ? "ATP" : e.kind;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${0.4 + 0.6 * pop})`, opacity: pop }}>
            <Token kind={kind} size={34} />
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// Cycle wheel.

export const NODES = [
  { name: "Citric acid", c: 6 },
  { name: "Isocitrate", c: 6 },
  { name: "α-Ketoglutarate", c: 5 },
  { name: "Succinyl CoA", c: 4 },
  { name: "Succinate", c: 4 },
  { name: "Fumarate", c: 4 },
  { name: "Malate", c: 4 },
  { name: "OAA", c: 4 },
];

const angleOf = (i: number) => ((-67.5 + i * 45) * Math.PI) / 180;

/**
 * The cycle. `active` is the index of the step being shown (i -> i+1, with
 * 7 meaning OAA -> citric acid); `lit` lists nodes to highlight.
 */
export const Wheel: React.FC<{ cx?: number; cy?: number; r?: number; active?: number[]; lit?: number[]; scale?: number; spin?: boolean; delay?: number }> = ({
  cx = 540,
  cy = 740,
  r = 300,
  active = [],
  lit = [],
  scale = 1,
  spin = false,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const p = usePop(delay);
  const spinIdx = spin ? Math.floor(frame / 12) % 8 : -1;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: interpolate(p, [0, 0.3], [0, 1], clamp), transform: `scale(${(0.9 + 0.1 * p) * scale})`, transformOrigin: `${cx}px ${cy}px` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <marker id="kh" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 Z" fill={M.white} />
          </marker>
          <marker id="kha" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 Z" fill={M.active} />
          </marker>
        </defs>
        <circle cx={cx} cy={cy} r={r * 0.55} fill="rgba(255,255,255,0.04)" stroke={M.edge} strokeWidth={2} strokeDasharray="6 10" />
        {NODES.map((_, i) => {
          const a0 = angleOf(i) + 0.3;
          const a1 = angleOf(i + 1) - 0.3;
          const on = active.includes(i) || spinIdx === i;
          return (
            <path
              key={i}
              d={`M ${cx + r * Math.cos(a0)} ${cy + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)}`}
              stroke={on ? M.active : "rgba(255,255,255,0.45)"}
              strokeWidth={on ? 9 : 4}
              fill="none"
              strokeDasharray={on ? "16 10" : undefined}
              strokeDashoffset={on ? -frame * 2 : 0}
              markerEnd={on ? "url(#kha)" : "url(#kh)"}
              style={{ filter: on ? `drop-shadow(0 0 10px ${M.active})` : undefined }}
            />
          );
        })}
        {/* acetyl CoA entering at the top */}
        <path d={`M ${cx} ${cy - r - 110} Q ${cx} ${cy - r - 10} ${cx + r * Math.cos(angleOf(0) - 0.25)} ${cy + r * Math.sin(angleOf(0) - 0.25)}`} stroke={active.includes(7) ? M.active : "rgba(255,255,255,0.45)"} strokeWidth={4} fill="none" markerEnd="url(#kh)" />
      </svg>
      <div style={{ position: "absolute", left: cx, top: cy - r - 150, transform: "translateX(-50%)" }}>
        <Pill text="Acetyl CoA (2C)" color={active.includes(7) ? M.active : M.dim} size={26} />
      </div>
      <div style={{ position: "absolute", left: cx, top: cy, transform: "translate(-50%,-50%)", textAlign: "center" }}>
        <Text size={34} color={M.dim}>
          Mitochondrial
          <br />
          matrix
        </Text>
      </div>
      {NODES.map((n, i) => {
        const a = angleOf(i);
        const on = lit.includes(i) || spinIdx === i || spinIdx + 1 === i;
        return (
          <div
            key={n.name}
            style={{
              position: "absolute",
              left: cx + r * Math.cos(a),
              top: cy + r * Math.sin(a),
              transform: `translate(-50%,-50%) scale(${on ? 1.08 : 1})`,
            }}
          >
            <div
              style={{
                padding: "8px 18px",
                borderRadius: 18,
                background: on ? "rgba(155,247,181,0.25)" : "rgba(0,0,0,0.4)",
                border: `2px solid ${on ? M.active : M.edge}`,
                boxShadow: on ? `0 0 24px ${M.active}88` : undefined,
                textAlign: "center",
              }}
            >
              <Text size={26} style={{ whiteSpace: "nowrap" }}>
                {n.name}
              </Text>
              <Text size={20} color={on ? M.active : M.dim}>
                {n.c}C
              </Text>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** One reaction: substrate(s) → product with an enzyme on the arrow. */
export const Reaction: React.FC<{
  from: { n: number; name: string }[];
  to: { n: number; name: string };
  enzyme: string;
  at: number;
  y?: number;
  note?: string;
  noteAt?: number;
}> = ({ from, to, enzyme, at, y = 1150, note, noteAt }) => {
  const frame = useCurrentFrame();
  const a = usePop(at);
  const arrow = interpolate(frame, [at + 8, at + 22], [0, 1], clamp);
  const b = usePop(at + 24);
  const n = usePop(noteAt ?? at + 30);
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: y, ...fadeUp(a) }}>
      <Glass style={{ height: 340, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {from.map((m, i) => (
            <React.Fragment key={m.name}>
              {i > 0 && <Text size={56}>+</Text>}
              <Carbons n={m.n} name={m.name} size={from.length > 1 ? 40 : 54} />
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, flex: 1, padding: "0 10px" }}>
          <div style={{ opacity: arrow }}>
            <Pill text={enzyme} color={M.active} size={enzyme.length > 22 ? 20 : 24} />
          </div>
          <svg width={150} height={40} viewBox="0 0 150 40">
            <path d={`M 6 20 L ${6 + 128 * arrow} 20`} stroke={M.white} strokeWidth={7} strokeLinecap="round" />
            {arrow > 0.9 && <path d="M 120 6 L 140 20 L 120 34" stroke={M.white} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          </svg>
        </div>
        <div style={fadeUp(b)}>
          <Carbons n={to.n} name={to.name} size={54} tint={M.active} />
        </div>
        {note && (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -30, display: "flex", justifyContent: "center", ...fadeUp(n) }}>
            <Pill text={note} color={M.atp} size={28} style={{ background: "rgba(20,30,24,0.9)" }} />
          </div>
        )}
      </Glass>
    </div>
  );
};

/** Mitochondrion drawing (centred at cx, cy). */
export const Mitochondrion: React.FC<{ cx: number; cy: number; w: number; glow?: number }> = ({ cx, cy, w, glow = 0 }) => {
  const frame = useCurrentFrame();
  const h = w * 0.5;
  const folds = 6;
  let d = `M ${-w / 2 + 40} 0`;
  for (let i = 0; i < folds; i++) {
    const x0 = -w / 2 + 60 + (i * (w - 120)) / folds;
    const x1 = x0 + (w - 120) / folds;
    const up = i % 2 === 0;
    d += ` L ${x0} 0 L ${x0 + 10} ${up ? -h * 0.32 : h * 0.32} Q ${(x0 + x1) / 2 + 4} ${up ? -h * 0.42 : h * 0.42} ${x1 - 10} ${up ? -h * 0.32 : h * 0.32} L ${x1} 0`;
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <radialGradient id="mitoFill" cx="45%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#E9C98A" />
          <stop offset="100%" stopColor="#B07F45" />
        </radialGradient>
        <radialGradient id="matrixFill" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#F8E4B8" />
          <stop offset="100%" stopColor="#DDB676" />
        </radialGradient>
      </defs>
      <g transform={`translate(${cx} ${cy}) rotate(${Math.sin(frame / 50) * 2})`}>
        {glow > 0 && <ellipse rx={w / 2 + 50} ry={h / 2 + 50} fill={M.active} opacity={0.2 * glow} />}
        <ellipse rx={w / 2} ry={h / 2} fill="url(#mitoFill)" stroke="#5A3A1A" strokeWidth={5} />
        <ellipse rx={w / 2 - 24} ry={h / 2 - 22} fill="url(#matrixFill)" stroke="#8A5A2A" strokeWidth={4} />
        <path d={d} stroke="#8A5A2A" strokeWidth={14} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <path d={d} stroke="#F0CF8C" strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={i} cx={(random(`m${i}`) - 0.5) * (w - 140)} cy={(random(`n${i}`) - 0.5) * (h - 90)} r={4} fill="#8A5A2A" opacity={0.5} />
        ))}
      </g>
    </svg>
  );
};
