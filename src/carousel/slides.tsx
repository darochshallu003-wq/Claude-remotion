import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  Caption,
  Card,
  Caret,
  clamp,
  Connector,
  MonoLabel,
  Pointer,
  ReelPlayer,
  rise,
  Sfx,
  Slide,
  Spark,
  Title,
  useIn,
  useRamp,
  useTyped,
} from "./kit";
import { DAHI_AT, DISPLAY, HANDLE, K, MONO, SERIF, UI } from "./theme";

const thumb = (name: string) => staticFile(`carousel/thumbs/${name}.jpg`);
const TICK = "onion/tick.wav";
const POP = "sfx/pop.wav";
const CHIME = "sfx/chime.wav";

/** Plays a soft tick every few characters while text is being typed. */
const TypingTicks: React.FC<{ at: number; doneAt: number; every?: number }> = ({ at, doneAt, every = 5 }) => (
  <>
    {Array.from({ length: Math.max(0, Math.floor((doneAt - at) / every)) }).map((_, i) => (
      <Sfx key={i} at={at + i * every} src={TICK} volume={0.12} />
    ))}
  </>
);

const Check: React.FC<{ p: number; size?: number }> = ({ p, size = 30 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: p > 0.5 ? K.green : "transparent",
      border: p > 0.5 ? "none" : `3px solid ${K.hair}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `scale(${0.7 + 0.3 * p})`,
      flexShrink: 0,
    }}
  >
    {p > 0.5 && (
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 20 20">
        <path d="M3 10.5 L8 15 L17 5" stroke="#fff" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </div>
);

// ===========================================================================
// 01 · Hook

const PROMPT = "Make a full explainer reel in code: Why won't dahi set in winter?";

export const S1Hook: React.FC = () => {
  const card = useIn(14);
  const typed = useTyped(PROMPT, 22, 34);
  const send = interpolate(useCurrentFrame(), [typed.doneAt + 2, typed.doneAt + 6, typed.doneAt + 12], [1, 0.8, 1], clamp);
  const go = typed.doneAt + 10;
  return (
    <Slide index={1} footer="1 TOPIC · 1 PROMPT · 1 REEL">
      <Title top="GIVE CLAUDE ONE TOPIC." bottom="GET A FINISHED REEL." size={66} />
      <Card style={{ left: 70, right: 70, top: 300, height: 150, padding: "22px 30px", ...rise(card) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Spark size={20} />
          <MonoLabel>Claude · new chat</MonoLabel>
        </div>
        <div style={{ marginTop: 14, marginRight: 70, fontSize: 31, fontWeight: 600, lineHeight: 1.3 }}>
          {typed.shown}
          {!typed.done && <Caret h={1.05} />}
        </div>
        <div
          style={{
            position: "absolute",
            right: 26,
            bottom: 26,
            width: 52,
            height: 52,
            borderRadius: 12,
            background: K.coral,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${send})`,
          }}
        >
          <svg width={24} height={24} viewBox="0 0 24 24">
            <path d="M12 20 V5 M5 11 L12 4 L19 11" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </Card>
      <Connector y={462} h={52} at={go} />
      <ReelPlayer x={115} y={620} w={250} from={DAHI_AT.cold} at={go + 14} rotate={-6} bar={false} dim={0.12} />
      <ReelPlayer x={715} y={620} w={250} from={DAHI_AT.twist} at={go + 18} rotate={6} bar={false} dim={0.12} />
      <ReelPlayer x={372} y={528} w={336} from={DAHI_AT.hook} at={go + 6} border={K.coral} />
      <TypingTicks at={22} doneAt={typed.doneAt} />
      <Sfx at={typed.doneAt + 4} src={POP} volume={0.5} />
      <Sfx at={go + 6} src="sfx/whoosh.wav" volume={0.35} />
    </Slide>
  );
};

// ===========================================================================
// 02 · The problem

const GRID: { img: string; label: string }[] = [
  { img: "onion_eyes", label: "Why onions make you cry" },
  { img: "haldi_latte", label: "Haldi needs kaali mirch" },
  { img: "tamra_hook", label: "Is copper water real?" },
  { img: "mitti_name", label: "Why rain smells good" },
  { img: "dahi_cold", label: "Dahi vs. winter" },
  { img: "onion_ignobel", label: "The Ig Nobel onion" },
];

