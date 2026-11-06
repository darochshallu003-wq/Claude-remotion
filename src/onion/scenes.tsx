import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  Eye,
  FanIcon,
  Garlic,
  Knife,
  KnifeIcon,
  Medal,
  Onion,
  OnionHalf,
  Rabbit,
  RootIcon,
  ShieldIcon,
  SnowIcon,
} from "./art";
import {
  clamp,
  CountUp,
  DarkBg,
  Header,
  Headline,
  PaperBg,
  PaperCard,
  Pill,
  Stamp,
  TypeOn,
  useCue,
  useEnter,
  useFloat,
  Vapor,
} from "./components";
import { C, DEVA, HEAD, MONO } from "./theme";

const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.5 }) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

/** Render children only from `at` (frames), with their own clock. */
const From: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (
  <Sequence from={at} layout="none">
    {children}
  </Sequence>
);

// ===========================================================================
// 1. Hook

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const knifeT = interpolate(frame, [cue(0.2), cue(0.48)], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const flash = frame >= cue(0.5) ? Math.max(0, Math.sin(((frame - cue(0.5)) / 9) * Math.PI)) * Math.exp(-(frame - cue(0.5)) / 40) : 0;
  const shake = frame >= cue(0.5) ? Math.sin(frame * 2.3) * 10 * Math.exp(-(frame - cue(0.5)) / 10) : 0;
  const float = useFloat(10);
  return (
    <AbsoluteFill style={{ transform: `translateX(${shake}px)` }}>
      <DarkBg />
      <Header left="KITCHEN · FIG. 01" right="TEARS LAB" dark />
      {frame < cue(0.5) ? (
        <Headline setup="Onion kaatte waqt rote ho?" punch="You're not sad." dark punchColor={C.cream} />
      ) : (
        <From at={cue(0.5)}>
          <Headline setup="Sach ye hai…" punch="You're under attack" dark punchColor={C.red} punchAt={2} delay={0} />
        </From>
      )}
      <div style={{ position: "absolute", left: 540 - 220, top: 700 + float }}>
        <Onion id="hk" size={440} />
      </div>
      <Knife
        id="hkk"
        width={560}
        style={{
          position: "absolute",
          left: interpolate(knifeT, [0, 1], [760, 430]),
          top: interpolate(knifeT, [0, 1], [380, 760]),
          transform: "rotate(-28deg)",
          opacity: frame < cue(0.62) ? 1 : interpolate(frame, [cue(0.62), cue(0.7)], [1, 0], clamp),
        }}
      />
      <Vapor x={540} y={900} tx={540} ty={560} start={cue(0.5)} count={30} spread={240} size={110} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, rgba(217,65,43,0) 30%, rgba(217,65,43,${0.65 * flash}) 100%)`,
        }}
      />
      <Sfx at={cue(0.44)} src="onion/slice.wav" volume={0.55} />
      <Sfx at={cue(0.5)} src="onion/thud.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 2. Hidden weapon

export const Weapon: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="KITCHEN · FIG. 01" right="TEARS LAB" dark />
      <Headline setup="Har pyaaz ke andar" punch="A hidden weapon" dark />
      <PaperCard x={200} y={600} w={680} h={760} delay={cue(0.12)} rotate={-3} caption="प्याज़" label="ALLIUM CEPA" seed="weapon">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <OnionHalf id="wp" size={500} />
        </AbsoluteFill>
      </PaperCard>
      <Stamp text="Classified" x={560} y={1000} at={cue(0.5)} />
      <Sfx at={cue(0.12)} src="sfx/pop.wav" volume={0.4} />
      <Sfx at={cue(0.5)} src="onion/thud.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 3 & 4. The onion cell: two rooms, then the knife breaks the wall.

const CellDiagram: React.FC<{
  showSulfur: number;
  showEnzyme: number;
  lock: number;
  breakT: number;
  mixT: number;
}> = ({ showSulfur, showEnzyme, lock, breakT, mixT }) => {
  const frame = useCurrentFrame();
  const gap = breakT * 420;
  const ease = Easing.inOut(Easing.cubic)(mixT);
  const dot = (i: number, kind: "s" | "e") => {
    const left = kind === "s";
    const hx = left ? 90 + random(`hx${kind}${i}`) * 320 : 530 + random(`hx${kind}${i}`) * 320;
    const hy = 120 + random(`hy${kind}${i}`) * 520;
    const tx = 110 + random(`tx${kind}${i}`) * 720;
    const ty = 130 + random(`ty${kind}${i}`) * 500;
    const swirl = ease * 40;
    const x = hx + (tx - hx) * ease + Math.sin(frame / 14 + i) * (6 + swirl);
    const y = hy + (ty - hy) * ease + Math.cos(frame / 17 + i * 1.7) * (6 + swirl);
    const reacting = mixT > 0.55 && random(`r${kind}${i}`) < (mixT - 0.55) * 2.2;
    return { x, y, reacting };
  };
  return (
    <svg viewBox="0 0 940 760" width={940} height={760} style={{ position: "absolute", left: 70, top: 600 }}>
      <rect x="20" y="20" width="900" height="720" rx="140" fill="#F7EFDD" stroke={C.ink} strokeWidth={8} />
      <rect x="46" y="46" width="848" height="668" rx="118" fill="none" stroke="#C9B48F" strokeWidth={4} strokeDasharray="14 10" />
      {/* the dividing wall */}
      <g transform={`rotate(${-breakT * 7} 470 60)`}>
        <rect x="462" y="60" width="16" height={Math.max(0, 320 - gap / 2)} fill="#C9B48F" stroke={C.ink} strokeWidth={4} />
      </g>
      <g transform={`rotate(${breakT * 7} 470 700)`}>
        <rect x="462" y={380 + gap / 2} width="16" height={Math.max(0, 320 - gap / 2)} fill="#C9B48F" stroke={C.ink} strokeWidth={4} />
      </g>
      {/* lock on the wall */}
      <g opacity={lock * (1 - breakT)} transform="translate(470 380)">
        <circle r="46" fill={C.ink} />
        <rect x="-20" y="-6" width="40" height="30" rx="5" fill={C.paper} />
        <path d="M-12 -6 v -12 a 12 12 0 0 1 24 0 v 12" fill="none" stroke={C.paper} strokeWidth={6} />
      </g>
      {new Array(18).fill(0).map((_, i) => {
        const d = dot(i, "s");
        return (
          <circle key={`s${i}`} cx={d.x} cy={d.y} r={15} fill={d.reacting ? C.orange : C.sulfur} stroke={C.ink} strokeWidth={3} opacity={showSulfur} />
        );
      })}
      {new Array(10).fill(0).map((_, i) => {
        const d = dot(i, "e");
        return (
          <path
            key={`e${i}`}
            transform={`translate(${d.x} ${d.y}) rotate(${(frame * 3 + i * 40) % 360})`}
            d="M0 0 L 22 -12 A 25 25 0 1 0 22 12 Z"
            fill={d.reacting ? C.orange : C.enzyme}
            stroke={C.ink}
            strokeWidth={3}
            opacity={showEnzyme}
          />
        );
      })}
      <text x="90" y="100" fontFamily={MONO} fontSize="26" letterSpacing="3" fill={C.ink} opacity={showSulfur * (1 - ease)}>
        SULFUR COMPOUNDS
      </text>
      <text x="850" y="100" textAnchor="end" fontFamily={MONO} fontSize="26" letterSpacing="3" fill={C.ink} opacity={showEnzyme * (1 - ease)}>
        ENZYME
      </text>
    </svg>
  );
};

export const Rooms: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const op = (at: number) => interpolate(frame, [cue(at), cue(at) + 12], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="INSIDE · FIG. 02" right="ONION CELL" dark={false} />
      <Headline setup="2 chemicals," punch="Alag-alag kamre" dark={false} />
      <CellDiagram showSulfur={op(0.18)} showEnzyme={op(0.45)} lock={op(0.72)} breakT={0} mixT={0} />
      <Pill text="JAB TAK CELL SAHI-SALAMAT HAI" x={190} y={1410} delay={cue(0.75)} />
      <Sfx at={cue(0.18)} src="sfx/pop.wav" volume={0.35} />
      <Sfx at={cue(0.45)} src="sfx/pop.wav" volume={0.35} />
      <Sfx at={cue(0.72)} src="onion/tick.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

export const KnifeCut: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const k = interpolate(frame, [cue(0.1), cue(0.32)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const breakT = interpolate(frame, [cue(0.28), cue(0.42)], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.5)) });
  const mixT = interpolate(frame, [cue(0.4), cue(0.85)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="INSIDE · FIG. 02" right="ONION CELL" dark={false} />
      <Headline setup="Chaaku chala…" punch="Deewarein tooti!" dark={false} />
      <CellDiagram showSulfur={1} showEnzyme={1} lock={1} breakT={breakT} mixT={mixT} />
      <Knife
        id="kc"
        width={620}
        style={{
          position: "absolute",
          left: interpolate(k, [0, 1], [820, -560]),
          top: interpolate(k, [0, 1], [520, 1300]),
          transform: "rotate(-30deg)",
          opacity: k > 0 && k < 1 ? 1 : 0,
        }}
      />
      <Pill text="REACTION SHURU" x={330} y={1410} delay={cue(0.6)} accent />
      <Sfx at={cue(0.14)} src="onion/slice.wav" volume={0.6} />
      <Sfx at={cue(0.3)} src="onion/thud.wav" volume={0.45} />
      <Sfx at={cue(0.6)} src="onion/sparkle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 5. Twist

export const Twist: React.FC = () => {
  const frame = useCurrentFrame();
  const q = useEnter(2, { damping: 20, stiffness: 60 });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="WAIT · FIG. 02B" right="PLOT TWIST" dark />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div
          style={{
            fontFamily: HEAD,
            fontWeight: 700,
            fontSize: 900,
            color: C.orange,
            opacity: 0.12 * q,
            transform: `scale(${0.8 + 0.25 * q + frame * 0.0008}) rotate(${(1 - q) * -10}deg)`,
            marginTop: 260,
          }}
        >
          ?
        </div>
      </AbsoluteFill>
      <Headline setup="Par rukiye…" punch="Sirf reaction se aansu nahi" dark />
      <Pill text="REACTION ≠ AANSU" x={340} y={1100} delay={22} accent />
      <Sfx at={20} src="onion/tick.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 6. Discovery: the second enzyme

const ChainNode: React.FC<{ y: number; at: number; title: string; sub: string; hot?: boolean }> = ({ y, at, title, sub, hot }) => {
  const e = useEnter(at);
  const frame = useCurrentFrame();
  const glow = hot ? 0.5 + 0.5 * Math.sin(frame / 6) : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: 150,
        width: 780,
        top: y,
        height: 118,
        borderRadius: 18,
        border: `4px solid ${hot ? C.orange : C.ink}`,
        background: hot ? "rgba(240,138,36,0.16)" : "#F6EEDC",
        boxShadow: hot ? `0 0 ${30 + glow * 30}px rgba(240,138,36,${0.35 + glow * 0.3})` : "0 8px 18px rgba(0,0,0,0.12)",
        opacity: e,
        transform: `translateX(${(1 - e) * -60}px)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: 34,
      }}
    >
      <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 50, color: hot ? C.rust : C.ink, textTransform: "uppercase" }}>{title}</div>
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#6b6052" }}>{sub}</div>
    </div>
  );
};

