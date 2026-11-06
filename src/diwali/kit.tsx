import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Beat, makeExplainer } from "../explainer/Explainer";
import { clamp, DarkBg, Header, Headline, PaperBg, Stamp, TypeOn, useCue, useEnter, useFloat } from "../onion/components";
import { C, DEVA, HEAD, MONO } from "../onion/theme";
import { GOLD } from "../dhanteras/art";
import { renderArt } from "./art";

export const HANDLE = "@mythmitao";

// Data-driven scenes for the Diwali fact series. An episode is a script of
// Shots: the voiceover line plus a layout (hero / cards / list / vs /
// number / type / cta) naming art from ./art. Elements enter on cues given
// as fractions of the shot, so the same script fits any voiceover length.

type Item = { art: string; title: string; sub?: string };

export type Layout =
  | { type: "hero"; art: string; size?: number; caption?: string; pills?: string[]; stamp?: string; glow?: boolean }
  | { type: "cards"; items: Item[] }
  | { type: "list"; items: Item[] }
  | { type: "vs"; left: Item & { ok?: boolean }; right: Item & { ok?: boolean }; caption?: string }
  | { type: "number"; to: number; from?: number; prefix?: string; suffix?: string; label: string; art?: string; caption?: string }
  | { type: "type"; text: string; art?: string; caption?: string }
  | { type: "cta"; ask: string; wish: string; english: string };

export type Shot = Beat & {
  dark?: boolean;
  tag: string; // header left, e.g. "STORY · FIG. 02"
  setup: string;
  punch: string;
  punchColor?: string;
  punchSize?: number;
  layout: Layout;
};

const Sfx: React.FC<{ at: number; src: string; volume?: number }> = ({ at, src, volume = 0.5 }) => (
  <Sequence from={Math.max(0, at)} layout="none">
    <Audio src={staticFile(src)} volume={volume} />
  </Sequence>
);

const Sparks: React.FC<{ count?: number }> = ({ count = 22 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const life = 90 + random(`sl${i}`) * 80;
        const t = ((frame + random(`so${i}`) * life) % life) / life;
        const s = 4 + random(`ss${i}`) * 8;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: random(`sx${i}`) * 1080 + Math.sin(t * 6 + i) * 30,
              top: 1900 - t * 1500,
              width: s,
              height: s,
              borderRadius: "50%",
              background: GOLD,
              boxShadow: `0 0 ${s * 2}px ${GOLD}`,
              opacity: Math.sin(Math.PI * t) * 0.6,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Art: React.FC<{ name: string; size: number; at: number; id: string; float?: boolean }> = ({ name, size, at, id, float = true }) => {
  const frame = useCurrentFrame();
  const e = useEnter(at, { damping: 11, stiffness: 150 });
  const y = useFloat(float ? 8 : 0, 0.05, id.length);
  return (
    <div style={{ transform: `translateY(${y}px) scale(${e})`, opacity: interpolate(e, [0, 0.3], [0, 1], clamp), display: "flex", justifyContent: "center" }}>
      {renderArt(name, size, Math.max(0, frame - at), id)}
    </div>
  );
};

const Caption: React.FC<{ text: string; y: number; at: number; dark: boolean; size?: number }> = ({ text, y, at, dark, size = 62 }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, textAlign: "center", fontFamily: DEVA, fontSize: size, lineHeight: 1.3, color: dark ? C.cream : C.ink, opacity: e, transform: `translateY(${(1 - e) * 24}px)` }}>
      {text}
    </div>
  );
};

const PillStack: React.FC<{ pills: string[]; y: number; at: number[]; dark: boolean }> = ({ pills, y, at, dark }) => (
  <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
    {pills.map((p, i) => {
      const e = useEnter(at[i]);
      const accent = i === pills.length - 1 && pills.length > 1;
      const fg = accent ? C.orange : dark ? C.cream : C.ink;
      return (
        <div key={p} style={{ opacity: e, transform: `translateY(${(1 - e) * 16}px)`, border: `3px solid ${fg}`, color: fg, borderRadius: 999, padding: "10px 28px", fontFamily: MONO, fontSize: 28, letterSpacing: 3, background: accent ? "rgba(240,138,36,0.12)" : "transparent", textAlign: "center" }}>
          {p}
        </div>
      );
    })}
  </div>
);