export const S2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Slide index={2} footer="SCRIPT · ANIMATE · VOICE · EDIT" showClaude={false}>
      <Title top="SCIENCE REELS LIKE THESE" bottom="USUALLY TAKE DAYS." size={62} />
      {GRID.map((g, i) => {
        const at = 18 + i * 7;
        const p = useIn(at, 14);
        const col = i % 3;
        const row = Math.floor(i / 3);
        const zoom = 1 + Math.max(0, frame - at) * 0.0006;
        return (
          <React.Fragment key={g.img}>
            <Card style={{ left: 72 + col * 322, top: 300 + row * 420, width: 292, height: 396, overflow: "hidden", ...rise(p, 40) }}>
              <div style={{ height: 320, overflow: "hidden", borderBottom: `2px solid ${K.hair}` }}>
                <Img
                  src={thumb(g.img)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 0%", transform: `scale(${zoom})`, transformOrigin: "50% 0%" }}
                />
              </div>
              <div style={{ padding: "16px 18px", fontSize: 23, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g.label}</div>
            </Card>
            <Sfx at={at} src={TICK} volume={0.2} />
          </React.Fragment>
        );
      })}
      <Caption a="Script, draw, voice, edit." b="Every single reel." at={70} y={1150} />
    </Slide>
  );
};

// ===========================================================================
// 03 · Step 1: one topic

const CHIPS = ["Dahi in winter", "Haldi + pepper", "Petrichor"];
const TOPIC = "WHY DAHI WON'T SET";

