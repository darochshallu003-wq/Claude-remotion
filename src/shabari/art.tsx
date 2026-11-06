import React from "react";

// Characters and props for the Shabari reel, drawn as flat storybook
// cartoons: solid fills, a dark-brown ink outline, soft blush.
//
// Character coordinates: the neck base sits at (0, 0); the head centre is at
// (0, -112); a standing figure's feet reach y ≈ 650.

export const INK = "#3B2418";
export const SAFFRON = "#E8892B";
export const SAFFRON_DARK = "#C0661D";
export const SAFFRON_LIGHT = "#F4A956";
export const GOLD = "#E9B93F";
export const BERRY = "#C8322B";
export const BERRY_ORANGE = "#E8742A";
export const LEAF = "#5E8C3A";
export const LEAF_DARK = "#3F6B2A";

type Who = "shabari" | "ram" | "lakshman";

const SKIN: Record<Who, { base: string; shade: string; lip: string }> = {
  shabari: { base: "#B9774E", shade: "#9A5F3C", lip: "#7A3A2C" },
  ram: { base: "#5F8FD3", shade: "#4772B6", lip: "#3B3F7A" },
  lakshman: { base: "#EDBE92", shade: "#D49F72", lip: "#A24E48" },
};

const HAIR: Record<Who, { base: string; hi: string }> = {
  shabari: { base: "#DAD5CB", hi: "#B4AEA2" },
  ram: { base: "#1F1612", hi: "#4A3830" },
  lakshman: { base: "#2B1D16", hi: "#57423A" },
};

/** Blink amount 0..1 for a given frame; each character gets its own rhythm. */
export const blinkAt = (frame: number, period = 104, offset = 0): number => {
  const p = (frame + offset) % period;
  if (p < 3) return p / 3;
  if (p < 6) return (6 - p) / 3;
  return 0;
};

