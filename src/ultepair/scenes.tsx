import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useVideoConfig } from "remotion";
import {
  Bats,
  Cam,
  clamp,
  Courtyard,
  Defs,
  Field,
  Fireflies,
  Footprint,
  H,
  Hills,
  MudCloseup,
  MudPath,
  Sky,
  TamarindTree,
  Vignette,
  Village,
  W,
} from "./art";
import { Bhola, Dadi, Lota, Witch } from "./cast";
import { useScene } from "./timeline";

const ease = Easing.inOut(Easing.cubic);

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }}>
    <Defs />
    {children}
  </svg>
);

/** Piecewise camera moves: keys are [frame, zoom, cx, cy], eased between. */
const camAt = (f: number, keys: [number, number, number, number][]) => {
  if (f <= keys[0][0]) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const [f1, z1, x1, y1] = keys[i];
    const [f0, z0, x0, y0] = keys[i - 1];
    if (f <= f1) {
      const p = ease((f - f0) / Math.max(1, f1 - f0));
      return [f, z0 + (z1 - z0) * p, x0 + (x1 - x0) * p, y0 + (y1 - y0) * p];
    }
  }
  return keys[keys.length - 1];
};

const Text: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ position: "absolute", fontFamily: "Mukta", fontWeight: 700, color: "#f1e6c8", ...style }}>{children}</div>
);

// ------------------------------------------------------------------ title