export const S3Topic: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useIn(12);
  const CLICK = 62;
  const typed = useTyped(TOPIC, CLICK + 6, 22);
  const brief = useIn(typed.doneAt + 8);
  return (
    <Slide index={3} footer="STEP 1 · ONE TOPIC · THAT'S THE BRIEF">
      <Title top="STEP 1." bottom="GIVE IT ONE TOPIC." size={78} bottomSize={70} />
      <Card style={{ left: 110, right: 110, top: 330, height: 210, padding: "26px 32px", ...rise(card) }}>
        <MonoLabel>Topic</MonoLabel>
        <div
          style={{
            marginTop: 16,
            height: 104,
            borderRadius: 14,
            border: `3px solid ${frame > CLICK ? K.coral : K.hair}`,
            boxShadow: frame > CLICK ? `0 0 0 6px ${K.coralSoft}` : "none",
            display: "flex",
            alignItems: "center",
            padding: "0 26px",
            fontFamily: DISPLAY,
            fontSize: 50,
          }}
        >
          {typed.shown}
          {frame > CLICK && !typed.done && <Caret h={0.95} />}
          {frame <= CLICK && <span style={{ color: K.hair, fontFamily: UI, fontWeight: 500, fontSize: 36 }}>Type any topic…</span>}
        </div>
      </Card>
      <Connector y={552} h={60} at={20} />
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
        {CHIPS.map((c, i) => {
          const p = useIn(24 + i * 6);
          const picked = i === 0 && frame >= CLICK;
          return (
            <div
              key={c}
              style={{
                padding: "18px 28px",
                borderRadius: 16,
                background: K.card,
                fontSize: 30,
                fontWeight: 700,
                border: `3px solid ${picked ? K.coral : "transparent"}`,
                boxShadow: "0 8px 20px rgba(70,50,30,0.10)",
                ...rise(p, 20),
              }}
            >
              {c}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, textAlign: "center", ...rise(useIn(44), 16) }}>
        <span style={{ display: "inline-block", padding: "12px 24px", borderRadius: 14, border: `2px dashed ${K.hair}`, fontSize: 28, fontWeight: 600, color: K.muted }}>
          + any topic
        </span>
      </div>
      <Card style={{ left: 250, right: 250, top: 880, height: 150, padding: "22px 30px", ...rise(brief, 20) }}>
        <MonoLabel color={K.coral}>Claude will make</MonoLabel>
        <div style={{ marginTop: 12, fontSize: 28, fontWeight: 600, lineHeight: 1.45 }}>10 beats · Hinglish voiceover · 1:24</div>
      </Card>
      <Pointer
        path={[
          [700, 1000, 30],
          [300, 690, CLICK - 4],
          [300, 690, CLICK + 30],
          [380, 1100, CLICK + 60],
        ]}
        clickAt={CLICK}
      />
      <Caption a="One line in." b="No script, no storyboard." at={typed.doneAt + 14} y={1150} />
      <Sfx at={CLICK} src={POP} volume={0.5} />
      <TypingTicks at={CLICK + 6} doneAt={typed.doneAt} every={4} />
      <Sfx at={typed.doneAt + 8} src={CHIME} volume={0.25} />
    </Slide>
  );
};

// ===========================================================================
// 04 · Step 2: research + script

const FACTS = ["Lactic-acid bacteria set the dahi", "They work best around 30–45 °C", "Cold doesn't kill them, it pauses them"];
const BEATS: [string, string][] = [
  ["dahi_hook", "Sardi mein doodh hi doodh"],
  ["dahi_jaman", "Bacteria banate hain"],
  ["dahi_acid", "Lactose → lactic acid"],
  ["dahi_net", "Casein ka jaal"],
  ["dahi_cold", "Thand = sust bacteria"],
  ["dahi_hot", "Bahut garam? Khatam!"],
  ["dahi_twist", "Plot twist: the fridge"],
];

export const S4Research: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useIn(12);
  const stripIn = useIn(62);
  const scroll = interpolate(frame, [70, 175], [0, -760], clamp);
  const CARD_W = 236;
  const GAP = 26;
  return (
    <Slide index={4} footer="STEP 2 · RESEARCH · SCRIPT · BEAT BY BEAT">
      <Title top="STEP 2." bottom="RESEARCH + SCRIPT." size={78} bottomSize={70} />
      <Card style={{ left: 170, right: 170, top: 320, height: 250, padding: "24px 32px", ...rise(card) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: K.green, opacity: Math.floor(frame / 10) % 2 ? 1 : 0.35 }} />
          <MonoLabel color={K.green}>Researching</MonoLabel>
        </div>
        {FACTS.map((f, i) => {
          const at = 24 + i * 12;
          const p = useIn(at);
          return (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, fontSize: 28, fontWeight: 600, opacity: 0.3 + 0.7 * p }}>
              <Check p={p} />
              {f}
              <Sfx at={at} src={TICK} volume={0.3} />
            </div>
          );
        })}
      </Card>
      <Connector y={582} h={58} at={56} />
      <div style={{ position: "absolute", top: 668, left: 0, right: 0, height: 450, overflow: "hidden", opacity: stripIn }}>
        {BEATS.map(([img, label], i) => {
          const x = 540 - CARD_W / 2 + i * (CARD_W + GAP) + scroll;
          const centre = 1 - Math.min(1, Math.abs(x + CARD_W / 2 - 540) / (CARD_W + GAP));
          return (
            <div
              key={img}
              style={{
                position: "absolute",
                left: x,
                top: 20,
                width: CARD_W,
                background: K.card,
                borderRadius: 18,
                overflow: "hidden",
                border: `4px solid ${centre > 0.5 ? K.coral : K.card}`,
                boxShadow: "0 14px 30px rgba(70,50,30,0.14)",
                transform: `scale(${0.9 + 0.1 * centre})`,
              }}
            >
              <Img src={thumb(img)} style={{ width: "100%", height: 300, objectFit: "cover", objectPosition: "50% 0%", display: "block" }} />
              <div style={{ padding: "12px 14px" }}>
                <MonoLabel size={16}>Beat {String(i + 1).padStart(2, "0")}</MonoLabel>
                <div style={{ fontSize: 19, fontWeight: 700, marginTop: 4, whiteSpace: "nowrap" }}>{label}</div>
              </div>
            </div>
          );
        })}
      </div>
      <Caption a="It researches, then writes" b="beat by beat." at={64} y={1150} />
    </Slide>
  );
};

// ===========================================================================
// 05 · Step 3: every scene in code

const CODE: [string, string][] = [
  ["// scene 05 · cold", K.muted],
  ["<KraftBg />", "#E9C46A"],
  ['<Headline punch="Thand =', "#F2EDE4"],
  ['  sust bacteria" />', "#F2EDE4"],
  ["<Thermometer temp={8} />", "#8FC1E3"],
  ["{bugs.map((b) => (", "#F2EDE4"],
  ["  <Lacto sleepy {...b} />", "#E9A391"],
  ["))}", "#F2EDE4"],
  ['<CountUp to={8} unit="°C" />', "#8FC1E3"],
];

