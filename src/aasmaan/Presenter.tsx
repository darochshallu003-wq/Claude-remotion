import React from "react";
import { K } from "./ui";

// "Vigyan Bhaiya": the series' presenter, half body in a lab coat, cut off by
// the bottom of the frame. Arms change between gestures, the mouth follows
// the voice, and he blinks and breathes so he never looks pasted on.

export type Pose = "point" | "open" | "count" | "think" | "wave" | "rest";

type Pt = [number, number];
type Arm = { elbow: Pt; hand: Pt; finger: number }; // finger: 0 fist, 1 index up

const SKIN = "#B9794F";
const SKIN_DARK = "#97603C";
const HAIR = "#1E1715";
const COAT = "#FBFBF7";
const TEE = "#2FB59A";
const INK = K.ink;

// viewer-right arm (shoulder 372,500) and viewer-left arm (shoulder 128,500)
const RIGHT: Record<Pose, Arm> = {
  rest: { elbow: [420, 620], hand: [400, 700], finger: 0 },
  point: { elbow: [468, 430], hand: [470, 262], finger: 1 },
  open: { elbow: [452, 600], hand: [430, 500], finger: 0 },
  count: { elbow: [462, 540], hand: [420, 380], finger: 1 },
  wave: { elbow: [474, 450], hand: [478, 288], finger: 0 },
  think: { elbow: [420, 620], hand: [400, 700], finger: 0 },
};
const LEFT: Record<Pose, Arm> = {
  rest: { elbow: [80, 620], hand: [100, 700], finger: 0 },
  point: { elbow: [80, 620], hand: [100, 700], finger: 0 },
  open: { elbow: [60, 600], hand: [84, 520], finger: 0 },
  count: { elbow: [80, 620], hand: [100, 700], finger: 0 },
  wave: { elbow: [80, 620], hand: [100, 700], finger: 0 },
  think: { elbow: [120, 600], hand: [222, 418], finger: 1 },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPt = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const mix = (a: Arm, b: Arm, t: number): Arm => ({
  elbow: lerpPt(a.elbow, b.elbow, t),
  hand: lerpPt(a.hand, b.hand, t),
  finger: t < 0.5 ? a.finger : b.finger,
});

const ArmShape: React.FC<{ shoulder: Pt; arm: Arm; wave?: number; flip?: boolean }> = ({ shoulder, arm, wave = 0, flip }) => {
  const [hx, hy] = arm.hand;
  const d = `M${shoulder[0]} ${shoulder[1]} Q ${arm.elbow[0]} ${arm.elbow[1]} ${hx} ${hy}`;
  return (
    <g>
      <path d={d} fill="none" stroke={INK} strokeWidth={70} strokeLinecap="round" />
      <path d={d} fill="none" stroke={COAT} strokeWidth={58} strokeLinecap="round" />
      <g transform={`rotate(${wave} ${hx} ${hy})`}>
        {arm.finger === 1 && (
          <rect x={hx - 9} y={hy - 66} width={18} height={50} rx={9} fill={SKIN} stroke={INK} strokeWidth={5} />
        )}
        {arm.finger === 0 && (
          // open palm with four fingers
          <g>
            {[-20, -7, 6, 19].map((dx, i) => (
              <rect key={i} x={hx + dx - 7} y={hy - 52 + Math.abs(dx) * 0.4} width={14} height={36} rx={7} fill={SKIN} stroke={INK} strokeWidth={4.5} />
            ))}
          </g>
        )}
        <circle cx={hx} cy={hy} r={30} fill={SKIN} stroke={INK} strokeWidth={5} />
        <path
          d={flip ? `M${hx + 24} ${hy - 4} q 14 -10 18 -26` : `M${hx - 24} ${hy - 4} q -14 -10 -18 -26`}
          fill="none"
          stroke={INK}
          strokeWidth={5}
          strokeLinecap="round"
        />
      </g>
    </g>
  );
};

type Curl = { x: number; y: number; r: number };

// curls around the crown, from one ear over the top to the other
const BACK_CURLS: Curl[] = Array.from({ length: 15 }, (_, i) => {
  const a = ((-18 + (i * 216) / 14) * Math.PI) / 180;
  return { x: 250 + Math.cos(a) * 152, y: 205 - Math.sin(a) * 118, r: 40 + (i % 3) * 5 };
}).concat([
  { x: 200, y: 110, r: 44 },
  { x: 300, y: 112, r: 44 },
  { x: 250, y: 80, r: 40 },
]);

// smaller curls hanging over the forehead
const FRINGE_CURLS: Curl[] = [
  { x: 156, y: 222, r: 26 },
  { x: 186, y: 200, r: 30 },
  { x: 224, y: 192, r: 30 },
  { x: 264, y: 194, r: 31 },
  { x: 302, y: 198, r: 29 },
  { x: 338, y: 216, r: 27 },
  { x: 236, y: 152, r: 34 },
  { x: 296, y: 156, r: 32 },
];

/** Overlapping circles with one shared outline, each with a little spiral. */
const Curls: React.FC<{ curls: Curl[]; frame: number; fill: React.ReactNode }> = ({ curls, frame, fill }) => {
  const at = curls.map((c, i) => ({ ...c, y: c.y + Math.sin(frame / 7 + i * 1.3) * 1.6 }));
  return (
    <g>
      {at.map((c, i) => (
        <circle key={`o${i}`} cx={c.x} cy={c.y} r={c.r} fill={HAIR} stroke={INK} strokeWidth={7} />
      ))}
      {fill}
      {at.map((c, i) => (
        <circle key={`f${i}`} cx={c.x} cy={c.y} r={c.r - 3.5} fill={HAIR} />
      ))}
      {at.map((c, i) => (
        <path
          key={`s${i}`}
          d={`M${c.x - c.r * 0.45} ${c.y + c.r * 0.1} a ${c.r * 0.42} ${c.r * 0.42} 0 1 1 ${c.r * 0.5} ${c.r * 0.32}`}
          fill="none"
          stroke="#5A463E"
          strokeWidth={5}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
};

export const Presenter: React.FC<{
  width: number;
  frame: number;
  pose: Pose;
  prevPose: Pose;
  poseT: number; // 0 → 1 blend from prevPose to pose
  mouth: number; // 0 closed → 1 wide open
  style?: React.CSSProperties;
}> = ({ width, frame, pose, prevPose, poseT, mouth, style }) => {
  const breathe = Math.sin(frame / 20) * 4;
  const blink = frame % 96 < 4;
  const r = mix(RIGHT[prevPose], RIGHT[pose], poseT);
  const l = mix(LEFT[prevPose], LEFT[pose], poseT);
  const wave = pose === "wave" ? Math.sin(frame / 3.2) * 16 * poseT : 0;
  const thinking = pose === "think" ? poseT : prevPose === "think" ? 1 - poseT : 0;
  const tilt = Math.sin(frame / 13) * 1.6 * Math.min(1, mouth * 3) - thinking * 4;
  // eyes look up-right at the card while pointing, up while thinking
  const look: Pt = pose === "point" || pose === "wave" ? [6, -5] : thinking > 0.5 ? [4, -8] : [3, 0];

  return (
    <svg viewBox="0 0 500 660" width={width} height={(width * 660) / 500} style={{ overflow: "visible", ...style }}>
      <g transform={`translate(0 ${breathe})`}>
        {/* coat body */}
        <path d="M30 680 C 30 560, 70 500, 150 476 L 350 476 C 430 500, 470 560, 470 680 Z" fill={COAT} stroke={INK} strokeWidth={7} />
        {/* tee in the coat's opening */}
        <path d="M196 478 L 304 478 L 286 680 L 214 680 Z" fill={TEE} stroke={INK} strokeWidth={6} />
        <path d="M212 480 C 226 506, 274 506, 288 480" fill="none" stroke={INK} strokeWidth={5} />
        {/* lapels */}
        <path d="M196 478 L 172 540 L 206 560 L 214 680" fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M304 478 L 328 540 L 294 560 L 286 680" fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        {/* pocket with pens */}
        <rect x="96" y="590" width="74" height="70" rx="8" fill={COAT} stroke={INK} strokeWidth={5} />
        <rect x="112" y="566" width="10" height="34" rx="4" fill={K.pink} stroke={INK} strokeWidth={4} />
        <rect x="130" y="574" width="10" height="26" rx="4" fill={K.purple} stroke={INK} strokeWidth={4} />
        {/* atom badge */}
        <g transform="translate(368 600)">
          <circle r="24" fill={K.yellow} stroke={INK} strokeWidth={5} />
          <ellipse rx="15" ry="6" fill="none" stroke={INK} strokeWidth={3} />
          <ellipse rx="15" ry="6" fill="none" stroke={INK} strokeWidth={3} transform="rotate(60)" />
          <ellipse rx="15" ry="6" fill="none" stroke={INK} strokeWidth={3} transform="rotate(-60)" />
          <circle r="3.5" fill={INK} />
        </g>

        {/* neck */}
        <path d="M218 400 L 218 482 C 236 494, 264 494, 282 482 L 282 400 Z" fill={SKIN_DARK} stroke={INK} strokeWidth={6} />

        <g transform={`rotate(${tilt} 250 400)`}>
          {/* hair: a big cloud of curls behind the head */}
          <Curls curls={BACK_CURLS} frame={frame} fill={<ellipse cx="250" cy="200" rx="150" ry="110" fill={HAIR} />} />
          {/* ears */}
          <ellipse cx="128" cy="300" rx="22" ry="30" fill={SKIN} stroke={INK} strokeWidth={6} />
          <ellipse cx="372" cy="300" rx="22" ry="30" fill={SKIN} stroke={INK} strokeWidth={6} />
          {/* head */}
          <path d="M250 150 C 160 150, 130 220, 132 292 C 134 370, 182 424, 250 424 C 318 424, 366 370, 368 292 C 370 220, 340 150, 250 150 Z" fill={SKIN} stroke={INK} strokeWidth={7} />
          {/* curly fringe over the forehead */}
          <Curls curls={FRINGE_CURLS} frame={frame} fill={<ellipse cx="250" cy="170" rx="110" ry="40" fill={HAIR} />} />
          {/* brows */}
          <path d={`M178 ${252 - thinking * 8} C 192 ${242 - thinking * 8}, 212 242, 226 250`} fill="none" stroke={HAIR} strokeWidth={10} strokeLinecap="round" />
          <path d="M274 250 C 288 242, 308 242, 322 252" fill="none" stroke={HAIR} strokeWidth={10} strokeLinecap="round" />
          {/* eyes */}
          {blink ? (
            <>
              <path d="M180 292 C 192 302, 214 302, 226 292" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
              <path d="M274 292 C 286 302, 308 302, 320 292" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
            </>
          ) : (
            [203, 297].map((cx) => (
              <g key={cx}>
                <ellipse cx={cx} cy={290} rx={24} ry={28} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
                <circle cx={cx + look[0]} cy={292 + look[1]} r={12} fill={INK} />
                <circle cx={cx + look[0] + 4} cy={287 + look[1]} r={4} fill="#FFFFFF" />
              </g>
            ))
          )}
          {/* nose */}
          <path d="M250 312 C 244 330, 240 340, 248 344 C 252 346, 258 345, 262 341" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
          {/* cheeks */}
          <ellipse cx="170" cy="342" rx="20" ry="11" fill="#E0705E" opacity={0.4} />
          <ellipse cx="330" cy="342" rx="20" ry="11" fill="#E0705E" opacity={0.4} />
          {/* mouth */}
          {mouth > 0.05 ? (
            <g>
              <path
                d={`M222 368 C 230 ${368 + 14 + mouth * 30}, 270 ${368 + 14 + mouth * 30}, 278 368 C 266 374, 234 374, 222 368 Z`}
                fill="#7A2320"
                stroke={INK}
                strokeWidth={6}
                strokeLinejoin="round"
              />
              <ellipse cx="250" cy={372 + mouth * 22} rx={16} ry={4 + mouth * 5} fill="#E86A6A" />
            </g>
          ) : thinking > 0.5 ? (
            <path d="M232 374 C 244 368, 260 370, 270 378" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          ) : (
            <path d="M220 366 C 236 390, 264 390, 280 366" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          )}
        </g>

        <ArmShape shoulder={[128, 500]} arm={l} flip />
        <ArmShape shoulder={[372, 500]} arm={r} wave={wave} />
      </g>
    </svg>
  );
};
