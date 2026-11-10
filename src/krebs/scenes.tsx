import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import {
  clamp,
  Event,
  fadeUp,
  Glass,
  Kind,
  M,
  MicroBg,
  Mitochondrion,
  NODES,
  Pill,
  Pointer,
  Reaction,
  Scoreboard,
  Text,
  Title,
  Token,
  useCue,
  usePop,
  Wheel,
} from "./kit";

// Scenes for the Krebs cycle explainer (NEET). Cues are fractions of each
// scene, set to follow its voiceover line.

const Sfx: React.FC<{ at: number; src?: string; volume?: number }> = ({ at, src = "sfx/pop.wav", volume = 0.3 }) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

const WHEEL = { cx: 540, cy: 790, r: 270 };

/** Token that pops in place, holds, then floats up and fades. */
const Float: React.FC<{ kind: Kind; x: number; y: number; at: number }> = ({ kind, x, y, at }) => {
  const frame = useCurrentFrame();
  const p = usePop(at);
  const up = interpolate(frame, [at + 30, at + 90], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y - up * 160, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * p})`, opacity: interpolate(p, [0, 0.3], [0, 1], clamp) * (1 - up) }}>
      <Token kind={kind} size={40} />
    </div>
  );
};

const Sounds: React.FC<{ events: Event[] }> = ({ events }) => (
  <>
    {events.map((e, i) => (
      <Sfx key={i} at={e.at - 8} src="onion/sparkle.wav" volume={0.3} />
    ))}
  </>
);

// ---------------------------------------------------------------------------

export const Hook: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <MicroBg />
      <Title title="Krebs Cycle" sub="NEET • Respiration in Plants" />
      <Wheel cx={540} cy={900} r={300} spin delay={6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, display: "flex", justifyContent: "center", gap: 20, ...fadeUp(usePop(cue(0.18))) }}>
        <Pill text="Glucose" color={M.white} size={34} />
        <Text size={40}>→</Text>
        <Pill text="ENERGY" color={M.atp} size={34} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center", ...fadeUp(usePop(cue(0.5))) }}>
        <Pill text="Asked every year in NEET" color={M.nadh} size={36} style={{ background: "rgba(20,30,24,0.85)" }} />
      </div>
      <Sfx at={cue(0.5)} src="onion/thud.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Where: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const glow = interpolate(frame, [cue(0.4), cue(0.55)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <MicroBg />
      <Title sub="Where does it happen?" />
      <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center", ...fadeUp(usePop(cue(0.05))) }}>
        <Pill text="Pyruvate from glycolysis ↓" color={M.white} size={32} />
      </div>
      <Mitochondrion cx={540} cy={880} w={860} glow={glow} />
      <Pointer x={150} y={960} tx={200} ty={1200} text="Outer membrane" delay={cue(0.2)} />
      <Pointer x={430} y={800} tx={460} ty={600} text="Inner membrane (cristae)" delay={cue(0.28)} />
      <Pointer x={660} y={930} tx={760} ty={1200} text="Matrix" delay={cue(0.42)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1310, display: "flex", justifyContent: "center", ...fadeUp(usePop(cue(0.5))) }}>
        <Glass style={{ padding: "14px 30px" }}>
          <Text size={40} color={M.active}>
            Krebs cycle happens in the MATRIX
          </Text>
        </Glass>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1460, display: "flex", justifyContent: "center", gap: 20 }}>
        <div style={fadeUp(usePop(cue(0.68)))}>
          <Pill text="TCA cycle" color={M.atp} size={34} />
        </div>
        <div style={fadeUp(usePop(cue(0.78)))}>
          <Pill text="Citric acid cycle" color={M.atp} size={34} />
        </div>
      </div>
      <Sfx at={cue(0.42)} src="onion/sparkle.wav" volume={0.35} />
      <Sfx at={cue(0.68)} />
      <Sfx at={cue(0.78)} />
    </AbsoluteFill>
  );
};

export const Link: React.FC = () => {
  const cue = useCue();
  return (
    <AbsoluteFill>
      <MicroBg />
      <Title title="Link Reaction" sub="Before the cycle" />
      <Reaction
        from={[{ n: 3, name: "Pyruvate" }]}
        to={{ n: 2, name: "Acetyl CoA" }}
        enzyme="Pyruvate dehydrogenase"
        at={cue(0.1)}
        y={560}
        note="Oxidative decarboxylation"
        noteAt={cue(0.3)}
      />
      <Float kind="CO2" x={360} y={1090} at={cue(0.52)} />
      <Float kind="NADH" x={720} y={1090} at={cue(0.62)} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1300, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, ...fadeUp(usePop(cue(0.85))) }}>
        <Glass style={{ padding: "16px 30px" }}>
          <Text size={38}>
            Acetyl CoA (2C) <span style={{ color: M.active }}>enters the Krebs cycle</span>
          </Text>
        </Glass>
        <Pill text="Needs NAD⁺ + Coenzyme A" color={M.dim} size={28} />
      </div>
      <Sfx at={cue(0.52)} src="onion/sparkle.wav" volume={0.3} />
      <Sfx at={cue(0.62)} src="onion/sparkle.wav" volume={0.3} />
    </AbsoluteFill>
  );
};

/** Common layout for the cycle steps: wheel, reaction card(s), scoreboard. */
const StepFrame: React.FC<{
  sub: string;
  active: number[];
  lit: number[];
  children: React.ReactNode;
  before: Partial<Record<Kind, number>>;
  events: Event[];
}> = ({ sub, active, lit, children, before, events }) => (
  <AbsoluteFill>
    <MicroBg />
    <Title sub={sub} />
    <Wheel {...WHEEL} active={active} lit={lit} />
    {children}
    <Scoreboard before={before} events={events} />
    <Sounds events={events} />
  </AbsoluteFill>
);

export const Entry: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const second = frame >= cue(0.72);
  return (
    <StepFrame sub="Step 1 • Entry" active={second ? [0] : [7]} lit={second ? [0, 1] : [7, 0]} before={{}} events={[]}>
      {!second ? (
        <Reaction from={[{ n: 2, name: "Acetyl CoA" }, { n: 4, name: "OAA" }]} to={{ n: 6, name: "Citric acid" }} enzyme="Citrate synthase" at={cue(0.08)} note="FIRST PRODUCT of Krebs cycle" noteAt={cue(0.55)} />
      ) : (
        <Reaction from={[{ n: 6, name: "Citric acid" }]} to={{ n: 6, name: "Isocitrate" }} enzyme="Aconitase" at={cue(0.72)} note="Isomerisation" noteAt={cue(0.82)} />
      )}
      <Sfx at={cue(0.55)} src="onion/thud.wav" volume={0.4} />
    </StepFrame>
  );
};

export const First: React.FC = () => {
  const cue = useCue();
  const events: Event[] = [
    { kind: "CO2", at: cue(0.4) },
    { kind: "NADH", at: cue(0.55) },
  ];
  return (
    <StepFrame sub="Step 2 • Decarboxylation" active={[1]} lit={[1, 2]} before={{}} events={events}>
      <Reaction from={[{ n: 6, name: "Isocitrate" }]} to={{ n: 5, name: "α-Ketoglutarate" }} enzyme="Isocitrate dehydrogenase" at={cue(0.06)} />
    </StepFrame>
  );
};

export const Second: React.FC = () => {
  const cue = useCue();
  const events: Event[] = [
    { kind: "CO2", at: cue(0.36) },
    { kind: "NADH", at: cue(0.5) },
  ];
  return (
    <StepFrame sub="Step 3 • Decarboxylation" active={[2]} lit={[2, 3]} before={{ CO2: 1, NADH: 1 }} events={events}>
      <Reaction from={[{ n: 5, name: "α-Ketoglutarate" }]} to={{ n: 4, name: "Succinyl CoA" }} enzyme="α-KG dehydrogenase" at={cue(0.04)} />
    </StepFrame>
  );
};

export const Energy: React.FC = () => {
  const cue = useCue();
  const events: Event[] = [{ kind: "GTP", at: cue(0.42) }];
  return (
    <StepFrame sub="Step 4 • Energy" active={[3]} lit={[3, 4]} before={{ CO2: 2, NADH: 2 }} events={events}>
      <Reaction
        from={[{ n: 4, name: "Succinyl CoA" }]}
        to={{ n: 4, name: "Succinate" }}
        enzyme="Succinyl CoA synthetase"
        at={cue(0.05)}
        note="Substrate-level phosphorylation"
        noteAt={cue(0.7)}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1100, display: "flex", justifyContent: "center", ...fadeUp(usePop(cue(0.5))) }}>
        <Pill text="GTP → ATP" color={M.atp} size={28} style={{ background: "rgba(20,30,24,0.9)" }} />
      </div>
    </StepFrame>
  );
};

export const Regen: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const stage = frame < cue(0.5) ? 0 : frame < cue(0.63) ? 1 : frame < cue(0.9) ? 2 : 3;
  const events: Event[] = [
    { kind: "FADH2", at: cue(0.2) },
    { kind: "NADH", at: cue(0.78) },
  ];
  const all = [0, 1, 2, 3, 4, 5, 6, 7];
  const done = usePop(cue(0.9));
  return (
    <StepFrame
      sub="Steps 5–7 • Back to OAA"
      active={stage === 3 ? all : [[4], [5], [6]][stage]}
      lit={stage === 3 ? all : [[4, 5], [5, 6], [6, 7]][stage]}
      before={{ CO2: 2, NADH: 2, ATP: 1 }}
      events={events}
    >
      {stage === 0 && (
        <Reaction from={[{ n: 4, name: "Succinate" }]} to={{ n: 4, name: "Fumarate" }} enzyme="Succinate dehydrogenase" at={cue(0.05)} note="Only enzyme on the inner membrane!" noteAt={cue(0.3)} />
      )}
      {stage === 1 && <Reaction from={[{ n: 4, name: "Fumarate" }]} to={{ n: 4, name: "Malate" }} enzyme="Fumarase" at={cue(0.5)} note="+ H₂O" noteAt={cue(0.53)} />}
      {stage >= 2 && <Reaction from={[{ n: 4, name: "Malate" }]} to={{ n: 4, name: "OAA" }} enzyme="Malate dehydrogenase" at={cue(0.63)} />}
      {stage === 3 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 740, display: "flex", justifyContent: "center", ...fadeUp(done) }}>
          <Pill text="Cycle complete!" color={M.active} size={44} style={{ background: "rgba(20,30,24,0.9)" }} />
        </div>
      )}
      <Sfx at={cue(0.9)} src="sfx/chime.wav" volume={0.4} />
    </StepFrame>
  );
};

export const Score: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const doubled = frame >= cue(0.74);
  const items: { kind: Kind; n: number; at: number }[] = [
    { kind: "CO2", n: 2, at: 0.08 },
    { kind: "NADH", n: 3, at: 0.18 },
    { kind: "FADH2", n: 1, at: 0.3 },
    { kind: "ATP", n: 1, at: 0.4 },
  ];
  const stamp = usePop(cue(0.68));
  return (
    <AbsoluteFill>
      <MicroBg />
      <Title title="Scorecard" sub={doubled ? "Per glucose (2 turns)" : "One turn of the cycle"} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 480, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        {items.map((it) => {
          const p = usePop(cue(it.at));
          const bump = doubled ? interpolate(frame - cue(0.74), [0, 5, 12], [1, 1.2, 1], clamp) : 1;
          return (
            <div key={it.kind} style={fadeUp(p)}>
              <Glass style={{ height: 330, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
                <Token kind={it.kind} size={44} />
                <Text size={130} style={{ transform: `scale(${bump})` }}>
                  {doubled ? it.n * 2 : it.n}
                </Text>
              </Glass>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1260,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(stamp, [0, 0.2], [0, 1], clamp),
          transform: `rotate(-4deg) scale(${1.6 - 0.6 * stamp})`,
        }}
      >
        <Pill text="× 2 per glucose" color={M.atp} size={64} style={{ background: "rgba(20,30,24,0.9)" }} />
      </div>
      {items.map((it) => (
        <Sfx key={it.kind} at={cue(it.at)} />
      ))}
      <Sfx at={cue(0.68)} src="onion/thud.wav" volume={0.45} />
    </AbsoluteFill>
  );
};

const Eq: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = M.white }) => (
  <Text size={44} color={color} style={{ textAlign: "center", lineHeight: 1.3 }}>
    {children}
  </Text>
);

export const Tip: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const hi = frame >= cue(0.3);
  const ets = usePop(cue(0.62));
  return (
    <AbsoluteFill>
      <MicroBg />
      <Title title="NEET Tip" sub="NCERT summary equation" />
      <div style={{ position: "absolute", left: 40, right: 40, top: 420, ...fadeUp(usePop(cue(0.04))) }}>
        <Glass style={{ padding: "34px 26px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <Eq>
            Pyruvic acid + 4NAD⁺ + FAD⁺
            <br />+ 2H₂O + ADP + Pi
          </Eq>
          <Text size={30} color={M.dim}>
            ↓ mitochondrial matrix
          </Text>
          <Eq color={hi ? M.active : M.white}>
            3CO₂ + 4NADH + 4H⁺
            <br />+ FADH₂ + ATP
          </Eq>
          <div style={{ marginTop: 10, ...fadeUp(usePop(cue(0.18))) }}>
            <Pill text="Includes the link reaction → 3 CO₂, 4 NADH" color={M.atp} size={28} />
          </div>
        </Glass>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 1180, ...fadeUp(ets) }}>
        <Glass style={{ padding: "26px 20px", display: "flex", alignItems: "center", justifyContent: "space-around" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
            <Token kind="NADH" size={34} />
            <Token kind="FADH2" size={34} />
          </div>
          <Text size={60}>→</Text>
          <Pill text="ETS" color={M.active} size={48} />
          <Text size={60}>→</Text>
          <div style={{ display: "flex", flexWrap: "wrap", width: 220, gap: 8, justifyContent: "center" }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ transform: `scale(${interpolate(frame, [cue(0.75) + i * 4, cue(0.75) + i * 4 + 8], [0, 1], clamp)})` }}>
                <Token kind="ATP" size={22} />
              </div>
            ))}
          </div>
        </Glass>
      </div>
      <Sfx at={cue(0.18)} />
      <Sfx at={cue(0.62)} src="sfx/whoosh.wav" volume={0.3} />
      <Sfx at={cue(0.75)} src="onion/sparkle.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const Cta: React.FC = () => {
  const cue = useCue();
  const frame = useCurrentFrame();
  const lit = NODES.map((_, i) => i).filter((i) => frame >= cue(0.04 + i * 0.075));
  const save = usePop(cue(0.7));
  return (
    <AbsoluteFill>
      <MicroBg />
      <Title title="Recap" sub="8 molecules, in order" />
      <Wheel cx={540} cy={880} r={300} lit={lit} active={lit.slice(0, -1)} delay={2} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center", ...fadeUp(save) }}>
        <Pill text="🔖  Save for NEET" color={M.atp} size={56} style={{ background: "rgba(20,30,24,0.9)" }} />
      </div>
      {NODES.map((_, i) => (
        <Sfx key={i} at={cue(0.04 + i * 0.075)} src="onion/tick.wav" volume={0.35} />
      ))}
      <Sfx at={cue(0.7)} src="sfx/chime.wav" volume={0.4} />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  where: Where,
  link: Link,
  entry: Entry,
  first: First,
  second: Second,
  energy: Energy,
  regen: Regen,
  score: Score,
  tip: Tip,
  cta: Cta,
};