export const S5Code: React.FC = () => {
  const frame = useCurrentFrame();
  const codeCard = useIn(14);
  const lines = Math.floor(interpolate(frame, [22, 80], [0, CODE.length], clamp));
  const legend = useIn(96);
  return (
    <Slide index={5} footer="STEP 3 · REACT · SVG · REMOTION">
      <Title top="STEP 3." bottom="EVERY SCENE IN CODE." size={78} bottomSize={68} />
      <div style={{ position: "absolute", top: 304, left: 0, right: 0, textAlign: "center", opacity: codeCard }}>
        <MonoLabel>Scene 05 · rendered from code</MonoLabel>
      </div>
      <Card style={{ left: 60, top: 352, width: 540, height: 660, background: K.term, padding: "26px 28px", ...rise(codeCard) }}>
        <div style={{ display: "flex", gap: 9, marginBottom: 22 }}>
          {["#E5675A", "#E9B949", "#5CB46B"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          ))}
          <span style={{ marginLeft: 12, fontFamily: MONO, fontSize: 17, color: K.muted }}>scenes.tsx</span>
        </div>
        {CODE.slice(0, lines).map(([t, c], i) => (
          <div key={i} style={{ fontFamily: MONO, fontSize: 24, lineHeight: 1.9, color: c, whiteSpace: "pre" }}>
            {t}
            {i === lines - 1 && lines < CODE.length && <Caret color={K.coral} h={0.9} />}
          </div>
        ))}
      </Card>
      <ReelPlayer x={636} y={352} w={380} from={DAHI_AT.cold} at={34} border={K.coral} aspect={1.74} />
      <div style={{ position: "absolute", top: 1046, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 46, ...rise(legend, 12) }}>
        {[
          ["■", "React"],
          ["—", "SVG art"],
          ["✕", "No After Effects"],
        ].map(([g, t]) => (
          <span key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: K.coral, fontSize: 22, fontWeight: 700 }}>{g}</span>
            <MonoLabel>{t}</MonoLabel>
          </span>
        ))}
      </div>
      <Caption a="Bacteria nap. Numbers count." b="All of it code." at={100} y={1150} />
      {Array.from({ length: CODE.length }).map((_, i) => (
        <Sfx key={i} at={22 + (i * 58) / CODE.length} src={TICK} volume={0.15} />
      ))}
    </Slide>
  );
};

// ===========================================================================
// 06 · Step 4: voice

const LINE = "Garmi mein raat bhar mein dahi jam jaata hai… par sardi mein?";

const Wave: React.FC<{ active: number; color: string }> = ({ active, color }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, height: 90 }}>
      {Array.from({ length: 24 }).map((_, i) => {
        const h = 10 + active * (Math.abs(Math.sin(i * 1.7 + frame / 3.2)) * 52 + Math.abs(Math.sin(i * 0.6 - frame / 5)) * 24);
        return <div key={i} style={{ width: 7, height: h, borderRadius: 4, background: color }} />;
      })}
    </div>
  );
};