const Arrow: React.FC<{ y: number; at: number }> = ({ y, at }) => {
  const e = useEnter(at);
  return (
    <svg width="60" height="56" viewBox="0 0 60 56" style={{ position: "absolute", left: 510, top: y, opacity: e }}>
      <path d="M30 4 V 44 M14 30 L 30 48 L 46 30" fill="none" stroke={C.ink} strokeWidth={6} strokeLinecap="round" />
    </svg>
  );
};

export const Discovery: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const strike = interpolate(frame, [cue(0.36), cue(0.44)], [0, 1], clamp);
  const old = useEnter(cue(0.08));
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="DISCOVERY · FIG. 03" right="NATURE · 2002" dark={false} />
      <Headline setup="2002 · Japan" punch="Ek doosra enzyme" dark={false} />
      <div style={{ position: "absolute", left: 150, top: 590, opacity: old, fontFamily: MONO, fontSize: 28, letterSpacing: 2, color: C.ink }}>
        <span style={{ position: "relative" }}>
          PURANI THEORY: GAS APNE-AAP BANTI HAI
          <span style={{ position: "absolute", left: 0, top: "52%", height: 5, width: `${strike * 100}%`, background: C.red }} />
        </span>
      </div>
      <ChainNode y={680} at={cue(0.42)} title="Sulfur + Enzyme 1" sub="CELL TOOTA, REACTION SHURU" />
      <Arrow y={808} at={cue(0.48)} />
      <ChainNode y={874} at={cue(0.52)} title="Sulfenic acid" sub="BEECH KA CHEMICAL" />
      <Arrow y={1002} at={cue(0.58)} />
      <ChainNode y={1068} at={cue(0.64)} title="Enzyme 2 · LF synthase" sub="SIRF EK KAAM: TEAR GAS" hot />
      <Arrow y={1196} at={cue(0.74)} />
      <ChainNode y={1262} at={cue(0.8)} title="Tear gas" sub="AANSU KI ASLI WAJAH" />
      <Sfx at={cue(0.36)} src="onion/slice.wav" volume={0.3} />
      <Sfx at={cue(0.64)} src="onion/sparkle.wav" volume={0.45} />
      <Sfx at={cue(0.8)} src="sfx/pop.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 7. The gas: name + 30 seconds to your eyes

