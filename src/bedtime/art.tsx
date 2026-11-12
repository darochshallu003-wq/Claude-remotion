import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";

// Storybook illustrations for the bedtime story: soft night colours, round
// shapes, no hard outlines. Every piece is plain SVG so it scales cleanly.

export const NIGHT = {
  sky0: "#0B1233",
  sky1: "#26205A",
  sky2: "#4B3A7F",
  moon: "#FFF2C2",
  moonShade: "#F2DB97",
  glow: "#FFE27A",
  skin: "#E7AF84",
  cheek: "#F28C8C",
  hair: "#2A1A14",
  dress: "#B9A6F0",
  dressDark: "#9784DA",
  quilt: "#F3A5B7",
  quiltDark: "#D9849A",
  wall: "#1C2552",
  wood: "#7A4E3A",
  leaf: "#2F6B57",
  leafDark: "#1F4E40",
  water: "#1D3E73",
  cream: "#FFF7E6",
};

// ---------------------------------------------------------------------------
// Sky

export const NightSky: React.FC<{ from?: string; to?: string; stars?: number; seed?: number }> = ({
  from = NIGHT.sky0,
  to = NIGHT.sky2,
  stars = 70,
  seed = 1,
}) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${from} 0%, ${NIGHT.sky1} 55%, ${to} 100%)` }}>
    <Stars count={stars} seed={seed} />
  </AbsoluteFill>
);

export const Stars: React.FC<{ count: number; seed: number; maxY?: number }> = ({ count, seed, maxY = 0.75 }) => {
  const frame = useCurrentFrame();
  return (
    <svg width="100%" height="100%" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: count }).map((_, i) => {
        const x = random(`sx${seed}-${i}`) * 1080;
        const y = random(`sy${seed}-${i}`) * 1920 * maxY;
        const r = 1.5 + random(`sr${seed}-${i}`) * 3.2;
        const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(frame / (14 + random(`st${i}`) * 20) + i));
        const big = random(`sb${seed}-${i}`) > 0.9;
        return big ? (
          <g key={i} transform={`translate(${x} ${y}) scale(${0.8 + tw * 0.4})`} opacity={tw}>
            <path d="M0 -14 L3 -3 L14 0 L3 3 L0 14 L-3 3 L-14 0 L-3 -3 Z" fill={NIGHT.cream} />
          </g>
        ) : (
          <circle key={i} cx={x} cy={y} r={r} fill={NIGHT.cream} opacity={tw} />
        );
      })}
    </svg>
  );
};

/** Soft round glow, used behind the moon and Jugnu. */
export const Glow: React.FC<{ x: number; y: number; r: number; color?: string; opacity?: number }> = ({
  x,
  y,
  r,
  color = NIGHT.glow,
  opacity = 0.5,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 68%)`,
      opacity,
      pointerEvents: "none",
    }}
  />
);

// ---------------------------------------------------------------------------
// Faces

