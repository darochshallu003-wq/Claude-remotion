import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { clamp, CountUp, DarkBg, Header, Headline, PaperBg, PaperCard, Pill, Stamp, TypeOn, useCue, useEnter, useFloat } from "../onion/components";
import { C, HEAD, MONO } from "../onion/theme";
import { INK, Phone, picture, Picture, PixelGrid, TvSet } from "./art";

// Scenes for "How does a TV screen work?", in the series style.

const LAB = "TV LAB";
const RED = "#FF3B30";
const GREEN = "#34E05A";
const BLUE = "#3A6BFF";

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

const Label: React.FC<{ x: number; y: number; at: number; text: string; color?: string; size?: number; center?: boolean }> = ({ x, y, at, text, color = C.cream, size = 46, center = true }) => {
  const e = useEnter(at);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `${center ? "translate(-50%,-50%) " : ""}scale(${0.8 + 0.2 * e})`,
        opacity: e,
        fontFamily: HEAD,
        fontWeight: 700,
        fontSize: size,
        color,
        whiteSpace: "nowrap",
        textTransform: "uppercase",
        textShadow: "0 3px 12px rgba(0,0,0,0.5)",
      }}
    >
      {text}
    </div>
  );
};

// ===========================================================================

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const turn = cue(0.4);
  const float = useFloat(6);
  const zoom = interpolate(frame, [cue(0.75), cue(1)], [1, 1.25], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="HOME · FIG. 01" right={LAB} dark />
      {frame < turn ? (
        <Headline setup="TV pe crore rang…" punch="Par asal mein?" dark punchColor={C.sulfur} />
      ) : (
        <From at={turn}>
          <Headline setup="Sirf 3 rangon ka khel" punch="R · G · B" dark punchColor={C.orange} punchAt={2} delay={0} />
        </From>
      )}
      <div style={{ position: "absolute", left: 540 - 470, top: 680 + float, transform: `scale(${zoom})`, transformOrigin: "50% 40%" }}>
        <TvSet w={900} glow={1}>
          <Picture w={900} h={506} id="hk" />
        </TvSet>
      </div>
      {frame >= turn && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1420, display: "flex", justifyContent: "center", gap: 30 }}>
          {[RED, GREEN, BLUE].map((c, i) => {
            const e = interpolate(frame, [turn + i * 5, turn + i * 5 + 10], [0, 1], clamp);
            return <div key={c} style={{ width: 90, height: 90, borderRadius: 45, background: c, transform: `scale(${e})`, boxShadow: `0 0 40px ${c}` }} />;
          })}
        </div>
      )}
      <Sfx at={turn} src="onion/sparkle.wav" />
      <Sfx at={cue(0.75)} src="sfx/whoosh.wav" volume={0.35} />
    </AbsoluteFill>
  );
};

