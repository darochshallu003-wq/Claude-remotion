import React from "react";
import { useCurrentFrame } from "remotion";

// Illustrated cast for the Ram-return map, in the series' flat-ink style.
// Portraits are busts drawn in a 200x200 box so they sit inside the round
// map medallions; each has a small idle loop (breathing, blinking, a glint
// on the crown) so they stay alive while the camera holds on them.

const INK = "#1E1A17";
const GOLD = "#E2B33C";
const GOLD_DARK = "#A8781C";

export type Who = "ram" | "sita" | "lakshman" | "hanuman" | "bharat";

type Look = {
  skin: string;
  garment: string;
  sash: string;
  crown: "mukut" | "small" | "none";
  female?: boolean;
  monkey?: boolean;
  bow?: boolean;
  paduka?: boolean;
};

const LOOKS: Record<Who, Look> = {
  ram: { skin: "#4F7FC0", garment: "#F2C230", sash: "#C8442E", crown: "mukut", bow: true },
  sita: { skin: "#E7B98C", garment: "#C8302E", sash: "#F2C230", crown: "small", female: true },
  lakshman: { skin: "#E2B07E", garment: "#E58A2C", sash: "#2E6B5E", crown: "small", bow: true },
  hanuman: { skin: "#D9692B", garment: "#C8302E", sash: "#F2C230", crown: "small", monkey: true },
  bharat: { skin: "#5E86B8", garment: "#F4ECD8", sash: "#C8442E", crown: "none", paduka: true },
};

