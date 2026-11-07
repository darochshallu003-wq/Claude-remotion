import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Riya } from "../mitti/people";
import { BOLD, K, MONO, pop, popIn, Sticker, useBeat } from "./ui";

// One sticker-card visual per beat. Elements pop in on the frame the matching
// caption chunk starts being spoken (useBeat().at(i)).

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ZONE = { left: 60, top: 410, width: 960, height: 880 };

/** A sine wave as an SVG path. */
const wavePath = (x0: number, x1: number, y: number, amp: number, lambda: number, phase: number) => {
  let d = "";
  for (let x = x0; x <= x1; x += 4) {
    const yy = y + amp * Math.sin(((x - x0) / lambda) * Math.PI * 2 - phase);
    d += `${x === x0 ? "M" : "L"}${x.toFixed(1)} ${yy.toFixed(1)} `;
  }
  return d;
};

const Chip: React.FC<{ text: string; bg?: string; color?: string; size?: number; style?: React.CSSProperties }> = ({
  text,
  bg = K.white,
  color = K.ink,
  size = 38,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      padding: "8px 22px",
      borderRadius: 18,
      border: `5px solid ${K.ink}`,
      boxShadow: `6px 6px 0 ${K.ink}`,
      background: bg,
      color,
      fontFamily: BOLD,
      fontSize: size,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </div>
);

const Sun: React.FC<{ cx: number; cy: number; r: number; frame: number; color?: string }> = ({ cx, cy, r, frame, color = K.sun }) => (
  <g>
    <g transform={`rotate(${frame * 1.2} ${cx} ${cy})`}>
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={cx - 7} y={cy - r - 34} width={14} height={26} rx={7} fill={color} stroke={K.ink} strokeWidth={4} transform={`rotate(${i * 36} ${cx} ${cy})`} />
      ))}
    </g>
    <circle cx={cx} cy={cy} r={r} fill={color} stroke={K.ink} strokeWidth={6} />
  </g>
);

// ---------------------------------------------------------------- hook