export const Gas: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const irritation = interpolate(frame, [cue(0.45), cue(0.85)], [0, 1], clamp);
  const nerve = frame > cue(0.8) ? 0.6 + 0.4 * Math.sin(frame / 3) : 0;
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="THE GAS · FIG. 04" right="≈ 30 SEC" dark />
      <div style={{ position: "absolute", top: 222, left: 70, right: 70 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 500, fontSize: 58, color: C.cream, textTransform: "uppercase" }}>Iska naam hai…</div>
        <TypeOn
          text="syn-propanethial-S-oxide"
          start={cue(0.1)}
          cps={14}
          style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 84, color: C.orange, display: "block", marginTop: 8 }}
        />
      </div>
      <PaperCard x={80} y={1000} w={420} h={430} delay={cue(0.05)} rotate={-4} seed="gasOnion">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <OnionHalf id="gs" size={320} />
        </AbsoluteFill>
      </PaperCard>
      <div style={{ position: "absolute", left: 470, top: 600, opacity: useEnter(cue(0.3)) }}>
        <Eye id="ge" width={520} irritation={irritation} nerve={nerve} />
      </div>
      <Vapor x={300} y={1080} tx={720} ty={760} start={cue(0.35)} count={34} spread={120} size={90} life={60} />
      <div style={{ position: "absolute", left: 600, top: 1120, opacity: useEnter(cue(0.4)) }}>
        <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: C.muted }}>AANKHON TAK</div>
        <CountUp
          from={0}
          to={30}
          start={cue(0.42)}
          frames={cue(0.4)}
          format={(n) => `0:${String(Math.round(n)).padStart(2, "0")}`}
          style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 150, color: C.cream, lineHeight: 1 }}
        />
        <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: 4, color: C.muted }}>SECONDS</div>
      </div>
      {new Array(10).fill(0).map((_, i) => (
        <Sfx key={i} at={cue(0.1) + Math.round(i * 2.1 * 2.2)} src="onion/tick.wav" volume={0.25} />
      ))}
      <Sfx at={cue(0.8)} src="onion/thud.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 8. Eyes fight back