export const Bust: React.FC<{ who: Who; seed?: number }> = ({ who, seed = 0 }) => {
  const f = useCurrentFrame() + seed * 41;
  const L = LOOKS[who];
  const breathe = Math.sin(f / 16) * 2.2;
  const tilt = Math.sin(f / 37) * 2;
  const blink = f % 96 < 4;
  const glint = (Math.sin(f / 9) + 1) / 2;
  const muzzle = "#F4C99A";

  return (
    <g>
      {/* halo */}
      <circle cx="100" cy="92" r="70" fill="#F7D774" opacity={0.22 + glint * 0.12} />
      <g transform={`translate(0 ${breathe})`}>
        {/* bow over the shoulder */}
        {L.bow && (
          <g>
            <path d="M42 70 C 8 120, 18 180, 58 214" fill="none" stroke="#7A4A22" strokeWidth={8} strokeLinecap="round" />
            <path d="M42 70 L 58 214" stroke="#F4ECD8" strokeWidth={2} />
          </g>
        )}
        {/* long hair behind */}
        {L.female && <path d="M58 70 C 44 130, 50 170, 62 200 L 138 200 C 150 170, 156 130, 142 70 Z" fill="#1B1513" stroke={INK} strokeWidth={4} />}
        {/* shoulders / garment */}
        <path d="M30 210 C 34 160, 62 142, 100 142 C 138 142, 166 160, 170 210 Z" fill={L.garment} stroke={INK} strokeWidth={5} />
        <path d="M62 150 L 140 210" stroke={L.sash} strokeWidth={14} />
        {/* necklace */}
        <path d="M74 150 C 84 172, 116 172, 126 150" fill="none" stroke={GOLD} strokeWidth={5} />
        <circle cx="100" cy="168" r="5" fill={L.sash} stroke={GOLD} strokeWidth={2} />
        {/* paduka held at the chest */}
        {L.paduka && (
          <g transform="translate(100 182) rotate(-8)">
            <ellipse cx="-14" cy="0" rx="11" ry="22" fill="#B07A3A" stroke={INK} strokeWidth={3} />
            <ellipse cx="14" cy="0" rx="11" ry="22" fill="#B07A3A" stroke={INK} strokeWidth={3} />
            <circle cx="-14" cy="-10" r="3.5" fill={GOLD} />
            <circle cx="14" cy="-10" r="3.5" fill={GOLD} />
          </g>
        )}
        <g transform={`rotate(${tilt} 100 110)`}>
          {/* neck */}
          <rect x="88" y="118" width="24" height="28" fill={L.skin} stroke={INK} strokeWidth={4} />
          {/* ears */}
          {L.monkey ? (
            <>
              <circle cx="58" cy="96" r="14" fill={L.skin} stroke={INK} strokeWidth={4} />
              <circle cx="142" cy="96" r="14" fill={L.skin} stroke={INK} strokeWidth={4} />
              <circle cx="58" cy="96" r="6" fill={muzzle} />
              <circle cx="142" cy="96" r="6" fill={muzzle} />
            </>
          ) : (
            <>
              <ellipse cx="64" cy="98" rx="7" ry="11" fill={L.skin} stroke={INK} strokeWidth={4} />
              <ellipse cx="136" cy="98" rx="7" ry="11" fill={L.skin} stroke={INK} strokeWidth={4} />
              <circle cx="64" cy="114" r="4" fill={GOLD} />
              <circle cx="136" cy="114" r="4" fill={GOLD} />
            </>
          )}
          {/* face */}
          <ellipse cx="100" cy="94" rx="36" ry="40" fill={L.skin} stroke={INK} strokeWidth={5} />
          {L.monkey && <ellipse cx="100" cy="112" rx="24" ry="18" fill={muzzle} stroke={INK} strokeWidth={3} />}
          {/* hair line */}
          {!L.monkey && (
            <path
              d={L.female ? "M64 86 C 70 52, 130 52, 136 86 C 120 70, 80 70, 64 86 Z" : "M64 84 C 68 56, 132 56, 136 84 C 122 74, 78 74, 64 84 Z"}
              fill="#1B1513"
            />
          )}
          {/* veil for Sita */}
          {L.female && <path d="M56 92 C 58 40, 142 40, 144 92 L 150 150 C 140 120, 136 70, 100 62 C 64 70, 60 120, 50 150 Z" fill={L.garment} stroke={INK} strokeWidth={4} opacity={0.95} />}
          {/* eyes */}
          {blink ? (
            <>
              <path d="M80 94 L 92 94" stroke={INK} strokeWidth={4} strokeLinecap="round" />
              <path d="M108 94 L 120 94" stroke={INK} strokeWidth={4} strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx="86" cy="94" rx="7" ry="5.5" fill="#FFF" stroke={INK} strokeWidth={2.5} />
              <ellipse cx="114" cy="94" rx="7" ry="5.5" fill="#FFF" stroke={INK} strokeWidth={2.5} />
              <circle cx="87" cy="94" r="3.4" fill={INK} />
              <circle cx="115" cy="94" r="3.4" fill={INK} />
            </>
          )}
          {/* brows */}
          <path d="M77 84 Q 86 79 94 83" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          <path d="M106 83 Q 114 79 123 84" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
          {/* tilak / bindi */}
          {L.female ? (
            <circle cx="100" cy="80" r="4" fill="#C8202A" />
          ) : (
            !L.monkey && <path d="M100 66 L 100 84" stroke="#C8202A" strokeWidth={4} strokeLinecap="round" />
          )}
          {L.monkey && <path d="M100 68 L 100 82" stroke="#C8202A" strokeWidth={5} strokeLinecap="round" />}
          {/* nose + smile */}
          {L.monkey ? (
            <>
              <ellipse cx="100" cy="106" rx="6" ry="3.5" fill={INK} />
              <path d="M86 118 Q 100 128 114 118" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M100 98 Q 97 108 102 110" fill="none" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
              <path d="M89 118 Q 100 125 111 118" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
              {L.female && <circle cx="94" cy="108" r="3" fill="none" stroke={GOLD} strokeWidth={1.8} />}
            </>
          )}
          {/* crown */}
          {L.crown === "mukut" && (
            <g>
              <path d="M66 70 L 70 34 L 84 48 L 100 18 L 116 48 L 130 34 L 134 70 Z" fill={GOLD} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
              <rect x="64" y="64" width="72" height="10" rx="3" fill={GOLD_DARK} stroke={INK} strokeWidth={3} />
              <circle cx="100" cy="46" r="7" fill="#C8202A" stroke={INK} strokeWidth={2} />
              <circle cx="97" cy="43" r={2 + glint * 1.6} fill="#FFF" opacity={0.85} />
            </g>
          )}
          {L.crown === "small" && !L.female && (
            <g>
              <path d="M70 66 L 76 44 L 100 32 L 124 44 L 130 66 Z" fill={GOLD} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
              <circle cx="100" cy="50" r="5" fill="#2E6B5E" stroke={INK} strokeWidth={2} />
              <circle cx="98" cy="48" r={1.5 + glint * 1.3} fill="#FFF" opacity={0.85} />
            </g>
          )}
          {L.crown === "small" && L.female && (
            <g>
              <path d="M78 58 Q 100 44 122 58" fill="none" stroke={GOLD} strokeWidth={5} />
              <circle cx="100" cy="50" r="5" fill="#C8202A" stroke={GOLD} strokeWidth={2} />
            </g>
          )}
          {L.crown === "none" && <path d="M66 66 C 80 40, 120 40, 134 66" fill="none" stroke="#1B1513" strokeWidth={10} strokeLinecap="round" />}
        </g>
      </g>
    </g>
  );
};