const Card: React.FC<{ item: Item; x: number; y: number; w: number; h: number; at: number; i: number }> = ({ item, x, y, w, h, at, i }) => {
  const e = useEnter(at, { damping: 13, stiffness: 120 });
  const rot = (i % 2 ? 2.5 : -2.5) + (1 - e) * -8;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: interpolate(e, [0, 0.25], [0, 1], clamp), transform: `translateY(${(1 - e) * -70}px) rotate(${rot}deg)`, filter: "drop-shadow(0 16px 26px rgba(0,0,0,0.35))" }}>
      <div style={{ position: "absolute", inset: 0, background: "#F6EEDC", borderRadius: 10, padding: 18, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, background: "#EADFC5", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {renderArt(item.art, Math.min(w, h) * 0.62, Math.max(0, useCurrentFrame() - at), `card${i}`)}
        </div>
        <div style={{ fontFamily: DEVA, fontSize: w > 400 ? 44 : 36, color: C.ink, textAlign: "center", marginTop: 10, lineHeight: 1.15 }}>{item.title}</div>
        {item.sub && <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: 2, color: "#6b6052", textAlign: "center", marginTop: 4 }}>{item.sub}</div>}
      </div>
    </div>
  );
};

const Row: React.FC<{ item: Item; y: number; h: number; at: number; i: number }> = ({ item, y, h, at, i }) => {
  const e = useEnter(at);
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: y, height: h - 24, display: "flex", alignItems: "center", gap: 28, padding: "0 28px", borderRadius: 24, background: "#F6EEDC", border: "3px solid rgba(42,36,32,0.25)", boxShadow: "0 10px 22px rgba(0,0,0,0.14)", opacity: e, transform: `translateX(${(1 - e) * 120}px)` }}>
      <div style={{ width: h - 60, height: h - 60, borderRadius: "50%", background: C.ink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
        {renderArt(item.art, (h - 60) * 0.78, Math.max(0, frame - at), `row${i}`)}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 52, color: C.ink, textTransform: "uppercase", lineHeight: 1.05 }}>{item.title}</div>
        {item.sub && <div style={{ fontFamily: DEVA, fontSize: 36, color: "#6b6052", marginTop: 4, lineHeight: 1.2 }}>{item.sub}</div>}
      </div>
    </div>
  );
};

const Mark: React.FC<{ ok: boolean; at: number }> = ({ ok, at }) => {
  const e = useEnter(at, { damping: 9, stiffness: 200 });
  return (
    <div style={{ width: 90, height: 90, borderRadius: "50%", background: ok ? C.green : C.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 60, transform: `scale(${e})`, border: `4px solid ${C.ink}` }}>
      {ok ? "✓" : "✗"}
    </div>
  );
};

/** Always-on channel watermark, top right above the header rule. */
const HandleTag: React.FC<{ dark: boolean }> = ({ dark }) => (
  <div
    style={{
      position: "absolute",
      top: 128,
      right: 70,
      padding: "6px 18px",
      borderRadius: 999,
      background: dark ? "rgba(240,138,36,0.16)" : "rgba(181,80,28,0.10)",
      border: `2px solid ${dark ? C.orange : C.rust}`,
      fontFamily: MONO,
      fontSize: 30,
      letterSpacing: 1,
      color: dark ? C.orange : C.rust,
    }}
  >
    {HANDLE}
  </div>
);

