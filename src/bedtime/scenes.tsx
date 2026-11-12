import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { clamp } from "../onion/components";
import { DEVA } from "../onion/theme";
import { Cloud, Frog, Glow, Hills, House, Jugnu, Lotus, Moon, Nest, NIGHT, NightSky, Pari, PariInBed, Stars, Zzz } from "./art";
import { useLineStart, useStoryTime, useTalk } from "./timing";

// One component per story beat (ids match story.json). Frames are
// scene-relative; useStoryTime() gives seconds into the beat's voice clip
// so actions can land on the words.

const smooth = { ...clamp, easing: Easing.inOut(Easing.cubic) };

/** Very slow push-in so every scene breathes. */
const Camera: React.FC<{ children: React.ReactNode; origin?: string }> = ({ children, origin = "50% 45%" }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ transform: `scale(${1 + frame * 0.00016})`, transformOrigin: origin }}>{children}</AbsoluteFill>;
};

/** Gentle up-down float for flying characters. */
const useBob = (speed = 24, amp = 14, phase = 0) => {
  const frame = useCurrentFrame();
  return Math.sin(frame / speed + phase) * amp;
};

const At: React.FC<{ x: number; y: number; children: React.ReactNode; rotate?: number; opacity?: number }> = ({
  x,
  y,
  children,
  rotate = 0,
  opacity = 1,
}) => <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rotate}deg)`, opacity }}>{children}</div>;

// ---------------------------------------------------------------------------
// Shared: Pari's bedroom

const Bedroom: React.FC<{ warm?: number; moonClosed?: number }> = ({ warm = 0, moonClosed = 0 }) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${NIGHT.wall} 0%, #262E63 70%, #1A1F45 100%)` }}>
    {/* window with the night outside */}
    <div style={{ position: "absolute", left: 250, top: 230, width: 580, height: 560, borderRadius: "290px 290px 24px 24px", overflow: "hidden", border: `22px solid ${NIGHT.wood}` }}>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${NIGHT.sky0}, ${NIGHT.sky2})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 540, height: 520 }}>
          <Stars count={24} seed={4} maxY={0.27} />
        </div>
        <At x={300} y={70}>
          <Moon size={170} closed={moonClosed} />
        </At>
        <div style={{ position: "absolute", left: -40, top: 400, width: 640, height: 200, borderRadius: "50%", background: "#203A5A" }} />
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 257, top: 0, width: 22, height: "100%", background: NIGHT.wood }} />
      <div style={{ position: "absolute", top: 300, left: 0, width: "100%", height: 22, background: NIGHT.wood }} />
    </div>
    {/* curtains */}
    <div style={{ position: "absolute", left: 170, top: 190, width: 130, height: 680, borderRadius: "0 0 80px 20px", background: "#6D5BB5" }} />
    <div style={{ position: "absolute", left: 780, top: 190, width: 130, height: 680, borderRadius: "0 0 20px 80px", background: "#6D5BB5" }} />
    <div style={{ position: "absolute", left: 140, top: 170, width: 800, height: 34, borderRadius: 17, background: NIGHT.wood }} />
    {/* moonlight falling into the room */}
    <div
      style={{
        position: "absolute",
        left: 250,
        top: 780,
        width: 580,
        height: 900,
        background: "linear-gradient(180deg, rgba(255,242,194,0.10), rgba(255,242,194,0))",
        clipPath: "polygon(0 0, 100% 0, 120% 100%, -20% 100%)",
      }}
    />
    {/* floor */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 1460, bottom: 0, background: "#3A2E4F" }} />
    <div style={{ position: "absolute", left: 180, top: 1560, width: 720, height: 110, borderRadius: "50%", background: "#5A4C86" }} />
    {/* warm glow from Jugnu */}
    <AbsoluteFill style={{ background: "radial-gradient(circle at 60% 55%, rgba(255,226,122,0.22), rgba(0,0,0,0) 60%)", opacity: warm }} />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// 1. Title

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [10, 60], [0, 1], smooth);
  const sub = interpolate(frame, [45, 85], [0, 1], smooth);
  const jx = interpolate(frame, [20, 190], [-200, 1200], clamp);
  const jy = 560 + Math.sin(frame / 14) * 60;
  return (
    <AbsoluteFill>
      <Camera>
        <NightSky stars={90} seed={2} />
        <Glow x={540} y={400} r={380} opacity={0.35} />
        <At x={350} y={210}>
          <Moon size={380} closed={1} />
        </At>
        <Hills top={1180} />
        <At x={570} y={1080}>
          <House width={330} lit={1} />
        </At>
      </Camera>
      <AbsoluteFill style={{ alignItems: "center", top: 700 }}>
        <div
          style={{
            fontFamily: DEVA,
            fontSize: 140,
            color: NIGHT.cream,
            opacity: rise,
            transform: `translateY(${(1 - rise) * 40}px)`,
            textShadow: "0 0 50px rgba(255,226,122,0.55)",
          }}
        >
          परी और जुगनू
        </div>
        <div style={{ fontFamily: DEVA, fontSize: 62, color: "#CFC6F5", opacity: sub, marginTop: 4 }}>नींद वाली सैर</div>
      </AbsoluteFill>
      <At x={jx} y={jy}>
        <Jugnu size={150} />
      </At>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 2. Pari can't sleep

const Awake: React.FC = () => {
  const frame = useCurrentFrame();
  const talk = useTalk("p");
  const look: [number, number] = [Math.sin(frame / 34) * 1.2, -0.6];
  return (
    <AbsoluteFill>
      <Camera origin="50% 60%">
        <Bedroom />
        <At x={60} y={820}>
          <PariInBed width={960} look={look} talk={talk} />
        </At>
      </Camera>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 3. Jugnu at the window

const JugnuArrives: React.FC = () => {
  const sec = useStoryTime();
  const frame = useCurrentFrame();
  const talk = useTalk("j");
  const appear = interpolate(sec, [0.8, 2.4], [0, 1], smooth);
  const flyIn = interpolate(sec, [3.4, 5.2], [0, 1], smooth);
  const x = interpolate(flyIn, [0, 1], [470, 620]) + Math.sin(frame / 16) * 18 * flyIn;
  const y = interpolate(flyIn, [0, 1], [460, 760]) + Math.cos(frame / 20) * 16;
  return (
    <AbsoluteFill>
      <Camera origin="55% 55%">
        <Bedroom warm={appear} />
        <At x={60} y={820}>
          <PariInBed width={960} look={[1, -1]} />
        </At>
        <Glow x={x + 70} y={y + 80} r={260} opacity={0.45 * appear} />
        <At x={x} y={y} opacity={appear}>
          <div style={{ transform: `scale(${0.4 + 0.6 * appear})` }}>
            <Jugnu size={170} talk={talk} flip />
          </div>
        </At>
      </Camera>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Pari + Jugnu flying together (birds, pond, clouds)

const Flyers: React.FC<{ x: number; y: number; size?: number; wave?: boolean; jugnuSide?: "left" | "right" }> = ({
  x,
  y,
  size = 240,
  wave,
  jugnuSide = "right",
}) => {
  const frame = useCurrentFrame();
  const talk = useTalk("p");
  const bob = useBob(26, 16);
  const jx = jugnuSide === "right" ? size * 0.85 : -size * 0.45;
  return (
    <>
      <At x={x} y={y + bob} rotate={Math.sin(frame / 40) * 4}>
        <Pari size={size} talk={talk} wave={wave ? 1 : 0} />
      </At>
      <Glow x={x + jx + 60} y={y + 40 + bob * 1.4} r={150} opacity={0.4} />
      <At x={x + jx + Math.sin(frame / 18) * 20} y={y - 10 + bob * 1.4 + Math.cos(frame / 22) * 14}>
        <Jugnu size={size * 0.5} flip={jugnuSide === "right"} />
      </At>
    </>
  );
};

// ---------------------------------------------------------------------------
// 4. The neem tree

const Birds: React.FC = () => {
  const sec = useStoryTime();
  const goodnight = useLineStart(2);
  return (
    <AbsoluteFill>
      <Camera origin="65% 45%">
        <NightSky seed={5} />
        <At x={60} y={140}>
          <Moon size={200} closed={1} />
        </At>
        {/* branch */}
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
          <path d="M1120 760 Q 800 820 520 900 Q 420 930 300 900" fill="none" stroke="#5E3B2C" strokeWidth={70} strokeLinecap="round" />
          <path d="M760 830 Q 860 1000 1000 1080" fill="none" stroke="#5E3B2C" strokeWidth={36} strokeLinecap="round" />
          {[
            [980, 560, 170],
            [760, 600, 140],
            [560, 700, 120],
            [1040, 960, 150],
            [880, 1100, 110],
            [380, 860, 90],
          ].map(([cx, cy, r], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill={NIGHT.leafDark} />
              <circle cx={cx - r * 0.3} cy={cy - r * 0.25} r={r * 0.6} fill={NIGHT.leaf} />
            </g>
          ))}
        </svg>
        <At x={440} y={640}>
          <Nest width={540} />
        </At>
        <Zzz x={820} y={640} size={56} />
      </Camera>
      <Flyers x={90} y={1000} size={230} wave={sec > goodnight} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 5. The pond

const Pond: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = useStoryTime();
  const yawnAt = useLineStart(1) + 2.6;
  const yawn = interpolate(sec, [yawnAt, yawnAt + 0.8, yawnAt + 2.4, yawnAt + 3.0], [0, 1, 1, 0], smooth);
  const goodnight = useLineStart(2);
  return (
    <AbsoluteFill>
      <Camera origin="40% 55%">
        <NightSky seed={6} />
        <At x={760} y={160}>
          <Moon size={210} closed={1} />
        </At>
        {/* far bank */}
        <div style={{ position: "absolute", left: -100, right: -100, top: 860, height: 160, borderRadius: "50%", background: "#1F3A4A" }} />
        {/* water */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 940, bottom: 0, background: `linear-gradient(180deg, #24467E, ${NIGHT.water} 60%, #142A52)` }} />
        {/* moon reflection */}
        {[0, 1, 2, 3, 4].map((k) => (
          <div
            key={k}
            style={{
              position: "absolute",
              left: 800 - (90 - k * 12) + Math.sin(frame / 14 + k) * 10,
              top: 1000 + k * 34,
              width: 2 * (90 - k * 12),
              height: 10,
              borderRadius: 5,
              background: NIGHT.moon,
              opacity: 0.45 - k * 0.07,
            }}
          />
        ))}
        {/* reeds */}
        <svg viewBox="0 0 1080 1920" width={1080} height={1920} style={{ position: "absolute" }}>
          {[40, 80, 120, 960, 1000, 1040].map((x, i) => (
            <path key={i} d={`M${x} 1200 Q ${x + 10 + Math.sin(frame / 30 + i) * 8} 1000 ${x + 20} ${880 + (i % 3) * 30}`} fill="none" stroke="#2F5A45" strokeWidth={10} strokeLinecap="round" />
          ))}
        </svg>
        <At x={560} y={1150}>
          <Lotus width={190} />
        </At>
        <At x={90} y={1260}>
          <Lotus width={150} />
        </At>
        <At x={180} y={940}>
          <Frog width={520} yawn={yawn} />
        </At>
        {yawn > 0.5 && <Zzz x={560} y={950} size={50} />}
      </Camera>
      <Flyers x={700} y={480} size={210} wave={sec > goodnight} jugnuSide="left" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 6. The clouds

const Clouds: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = useStoryTime();
  const goodnight = useLineStart(2);
  const rise = interpolate(frame, [0, 120], [80, 0], smooth);
  const clouds = [
    { x: 60, y: 300, w: 420, v: 0.35, face: true },
    { x: 620, y: 520, w: 360, v: -0.28, face: true },
    { x: -80, y: 1020, w: 520, v: 0.22, face: true },
    { x: 640, y: 1180, w: 440, v: -0.3, face: true },
    { x: 380, y: 160, w: 260, v: 0.18, face: false },
  ];
  return (
    <AbsoluteFill>
      <Camera>
        <NightSky from="#141B45" to="#5A4A92" seed={7} />
        {clouds.map((c, i) => (
          <At key={i} x={c.x + frame * c.v} y={c.y + Math.sin(frame / 40 + i) * 10}>
            <Cloud width={c.w} face={c.face} opacity={0.95} />
          </At>
        ))}
      </Camera>
      <Flyers x={410} y={700 + rise} size={240} wave={sec > goodnight} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 7. Chanda Mama

const MoonTalks: React.FC = () => {
  const talk = useTalk("c");
  const sec = useStoryTime();
  const frame = useCurrentFrame();
  const smile = interpolate(sec, [0, 1.5], [0.85, 1], smooth);
  const bob = useBob(28, 10);
  return (
    <AbsoluteFill>
      <Camera origin="50% 40%">
        <NightSky seed={8} stars={110} />
        <Glow x={540} y={640} r={620} opacity={0.4} />
        <At x={180} y={280}>
          <div style={{ transform: `scale(${smile})` }}>
            <Moon size={720} talk={talk} />
          </div>
        </At>
        <At x={-60 + Math.sin(frame / 60) * 10} y={1130}>
          <Cloud width={520} face={false} opacity={0.6} />
        </At>
        <At x={620 - Math.sin(frame / 50) * 10} y={1200}>
          <Cloud width={460} face={false} opacity={0.5} />
        </At>
      </Camera>
      <At x={170} y={1010 + bob}>
        <Pari size={190} look={[1, -1]} />
      </At>
      <At x={360 + Math.sin(frame / 16) * 16} y={1000 + bob * 1.4}>
        <Jugnu size={110} />
      </At>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 8. Back home to bed

const Home: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = useStoryTime();
  const pTalk = useTalk("p");
  const jTalk = useTalk("j");
  const closed = sec > 5.6 ? 1 : 0;
  const jx = 600 + Math.sin(frame / 20) * 30;
  const jy = 720 + Math.cos(frame / 26) * 22;
  return (
    <AbsoluteFill>
      <Camera origin="40% 62%">
        <Bedroom warm={0.8} />
        <At x={60} y={820}>
          <PariInBed width={960} closed={closed} talk={pTalk} breathe={closed} />
        </At>
        <Glow x={jx + 70} y={jy + 80} r={240} opacity={0.45} />
        <At x={jx} y={jy}>
          <Jugnu size={160} talk={jTalk} flip />
        </At>
      </Camera>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// 9. Everyone asleep

const Sleep: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = useStoryTime();
  const lit = interpolate(sec, [2, 9], [1, 0.25], smooth);
  const a = frame / 40;
  return (
    <AbsoluteFill>
      <Camera origin="50% 60%">
        <NightSky seed={3} stars={120} />
        <Glow x={540} y={420} r={360} opacity={0.3} />
        <At x={370} y={250}>
          <Moon size={340} closed={1} />
        </At>
        <Hills top={1120} />
        <At x={260} y={930}>
          <House width={560} lit={lit} />
        </At>
        <Zzz x={330} y={960} size={58} />
      </Camera>
      <Glow x={540 + Math.cos(a) * 380 + 50} y={1060 + Math.sin(a) * 120 + 50} r={140} opacity={0.4} />
      <At x={540 + Math.cos(a) * 380} y={1060 + Math.sin(a) * 120}>
        <Jugnu size={100} flip={Math.sin(a) > 0} />
      </At>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  title: Title,
  awake: Awake,
  jugnu: JugnuArrives,
  birds: Birds,
  pond: Pond,
  clouds: Clouds,
  moon: MoonTalks,
  home: Home,
  sleep: Sleep,
};