/** Eyes that can be open (with pupils looking dx/dy) or closed (sleepy arcs). */
const Eyes: React.FC<{ cx: number; cy: number; gap: number; size: number; closed: number; look?: [number, number]; color?: string }> = ({
  cx,
  cy,
  gap,
  size,
  closed,
  look = [0, 0],
  color = "#2A1A14",
}) => (
  <g>
    {[-1, 1].map((s) => {
      const ex = cx + s * gap;
      return closed > 0.5 ? (
        <path
          key={s}
          d={`M${ex - size} ${cy} Q ${ex} ${cy + size * 0.9} ${ex + size} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.38}
          strokeLinecap="round"
        />
      ) : (
        <g key={s}>
          <ellipse cx={ex} cy={cy} rx={size * 0.78} ry={size * (1 - closed * 1.6)} fill={color} />
          <circle cx={ex + look[0] * size * 0.25 + size * 0.22} cy={cy + look[1] * size * 0.25 - size * 0.3} r={size * 0.26} fill="white" />
        </g>
      );
    })}
  </g>
);

/** Little mouth: a smile when talk=0, an open "o" when talk=1. */
const Mouth: React.FC<{ cx: number; cy: number; w: number; talk: number; color?: string }> = ({ cx, cy, w, talk, color = "#8A3B3B" }) =>
  talk > 0.08 ? (
    <ellipse cx={cx} cy={cy + w * 0.1} rx={w * (0.42 - talk * 0.12)} ry={w * 0.15 + talk * w * 0.32} fill={color} />
  ) : (
    <path d={`M${cx - w / 2} ${cy} Q ${cx} ${cy + w * 0.5} ${cx + w / 2} ${cy}`} fill="none" stroke={color} strokeWidth={w * 0.16} strokeLinecap="round" />
  );

// ---------------------------------------------------------------------------
// Characters

/** Jugnu the firefly. Faces right; `flip` makes him face left. */
export const Jugnu: React.FC<{ size: number; talk?: number; flip?: boolean; style?: React.CSSProperties }> = ({
  size,
  talk = 0,
  flip,
  style,
}) => {
  const frame = useCurrentFrame();
  const flap = Math.sin(frame * 1.3);
  const pulse = 0.75 + 0.25 * Math.sin(frame / 6);
  const blink = frame % 110 > 104 ? 1 : 0;
  return (
    <svg viewBox="-110 -110 220 220" width={size} height={size} style={{ overflow: "visible", ...style }}>
      <g transform={flip ? "scale(-1 1)" : undefined}>
        <circle cx={-30} cy={22} r={95} fill={NIGHT.glow} opacity={0.18 * pulse} />
        <circle cx={-30} cy={22} r={55} fill={NIGHT.glow} opacity={0.3 * pulse} />
        {/* wings */}
        <g opacity={0.75}>
          <ellipse cx={-10} cy={-30} rx={34} ry={16 + flap * 8} transform={`rotate(${-35 + flap * 18} -10 -10)`} fill="#DCEBFF" />
          <ellipse cx={8} cy={-28} rx={30} ry={14 - flap * 6} transform={`rotate(${-10 - flap * 14} 8 -10)`} fill="#EEF5FF" />
        </g>
        {/* glowing tail */}
        <ellipse cx={-34} cy={20} rx={34} ry={28} fill={NIGHT.glow} />
        <ellipse cx={-38} cy={14} rx={16} ry={10} fill="#FFFBE0" opacity={pulse} />
        {/* body */}
        <ellipse cx={4} cy={6} rx={26} ry={24} fill="#5B4A3A" />
        {/* head */}
        <circle cx={38} cy={-6} r={30} fill="#6E5A46" />
        <path d="M44 -34 Q 54 -64 70 -66" fill="none" stroke="#5B4A3A" strokeWidth={5} strokeLinecap="round" />
        <path d="M30 -34 Q 30 -66 46 -74" fill="none" stroke="#5B4A3A" strokeWidth={5} strokeLinecap="round" />
        <circle cx={70} cy={-66} r={6} fill={NIGHT.glow} />
        <circle cx={46} cy={-74} r={6} fill={NIGHT.glow} />
        <Eyes cx={44} cy={-10} gap={11} size={8} closed={blink} look={[1, 0]} color="#1A120C" />
        <circle cx={60} cy={4} r={5} fill={NIGHT.cheek} opacity={0.7} />
        <Mouth cx={50} cy={8} w={14} talk={talk} color="#2A1A14" />
        {/* tiny legs */}
        {[-8, 6, 18].map((x) => (
          <path key={x} d={`M${x} 26 q 2 14 -4 20`} fill="none" stroke="#3E3226" strokeWidth={4} strokeLinecap="round" />
        ))}
      </g>
    </svg>
  );
};

/** Pari, standing / floating, full body. */
export const Pari: React.FC<{ size: number; talk?: number; wave?: number; closed?: number; look?: [number, number]; style?: React.CSSProperties }> = ({
  size,
  talk = 0,
  wave = 0,
  closed = 0,
  look = [0, 0],
  style,
}) => {
  const frame = useCurrentFrame();
  const blink = frame % 130 > 124 ? 1 : 0;
  const armAngle = -120 + Math.sin(frame / 4) * 18 * wave;
  return (
    <svg viewBox="0 0 220 360" width={size} height={(size * 360) / 220} style={{ overflow: "visible", ...style }}>
      {/* pigtails */}
      <circle cx={42} cy={86} r={22} fill={NIGHT.hair} />
      <circle cx={178} cy={86} r={22} fill={NIGHT.hair} />
      <circle cx={56} cy={70} r={8} fill={NIGHT.quilt} />
      <circle cx={164} cy={70} r={8} fill={NIGHT.quilt} />
      {/* legs */}
      <rect x={84} y={300} width={18} height={40} rx={9} fill={NIGHT.skin} />
      <rect x={118} y={300} width={18} height={40} rx={9} fill={NIGHT.skin} />
      <ellipse cx={90} cy={342} rx={16} ry={9} fill={NIGHT.quilt} />
      <ellipse cx={130} cy={342} rx={16} ry={9} fill={NIGHT.quilt} />
      {/* back arm */}
      <g transform={`rotate(${20} 70 186)`}>
        <rect x={62} y={180} width={18} height={70} rx={9} fill={NIGHT.skin} />
      </g>
      {/* nightdress */}
      <path d="M78 160 Q 110 148 142 160 L 176 306 Q 110 322 44 306 Z" fill={NIGHT.dress} />
      <path d="M44 306 Q 110 322 176 306 L 172 292 Q 110 306 48 292 Z" fill={NIGHT.dressDark} />
      {[
        [90, 210],
        [132, 236],
        [100, 268],
        [146, 280],
        [72, 260],
      ].map(([x, y], i) => (
        <path key={i} transform={`translate(${x} ${y}) scale(0.6)`} d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z" fill={NIGHT.cream} opacity={0.85} />
      ))}
      {/* waving arm */}
      <g transform={`rotate(${wave > 0 ? armAngle : -20} 150 176)`}>
        <rect x={142} y={170} width={18} height={70} rx={9} fill={NIGHT.skin} />
        <circle cx={151} cy={242} r={12} fill={NIGHT.skin} />
      </g>
      {/* head */}
      <rect x={100} y={130} width={20} height={30} fill={NIGHT.skin} />
      <circle cx={110} cy={92} r={64} fill={NIGHT.skin} />
      <path d="M46 92 Q 44 26 110 24 Q 176 26 174 92 Q 160 52 124 54 Q 116 70 92 62 Q 66 64 46 92 Z" fill={NIGHT.hair} />
      <Eyes cx={110} cy={100} gap={24} size={10} closed={Math.max(closed, blink)} look={look} />
      <circle cx={74} cy={120} r={10} fill={NIGHT.cheek} opacity={0.55} />
      <circle cx={146} cy={120} r={10} fill={NIGHT.cheek} opacity={0.55} />
      <Mouth cx={110} cy={128} w={22} talk={talk} />
    </svg>
  );
};

/** Pari lying in bed under her quilt. `sit` lifts her head a little. */
export const PariInBed: React.FC<{ width: number; closed?: number; talk?: number; look?: [number, number]; breathe?: number }> = ({
  width,
  closed = 0,
  talk = 0,
  look = [0, 0],
  breathe = 0,
}) => {
  const frame = useCurrentFrame();
  const blink = closed < 0.5 && frame % 120 > 114 ? 1 : 0;
  const rise = breathe * Math.sin(frame / 22) * 5;
  return (
    <svg viewBox="0 0 900 620" width={width} height={(width * 620) / 900} style={{ overflow: "visible" }}>
      {/* headboard */}
      <path d="M60 300 L 60 120 Q 60 60 120 60 L 260 60 Q 320 60 320 120 L 320 300 Z" fill={NIGHT.wood} />
      <path d="M90 290 L 90 130 Q 90 92 128 92 L 252 92 Q 290 92 290 130 L 290 290 Z" fill="#8E5F48" />
      {/* bed frame + mattress */}
      <rect x={40} y={300} width={820} height={190} rx={40} fill={NIGHT.wood} />
      <rect x={60} y={430} width={40} height={150} rx={14} fill="#5E3B2C" />
      <rect x={800} y={430} width={40} height={150} rx={14} fill="#5E3B2C" />
      {/* pillow */}
      <ellipse cx={220} cy={300} rx={150} ry={70} fill={NIGHT.cream} />
      {/* head on pillow */}
      <g transform="translate(112 92) scale(1.05)">
        <circle cx={42} cy={86} r={22} fill={NIGHT.hair} />
        <circle cx={178} cy={86} r={22} fill={NIGHT.hair} />
        <circle cx={110} cy={92} r={64} fill={NIGHT.skin} />
        <path d="M46 92 Q 44 26 110 24 Q 176 26 174 92 Q 160 52 124 54 Q 116 70 92 62 Q 66 64 46 92 Z" fill={NIGHT.hair} />
        <Eyes cx={110} cy={100} gap={24} size={10} closed={Math.max(closed, blink)} look={look} />
        <circle cx={74} cy={120} r={10} fill={NIGHT.cheek} opacity={0.55} />
        <circle cx={146} cy={120} r={10} fill={NIGHT.cheek} opacity={0.55} />
        <Mouth cx={110} cy={128} w={20} talk={talk} />
      </g>
      {/* quilt */}
      <path
        d={`M120 ${300 - rise} Q 480 ${250 - rise} 870 ${300 - rise * 0.5} L 880 470 Q 480 500 90 470 Z`}
        fill={NIGHT.quilt}
      />
      <path d={`M120 ${300 - rise} Q 480 ${250 - rise} 870 ${300 - rise * 0.5} L 868 ${330 - rise * 0.5} Q 480 ${282 - rise} 116 ${332 - rise} Z`} fill={NIGHT.cream} opacity={0.9} />
      {[
        [300, 380],
        [460, 360],
        [620, 390],
        [760, 370],
        [380, 440],
        [700, 445],
      ].map(([x, y], i) => (
        <path key={i} transform={`translate(${x} ${y - rise})`} d="M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4 Z" fill={NIGHT.quiltDark} />
      ))}
    </svg>
  );
};

/** The moon with a kind face. talk opens the mouth; closed makes the eyes sleepy arcs. */
export const Moon: React.FC<{ size: number; talk?: number; closed?: number }> = ({ size, talk = 0, closed = 0 }) => (
  <svg viewBox="-200 -200 400 400" width={size} height={size} style={{ overflow: "visible" }}>
    <circle r={170} fill={NIGHT.moon} />
    <circle cx={-80} cy={-80} r={26} fill={NIGHT.moonShade} opacity={0.7} />
    <circle cx={96} cy={-40} r={18} fill={NIGHT.moonShade} opacity={0.7} />
    <circle cx={60} cy={100} r={22} fill={NIGHT.moonShade} opacity={0.6} />
    <circle cx={-110} cy={50} r={12} fill={NIGHT.moonShade} opacity={0.6} />
    <Eyes cx={0} cy={-10} gap={52} size={18} closed={closed} color="#6B5A3A" />
    <circle cx={-86} cy={40} r={20} fill={NIGHT.cheek} opacity={0.35} />
    <circle cx={86} cy={40} r={20} fill={NIGHT.cheek} opacity={0.35} />
    <Mouth cx={0} cy={50} w={52} talk={talk} color="#9A5A4A" />
  </svg>
);

/** Fluffy cloud with an optional sleepy face. */
export const Cloud: React.FC<{ width: number; face?: boolean; color?: string; opacity?: number }> = ({
  width,
  face = true,
  color = "#E8E4FA",
  opacity = 1,
}) => (
  <svg viewBox="0 0 400 200" width={width} height={width / 2} style={{ overflow: "visible", opacity }}>
    <g fill={color}>
      <circle cx={110} cy={120} r={60} />
      <circle cx={190} cy={90} r={80} />
      <circle cx={280} cy={115} r={65} />
      <rect x={60} y={120} width={280} height={60} rx={30} />
    </g>
    {face && (
      <g>
        <Eyes cx={200} cy={120} gap={30} size={10} closed={1} color="#7A6FA8" />
        <circle cx={158} cy={140} r={9} fill={NIGHT.cheek} opacity={0.4} />
        <circle cx={242} cy={140} r={9} fill={NIGHT.cheek} opacity={0.4} />
      </g>
    )}
  </svg>
);

/** Little house on a hill; `lit` is the window's warmth (0..1). */
export const House: React.FC<{ width: number; lit?: number }> = ({ width, lit = 1 }) => (
  <svg viewBox="0 0 400 360" width={width} height={(width * 360) / 400} style={{ overflow: "visible" }}>
    <rect x={250} y={60} width={34} height={70} fill="#5E3B2C" />
    <path d="M30 170 L 200 40 L 370 170 Z" fill="#B8576A" />
    <path d="M30 170 L 200 40 L 210 50 L 48 176 Z" fill="#D06B7E" />
    <rect x={64} y={166} width={272} height={180} fill="#E9D7B9" />
    <rect x={170} y={250} width={60} height={96} rx={30} fill={NIGHT.wood} />
    <circle cx={110} cy={210} r={70} fill={NIGHT.glow} opacity={0.25 * lit} />
    <rect x={84} y={186} width={56} height={56} rx={8} fill={lit > 0.05 ? `rgba(255,214,110,${0.25 + 0.75 * lit})` : "#2B2F55"} />
    <path d="M112 186 V 242 M84 214 H 140" stroke="#7A4E3A" strokeWidth={5} />
    <rect x={260} y={186} width={56} height={56} rx={8} fill="#2B2F55" />
    <path d="M288 186 V 242 M260 214 H 316" stroke="#7A4E3A" strokeWidth={5} />
  </svg>
);

/** Rolling hills along the bottom of a night scene. */
export const Hills: React.FC<{ top: number }> = ({ top }) => (
  <svg viewBox="0 0 1080 900" width={1080} height={900} style={{ position: "absolute", left: 0, top }}>
    <path d="M0 160 Q 270 40 560 140 T 1080 110 V 900 H 0 Z" fill="#203A5A" />
    <path d="M0 260 Q 300 160 620 250 T 1080 230 V 900 H 0 Z" fill="#17304B" />
  </svg>
);

/** Mother bird on her nest with three sleeping chicks. */
export const Nest: React.FC<{ width: number }> = ({ width }) => {
  const frame = useCurrentFrame();
  const b = (k: number) => 1 + 0.03 * Math.sin(frame / 18 + k);
  return (
    <svg viewBox="0 0 500 330" width={width} height={(width * 330) / 500} style={{ overflow: "visible" }}>
      {/* mother bird */}
      <g transform={`translate(330 140) scale(${b(0)})`}>
        <ellipse cx={0} cy={20} rx={95} ry={70} fill="#C98B5B" />
        <path d="M-80 0 Q -150 -10 -170 40 Q -110 40 -70 50 Z" fill="#A86F45" />
        <circle cx={60} cy={-50} r={50} fill="#D79C6A" />
        <path d="M104 -50 L 136 -40 L 104 -30 Z" fill="#F2B544" />
        <path d="M58 -58 q 10 8 20 0" fill="none" stroke="#2A1A14" strokeWidth={5} strokeLinecap="round" />
        <circle cx={80} cy={-34} r={8} fill={NIGHT.cheek} opacity={0.5} />
        <path d="M-40 -10 Q 30 -40 60 30 Q 0 60 -60 40 Z" fill="#B87A4C" />
      </g>
      {/* chicks */}
      {[
        [130, 170, 1],
        [200, 160, 2],
        [255, 176, 3],
      ].map(([x, y, k]) => (
        <g key={k} transform={`translate(${x} ${y}) scale(${b(k)})`}>
          <circle r={36} fill="#F6D36B" />
          <path d="M30 2 L 46 8 L 30 14 Z" fill="#F2A13A" />
          <path d="M6 -6 q 8 7 16 0" fill="none" stroke="#2A1A14" strokeWidth={4} strokeLinecap="round" />
          <path d="M-6 -36 q 4 -12 12 -8" fill="none" stroke="#F6D36B" strokeWidth={5} strokeLinecap="round" />
        </g>
      ))}
      {/* nest */}
      <path d="M40 190 Q 250 340 470 190 Q 460 290 250 300 Q 40 290 40 190 Z" fill="#8A5A3A" />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M${60 + i * 46} ${210 + (i % 2) * 18} q 30 ${20 - (i % 3) * 10} 64 -4`} fill="none" stroke="#6A4128" strokeWidth={6} strokeLinecap="round" />
      ))}
    </svg>
  );
};

