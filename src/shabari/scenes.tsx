import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Arm,
  Basket,
  Berry,
  BERRY,
  BERRY_ORANGE,
  blinkAt,
  Broom,
  Diya,
  Hand,
  Head,
  INK,
  LeafPlate,
  Limb,
  Mouth,
  Prince,
  PrinceTorso,
  Quiver,
  RAM_SKIN,
  SAFFRON,
  SAFFRON_DARK,
  SAFFRON_LIGHT,
  Shabari,
  SHABARI_SKIN,
  SharedDefs,
} from "./art";
import {
  Birds,
  Bush,
  Cloud,
  Falling,
  ForestPath,
  Grass,
  Ground,
  Hills,
  Hut,
  Lake,
  Petals,
  Rays,
  SKY,
  SkyFill,
  Sun,
  Tree,
} from "./world";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.sin);

/** Ease a value across the whole scene. */
const useT = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return { frame, t: interpolate(frame, [0, durationInFrames], [0, 1], { ...clamp, easing: ease }) };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Full-frame SVG stage with a slow camera move (scale about a focus point). */
const Stage: React.FC<{
  children: React.ReactNode;
  zoom: [number, number];
  focus?: [number, number];
  pan?: [number, number];
}> = ({ children, zoom, focus = [540, 960], pan = [0, 0] }) => {
  const { t } = useT();
  const s = lerp(zoom[0], zoom[1], t);
  const px = lerp(0, pan[0], t);
  const py = lerp(0, pan[1], t);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
        <SharedDefs />
        <g transform={`translate(${focus[0] + px} ${focus[1] + py}) scale(${s}) translate(${-focus[0]} ${-focus[1]})`}>{children}</g>
      </svg>
    </AbsoluteFill>
  );
};

const Vignette: React.FC<{ strength?: number; color?: string }> = ({ strength = 0.45, color = "40,18,6" }) => (
  <AbsoluteFill
    style={{ background: `radial-gradient(ellipse 85% 70% at 50% 50%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)` }}
  />
);

/** Soft out-of-focus light circles for close-up backgrounds. */
const Bokeh: React.FC<{ frame: number; n: number; seed: string; colors: string[] }> = ({ frame, n, seed, colors }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const x = random(`${seed}x${i}`) * 1080;
      const y = random(`${seed}y${i}`) * 1920 - frame * (0.2 + random(`${seed}v${i}`) * 0.4);
      const r = 30 + random(`${seed}r${i}`) * 80;
      const o = 0.12 + 0.18 * (0.5 + 0.5 * Math.sin(frame / 20 + i));
      return <circle key={i} cx={x} cy={y} r={r} fill={colors[i % colors.length]} opacity={o} />;
    })}
  </g>
);

// ---------------------------------------------------------------------------
// 1. Dawn: Shabari sweeps the path and scatters petals for Ram.

