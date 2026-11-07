import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Cooker, Flame, Gauge, Pot, Thermometer } from "./art";
import { Card, Checklist, clamp, FONT, K, Sfx, Stage, Stamp, TileText, useAt, usePop } from "./kit";
import { SCRIPT } from "./script";

const beat = (id: string) => {
  const b = SCRIPT.find((s) => s.id === id);
  if (!b) throw new Error(id);
  return { id, title: b.title, step: b.step };
};

const Label: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = K.ink, size = 44 }) => (
  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size, color, lineHeight: 1, paddingTop: 8 }}>{children}</div>
);

// 1. Hook — 60 min in a pot vs 15 min in a cooker.
const Hook: React.FC = () => {
  const b = beat("hook");
  const at = useAt(b.id);
  const ghanta = at("घंटा");
  const pandrah = at("पंद्रह");
  const jadu = at("जादू");
  const frame = useCurrentFrame();
  const potClock = interpolate(frame, [ghanta, ghanta + 60], [0, 60], clamp);
  const cookerClock = interpolate(frame, [pandrah, pandrah + 30], [0, 15], clamp);
  return (
    <Stage {...b} point enterTeacher front={<Stamp at={jadu} text="क्या जादू है?" y={1330} />}>
      <Card at={ghanta} x={60} y={590} w={450} h={470} rotate={-2}>
        <Pot size={320} boil={0.6} />
        <Label size={42}>पतीला</Label>
        <Label size={88} color={K.red}>{Math.round(potClock)} MIN</Label>
      </Card>
      <Card at={pandrah} x={570} y={590} w={450} h={470} bg={K.teal} color={K.white} rotate={2}>
        <Cooker size={300} />
        <Label size={42} color={K.white}>Pressure cooker</Label>
        <Label size={88} color={K.mustard}>{Math.round(cookerClock)} MIN</Label>
      </Card>
      <Sfx at={ghanta} />
      <Sfx at={pandrah} />
      <Sfx at={jadu} src="onion/thud.wav" volume={0.4} />
    </Stage>
  );
};

// 2. Step 1 — open pot: water stalls at 100 °C, extra heat makes steam.
const Limit: React.FC = () => {
  const b = beat("limit");
  const at = useAt(b.id);
  const frame = useCurrentFrame();
  const sau = at("सौ");
  const tez = at("तेज़");
  const upar = at("ऊपर");
  const bhap = at("भाप");
  const temp = interpolate(frame, [8, sau], [25, 100], clamp) + (frame > sau ? Math.sin(frame / 2) * 0.6 : 0);
  const flame = interpolate(frame, [tez, tez + 12], [0.3, 1], clamp);
  const boil = interpolate(frame, [sau - 10, sau + 10], [0, 1], clamp);
  const chip = usePop(sau);
  return (
    <Stage
      {...b}
      front={
        <Checklist
          at={tez - 6}
          items={[
            { label: "तेज़ आँच", at: tez },
            { label: "100° से ऊपर", at: upar, ok: false },
            { label: "बस ज़्यादा भाप", at: bhap },
          ]}
        />
      }
    >
      <Card at={4} x={60} y={590} w={960} h={520}>
        <div style={{ position: "absolute", left: 60, top: 30 }}>
          <Thermometer height={450} temp={temp} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 210,
            top: 110,
            padding: "10px 22px 4px",
            borderRadius: 14,
            background: K.red,
            color: K.white,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 56,
            transform: `scale(${chip})`,
          }}
        >
          {Math.min(100, Math.round(temp))}°C
        </div>
        <div style={{ position: "absolute", left: 430, top: 150, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Pot size={460} boil={boil * (0.4 + 0.6 * flame)} />
          <div style={{ marginTop: -10 }}>
            <Flame width={460} level={flame} />
          </div>
        </div>
      </Card>
      <Sfx at={sau} src="onion/tick.wav" />
      <Sfx at={tez} src="onion/tick.wav" />
      <Sfx at={upar} src="onion/tick.wav" />
      <Sfx at={bhap} src="onion/tick.wav" />
    </Stage>
  );
};