export const S6Voice: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useIn(12);
  const SWITCH = 92;
  const sw = useRamp(SWITCH, SWITCH + 10);
  const typed = useTyped(LINE, 30, 22);
  const ai = frame >= SWITCH;
  return (
    <Slide index={6} footer="STEP 4 · NARRATION · YOUR CALL">
      <Title top="STEP 4." bottom="YOUR VOICE OR AI." size={78} bottomSize={70} />
      <Card style={{ left: 80, right: 80, top: 320, height: 620, ...rise(card) }}>
        <div style={{ position: "absolute", left: 470, top: 40, right: 40 }}>
          <MonoLabel color={K.coral}>{ai ? "AI narrator · Hindi" : "Recording · take 1"}</MonoLabel>
          <div style={{ marginTop: 22, fontFamily: SERIF, fontStyle: "italic", fontSize: 42, lineHeight: 1.18, minHeight: 200 }}>
            “{typed.shown}
            {!typed.done && <Caret h={0.9} />}
            {typed.done && "”"}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 40 }}>
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 38,
                background: ai ? K.ink : K.coral,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: ai ? "none" : `0 0 0 ${8 + Math.sin(frame / 4) * 5}px ${K.coralSoft}`,
              }}
            >
              {ai ? (
                <Spark size={38} color="#fff" spin={frame * 2} />
              ) : (
                <svg width={34} height={40} viewBox="0 0 24 28">
                  <rect x={7} y={1} width={10} height={16} rx={5} fill="#fff" />
                  <path d="M3 13 a9 9 0 0 0 18 0 M12 22 V27" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <Wave active={useRamp(26, 34)} color={ai ? K.ink : K.coral} />
          </div>
        </div>
      </Card>
      <ReelPlayer x={112} y={350} w={318} from={DAHI_AT.hook} at={20} aspect={1.74} bar={false} />
      <div
        style={{
          position: "absolute",
          top: 990,
          left: 240,
          width: 600,
          height: 86,
          borderRadius: 43,
          background: K.card,
          boxShadow: "0 10px 24px rgba(70,50,30,0.12)",
          ...rise(useIn(40), 14),
        }}
      >
        <div style={{ position: "absolute", top: 8, left: 8 + sw * 292, width: 292, height: 70, borderRadius: 35, background: K.coral }} />
        {["Your voice", "AI narrator"].map((t, i) => {
          const on = i === 0 ? 1 - sw : sw;
          return (
            <div
              key={t}
              style={{ position: "absolute", top: 0, left: 8 + i * 292, width: 292, height: 86, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <MonoLabel size={22} color={on > 0.5 ? "#fff" : K.muted}>
                {t}
              </MonoLabel>
            </div>
          );
        })}
      </div>
      <Caption a="Record it yourself," b="or let an AI read it." at={50} y={1150} />
      <Sfx at={SWITCH} src={POP} volume={0.5} />
    </Slide>
  );
};

// ===========================================================================
// 07 · Step 5: sound, timed to every beat

const SEG = [6.2, 7.7, 7.7, 7.6, 11, 6, 6.5, 10, 11.2, 6.4];
const TL_SECONDS = 84;

export const S7Mix: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useIn(12);
  const L = 210;
  const R = 960;
  const scale = (R - L) / TL_SECONDS;
  const head = interpolate(frame, [40, 175], [0, TL_SECONDS], clamp);
  const starts = SEG.reduce<number[]>((a, s, i) => [...a, i === 0 ? 0 : a[i - 1] + SEG[i - 1]], []);
  const rows: { y: number; label: string }[] = [
    { y: 450, label: "Scenes" },
    { y: 560, label: "Voice" },
    { y: 670, label: "Music" },
    { y: 780, label: "SFX" },
  ];
  const grow = (i: number) => useRamp(22 + i * 4, 34 + i * 4);
  return (
    <Slide index={7} footer="STEP 5 · VOICE · MUSIC · SFX">
      <Title top="STEP 5." bottom="SOUND, AUTO-TIMED." size={78} bottomSize={70} />
      <Card style={{ left: 50, right: 50, top: 330, height: 580, background: K.term, ...rise(card) }} />
      <div style={{ position: "absolute", inset: 0, opacity: card }}>
        {[0, 20, 40, 60, 80].map((s) => (
          <div key={s} style={{ position: "absolute", left: L + s * scale - 20, top: 362, width: 40, textAlign: "center", fontFamily: MONO, fontSize: 16, color: K.muted }}>
            {`${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`}
          </div>
        ))}
        {rows.map((r) => (
          <div key={r.label} style={{ position: "absolute", left: 82, top: r.y + 24 }}>
            <MonoLabel size={17} color="#BDB3A8">
              {r.label}
            </MonoLabel>
          </div>
        ))}
        {SEG.map((s, i) => {
          const g = grow(i);
          const x = L + starts[i] * scale;
          const w = (s * scale - 4) * g;
          const imgs = ["dahi_hook", "dahi_jaman", "dahi_acid", "dahi_net", "dahi_cold", "dahi_hot", "dahi_twist", "dahi_khandaan", "dahi_tips", "dahi_cta"];
          return (
            <React.Fragment key={i}>
              <div style={{ position: "absolute", left: x, top: 450, width: w, height: 74, borderRadius: 8, overflow: "hidden", border: "2px solid #3A3531" }}>
                <Img src={thumb(imgs[i])} style={{ width: 74 * 0.56 * 2, height: "100%", objectFit: "cover", objectPosition: "50% 0%" }} />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: x + 3,
                  top: 566,
                  width: Math.max(0, w - 10),
                  height: 62,
                  borderRadius: 8,
                  background: K.coral,
                  opacity: 0.92,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  padding: "0 6px",
                  overflow: "hidden",
                }}
              >
                {Array.from({ length: 14 }).map((_, j) => (
                  <div key={j} style={{ width: 3, flexShrink: 0, height: 10 + Math.abs(Math.sin(i * 3 + j * 1.3)) * 34, background: "rgba(255,255,255,0.75)", borderRadius: 2 }} />
                ))}
              </div>
              <div style={{ position: "absolute", left: x - 9, top: 790, width: 18, height: 18, background: i % 2 ? "#E9C46A" : "#8FC1E3", transform: `rotate(45deg) scale(${g})` }} />
            </React.Fragment>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: L,
            top: 680,
            width: (R - L) * useRamp(30, 70),
            height: 54,
            borderRadius: 8,
            background: "repeating-linear-gradient(90deg, #4E6A5A 0 10px, #5C7B69 10px 20px)",
          }}
        />
        <div style={{ position: "absolute", left: L + head * scale - 1, top: 392, width: 3, height: 480, background: "#fff", opacity: frame > 40 ? 1 : 0 }}>
          <div style={{ position: "absolute", left: -9, top: -6, width: 21, height: 14, background: "#fff", clipPath: "polygon(0 0,100% 0,50% 100%)" }} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 950, left: 0, right: 0, textAlign: "center", ...rise(useIn(80), 14) }}>
        <span style={{ fontFamily: MONO, fontSize: 24, padding: "12px 22px", borderRadius: 12, background: K.card, color: K.ink }}>
          beat length = voiceover length
        </span>
      </div>
      <Caption a="Every scene lasts" b="exactly as long as its line." at={90} y={1150} />
      {SEG.map((_, i) => (
        <Sfx key={i} at={22 + i * 4} src={TICK} volume={0.18} />
      ))}
    </Slide>
  );
};