const TitleScene: React.FC = () => {
  const { f, dur } = useScene();
  const t = interpolate(f, [18, 48], [0, 1], { ...clamp, easing: ease });
  const flicker = f % 41 < 2 || f % 67 < 2 ? 0.45 : 1;
  const eyes = interpolate(f, [dur - 70, dur - 58], [0, 1], clamp) * (f % 50 < 4 ? 0.1 : 1);
  return (
    <AbsoluteFill>
      <Stage>
        <Cam z={interpolate(f, [0, dur], [1.06, 1])} cx={960} cy={540}>
          <Sky moon={[1520, 190]} moonR={80} />
          <Bats y={230} />
          <Hills y={720} />
          <rect x={-100} y={760} width={W + 200} height={400} fill="#0b1610" />
          <TamarindTree x={330} y={930} s={1.05} eyes={eyes} />
          <Fireflies n={10} y0={650} y1={1000} />
          {/* backward footprints appear right-to-left while their toes point right */}
          {Array.from({ length: 7 }, (_, i) => (
            <Footprint key={i} x={1750 - i * 200} y={960 + (i % 2 ? 30 : -30)} rot={90} s={0.9} opacity={interpolate(f, [6 + i * 10, 14 + i * 10], [0, 1], clamp)} glow={0.6} />
          ))}
        </Cam>
        <Vignette />
      </Stage>
      <Text
        style={{
          left: 820,
          top: 270,
          width: 1000,
          textAlign: "center",
          fontFamily: "Rozha One",
          fontWeight: 400,
          fontSize: 230,
          lineHeight: 1.1,
          color: "#f3e7c6",
          opacity: t * flicker,
          transform: `scale(${1.18 - 0.18 * t})`,
          textShadow: "0 0 30px #c0281e, 0 0 80px #7a0f0a, 0 8px 0 #000",
        }}
      >
        उल्टे पैर
      </Text>
      <Text style={{ left: 820, top: 560, width: 1000, textAlign: "center", fontSize: 50, color: "#c9d4f0", opacity: interpolate(f, [40, 60], [0, 1], clamp) }}>
        एक गाँव की डरावनी-मज़ेदार कहानी
      </Text>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ fields

const FieldsScene: React.FC = () => {
  const { f, line, speaking } = useScene();
  const f3 = line("f3");
  const walking = f < f3.start;
  const bx = interpolate(f, [0, f3.start], [-120, 860], clamp);
  const p = interpolate(f, [f3.start - 6, f3.start + 22], [0, 1], { ...clamp, easing: ease });
  const z = 1 + 0.1 * Math.min(1, f / f3.start) + p * 0.45;
  return (
    <AbsoluteFill>
      <Stage>
        <Cam z={z} cx={960 + (bx - 960) * p} cy={540 + 50 * p}>
          <Sky moon={[1450, 170]} />
          <Bats y={260} />
          <Hills y={600} />
          <Village y={612} s={0.8} />
          <TamarindTree x={1720} y={640} s={0.3} />
          <Field horizon={600} />
          <MudPath y={870} h={80} />
          <Bhola x={bx} y={915} s={0.85} walk={walking ? 1 : 0} expr={walking ? "calm" : "happy"} arms={speaking("f3") ? "wave" : "swing"} talk={speaking("f3")} look={walking ? 1 : 0} />
          <Fireflies n={12} y0={620} y1={1000} />
        </Cam>
        <Vignette />
      </Stage>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ prints

const GhostFoot: React.FC<{ x: number; y: number; lift: number; o: number }> = ({ x, y, lift, o }) => (
  // side view, toes pointing RIGHT while it walks LEFT
  <g transform={`translate(${x} ${y - lift}) scale(-2.6 2.6)`} opacity={o}>
    <path d="M-10 -40 L 10 -40 L 12 18 C 14 26, 6 30, -2 30 L -38 30 C -46 30, -48 22, -40 18 L -12 12 Z" fill="#cfe0d6" stroke="#0b0b0b" strokeWidth={3} />
    {Array.from({ length: 6 }, (_, k) => (
      <circle key={k} cx={-8 + k * 4} cy={-2 + (k % 2) * 2} r={2.6} fill="#d4af37" />
    ))}
  </g>
);

const PrintsScene: React.FC = () => {
  const { f, dur, line, speaking } = useScene();
  const p2 = line("p2");
  const p3 = line("p3");
  if (f < p2.start || f >= p3.start) {
    const closing = f >= p3.start;
    const shift = closing ? 0 : f * 3;
    const lf = f - p3.start;
    const reveal = closing ? interpolate(lf, [40, 70], [0, 1], clamp) : 0;
    const gx = interpolate(lf, [50, dur - p3.start], [1750, 250], clamp);
    return (
      <AbsoluteFill>
        <Stage>
          <Cam z={closing ? 1 + lf * 0.0012 : 1.05} cx={960} cy={540}>
            <MudCloseup shift={shift} />
            {Array.from({ length: 10 }, (_, i) => {
              const x = 120 + i * 230 - shift;
              return <Footprint key={i} x={x} y={540 + (i % 2 ? 80 : -80)} rot={90} s={1.7} glow={closing ? interpolate(lf, [30 + (9 - i) * 6, 40 + (9 - i) * 6], [0, 1], clamp) : 0} />;
            })}
            {closing && (
              <>
                <GhostFoot x={gx} y={600} lift={Math.max(0, Math.sin(lf / 6)) * 40} o={reveal * 0.85} />
                <GhostFoot x={gx + 120} y={480} lift={Math.max(0, -Math.sin(lf / 6)) * 40} o={reveal * 0.85} />
              </>
            )}
          </Cam>
          <Vignette />
        </Stage>
        {closing && (
          <>
            <Text style={{ left: 120, top: 120, fontSize: 64, color: "#ffd9a0", opacity: reveal, textShadow: "0 4px 12px #000" }}>
              उँगलियाँ इधर →
            </Text>
            <Text style={{ right: 120, top: 860, fontSize: 64, color: "#ff8a7a", opacity: interpolate(lf, [80, 100], [0, 1], clamp), textShadow: "0 4px 12px #000" }}>
              ← पर चलती है उधर!
            </Text>
          </>
        )}
      </AbsoluteFill>
    );
  }
  // medium shot: Bhola following the prints
  const lf = f - p2.start;
  const shift = lf * 5;
  return (
    <AbsoluteFill>
      <Stage>
        <Cam z={1.25} cx={880} cy={640}>
          <Sky moon={[1350, 200]} />
          <Hills y={620} shift={shift * 0.3} />
          <Village y={630} s={0.8} shift={shift * 0.4} to={4000} />
          <Field horizon={620} shift={shift} />
          <MudPath y={850} h={130} shift={shift * 1.3} />
          {Array.from({ length: 12 }, (_, i) => {
            const x = (((i * 220 - shift * 1.3) % 2640) + 2640) % 2640 - 300;
            return <Footprint key={i} x={x} y={905 + (i % 2 ? 22 : -22)} rot={90} s={0.55} />;
          })}
          <Bhola x={820} y={935} s={1.05} walk={1} expr="happy" arms={speaking("p2") ? "point" : "swing"} talk={speaking("p2")} look={1} />
        </Cam>
        <Vignette />
      </Stage>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ tree

const TreeScene: React.FC = () => {
  const { f, line, speaking } = useScene();
  const r2 = line("r2");
  const r3 = line("r3");
  if (f < r3.start) {
    const eyes = interpolate(f, [r2.start, r2.start + 14], [0, 1], clamp) * (f % 70 < 4 ? 0.1 : 1);
    const [, z, cx, cy] = camAt(f, [
      [0, 1, 960, 540],
      [r2.start, 1.08, 960, 520],
      [r2.start + 50, 1.7, 1250, 380],
    ]);
    const bt = interpolate(f, [0, r2.start], [0, 1], clamp);
    return (
      <AbsoluteFill>
        <Stage>
          <Cam z={z} cx={cx} cy={cy}>
            <Sky moon={[1330, 150]} moonR={85} />
            <Bats y={200} />
            <Hills y={640} />
            <Field horizon={640} />
            <path d="M120 1080 L 600 1080 C 900 900, 1150 820, 1300 790 L 1180 790 C 1000 820, 600 900, 120 1080 Z" fill="#5a4330" opacity={0.9} />
            {Array.from({ length: 8 }, (_, i) => {
              const t = i / 7;
              const x = 380 + t * (1240 - 380);
              const y = 1060 - Math.sqrt(t) * 260;
              return <Footprint key={i} x={x + (i % 2 ? 14 : -14)} y={y} rot={62} s={0.5 - t * 0.25} glow={interpolate(f, [20 + i * 8, 30 + i * 8], [0, 1], clamp)} />;
            })}
            <TamarindTree x={1250} y={800} s={0.95} eyes={eyes} sway={speaking("r2") ? 3 : 1} />
            <Bhola x={250 + bt * 260} y={1060 - bt * 90} s={0.55} walk={f < r2.start ? 1 : 0} expr={f < r2.start ? "calm" : "scared"} look={1} tremble={f >= r2.start} />
          </Cam>
          <Vignette strength={1.1} />
        </Stage>
      </AbsoluteFill>
    );
  }
  const lf = f - r3.start;
  return (
    <AbsoluteFill>
      <Stage>
        <Cam z={1 + lf * 0.002} cx={960} cy={540}>
          <Sky moon={[300, 160]} />
          <Hills y={700} />
          <Field horizon={700} />
          <TamarindTree x={1550} y={1350} s={2.1} sway={2} />
          <Bhola x={860} y={1180} s={1.75} expr="scared" arms="hug" talk={speaking("r3")} tremble look={Math.sin(lf / 7)} />
        </Cam>
        <Vignette strength={1.2} />
      </Stage>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ scare

const ScareScene: React.FC = () => {
  const { f, line, speaking } = useScene();
  const { fps } = useVideoConfig();
  const s1 = line("s1");
  const s2 = line("s2");
  const drop = spring({ frame: f - s1.start + 3, fps, config: { damping: 9, stiffness: 140 } });
  const wy = -1700 + drop * 1450;
  const shake = interpolate(f, [s1.start, s1.start + 30], [2.2, 0], clamp) + (speaking("s2") ? 0.6 : 0);
  const flash = interpolate(f, [s1.start - 1, s1.start + 5], [0.95, 0], clamp);
  const runOff = interpolate(f, [s2.start + 22, s2.start + 36], [0, 1500], { ...clamp, easing: Easing.in(Easing.quad) });
  const z = 1 + 0.12 * drop;
  return (
    <AbsoluteFill>
      <Stage>
        <Cam z={z} cx={960} cy={540} shake={shake}>
          <Sky moon={[1700, 140]} />
          <Hills y={720} />
          <Field horizon={720} />
          <TamarindTree x={700} y={1500} s={2.2} sway={3} />
          <Bhola
            x={1330 + runOff}
            y={1200}
            s={1.8}
            expr={f >= s1.start ? "shout" : "scared"}
            arms={f >= s1.start ? "up" : "hug"}
            tremble
            talk={speaking("s2")}
            look={-1}
            walk={runOff > 0 ? 2 : 0}
          />
          <g transform={`translate(620 ${wy}) rotate(180)`}>
            <Witch x={0} y={0} s={1.55} mood="scary" talk={speaking("s1")} arms="reach" float={false} feet />
          </g>
        </Cam>
        <rect width={W} height={H} fill="#7a0000" opacity={shake * 0.08} />
        <Vignette strength={1.3} />
        <rect width={W} height={H} fill="#fff" opacity={flash} />
      </Stage>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ chase

const ChaseScene: React.FC = () => {
  const { f, line, speaking } = useScene();
  const c1 = line("c1");
  const shift = f * 24;
  const lost = f >= c1.start + 30;
  const ct = f - (c1.start + 30);
  const chX = 1210 - ct * 14 - Math.max(0, ct - 20) * 10;
  const chY = 905 - Math.max(0, 160 * Math.sin((Math.min(ct, 20) / 20) * Math.PI));
  return (
    <AbsoluteFill>
      <Stage>
        <Cam z={1.08} cx={960} cy={560 + Math.sin(f / 3) * 4}>
          <Sky moon={[1600, 170]} />
          <Bats y={240} />
          <Hills y={600} shift={f * 3} />
          <Village y={612} s={0.8} shift={shift * 0.35} to={6000} />
          <Field horizon={600} shift={shift} />
          <MudPath y={850} h={100} shift={shift * 1.3} />
          {lost && ct < 120 && (
            <g transform={`translate(${chX} ${chY}) rotate(${ct * 25})`}>
              <ellipse cx={0} cy={0} rx={26} ry={9} fill="#6B3E22" stroke="#14100E" strokeWidth={4} />
            </g>
          )}
          <Witch x={470 + Math.sin(f / 20) * 50} y={760 + Math.sin(f / 13) * 25} s={0.72} mood="scary" arms="reach" talk={speaking("c2")} dir={1} />
          <Bhola
            x={1250}
            y={915}
            s={0.95}
            walk={2}
            lean={9}
            expr={speaking("c3") ? "shout" : "scared"}
            arms={speaking("c3") ? "hug" : "swing"}
            talk={speaking("c3")}
            look={-1}
            lostChappal={lost}
          />
        </Cam>
        <Vignette strength={1.1} />
      </Stage>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ dadi

const DadiScene: React.FC = () => {
  const { f, line, speaking } = useScene();
  const { fps } = useVideoConfig();
  const d1 = line("d1");
  const d3 = line("d3");
  const d4 = line("d4");
  const runIn = interpolate(f, [d1.start, d1.start + 40], [-250, 760], clamp);
  const fall = interpolate(f, [d1.start + 40, d1.start + 50], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const sitUp = interpolate(f, [d3.start - 8, d3.start + 6], [0, 1], { ...clamp, easing: ease });
  const rot = -88 * fall + 70 * sitUp;
  const wIn = spring({ frame: f - d3.start - 25, fps, config: { damping: 14 } });
  const realised = f >= d4.start + 25;
  const [, z, cx, cy] = camAt(f, [
    [0, 1, 960, 540],
    [line("d2").start, 1, 960, 540],
    [line("d2").start + 15, 1.3, 1200, 520],
    [d3.start, 1.3, 1200, 520],
    [d3.start + 12, 1, 960, 540],
  ]);
  return (
    <AbsoluteFill>
      <Stage>
        <Cam z={z} cx={cx} cy={cy}>
          <Courtyard />
          <Witch x={300} y={-400 + wIn * 1080} s={0.78} mood={realised ? "shy" : "scary"} arms={realised ? "down" : "reach"} talk={false} />
          <Dadi
            x={1330}
            y={830}
            s={1.15}
            expr={f >= d4.start ? (realised ? "smile" : "surprised") : "stern"}
            talk={speaking("d2") || speaking("d4")}
            lean={f >= d4.start && !realised ? -8 : 0}
          />
          <Bhola
            x={f < d1.start + 40 ? runIn : 760}
            y={930 + 70 * fall - 60 * sitUp}
            s={0.9}
            walk={f < d1.start + 40 ? 2 : 0}
            rot={rot}
            expr={speaking("d3") ? "shout" : fall > 0 && sitUp === 0 ? "scared" : "scared"}
            arms={speaking("d3") ? "up" : "swing"}
            talk={speaking("d3")}
            look={-1}
            tremble={sitUp > 0}
            lostChappal
          />
        </Cam>
        <Vignette strength={0.9} />
      </Stage>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ twist

const TwistScene: React.FC = () => {
  const { f, line, speaking } = useScene();
  const w2 = line("w2");
  const w3 = line("w3");
  const [, z, cx, cy] = camAt(f, [
    [0, 1.25, 1150, 560],
    [w2.start - 6, 1.25, 1150, 560],
    [w2.start + 12, 1.35, 640, 520],
    [w3.start - 6, 1.35, 640, 520],
    [w3.start + 12, 1.02, 960, 540],
  ]);
  const happy = f >= w3.start + 30;
  return (
    <AbsoluteFill>
      <Stage>
        <Cam z={z} cx={cx} cy={cy}>
          <Courtyard steam={interpolate(f, [w3.start + 20, w3.start + 50], [0, 1], clamp)} />
          <Witch x={560} y={770} s={0.95} mood={happy ? "happy" : "shy"} arms={happy ? "wave" : "down"} talk={speaking("w2")} />
          <Bhola x={1560} y={900} s={0.8} expr="scared" arms="hug" look={-1} tremble lostChappal />
          <Dadi x={1270} y={880} s={1.15} expr={f >= w3.start ? "smile" : "stern"} wag={speaking("w1")} point={speaking("w3")} talk={speaking("w1") || speaking("w3")} lantern={!speaking("w1")} />
        </Cam>
        <Vignette strength={0.9} />
      </Stage>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ ending + call to action

const CommentIcon: React.FC = () => (
  <svg width={120} height={110} viewBox="0 0 120 110">
    <path d="M10 14 C 10 8, 14 4, 20 4 L 100 4 C 106 4, 110 8, 110 14 L 110 70 C 110 76, 106 80, 100 80 L 44 80 L 20 104 L 24 80 L 20 80 C 14 80, 10 76, 10 70 Z" fill="#f3e7c6" />
    {[36, 60, 84].map((x) => (
      <circle key={x} cx={x} cy={42} r={8} fill="#2a1414" />
    ))}
  </svg>
);

const EndScene: React.FC = () => {
  const { f, dur, line } = useScene();
  const e2 = line("e2");
  const e3 = line("e3");
  if (f < e2.start) {
    return (
      <AbsoluteFill>
        <Stage>
          <Cam z={1 + f * 0.0015} cx={960} cy={600}>
            <Sky moon={[1450, 170]} />
            <Hills y={650} />
            <Field horizon={650} />
            <TamarindTree x={960} y={900} s={0.95} sway={0.5} />
            <Lota x={1060} y={915} s={0.7} glow={0.6 + 0.2 * Math.sin(f / 10)} />
            <Bhola x={700} y={960} s={0.6} expr="happy" arms="fold" can={false} look={1} />
            <Fireflies n={16} y0={600} y1={1000} />
          </Cam>
          <Vignette />
        </Stage>
      </AbsoluteFill>
    );
  }
  if (f < e3.start) {
    const lf = f - e2.start;
    return (
      <AbsoluteFill>
        <Stage>
          <Cam z={1 + lf * 0.001} cx={960} cy={540}>
            <Sky moon={[1600, 160]} />
            <TamarindTree x={960} y={1750} s={2.3} sway={0.4} />
            <path d="M200 760 C 600 700, 1200 690, 1750 740" stroke="#2a1d16" strokeWidth={46} strokeLinecap="round" fill="none" />
            <Witch x={760} y={735} s={0.55} mood="happy" arms="cup" float={false} />
            <Dadi x={1180} y={735} s={0.55} expr="smile" lantern />
            <Fireflies n={18} y0={200} y1={900} />
          </Cam>
          <Vignette />
        </Stage>
      </AbsoluteFill>
    );
  }
  const lf = f - e3.start;
  const fadeOut = interpolate(f, [dur - 30, dur], [1, 0], clamp);
  const pop = interpolate(lf, [0, 14], [0.85, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 60% 45%, #2a1430 0%, #0b0610 70%)", opacity: fadeOut }}>
      <Stage>
        <Witch x={330} y={1060} s={1.1} mood="happy" arms="wave" />
        <Fireflies n={20} y0={100} y1={1000} />
      </Stage>
      <div style={{ position: "absolute", left: 760, top: 200, width: 1060, transform: `scale(${pop})`, transformOrigin: "50% 50%" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <CommentIcon />
        </div>
        <Text style={{ position: "relative", textAlign: "center", fontSize: 70, lineHeight: 1.25, textShadow: "0 0 26px #b3261e" }}>आपके गाँव में भी ऐसी कोई कहानी है?</Text>
        <Text style={{ position: "relative", textAlign: "center", fontSize: 60, color: "#ffcf7a", marginTop: 26 }}>कमेंट में ज़रूर बताइए</Text>
        <Text style={{ position: "relative", textAlign: "center", fontSize: 40, color: "#c9d4f0", marginTop: 50, opacity: interpolate(lf, [20, 35], [0, 1], clamp) }}>
          लाइक • शेयर • सब्सक्राइब
        </Text>
      </div>
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  title: TitleScene,
  fields: FieldsScene,
  prints: PrintsScene,
  tree: TreeScene,
  scare: ScareScene,
  chase: ChaseScene,
  dadi: DadiScene,
  twist: TwistScene,
  end: EndScene,
};