const Drops: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <>
      {new Array(12).fill(0).map((_, i) => {
        const period = 34;
        const born = start + Math.floor(random(`d${i}`) * period * 2);
        if (frame < born) return null;
        const t = ((frame - born) % period) / period;
        const x = 330 + random(`dx${i}`) * 420;
        const y = 1010 + t * t * 420;
        return (
          <svg key={i} width="40" height="56" viewBox="0 0 40 56" style={{ position: "absolute", left: x, top: y, opacity: 1 - t * 0.6 }}>
            <path d="M20 2 C 30 20, 38 30, 38 38 A 18 18 0 0 1 2 38 C 2 30, 10 20, 20 2 Z" fill="#8FD3F2" stroke="#2C6E8F" strokeWidth={3} />
          </svg>
        );
      })}
    </>
  );
};

export const Eyes: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const irritation = interpolate(frame, [0, cue(0.9)], [1, 0.2], clamp);
  const nerve = frame < cue(0.3) ? 0.6 + 0.4 * Math.sin(frame / 3) : interpolate(frame, [cue(0.3), cue(0.5)], [1, 0], clamp);
  const b = cue(0.5);
  const blink = frame >= b && frame < b + 8 ? Math.sin(((frame - b) / 8) * Math.PI) : 0;
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="INSIDE YOU · FIG. 05" right="DEFENCE MODE" dark />
      <Headline setup="Aankhein alert!" punch="Fire extinguisher" dark punchSize={104} />
      <div style={{ position: "absolute", left: 90, top: 560 }}>
        <Eye id="ey" width={900} irritation={irritation} nerve={nerve} blink={blink} />
      </div>
      <Vapor x={540} y={860} tx={540} ty={640} start={0} count={16} spread={500} size={130} life={45} />
      <Drops start={cue(0.25)} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1330,
          textAlign: "center",
          fontFamily: DEVA,
          fontSize: 76,
          color: C.cream,
          opacity: useEnter(cue(0.55)),
        }}
      >
        आँसू = धुलाई
      </div>
      <Sfx at={cue(0.25)} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={cue(0.55)} src="sfx/pop.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 9. Garlic: the proof