// ===========================================================================
// 08 · Step 6: render + upload

const CMD = "npx remotion render DahiExplainer";
const TOTAL = 2512;

export const S8Render: React.FC = () => {
  const frame = useCurrentFrame();
  const term = useIn(12);
  const typed = useTyped(CMD, 20, 30);
  const R0 = typed.doneAt + 6;
  const prog = interpolate(frame, [R0, R0 + 50], [0, 1], clamp);
  const done = prog >= 1;
  const up = useIn(R0 + 58);
  const upProg = interpolate(frame, [R0 + 66, R0 + 100], [0, 1], clamp);
  const posted = upProg >= 1;
  return (
    <Slide index={8} footer="STEP 6 · RENDER · UPLOAD · DONE">
      <Title top="STEP 6." bottom="RENDER. UPLOAD." size={78} bottomSize={74} />
      <Card style={{ left: 80, right: 80, top: 320, height: 330, background: K.term, padding: "26px 32px", ...rise(term) }}>
        <div style={{ display: "flex", gap: 9, marginBottom: 24 }}>
          {["#E5675A", "#E9B949", "#5CB46B"].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: 7, background: c }} />
          ))}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 28, color: "#F2EDE4" }}>
          <span style={{ color: K.muted }}>$ </span>
          {typed.shown}
          {!typed.done && <Caret color="#F2EDE4" h={0.9} />}
        </div>
        <div style={{ marginTop: 26, height: 12, borderRadius: 6, background: "#3A3531", opacity: frame >= R0 ? 1 : 0 }}>
          <div style={{ width: `${prog * 100}%`, height: "100%", borderRadius: 6, background: K.coral }} />
        </div>
        <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 25, color: done ? "#7FD08F" : "#F2EDE4", opacity: frame >= R0 ? 1 : 0 }}>
          {Math.round(prog * TOTAL).toLocaleString("en-US")} frames{done ? " · done · 1:24" : ""}
        </div>
        <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 23, color: K.muted, opacity: done ? 1 : 0 }}>saved out/dahi.mp4</div>
      </Card>
      <Connector y={662} h={70} at={R0 + 52} />
      <Card style={{ left: 170, right: 170, top: 760, height: 260, padding: 24, display: "flex", gap: 26, ...rise(up) }}>
        <Img src={thumb("dahi_hook")} style={{ width: 120, height: 212, objectFit: "cover", borderRadius: 12 }} />
        <div style={{ flex: 1, paddingTop: 6 }}>
          <MonoLabel>Reel · 1:24</MonoLabel>
          <div style={{ fontSize: 33, fontWeight: 700, lineHeight: 1.22, marginTop: 10 }}>Sardi mein dahi kyun nahi jamta?</div>
          <div
            style={{
              marginTop: 22,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 18px",
              borderRadius: 999,
              background: posted ? "#E3F3E6" : "#F4EEE6",
            }}
          >
            {posted ? <Check p={1} size={26} /> : <div style={{ width: 120, height: 8, borderRadius: 4, background: K.hair }}><div style={{ width: `${upProg * 100}%`, height: "100%", borderRadius: 4, background: K.coral }} /></div>}
            <MonoLabel size={18} color={posted ? K.green : K.muted}>
              {posted ? "Posted" : "Uploading"}
            </MonoLabel>
          </div>
        </div>
      </Card>
      <Caption a="Render the MP4." b="Post it as a Reel." at={R0 + 70} y={1150} />
      <TypingTicks at={20} doneAt={typed.doneAt} />
      <Sfx at={R0 + 50} src={CHIME} volume={0.3} />
      <Sfx at={R0 + 100} src={POP} volume={0.5} />
    </Slide>
  );
};