export const Pixels: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const cols = 32;
  const rows = 18;
  const cell = 30;
  const target: [number, number] = [24, 9]; // a pixel near the sun's edge
  const z = interpolate(frame, [cue(0.12), cue(0.62)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const scale = Math.pow(18, z);
  const blend = interpolate(frame, [cue(0.28), cue(0.45)], [1, 0], clamp);
  const tx = (target[0] + 0.5) * cell;
  const ty = (target[1] + 0.5) * cell;
  const gridW = cols * cell;
  const gridH = rows * cell;
  const boxL = 60;
  const boxT = 620;
  // move the focus point from the grid centre to the target pixel while zooming
  const fx = gridW / 2 + (tx - gridW / 2) * z;
  const fy = gridH / 2 + (ty - gridH / 2) * z;
  const [r, g, b] = picture((target[0] + 0.5) / cols, (target[1] + 0.5) / rows);
  const swatch = useEnter(cue(0.86));
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="ZOOM · FIG. 02" right="PIXELS" dark />
      <Headline setup="Zoom karo…" punch={z > 0.9 ? "1 pixel = 3 subpixels" : "Pixels!"} dark punchColor={C.sulfur} punchSize={z > 0.9 ? 96 : 118} />
      <div style={{ position: "absolute", left: boxL, top: boxT, width: gridW, height: gridH, overflow: "hidden", borderRadius: 10, border: `6px solid ${C.cream}` }}>
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${gridW / 2 - fx * scale}px, ${gridH / 2 - fy * scale}px) scale(${scale})` }}>
          <PixelGrid cols={cols} rows={rows} cell={cell} blend={blend} />
        </div>
        {z > 0.9 && (
          <div style={{ position: "absolute", left: gridW / 2 - (cell * scale) / 2, top: gridH / 2 - (cell * scale) / 2, width: cell * scale, height: cell * scale, border: `8px solid ${C.cream}`, borderRadius: 16, boxSizing: "border-box", opacity: interpolate(z, [0.9, 1], [0, 1]) }} />
        )}
      </div>
      <Label x={540} y={1250} at={cue(0.3)} text="Har dot = 1 pixel" color={C.cream} size={54} />
      {z > 0.95 && (
        <>
          <Label x={540 - 180} y={1340} at={cue(0.68)} text="Red" color={RED} size={60} />
          <Label x={540} y={1340} at={cue(0.74)} text="Green" color={GREEN} size={60} />
          <Label x={540 + 180} y={1340} at={cue(0.8)} text="Blue" color={BLUE} size={60} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 1430, display: "flex", justifyContent: "center", gap: 18, alignItems: "center", opacity: swatch }}>
            <span style={{ fontFamily: MONO, fontSize: 30, color: C.cream, letterSpacing: 2 }}>
              R {r} · G {g} · B {b} =
            </span>
            <div style={{ width: 70, height: 70, borderRadius: 12, background: `rgb(${r},${g},${b})`, border: `4px solid ${C.cream}` }} />
          </div>
        </>
      )}
      <Sfx at={cue(0.12)} src="sfx/whoosh.wav" volume={0.35} />
      <Sfx at={cue(0.68)} src="sfx/pop.wav" />
      <Sfx at={cue(0.74)} src="sfx/pop.wav" />
      <Sfx at={cue(0.8)} src="sfx/pop.wav" />
    </AbsoluteFill>
  );
};

export const Mixing: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const rg = interpolate(frame, [cue(0.08), cue(0.28)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const bIn = interpolate(frame, [cue(0.36), cue(0.5)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const off = interpolate(frame, [cue(0.56), cue(0.62)], [1, 0], clamp);
  const sliders = frame >= cue(0.66);
  const cx = 540;
  const cy = 960;
  const R = 200;
  const circle = (c: string, x: number, y: number, o: number) => (
    <div style={{ position: "absolute", left: x - R, top: y - R, width: 2 * R, height: 2 * R, borderRadius: R, background: c, mixBlendMode: "screen", opacity: o }} />
  );
  // cycling colour for the slider demo
  const t = (frame - cue(0.66)) / 30;
  const rv = Math.round(127 + 127 * Math.sin(t * 1.3));
  const gv = Math.round(127 + 127 * Math.sin(t * 1.7 + 2));
  const bv = Math.round(127 + 127 * Math.sin(t * 1.1 + 4));
  const eq1 = useEnter(cue(0.78));
  const eq2 = useEnter(cue(0.84));
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="COLOUR · FIG. 03" right="LIGHT ADDS UP" dark />
      <Headline setup="Ab magic dekho" punch={sliders ? "Crore rang" : "R + G + B"} dark punchColor={C.sulfur} />
      {!sliders ? (
        <div style={{ position: "absolute", left: 90, top: 560, width: 900, height: 820, borderRadius: 30, background: "#000", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, isolation: "isolate" }}>
            {circle(RED, cx - 90 - 130 * (1 - rg) - 90, cy - 560 - 60, off)}
            {circle(GREEN, cx - 90 + 130 * (1 - rg) + 90, cy - 560 - 60, off)}
            {circle(BLUE, cx - 90, cy - 560 + 110 + 260 * (1 - bIn), off * bIn)}
          </div>
          {rg > 0.95 && bIn < 0.05 && <Label x={450} y={330} at={cue(0.28)} text="Yellow" color="#111" size={44} />}
          {bIn > 0.95 && off > 0.5 && <Label x={450} y={400} at={cue(0.5)} text="White" color="#111" size={44} />}
          {off < 0.5 && <Label x={450} y={410} at={cue(0.6)} text="Sab band = Black" color={C.cream} size={56} />}
        </div>
      ) : (
        <div style={{ position: "absolute", left: 90, top: 560, width: 900, height: 820 }}>
          {[
            ["R", rv, RED],
            ["G", gv, GREEN],
            ["B", bv, BLUE],
          ].map(([l, v, c], i) => (
            <div key={l as string} style={{ position: "absolute", left: 0, top: 40 + i * 120, width: 560, display: "flex", alignItems: "center", gap: 20 }}>
              <span style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 56, color: c as string, width: 40 }}>{l}</span>
              <div style={{ flex: 1, height: 26, borderRadius: 13, background: "rgba(243,235,221,0.15)" }}>
                <div style={{ width: `${((v as number) / 255) * 100}%`, height: "100%", borderRadius: 13, background: c as string }} />
              </div>
              <span style={{ fontFamily: MONO, fontSize: 32, color: C.cream, width: 70 }}>{v}</span>
            </div>
          ))}
          <div style={{ position: "absolute", left: 620, top: 30, width: 280, height: 320, borderRadius: 24, background: `rgb(${rv},${gv},${bv})`, border: `6px solid ${C.cream}` }} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 76, color: C.cream, opacity: eq1 }}>
            256 × 256 × 256
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 100, color: C.sulfur, opacity: eq2 }}>
            ≈ 1.67 crore rang
          </div>
          <Pill text="8-BIT PANEL · 256 LEVELS / COLOUR" x={190} y={740} delay={cue(0.86)} dark />
        </div>
      )}
      <Sfx at={cue(0.28)} src="sfx/pop.wav" />
      <Sfx at={cue(0.5)} src="onion/sparkle.wav" />
      <Sfx at={cue(0.6)} src="onion/tick.wav" />
      <Sfx at={cue(0.84)} src="onion/thud.wav" />
    </AbsoluteFill>
  );
};

export const Numbers: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="MATHS · FIG. 04" right="4K UHD" dark={false} />
      <Headline setup="Ek 4K TV mein" punch="83 lakh pixels" dark={false} punchColor={C.rust} />
      <PaperCard x={90} y={570} w={900} h={560} delay={cue(0.05)} rotate={-2} label="3840 × 2160" seed="num">
        <AbsoluteFill style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 96, color: C.ink }}>
            <TypeOn text="3840 × 2160" start={cue(0.1)} cps={10} />
          </div>
          <div style={{ fontFamily: HEAD, fontWeight: 700, fontSize: 120, color: C.rust, opacity: useEnter(cue(0.38)) }}>
            = <CountUp from={0} to={8294400} start={cue(0.38)} frames={40} format={(n) => Math.round(n).toLocaleString("en-IN")} />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 30, letterSpacing: 3, color: "#6b6052", opacity: useEnter(cue(0.45)) }}>PIXELS</div>
        </AbsoluteFill>
      </PaperCard>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1210, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 90, color: C.ink, opacity: useEnter(cue(0.58)) }}>
        × 3 subpixels
      </div>
      <Stamp text="≈ 2.49 crore lights" x={540} y={1440} at={cue(0.7)} color={C.red} size={84} rotate={-6} />
      <Sfx at={cue(0.38)} src="sfx/pop.wav" />
      <Sfx at={cue(0.7)} src="onion/thud.wav" volume={0.6} />
    </AbsoluteFill>
  );
};

/** A slanted panel in the exploded LCD stack. */
const Layer: React.FC<{ x: number; at: number; fill: React.ReactNode; label: string; sub?: string }> = ({ x, at, fill, label, sub }) => {
  const e = useEnter(at);
  return (
    <div style={{ position: "absolute", left: x, top: 640, opacity: e, transform: `translateY(${(1 - e) * -60}px)` }}>
      <svg width={150} height={560} viewBox="0 0 150 560" style={{ overflow: "visible" }}>
        <defs>
          <clipPath id={`l${x}`}>
            <path d="M 20 60 L 130 0 L 130 500 L 20 560 Z" />
          </clipPath>
        </defs>
        <g clipPath={`url(#l${x})`}>{fill}</g>
        <path d="M 20 60 L 130 0 L 130 500 L 20 560 Z" fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: -10, width: 170, top: 600, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 32, color: C.ink, lineHeight: 1.05 }}>
        {label}
        {sub && <div style={{ fontFamily: MONO, fontWeight: 400, fontSize: 20, letterSpacing: 2, color: "#6b6052", marginTop: 6 }}>{sub}</div>}
      </div>
    </div>
  );
};

