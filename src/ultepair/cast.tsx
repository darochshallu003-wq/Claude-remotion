import React from "react";
import { useCurrentFrame } from "remotion";
import { INK } from "./art";

// The three characters of "उल्टे पैर", drawn as SVG puppets. Each is placed
// by its feet (x, y) and scaled by s, and animates itself from the current
// frame: walk/run cycles, breathing, blinking and a talking mouth.

const SKIN = "#B9794F";
const HAIR = "#1B1513";

/** Mouth-open amount 0..1 while talking, irregular so it reads as speech. */
const talkOpen = (f: number) => Math.max(0, 0.5 + 0.5 * Math.sin(f * 0.95) * Math.sin(f * 0.37 + 1));

// ---------------------------------------------------------------- Bhola

export type BholaExpr = "calm" | "happy" | "scared" | "shout";
export type BholaArms = "swing" | "wave" | "up" | "point" | "hug" | "fold";

export const Bhola: React.FC<{
  x: number;
  y: number;
  s?: number;
  walk?: 0 | 1 | 2; // still, walk, run
  expr?: BholaExpr;
  arms?: BholaArms;
  can?: boolean;
  look?: number; // pupils -1 (left) .. 1 (right)
  talk?: boolean;
  tremble?: boolean;
  rot?: number; // whole-body rotation (e.g. fallen)
  lean?: number;
  lostChappal?: boolean;
}> = ({ x, y, s = 1, walk = 0, expr = "calm", arms = "swing", can = true, look = 0, talk = false, tremble = false, rot = 0, lean = 0, lostChappal = false }) => {
  const f = useCurrentFrame();
  const ph = f * (walk === 2 ? 0.62 : 0.3);
  const amp = walk === 2 ? 30 : walk ? 15 : 0;
  const legA = Math.sin(ph) * amp;
  const bob = walk ? -Math.abs(Math.sin(ph)) * (walk === 2 ? 16 : 7) : Math.sin(f / 16) * 1.5;
  const shake = tremble ? Math.sin(f * 2.3) * 3 : 0;
  const mouth = talk ? talkOpen(f) : 0;
  const blink = f % 96 < 4 && expr !== "shout" && expr !== "scared";
  const scared = expr === "scared" || expr === "shout";

  let armL = 8 - legA * 0.8;
  let armR = -8 + legA * 0.8;
  if (arms === "wave") {
    armL = 10;
    armR = -145 + Math.sin(f * 0.4) * 18;
  } else if (arms === "up") {
    armL = 160 + Math.sin(f * 1.3) * 10;
    armR = -160 - Math.sin(f * 1.3) * 10;
  } else if (arms === "point") {
    armL = 10;
    armR = -92;
  } else if (arms === "hug") {
    armL = -32;
    armR = 32;
  } else if (arms === "fold") {
    armL = -20;
    armR = 20;
  }

  const Leg: React.FC<{ hx: number; a: number; noChappal?: boolean }> = ({ hx, a, noChappal }) => (
    <g transform={`translate(${hx} -200) rotate(${a})`}>
      <path d="M-26 0 C -32 80, -24 140, -18 172 L 18 172 C 22 140, 28 80, 24 0 Z" fill="#F2EEE4" stroke={INK} strokeWidth={5} />
      <rect x={-11} y={168} width={22} height={22} fill={SKIN} stroke={INK} strokeWidth={4} />
      {!noChappal && <ellipse cx={0} cy={200} rx={26} ry={9} fill="#6B3E22" stroke={INK} strokeWidth={4} />}
      <ellipse cx={2} cy={194} rx={18} ry={8} fill={SKIN} stroke={INK} strokeWidth={4} />
    </g>
  );

  const Arm: React.FC<{ sx: number; a: number; holdCan?: boolean }> = ({ sx, a, holdCan }) => (
    <g transform={`translate(${sx} -318) rotate(${a})`}>
      <path d="M-17 0 C -21 40, -18 80, -14 112 L 14 112 C 18 80, 21 40, 17 0 Z" fill="#3F7D4E" stroke={INK} strokeWidth={5} />
      <circle cx={0} cy={124} r={16} fill={SKIN} stroke={INK} strokeWidth={4} />
      {holdCan && (
        <g transform={`translate(0 124) rotate(${-a - rot - lean})`}>
          <path d="M-18 6 C -18 -14, 18 -14, 18 6" fill="none" stroke="#6d747b" strokeWidth={6} />
          <rect x={-30} y={8} width={60} height={78} rx={10} fill="url(#up-steel)" stroke={INK} strokeWidth={4} />
          <ellipse cx={0} cy={10} rx={24} ry={7} fill="#cfd5da" stroke={INK} strokeWidth={4} />
          <path d="M-30 50 L 30 50" stroke="#7a828a" strokeWidth={4} />
        </g>
      )}
    </g>
  );

  return (
    <g transform={`translate(${x + shake} ${y}) scale(${s}) rotate(${rot + lean} 0 -100)`}>
      <ellipse cx={0} cy={6} rx={80} ry={14} fill="#000" opacity={rot ? 0 : 0.35} />
      <g transform={`translate(0 ${bob})`}>
        <Leg hx={-24} a={legA} noChappal={lostChappal} />
        <Leg hx={24} a={-legA} />
        <path d="M-62 -218 L 62 -218 L 58 -168 L -58 -168 Z" fill="#F2EEE4" stroke={INK} strokeWidth={5} />
        <path d="M-10 -214 L -4 -170 M 14 -214 L 10 -172" stroke="#cfc8b8" strokeWidth={4} />
        {arms !== "hug" && arms !== "fold" && <Arm sx={-64} a={armL} holdCan={can} />}
        {/* kurta */}
        <path d="M-64 -332 C -80 -280, -80 -220, -68 -160 L 68 -160 C 80 -220, 80 -280, 64 -332 C 40 -348, -40 -348, -64 -332 Z" fill="#3F7D4E" stroke={INK} strokeWidth={5} />
        <path d="M0 -336 L 0 -260" stroke={INK} strokeWidth={4} />
        {[-312, -290, -268].map((yy) => (
          <circle key={yy} cx={7} cy={yy} r={3.5} fill="#e9e3d0" />
        ))}
        {/* gamchha over the shoulder */}
        <path d="M-60 -336 C -30 -300, 10 -250, 40 -168 L 62 -176 C 30 -260, -10 -312, -36 -344 Z" fill="#D9572B" stroke={INK} strokeWidth={4} />
        <path d="M-46 -330 C -16 -290, 20 -240, 48 -172 M-56 -318 C -26 -280, 6 -230, 30 -168" stroke="#f3d9a6" strokeWidth={3} fill="none" />
        {arms === "hug" || arms === "fold" ? (
          <>
            <Arm sx={-64} a={armL} />
            <Arm sx={64} a={armR} />
            {can && (
              <g transform="translate(0 -250)">
                <rect x={-34} y={-10} width={68} height={86} rx={10} fill="url(#up-steel)" stroke={INK} strokeWidth={4} />
                <ellipse cx={0} cy={-8} rx={28} ry={8} fill="#cfd5da" stroke={INK} strokeWidth={4} />
              </g>
            )}
          </>
        ) : (
          <Arm sx={64} a={armR} />
        )}
        {/* head */}
        <g transform={`translate(0 -392) rotate(${tremble ? Math.sin(f * 1.7) * 3 : 0})`}>
          <rect x={-14} y={40} width={28} height={30} fill={SKIN} stroke={INK} strokeWidth={4} />
          <circle cx={-57} cy={4} r={13} fill={SKIN} stroke={INK} strokeWidth={4} />
          <circle cx={57} cy={4} r={13} fill={SKIN} stroke={INK} strokeWidth={4} />
          <ellipse cx={0} cy={0} rx={56} ry={60} fill={SKIN} stroke={INK} strokeWidth={5} />
          <path d="M-58 -6 C -64 -70, 64 -70, 58 -6 C 50 -36, 20 -44, 0 -40 C -20 -44, -50 -36, -58 -6 Z" fill={HAIR} />
          {/* eyes */}
          {[-21, 21].map((ex) => (
            <g key={ex}>
              {blink ? (
                <path d={`M${ex - 12} -4 q 12 6 24 0`} stroke={INK} strokeWidth={4} fill="none" />
              ) : (
                <>
                  <ellipse cx={ex} cy={-4} rx={scared ? 14 : 12} ry={scared ? 17 : 11} fill="#fff" stroke={INK} strokeWidth={3.5} />
                  <circle cx={ex + look * 5} cy={-3} r={scared ? 4.5 : 6} fill={INK} />
                </>
              )}
              <path
                d={scared ? `M${ex - 14} -32 q 14 -12 28 0` : expr === "happy" ? `M${ex - 13} -24 q 13 -8 26 0` : `M${ex - 13} -22 l 26 ${ex < 0 ? -3 : 3}`}
                stroke={HAIR}
                strokeWidth={6}
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ))}
          <path d="M-4 4 q 8 14 -2 20" stroke={INK} strokeWidth={4} fill="none" />
          {/* mouth */}
          {expr === "shout" ? (
            <ellipse cx={0} cy={40} rx={20} ry={16 + mouth * 6} fill="#5a1414" stroke={INK} strokeWidth={4} />
          ) : expr === "scared" ? (
            <ellipse cx={0} cy={40} rx={9} ry={6 + mouth * 8} fill="#5a1414" stroke={INK} strokeWidth={3.5} />
          ) : mouth > 0.05 ? (
            <path d={`M-16 34 Q 0 ${40 + mouth * 18} 16 34 Z`} fill="#5a1414" stroke={INK} strokeWidth={3.5} />
          ) : (
            <path d={expr === "happy" ? "M-18 34 Q 0 52 18 34" : "M-14 37 Q 0 45 14 37"} stroke={INK} strokeWidth={4} fill="none" />
          )}
          {/* big mustache */}
          <path d="M-42 22 C -22 8, -6 14, 0 22 C 6 14, 22 8, 42 22 C 34 32, 14 28, 0 28 C -14 28, -34 32, -42 22 Z" fill={HAIR} />
          {scared &&
            [0, 1].map((k) => {
              const p = ((f + k * 15) % 30) / 30;
              return <path key={k} d={`M${62 - k * 128} ${-30 + p * 40} q 6 10 0 16 q -6 -6 0 -16 Z`} fill="#9fd3ff" opacity={1 - p} />;
            })}
        </g>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- Kamla (chudail)

export type WitchMood = "scary" | "shy" | "happy";

export const Witch: React.FC<{
  x: number;
  y: number;
  s?: number;
  mood?: WitchMood;
  talk?: boolean;
  arms?: "reach" | "down" | "cup" | "wave";
  dir?: 1 | -1; // direction she travels; her toes point the other way
  float?: boolean;
  feet?: boolean;
}> = ({ x, y, s = 1, mood = "scary", talk = false, arms = "reach", dir = 1, float = true, feet = true }) => {
  const f = useCurrentFrame();
  const hover = float ? Math.sin(f / 14) * 12 : 0;
  const mouth = talk ? talkOpen(f) : 0;
  const w = (k: number) => Math.sin(f / 9 + k) * 14;
  const scary = mood === "scary";
  const face = "#BFC9BC";

  const hairBack = `M-78 -470 C -120 -400, ${-130 + w(1)} -300, ${-118 + w(2)} -190 C ${-96 + w(3)} -150, ${-70 + w(4)} -170, -50 -200 L 50 -200 C ${70 + w(5)} -170, ${96 + w(6)} -150, ${118 + w(7)} -190 C ${130 + w(8)} -300, 120 -400, 78 -470 C 50 -510, -50 -510, -78 -470 Z`;

  const armAngle = arms === "reach" ? 112 + Math.sin(f / 7) * 8 : arms === "wave" ? 150 + Math.sin(f / 4) * 15 : arms === "cup" ? -40 : 12;

  const hem = Array.from({ length: 14 }, (_, i) => {
    const xx = -130 + i * 20;
    return `L ${xx + 10} ${i % 2 ? -4 : 14 + Math.sin(f / 8 + i) * 4} L ${xx + 20} 0`;
  }).join(" ");

  const Arm: React.FC<{ side: 1 | -1 }> = ({ side }) => {
    const a = arms === "cup" ? side * 40 : arms === "wave" && side === -1 ? 14 : side === 1 ? armAngle * -1 : armAngle;
    return (
      <g transform={`translate(${side * 62} -340) rotate(${a})`}>
        <path d="M-12 0 C -14 60, -10 120, -8 160 L 8 160 C 10 120, 14 60, 12 0 Z" fill="#D2D4CA" stroke={INK} strokeWidth={4} />
        <path d="M-7 156 L 7 156 L 6 186 L -6 186 Z" fill={face} stroke={INK} strokeWidth={3} />
        {(arms === "reach" || (arms === "wave" && side === 1)) &&
          [-6, -2, 2, 6].map((cx) => <path key={cx} d={`M${cx} 184 l ${cx * 0.6} 26`} stroke="#2a2a2a" strokeWidth={3} strokeLinecap="round" />)}
      </g>
    );
  };

  // feet hang below the hem in profile, toes pointing AGAINST her travel
  const Foot: React.FC<{ fx: number }> = ({ fx }) => (
    <g transform={`translate(${fx} 14) scale(${dir} 1)`}>
      <path d="M-10 -10 L 10 -10 L 12 18 C 14 26, 6 30, -2 30 L -38 30 C -46 30, -48 22, -40 18 L -12 12 Z" fill={face} stroke={INK} strokeWidth={4} />
      {Array.from({ length: 6 }, (_, k) => (
        <circle key={k} cx={-8 + k * 4} cy={6 + (k % 2) * 2} r={2.6} fill="#d4af37" />
      ))}
    </g>
  );

  return (
    <g transform={`translate(${x} ${y + hover}) scale(${s})`}>
      <ellipse cx={0} cy={float ? 90 - hover : 40} rx={90} ry={16} fill="#000" opacity={0.25} />
      <path d={hairBack} fill="#0B0A0E" />
      {feet && (
        <>
          <Foot fx={-30} />
          <Foot fx={34} />
        </>
      )}
      {/* sari */}
      <path d={`M-72 -362 C -110 -250, -120 -100, -130 0 ${hem} C 120 -100, 110 -250, 72 -362 C 40 -380, -40 -380, -72 -362 Z`} fill="#DCDDD3" stroke={INK} strokeWidth={5} />
      <path d="M-70 -350 C -20 -300, 40 -200, 100 -60 L 118 -90 C 90 -200, 40 -300, 50 -370 Z" fill="#C6C8BC" stroke={INK} strokeWidth={4} />
      <ellipse cx={-50} cy={-110} rx={26} ry={12} fill="#9fa294" opacity={0.5} />
      <ellipse cx={40} cy={-200} rx={18} ry={9} fill="#9fa294" opacity={0.4} />
      <Arm side={-1} />
      <Arm side={1} />
      {arms === "cup" && (
        <g transform="translate(0 -205)">
          <path d="M-20 -24 L 20 -24 L 16 10 L -16 10 Z" fill="#f2efe6" stroke={INK} strokeWidth={4} />
          <path d="M20 -16 q 14 4 0 18" stroke={INK} strokeWidth={4} fill="none" />
          <path d={`M-6 -34 c 8 -12 -8 -20 0 -34`} stroke="#eef" strokeWidth={4} fill="none" opacity={0.5 + 0.3 * Math.sin(f / 5)} />
        </g>
      )}
      {/* head */}
      <g transform={`translate(0 -428) rotate(${scary ? Math.sin(f / 11) * 4 : mood === "shy" ? -8 : 0})`}>
        <ellipse cx={0} cy={0} rx={50} ry={62} fill={face} stroke={INK} strokeWidth={5} />
        {scary && <path d="M-30 -40 l 10 18 l -6 10 M 26 30 l 8 12" stroke="#5f6a63" strokeWidth={3} fill="none" />}
        {scary ? (
          <>
            <ellipse cx={-20} cy={-6} rx={18} ry={14} fill="#3b404a" opacity={0.75} />
            <ellipse cx={20} cy={-6} rx={18} ry={14} fill="#3b404a" opacity={0.75} />
            <g filter="url(#up-glow)">
              <ellipse cx={-20} cy={-6} rx={11} ry={8} fill="#f6e05e" />
              <ellipse cx={20} cy={-6} rx={11} ry={8} fill="#f6e05e" />
            </g>
            <ellipse cx={-20} cy={-6} rx={2.5} ry={7} fill="#7a1010" />
            <ellipse cx={20} cy={-6} rx={2.5} ry={7} fill="#7a1010" />
            <path d="M-34 -24 L -8 -16 M 34 -24 L 8 -16" stroke="#1a1a1a" strokeWidth={5} strokeLinecap="round" />
            <path d={`M-18 26 Q 0 ${22 + mouth * 4} 18 26 Q 0 ${38 + mouth * 22} -18 26 Z`} fill="#3a0808" stroke={INK} strokeWidth={3} />
            <path d="M-11 27 l 3 10 l 3 -9 M 5 27 l 3 10 l 3 -10" fill="#fff" />
          </>
        ) : (
          <>
            <ellipse cx={-19} cy={-4} rx={10} ry={mood === "happy" ? 6 : 10} fill="#fff" stroke={INK} strokeWidth={3} />
            <ellipse cx={19} cy={-4} rx={10} ry={mood === "happy" ? 6 : 10} fill="#fff" stroke={INK} strokeWidth={3} />
            <circle cx={-19} cy={mood === "shy" ? 0 : -3} r={5} fill={INK} />
            <circle cx={19} cy={mood === "shy" ? 0 : -3} r={5} fill={INK} />
            <path d="M-30 -24 q 10 -6 20 -2 M 30 -24 q -10 -6 -20 -2" stroke="#1a1a1a" strokeWidth={4} fill="none" strokeLinecap="round" />
            <ellipse cx={-30} cy={16} rx={10} ry={5} fill="#e88a9a" opacity={0.7} />
            <ellipse cx={30} cy={16} rx={10} ry={5} fill="#e88a9a" opacity={0.7} />
            {mouth > 0.05 ? (
              <ellipse cx={0} cy={30} rx={10} ry={3 + mouth * 9} fill="#5a1414" stroke={INK} strokeWidth={3} />
            ) : (
              <path d={mood === "happy" ? "M-14 26 Q 0 40 14 26" : "M-10 30 q 5 -4 10 0 q 5 4 10 0"} stroke={INK} strokeWidth={3.5} fill="none" />
            )}
          </>
        )}
        <circle cx={0} cy={-34} r={5} fill="#b3261e" />
        {/* front hair */}
        <path d={`M-52 -30 C -62 -70, -20 -78, 0 -64 C 20 -78, 62 -70, 52 -30 C 60 20, ${66 + w(9) * 0.5} 90, ${54 + w(10) * 0.6} 150 L 40 150 C 44 80, 40 20, 36 -30 C 20 -52, -20 -52, -36 -30 C -40 20, -44 80, -40 150 L ${-54 + w(11) * 0.6} 150 C ${-66 + w(12) * 0.5} 90, -60 20, -52 -30 Z`} fill="#0B0A0E" />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- Dadi

export type DadiExpr = "stern" | "surprised" | "smile";

export const Dadi: React.FC<{
  x: number;
  y: number;
  s?: number;
  expr?: DadiExpr;
  talk?: boolean;
  lantern?: boolean;
  wag?: boolean;
  point?: boolean;
  lean?: number;
}> = ({ x, y, s = 1, expr = "stern", talk = false, lantern = true, wag = false, point = false, lean = 0 }) => {
  const f = useCurrentFrame();
  const mouth = talk ? talkOpen(f) : 0;
  const breathe = Math.sin(f / 18) * 2;
  const flick = 0.85 + 0.15 * Math.sin(f * 0.7) * Math.sin(f * 0.31);
  const SK = "#A8704A";
  const rArm = wag ? -150 + Math.sin(f * 0.6) * 14 : point ? -100 : -14;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${lean} 0 0)`}>
      <ellipse cx={0} cy={6} rx={90} ry={14} fill="#000" opacity={0.35} />
      {!wag && !point && (
        <g>
          <path d="M70 -150 L 96 4" stroke="#6b4423" strokeWidth={10} strokeLinecap="round" />
        </g>
      )}
      <g transform={`translate(0 ${breathe}) rotate(6 0 -100)`}>
        {/* sari body */}
        <path d="M-58 -270 C -84 -200, -96 -100, -92 0 L 92 0 C 96 -100, 84 -200, 58 -270 C 30 -290, -30 -290, -58 -270 Z" fill="#EFEDE6" stroke={INK} strokeWidth={5} />
        <path d="M-92 -6 L 92 -6" stroke="#7A1F2B" strokeWidth={14} />
        <path d="M-58 -270 C -20 -220, 30 -160, 80 -120" stroke="#7A1F2B" strokeWidth={10} fill="none" />
        {/* lantern arm (her right, our left) */}
        <g transform="translate(-58 -250) rotate(30)">
          <path d="M-12 0 C -14 50, -10 90, -8 120 L 8 120 C 10 90, 14 50, 12 0 Z" fill="#E4E1D8" stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={130} r={13} fill={SK} stroke={INK} strokeWidth={4} />
          {lantern && (
            <g transform="translate(0 132) rotate(-30)">
              <circle cx={0} cy={60} r={170} fill="url(#up-warm)" opacity={0.7 * flick} />
              <path d="M-14 0 q 14 -16 28 0" stroke="#333" strokeWidth={4} fill="none" />
              <rect x={-24} y={8} width={48} height={14} fill="#4b3a2a" stroke={INK} strokeWidth={3} />
              <path d="M-20 22 C -32 50, -32 80, -20 100 L 20 100 C 32 80, 32 50, 20 22 Z" fill="#ffd27a" opacity={0.9} stroke={INK} strokeWidth={3} />
              <path d={`M0 ${86} c -8 -12, -2 -24, 0 ${-30 - flick * 6} c 4 10, 8 20, 0 30 Z`} fill="#ff8c2a" />
              <rect x={-26} y={98} width={52} height={12} fill="#4b3a2a" stroke={INK} strokeWidth={3} />
            </g>
          )}
        </g>
        {/* right arm: stick, wag or point */}
        <g transform={`translate(58 -250) rotate(${rArm})`}>
          <path d="M-12 0 C -14 50, -10 90, -8 120 L 8 120 C 10 90, 14 50, 12 0 Z" fill="#E4E1D8" stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={130} r={13} fill={SK} stroke={INK} strokeWidth={4} />
          {(wag || point) && <path d="M0 140 l 0 26" stroke={SK} strokeWidth={8} strokeLinecap="round" />}
        </g>
        {/* head with pallu */}
        <g transform="translate(0 -318)">
          <path d="M-62 30 C -70 -50, -40 -80, 0 -82 C 40 -80, 70 -50, 62 30 C 70 60, 50 70, 40 60 L -40 60 C -50 70, -70 60, -62 30 Z" fill="#EFEDE6" stroke={INK} strokeWidth={5} />
          <path d="M-62 30 C -70 -50, -40 -80, 0 -82 C 40 -80, 70 -50, 62 30" stroke="#7A1F2B" strokeWidth={9} fill="none" />
          <ellipse cx={0} cy={4} rx={44} ry={50} fill={SK} stroke={INK} strokeWidth={5} />
          <path d="M-40 -24 C -30 -50, 30 -50, 40 -24 C 20 -36, -20 -36, -40 -24 Z" fill="#d8d3ca" />
          <path d="M-30 -6 q -6 4 -10 10 M 30 -6 q 6 4 10 10 M -16 30 q 16 6 32 0" stroke="#7d4f31" strokeWidth={2.5} fill="none" />
          {/* round glasses */}
          {[-17, 17].map((ex) => (
            <g key={ex}>
              <circle cx={ex} cy={0} r={14} fill="#fff" fillOpacity={0.25} stroke="#2b2b2b" strokeWidth={3.5} />
              {expr === "surprised" ? <circle cx={ex} cy={0} r={5} fill={INK} /> : expr === "smile" ? <path d={`M${ex - 7} 2 q 7 -7 14 0`} stroke={INK} strokeWidth={3} fill="none" /> : <circle cx={ex} cy={2} r={3.5} fill={INK} />}
              <path d={expr === "stern" ? `M${ex - 12} -20 l 24 ${ex < 0 ? 6 : -6}` : `M${ex - 12} -22 q 12 -8 24 0`} stroke="#e7e2d9" strokeWidth={5} strokeLinecap="round" />
            </g>
          ))}
          <path d="M-3 0 l 6 0" stroke="#2b2b2b" strokeWidth={3} />
          <path d="M28 -2 c 3 -6 8 -4 10 0" stroke="#fff" strokeWidth={2} fill="none" opacity={0.7 + 0.3 * Math.sin(f / 6)} />
          <path d="M0 8 q 4 8 -2 12" stroke="#7d4f31" strokeWidth={3} fill="none" />
          {expr === "surprised" ? (
            <ellipse cx={0} cy={32} rx={8} ry={9 + mouth * 4} fill="#4a1010" stroke={INK} strokeWidth={3} />
          ) : mouth > 0.05 ? (
            <ellipse cx={0} cy={32} rx={11} ry={2 + mouth * 9} fill="#4a1010" stroke={INK} strokeWidth={3} />
          ) : (
            <path d={expr === "smile" ? "M-14 28 Q 0 42 14 28" : "M-12 34 Q 0 28 12 34"} stroke={INK} strokeWidth={3.5} fill="none" />
          )}
        </g>
      </g>
    </g>
  );
};

/** Brass lota of milk. */
export const Lota: React.FC<{ x: number; y: number; s?: number; glow?: number }> = ({ x, y, s = 1, glow = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow > 0 && <circle cx={0} cy={-40} r={120} fill="url(#up-warm)" opacity={glow} />}
    <path d="M-30 0 C -60 -20, -60 -70, -24 -80 L -20 -96 L 20 -96 L 24 -80 C 60 -70, 60 -20, 30 0 Z" fill="#c9962e" stroke={INK} strokeWidth={4} />
    <ellipse cx={0} cy={-98} rx={26} ry={7} fill="#f5f2ea" stroke={INK} strokeWidth={3} />
    <path d="M-34 -50 C -20 -40, 20 -40, 34 -50" stroke="#e8c15a" strokeWidth={4} fill="none" />
  </g>
);