// ===========================================================================
// 09 · Call to action

export const S9Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const word = useIn(18, 9);
  const block = useIn(28, 8);
  const typed = useTyped("REEL", 70, 8);
  const POST = typed.doneAt + 16;
  const heart = useIn(POST + 2, 8);
  return (
    <Slide index={9} footer={`FOLLOW ${HANDLE.toUpperCase()} FOR MORE`} showClaude={false}>
      <div style={{ position: "absolute", top: 150, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 14 }}>
        {["No editing app", "No watermark", "Only Claude Code"].map((t, i) => (
          <div key={t} style={{ padding: "10px 20px", borderRadius: 999, background: K.ink, ...rise(useIn(4 + i * 5), 12) }}>
            <MonoLabel size={18} color="#fff">
              {t}
            </MonoLabel>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", fontFamily: DISPLAY, fontSize: 170, letterSpacing: -4, ...rise(word, 30) }}>
        comment
      </div>
      <div
        style={{
          position: "absolute",
          top: 450,
          left: 240,
          width: 600,
          height: 230,
          borderRadius: 26,
          background: K.coral,
          color: "#FBEDE7",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: DISPLAY,
          fontSize: 190,
          letterSpacing: 4,
          boxShadow: "0 22px 46px rgba(217,99,76,0.35)",
          transform: `scale(${0.6 + 0.4 * block}) rotate(${(1 - block) * -6}deg)`,
          opacity: block,
        }}
      >
        REEL
      </div>
      <div style={{ position: "absolute", top: 730, left: 0, right: 0, textAlign: "center", fontSize: 48, fontWeight: 700, ...rise(useIn(46), 16) }}>
        I'll DM you <span style={{ color: K.coral }}>the full guide.</span>
      </div>
      <Card style={{ left: 170, right: 170, top: 840, height: 110, borderRadius: 55, display: "flex", alignItems: "center", padding: "0 18px 0 22px", gap: 18, ...rise(useIn(58), 16) }}>
        <div style={{ width: 66, height: 66, borderRadius: 33, background: K.coralSoft }} />
        <div style={{ flex: 1, fontSize: 36, fontWeight: 700 }}>
          {typed.shown || <span style={{ color: K.hair, fontWeight: 500 }}>Add a comment…</span>}
          {frame >= 70 && frame < POST && <Caret h={0.95} />}
        </div>
        <span style={{ fontSize: 30, fontWeight: 700, color: typed.done ? K.coral : K.hair }}>Post</span>
        {frame >= POST && (
          <svg width={44} height={40} viewBox="0 0 24 22" style={{ transform: `scale(${heart})` }}>
            <path d="M12 21 C5 15 1 11.5 1 7 A5.5 5.5 0 0 1 12 4.5 A5.5 5.5 0 0 1 23 7 C23 11.5 19 15 12 21Z" fill={K.coral} />
          </svg>
        )}
      </Card>
      <Pointer
        path={[
          [760, 1120, 60],
          [800, 905, POST - 4],
          [800, 905, POST + 40],
        ]}
        clickAt={POST}
      />
      <div style={{ position: "absolute", top: 1030, left: 0, right: 0, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 54, ...rise(useIn(POST + 10), 14) }}>
        One topic. <span style={{ color: K.coral }}>One reel.</span>
      </div>
      <Sfx at={28} src="sfx/whoosh.wav" volume={0.35} />
      <TypingTicks at={70} doneAt={typed.doneAt} every={4} />
      <Sfx at={POST} src={POP} volume={0.55} />
    </Slide>
  );
};

export const SLIDES: React.FC[] = [S1Hook, S2Problem, S3Topic, S4Research, S5Code, S6Voice, S7Mix, S8Render, S9Cta];