const ShotScene: React.FC<{ shot: Shot; index: number }> = ({ shot, index }) => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const dark = shot.dark ?? true;
  const L = shot.layout;
  const fg = dark ? C.cream : C.ink;
  const sfx: { at: number; src: string; volume?: number }[] = [];
  let body: React.ReactNode = null;

  if (L.type === "hero") {
    const size = L.size ?? 520;
    const pills = L.pills ?? [];
    body = (
      <>
        {L.glow && <AbsoluteFill style={{ background: `radial-gradient(circle at 540px 900px, rgba(255,178,63,0.28) 0%, rgba(0,0,0,0) 520px)` }} />}
        <div style={{ position: "absolute", left: 0, right: 0, top: 610, height: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Art name={L.art} size={size} at={cue(0.08)} id={`h${index}`} />
        </div>
        {L.caption && <Caption text={L.caption} y={1240} at={cue(0.35)} dark={dark} />}
        {pills.length > 0 && <PillStack pills={pills} y={L.caption ? 1350 : 1260} at={pills.map((_, i) => cue(0.45 + i * 0.12))} dark={dark} />}
        {L.stamp && <Stamp text={L.stamp} x={790} y={700} at={cue(0.68)} color={dark ? C.orange : C.red} rotate={-9} size={72} blend={dark ? "normal" : "multiply"} />}
      </>
    );
    sfx.push({ at: cue(0.08), src: "sfx/pop.wav", volume: 0.4 });
    if (L.stamp) sfx.push({ at: cue(0.68), src: "onion/thud.wav", volume: 0.5 });
  }

  if (L.type === "cards") {
    const n = L.items.length;
    const perRow = n <= 3 ? n : n === 4 ? 2 : 3;
    const rows = Math.ceil(n / perRow);
    const w = perRow === 1 ? 640 : perRow === 2 ? 440 : 300;
    const h = rows === 1 ? (perRow === 1 ? 640 : 520) : 440;
    const gap = 30;
    body = (
      <>
        {L.items.map((it, i) => {
          const r = Math.floor(i / perRow);
          const inRow = Math.min(perRow, n - r * perRow);
          const c = i % perRow;
          const rowW = inRow * w + (inRow - 1) * gap;
          const x = 540 - rowW / 2 + c * (w + gap);
          const y = (rows === 1 ? 640 : 590) + r * (h + 40);
          const at = cue(0.1 + (0.7 * i) / n);
          sfx.push({ at, src: "sfx/pop.wav", volume: 0.35 });
          return <Card key={i} item={it} x={x} y={y} w={w} h={h} at={at} i={i} />;
        })}
      </>
    );
  }

  if (L.type === "list") {
    const n = L.items.length;
    const h = n <= 3 ? 230 : n === 4 ? 210 : 188;
    body = (
      <>
        {L.items.map((it, i) => {
          const at = cue(0.1 + (0.72 * i) / n);
          sfx.push({ at, src: "sfx/pop.wav", volume: 0.4 });
          return <Row key={i} item={it} y={590 + i * h} h={h} at={at} i={i} />;
        })}
      </>
    );
  }

  if (L.type === "vs") {
    const side = (it: Item & { ok?: boolean }, x: number, at: number, k: string) => {
      const e = useEnter(at);
      return (
        <div style={{ position: "absolute", left: x, top: 620, width: 440, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: e, transform: `translateY(${(1 - e) * 40}px)` }}>
          <div style={{ width: 420, height: 460, borderRadius: 26, background: dark ? "rgba(243,235,221,0.07)" : "#F6EEDC", border: `4px solid ${dark ? "rgba(243,235,221,0.25)" : "rgba(42,36,32,0.25)"}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {renderArt(it.art, 330, Math.max(0, frame - at), k)}
          </div>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 54, color: fg, textTransform: "uppercase", textAlign: "center", lineHeight: 1.05 }}>{it.title}</div>
          {it.sub && <div style={{ fontFamily: DEVA, fontSize: 36, color: dark ? C.muted : "#6b6052", textAlign: "center", lineHeight: 1.2 }}>{it.sub}</div>}
          {it.ok !== undefined && <Mark ok={it.ok} at={cue(0.62) + (k === "R" ? 6 : 0)} />}
        </div>
      );
    };
    body = (
      <>
        {side(L.left, 80, cue(0.1), "L")}
        {side(L.right, 560, cue(0.32), "R")}
        <div style={{ position: "absolute", left: 500, top: 800, width: 80, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 52, color: C.orange, opacity: useEnter(cue(0.25)) }}>VS</div>
        {L.caption && <Caption text={L.caption} y={1430} at={cue(0.7)} dark={dark} size={54} />}
      </>
    );
    sfx.push({ at: cue(0.1), src: "sfx/pop.wav", volume: 0.4 }, { at: cue(0.32), src: "sfx/pop.wav", volume: 0.4 }, { at: cue(0.62), src: "onion/tick.wav", volume: 0.5 });
  }

  if (L.type === "number") {
    const start = cue(0.2);
    const n = interpolate(frame, [start, start + 40], [L.from ?? 0, L.to], { ...clamp, easing: Easing.out(Easing.cubic) });
    const e = useEnter(start);
    body = (
      <>
        <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", opacity: e, transform: `scale(${0.7 + 0.3 * e})` }}>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 260, lineHeight: 1, color: shot.punchColor ?? (dark ? GOLD : C.rust), textShadow: dark ? "0 0 40px rgba(232,181,58,0.35)" : "none" }}>
            {L.prefix ?? ""}
            {Math.round(n).toLocaleString("en-IN")}
            {L.suffix ?? ""}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 5, color: dark ? C.muted : "#6b6052", marginTop: 10 }}>{L.label}</div>
        </div>
        {L.art && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center" }}>
            <Art name={L.art} size={340} at={cue(0.4)} id={`n${index}`} />
          </div>
        )}
        {L.caption && <Caption text={L.caption} y={L.art ? 1400 : 1060} at={cue(0.55)} dark={dark} />}
      </>
    );
    sfx.push({ at: start, src: "onion/sparkle.wav", volume: 0.45 });
  }

  if (L.type === "type") {
    body = (
      <>
        {L.art && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 600, height: 520, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Art name={L.art} size={460} at={cue(0.05)} id={`t${index}`} />
          </div>
        )}
        <div style={{ position: "absolute", left: 80, right: 80, top: L.art ? 1170 : 700, padding: "30px 34px", borderLeft: `8px solid ${C.orange}`, background: dark ? "rgba(243,235,221,0.06)" : "rgba(42,36,32,0.05)" }}>
          <TypeOn text={L.text} start={cue(0.2)} cps={22} style={{ fontFamily: MONO, fontSize: 34, letterSpacing: 1.5, lineHeight: 1.45, color: fg }} />
        </div>
        {L.caption && <Caption text={L.caption} y={L.art ? 1450 : 1150} at={cue(0.6)} dark={dark} size={54} />}
      </>
    );
    sfx.push({ at: cue(0.2), src: "onion/tick.wav", volume: 0.4 });
  }

  if (L.type === "cta") {
    const bubble = useEnter(cue(0.3), { damping: 10, stiffness: 180 });
    const wish = useEnter(cue(0.58), { damping: 9, stiffness: 140 });
    body = (
      <>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 540px 1000px, rgba(255,178,63,0.25) 0%, rgba(0,0,0,0) 600px)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 620, display: "flex", justifyContent: "center" }}>{renderArt("diyas", 960, frame, "ctad")}</div>
        <Caption text={L.ask} y={850} at={cue(0.15)} dark />
        <div style={{ position: "absolute", left: 540, top: 1010, transform: `translateX(-50%) scale(${bubble})`, background: C.orange, color: C.slate, borderRadius: 999, padding: "16px 44px", fontFamily: HEAD, fontWeight: 700, fontSize: 54, letterSpacing: 2, display: "flex", alignItems: "center", gap: 18, whiteSpace: "nowrap" }}>
          COMMENT KARO
          <svg width="40" height="48" viewBox="0 0 40 48">
            <path d="M20 4 V 40 M6 26 L 20 42 L 34 26" fill="none" stroke={C.slate} strokeWidth={7} strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1180, textAlign: "center", transform: `scale(${wish})`, opacity: wish }}>
          <div style={{ fontFamily: DEVA, fontSize: 100, color: GOLD, textShadow: "0 0 30px rgba(232,181,58,0.6)" }}>{L.wish}</div>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 60, color: C.cream, letterSpacing: 4, marginTop: 6 }}>{L.english}</div>
        </div>
      </>
    );
    sfx.push({ at: cue(0.3), src: "sfx/pop.wav", volume: 0.55 }, { at: cue(0.58), src: "onion/sparkle.wav", volume: 0.5 });
  }

  return (
    <AbsoluteFill>
      {dark ? <DarkBg /> : <PaperBg />}
      {dark && <Sparks count={L.type === "cta" ? 34 : 14} />}
      <Header left={shot.tag} right="" dark={dark} />
      <HandleTag dark={dark} />
      <Headline setup={shot.setup} punch={shot.punch} dark={dark} punchColor={shot.punchColor ?? (dark ? GOLD : C.rust)} punchSize={shot.punchSize ?? (shot.punch.length > 18 ? 96 : 118)} />
      {body}
      {sfx.map((s, i) => (
        <Sfx key={i} {...s} />
      ))}
    </AbsoluteFill>
  );
};

export const makeEpisode = (slug: string, script: Shot[], hasVoiceover: boolean) => {
  const scenes: Record<string, React.FC> = {};
  script.forEach((shot, i) => {
    const S: React.FC = () => <ShotScene shot={shot} index={i} />;
    scenes[shot.id] = S;
  });
  return makeExplainer({ script, scenes, voDir: `diwali/${slug}/vo`, hasVoiceover, voLeadFrames: 2, handle: HANDLE });
};