export const Lcd: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  // voltage toggles during the demo: OFF (twisted, light passes) / ON (blocked)
  const demo = frame >= cue(0.55) && frame < cue(0.82);
  const voltageOn = demo && Math.floor((frame - cue(0.55)) / 24) % 2 === 1;
  const twist = voltageOn ? 0 : 1;
  const beamEnd = frame < cue(0.12) ? 0 : voltageOn ? 4 : 5;
  const xs = [70, 250, 430, 610, 790];
  const beamTo = beamEnd === 0 ? 0 : xs[beamEnd - 1] + 75;
  const passed = beamEnd === 5;
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="LED / LCD · FIG. 05" right="LAYERS" dark={false} />
      <Headline setup="LED TV ke andar" punch="Layers ka sandwich" dark={false} punchColor={C.rust} punchSize={104} />
      {/* light beam */}
      {beamTo > 0 && (
        <div style={{ position: "absolute", left: 140, top: 870, width: beamTo - 140 + (passed ? 200 : 0), height: 90, background: "linear-gradient(90deg, rgba(255,250,220,0.95), rgba(255,240,180,0.6))", boxShadow: "0 0 50px rgba(255,230,150,0.8)", borderRadius: 45, opacity: 0.85 }} />
      )}
      <Layer
        x={xs[0]}
        at={cue(0.08)}
        label="LED backlight"
        sub="WHITE LIGHT"
        fill={<rect width={150} height={560} fill="#FFF6D6" />}
      />
      <Layer
        x={xs[1]}
        at={cue(0.48)}
        label="Polarizer"
        fill={
          <g>
            <rect width={150} height={560} fill="#DDE6EA" />
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={i} x1={i * 10} y1={0} x2={i * 10} y2={560} stroke={INK} strokeWidth={2} opacity={0.5} />
            ))}
          </g>
        }
      />
      <Layer
        x={xs[2]}
        at={cue(0.28)}
        label="Liquid crystals"
        sub={voltageOn ? "VOLTAGE ON" : "VOLTAGE OFF"}
        fill={
          <g>
            <rect width={150} height={560} fill="#EAF2F4" />
            {Array.from({ length: 7 }).map((_, i) => (
              <ellipse key={i} cx={75} cy={60 + i * 70} rx={44} ry={9} fill="#8FB9C9" stroke={INK} strokeWidth={3} transform={`rotate(${twist * (i * 13) + (1 - twist) * 90} 75 ${60 + i * 70})`} />
            ))}
          </g>
        }
      />
      <Layer
        x={xs[3]}
        at={cue(0.86)}
        label="Colour filter"
        fill={
          <g>
            {Array.from({ length: 15 }).map((_, i) => (
              <rect key={i} x={i * 10} y={0} width={10} height={560} fill={[RED, GREEN, BLUE][i % 3]} />
            ))}
          </g>
        }
      />
      <Layer
        x={xs[4]}
        at={cue(0.5)}
        label="Polarizer"
        sub="CROSSED"
        fill={
          <g>
            <rect width={150} height={560} fill="#DDE6EA" />
            {Array.from({ length: 56 }).map((_, i) => (
              <line key={i} x1={0} y1={i * 10} x2={150} y2={i * 10} stroke={INK} strokeWidth={2} opacity={0.5} />
            ))}
          </g>
        }
      />
      {demo && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1460, display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "12px 34px", borderRadius: 999, background: voltageOn ? C.red : C.green, fontFamily: HEAD, fontWeight: 700, fontSize: 48, color: C.paper }}>
            {voltageOn ? "Voltage ON → light ruki" : "Voltage OFF → light gayi"}
          </div>
        </div>
      )}
      <Sfx at={cue(0.08)} src="sfx/pop.wav" />
      <Sfx at={cue(0.28)} src="sfx/pop.wav" />
      <Sfx at={cue(0.55)} src="onion/tick.wav" />
      <Sfx at={cue(0.86)} src="sfx/pop.wav" />
    </AbsoluteFill>
  );
};