export const Sweeping: React.FC = () => {
  const { frame } = useT();
  const ang = 24 + 12 * Math.sin(frame / 11);
  const rad = (ang * Math.PI) / 180;
  const top: [number, number] = [26, 150];
  const low: [number, number] = [top[0] - Math.sin(rad) * 140, top[1] + Math.cos(rad) * 140];
  const brushX = top[0] - Math.sin(rad) * 410;
  return (
    <AbsoluteFill>
      <Stage zoom={[1.0, 1.1]} focus={[560, 1180]}>
        <SkyFill sky={SKY.dawn} id="s1sky" />
        <Sun x={780} y={760} r={80} />
        <Cloud x={260} y={420} s={1.2} />
        <Cloud x={860} y={330} s={0.8} />
        <Birds frame={frame} x={160} y={560} />
        <Hills y={960} color="#9FB7A8" seed={1} amp={90} />
        <Hills y={1040} color="#7FA06A" seed={2} amp={50} />
        <Lake x={860} y={1080} w={260} h={46} />
        <Tree x={90} y={1130} s={0.95} sway={Math.sin(frame / 30) * 1.5} />
        <Tree x={1010} y={1180} s={0.85} sway={Math.sin(frame / 34) * 1.5} color="#6E9C45" />
        <Hut x={250} y={1110} s={0.58} />
        <Ground y={1060} />
        <ForestPath vx={720} vy={1060} />
        <Petals vx={720} vy={1060} n={80} seed="s1" />
        <Grass n={40} y0={1100} y1={1900} seed="s1" />
        <Bush x={70} y={1650} s={1.1} flowers="#F6A21E" />
        <Bush x={1020} y={1720} s={1.2} flowers="#EE7E9C" />
        <g transform="translate(520 1080) scale(0.92)">
          <Shabari
            frame={frame}
            tilt={-6}
            look={-0.6}
            arms={
              <>
                <g transform={`translate(${top[0]} ${top[1] - 20}) rotate(${ang})`}>
                  <Broom />
                </g>
                <Arm who="shabari" s={[-74, 34]} e={[-60, 130]} h={top} w={24} sleeve={SAFFRON} />
                <Arm who="shabari" s={[74, 34]} e={[70, 160]} h={low} w={24} sleeve={SAFFRON_LIGHT} />
              </>
            }
          />
          {/* dust from the broom */}
          {[0, 1, 2, 3].map((i) => {
            const p = ((frame + i * 9) % 36) / 36;
            return <circle key={i} cx={brushX - 20 + i * 18 + p * 30} cy={560 - p * 50} r={8 + p * 14} fill="#E9D3A6" opacity={0.6 * (1 - p)} />;
          })}
        </g>
        <Falling frame={frame} n={14} colors={["#F6A21E", "#EE7E9C", "#F2C14E"]} seed="s1f" speed={2.4} />
      </Stage>
      <Vignette strength={0.3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 2. Under the ber tree she tastes each berry, keeping only the sweet ones.

export const Tasting: React.FC = () => {
  const { frame } = useT();
  const lift = interpolate(frame, [20, 62, 112, 142], [0, 1, 1, 0.7], { ...clamp, easing: ease });
  const hand: [number, number] = [lerp(40, 26, lift), lerp(300, -30, lift)];
  const atLips = lift > 0.92;
  const mouth: Mouth = atLips ? (frame % 20 < 10 ? "chew" : "soft") : frame > 112 ? "smile" : "soft";
  return (
    <AbsoluteFill>
      <Stage zoom={[1.0, 1.08]} focus={[540, 900]}>
        <rect x={-200} y={-200} width={1480} height={2400} fill="#7FA35A" />
        <Tree x={540} y={1500} s={3.2} fruit fruitR={5} seed="bt" sway={Math.sin(frame / 40)} />
        <Bokeh frame={frame} n={14} seed="s2" colors={["#FFF1C2", "#F9D58A", "#FFFFFF"]} />
        <rect x={-200} y={1500} width={1480} height={700} fill="#A7B868" />
        <g transform="translate(540 1110) scale(2.3)">
          <Shabari
            frame={frame}
            closed={atLips}
            mouth={mouth}
            tilt={lerp(4, -3, lift)}
            look={0.3}
            arms={<Arm who="shabari" s={[-70, 34]} e={[-118, 190]} h={[-70, 268]} w={24} sleeve={SAFFRON} />}
            front={
              <>
                <Berry x={hand[0] - 10} y={hand[1] - 22} r={15} color={BERRY} />
                <Arm who="shabari" s={[70, 34]} e={[lerp(130, 120, lift), lerp(220, 110, lift)]} h={hand} w={24} sleeve={SAFFRON_LIGHT} />
              </>
            }
          />
          <g transform="translate(0 290)">
            <Basket />
          </g>
          <g transform="translate(-190 330) scale(0.9)">
            <LeafPlate berries={4} />
          </g>
        </g>
      </Stage>
      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 3. Years pass: she waits at her door every evening, watching the path.

export const Waiting: React.FC = () => {
  const { frame, t } = useT();
  const night = interpolate(frame, [30, 120], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <Stage zoom={[1.12, 1.0]} focus={[400, 1150]}>
        <SkyFill sky={SKY.dusk} id="s3sky" />
        <rect x={-200} y={-200} width={1480} height={2400} fill="#141A3A" opacity={night * 0.7} />
        {Array.from({ length: 40 }).map((_, i) => (
          <circle
            key={i}
            cx={random(`st${i}`) * 1080}
            cy={random(`sty${i}`) * 900}
            r={2 + random(`sts${i}`) * 3}
            fill="#FFF6D8"
            opacity={night * (0.5 + 0.5 * Math.sin(frame / 8 + i))}
          />
        ))}
        <Sun x={820} y={lerp(900, 1060, t)} r={70} color="#FFB36B" />
        <circle cx={240} cy={340} r={46} fill="#F7F0D8" opacity={night} />
        <Hills y={980} color="#6C557E" seed={3} amp={80} />
        <Hills y={1050} color="#5B6E4E" seed={4} amp={40} />
        <Ground y={1040} color="#7F8F4E" />
        <ForestPath vx={880} vy={1040} color="#CFA978" />
        <Petals vx={880} vy={1040} n={50} seed="s3" />
        <Tree x={1000} y={1080} s={0.7} color="#6B7F3A" dark="#4A5A2A" />
        <Hut x={360} y={1290} s={1.0} doorGlow={0.6} />
        <g transform="translate(360 1010) scale(0.6)">
          <Shabari
            frame={frame}
            pose="sit"
            look={1}
            tilt={4}
            arms={
              <>
                <Arm who="shabari" s={[-70, 34]} e={[-120, 170]} h={[-90, 280]} w={24} sleeve={SAFFRON} />
                <Arm who="shabari" s={[70, 34]} e={[120, 170]} h={[90, 280]} w={24} sleeve={SAFFRON_LIGHT} />
              </>
            }
          />
        </g>
        <g transform="translate(560 1300) scale(0.9)">
          <Diya frame={frame} />
        </g>
        <Grass n={30} y0={1300} y1={1900} seed="s3" />
        <Bush x={980} y={1800} s={1.3} />
        <Falling frame={frame} n={16} colors={["#C9782E", "#A65A22", "#D9A23E"]} seed="s3f" speed={2.8} size={22} leaf />
      </Stage>
      <Vignette strength={0.5} color="20,10,30" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 4. One morning, Ram and Lakshman walk up the petal path.

export const Arrival: React.FC = () => {
  const { frame, t } = useT();
  const step = Math.sin(frame / 7);
  const bob = Math.abs(Math.cos(frame / 7)) * 8;
  return (
    <AbsoluteFill>
      <Stage zoom={[1.0, 1.06]} focus={[540, 1100]}>
        <SkyFill sky={SKY.gold} id="s4sky" />
        <Sun x={540} y={700} r={110} color="#FFF0BE" />
        <Hills y={980} color="#C7B88A" seed={5} amp={60} />
        <Ground y={1000} color="#A9B865" />
        <ForestPath vx={540} vy={1000} />
        <Petals vx={540} vy={1000} n={110} seed="s4" />
        <Tree x={60} y={1350} s={1.4} sway={Math.sin(frame / 30)} />
        <Tree x={1030} y={1320} s={1.3} sway={Math.sin(frame / 28)} color="#6E9C45" />
        <Tree x={250} y={1060} s={0.7} />
        <Tree x={840} y={1050} s={0.65} />
        <Rays x={540} y={500} frame={frame} />
        <g transform={`translate(${lerp(730, 760, t)} ${lerp(1040, 1110, t) - bob}) scale(${lerp(0.5, 0.62, t)})`}>
          <Prince who="lakshman" frame={frame} stride={-step} look={-0.3} blinkOffset={30} />
        </g>
        <g transform={`translate(${lerp(470, 440, t)} ${lerp(1080, 1180, t) - bob}) scale(${lerp(0.62, 0.78, t)})`}>
          <Prince who="ram" frame={frame} stride={step} mouth="smile" />
        </g>
        <Bush x={120} y={1880} s={1.3} flowers="#F2C14E" />
        <Bush x={960} y={1900} s={1.4} flowers="#EE7E9C" />
        <Falling frame={frame} n={22} colors={["#F6A21E", "#EE7E9C", "#F2C14E", "#FFFFFF"]} seed="s4f" speed={2} />
      </Stage>
      <Vignette strength={0.25} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 5. Close-up: hands folded, tears of joy.

export const Tears: React.FC = () => {
  const { frame } = useT();
  const tear = interpolate(frame, [18, 110], [0, 1], clamp);
  const glow = interpolate(frame, [0, 100], [0.2, 0.9], clamp);
  return (
    <AbsoluteFill>
      <Stage zoom={[1.0, 1.1]} focus={[540, 900]}>
        <defs>
          <radialGradient id="s5bg" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#FBE3A6" />
            <stop offset="55%" stopColor="#D9A458" />
            <stop offset="100%" stopColor="#7E6A35" />
          </radialGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={2400} fill="url(#s5bg)" />
        <Bokeh frame={frame} n={16} seed="s5" colors={["#FFF4CF", "#F7C873", "#A8C77A"]} />
        <g transform="translate(540 1260) scale(3.3)">
          <g transform="translate(0 -112)">
            <circle r={150} fill="url(#halo)" opacity={glow} />
          </g>
          <Shabari
            frame={frame}
            mouth={frame < 70 ? "tremble" : "smile"}
            tear={tear}
            tilt={-2}
            arms={
              <>
                <Limb d="M -70 40 Q -110 160 -14 150" w={24} color={SHABARI_SKIN} />
                <Limb d="M 70 40 Q 110 160 14 150" w={24} color={SHABARI_SKIN} />
                <Hand x={-9} y={118} r={17} color={SHABARI_SKIN} rot={12} />
                <Hand x={9} y={118} r={17} color={SHABARI_SKIN} rot={-12} />
                <path d="M 0 96 L 0 140" stroke={INK} strokeWidth={3} />
              </>
            }
          />
        </g>
      </Stage>
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 6. Ram sits on her floor and eats the berries she tasted for him.

const RamSeated: React.FC<{ frame: number; bite: number; mouth: Mouth }> = ({ frame, bite, mouth }) => {
  const hand: [number, number] = [lerp(-20, -30, bite), lerp(330, -28, bite)];
  return (
    <g>
      <Head who="ram" layer="back" />
      <Quiver />
      {/* cross-legged lap */}
      <path d="M -170 400 C -190 330, -120 262, -76 262 L 76 262 C 120 262, 190 330, 170 400 Q 0 430 -170 400 Z" fill={SAFFRON} stroke={INK} strokeWidth={5} />
      <path d="M -150 392 Q 0 360 150 392" stroke={SAFFRON_DARK} strokeWidth={4} fill="none" />
      <ellipse cx={-70} cy={392} rx={34} ry={14} fill={RAM_SKIN} stroke={INK} strokeWidth={4.5} />
      <ellipse cx={74} cy={384} rx={34} ry={14} fill={RAM_SKIN} stroke={INK} strokeWidth={4.5} />
      <path d="M -40 -48 L -44 8 Q 0 20 44 8 L 40 -48 Z" transform="scale(0.55 1)" fill={RAM_SKIN} stroke={INK} strokeWidth={5} />
      <PrinceTorso who="ram" breathe={Math.sin(frame / 22)} />
      <Arm who="ram" s={[88, 36]} e={[150, 200]} h={[120, 330]} band />
      <Head who="ram" layer="front" blink={blinkAt(frame, 112)} mouth={mouth} closed={mouth === "chew"} />
      {bite > 0.05 && bite < 0.97 && <Berry x={hand[0] + 12} y={hand[1] - 22} r={14} color={BERRY_ORANGE} />}
      <Arm who="ram" s={[-88, 36]} e={[lerp(-150, -130, bite), lerp(200, 110, bite)]} h={hand} band />
    </g>
  );
};

export const Offering: React.FC = () => {
  const { frame } = useT();
  const bite = interpolate(frame, [20, 55, 80, 100], [0, 1, 1, 0], { ...clamp, easing: ease });
  const mouth: Mouth = frame < 50 ? "smile" : frame < 60 ? "open" : frame < 104 ? "chew" : "smile";
  const offer = interpolate(frame, [0, 30], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <Stage zoom={[1.0, 1.05]} focus={[540, 1200]} pan={[-20, 0]}>
        <SkyFill sky={SKY.day} id="s6sky" />
        <Cloud x={200} y={360} />
        <Cloud x={880} y={260} s={0.7} />
        <Tree x={900} y={1000} s={1.1} fruit seed="s6t" />
        <Tree x={80} y={980} s={0.9} />
        <Hut x={330} y={1010} s={0.8} />
        <Ground y={990} color="#C9A574" />
        <Petals vx={540} vy={1000} n={60} seed="s6" />
        <g transform="translate(860 1020) scale(0.6)">
          <Prince
            who="lakshman"
            frame={frame}
            mouth={frame < 90 ? "open" : "smile"}
            look={-1}
            blinkOffset={50}
          />
        </g>
        <g transform="translate(540 1000) scale(0.9)">
          <RamSeated frame={frame} bite={bite} mouth={mouth} />
        </g>
        {/* Shabari from behind, kneeling, offering the leaf plate with both hands */}
        <g transform="translate(330 1520)">
          <path d="M -170 400 C -180 230, -120 70, 0 60 C 120 70, 180 230, 170 400 Z" fill={SAFFRON} stroke={INK} strokeWidth={5} />
          <path d="M -90 130 Q -110 260 -120 390 M 10 90 Q 20 240 0 390 M 90 130 Q 120 260 110 390" stroke={SAFFRON_DARK} strokeWidth={4} fill="none" />
          <Limb d={`M 40 110 Q ${lerp(90, 120, offer)} 40 ${lerp(150, 180, offer)} ${lerp(-60, -150, offer)}`} w={26} color={SHABARI_SKIN} />
          <Limb d={`M 120 130 Q ${lerp(200, 230, offer)} 60 ${lerp(250, 290, offer)} ${lerp(-50, -140, offer)}`} w={26} color={SHABARI_SKIN} />
          <Limb d="M 40 110 L 70 70" w={34} color={SAFFRON_LIGHT} />
          <Limb d="M 120 130 L 150 95" w={34} color={SAFFRON_LIGHT} />
          <path d="M -150 380 C -110 130, -80 40, -60 0" stroke="#9E3D1E" strokeWidth={10} fill="none" />
          <ellipse cx={0} cy={-40} rx={96} ry={110} fill={SAFFRON} stroke={INK} strokeWidth={5} />
          <path d="M -60 -120 C -40 -146, 40 -146, 60 -120" stroke={SAFFRON_DARK} strokeWidth={5} fill="none" />
          <path d="M -88 30 C -40 60, 40 60, 88 30" stroke="#9E3D1E" strokeWidth={10} fill="none" />
          <g transform={`translate(${lerp(200, 236, offer)} ${lerp(-80, -170, offer)}) rotate(-6)`}>
            <LeafPlate berries={5} />
          </g>
        </g>
        <Bush x={1000} y={1880} s={1.2} flowers="#F2C14E" />
      </Stage>
      <Vignette strength={0.3} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 7. Close-up: Ram smiles, a half-eaten berry in his fingers.

export const RamSmile: React.FC = () => {
  const { frame } = useT();
  return (
    <AbsoluteFill>
      <Stage zoom={[1.0, 1.12]} focus={[540, 1000]}>
        <defs>
          <radialGradient id="s7bg" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="#FFEFC2" />
            <stop offset="60%" stopColor="#E7B064" />
            <stop offset="100%" stopColor="#8C6A33" />
          </radialGradient>
        </defs>
        <rect x={-200} y={-200} width={1480} height={2400} fill="url(#s7bg)" />
        <Bokeh frame={frame} n={16} seed="s7" colors={["#FFF8DA", "#F8CF7E", "#9CC27A"]} />
        <g transform="translate(540 1330) scale(3.0)">
          <g transform="translate(0 -112)">
            <circle r={170} fill="url(#halo)" opacity={0.85} />
          </g>
          <Head who="ram" layer="back" tilt={-3} />
          <Quiver />
          <path d="M -24 -48 L -26 8 Q 0 20 26 8 L 24 -48 Z" fill={RAM_SKIN} stroke={INK} strokeWidth={5} />
          <PrinceTorso who="ram" breathe={Math.sin(frame / 22)} />
          <Head who="ram" layer="front" blink={blinkAt(frame, 70, 20)} mouth="smile" look={0.4} tilt={-3} />
          <Arm who="ram" s={[88, 36]} e={[150, 160]} h={[66, 30]} band />
          <Berry x={58} y={0} r={15} color={BERRY} bitten />
        </g>
        <Falling frame={frame} n={14} colors={["#F6A21E", "#EE7E9C", "#FFFFFF"]} seed="s7f" speed={1.6} />
      </Stage>
      <Vignette strength={0.45} />
    </AbsoluteFill>
  );
};

export const SCENES = [
  { id: "sweeping", Comp: Sweeping, frames: 150 },
  { id: "tasting", Comp: Tasting, frames: 150 },
  { id: "waiting", Comp: Waiting, frames: 135 },
  { id: "arrival", Comp: Arrival, frames: 150 },
  { id: "tears", Comp: Tears, frames: 135 },
  { id: "offering", Comp: Offering, frames: 165 },
  { id: "smile", Comp: RamSmile, frames: 120 },
];
