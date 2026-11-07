import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { Card, Checklist, clamp, FONT, K, Sfx, Stage, Stamp, TileText, useAt } from "../reel/kit";
import { Drop, Glass, Vapour } from "./art";
import { SCRIPT } from "./script";

const beat = (id: string) => {
  const b = SCRIPT.find((s) => s.id === id);
  if (!b) throw new Error(id);
  return { id, title: b.title, step: b.step };
};

const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = K.ink, size = 44 }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, paddingTop: 8 }}>{children}</div>
);

// 0. Hook — drops appear on a cold glass. Leaking?
const Hook: React.FC = () => {
  const b = beat("hook");
  const at = useAt(b.id);
  const frame = useCurrentFrame();
  const bunde = at("बूँदें");
  const leak = at("लीक");
  const nahi = at("नहीं");
  const drops = interpolate(frame, [bunde - 6, bunde + 24], [0, 1], clamp);
  return (
    <Stage
      {...b}
      point
      enterTeacher
      front={
        <>
          <Stamp at={leak} text="लीक?" x={600} y={640} rotate={6} color={K.teal} />
          <Stamp at={nahi} text="नहीं!" x={640} y={800} rotate={-6} size={96} />
        </>
      }
    >
      <Card at={4} x={60} y={590} w={500} h={640} rotate={-2}>
        <Glass size={330} drops={drops} seed="hook" />
      </Card>
      <Sfx at={bunde} src="onion/sparkle.wav" volume={0.35} />
      <Sfx at={leak} />
      <Sfx at={nahi} src="onion/thud.wav" volume={0.45} />
    </Stage>
  );
};

// 1. Step 1 — colour the water: the outside drops stay clear.
const Leak: React.FC = () => {
  const b = beat("leak");
  const at = useAt(b.id);
  const frame = useCurrentFrame();
  const rang = at("रंग");
  const saaf = at("साफ़");
  const andar = at("अंदर");
  const tint = interpolate(frame, [rang, rang + 20], [0, 1], clamp);
  const red = `rgb(${Math.round(159 + (214 - 159) * tint)}, ${Math.round(211 + (60 - 211) * tint)}, ${Math.round(234 + (70 - 234) * tint)})`;
  return (
    <Stage
      {...b}
      front={
        <Checklist
          at={rang - 4}
          items={[
            { label: "अंदर लाल पानी", at: rang + 10 },
            { label: "बाहर बूँदें साफ़", at: saaf },
            { label: "लीक", at: andar, ok: false },
          ]}
        />
      }
    >
      <Card at={4} x={60} y={590} w={960} h={480}>
        <div style={{ display: "flex", gap: 120, alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Glass size={250} drops={1} seed="a" />
            <Label size={40}>सादा पानी</Label>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Glass size={250} drops={1} water={red} seed="b" />
            <Label size={40} color={tint > 0.5 ? K.red : K.ink}>रंगीन पानी</Label>
          </div>
        </div>
      </Card>
      <Sfx at={rang} src="onion/sparkle.wav" volume={0.3} />
      <Sfx at={saaf} src="onion/tick.wav" />
      <Sfx at={andar} src="onion/tick.wav" />
    </Stage>
  );
};

// 2. Step 2 — air always carries invisible vapour; warm air holds more.
const Air: React.FC = () => {
  const b = beat("air");
  const at = useAt(b.id);
  const frame = useCurrentFrame();
  const bhap = at("भाप");
  const zyada = at("ज़्यादा");
  const kam = at("कम");
  const reveal = interpolate(frame, [bhap, bhap + 20], [0, 1], clamp);
  return (
    <Stage {...b} point>
      <Card at={4} x={60} y={590} w={960} h={300} bg={K.board} style={{ border: `14px solid ${K.boardEdge}`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: reveal }}>
          <Vapour w={932} h={272} n={36} seed="air" />
        </div>
        <div style={{ position: "relative" }}>
          <Label color="#E8E4D8" size={60}>हवा में छुपी भाप</Label>
        </div>
      </Card>
      <Card at={zyada} x={60} y={930} w={440} h={300} bg="#F3A54A" style={{ overflow: "hidden" }}>
        <Vapour w={440} h={300} n={34} seed="warm" speed={1.6} />
        <div style={{ position: "relative" }}>
          <TileText big="गर्म हवा" small="ज़्यादा भाप" />
        </div>
      </Card>
      <Card at={kam} x={60} y={1260} w={440} h={300} bg="#8EC5E8" style={{ overflow: "hidden" }}>
        <Vapour w={440} h={300} n={8} seed="cold" speed={0.5} />
        <div style={{ position: "relative" }}>
          <TileText big="ठंडी हवा" small="कम भाप" />
        </div>
      </Card>
      <Sfx at={bhap} src="onion/sparkle.wav" volume={0.3} />
      <Sfx at={zyada} />
      <Sfx at={kam} />
    </Stage>
  );
};

/** Vapour dots drifting in from both sides and vanishing at the glass. */
const Converge: React.FC<{ w: number; h: number; on: number }> = ({ w, h, on }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 18 }, (_, i) => {
        const side = i % 2 ? 1 : -1;
        const p = ((frame * 0.9 + random(`c${i}`) * 90) % 90) / 90;
        const x = w / 2 + side * (360 - p * 250);
        const y = 60 + random(`cy${i}`) * (h - 120);
        return <circle key={i} cx={x} cy={y} r={9} fill={K.tealLight} opacity={on * (p < 0.85 ? 0.8 : (1 - p) * 5)} />;
      })}
    </svg>
  );
};