/** A frog on a lily pad. yawn (0..1) opens a big sleepy mouth. */
export const Frog: React.FC<{ width: number; yawn: number }> = ({ width, yawn }) => (
  <svg viewBox="0 0 420 300" width={width} height={(width * 300) / 420} style={{ overflow: "visible" }}>
    <ellipse cx={210} cy={250} rx={200} ry={46} fill="#3E8A62" />
    <path d="M210 250 L 330 224 A 200 46 0 0 1 380 238 Z" fill="#2C6B4B" />
    <ellipse cx={210} cy={190} rx={110} ry={70} fill="#7CC36A" />
    <ellipse cx={210} cy={210} rx={70} ry={40} fill="#B8E39A" />
    <circle cx={160} cy={110} r={34} fill="#7CC36A" />
    <circle cx={260} cy={110} r={34} fill="#7CC36A" />
    {yawn > 0.4 ? (
      <>
        <path d="M144 112 q 16 10 32 0" fill="none" stroke="#1F3A22" strokeWidth={6} strokeLinecap="round" />
        <path d="M244 112 q 16 10 32 0" fill="none" stroke="#1F3A22" strokeWidth={6} strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx={160} cy={110} r={16} fill="#1F3A22" />
        <circle cx={260} cy={110} r={16} fill="#1F3A22" />
        <circle cx={166} cy={104} r={5} fill="white" />
        <circle cx={266} cy={104} r={5} fill="white" />
      </>
    )}
    <ellipse cx={210} cy={170 + yawn * 6} rx={46 - yawn * 10} ry={6 + yawn * 34} fill="#7A2E3A" />
    <circle cx={150} cy={160} r={10} fill={NIGHT.cheek} opacity={0.5} />
    <circle cx={270} cy={160} r={10} fill={NIGHT.cheek} opacity={0.5} />
    <ellipse cx={120} cy={244} rx={34} ry={14} fill="#6AB35A" />
    <ellipse cx={300} cy={244} rx={34} ry={14} fill="#6AB35A" />
  </svg>
);

