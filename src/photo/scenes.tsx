import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Arrow, Bolt, Cactus, Cell, Check, Chloroplast, CO2, Drop, Glucose, H2O, HAtom, Leaf, Moon, O2, Stoma, Sun } from "./art";
import {
  BODY,
  Box,
  clamp,
  Cursor,
  GridBg,
  HEAD,
  Headline,
  K,
  Label,
  Pill,
  popStyle,
  PromptBar,
  Row,
  Sparkle,
  useCue,
  usePop,
  Window,
} from "./kit";

// Scenes for the photosynthesis explainer. Each scene: grid paper, a big
// tagged headline, and the "Leaf.app" window whose content tells the beat.
// Cues are fractions of the scene so they track the voiceover.

// Window content area (inside the border, below the title bar).
const CW = 950;
const CH = 806;

const Sfx: React.FC<{ at: number; src?: string; volume?: number }> = ({ at, src = "sfx/pop.wav", volume = 0.35 }) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

/** Absolutely placed child that pops in at a frame. */
const At: React.FC<{ x: number; y: number; delay: number; children: React.ReactNode; center?: boolean; style?: React.CSSProperties }> = ({
  x,
  y,
  delay,
  children,
  center = true,
  style,
}) => {
  const p = usePop(delay);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `${center ? "translate(-50%, -50%) " : ""}scale(${0.6 + 0.4 * p})`,
        opacity: interpolate(p, [0, 0.25], [0, 1], clamp),
        width: "max-content",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Deco: React.FC<{ a?: string; b?: string }> = ({ a = K.orange, b = K.green }) => (
  <>
    <Sparkle x={930} y={250} size={90} color={a} delay={12} />
    <Sparkle x={70} y={600} size={60} color={b} delay={16} />
  </>
);

// ---------------------------------------------------------------------------

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const ans = usePop(cue(0.74));
  return (
    <AbsoluteFill>
      <GridBg />
      <Headline top="How do plants" tag="+ make" bottom="food?" />
      <Deco />
      <Window>
        <At x={CW / 2} y={300} delay={14}>
          <Leaf size={400} sway={Math.sin(frame / 14) * 6} />
        </At>
        <At x={160} y={140} delay={24}>
          <Box bg={K.yellow} r={50} shadow={6} style={{ width: 100, height: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 70, color: K.ink }}>?</span>
          </Box>
        </At>
        <At x={790} y={200} delay={30}>
          <Box bg={K.pink} r={50} shadow={6} style={{ width: 84, height: 84, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(12deg)" }}>
            <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: K.ink }}>?</span>
          </Box>
        </At>
        <div style={{ position: "absolute", left: 0, right: 0, top: 530, display: "flex", justifyContent: "center", ...popStyle(ans) }}>
          <Pill text="PHOTOSYNTHESIS" bg={K.green} size={48} />
        </div>
        <PromptBar text="how do plants make food?" typeFrom={cue(0.08)} sendAt={cue(0.7)} />
        <Cursor
          path={[
            [0, 700, 900],
            [cue(0.55), 700, 900],
            [cue(0.68), 865, 720],
          ]}
          clickAt={cue(0.7)}
        />
      </Window>
      <Sfx at={cue(0.7)} src="onion/tick.wav" volume={0.5} />
      <Sfx at={cue(0.74)} src="onion/sparkle.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Define: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const items = [
    { el: <Sun size={150} frame={frame} />, at: 0.16, label: "Sunlight" },
    { el: <CO2 size={170} />, at: 0.28, label: "CO₂" },
    { el: <Drop size={130} />, at: 0.38, label: "Water" },
  ];
  const stamp = usePop(cue(0.8));
  return (
    <AbsoluteFill>
      <GridBg />
      <Headline top="What is" tag="Photosynthesis" tagSize={100} />
      <Sparkle x={960} y={420} size={70} color={K.yellow} delay={12} />
      <Window>
        <div style={{ position: "absolute", left: 30, right: 30, top: 40, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {items.map((it, i) => (
            <React.Fragment key={it.label}>
              <At x={0} y={0} delay={cue(it.at)} center={false} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ height: 170, display: "flex", alignItems: "center" }}>{it.el}</div>
                <Pill text={it.label} size={28} />
              </At>
              <At x={0} y={0} delay={cue(it.at + 0.05)} center={false} style={{ position: "relative" }}>
                <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 80, color: K.ink }}>{i < 2 ? "+" : ""}</span>
              </At>
            </React.Fragment>
          ))}
        </div>
        <At x={CW / 2} y={360} delay={cue(0.48)}>
          <svg width={60} height={110} viewBox="0 0 60 110">
            <path d="M30 6 L30 84 M10 64 L30 92 L50 64" stroke={K.ink} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </At>
        <At x={CW / 2} y={500} delay={cue(0.52)}>
          <Box bg={K.yellow} r={24} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 30px" }}>
            <Glucose size={110} label={false} />
            <Label size={44}>FOOD = carbohydrate</Label>
          </Box>
        </At>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 640,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(stamp, [0, 0.2], [0, 1], clamp),
            transform: `rotate(-4deg) scale(${1.6 - 0.6 * stamp})`,
          }}
        >
          <Pill text="AUTOTROPHIC NUTRITION" bg={K.green} size={46} />
        </div>
      </Window>
      {items.map((it) => (
        <Sfx key={it.label} at={cue(it.at)} />
      ))}
      <Sfx at={cue(0.52)} />
      <Sfx at={cue(0.8)} src="onion/thud.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Inputs: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const rows = [
    { label: "SUNLIGHT", bg: K.yellow, text: "Energy from the Sun", icon: <Sun size={96} frame={frame} />, at: 0.22 },
    { label: "WATER", bg: K.blue, text: "Absorbed by the roots", icon: <Drop size={88} />, at: 0.4 },
    { label: "CO₂", bg: K.white, text: "Taken from the air", icon: <CO2 size={96} />, at: 0.6 },
    { label: "CHLOROPHYLL", bg: K.green, text: "Green pigment in leaves", icon: <Leaf size={92} />, at: 0.78 },
  ];
  return (
    <AbsoluteFill>
      <GridBg />
      <Headline top="What a" tag="+ Leaf" bottom="needs" />
      <Deco />
      <Window>
        <div style={{ position: "absolute", left: 36, right: 36, top: 44, display: "flex", flexDirection: "column", gap: 30 }}>
          {rows.map((r) => (
            <Row key={r.label} label={r.label} labelBg={r.bg} text={r.text} icon={r.icon} delay={cue(r.at)} />
          ))}
        </div>
      </Window>
      {rows.map((r) => (
        <Sfx key={r.label} at={cue(r.at)} />
      ))}
    </AbsoluteFill>
  );
};