/** Round portrait like the reference medallions: dark disc, white ring. */
export const Medallion: React.FC<{ who: Who; size: number; seed?: number }> = ({ who, size, seed }) => {
  const id = `med-${who}-${seed ?? 0}`;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ overflow: "visible", display: "block" }}>
      <defs>
        <clipPath id={id}>
          <circle cx="100" cy="100" r="92" />
        </clipPath>
        <radialGradient id={`${id}-bg`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#4A3A2C" />
          <stop offset="1" stopColor="#1E1712" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="104" r="98" fill="rgba(0,0,0,0.35)" />
      <circle cx="100" cy="100" r="96" fill="#FBF6EA" />
      <circle cx="100" cy="100" r="92" fill={`url(#${id}-bg)`} />
      <g clipPath={`url(#${id})`}>
        <Bust who={who} seed={seed} />
      </g>
    </svg>
  );
};

/**
 * Pushpaka Vimana, side view: a golden swan-prowed sky-chariot carrying a
 * small temple pavilion, wings beating, with Ram, Sita and Lakshman aboard.
 */
export const Vimana: React.FC<{ width: number }> = ({ width }) => {
  const f = useCurrentFrame();
  const flap = Math.sin(f / 3.2);
  const bob = Math.sin(f / 10) * 3;
  const flame = 0.6 + 0.4 * Math.abs(Math.sin(f / 2.3));
  return (
    <svg viewBox="-110 -110 220 160" width={width} height={(width * 160) / 220} style={{ overflow: "visible", display: "block" }}>
      <g transform={`translate(0 ${bob})`}>
        {/* far wing */}
        <path d={`M-10 0 C -30 ${-40 - flap * 26}, -70 ${-50 - flap * 30}, -96 ${-38 - flap * 34} C -66 ${-24 - flap * 12}, -40 -8, -16 6 Z`} fill="#D9A62C" stroke={INK} strokeWidth={3} opacity={0.85} />
        {/* hull */}
        <path d="M-70 4 C -60 30, 50 30, 66 4 Z" fill={GOLD} stroke={INK} strokeWidth={4} />
        <path d="M-60 12 L 56 12" stroke={GOLD_DARK} strokeWidth={3} />
        {[-44, -22, 0, 22, 44].map((x) => (
          <circle key={x} cx={x} cy={18} r={3} fill="#C8202A" />
        ))}
        {/* swan neck + head at the prow */}
        <path d="M60 6 C 84 -4, 76 -36, 92 -44" fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" />
        <path d="M60 6 C 84 -4, 76 -36, 92 -44" fill="none" stroke="#FBF6EA" strokeWidth={8} strokeLinecap="round" />
        <path d="M92 -48 L 108 -42 L 92 -38 Z" fill="#E58A2C" stroke={INK} strokeWidth={2} />
        <circle cx="92" cy="-46" r="2" fill={INK} />
        {/* tail plume */}
        <path d="M-68 4 C -86 -6, -96 -24, -88 -40 C -82 -24, -74 -14, -60 -6" fill="#C8442E" stroke={INK} strokeWidth={3} />
        {/* pavilion */}
        <rect x="-36" y="-24" width="62" height="28" fill="#F4ECD8" stroke={INK} strokeWidth={3} />
        <path d="M-42 -24 L -4 -70 L 32 -24 Z" fill="#C8442E" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
        <path d="M-4 -70 L -4 -84" stroke={INK} strokeWidth={3} />
        <path d="M-4 -84 L 10 -79 L -4 -74 Z" fill="#E58A2C" stroke={INK} strokeWidth={1.5} />
        {/* passengers: Lakshman, Ram (blue), Sita */}
        {[
          { x: -24, c: "#E2B07E", crown: true },
          { x: -4, c: "#4F7FC0", crown: true },
          { x: 15, c: "#E7B98C", crown: false },
        ].map((p) => (
          <g key={p.x}>
            <circle cx={p.x} cy={-6} r={8} fill={p.c} stroke={INK} strokeWidth={2.5} />
            {p.crown ? (
              <path d={`M${p.x - 7} -12 L ${p.x} -24 L ${p.x + 7} -12 Z`} fill={GOLD} stroke={INK} strokeWidth={2} />
            ) : (
              <path d={`M${p.x - 9} -4 C ${p.x - 9} -20, ${p.x + 9} -20, ${p.x + 9} -4`} fill="#C8302E" stroke={INK} strokeWidth={2} />
            )}
          </g>
        ))}
        {/* near wing */}
        <path d={`M-4 6 C -18 ${-30 - flap * 30}, -50 ${-44 - flap * 34}, -80 ${-34 - flap * 38} C -50 ${-14 - flap * 14}, -30 4, -8 14 Z`} fill="#F2C94C" stroke={INK} strokeWidth={3.5} />
        {/* divine glow under the hull */}
        <ellipse cx="-2" cy="34" rx={46 * flame} ry={8 * flame} fill="#FFE9A3" opacity={0.55} />
      </g>
    </svg>
  );
};