/** Pink lotus flower. */
export const Lotus: React.FC<{ width: number }> = ({ width }) => (
  <svg viewBox="0 0 200 140" width={width} height={(width * 140) / 200} style={{ overflow: "visible" }}>
    <ellipse cx={100} cy={128} rx={96} ry={16} fill="#3E8A62" />
    {[-60, -30, 0, 30, 60].map((a) => (
      <ellipse key={a} cx={100} cy={70} rx={20} ry={52} transform={`rotate(${a} 100 120)`} fill={a === 0 ? "#F7B6CB" : "#EE93B0"} />
    ))}
    <circle cx={100} cy={100} r={12} fill="#F6D36B" />
  </svg>
);

/** Floating "Z" letters drifting up from a sleeper. */
export const Zzz: React.FC<{ x: number; y: number; size?: number; color?: string }> = ({ x, y, size = 60, color = NIGHT.cream }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {[0, 1, 2].map((k) => {
        const t = ((frame + k * 30) % 90) / 90;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x + t * 90 + Math.sin(t * 6 + k) * 14,
              top: y - t * 220,
              fontFamily: "Poppins",
              fontWeight: 700,
              fontSize: size * (0.6 + t * 0.6),
              color,
              opacity: Math.sin(Math.PI * t) * 0.85,
            }}
          >
            z
          </div>
        );
      })}
    </>
  );
};