const HEART = [
  "..XX..XX..",
  ".XXXXXXXX.",
  "XXXXXXXXXX",
  "XXXXXXXXXX",
  ".XXXXXXXX.",
  "..XXXXXX..",
  "...XXXX...",
  "....XX....",
];

export const Oled: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const cell = 80;
  const cols = 10;
  const rows = 8;
  const lit = interpolate(frame, [cue(0.2), cue(0.5)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="OLED · FIG. 06" right="SELF-LIT" dark />
      <Headline setup="OLED TV" punch="Har pixel khud jale" dark punchColor={C.orange} punchSize={104} />
      <div style={{ position: "absolute", left: 140, top: 560, width: cols * cell, height: rows * cell, background: "#000", borderRadius: 14, border: `5px solid ${C.cream}` }}>
        <svg width={cols * cell} height={rows * cell}>
          {HEART.flatMap((row, j) =>
            row.split("").map((ch, i) => {
              const on = ch === "X" && (i + j) / (cols + rows) < lit * 1.2;
              const bw = cell / 3;
              return [RED, GREEN, BLUE].map((c, k) => (
                <rect
                  key={`${i}-${j}-${k}`}
                  x={i * cell + k * bw + 1.5}
                  y={j * cell + 3}
                  width={bw - 3}
                  height={cell - 6}
                  rx={4}
                  fill={c}
                  opacity={on ? (k === 0 ? 1 : k === 1 ? 0.25 : 0.4) : 0.06}
                />
              ));
            }),
          )}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 90, top: 1260, width: 420, height: 230, borderRadius: 20, background: "#26282E", boxShadow: "inset 0 0 60px rgba(160,170,200,0.35)", border: `4px solid ${C.cream}`, opacity: useEnter(cue(0.66)) }} />
      <div style={{ position: "absolute", left: 570, top: 1260, width: 420, height: 230, borderRadius: 20, background: "#000", border: `4px solid ${C.cream}`, opacity: useEnter(cue(0.72)) }} />
      <Label x={300} y={1540} at={cue(0.66)} text="LED ka black" color={C.muted} size={44} />
      <Label x={780} y={1540} at={cue(0.72)} text="OLED ka black" color={C.cream} size={44} />
      <Stamp text="Asli black" x={780} y={1375} at={cue(0.8)} color={C.orange} size={56} blend="normal" rotate={-8} />
      <Sfx at={cue(0.2)} src="onion/sparkle.wav" />
      <Sfx at={cue(0.8)} src="onion/thud.wav" />
    </AbsoluteFill>
  );
};