const SkyCard: React.FC<{ frame: number; sunset?: boolean }> = ({ frame, sunset }) => (
  <svg viewBox="0 0 440 520" width="100%" height="100%" style={{ borderRadius: 20, display: "block" }}>
    <defs>
      <linearGradient id={sunset ? "gs" : "gd"} x1="0" y1="0" x2="0" y2="1">
        {sunset ? (
          <>
            <stop offset="0" stopColor="#5B3A8C" />
            <stop offset="0.45" stopColor="#F0473C" />
            <stop offset="0.8" stopColor="#FFB347" />
          </>
        ) : (
          <>
            <stop offset="0" stopColor={K.skyDeep} />
            <stop offset="1" stopColor="#9FD4FF" />
          </>
        )}
      </linearGradient>
    </defs>
    <rect width="440" height="520" fill={`url(#${sunset ? "gs" : "gd"})`} />
    {sunset ? (
      <>
        <circle cx="220" cy="400" r="80" fill="#FFD166" stroke={K.ink} strokeWidth={5} />
        <rect y="400" width="440" height="120" fill="#3A2550" />
        {[430, 460, 490].map((y, i) => (
          <path key={y} d={`M${60 + i * 30} ${y} L ${380 - i * 30} ${y}`} stroke="#FFB347" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
        ))}
      </>
    ) : (
      <>
        <Sun cx={330} cy={110} r={50} frame={frame} />
        {[
          [110, 230, 1],
          [270, 330, 0.8],
        ].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x + Math.sin(frame / 25 + i) * 10} ${y}) scale(${s})`}>
            <path d="M-80 20 C -90 -10, -50 -30, -30 -14 C -20 -50, 40 -50, 44 -12 C 70 -24, 96 0, 80 20 Z" fill="#FFFFFF" stroke={K.ink} strokeWidth={5} />
          </g>
        ))}
        <path d="M0 470 C 120 420, 260 450, 440 410 L 440 520 L 0 520 Z" fill="#5DBB63" stroke={K.ink} strokeWidth={5} />
      </>
    )}
  </svg>
);

const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const { at } = useBeat();
  const a = pop(f, at(0) - 2);
  const b = pop(f, at(1));
  const c = pop(f, at(2), 8, 220);
  const q = pop(f, at(0) + 10, 8);
  const label = pop(f, 2);
  return (
    <AbsoluteFill>
      <Sticker bg={K.orange} shadow={6} style={{ left: 250, top: 210, padding: "10px 30px", ...popIn(label, -3) }}>
        <span style={{ fontFamily: BOLD, fontSize: 44, color: K.ink }}>roz dekhte ho, par...</span>
      </Sticker>
      <Sticker style={{ left: 80, top: 360, width: 460, height: 540, padding: 10, ...popIn(a, -7) }}>
        <SkyCard frame={f} />
      </Sticker>
      <Sticker style={{ left: 540, top: 470, width: 440, height: 520, padding: 10, ...popIn(b, 8) }}>
        <SkyCard frame={f} sunset />
      </Sticker>
      <Sticker bg={K.yellow} style={{ left: 820, top: 330, width: 170, height: 170, display: "flex", alignItems: "center", justifyContent: "center", ...popIn(q, 12) }}>
        <span style={{ fontFamily: BOLD, fontSize: 130, color: K.ink, marginTop: 14, transform: `rotate(${Math.sin(f / 6) * 6}deg)` }}>?</span>
      </Sticker>
      <Sticker
        bg={K.purple}
        style={{ left: 250, top: 1010, padding: "14px 40px", ...popIn(c, -4) }}
      >
        <span style={{ fontFamily: BOLD, fontSize: 86, color: K.white, letterSpacing: 1 }}>
          <span style={{ color: K.yellow }}>6</span> STEPS
        </span>
      </Sticker>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- step 1: white light

const BANDS = ["#F0473C", "#FF9F43", "#FFD43B", "#4CC26A", "#4EA8F5", "#3B4CCA", "#9B4DFF"];

const White: React.FC = () => {
  const f = useCurrentFrame();
  const { at } = useBeat();
  const sun = pop(f, at(1) - 4);
  const beam = interpolate(f, [at(1) + 4, at(1) + 22], [0, 1], clamp);
  const fan = interpolate(f, [at(3), at(3) + 22], [0, 1], clamp);
  const safed = pop(f, at(2));
  const seven = pop(f, at(3) + 14, 9);
  const shimmer = (f / 3) % 40;
  return (
    <AbsoluteFill>
      <Sticker style={{ ...ZONE, overflow: "hidden", background: "#FFFDF7" }}>
        <svg viewBox="0 0 950 870" width="100%" height="100%">
          {/* rainbow fan from the prism's right face */}
          <g clipPath="url(#fanclip)">
            {BANDS.map((col, i) => {
              const y0 = 400 + i * 4;
              const y1a = 300 + i * 70;
              return <path key={col} d={`M560 ${y0} L 560 ${y0 + 6} L 960 ${y1a + 70} L 960 ${y1a}`} fill={col} stroke={K.ink} strokeWidth={2.5} />;
            })}
          </g>
          <defs>
            <clipPath id="fanclip">
              <rect x="540" y="0" width={420 * fan + 20} height="870" />
            </clipPath>
          </defs>
          {/* white beam: sun → prism */}
          <path d={`M210 380 L ${210 + 290 * beam} ${380 + 30 * beam} L ${210 + 290 * beam} ${400 + 30 * beam} L 210 420 Z`} fill="#FFFFFF" stroke={K.ink} strokeWidth={4} />
          {beam > 0.2 && (
            <rect x={210 + shimmer * 6} y={392 + shimmer * 0.6} width={40} height={6} rx={3} fill={K.yellow} opacity={beam} />
          )}
          {/* prism */}
          <path d="M520 250 L 650 560 L 390 560 Z" fill="#DDF1FF" stroke={K.ink} strokeWidth={7} strokeLinejoin="round" opacity={0.95} />
          <path d="M520 290 L 560 400" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" />
          <g transform={`translate(150 400) scale(${sun})`}>
            <Sun cx={0} cy={0} r={78} frame={f} />
          </g>
        </svg>
      </Sticker>
      <Chip text="safed" style={{ left: 250, top: 920, ...popIn(safed, -5) }} />
      <Chip text="andar 7 rang!" bg={K.yellow} size={46} style={{ left: 560, top: 1090, ...popIn(seven, 4) }} />
      <div style={{ position: "absolute", left: 640, top: 1180, display: "flex", gap: 6, opacity: seven }}>
        {"VIBGYOR".split("").map((ch, i) => (
          <span key={i} style={{ fontFamily: MONO, fontSize: 30, color: BANDS[6 - i] }}>
            {ch}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- step 2: waves

const WaveRow: React.FC<{ top: number; color: string; lambda: number; label: string; nm: string; tag: string; p: number; frame: number }> = ({
  top,
  color,
  lambda,
  label,
  nm,
  tag,
  p,
  frame,
}) => {
  const reveal = interpolate(p, [0, 1], [0, 1], clamp);
  return (
    <Sticker style={{ left: 60, top, width: 960, height: 360, overflow: "hidden", ...popIn(p, 0) }}>
      <svg viewBox="0 0 950 350" width="100%" height="100%">
        <defs>
          <clipPath id={`w-${label}`}>
            <rect x="0" y="0" width={950 * reveal} height="350" />
          </clipPath>
        </defs>
        <path d="M30 200 L 920 200" stroke={K.muted} strokeWidth={3} strokeDasharray="10 10" />
        <path d={wavePath(30, 920, 200, 80, lambda, frame / 4)} fill="none" stroke={K.ink} strokeWidth={18} strokeLinecap="round" clipPath={`url(#w-${label})`} />
        <path d={wavePath(30, 920, 200, 80, lambda, frame / 4)} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" clipPath={`url(#w-${label})`} />
        {/* one wavelength bracket */}
        <g opacity={reveal}>
          <path d={`M400 310 L 400 326 L ${400 + lambda} 326 L ${400 + lambda} 310`} fill="none" stroke={K.ink} strokeWidth={5} />
          <text x={400 + lambda + 18} y={334} fontFamily={MONO} fontSize={34} fill={K.ink}>
            {nm}
          </text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: 24, top: 18, display: "flex", gap: 14 }}>
        <span style={{ fontFamily: BOLD, fontSize: 44, color: K.white, background: color, border: `4px solid ${K.ink}`, borderRadius: 14, padding: "0 18px" }}>{label}</span>
        <span style={{ fontFamily: BOLD, fontSize: 44, color: K.ink, padding: "0 6px" }}>{tag}</span>
      </div>
    </Sticker>
  );
};

