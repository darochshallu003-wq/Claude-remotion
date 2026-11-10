import React from "react";
import { AbsoluteFill, Audio, interpolate, random, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, CountUp, DarkBg, Header, Headline, PaperBg, PaperCard, Pill, Stamp, useCue, useEnter, useFloat } from "../onion/components";
import { C, HEAD, MONO } from "../onion/theme";
import { Bacterium, MoonIcon } from "../tamra/art";
import {
  BowlIcon,
  Clock,
  Compressor,
  DANGER,
  DripIcon,
  Fridge,
  GapIcon,
  GearIcon,
  ICE,
  Meter,
  Milk,
  RupeeCoin,
  SealIcon,
  SnowIcon,
  StarIcon,
  StinkIcon,
  Thermometer,
} from "./art";

// Scenes for "What happens if you switch the fridge off at night?".
// Same series look as the onion / haldi / tamra explainers.

const LAB = "FRIDGE LAB";

const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.45 }) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

const From: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => (
  <Sequence from={at} layout="none">
    {children}
  </Sequence>
);

/** Rounded dark chip with an icon and a word. */
const Chip: React.FC<{ x: number; y: number; at: number; Icon: React.FC<{ size: number; color: string }>; text: string; color?: string; dark?: boolean }> = ({
  x,
  y,
  at,
  Icon,
  text,
  color = C.orange,
  dark = false,
}) => {
  const e = useEnter(at);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "14px 28px",
        borderRadius: 999,
        background: dark ? "rgba(243,235,221,0.08)" : C.ink,
        border: dark ? `2px solid ${C.cream}` : undefined,
        opacity: e,
        transform: `scale(${0.8 + 0.2 * e})`,
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={52} color={color} />
      <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 46, color: C.paper }}>{text}</span>
    </div>
  );
};