export const Where: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const focus = interpolate(frame, [cue(0.72), cue(0.82)], [0, 1], clamp);
  const cards = [
    { el: <Leaf size={200} sway={Math.sin(frame / 16) * 4} />, label: "LEAF", at: 0.12, bg: K.yellow },
    { el: <Cell size={210} glow={focus} />, label: "CELL", at: 0.38, bg: "#FFE6C9" },
    { el: <Chloroplast size={220} glow={focus} />, label: "CHLOROPLAST", at: 0.58, bg: "#E5F8D6" },
  ];
  return (
    <AbsoluteFill>
      <GridBg />
      <Headline top="Where does" tag="it happen?" tagColor={K.orange} tagSize={128} />
      <Deco a={K.green} b={K.orange} />
      <Window>
        <Box bg={K.orange} r={30} shadow={8} style={{ position: "absolute", left: 24, right: 24, top: 60, height: 470, display: "flex", alignItems: "center", justifyContent: "space-around", padding: "0 14px" }}>
          {cards.map((c, i) => {
            const p = usePop(cue(c.at));
            const big = i === 2 ? 1 + 0.1 * focus : 1;
            return (
              <React.Fragment key={c.label}>
                {i > 0 && (
                  <div style={{ opacity: p }}>
                    <Arrow w={44} />
                  </div>
                )}
                <div style={{ ...popStyle(p * big), display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                  <Box bg={c.bg} r={20} shadow={6} style={{ width: 250, height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {c.el}
                  </Box>
                  <Pill text={c.label} size={i === 2 ? 26 : 30} />
                </div>
              </React.Fragment>
            );
          })}
        </Box>
        <At x={CW / 2} y={650} delay={cue(0.8)}>
          <Box bg={K.green} r={20} style={{ padding: "16px 30px", transform: "rotate(-2deg)" }}>
            <Label size={46}>Chlorophyll lives here!</Label>
          </Box>
        </At>
      </Window>
      {cards.map((c) => (
        <Sfx key={c.label} at={cue(c.at)} />
      ))}
      <Sfx at={cue(0.8)} src="onion/sparkle.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Stomata: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const open = interpolate(frame, [cue(0.56), cue(0.66), cue(0.84), cue(0.93)], [0, 1, 1, 0], clamp);
  const waterIn = interpolate(frame, [cue(0.48), cue(0.6)], [0, 1], clamp);
  const waterOut = interpolate(frame, [cue(0.84), cue(0.95)], [0, 1], clamp);
  const isOpen = open > 0.5;
  const cx = CW / 2;
  const cy = 330;
  return (
    <AbsoluteFill>
      <GridBg />
      <Headline top="How does" tag="CO₂ get in?" tagSize={128} />
      <Deco />
      <Window>
        <At x={cx} y={cy} delay={cue(0.22)}>
          <Stoma size={460} open={open} />
        </At>
        {/* water drops flowing into / out of the guard cells */}
        {[-1, 1].map((s) =>
          [0, 1].map((k) => {
            const tIn = waterIn;
            const tOut = waterOut;
            const x = cx + s * (420 - 260 * tIn + 260 * tOut) + k * s * 30;
            const y = cy - 40 + k * 90;
            const o = tIn > 0 && tIn < 1 ? 1 : tOut > 0 && tOut < 1 ? 1 : 0;
            return (
              <div key={`${s}${k}`} style={{ position: "absolute", left: x - 30, top: y - 30, opacity: o }}>
                <Drop size={60} />
              </div>
            );
          }),
        )}
        {/* CO2 drifting into the open pore */}
        {[0, 1, 2].map((i) => {
          const t = ((frame - cue(0.62) + i * 22) % 66) / 66;
          const show = frame > cue(0.62) && open > 0.6;
          return (
            <div key={i} style={{ position: "absolute", left: cx - 60 + (i - 1) * 40 * (1 - t), top: 40 + t * 260, opacity: show ? 1 - t * 0.8 : 0, transform: `scale(${1 - t * 0.6})` }}>
              <CO2 size={120} />
            </div>
          );
        })}
        <At x={40} y={50} delay={cue(0.28)} center={false}>
          <Pill text="STOMATA = tiny pores" bg={K.yellow} size={32} />
        </At>
        <At x={cx} y={600} delay={cue(0.45)}>
          <Pill text="GUARD CELLS" bg={K.green} size={34} />
        </At>
        <div style={{ position: "absolute", left: 0, right: 0, top: 680, display: "flex", justifyContent: "center", ...popStyle(usePop(cue(0.5))) }}>
          <Box bg={isOpen ? K.green : K.orange} r={20} style={{ padding: "12px 28px" }}>
            <Label size={40}>{isOpen ? "Water in → swell → PORE OPEN" : waterOut > 0 ? "Water out → PORE CLOSED" : "PORE CLOSED"}</Label>
          </Box>
        </div>
      </Window>
      <Sfx at={cue(0.22)} />
      <Sfx at={cue(0.62)} src="onion/sparkle.wav" volume={0.3} />
      <Sfx at={cue(0.92)} src="onion/thud.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

const StepHeadline: React.FC<{ n: number; text: string }> = ({ n, text }) => (
  <Headline top="Step" tag={`${n} / 3`} bottom={text} tagColor={[K.yellow, K.blue, K.green][n - 1]} />
);

export const Absorb: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const beam = interpolate(frame, [cue(0.45), cue(0.7)], [0, 1], clamp);
  const glow = interpolate(frame, [cue(0.6), cue(0.8)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <GridBg />
      <StepHeadline n={1} text="Absorb light" />
      <Deco a={K.yellow} />
      <Window progress={interpolate(frame, [cue(0.4), cue(0.9)], [0, 1 / 3], clamp)}>
        <At x={190} y={170} delay={cue(0.3)}>
          <Sun size={240} frame={frame} />
        </At>
        <svg width={CW} height={CH} style={{ position: "absolute", left: 0, top: 0 }}>
          {[-30, 0, 30].map((d, i) => (
            <line
              key={i}
              x1={260}
              y1={230 + d}
              x2={260 + (360 + d) * beam}
              y2={230 + d + 220 * beam}
              stroke={K.yellow}
              strokeWidth={14}
              strokeLinecap="round"
              strokeDasharray="26 18"
              strokeDashoffset={-frame * 3}
              style={{ filter: "drop-shadow(3px 3px 0 #151515)" }}
            />
          ))}
        </svg>
        <At x={650} y={440} delay={cue(0.4)}>
          <Chloroplast size={380} glow={glow} />
        </At>
        {[0, 1, 2].map((i) => (
          <At key={i} x={520 + i * 130} y={250 - (i % 2) * 40} delay={cue(0.72) + i * 5}>
            <Bolt size={70} />
          </At>
        ))}
        <At x={CW / 2} y={700} delay={cue(0.6)}>
          <Box bg={K.yellow} r={20} style={{ padding: "14px 28px" }}>
            <Label size={42}>Chlorophyll absorbs light energy</Label>
          </Box>
        </At>
      </Window>
      <Sfx at={cue(0.45)} src="sfx/whoosh.wav" volume={0.3} />
      <Sfx at={cue(0.72)} src="onion/sparkle.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Split: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const split = interpolate(frame, [cue(0.5), cue(0.62)], [0, 1], clamp);
  const rise = interpolate(frame, [cue(0.64), cue(0.95)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <GridBg />
      <StepHeadline n={2} text="Split water" />
      <Deco a={K.blue} />
      <Window progress={interpolate(frame, [cue(0.2), cue(0.9)], [1 / 3, 2 / 3], clamp)}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
          <At x={0} y={0} delay={cue(0.08)} center={false} style={{ position: "relative" }}>
            <Pill text="LIGHT ENERGY" bg={K.yellow} size={32} />
          </At>
          <At x={0} y={0} delay={cue(0.14)} center={false} style={{ position: "relative" }}>
            <Arrow w={70} />
          </At>
          <At x={0} y={0} delay={cue(0.2)} center={false} style={{ position: "relative" }}>
            <Pill text="CHEMICAL ENERGY" bg={K.orange} size={32} />
          </At>
        </div>
        {[0, 1, 2].map((i) => (
          <At key={i} x={190 + i * 285} y={420} delay={cue(0.36) + i * 4}>
            <div style={{ position: "relative" }}>
              <H2O size={220} split={split} oxygen={1 - Math.min(1, rise * 4)} />
            </div>
          </At>
        ))}
        {/* oxygen leaves as O2, rising out of the leaf */}
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 300 + i * 260,
              top: 300 - rise * 220,
              opacity: rise > 0 ? 1 - Math.max(0, rise - 0.7) * 3 : 0,
              transform: `scale(${0.6 + 0.4 * Math.min(1, rise * 3)})`,
            }}
          >
            <O2 size={140} />
          </div>
        ))}
        <At x={230} y={640} delay={cue(0.66)}>
          <Pill text="H → used in step 3" bg={K.white} size={30} />
        </At>
        <At x={700} y={640} delay={cue(0.74)}>
          <Pill text="O₂ released!" bg={K.green} size={34} />
        </At>
      </Window>
      <Sfx at={cue(0.5)} src="onion/slice.wav" volume={0.4} />
      <Sfx at={cue(0.66)} />
      <Sfx at={cue(0.74)} src="onion/sparkle.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Reduce: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const merge = interpolate(frame, [cue(0.18), cue(0.4)], [0, 1], clamp);
  const chain = interpolate(frame, [cue(0.68), cue(0.85)], [0, 1], clamp);
  const cx = CW / 2;
  return (
    <AbsoluteFill>
      <GridBg />
      <StepHeadline n={3} text="Make glucose" />
      <Deco a={K.green} b={K.yellow} />
      <Window progress={interpolate(frame, [cue(0.2), cue(0.9)], [2 / 3, 1], clamp)}>
        {/* CO2 from the left, H from the right, meeting in the middle */}
        {[0, 1].map((i) => (
          <div key={`c${i}`} style={{ position: "absolute", left: 40 + (cx - 200) * merge, top: 90 + i * 150 + (150 - i * 150) * merge * 0.5, opacity: merge < 1 ? 1 : 0, transform: `scale(${1 - merge * 0.5})` }}>
            <CO2 size={180} />
          </div>
        ))}
        {[0, 1, 2].map((i) => (
          <div key={`h${i}`} style={{ position: "absolute", left: CW - 130 - (CW / 2 - 100) * merge, top: 80 + i * 110 + (110 - i * 110) * merge * 0.6, opacity: merge < 1 ? 1 : 0 }}>
            <HAtom size={80} />
          </div>
        ))}
        <At x={cx} y={230} delay={cue(0.42)}>
          <Glucose size={260} />
        </At>
        <At x={cx} y={400} delay={cue(0.44)}>
          <Pill text="GLUCOSE (carbohydrate)" bg={K.yellow} size={34} />
        </At>
        <div style={{ position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", alignItems: "center", opacity: chain > 0 ? 1 : 0 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ width: 30 * chain, height: 10, background: K.ink, opacity: chain }} />}
              <div style={{ transform: `scale(${Math.min(1, Math.max(0, chain * 5 - i))})` }}>
                <Glucose size={120} label={false} />
              </div>
            </React.Fragment>
          ))}
        </div>
        <At x={cx} y={710} delay={cue(0.8)}>
          <Box bg={K.green} r={20} style={{ padding: "12px 28px", transform: "rotate(-2deg)" }}>
            <Label size={42}>Extra glucose → STARCH (stored)</Label>
          </Box>
        </At>
      </Window>
      <Sfx at={cue(0.42)} src="onion/sparkle.wav" volume={0.4} />
      <Sfx at={cue(0.7)} />
      <Sfx at={cue(0.8)} />
    </AbsoluteFill>
  );
};

const Formula: React.FC<{ parts: [string, string?][]; size: number }> = ({ parts, size }) => (
  <span style={{ fontFamily: BODY, fontWeight: 700, fontSize: size, color: K.ink, whiteSpace: "nowrap" }}>
    {parts.map(([t, sub], i) => (
      <React.Fragment key={i}>
        {t}
        {sub && <sub style={{ fontSize: size * 0.55 }}>{sub}</sub>}
      </React.Fragment>
    ))}
  </span>
);

export const Equation: React.FC = () => {
  const cue = useCue();
  const card = usePop(cue(0.22));
  const lhs = usePop(cue(0.25));
  const arrow = usePop(cue(0.45));
  const rhs = usePop(cue(0.62));
  return (
    <AbsoluteFill>
      <GridBg />
      <Headline top="The" tag="Equation" bottom="to remember" tagColor={K.yellow} />
      <Deco />
      <Window>
        <div style={{ position: "absolute", left: 30, right: 30, top: 40, ...popStyle(card) }}>
          <Box bg="#FFF8EA" r={26} shadow={8} style={{ padding: "34px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={popStyle(lhs)}>
              <Formula size={76} parts={[["6CO", "2"], [" + 12H", "2"], ["O"]]} />
            </div>
            <div style={{ ...popStyle(arrow), display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <Pill text="sunlight" bg={K.yellow} size={28} />
              <svg width={120} height={110} viewBox="0 0 60 110">
                <path d="M30 6 L30 84 M10 64 L30 92 L50 64" stroke={K.ink} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Pill text="chlorophyll" bg={K.green} size={28} />
            </div>
            <div style={popStyle(rhs)}>
              <Formula size={66} parts={[["C", "6"], ["H", "12"], ["O", "6"], [" + 6O", "2"], [" + 6H", "2"], ["O"]]} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
              {[
                ["glucose", K.yellow, 0.68],
                ["oxygen", K.blue, 0.75],
                ["water", K.white, 0.82],
              ].map(([t, bg, at]) => (
                <div key={t as string} style={popStyle(usePop(cue(at as number)))}>
                  <Pill text={t as string} bg={bg as string} size={28} />
                </div>
              ))}
            </div>
          </Box>
        </div>
      </Window>
      <Sfx at={cue(0.25)} />
      <Sfx at={cue(0.45)} src="sfx/whoosh.wav" volume={0.3} />
      <Sfx at={cue(0.62)} src="onion/sparkle.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Tip: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const day = usePop(cue(0.1));
  const night = usePop(cue(0.38));
  const sticker = usePop(cue(0.74));
  const panel = (isNight: boolean, p: number) => (
    <div style={{ width: 420, ...popStyle(p) }}>
      <Box bg={isNight ? "#2E3A6E" : "#FFE9A8"} r={24} shadow={8} style={{ height: 520, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 20, top: 20 }}>
          <Pill text={isNight ? "NIGHT" : "DAY"} bg={isNight ? K.purple : K.yellow} size={30} />
        </div>
        <div style={{ position: "absolute", right: 24, top: 16 }}>{isNight ? <Moon size={100} /> : <Sun size={110} frame={frame} />}</div>
        <div style={{ position: "absolute", left: 30, top: 150 }}>
          <Cactus size={180} />
        </div>
        <div style={{ position: "absolute", right: 30, top: 160 }}>
          <Stoma size={160} open={isNight ? 1 : 0} />
        </div>
        <div style={{ position: "absolute", left: 20, right: 20, bottom: 24 }}>
          <Label size={32} color={isNight ? K.white : K.ink} style={{ textAlign: "center" }}>
            {isNight ? "Stomata open → takes in CO₂" : "Stomata closed → saves water, makes food"}
          </Label>
        </div>
      </Box>
    </div>
  );
  return (
    <AbsoluteFill>
      <GridBg />
      <Headline top="Board" tag="Exam tip" tagColor={K.orange} bottom="Desert plants" />
      <Sparkle x={900} y={300} size={110} color={K.yellow} delay={10} />
      <Window>
        <div style={{ position: "absolute", left: 30, right: 30, top: 40, display: "flex", justifyContent: "space-between" }}>
          {panel(false, day)}
          {panel(true, night)}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 610,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(sticker, [0, 0.2], [0, 1], clamp),
            transform: `rotate(-3deg) scale(${1.5 - 0.5 * sticker})`,
          }}
        >
          <Box bg={K.green} r={22} style={{ padding: "14px 26px" }}>
            <Label size={38}>The 3 steps need not happen one right after another!</Label>
          </Box>
        </div>
      </Window>
      <Sfx at={cue(0.1)} />
      <Sfx at={cue(0.38)} />
      <Sfx at={cue(0.74)} src="onion/thud.wav" volume={0.5} />
    </AbsoluteFill>
  );
};

export const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const steps = [
    { t: "Absorb light energy", at: 0.08, icon: <Sun size={80} frame={frame} /> },
    { t: "Split water → release O₂", at: 0.2, icon: <Drop size={70} /> },
    { t: "Reduce CO₂ → glucose", at: 0.34, icon: <Glucose size={80} label={false} /> },
  ];
  const save = usePop(cue(0.6));
  const saved = frame >= cue(0.78);
  return (
    <AbsoluteFill>
      <GridBg />
      <Headline top="Quick" tag="Recap" tagColor={K.green} />
      <Deco a={K.orange} b={K.yellow} />
      <Window>
        <div style={{ position: "absolute", left: 36, right: 36, top: 44, display: "flex", flexDirection: "column", gap: 26 }}>
          {steps.map((s, i) => {
            const on = interpolate(frame, [cue(s.at) + 6, cue(s.at) + 16], [0, 1], clamp);
            return (
              <div key={s.t} style={{ ...popStyle(usePop(cue(s.at))), transformOrigin: "left center" }}>
                <Box bg={on > 0.5 ? "#E5F8D6" : K.white} r={22} shadow={7} style={{ display: "flex", alignItems: "center", gap: 22, padding: "16px 22px" }}>
                  <Check size={78} on={on} />
                  <Label size={40} style={{ flex: 1 }}>
                    {i + 1}. {s.t}
                  </Label>
                  {s.icon}
                </Box>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", ...popStyle(save) }}>
          <Box bg={saved ? K.green : K.yellow} r={30} shadow={10} style={{ padding: "20px 40px", display: "flex", alignItems: "center", gap: 20, transform: `rotate(-2deg) scale(${saved ? 1.04 : 1})` }}>
            <svg viewBox="0 0 40 52" width={44} height={56}>
              <path d="M4 4 H36 V48 L20 36 L4 48 Z" fill={saved ? K.ink : K.white} stroke={K.ink} strokeWidth={5} strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: K.ink, textTransform: "uppercase" }}>{saved ? "Saved!" : "Save for exams"}</span>
          </Box>
        </div>
        <Cursor path={[[0, 900, 820], [cue(0.62), 900, 820], [cue(0.76), 560, 640]]} clickAt={cue(0.78)} />
      </Window>
      {steps.map((s) => (
        <Sfx key={s.t} at={cue(s.at) + 8} src="onion/tick.wav" volume={0.45} />
      ))}
      <Sfx at={cue(0.78)} src="onion/sparkle.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const p = usePop(4);
  const out = interpolate(frame, [50, 76], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <GridBg />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ ...popStyle(p), display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
          <Leaf size={220} sway={Math.sin(frame / 12) * 6} />
          <Box bg={K.green} r={20} style={{ padding: "8px 34px 16px", transform: "rotate(-2deg)" }}>
            <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 110, color: K.ink, textTransform: "uppercase" }}>Class 10</span>
          </Box>
          <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 84, color: K.ink, textTransform: "uppercase" }}>Science, simplified</span>
        </div>
      </AbsoluteFill>
      <Sparkle x={220} y={620} size={100} color={K.orange} delay={8} />
      <Sparkle x={860} y={1300} size={80} color={K.yellow} delay={12} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  define: Define,
  inputs: Inputs,
  where: Where,
  stomata: Stomata,
  absorb: Absorb,
  split: Split,
  reduce: Reduce,
  equation: Equation,
  tip: Tip,
  cta: Cta,
};