const Row: React.FC<{ x: number; y: number; at: number; text: string; ok: boolean }> = ({ x, y, at, text, ok }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 14, opacity: e, transform: `scale(${0.8 + 0.2 * e})`, transformOrigin: "left" }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: ok ? C.green : C.red,
          color: "white",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {ok ? "✓" : "✗"}
      </div>
      <span style={{ fontFamily: MONO, fontSize: 28, letterSpacing: 2, color: C.ink }}>{text}</span>
    </div>
  );
};

export const GarlicProof: React.FC = () => {
  const cue = useCue();
  const vs = useEnter(cue(0.2));
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="PROOF · FIG. 06" right="ONION VS GARLIC" dark={false} />
      <Headline setup="Aur saboot?" punch="Lehsun: zero aansu" dark={false} />
      <PaperCard x={60} y={600} w={460} h={560} delay={cue(0.05)} rotate={-4} caption="प्याज़" label="ONION" seed="pz">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Onion id="gp1" size={300} />
        </AbsoluteFill>
      </PaperCard>
      <PaperCard x={560} y={600} w={460} h={560} delay={cue(0.15)} rotate={3} caption="लहसुन" label="GARLIC" seed="ls">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Garlic id="gp2" size={300} />
        </AbsoluteFill>
      </PaperCard>
      <div
        style={{
          position: "absolute",
          left: 540 - 56,
          top: 820,
          width: 112,
          height: 112,
          borderRadius: "50%",
          background: C.ink,
          color: C.paper,
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${vs})`,
        }}
      >
        VS
      </div>
      <Row x={90} y={1210} at={cue(0.32)} text="ENZYME 1" ok />
      <Row x={90} y={1275} at={cue(0.4)} text="ENZYME 2" ok />
      <Row x={90} y={1340} at={cue(0.48)} text="AANSU" ok />
      <Row x={590} y={1210} at={cue(0.36)} text="ENZYME 1" ok />
      <Row x={590} y={1275} at={cue(0.44)} text="ENZYME 2" ok={false} />
      <Row x={590} y={1340} at={cue(0.52)} text="AANSU" ok={false} />
      <Stamp text="No tears" x={790} y={880} at={cue(0.62)} color={C.green} rotate={8} size={70} />
      <Sfx at={cue(0.2)} src="onion/thud.wav" volume={0.35} />
      <Sfx at={cue(0.44)} src="onion/tick.wav" volume={0.5} />
      <Sfx at={cue(0.62)} src="onion/thud.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 10. Ig Nobel

const Confetti: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const colors = [C.orange, C.purple, C.sulfur, C.enzyme, C.green, C.rust];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(60).fill(0).map((_, i) => {
        const t = (frame - start) / 30;
        const x = 100 + random(`cx${i}`) * 880 + Math.sin(t * 3 + i) * 30;
        const y = 480 + (random(`cy${i}`) - 0.5) * 200 + t * (260 + random(`cv${i}`) * 260) - (1 - Math.min(1, t)) * 160 * random(`cu${i}`);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 16,
              height: 26,
              background: colors[i % colors.length],
              transform: `rotate(${(frame - start) * (6 + i % 7) + i * 20}deg)`,
              opacity: interpolate(t, [2, 3.2], [1, 0], clamp),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const IgNobel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = useCue();
  const m = spring({ frame: frame - cue(0.12), fps, config: { damping: 12, stiffness: 90 } });
  const spinX = Math.cos(interpolate(m, [0, 1], [Math.PI * 3, 0]));
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="EVIDENCE · FIG. 07" right="CHEMISTRY · 2013" dark={false} />
      <Headline setup="Ye khoj itni anokhi thi…" punch="2013 Ig Nobel Prize" dark={false} punchSize={110} />
      <div
        style={{
          position: "absolute",
          left: 540 - 190,
          top: 600,
          transform: `scaleX(${spinX}) scale(${m})`,
          filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.3))",
        }}
      >
        <Medal id="ig" size={380} />
      </div>
      <Confetti start={cue(0.3)} />
      <Pill text="PEHLE HASAO, PHIR SOCHO" x={250} y={1250} delay={cue(0.55)} />
      <Sfx at={cue(0.3)} src="onion/sparkle.wav" volume={0.5} />
      <Sfx at={cue(0.32)} src="sfx/chime.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 11. Why: self-defence

export const Why: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const approach = interpolate(frame, [cue(0.15), cue(0.45)], [-380, 170], { ...clamp, easing: Easing.out(Easing.quad) });
  const flee = interpolate(frame, [cue(0.55), cue(0.8)], [0, -560], { ...clamp, easing: Easing.in(Easing.quad) });
  const hop = frame > cue(0.55) ? Math.abs(Math.sin((frame - cue(0.55)) / 5)) * 60 : Math.abs(Math.sin(frame / 6)) * 18;
  const shock = useEnter(cue(0.55));
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="WHY · FIG. 08" right="SELF-DEFENCE" dark />
      <Headline setup="Pyaaz aisa kyun karta hai?" punch="Self-defence" dark />
      <div style={{ position: "absolute", left: 60, right: 60, top: 1250, height: 4, background: "rgba(243,235,221,0.25)" }} />
      <div style={{ position: "absolute", left: 620, top: 830 }}>
        <Onion id="wy" size={330} />
      </div>
      <div style={{ position: "absolute", left: approach + flee, top: 1000 - hop }}>
        <Rabbit size={320} flip={frame > cue(0.55)} />
        <div style={{ position: "absolute", left: 230, top: -90, fontFamily: HEAD, fontWeight: 700, fontSize: 120, color: C.orange, opacity: shock, transform: `scale(${shock})` }}>!</div>
      </div>
      <Vapor x={700} y={960} tx={330} ty={1020} start={cue(0.5)} count={26} spread={160} size={120} life={40} />
      <div style={{ position: "absolute", left: 840, top: 800, opacity: useEnter(cue(0.75)), transform: `scale(${useEnter(cue(0.75))})` }}>
        <ShieldIcon size={150} color={C.orange} />
      </div>
      <Sfx at={cue(0.5)} src="sfx/whoosh.wav" volume={0.5} />
      <Sfx at={cue(0.55)} src="sfx/pop.wav" volume={0.5} />
      <Sfx at={cue(0.75)} src="onion/sparkle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

// ===========================================================================
// 12. Tips

const TIPS = [
  { Icon: SnowIcon, title: "Fridge · 30 min", sub: "THANDA = ENZYME SLOW", at: 0.22 },
  { Icon: KnifeIcon, title: "Tez chaaku", sub: "KAM CELLS TOOTENGE", at: 0.42 },
  { Icon: RootIcon, title: "Jad sabse last", sub: "ROOT END = SABSE ZYADA GAS", at: 0.62 },
  { Icon: FanIcon, title: "Pankha on", sub: "GAS UDD JAAYEGI", at: 0.8 },
];

export const Tips: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="YOUR MOVE · FIG. 09" right="4 TRICKS" dark={false} />
      <Headline setup="Aansu se bachna hai?" punch="4 tricks" dark={false} />
      {TIPS.map((t, i) => (
        <TipRow key={t.title} {...t} y={600 + i * 200} at={cue(t.at)} />
      ))}
      {TIPS.map((t) => (
        <Sfx key={t.title} at={cue(t.at) + 10} src="sfx/pop.wav" volume={0.45} />
      ))}
    </AbsoluteFill>
  );
};

const TipRow: React.FC<{
  Icon: React.FC<{ size: number; color: string }>;
  title: string;
  sub: string;
  y: number;
  at: number;
}> = ({ Icon, title, sub, y, at }) => {
  const e = useEnter(at);
  const tick = useEnter(at + 10, { damping: 10, stiffness: 220 });
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: y,
        height: 170,
        display: "flex",
        alignItems: "center",
        gap: 34,
        padding: "0 34px",
        borderRadius: 24,
        background: "#F6EEDC",
        border: `3px solid rgba(42,36,32,0.25)`,
        boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
        opacity: e,
        transform: `translateX(${(1 - e) * 120}px)`,
      }}
    >
      <div style={{ width: 112, height: 112, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={74} color={C.orange} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 62, color: C.ink, textTransform: "uppercase", lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 3, color: "#6b6052", marginTop: 6 }}>{sub}</div>
      </div>
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 14,
          background: C.green,
          color: "white",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 46,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${tick})`,
        }}
      >
        ✓
      </div>
    </div>
  );
};