/** Wall switch toggling at `at`. */
const Switch: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const off = frame >= at;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 130, height: 180, borderRadius: 18, background: "#F3EBDD", border: `6px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 60, height: 110, borderRadius: 10, background: "#DDD3BE", border: `5px solid ${C.ink}`, position: "relative" }}>
        <div style={{ position: "absolute", left: 4, right: 4, height: 46, top: off ? 54 : 4, borderRadius: 6, background: off ? C.red : "#7BAE3F", transition: "none" }} />
      </div>
      <div style={{ position: "absolute", top: -54, fontFamily: MONO, fontSize: 26, letterSpacing: 3, color: C.cream }}>{off ? "OFF" : "ON"}</div>
    </div>
  );
};

// ===========================================================================

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const float = useFloat(8);
  const offAt = cue(0.25);
  const turn = cue(0.5);
  const on = interpolate(frame, [offAt, offAt + 8], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="HOME · FIG. 01" right={LAB} dark />
      {frame < turn ? (
        <Headline setup="Raat ko fridge band?" punch="Bijli bachao!" dark punchColor={ICE} />
      ) : (
        <From at={turn}>
          <Headline setup="Ruko…" punch="Bachat kam, nuksaan zyada" dark punchColor={C.orange} punchAt={2} delay={0} punchSize={104} />
        </From>
      )}
      <div style={{ position: "absolute", left: 250, top: 700 + float }}>
        <Fridge id="hk" size={360} on={on} />
      </div>
      <Switch x={760} y={900} at={offAt} />
      <div style={{ position: "absolute", left: 800, top: 640, opacity: 1 - on }}>
        <MoonIcon size={90} color={C.sulfur} />
      </div>
      <Sfx at={offAt} src="onion/tick.wav" volume={0.6} />
      <Sfx at={turn} src="onion/thud.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

/** On/off square wave drawn left to right. */
const DutyGraph: React.FC<{ x: number; y: number; w: number; at: number; night: number }> = ({ x, y, w, at, night }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 70], [0, 1], clamp);
  const pts: string[] = [];
  const n = 12;
  for (let i = 0; i < n; i++) {
    const x0 = (i / n) * w;
    const x1 = ((i + 1) / n) * w;
    const isNight = i >= n / 2;
    const onFrac = isNight ? 0.25 : 0.55;
    pts.push(`L ${x0} 0 L ${x0} -80 L ${x0 + (x1 - x0) * onFrac} -80 L ${x0 + (x1 - x0) * onFrac} 0 L ${x1} 0`);
  }
  return (
    <svg width={w + 40} height={200} style={{ position: "absolute", left: x, top: y, overflow: "visible" }}>
      <defs>
        <clipPath id="dg">
          <rect x={0} y={-120} width={w * t} height={200} />
        </clipPath>
      </defs>
      <rect x={w / 2} y={-110} width={w / 2} height={130} fill={C.slate} opacity={0.12 * night} />
      <g transform="translate(0 100)">
        <path d={`M 0 0 ${pts.join(" ")}`} stroke={C.ink} strokeWidth={6} fill="none" clipPath="url(#dg)" />
        <line x1={0} y1={0} x2={w} y2={0} stroke={C.ink} strokeWidth={2} opacity={0.4} />
      </g>
      <text x={w * 0.25} y={150} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={3} fill={C.ink}>
        DIN
      </text>
      <text x={w * 0.75} y={150} textAnchor="middle" fontFamily={MONO} fontSize={24} letterSpacing={3} fill={C.ink} opacity={night}>
        RAAT · KAM ON
      </text>
      <text x={-10} y={26} textAnchor="end" fontFamily={MONO} fontSize={20} fill={C.ink}>
        ON
      </text>
    </svg>
  );
};

export const Works: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const night = interpolate(frame, [cue(0.68), cue(0.8)], [0, 1], clamp);
  const pulse = Math.floor(frame / 20) % 2 === 0;
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="BASICS · FIG. 02" right={LAB} dark={false} />
      <Headline setup="Pehle samjho" punch="Fridge kaise chalta hai" dark={false} punchColor={C.rust} punchSize={100} />
      <PaperCard x={90} y={560} w={430} h={640} delay={cue(0.06)} rotate={-2} label="THERMOSTAT" seed="wk1">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Thermometer id="wk" size={150} temp={4} showDanger={0} />
        </AbsoluteFill>
      </PaperCard>
      <PaperCard x={560} y={600} w={430} h={600} delay={cue(0.3)} rotate={3} label="COMPRESSOR" seed="wk2">
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Compressor id="wk" size={320} frame={frame} shake={frame > cue(0.35) && pulse ? 1 : 0} />
        </AbsoluteFill>
      </PaperCard>
      <div style={{ position: "absolute", left: 470, top: 860, fontFamily: HEAD, fontWeight: 700, fontSize: 80, color: C.ink, opacity: useEnter(cue(0.3)) }}>→</div>
      <DutyGraph x={140} y={1250} w={800} at={cue(0.45)} night={night} />
      <Sfx at={cue(0.3)} src="sfx/pop.wav" />
      <Sfx at={cue(0.7)} src="onion/tick.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Timeline: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const hours = interpolate(frame, [cue(0.12), cue(0.9)], [0, 8], clamp);
  const temp = interpolate(hours, [0, 4, 8], [3, 5, 14], clamp);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="TIMELINE · FIG. 03" right="SWITCH OFF" dark />
      <Headline setup="Fridge band kiya…" punch="Kitni der safe?" dark punchColor={ICE} />
      <div style={{ position: "absolute", left: 90, top: 640, opacity: useEnter(cue(0.04)) }}>
        <Clock size={520} hours={hours} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 1190, fontFamily: HEAD, fontWeight: 700, fontSize: 90, color: C.cream }}>
        +{hours.toFixed(1)} GHANTE
      </div>
      <div style={{ position: "absolute", left: 700, top: 560, opacity: useEnter(cue(0.08)) }}>
        <Thermometer id="tl" size={230} temp={temp} labelColor={C.cream} showDanger={interpolate(frame, [cue(0.6), cue(0.7)], [0, 1], clamp)} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 1310, fontFamily: HEAD, fontWeight: 700, fontSize: 80, color: temp > 5 ? DANGER : ICE }}>Andar: ~{Math.round(temp)}°C</div>
      {frame < cue(0.72) && <Stamp text="~4 ghante safe" x={540} y={1530} at={cue(0.48)} color={ICE} blend="normal" size={64} rotate={-6} />}
      {frame >= cue(0.72) && <Stamp text="Danger zone" x={540} y={1530} at={cue(0.72)} color={DANGER} blend="normal" size={80} rotate={-8} />}
      <Sfx at={cue(0.48)} src="onion/thud.wav" />
      <Sfx at={cue(0.72)} src="onion/thud.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

export const Bacteria: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const gen = Math.floor(interpolate(frame, [cue(0.3), cue(0.62)], [0, 6], clamp));
  const count = 2 ** gen;
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="MICRO · FIG. 04" right="5°C – 60°C" dark />
      <Headline setup="5° se 60°C ke beech" punch="Bacteria ki party" dark punchColor={C.green} />
      <div style={{ position: "absolute", left: 90, top: 560, width: 900, height: 620, display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", gap: 10 }}>
        {Array.from({ length: count }).map((_, i) => {
          const born = cue(0.3) + Math.log2(Math.max(1, i + 1)) * ((cue(0.62) - cue(0.3)) / 6);
          const e = interpolate(frame, [born, born + 8], [0, 1], clamp);
          const s = count > 32 ? 80 : count > 8 ? 120 : 170;
          return (
            <div key={i} style={{ transform: `scale(${e}) rotate(${random(`b${i}`) * 360 + frame * (i % 2 ? 0.8 : -0.8)}deg)` }}>
              <Bacterium size={s} />
            </div>
          );
        })}
      </div>
      <Pill text="×2 · HAR 20 MIN" x={330} y={1220} delay={cue(0.3)} dark accent />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1310, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 120, color: C.green, opacity: useEnter(cue(0.68)) }}>
        <CountUp from={1} to={16777216} start={cue(0.7)} frames={cue(0.95) - cue(0.7)} format={(n) => Math.round(n).toLocaleString("en-IN")} />
      </div>
      <Pill text="THEORY · 8 GHANTE · 1 SE 1 CRORE+" x={170} y={1480} delay={cue(0.74)} dark />
      <Sfx at={cue(0.3)} src="sfx/pop.wav" volume={0.35} />
      <Sfx at={cue(0.45)} src="sfx/pop.wav" volume={0.35} />
      <Sfx at={cue(0.7)} src="onion/sparkle.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Morning: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const run = interpolate(frame, [cue(0.12), cue(0.3)], [0, 1], clamp);
  const temp = interpolate(frame, [cue(0.15), cue(0.95)], [14, 6], clamp);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="MORNING · FIG. 05" right="SWITCH ON" dark={false} />
      <Headline setup="Subah switch on" punch="Compressor overtime!" dark={false} punchColor={C.red} punchSize={104} />
      <div style={{ position: "absolute", left: 90, top: 580 }}>
        <Fridge id="mn" size={300} on={run} warm={1 - run * 0.5} />
      </div>
      <div style={{ position: "absolute", left: 460, top: 640, opacity: useEnter(cue(0.12)) }}>
        <Compressor id="mn" size={480} frame={frame} shake={run} heat={run} />
      </div>
      <div style={{ position: "absolute", left: 500, top: 1130, opacity: useEnter(cue(0.3)) }}>
        <Meter size={460} value={0.15 + 0.75 * run} label="FULL POWER" />
      </div>
      <div style={{ position: "absolute", left: 120, top: 1260, fontFamily: HEAD, fontWeight: 700, fontSize: 84, color: C.ink }}>{temp.toFixed(1)}°C ↓</div>
      <Stamp text="Raat ki bachat yahin kharch" x={540} y={1560} at={cue(0.66)} color={C.red} size={56} rotate={-5} />
      <Sfx at={cue(0.12)} src="onion/tick.wav" />
      <Sfx at={cue(0.66)} src="onion/thud.wav" />
    </AbsoluteFill>
  );
};

const Ledger: React.FC<{ y: number; at: number; left: string; right: React.ReactNode; strong?: boolean }> = ({ y, at, left, right, strong }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: `3px dashed rgba(42,36,32,0.35)`, paddingBottom: 12, opacity: e, transform: `translateX(${(1 - e) * -30}px)` }}>
      <span style={{ fontFamily: MONO, fontSize: 30, color: C.ink, letterSpacing: 1 }}>{left}</span>
      <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: strong ? 64 : 52, color: strong ? C.rust : C.ink }}>{right}</span>
    </div>
  );
};

export const Bill: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const spoil = interpolate(frame, [cue(0.72), cue(0.85)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="HISAAB · FIG. 06" right="ANDAAZAN" dark={false} />
      <Headline setup="Hisaab lagao" punch="Bachat: ₹1–2 roz" dark={false} punchColor={C.rust} />
      <PaperCard x={80} y={560} w={920} h={520} delay={cue(0.05)} rotate={-1.5} label="ESTIMATE · ~250 L FRIDGE" seed="bill">
        <div style={{ position: "absolute", inset: 0 }}>
          <Ledger y={50} at={cue(0.12)} left="Fridge / din" right="< 1 unit" />
          <Ledger y={160} at={cue(0.35)} left="Raat band = asli bachat" right="₹1–2 / din" strong />
          <Ledger y={270} at={cue(0.5)} left="Mahine mein" right="~₹30–45" />
        </div>
      </PaperCard>
      <div style={{ position: "absolute", left: 120, top: 1150, opacity: useEnter(cue(0.38)) }}>
        <RupeeCoin size={150} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 1130, opacity: useEnter(cue(0.66)) }}>
        <Milk size={240} sour={spoil} frame={frame} />
      </div>
      <div style={{ position: "absolute", left: 330, top: 1210, fontFamily: HEAD, fontWeight: 700, fontSize: 110, color: C.ink, opacity: useEnter(cue(0.66)) }}>vs</div>
      <Stamp text="Bachat gayi!" x={540} y={1600} at={cue(0.86)} color={C.red} size={86} rotate={-8} />
      <Sfx at={cue(0.35)} src="sfx/pop.wav" />
      <Sfx at={cue(0.86)} src="onion/thud.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

export const Extras: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="SIDE EFFECTS · FIG. 07" right={LAB} dark />
      <Headline setup="Upar se" punch="3 aur nuksaan" dark punchColor={C.orange} />
      <div style={{ position: "absolute", left: 330, top: 560 }}>
        <Fridge id="ex" size={260} on={0} warm={1} frost={1 - interpolate(frame, [cue(0.1), cue(0.35)], [0, 1], clamp)} />
      </div>
      {/* dripping water */}
      {[0, 1, 2].map((i) => {
        const t = ((frame + i * 12) % 36) / 36;
        return <div key={i} style={{ position: "absolute", left: 400 + i * 60, top: 1080 + t * 120, width: 16, height: 24, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: ICE, opacity: frame > cue(0.1) ? 1 - t : 0 }} />;
      })}
      <Chip x={90} y={1270} at={cue(0.12)} Icon={DripIcon} text="Paani tapakna" color={ICE} />
      <Chip x={90} y={1390} at={cue(0.42)} Icon={StinkIcon} text="Andar badboo" color={C.green} />
      <Chip x={90} y={1510} at={cue(0.62)} Icon={GearIcon} text="Compressor pe zor" color={C.orange} />
      <Sfx at={cue(0.12)} src="sfx/pop.wav" />
      <Sfx at={cue(0.42)} src="sfx/pop.wav" />
      <Sfx at={cue(0.62)} src="sfx/pop.wav" />
    </AbsoluteFill>
  );
};

const Tick: React.FC<{ y: number; at: number; Icon: React.FC<{ size: number; color: string }>; text: string }> = ({ y, at, Icon, text }) => {
  const e = useEnter(at);
  const frame = useCurrentFrame();
  const done = frame >= at + 10;
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: y, display: "flex", alignItems: "center", gap: 26, opacity: e, transform: `translateX(${(1 - e) * -40}px)` }}>
      <div style={{ width: 70, height: 70, borderRadius: 14, border: `5px solid ${C.ink}`, background: done ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 52, color: C.paper }}>
        {done ? "✓" : ""}
      </div>
      <Icon size={64} color={C.rust} />
      <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: C.ink }}>{text}</span>
    </div>
  );
};

export const Tips: React.FC = () => {
  const cue = useCue();
  const items = [
    { Icon: SnowIcon, text: "3–4°C setting", at: 0.16 },
    { Icon: BowlIcon, text: "Garam khana thoda thanda", at: 0.33 },
    { Icon: SealIcon, text: "Door ki seal check", at: 0.5 },
    { Icon: GapIcon, text: "Deewar se thoda gap", at: 0.66 },
    { Icon: StarIcon, text: "Zyada star rating", at: 0.82 },
  ];
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="SMART · FIG. 08" right="SACH MEIN BACHAO" dark={false} />
      <Headline setup="Bijli bachani hai?" punch="Ye karo" dark={false} punchColor={C.green} />
      {items.map((it, i) => (
        <Tick key={it.text} y={600 + i * 190} at={cue(it.at)} Icon={it.Icon} text={it.text} />
      ))}
      {items.map((it) => (
        <Sfx key={it.text} at={cue(it.at) + 10} src="onion/tick.wav" volume={0.5} />
      ))}
    </AbsoluteFill>
  );
};

export const Cta: React.FC = () => {
  const cue = useCue();
  const float = useFloat(10);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="VERDICT · FIG. 09" right={LAB} dark />
      <Headline setup="Fridge ko" punch="24×7 chalne do" dark punchColor={ICE} />
      <div style={{ position: "absolute", left: 330, top: 640 + float }}>
        <Fridge id="ct" size={420} on={1} />
      </div>
      <Pill text="COMMENT · AAPKE GHAR MEIN KAUN BAND KARTA HAI?" x={70} y={1560} delay={cue(0.45)} dark accent />
      <Sfx at={cue(0.45)} src="onion/sparkle.wav" />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  works: Works,
  timeline: Timeline,
  bacteria: Bacteria,
  morning: Morning,
  bill: Bill,
  extras: Extras,
  tips: Tips,
  cta: Cta,
};