// 3. Step 3 — air touching the glass cools; extra vapour becomes drops.
const Touch: React.FC = () => {
  const b = beat("touch");
  const at = useAt(b.id);
  const frame = useCurrentFrame();
  const thandi = at("ठंडी");
  const bunde = at("बूँदें");
  const drops = interpolate(frame, [thandi, bunde + 10], [0, 1], clamp);
  return (
    <Stage
      {...b}
      front={
        <Checklist
          at={thandi - 6}
          items={[
            { label: "हवा ठंडी", at: thandi },
            { label: "भाप ज़्यादा हो गई", at: at("पकड़") },
            { label: "भाप → बूँदें", at: bunde },
          ]}
        />
      }
    >
      <Card at={4} x={60} y={590} w={960} h={560} style={{ overflow: "hidden" }}>
        <Converge w={960} h={560} on={interpolate(frame, [8, 20], [0, 1], clamp)} />
        <Glass size={300} drops={drops} seed="touch" />
        <div style={{ position: "absolute", left: 40, top: 30 }}>
          <Label size={40} color={K.teal}>भाप →</Label>
        </div>
        <div style={{ position: "absolute", right: 40, top: 30 }}>
          <Label size={40} color={K.teal}>← भाप</Label>
        </div>
      </Card>
      <Sfx at={thandi} src="onion/tick.wav" />
      <Sfx at={bunde} src="onion/sparkle.wav" volume={0.35} />
    </Stage>
  );
};

// 4. Step 4 — same physics: AC drip, morning dew, humid Mumbai.
const Trick: React.FC = () => {
  const b = beat("trick");
  const at = useAt(b.id);
  const frame = useCurrentFrame();
  const ac = at("AC");
  const os = at("ओस");
  const mumbai = at("Mumbai");
  const drip = (from: number) => ((Math.max(0, frame - from) * 3) % 90) - 10;
  const tiles = [
    { at: ac, big: "AC पाइप", small: "टप-टप पानी", bg: K.teal, color: K.white },
    { at: os, big: "सुबह की ओस", small: "घास पर बूँदें", bg: K.mustard, color: K.ink },
    { at: mumbai, big: "Mumbai उमस", small: "और ज़्यादा बूँदें", bg: K.red, color: K.white },
  ];
  return (
    <Stage {...b} point>
      {tiles.map((t, i) => (
        <Card key={t.big} at={t.at} x={60} y={590 + i * 290} w={500} h={250} bg={t.bg} color={t.color} rotate={i % 2 ? 1.5 : -1.5} style={{ overflow: "hidden" }}>
          <svg width={80} height={100} style={{ position: "absolute", right: 24, top: 0 }}>
            <Drop x={40} y={drip(t.at)} r={16} />
          </svg>
          <TileText big={t.big} small={t.small} size={60} />
        </Card>
      ))}
      <Sfx at={ac} src="onion/tick.wav" />
      <Sfx at={os} src="onion/tick.wav" />
      <Sfx at={mumbai} src="onion/thud.wav" volume={0.4} />
    </Stage>
  );
};

// 5. CTA — "air's water", follow.
const Cta: React.FC = () => {
  const b = beat("cta");
  const at = useAt(b.id);
  const hawa = at("हवा");
  const follow = at("Follow");
  return (
    <Stage {...b} point front={<Stamp at={hawa} text="हवा का पानी!" x={60} y={1120} rotate={-4} color={K.teal} />}>
      <Card at={4} x={60} y={590} w={500} h={500} bg={K.teal}>
        <Glass size={260} drops={1} seed="cta" />
      </Card>
      <Card at={follow} x={60} y={1330} w={560} h={130} bg={K.ink} color={K.white} style={{ borderRadius: 999 }}>
        <Label size={52} color={K.white}>FOLLOW @mythmitao</Label>
      </Card>
      <Sfx at={hawa} src="onion/sparkle.wav" volume={0.35} />
      <Sfx at={follow} />
    </Stage>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  leak: Leak,
  air: Air,
  touch: Touch,
  trick: Trick,
  cta: Cta,
};