const Wave: React.FC = () => {
  const f = useCurrentFrame();
  const { at } = useBeat();
  const red = pop(f, at(1) - 3, 16);
  const blue = pop(f, at(2) - 3, 16);
  const star = pop(f, at(3), 8, 220);
  return (
    <AbsoluteFill>
      <WaveRow top={430} color={K.red} lambda={280} label="laal" nm="~700 nm" tag="lambi lehar" p={red} frame={f} />
      <WaveRow top={830} color={K.skyDeep} lambda={180} label="neela" nm="~450 nm" tag="chhoti lehar" p={blue} frame={f} />
      <Sticker bg={K.yellow} style={{ left: 660, top: 1210, padding: "10px 26px", ...popIn(star, 8) }}>
        <span style={{ fontFamily: BOLD, fontSize: 44, color: K.ink }}>yaad rakhna!</span>
      </Sticker>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- step 3: air molecules

const MOLS: { x: number; y: number; kind: "N" | "O"; rot: number }[] = [
  { x: 330, y: 300, kind: "N", rot: 20 },
  { x: 520, y: 240, kind: "N", rot: -30 },
  { x: 640, y: 380, kind: "O", rot: 60 },
  { x: 400, y: 470, kind: "N", rot: 80 },
  { x: 560, y: 560, kind: "N", rot: 10 },
  { x: 280, y: 590, kind: "O", rot: -50 },
  { x: 720, y: 560, kind: "N", rot: 40 },
  { x: 470, y: 690, kind: "N", rot: -10 },
  { x: 250, y: 430, kind: "N", rot: 120 },
];

const Molecule: React.FC<{ kind: "N" | "O"; s?: number }> = ({ kind, s = 1 }) => {
  const col = kind === "N" ? "#5C8DFF" : K.red;
  return (
    <g transform={`scale(${s})`}>
      <circle cx={-22} cy={0} r={26} fill={col} stroke={K.ink} strokeWidth={5} />
      <circle cx={22} cy={0} r={26} fill={col} stroke={K.ink} strokeWidth={5} />
      <circle cx={-28} cy={-8} r={7} fill="#FFFFFF" opacity={0.7} />
      <circle cx={16} cy={-8} r={7} fill="#FFFFFF" opacity={0.7} />
    </g>
  );
};

const Air: React.FC = () => {
  const f = useCurrentFrame();
  const { at } = useBeat();
  const lens = pop(f, 4, 13);
  const n2 = pop(f, at(1) - 2);
  const o2 = pop(f, at(1) + 14);
  const big = interpolate(f, [at(3), at(3) + 20], [0, 1], clamp);
  const tag = pop(f, at(3) + 10, 9);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", ...ZONE, ...popIn(lens, -3) }}>
        <svg viewBox="0 0 960 880" width="100%" height="100%" style={{ overflow: "visible" }}>
          <defs>
            <clipPath id="lensclip">
              <circle cx="480" cy="460" r="370" />
            </clipPath>
          </defs>
          {/* handle */}
          <path d="M740 730 L 900 880" stroke={K.ink} strokeWidth={70} strokeLinecap="round" />
          <path d="M740 730 L 900 880" stroke={K.orange} strokeWidth={50} strokeLinecap="round" />
          <circle cx="480" cy="460" r="370" fill="#E6F4FF" stroke={K.ink} strokeWidth={10} />
          <g clipPath="url(#lensclip)">
            {/* a light wave, far bigger than any molecule */}
            <path d={wavePath(60, 900, 460, 230 * big, 1400, f / 10)} fill="none" stroke={K.skyDeep} strokeWidth={14} opacity={0.35 + 0.35 * big} strokeLinecap="round" />
            {MOLS.map((m, i) => {
              const p = m.kind === "N" ? n2 : o2;
              const jx = Math.sin(f / 7 + i * 1.7) * 14;
              const jy = Math.cos(f / 9 + i * 2.3) * 14;
              return (
                <g key={i} transform={`translate(${m.x + jx} ${m.y + jy}) rotate(${m.rot + f * (i % 2 ? 1.5 : -1.2)}) scale(${p * (1 - 0.55 * big)})`}>
                  <Molecule kind={m.kind} />
                </g>
              );
            })}
          </g>
          <circle cx="480" cy="460" r="370" fill="none" stroke="#FFFFFF" strokeWidth={14} strokeDasharray="120 900" strokeDashoffset={-520} opacity={0.8} />
        </svg>
      </div>
      <Chip text="N₂ · 78%" bg="#5C8DFF" color={K.white} style={{ left: 60, top: 420, ...popIn(n2, -6) }} />
      <Chip text="O₂ · 21%" bg={K.red} color={K.white} style={{ left: 780, top: 440, ...popIn(o2, 6) }} />
      <Sticker bg={K.yellow} style={{ left: 120, top: 1130, padding: "10px 26px", ...popIn(tag, -3) }}>
        <span style={{ fontFamily: BOLD, fontSize: 42, color: K.ink }}>lehar ≫ molecule</span>
      </Sticker>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- step 4: scattering

const Scatter: React.FC = () => {
  const f = useCurrentFrame();
  const { at } = useBeat();
  const inbeam = interpolate(f, [4, 26], [0, 1], clamp);
  const go = at(1);
  const spray = interpolate(f, [go, go + 10], [0, 1], clamp);
  const redOn = interpolate(f, [go + 4, go + 24], [0, 1], clamp);
  const six = pop(f, at(4), 7, 230);
  const name = pop(f, at(5), 12);
  const cx = 470;
  const cy = 420;
  return (
    <AbsoluteFill>
      <Sticker style={{ ...ZONE, overflow: "hidden", background: "#FFFDF7" }}>
        <svg viewBox="0 0 950 870" width="100%" height="100%">
          <defs>
            <clipPath id="inclip">
              <rect x="0" y="0" width={30 + (cx - 60) * inbeam} height="870" />
            </clipPath>
            <clipPath id="outclip">
              <rect x={cx + 40} y="0" width={460 * redOn} height="870" />
            </clipPath>
          </defs>
          {/* incoming sunlight: red + blue together */}
          <g clipPath="url(#inclip)">
            <path d={wavePath(20, cx - 40, cy, 44, 150, f / 3)} fill="none" stroke={K.red} strokeWidth={10} strokeLinecap="round" />
            <path d={wavePath(20, cx - 40, cy, 44, 96, f / 3 + 1)} fill="none" stroke={K.skyDeep} strokeWidth={10} strokeLinecap="round" />
          </g>
          <text x="40" y={cy - 90} fontFamily={MONO} fontSize={32} fill={K.ink} opacity={inbeam}>
            sunlight →
          </text>
          {/* red passes straight on */}
          <g clipPath="url(#outclip)">
            <path d={wavePath(cx + 40, 940, cy, 44, 150, f / 3)} fill="none" stroke={K.red} strokeWidth={10} strokeLinecap="round" />
          </g>
          {/* blue sprayed in every direction */}
          {Array.from({ length: 12 }, (_, k) => {
            const ang = (k / 12) * Math.PI * 2 + 0.26;
            return Array.from({ length: 2 }, (_, j) => {
              const t = ((f - go + k * 5 + j * 20) % 40) / 40;
              const d = 70 + t * 360;
              const x = cx + Math.cos(ang) * d;
              const y = cy + Math.sin(ang) * d;
              const rot = (ang * 180) / Math.PI;
              return (
                <g key={`${k}-${j}`} transform={`translate(${x} ${y}) rotate(${rot})`} opacity={spray * (1 - t) * (f >= go ? 1 : 0)}>
                  <path d={wavePath(-30, 30, 0, 9, 22, 0)} fill="none" stroke={K.skyDeep} strokeWidth={8} strokeLinecap="round" />
                </g>
              );
            });
          })}
          <g transform={`translate(${cx} ${cy}) rotate(${f * 1.4}) scale(1.3)`}>
            <Molecule kind="N" />
          </g>
        </svg>
      </Sticker>
      <Sticker bg={K.yellow} style={{ left: 640, top: 1000, padding: "8px 28px", ...popIn(six, 10) }}>
        <span style={{ fontFamily: BOLD, fontSize: 80, color: K.skyDeep }}>~6x</span>
        <span style={{ fontFamily: BOLD, fontSize: 40, color: K.ink }}> neela</span>
      </Sticker>
      <Chip text="∝ 1/λ⁴" bg={K.purple} color={K.white} size={44} style={{ left: 110, top: 1050, fontFamily: MONO, ...popIn(name, -6) }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- step 5: from everywhere to the eye

const Eye: React.FC = () => {
  const f = useCurrentFrame();
  const { at } = useBeat();
  const full = interpolate(f, [at(3), at(3) + 18], [0, 1], clamp);
  const label = pop(f, at(3) + 8, 9);
  const ex = 475;
  const ey = 640;
  const arrows = [25, 50, 75, 95, 115, 135, 158];
  return (
    <AbsoluteFill>
      <Sticker style={{ ...ZONE, overflow: "hidden", background: "#FFFDF7" }}>
        <svg viewBox="0 0 950 870" width="100%" height="100%">
          <defs>
            <radialGradient id="dome" cx="0.5" cy="1" r="1">
              <stop offset="0.2" stopColor="#BFE3FF" />
              <stop offset="1" stopColor={K.skyDeep} />
            </radialGradient>
          </defs>
          <path d="M15 780 A 460 460 0 0 1 935 780 Z" fill="url(#dome)" opacity={0.25 + 0.75 * full} stroke={K.ink} strokeWidth={6} />
          <Sun cx={800} cy={170} r={44} frame={f} />
          {arrows.map((deg, i) => {
            const a = (deg * Math.PI) / 180;
            const sx = 475 - Math.cos(a) * 420;
            const sy = 780 - Math.sin(a) * 420;
            const start = at(1) - 4 + i * 4;
            const t = interpolate(f, [start, start + 14], [0, 1], clamp);
            const dx = ex - sx;
            const dy = ey - sy;
            const len = Math.hypot(dx, dy);
            const ux = dx / len;
            const uy = dy / len;
            const tx = sx + dx * t - ux * 50 * t;
            const ty = sy + dy * t - uy * 50 * t;
            const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
            return (
              <g key={deg} opacity={t > 0 ? 1 : 0}>
                <line x1={sx} y1={sy} x2={tx} y2={ty} stroke={K.ink} strokeWidth={13} strokeLinecap="round" />
                <line x1={sx} y1={sy} x2={tx} y2={ty} stroke={K.sky} strokeWidth={7} strokeLinecap="round" strokeDasharray="18 12" strokeDashoffset={-f * 2} />
                <path d="M0 0 L -24 -14 L -24 14 Z" fill={K.sky} stroke={K.ink} strokeWidth={4} strokeLinejoin="round" transform={`translate(${tx} ${ty}) rotate(${ang})`} />
              </g>
            );
          })}
          <path d="M0 780 C 200 740, 700 760, 950 770 L 950 870 L 0 870 Z" fill="#5DBB63" stroke={K.ink} strokeWidth={6} />
        </svg>
      </Sticker>
      <div style={{ position: "absolute", left: 60 + ex - 85, top: 410 + 590 }}>
        <Riya size={170} expression="smile" />
      </div>
      <Chip text="poora aasmaan = neela" bg={K.skyDeep} color={K.white} size={42} style={{ left: 250, top: 440, ...popIn(label, -3) }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- step 6: sunset

const Sunset: React.FC = () => {
  const f = useCurrentFrame();
  const { at, frames } = useBeat();
  const drop = interpolate(f, [at(1) - 4, at(1) + 26], [0, 1], { ...clamp, easing: (t) => t * t * (3 - 2 * t) });
  const path = interpolate(f, [at(2), at(2) + 22], [0, 1], clamp);
  const shed = interpolate(f, [at(4), at(4) + 8], [0, 1], clamp);
  const glow = interpolate(f, [at(5) - 6, at(5) + 16], [0, 1], clamp);
  const noonTag = pop(f, at(2) + 6);
  const eveTag = pop(f, at(3));
  const redTag = pop(f, at(5) + 6, 9);
  // sun travels from overhead (480,120) along an arc to the horizon (90,600)
  const ang = interpolate(drop, [0, 1], [Math.PI / 2, Math.PI * 0.985]);
  const sx = 480 + Math.cos(ang) * 400;
  const sy = 600 - Math.sin(ang) * 480;
  const sunCol = drop > 0.6 ? "#FF8A3D" : K.sun;
  const ox = 480;
  const oy = 600;
  const px = 150 + (ox - 165 - 150) * path;
  void frames;
  return (
    <AbsoluteFill>
      <Sticker style={{ ...ZONE, overflow: "hidden", background: "#1F2340" }}>
        <svg viewBox="0 0 950 870" width="100%" height="100%">
          <defs>
            <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4B3A8C" />
              <stop offset="0.6" stopColor="#F0473C" />
              <stop offset="1" stopColor="#FFB347" />
            </linearGradient>
            <linearGradient id="ray" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#FFFFFF" />
              <stop offset="0.5" stopColor="#FFB347" />
              <stop offset="1" stopColor={K.red} />
            </linearGradient>
          </defs>
          <rect width="950" height="870" fill="url(#dusk)" opacity={glow} />
          {/* atmosphere and earth */}
          <circle cx="480" cy="1500" r="1020" fill="#8CC8FF" opacity={0.45} stroke={K.ink} strokeWidth={4} strokeDasharray="14 12" />
          <circle cx="480" cy="1500" r="900" fill="#5DBB63" stroke={K.ink} strokeWidth={7} />
          <path d="M240 700 C 330 660, 420 690, 500 650 C 600 690, 700 660, 760 700" fill="none" stroke="#3E8E46" strokeWidth={8} strokeLinecap="round" />
          {/* noon: short path straight down */}
          <g opacity={noonTag}>
            <line x1={ox} y1={478} x2={ox} y2={oy - 30} stroke={K.ink} strokeWidth={14} strokeLinecap="round" />
            <line x1={ox} y1={478} x2={ox} y2={oy - 30} stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" />
          </g>
          {/* evening: long path through the air */}
          {path > 0 && (
            <g>
              <line x1={150} y1={oy - 8} x2={px} y2={oy - 8} stroke={K.ink} strokeWidth={22} strokeLinecap="round" />
              <line x1={150} y1={oy - 8} x2={px} y2={oy - 8} stroke="url(#ray)" strokeWidth={14} strokeLinecap="round" />
            </g>
          )}
          {/* blue knocked out along the way */}
          {Array.from({ length: 9 }, (_, k) => {
            const x0 = 170 + k * 30;
            const t = ((f - at(4) + k * 6) % 30) / 30;
            const up = k % 2 ? -1 : 1;
            return (
              <circle key={k} cx={x0 + t * 20} cy={oy - 8 + up * (10 + t * 120)} r={9} fill={K.sky} stroke={K.ink} strokeWidth={3} opacity={shed * (1 - t)} />
            );
          })}
          <Sun cx={sx} cy={sy} r={48} frame={f} color={sunCol} />
          {/* observer */}
          <g transform={`translate(${ox} ${oy})`}>
            <circle cx={0} cy={-34} r={16} fill="#B97A50" stroke={K.ink} strokeWidth={5} />
            <path d="M-16 0 C -16 -14, 16 -14, 16 0 Z" fill={K.orange} stroke={K.ink} strokeWidth={5} />
          </g>
        </svg>
      </Sticker>
      <Chip text="dopahar: thodi hawa" size={34} style={{ left: 560, top: 830, ...popIn(noonTag, 4) }} />
      <Chip text="shaam: bahut hawa" bg={K.yellow} size={34} style={{ left: 90, top: 1090, ...popIn(eveTag, -4) }} />
      <Chip text="bacha laal-orange!" bg={K.red} color={K.white} size={42} style={{ left: 470, top: 1150, ...popIn(redTag, 5) }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- recap

const RECAP = ["Safed dhoop", "Rang = lehar", "Tiny molecules", "Neela bikhra", "Har taraf neela", "Sunset laal"];

const Recap: React.FC = () => {
  const f = useCurrentFrame();
  const { at } = useBeat();
  const card = pop(f, 2, 14);
  const tag = pop(f, at(1) + 2, 9);
  return (
    <AbsoluteFill>
      <Sticker style={{ left: 70, top: 440, width: 940, height: 640, padding: "28px 34px", ...popIn(card, 0) }}>
        <div style={{ fontFamily: BOLD, fontSize: 84, color: K.ink, textAlign: "center", lineHeight: 1 }}>
          <span style={{ color: K.pink }}>6</span> STEPS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "26px 26px", marginTop: 34 }}>
          {RECAP.map((txt, i) => {
            const tick = pop(f, 10 + i * 6, 9, 220);
            return (
              <div
                key={txt}
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  border: `5px solid ${K.ink}`,
                  borderRadius: 18,
                  padding: "14px 16px",
                  boxShadow: `5px 5px 0 ${K.ink}`,
                  background: K.white,
                }}
              >
                <span
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    background: K.orange,
                    border: `4px solid ${K.ink}`,
                    fontFamily: BOLD,
                    fontSize: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ marginTop: 4 }}>{i + 1}</span>
                </span>
                <span style={{ fontFamily: BOLD, fontSize: 34, color: K.ink }}>{txt}</span>
                <span
                  style={{
                    position: "absolute",
                    right: -16,
                    top: -16,
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                    background: K.teal,
                    border: `4px solid ${K.ink}`,
                    color: K.white,
                    fontFamily: BOLD,
                    fontSize: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `scale(${tick})`,
                  }}
                >
                  ✓
                </span>
              </div>
            );
          })}
        </div>
      </Sticker>
      <Sticker bg={K.orange} shadow={6} style={{ left: 230, top: 1130, padding: "10px 30px", ...popIn(tag, -3) }}>
        <span style={{ fontFamily: BOLD, fontSize: 44, color: K.ink }}>poora science, ek aasmaan</span>
      </Sticker>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- call to action

const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const { at, frames } = useBeat();
  const twist = pop(f, at(0) - 2, 8, 220);
  const wave = pop(f, at(1) - 2, 15);
  const sky = pop(f, at(3) - 2, 9);
  const word = pop(f, at(4) - 2, 8, 220);
  const check = pop(f, at(4) + 14, 8, 240);
  const dm = pop(f, at(5), 12);
  const follow = pop(f, frames - 58, 11);
  return (
    <AbsoluteFill>
      <Sticker bg={K.purple} style={{ left: 330, top: 200, padding: "8px 36px", ...popIn(twist, -5) }}>
        <span style={{ fontFamily: BOLD, fontSize: 70, color: K.white }}>TWIST!</span>
      </Sticker>
      <Sticker style={{ left: 60, top: 370, width: 600, height: 280, overflow: "hidden", ...popIn(wave, -2) }}>
        <svg viewBox="0 0 590 270" width="100%" height="100%">
          <path d={wavePath(30, 560, 160, 60, 125, f / 3)} fill="none" stroke={K.ink} strokeWidth={17} strokeLinecap="round" />
          <path d={wavePath(30, 560, 160, 60, 125, f / 3)} fill="none" stroke={K.violet} strokeWidth={9} strokeLinecap="round" />
          <text x="30" y="58" fontFamily={BOLD} fontSize={42} fill={K.violet}>
            violet
          </text>
          <text x="400" y="58" fontFamily={MONO} fontSize={32} fill={K.ink}>
            ~400 nm
          </text>
        </svg>
      </Sticker>
      <Sticker style={{ left: 700, top: 400, width: 300, height: 300, overflow: "hidden", background: "#C9A6FF", ...popIn(sky, 7) }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: BOLD, fontSize: 170, color: K.white, WebkitTextStroke: `6px ${K.ink}`, marginTop: 20, transform: `rotate(${Math.sin(f / 6) * 7}deg)` }}>?</span>
        </div>
      </Sticker>
      <div style={{ position: "absolute", left: 0, right: 0, top: 735, textAlign: "center", fontFamily: MONO, fontSize: 44, color: K.purple, fontStyle: "italic", opacity: word }}>
        comment karo
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 810, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
        <div
          style={{
            background: K.orange,
            border: `7px solid ${K.ink}`,
            borderRadius: 26,
            boxShadow: `10px 10px 0 ${K.ink}`,
            padding: "6px 48px",
            fontFamily: BOLD,
            fontSize: 120,
            color: K.ink,
            letterSpacing: 2,
            ...popIn(word, -3),
          }}
        >
          <span style={{ display: "inline-block", marginTop: 12 }}>VIOLET</span>
        </div>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 38,
            background: K.teal,
            border: `5px solid ${K.ink}`,
            color: K.white,
            fontFamily: BOLD,
            fontSize: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${check})`,
          }}
        >
          ✓
        </div>
      </div>
      <Sticker style={{ left: 150, top: 1060, width: 780, padding: "16px 26px", ...popIn(dm, 2) }}>
        <div style={{ fontFamily: MONO, fontSize: 28, color: K.muted }}>comments · @aap</div>
        <div style={{ fontFamily: BOLD, fontSize: 46, color: K.ink }}>
          VIOLET <span style={{ color: K.purple, fontSize: 38 }}>→ part 2 mein jawab</span>
        </div>
      </Sticker>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1230,
          paddingRight: 70,
          display: "flex",
          justifyContent: "flex-end",
          opacity: follow,
          transform: `translateY(${(1 - follow) * 30}px)`,
        }}
      >
        <span style={{ fontFamily: BOLD, fontSize: 40, color: K.white, background: K.ink, borderRadius: 999, padding: "8px 34px" }}>
          FOLLOW @mythmitao
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  white: White,
  wave: Wave,
  air: Air,
  scatter: Scatter,
  eye: Eye,
  sunset: Sunset,
  recap: Recap,
  cta: Cta,
};