// ===========================================================================
// 13. Call to action

export const Cta: React.FC = () => {
  const cue = useCue();
  const float = useFloat(10);
  const bubble = useEnter(cue(0.55), { damping: 10, stiffness: 180 });
  const shield = useEnter(cue(0.2));
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="YOUR TURN · FIG. 10" right="COMMENT" dark />
      <Headline setup="Phir bhi aansu aaye?" punch="Aapki trick kya hai?" dark punchSize={110} />
      <div style={{ position: "absolute", left: 540 - 190, top: 640 + float }}>
        <Onion id="ct" size={380} />
        <div style={{ position: "absolute", left: 270, top: 250, opacity: shield, transform: `scale(${shield})` }}>
          <ShieldIcon size={140} color={C.orange} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1120,
          textAlign: "center",
          fontFamily: DEVA,
          fontSize: 58,
          color: C.cream,
          opacity: useEnter(cue(0.25)),
        }}
      >
        वो अपनी जान बचा रहा था
      </div>
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 1260,
          transform: `translateX(-50%) scale(${bubble})`,
          background: C.orange,
          color: C.slate,
          borderRadius: 999,
          padding: "16px 44px",
          fontFamily: HEAD,
          fontWeight: 700,
          fontSize: 54,
          letterSpacing: 2,
          display: "flex",
          alignItems: "center",
          gap: 18,
          whiteSpace: "nowrap",
        }}
      >
        COMMENT KARO
        <svg width="40" height="48" viewBox="0 0 40 48">
          <path d="M20 4 V 40 M6 26 L 20 42 L 34 26" fill="none" stroke={C.slate} strokeWidth={7} strokeLinecap="round" />
        </svg>
      </div>
      <Sfx at={cue(0.2)} src="onion/sparkle.wav" volume={0.35} />
      <Sfx at={cue(0.55)} src="sfx/pop.wav" volume={0.55} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  weapon: Weapon,
  rooms: Rooms,
  knife: KnifeCut,
  twist: Twist,
  discovery: Discovery,
  gas: Gas,
  eyes: Eyes,
  garlic: GarlicProof,
  ignobel: IgNobel,
  why: Why,
  tips: Tips,
  cta: Cta,
};