export const Motion: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const fps60 = frame * 2; // two "screen frames" per video frame at 30 fps
  const bounce = (n: number) => Math.abs(Math.sin(n / 18)) * 300;
  const strip = Array.from({ length: 9 }).map((_, i) => i);
  const shift = (frame * 6) % 130;
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="MOTION · FIG. 07" right="60 HZ" dark />
      <Headline setup="Picture hilti kaise hai?" punch="60 frames / sec" dark punchColor={C.sulfur} />
      <div style={{ position: "absolute", left: 160, top: 560 }}>
        <TvSet w={720}>
          <div style={{ position: "absolute", inset: 0, background: "#16202E" }}>
            <div style={{ position: "absolute", left: 340, top: 340 - bounce(fps60), width: 60, height: 60, borderRadius: 30, background: C.orange, boxShadow: `0 0 30px ${C.orange}` }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 400, height: 5, background: C.cream, opacity: 0.4 }} />
          </div>
        </TvSet>
      </div>
      {/* film strip of individual frames */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, height: 200, overflow: "hidden", opacity: useEnter(cue(0.3)) }}>
        <div style={{ position: "absolute", left: -shift, top: 0, display: "flex", gap: 10 }}>
          {strip.map((i) => {
            const n = Math.floor(fps60 / 8) * 8 + i * 8;
            return (
              <div key={i} style={{ width: 120, height: 180, background: "#111", border: `4px solid ${C.cream}`, borderRadius: 8, position: "relative" }}>
                <div style={{ position: "absolute", left: 46, top: 150 - bounce(n) * 0.42, width: 26, height: 26, borderRadius: 13, background: C.orange }} />
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1400, textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: C.cream, opacity: useEnter(cue(0.6)) }}>
        Aankhen frames jod deti hain
      </div>
      <Sfx at={cue(0.3)} src="sfx/whoosh.wav" volume={0.3} />
      <Sfx at={cue(0.6)} src="sfx/pop.wav" />
    </AbsoluteFill>
  );
};