/** Steam molecules bouncing inside a sealed box; `n` and `speed` grow. */
const Molecules: React.FC<{ w: number; h: number; n: number; speed: number }> = ({ w, h, n, speed }) => {
  const frame = useCurrentFrame();
  const bounce = (p: number, len: number) => {
    const m = ((p % (2 * len)) + 2 * len) % (2 * len);
    return m < len ? m : 2 * len - m;
  };
  return (
    <svg width={w} height={h}>
      {Array.from({ length: n }, (_, i) => {
        const vx = 3 + ((i * 37) % 7);
        const vy = 2 + ((i * 53) % 6);
        const x = 14 + bounce(i * 97 + frame * vx * speed, w - 28);
        const y = 14 + bounce(i * 61 + frame * vy * speed, h - 28);
        return <circle key={i} cx={x} cy={y} r={11} fill="white" opacity={0.9} />;
      })}
    </svg>
  );
};

// 3. Step 2 — the sealed lid doubles the pressure: boiling point ~120 °C.
const Lid: React.FC = () => {
  const b = beat("lid");
  const at = useAt(b.id);
  const frame = useCurrentFrame();
  const bahar = at("बाहर");
  const badhta = at("बढ़ता");
  const dugna = at("दुगना");
  const ek = at("एक");
  const g = interpolate(frame, [badhta, dugna + 10], [0.15, 0.8], clamp);
  const n = Math.round(interpolate(frame, [bahar, dugna], [8, 26], clamp));
  return (
    <Stage {...b} point>
      <Card at={4} x={60} y={590} w={960} h={440} bg={K.board} style={{ border: `14px solid ${K.boardEdge}` }}>
        <div style={{ position: "absolute", left: 50, top: 40, width: 500, height: 330, borderRadius: 30, border: "8px solid #E8E4D8", overflow: "hidden" }}>
          <Molecules w={484} h={314} n={n} speed={interpolate(g, [0.15, 0.8], [0.6, 1.4])} />
        </div>
        <div style={{ position: "absolute", left: 40, top: 14, width: 520, height: 40, borderRadius: 12, background: "#E8E4D8" }} />
        <div style={{ position: "absolute", right: 60, top: 30, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Gauge size={280} value={g} lo="1 atm" hi="2 atm" />
          <div style={{ marginTop: 26 }}>
            <Label color="#E8E4D8" size={40}>PRESSURE</Label>
          </div>
        </div>
      </Card>
      <Card at={badhta} x={60} y={1070} w={440} h={190} bg={K.white}>
        <TileText big="1 atm → 100°" small="खुला बर्तन" size={58} />
      </Card>
      <Card at={ek} x={60} y={1290} w={440} h={190} bg={K.red} color={K.white}>
        <TileText big="2 atm → 120°" small="pressure cooker" size={58} />
      </Card>
      <Sfx at={badhta} />
      <Sfx at={ek} />
    </Stage>
  );
};

// 4. Step 3 — +10 °C roughly doubles the cooking rate: ~4x at 120 °C.
const Speed: React.FC = () => {
  const b = beat("speed");
  const at = useAt(b.id);
  const frame = useCurrentFrame();
  const chem = at("chemical");
  const das = at("दस");
  const char = at("चार");
  const grow = (from: number) => interpolate(frame, [from, from + 14], [0, 1], { ...clamp });
  const bars = [
    { t: "100°", x: "1X", v: 0.25, from: das - 6, c: K.muted },
    { t: "110°", x: "2X", v: 0.5, from: das + 8, c: K.mustard },
    { t: "120°", x: "4X", v: 1, from: char, c: K.red },
  ];
  return (
    <Stage {...b} front={<Stamp at={char + 4} text="4X FAST!" x={600} y={880} rotate={5} size={84} />}>
      <Card at={chem} x={60} y={590} w={450} h={230} bg={K.ink} color={K.white}>
        <TileText big="Chemical" small="reaction" />
      </Card>
      <Card at={das} x={570} y={590} w={450} h={230} bg={K.teal} color={K.white}>
        <TileText big="+10° = 2X" small="हर दस degree पर" />
      </Card>
      <Card at={das - 6} x={60} y={860} w={500} h={600} style={{ justifyContent: "flex-end", padding: "0 30px 30px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 34, height: 440 }}>
          {bars.map((bar) => (
            <div key={bar.t} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 112 }}>
              <Label size={48} color={bar.c === K.muted ? K.ink : bar.c}>{grow(bar.from) > 0.5 ? bar.x : ""}</Label>
              <div style={{ width: 112, height: 360 * bar.v * grow(bar.from), background: bar.c, borderRadius: "14px 14px 0 0", border: `5px solid ${K.ink}`, borderBottom: "none" }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 34, borderTop: `6px solid ${K.ink}`, paddingTop: 6 }}>
          {bars.map((bar) => (
            <div key={bar.t} style={{ width: 112, textAlign: "center" }}>
              <Label size={40}>{bar.t}</Label>
            </div>
          ))}
        </div>
      </Card>
      <Sfx at={chem} />
      <Sfx at={das} />
      <Sfx at={char} src="onion/thud.wav" volume={0.45} />
    </Stage>
  );
};

/** Curved "sound" arcs either side of the whistle. */
const Waves: React.FC<{ on: number }> = ({ on }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={600} height={200} viewBox="0 0 600 200" style={{ position: "absolute", left: 180, top: 0, overflow: "visible" }}>
      {[0, 1, 2].map((i) => {
        const p = ((frame + i * 8) % 24) / 24;
        const r = 40 + p * 80;
        return (
          <g key={i} fill="none" stroke={K.red} strokeWidth={8} strokeLinecap="round" opacity={on * (1 - p)}>
            <path d={`M${300 - r} ${100 - r * 0.6} A ${r} ${r} 0 0 0 ${300 - r} ${100 + r * 0.6}`} />
            <path d={`M${300 + r} ${100 - r * 0.6} A ${r} ${r} 0 0 1 ${300 + r} ${100 + r * 0.6}`} />
          </g>
        );
      })}
    </svg>
  );
};

// 5. Step 4 — the whistle is the weight valve lifting.
const Whistle: React.FC = () => {
  const b = beat("whistle");
  const at = useAt(b.id);
  const frame = useCurrentFrame();
  const press = at("Pressure");
  const utha = at("उठा");
  const bajti = at("बजती");
  const bahar = at("बाहर");
  const lift = interpolate(frame, [utha, utha + 8], [0, 1], clamp);
  const steam = interpolate(frame, [utha, utha + 10], [0, 1], clamp);
  const waves = interpolate(frame, [bajti - 4, bajti + 4], [0, 1], clamp);
  return (
    <Stage
      {...b}
      point
      front={
        <>
          <Checklist
            at={press - 6}
            items={[
              { label: "Pressure ज़्यादा", at: press },
              { label: "वज़न उठा", at: utha },
              { label: "Extra भाप बाहर", at: bahar },
            ]}
          />
          <Stamp at={bajti} text="सीटी!" x={680} y={620} rotate={8} size={90} />
        </>
      }
    >
      <Card at={4} x={60} y={590} w={960} h={480}>
        <div style={{ position: "absolute", left: 120, top: 120 }}>
          <Waves on={waves} />
        </div>
        <div style={{ marginTop: 90 }}>
          <Cooker size={480} lift={lift} steam={steam} />
        </div>
        <Label size={34} color={K.muted}>safety valve = वज़न</Label>
      </Card>
      <Sfx at={press} src="onion/tick.wav" />
      <Sfx at={utha} src="onion/tick.wav" />
      <Sfx at={bajti} src="onion/sparkle.wav" volume={0.4} />
      <Sfx at={bahar} src="onion/tick.wav" />
    </Stage>
  );
};

// 6. Step 5 — less air pressure up the mountains: water boils cooler.
const Mountain: React.FC = () => {
  const b = beat("mountain");
  const at = useAt(b.id);
  const frame = useCurrentFrame();
  const kam = at("कम");
  const shimla = at("शिमला");
  const leh = at("लेह");
  const galti = at("गलती");
  const stops = [
    { name: "दिल्ली", t: "100°", x: 90, y: 400, at: 8 },
    { name: "शिमला", t: "93°", x: 300, y: 270, at: shimla },
    { name: "लेह", t: "88°", x: 470, y: 130, at: leh },
  ];
  const reached = stops.filter((s) => frame >= s.at).length - 1;
  const prev = stops[Math.max(0, reached - 1)];
  const cur = stops[Math.max(0, reached)];
  const k = interpolate(frame, [cur.at, cur.at + 14], [0, 1], clamp);
  const pinX = prev.x + (cur.x - prev.x) * k;
  const pinY = prev.y + (cur.y - prev.y) * k;
  return (
    <Stage {...b} front={<Stamp at={galti} text="दाल कच्ची!" y={1330} rotate={-5} />}>
      <Card at={4} x={60} y={590} w={960} h={480} style={{ overflow: "hidden" }}>
        <svg width={960} height={480} style={{ position: "absolute", inset: 0 }}>
          <path d="M-20 480 L 260 220 L 360 300 L 560 80 L 760 320 L 860 250 L 980 480 Z" fill="#CFE0DC" stroke={K.ink} strokeWidth={6} strokeLinejoin="round" />
          <path d="M520 124 L 560 80 L 600 124 L 580 116 L 560 130 L 540 116 Z" fill="white" stroke={K.ink} strokeWidth={5} strokeLinejoin="round" />
          {stops.map((s) => {
            const on = interpolate(frame, [s.at, s.at + 8], [0, 1], clamp);
            return (
              <g key={s.name} opacity={on} transform={`translate(${s.x} ${s.y})`}>
                <circle r={14} fill={K.ink} />
                <rect x={26} y={-40} width={220} height={80} rx={16} fill={s.name === "लेह" ? K.red : K.white} stroke={K.ink} strokeWidth={5} />
                <text x={136} y={14} fontFamily={FONT} fontWeight={800} fontSize={42} textAnchor="middle" fill={s.name === "लेह" ? "white" : K.ink}>
                  {s.name} {s.t}
                </text>
              </g>
            );
          })}
          <circle cx={pinX} cy={pinY - 2} r={22} fill={K.mustard} stroke={K.ink} strokeWidth={6} />
        </svg>
      </Card>
      <Card at={kam} x={60} y={1100} w={460} h={190} bg={K.mustard}>
        <TileText big="हवा का pressure ↓" small="पानी जल्दी उबले" size={52} />
      </Card>
      <Sfx at={kam} />
      <Sfx at={shimla} src="onion/tick.wav" />
      <Sfx at={leh} src="onion/tick.wav" />
      <Sfx at={galti} src="onion/thud.wav" volume={0.4} />
    </Stage>
  );
};

// 7. CTA — physics whistle, poll, follow.
const Cta: React.FC = () => {
  const b = beat("cta");
  const at = useAt(b.id);
  const frame = useCurrentFrame();
  const physics = at("physics");
  const kitni = at("कितनी");
  const comment = at("Comment");
  const follow = at("follow");
  const out = interpolate(frame, [kitni - 8, kitni], [1, 0], clamp);
  const pick = Math.floor(Math.max(0, frame - kitni) / 12) % 3;
  const tap = usePop(follow + 6, { damping: 8, stiffness: 260, mass: 0.5 });
  return (
    <Stage {...b} point>
      {out > 0 && (
        <div style={{ opacity: out }}>
          <Card at={4} x={60} y={590} w={960} h={470} bg={K.teal} color={K.white}>
            <Cooker size={300} lift={1} steam={1} />
            <Label size={64} color={K.white}>ये physics की सीटी है!</Label>
          </Card>
          <Stamp at={physics} text="PHYSICS!" x={640} y={600} rotate={7} />
        </div>
      )}
      {["2", "3", "4+"].map((n, i) => (
        <Card key={n} at={kitni + i * 4} x={60 + i * 335} y={590} w={290} h={250} bg={pick === i ? K.ink : K.white} color={pick === i ? K.white : K.ink}>
          <TileText big={n} small="सीटी" size={110} />
        </Card>
      ))}
      <Card at={comment} x={60} y={880} w={600} h={120} bg={K.red} color={K.white} style={{ borderRadius: 999 }}>
        <Label size={52} color={K.white}>● Comment में बताइए</Label>
      </Card>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "360px 1115px", transform: `scale(${1 - 0.06 * Math.sin(Math.PI * tap)})` }}>
        <Card at={follow} x={60} y={1050} w={600} h={130} bg={K.ink} color={K.white} style={{ borderRadius: 999 }}>
          <Label size={54} color={K.white}>FOLLOW @mythmitao</Label>
        </Card>
      </div>
      <Sfx at={physics} src="onion/thud.wav" volume={0.4} />
      <Sfx at={kitni} />
      <Sfx at={comment} />
      <Sfx at={follow} />
    </Stage>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  limit: Limit,
  lid: Lid,
  speed: Speed,
  whistle: Whistle,
  mountain: Mountain,
  cta: Cta,
};