/** Hanuman in flight, gada forward, tail streaming behind. */
export const FlyingHanuman: React.FC<{ width: number }> = ({ width }) => {
  const f = useCurrentFrame();
  const wave = Math.sin(f / 4);
  return (
    <svg viewBox="-80 -50 160 100" width={width} height={(width * 100) / 160} style={{ overflow: "visible", display: "block" }}>
      <path d={`M-30 4 C -50 ${-10 + wave * 8}, -62 ${14 - wave * 8}, -76 ${-6 + wave * 10}`} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" />
      <path d={`M-30 4 C -50 ${-10 + wave * 8}, -62 ${14 - wave * 8}, -76 ${-6 + wave * 10}`} fill="none" stroke="#D9692B" strokeWidth={4.5} strokeLinecap="round" />
      {/* body */}
      <path d="M-34 -2 C -20 -14, 18 -14, 30 -4 C 18 8, -20 12, -34 -2 Z" fill="#D9692B" stroke={INK} strokeWidth={3.5} />
      <path d="M-30 2 C -16 12, -2 12, 6 4" fill="#C8302E" stroke={INK} strokeWidth={3} />
      {/* legs trailing */}
      <path d="M-30 0 L -50 6" stroke={INK} strokeWidth={7} strokeLinecap="round" />
      <path d="M-30 0 L -50 6" stroke="#D9692B" strokeWidth={4} strokeLinecap="round" />
      {/* head */}
      <circle cx="40" cy="-8" r="13" fill="#D9692B" stroke={INK} strokeWidth={3.5} />
      <ellipse cx="46" cy="-3" rx="8" ry="6" fill="#F4C99A" stroke={INK} strokeWidth={2} />
      <circle cx="42" cy="-12" r="2.2" fill={INK} />
      <path d="M30 -18 L 40 -28 L 50 -18 Z" fill={GOLD} stroke={INK} strokeWidth={2} />
      {/* arm + gada */}
      <path d="M22 -6 L 52 -26" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d="M22 -6 L 52 -26" stroke="#D9692B" strokeWidth={3} strokeLinecap="round" />
      <path d="M50 -24 L 62 -38" stroke={INK} strokeWidth={4} />
      <circle cx="66" cy="-42" r="9" fill={GOLD} stroke={INK} strokeWidth={3} />
    </svg>
  );
};