export const TryIt: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = useCue();
  const drop = interpolate(frame, [cue(0.15), cue(0.3)], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const fall = interpolate(frame, [cue(0.06), cue(0.15)], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  return (
    <AbsoluteFill>
      <PaperBg />
      <Header left="TRY IT · FIG. 08" right="GHAR PE" dark={false} />
      <Headline setup="Khud dekhna hai?" punch="Paani ki boond" dark={false} punchColor={C.rust} />
      <div style={{ position: "absolute", left: 300, top: 560 }}>
        <Phone w={480} drop={drop} />
      </div>
      {fall < 1 && frame > cue(0.06) && (
        <div style={{ position: "absolute", left: 528, top: 480 + fall * 420, width: 24, height: 34, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#8CCFE8", border: `3px solid ${INK}` }} />
      )}
      <Label x={540} y={1610} at={cue(0.45)} text="R · G · B dikh jayenge!" color={C.ink} size={58} />
      <Pill text="BAAD MEIN SCREEN SAAF KAR DENA" x={220} y={1690} delay={cue(0.82)} />
      <Sfx at={cue(0.15)} src="onion/tick.wav" />
      <Sfx at={cue(0.45)} src="onion/sparkle.wav" />
    </AbsoluteFill>
  );
};

export const Cta: React.FC = () => {
  const cue = useCue();
  const float = useFloat(6);
  return (
    <AbsoluteFill>
      <DarkBg />
      <Header left="YOUR TURN · FIG. 09" right={LAB} dark />
      <Headline setup="Aapke ghar mein" punch="LED ya OLED?" dark punchColor={C.sulfur} />
      <div style={{ position: "absolute", left: 540 - 420, top: 640 + float }}>
        <TvSet w={800} glow={1}>
          <Picture w={800} h={450} id="ct" />
        </TvSet>
      </div>
      <Pill text="COMMENT MEIN BATAIYE" x={340} y={1420} delay={cue(0.3)} dark accent />
      <Sfx at={cue(0.3)} src="onion/sparkle.wav" />
    </AbsoluteFill>
  );
};

export const SCENES: Record<string, React.FC> = {
  hook: Hook,
  pixels: Pixels,
  mixing: Mixing,
  numbers: Numbers,
  lcd: Lcd,
  oled: Oled,
  motion: Motion,
  tryit: TryIt,
  cta: Cta,
};