/** A limb: an ink stroke with a coloured stroke on top, round caps. */
export const Limb: React.FC<{ d: string; w: number; color: string }> = ({ d, w, color }) => (
  <>
    <path d={d} stroke={INK} strokeWidth={w + 9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

export const Hand: React.FC<{ x: number; y: number; r: number; color: string; rot?: number }> = ({ x, y, r, color, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse cx={0} cy={0} rx={r * 0.95} ry={r * 1.15} fill={color} stroke={INK} strokeWidth={4.5} />
    <path d={`M ${-r * 0.5} ${r * 0.1} Q ${-r * 0.1} ${r * 0.5} ${r * 0.45} ${r * 0.25}`} stroke={INK} strokeWidth={2.5} fill="none" opacity={0.6} />
  </g>
);

/** An arm from shoulder to hand through an elbow control point. */
export const Arm: React.FC<{
  who: Who;
  s: [number, number];
  e: [number, number];
  h: [number, number];
  w?: number;
  band?: boolean;
  sleeve?: string;
}> = ({ who, s, e, h, w = 30, band = false, sleeve }) => {
  const skin = SKIN[who].base;
  const d = `M ${s[0]} ${s[1]} Q ${e[0]} ${e[1]} ${h[0]} ${h[1]}`;
  // point a third of the way along for the arm band / sleeve end
  const t = 0.3;
  const bx = (1 - t) * (1 - t) * s[0] + 2 * (1 - t) * t * e[0] + t * t * h[0];
  const by = (1 - t) * (1 - t) * s[1] + 2 * (1 - t) * t * e[1] + t * t * h[1];
  return (
    <g>
      <Limb d={d} w={w} color={skin} />
      {sleeve && <Limb d={`M ${s[0]} ${s[1]} L ${bx} ${by}`} w={w + 6} color={sleeve} />}
      {band && <circle cx={bx} cy={by} r={w * 0.55} fill="none" stroke={GOLD} strokeWidth={7} />}
      <Hand x={h[0]} y={h[1]} r={w * 0.62} color={skin} />
    </g>
  );
};

// ---------------------------------------------------------------------------
// Heads

export type Mouth = "smile" | "soft" | "open" | "tremble" | "chew";

export const Head: React.FC<{
  who: Who;
  blink?: number;
  closed?: boolean;
  mouth?: Mouth;
  look?: number;
  tear?: number;
  tilt?: number;
  glow?: number;
  /** "back" draws only the hood / long hair (put it behind the body). */
  layer?: "back" | "front" | "all";
}> = ({ who, blink = 0, closed = false, mouth = "soft", look = 0, tear = -1, tilt = 0, glow = 0, layer = "all" }) => {
  const skin = SKIN[who];
  const hair = HAIR[who];
  const old = who === "shabari";
  const prince = who !== "shabari";
  const shut = closed || blink > 0.6;

  const eye = (cx: number, flip: 1 | -1) => (
    <g transform={`translate(${cx} -2)`}>
      {shut ? (
        <>
          <path d="M -17 0 Q 0 9 17 0" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
          <path d={`M ${17 * flip} 0 l ${6 * flip} -3`} stroke={INK} strokeWidth={3} strokeLinecap="round" />
        </>
      ) : (
        <g transform={`scale(1 ${1 - blink})`}>
          <path d="M -18 0 Q 0 -14 18 0 Q 0 11 -18 0 Z" fill="#FBF6EC" />
          <circle cx={look * 5} cy={0.5} r={8.5} fill="#4A2A18" />
          <circle cx={look * 5} cy={0.5} r={4.2} fill="#140B06" />
          <circle cx={look * 5 + 3} cy={-3} r={2.4} fill="#FFFFFF" />
          <path d="M -19 1 Q 0 -15 19 -1" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
          <path d={`M ${18 * flip} -1 l ${7 * flip} -4`} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          <path d="M -15 5 Q 0 12 15 5" stroke={INK} strokeWidth={1.8} fill="none" opacity={0.5} />
        </g>
      )}
    </g>
  );

  const mouthEl = (() => {
    const c = skin.lip;
    switch (mouth) {
      case "smile":
        return (
          <>
            <path d="M -18 40 Q 0 56 18 40 Q 0 48 -18 40 Z" fill={c} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
            <path d="M -21 38 q -3 3 -1 6 M 21 38 q 3 3 1 6" stroke={INK} strokeWidth={2.5} fill="none" opacity={0.6} />
          </>
        );
      case "open":
        return <ellipse cx={0} cy={44} rx={11} ry={9} fill="#5A1F1A" stroke={INK} strokeWidth={3} />;
      case "chew":
        return <path d="M -12 42 Q 0 50 12 42 Q 0 46 -12 42 Z" fill={c} stroke={INK} strokeWidth={3} />;
      case "tremble":
        return (
          <path d="M -16 44 q 4 -4 8 0 q 4 4 8 0 q 4 -4 8 0" stroke={c} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        );
      default:
        return <path d="M -13 42 Q 0 50 13 42" stroke={c} strokeWidth={4.5} fill="none" strokeLinecap="round" />;
    }
  })();

  const back = (
    <>
      {glow > 0 && <circle cx={0} cy={-10} r={170} fill="url(#halo)" opacity={glow} />}
      {old ? (
        <path d="M -150 160 C -118 120, -124 40, -112 -20 C -104 -100, -60 -126, 0 -126 C 60 -126, 104 -100, 112 -20 C 124 40, 118 120, 150 160 Z" fill={SAFFRON} stroke={INK} strokeWidth={5} />
      ) : (
        <path d="M -70 -24 C -84 50, -100 140, -96 196 L 96 196 C 100 140, 84 50, 70 -24 Z" fill={hair.base} stroke={INK} strokeWidth={5} />
      )}
    </>
  );
  if (layer === "back") return <g transform={`translate(0 -112) rotate(${tilt})`}>{back}</g>;

  return (
    <g transform={`translate(0 -112) rotate(${tilt})`}>
      {layer === "all" && back}
      {/* ears */}
      <ellipse cx={-62} cy={2} rx={11} ry={19} fill={skin.shade} stroke={INK} strokeWidth={4.5} />
      <ellipse cx={62} cy={2} rx={11} ry={19} fill={skin.shade} stroke={INK} strokeWidth={4.5} />
      {prince && (
        <>
          <circle cx={-64} cy={26} r={9} fill="none" stroke={GOLD} strokeWidth={5} />
          <circle cx={64} cy={26} r={9} fill="none" stroke={GOLD} strokeWidth={5} />
        </>
      )}
      {/* face */}
      <path
        d="M -62 -10 C -62 -60, -36 -80, 0 -80 C 36 -80, 62 -60, 62 -10 C 62 34, 40 72, 0 80 C -40 72, -62 34, -62 -10 Z"
        fill={skin.base}
        stroke={INK}
        strokeWidth={5}
      />
      <path d="M 50 -30 C 58 10, 44 54, 8 76 C 40 70, 60 34, 58 -10 Z" fill={skin.shade} opacity={0.45} />
      {/* blush */}
      <ellipse cx={-36} cy={22} rx={15} ry={9} fill="#E2604F" opacity={old ? 0.25 : 0.32} />
      <ellipse cx={36} cy={22} rx={15} ry={9} fill="#E2604F" opacity={old ? 0.25 : 0.32} />
      {/* brows */}
      <path d="M -40 -24 Q -26 -33 -10 -26" stroke={old ? "#8E8476" : INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d="M 40 -24 Q 26 -33 10 -26" stroke={old ? "#8E8476" : INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      {eye(-24, -1)}
      {eye(24, 1)}
      {/* nose */}
      <path d="M -2 6 Q -8 22 0 25 Q 6 26 8 22" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {mouthEl}
      {/* age lines */}
      {old && (
        <g stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.55}>
          <path d="M -24 -50 Q 0 -56 24 -50" />
          <path d="M -18 -42 Q 0 -46 18 -42" />
          <path d="M -46 -8 l -7 -4 M -46 -2 l -8 0" />
          <path d="M 46 -8 l 7 -4 M 46 -2 l 8 0" />
          <path d="M -34 10 Q -24 15 -14 10" />
          <path d="M 34 10 Q 24 15 14 10" />
          <path d="M -16 26 Q -26 38 -22 52" />
          <path d="M 16 26 Q 26 38 22 52" />
          <path d="M -8 68 Q 0 71 8 68" />
        </g>
      )}
      {/* forehead mark */}
      {prince ? (
        <g>
          <path d="M -9 -36 L -7 -62 M 9 -36 L 7 -62" stroke="#FFF4E0" strokeWidth={4} strokeLinecap="round" />
          <path d="M 0 -36 L 0 -60" stroke="#C8322B" strokeWidth={4.5} strokeLinecap="round" />
        </g>
      ) : (
        <circle cx={0} cy={-38} r={5} fill="#C8322B" />
      )}
      {/* tear */}
      {tear >= 0 && (
        <g opacity={tear < 0.05 ? tear * 20 : 1}>
          <path d="M -40 6 Q -26 12 -12 6" stroke="#BFE3F2" strokeWidth={3} fill="none" opacity={0.9} />
          <path
            d={`M ${-36} ${8 + tear * 52} q -7 10 0 14 q 7 -4 0 -14 Z`}
            fill="#A9D8EE"
            stroke="#5E9DBB"
            strokeWidth={1.8}
          />
        </g>
      )}
      {/* front hair */}
      {old ? (
        <>
          <path
            d="M -60 -26 C -62 -70, -30 -88, 0 -86 C 30 -88, 62 -70, 60 -26 C 52 -50, 30 -62, 4 -60 L 0 -70 L -4 -60 C -30 -62, -52 -50, -60 -26 Z"
            fill={hair.base}
            stroke={INK}
            strokeWidth={4.5}
          />
          <path d="M -40 -62 Q -50 -48 -54 -34 M 40 -62 Q 50 -48 54 -34 M -20 -70 Q -30 -64 -36 -58" stroke={hair.hi} strokeWidth={3} fill="none" />
          <path d="M -70 -10 C -76 -84, -34 -114, 0 -114 C 34 -114, 76 -84, 70 -10" fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
          <path d="M -70 -10 C -76 -84, -34 -114, 0 -114 C 34 -114, 76 -84, 70 -10" fill="none" stroke={SAFFRON_DARK} strokeWidth={13} strokeLinecap="round" />
          <path d="M -70 -10 C -76 -84, -34 -114, 0 -114 C 34 -114, 76 -84, 70 -10" fill="none" stroke={GOLD} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx={0} cy={-108} rx={32} ry={26} fill={hair.base} stroke={INK} strokeWidth={5} />
          <path d="M -16 -118 Q 0 -128 16 -118" stroke={hair.hi} strokeWidth={4} fill="none" />
          <path
            d="M -66 -12 C -68 -72, -30 -92, 0 -92 C 30 -92, 68 -72, 66 -12 C 58 -46, 36 -62, 0 -60 C -36 -62, -58 -46, -66 -12 Z"
            fill={hair.base}
            stroke={INK}
            strokeWidth={5}
          />
          <path d="M -30 -80 Q -48 -66 -56 -40 M 26 -82 Q 46 -70 54 -44" stroke={hair.hi} strokeWidth={3.5} fill="none" />
          <rect x={-24} y={-92} width={48} height={11} rx={5} fill={GOLD} stroke={INK} strokeWidth={3.5} />
          {[-14, 0, 14].map((x) => (
            <circle key={x} cx={x} cy={-86.5} r={3} fill="#8A3A1F" />
          ))}
        </>
      )}
    </g>
  );
};

// ---------------------------------------------------------------------------
// Bodies

const Mala: React.FC<{ color: string; n?: number; depth?: number; w?: number }> = ({ color, n = 15, depth = 110, w = 42 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const t = i / (n - 1);
      const x = -w + 2 * w * t;
      const y = 6 + depth * Math.sin(Math.PI * t) * 0.92;
      return <circle key={i} cx={x} cy={y} r={6} fill={color} stroke={INK} strokeWidth={2.2} />;
    })}
  </g>
);

const Neck: React.FC<{ who: Who }> = ({ who }) => (
  <g>
    <path d="M -22 -48 L -24 8 Q 0 20 24 8 L 22 -48 Z" fill={SKIN[who].base} stroke={INK} strokeWidth={5} />
    <path d="M -22 -40 Q 0 -22 22 -40 L 22 -30 Q 0 -14 -22 -30 Z" fill={SKIN[who].shade} opacity={0.6} />
  </g>
);

/** Ram / Lakshman bare torso with sash and mala. */
export const PrinceTorso: React.FC<{ who: "ram" | "lakshman"; breathe?: number }> = ({ who, breathe = 0 }) => {
  const skin = SKIN[who];
  const sash = who === "ram" ? SAFFRON : "#F2C14E";
  return (
    <g transform={`scale(${1 + breathe * 0.01} ${1 + breathe * 0.012})`}>
      <path
        d="M -100 26 C -106 90, -86 190, -72 262 L 72 262 C 86 190, 106 90, 100 26 C 66 4, 34 0, 0 0 C -34 0, -66 4, -100 26 Z"
        fill={skin.base}
        stroke={INK}
        strokeWidth={5}
      />
      <path d="M 70 40 C 88 110, 80 200, 70 262 L 50 262 C 64 190, 70 110, 70 40 Z" fill={skin.shade} opacity={0.5} />
      <path d="M -54 96 Q -30 112 -6 100 M 54 96 Q 30 112 6 100" stroke={INK} strokeWidth={3} fill="none" opacity={0.55} />
      <circle cx={-30} cy={100} r={3} fill={INK} opacity={0.5} />
      <circle cx={30} cy={100} r={3} fill={INK} opacity={0.5} />
      <path d="M 0 150 L 0 200" stroke={INK} strokeWidth={2.5} opacity={0.35} />
      {/* sash: left shoulder to right hip */}
      <path d="M -96 18 L -58 6 L 84 232 L 62 258 Z" fill={sash} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M -80 20 L 70 246" stroke={SAFFRON_DARK} strokeWidth={2.5} opacity={0.6} />
      <Mala color="#7A3B22" />
      <circle cx={0} cy={108} r={11} fill={GOLD} stroke={INK} strokeWidth={3} />
      {/* waist band */}
      <rect x={-78} y={246} width={156} height={30} rx={8} fill={GOLD} stroke={INK} strokeWidth={4.5} />
      <circle cx={0} cy={261} r={9} fill={BERRY} stroke={INK} strokeWidth={3} />
    </g>
  );
};

export const Dhoti: React.FC<{ who: "ram" | "lakshman"; stride?: number }> = ({ who, stride = 0 }) => {
  const cloth = who === "ram" ? SAFFRON : "#F2C14E";
  const dark = who === "ram" ? SAFFRON_DARK : "#D49B2E";
  const skin = SKIN[who].base;
  return (
    <g>
      {/* feet */}
      <ellipse cx={-38 - stride * 4} cy={652 - Math.max(0, stride) * 10} rx={30} ry={13} fill={skin} stroke={INK} strokeWidth={4.5} />
      <ellipse cx={38 + stride * 4} cy={652 - Math.max(0, -stride) * 10} rx={30} ry={13} fill={skin} stroke={INK} strokeWidth={4.5} />
      <rect x={-52} y={590} width={28} height={58} fill={skin} stroke={INK} strokeWidth={4.5} />
      <rect x={24} y={590} width={28} height={58} fill={skin} stroke={INK} strokeWidth={4.5} />
      <path
        d="M -78 270 C -96 400, -94 520, -66 610 L -8 606 L 0 420 L 8 606 L 66 610 C 94 520, 96 400, 78 270 Z"
        fill={cloth}
        stroke={INK}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path d="M -10 280 L -14 560 M 14 280 L 18 560 M -50 300 Q -60 440 -46 590 M 50 300 Q 60 440 46 590" stroke={dark} strokeWidth={4} fill="none" />
      <path d="M -66 598 L -8 594 M 8 594 L 66 598" stroke={GOLD} strokeWidth={9} strokeLinecap="round" />
    </g>
  );
};

/** Bow with string, drawn vertically, centred at (0,0). */
export const Bow: React.FC<{ h?: number }> = ({ h = 520 }) => (
  <g>
    <path d={`M 0 ${-h / 2} Q 70 0 0 ${h / 2}`} stroke={INK} strokeWidth={16} fill="none" strokeLinecap="round" />
    <path d={`M 0 ${-h / 2} Q 70 0 0 ${h / 2}`} stroke="#8A5A2B" strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d={`M 0 ${-h / 2} L 0 ${h / 2}`} stroke="#E8DCC0" strokeWidth={2.5} />
  </g>
);

export const Quiver: React.FC = () => (
  <g transform="translate(70 -10) rotate(22)">
    {[-14, 0, 14].map((x, i) => (
      <g key={i}>
        <path d={`M ${x} 0 L ${x} -70`} stroke="#6B4A2B" strokeWidth={4} />
        <path d={`M ${x} -70 l -9 -24 l 9 8 l 9 -8 Z`} fill="#EDE6D6" stroke={INK} strokeWidth={2.5} />
      </g>
    ))}
    <rect x={-28} y={-6} width={56} height={200} rx={20} fill="#8A5A2B" stroke={INK} strokeWidth={5} />
    <rect x={-28} y={20} width={56} height={14} fill={GOLD} stroke={INK} strokeWidth={3} />
  </g>
);

export const Prince: React.FC<{
  who: "ram" | "lakshman";
  frame: number;
  mouth?: Mouth;
  look?: number;
  stride?: number;
  arms?: React.ReactNode;
  withBow?: boolean;
  glow?: number;
  blinkOffset?: number;
}> = ({ who, frame, mouth = "soft", look = 0, stride = 0, arms, withBow = true, glow = 0, blinkOffset = 0 }) => {
  const breathe = Math.sin(frame / 22);
  return (
    <g>
      <Head who={who} layer="back" glow={glow} />
      <Quiver />
      <Dhoti who={who} stride={stride} />
      <Neck who={who} />
      <PrinceTorso who={who} breathe={breathe} />
      {arms ?? (
        <>
          <Arm who={who} s={[-88, 36]} e={[-118, 160]} h={[-104 - stride * 6, 266]} band />
          {withBow && (
            <g transform="translate(120 210)">
              <Bow />
            </g>
          )}
          <Arm who={who} s={[88, 36]} e={[120, 150]} h={[118, 230]} band />
        </>
      )}
      <Head who={who} layer="front" blink={blinkAt(frame, who === "ram" ? 112 : 96, blinkOffset)} mouth={mouth} look={look} />
    </g>
  );
};

/** Shabari's saree-covered torso; pallu over the left shoulder. */
export const ShabariTorso: React.FC<{ breathe?: number }> = ({ breathe = 0 }) => (
  <g transform={`scale(1 ${1 + breathe * 0.01})`}>
    <path
      d="M -86 24 C -94 90, -80 190, -70 262 L 70 262 C 80 190, 94 90, 86 24 C 56 6, 30 2, 0 2 C -30 2, -56 6, -86 24 Z"
      fill={SAFFRON}
      stroke={INK}
      strokeWidth={5}
    />
    <path d="M -84 20 L -40 6 L 74 250 L 40 262 Z" fill={SAFFRON_LIGHT} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -40 6 L 74 250" stroke="#9E3D1E" strokeWidth={7} />
    <path d="M -20 60 Q 0 120 20 180 M -50 90 Q -40 160 -30 230" stroke={SAFFRON_DARK} strokeWidth={3} fill="none" opacity={0.7} />
    <Mala color="#6E8F4A" n={13} depth={70} w={34} />
  </g>
);

export const Saree: React.FC = () => (
  <g>
    <ellipse cx={-30} cy={650} rx={26} ry={12} fill={SKIN.shabari.base} stroke={INK} strokeWidth={4.5} />
    <ellipse cx={30} cy={650} rx={26} ry={12} fill={SKIN.shabari.base} stroke={INK} strokeWidth={4.5} />
    <path d="M -72 258 C -88 400, -92 540, -78 640 L 78 640 C 92 540, 88 400, 72 258 Z" fill={SAFFRON} stroke={INK} strokeWidth={5} />
    <path d="M -6 270 L -10 630 M 14 270 L 22 630 M 34 270 L 50 630 M -40 290 Q -52 460 -50 630" stroke={SAFFRON_DARK} strokeWidth={3.5} fill="none" />
    <path d="M -78 628 L 78 628" stroke="#9E3D1E" strokeWidth={10} />
  </g>
);

/** Seated lap for Shabari on a doorstep (knees forward). */
export const SareeSeated: React.FC = () => (
  <g>
    <path d="M -96 250 C -140 300, -150 380, -120 420 L 120 420 C 150 380, 140 300, 96 250 Z" fill={SAFFRON} stroke={INK} strokeWidth={5} />
    <path d="M -60 290 Q -70 360 -84 410 M 0 290 L 0 410 M 60 290 Q 70 360 84 410" stroke={SAFFRON_DARK} strokeWidth={3.5} fill="none" />
    <ellipse cx={-50} cy={424} rx={30} ry={12} fill={SKIN.shabari.base} stroke={INK} strokeWidth={4.5} />
    <ellipse cx={50} cy={424} rx={30} ry={12} fill={SKIN.shabari.base} stroke={INK} strokeWidth={4.5} />
    <path d="M -126 412 L 126 412" stroke="#9E3D1E" strokeWidth={10} />
  </g>
);

export const Shabari: React.FC<{
  frame: number;
  pose?: "stand" | "sit";
  mouth?: Mouth;
  closed?: boolean;
  look?: number;
  tear?: number;
  tilt?: number;
  arms?: React.ReactNode;
  props?: React.ReactNode;
  /** Drawn over the face, e.g. a hand raised to the lips. */
  front?: React.ReactNode;
}> = ({ frame, pose = "stand", mouth = "soft", closed, look = 0, tear = -1, tilt = 0, arms, props, front }) => (
  <g>
    <Head who="shabari" layer="back" tilt={tilt} />
    {pose === "stand" ? <Saree /> : <SareeSeated />}
    <Neck who="shabari" />
    <ShabariTorso breathe={Math.sin(frame / 24)} />
    {props}
    {arms}
    <Head who="shabari" layer="front" blink={blinkAt(frame, 118, 40)} closed={closed} mouth={mouth} look={look} tear={tear} tilt={tilt} />
    {front}
  </g>
);

export const SHABARI_SKIN = SKIN.shabari.base;
export const RAM_SKIN = SKIN.ram.base;

// ---------------------------------------------------------------------------
// Props

export const Berry: React.FC<{ x: number; y: number; r?: number; color?: string; bitten?: boolean }> = ({
  x,
  y,
  r = 14,
  color = BERRY,
  bitten = false,
}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r} fill={color} stroke={INK} strokeWidth={3} />
    {bitten && <path d={`M ${r * 0.2} ${-r} A ${r * 0.7} ${r * 0.7} 0 0 0 ${r} ${r * 0.1} L ${r * 0.2} ${r * 0.1} Z`} fill="#F3E2B8" stroke={INK} strokeWidth={2.5} />}
    <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.28} fill="#FFFFFF" opacity={0.55} />
    <path d={`M 0 ${-r} l 2 -6`} stroke="#4E3A1E" strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

const BERRY_SPOTS: [number, number, string][] = [
  [-60, -6, BERRY], [-34, -14, BERRY_ORANGE], [-8, -10, BERRY], [18, -16, BERRY_ORANGE], [44, -8, BERRY],
  [-46, 8, BERRY_ORANGE], [-20, 4, BERRY], [6, 6, BERRY_ORANGE], [32, 4, BERRY], [58, 6, BERRY_ORANGE],
];

/** Woven basket full of ber, centred on its rim. */
export const Basket: React.FC<{ w?: number }> = ({ w = 1 }) => (
  <g transform={`scale(${w})`}>
    {BERRY_SPOTS.map(([x, y, c], i) => (
      <Berry key={i} x={x} y={y} color={c} />
    ))}
    <path d="M -96 0 Q -90 80 -60 96 L 60 96 Q 90 80 96 0 Z" fill="#C99A55" stroke={INK} strokeWidth={5} />
    {[18, 40, 62, 84].map((y) => (
      <path key={y} d={`M ${-94 + y * 0.35} ${y} L ${94 - y * 0.35} ${y}`} stroke="#8E6530" strokeWidth={3} />
    ))}
    {[-60, -30, 0, 30, 60].map((x) => (
      <path key={x} d={`M ${x} 4 L ${x * 0.8} 94`} stroke="#8E6530" strokeWidth={3} />
    ))}
    <ellipse cx={0} cy={0} rx={96} ry={16} fill="none" stroke={INK} strokeWidth={5} />
    <ellipse cx={0} cy={0} rx={96} ry={16} fill="none" stroke="#DDB46E" strokeWidth={2} />
  </g>
);

/** Leaf plate (pattal) with a few berries. */
export const LeafPlate: React.FC<{ berries?: number }> = ({ berries = 5 }) => (
  <g>
    <ellipse cx={0} cy={0} rx={92} ry={30} fill={LEAF} stroke={INK} strokeWidth={5} />
    <ellipse cx={0} cy={-3} rx={72} ry={20} fill="#79A84E" />
    <path d="M -80 0 L 80 0 M -40 -14 L -20 0 M 20 0 L 40 -14 M -40 14 L -20 0 M 20 0 L 40 14" stroke={LEAF_DARK} strokeWidth={2.5} />
    {BERRY_SPOTS.slice(0, berries).map(([x, y, c], i) => (
      <Berry key={i} x={x * 0.8} y={y * 0.6 - 10} r={12} color={c} />
    ))}
  </g>
);

export const Broom: React.FC = () => (
  <g>
    <path d="M 0 0 L 0 300" stroke={INK} strokeWidth={14} strokeLinecap="round" />
    <path d="M 0 0 L 0 300" stroke="#9C7040" strokeWidth={7} strokeLinecap="round" />
    <path d="M -6 290 L -60 420 L 60 420 L 6 290 Z" fill="#C9A35E" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
    {[-40, -20, 0, 20, 40].map((x) => (
      <path key={x} d={`M ${x * 0.15} 296 L ${x} 418`} stroke="#8E6530" strokeWidth={2.5} />
    ))}
    <rect x={-10} y={284} width={20} height={14} fill="#8A3A1F" stroke={INK} strokeWidth={3} />
  </g>
);

export const Diya: React.FC<{ frame: number }> = ({ frame }) => {
  const f = 1 + 0.08 * Math.sin(frame / 2.3) + 0.05 * Math.sin(frame / 1.3);
  return (
    <g>
      <circle cx={0} cy={-30} r={70 * f} fill="url(#diyaGlow)" />
      <path d={`M 0 -10 C -10 -24, -6 -40, 0 ${-54 * f} C 6 -40, 10 -24, 0 -10 Z`} fill="#FFD25A" stroke="#E07A1F" strokeWidth={2.5} />
      <path d="M 0 -14 C -4 -22, -2 -30, 0 -36 C 2 -30, 4 -22, 0 -14 Z" fill="#FFF7D6" />
      <path d="M -40 -6 Q 0 34 40 -6 Q 26 -14 0 -12 Q -26 -14 -40 -6 Z" fill="#B5582A" stroke={INK} strokeWidth={4} />
    </g>
  );
};

export const SharedDefs: React.FC = () => (
  <defs>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFE7A8" stopOpacity={0.9} />
      <stop offset="60%" stopColor="#FFD27A" stopOpacity={0.35} />
      <stop offset="100%" stopColor="#FFD27A" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="diyaGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFC85A" stopOpacity={0.7} />
      <stop offset="100%" stopColor="#FFC85A" stopOpacity={0} />
    </radialGradient>
  </defs>
);
