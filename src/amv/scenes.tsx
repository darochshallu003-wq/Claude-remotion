import React from "react";
import { AbsoluteFill } from "remotion";
import type { SceneId } from "./edit";

// Original, procedurally drawn anime-style backdrops (all SVG, 1080x1920).
// They stand in for footage: each one is a mood the reference edits cut
// between (moon silhouettes, blood moon, sunset blade, glowing eye...).
// `t` = frames since the shot started, `g` = global frame (keeps ambient
// motion like clouds continuous across cuts).

type P = { t: number; g: number };
const W = 1080;
const H = 1920;

/** Deterministic hash noise in [0, 1). */
export const rnd = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {children}
    </svg>
  </AbsoluteFill>
);

/** Lone fighter seen from behind: spiky hair, long coat, headband tails
 *  that whip in the wind. Drawn around (0,0) = feet centre, ~430 tall. */
const Figure: React.FC<{
  x: number;
  y: number;
  s?: number;
  g: number;
  fill?: string;
  sword?: boolean;
  crouch?: boolean;
}> = ({ x, y, s = 1, g, fill = "#05060a", sword, crouch }) => {
  const w1 = Math.sin(g * 0.21) * 18;
  const w2 = Math.sin(g * 0.17 + 1) * 24;
  const coat = Math.sin(g * 0.25) * 10;
  const k = crouch ? 0.72 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * k})`} fill={fill}>
      {/* headband / scarf tails */}
      <path
        d={`M -8 -372 C 60 ${-380 + w1} 120 ${-350 + w2} 190 ${-372 + w2 * 1.4} C 130 ${-340 + w1} 70 -350 -4 -356 Z`}
      />
      <path
        d={`M -6 -364 C 50 ${-330 + w2} 110 ${-310 + w1} 170 ${-318 + w1 * 1.6} C 110 ${-300 + w2} 60 -322 -2 -350 Z`}
      />
      {sword && (
        <rect x={-6} y={-470} width={12} height={300} rx={4} transform="rotate(-28 0 -320)" />
      )}
      {/* spiky hair */}
      <path d="M -46 -350 L -70 -392 L -40 -384 L -44 -432 L -14 -404 L 0 -446 L 16 -404 L 44 -430 L 40 -384 L 72 -394 L 48 -350 Q 0 -320 -46 -350 Z" />
      <circle cx={0} cy={-360} r={40} />
      <rect x={-14} y={-330} width={28} height={30} />
      {/* coat */}
      <path
        d={`M -62 -306 Q 0 -322 62 -306 L 78 -170 L ${96 + coat} -40 Q 0 -20 ${-96 + coat * 0.6} -40 L -78 -170 Z`}
      />
      {/* arms */}
      <path d="M -62 -300 L -88 -160 L -70 -150 L -48 -280 Z" />
      <path d="M 62 -300 L 88 -160 L 70 -150 L 48 -280 Z" />
      {/* legs */}
      <path d="M -40 -60 L -46 0 L -18 0 L -10 -60 Z" />
      <path d="M 40 -60 L 46 0 L 18 0 L 10 -60 Z" />
    </g>
  );
};

const Clouds: React.FC<{ g: number; color: string; y: number; o?: number }> = ({ g, color, y, o = 0.8 }) => (
  <g fill={color} opacity={o}>
    {[0, 1, 2, 3, 4].map((i) => {
      const cx = ((i * 330 + g * (1.2 + i * 0.3)) % 1700) - 300;
      const cy = y + rnd(i) * 260;
      return (
        <g key={i}>
          <ellipse cx={cx} cy={cy} rx={240} ry={44} />
          <ellipse cx={cx + 90} cy={cy - 30} rx={140} ry={46} />
          <ellipse cx={cx - 100} cy={cy - 14} rx={110} ry={34} />
        </g>
      );
    })}
  </g>
);

const MoonScene: React.FC<P & { red?: boolean }> = ({ t, g, red }) => {
  const sky = red ? ["#1a0303", "#4a0707", "#120202"] : ["#03060f", "#0d1b33", "#02040a"];
  const moon = red ? "#ff4a2b" : "#f3f1e4";
  const glow = red ? "#ff2200" : "#bcd7ff";
  const jump = red ? Math.sin(Math.min(1, t / 30) * Math.PI) * 120 : 0;
  return (
    <Svg>
      <defs>
        <linearGradient id="msky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="0.55" stopColor={sky[1]} />
          <stop offset="1" stopColor={sky[2]} />
        </linearGradient>
        <radialGradient id="mglow">
          <stop offset="0.45" stopColor={glow} stopOpacity="0.55" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mface" cx="0.4" cy="0.38">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor={moon} />
          <stop offset="1" stopColor={red ? "#a01400" : "#cfd3cf"} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#msky)" />
      {Array.from({ length: 70 }, (_, i) => (
        <circle
          key={i}
          cx={rnd(i) * W}
          cy={rnd(i + 99) * H * 0.7}
          r={1 + rnd(i + 7) * 2}
          fill="#fff"
          opacity={0.3 + 0.5 * Math.abs(Math.sin(g * 0.08 + i))}
        />
      ))}
      <circle cx={600} cy={820} r={560} fill="url(#mglow)" />
      <circle cx={600} cy={820} r={360} fill="url(#mface)" />
      {[
        [520, 720, 60],
        [700, 900, 44],
        [610, 990, 30],
        [740, 700, 26],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={red ? "#c22a12" : "#d9dcd2"} opacity={0.55} />
      ))}
      <Clouds g={g} color={red ? "#2a0404" : "#0a1428"} y={980} o={0.85} />
      {/* utility pole + wires, like the reference's moon shot */}
      <g fill="#020307">
        <rect x={230} y={1000} width={30} height={920} />
        <rect x={150} y={1040} width={190} height={16} />
        <rect x={170} y={1100} width={150} height={12} />
      </g>
      <g stroke="#020307" strokeWidth={4} fill="none">
        <path d="M -20 1050 Q 120 1090 245 1048 Q 700 1150 1100 1060" />
        <path d="M -20 1110 Q 120 1140 245 1106 Q 700 1210 1100 1120" />
      </g>
      {red ? (
        <Figure x={600} y={1240 - jump} s={0.9} g={g} sword />
      ) : (
        <Figure x={245} y={1040} s={0.62} g={g} />
      )}
      <rect y={1640} width={W} height={280} fill="#010205" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} x={i * 130 - 20} y={1560 - rnd(i + 3) * 160} width={110} height={400} fill="#020309" />
      ))}
    </Svg>
  );
};

const Sunset: React.FC<P> = ({ g }) => (
  <Svg>
    <defs>
      <linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2b0a1c" />
        <stop offset="0.35" stopColor="#a8201a" />
        <stop offset="0.6" stopColor="#ff7a1a" />
        <stop offset="0.72" stopColor="#ffd27a" />
      </linearGradient>
      <radialGradient id="ssun">
        <stop offset="0" stopColor="#fffbe6" />
        <stop offset="0.35" stopColor="#ffe28a" />
        <stop offset="1" stopColor="#ff8a1a" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width={W} height={H} fill="url(#ssky)" />
    <circle cx={540} cy={1260} r={520} fill="url(#ssun)" />
    {Array.from({ length: 10 }, (_, i) => (
      <rect
        key={i}
        x={0}
        y={500 + i * 70}
        width={W}
        height={6 + rnd(i) * 10}
        fill="#ffb05a"
        opacity={0.18}
        transform={`translate(${Math.sin(g * 0.02 + i) * 40} 0)`}
      />
    ))}
    <path d="M 0 1340 Q 300 1290 540 1330 T 1080 1310 L 1080 1920 L 0 1920 Z" fill="#1a0505" />
    {Array.from({ length: 60 }, (_, i) => {
      const x = (i / 60) * W;
      const sway = Math.sin(g * 0.12 + i * 0.7) * 14;
      return (
        <path key={i} d={`M ${x} 1360 Q ${x + sway / 2} 1300 ${x + sway} ${1240 - rnd(i) * 70} L ${x + 10} 1360 Z`} fill="#140303" />
      );
    })}
    <Figure x={600} y={1400} s={1.25} g={g} sword fill="#0b0202" />
    {Array.from({ length: 40 }, (_, i) => {
      const life = (g * (1 + rnd(i) * 2) + rnd(i + 3) * 900) % 900;
      return (
        <circle
          key={i}
          cx={(rnd(i + 11) * W + Math.sin(life * 0.03 + i) * 40) % W}
          cy={1700 - life * 1.6}
          r={2 + rnd(i) * 4}
          fill="#ffcf6b"
          opacity={0.8 * (1 - life / 900)}
        />
      );
    })}
    <rect y={1700} width={W} height={220} fill="#0a0202" />
  </Svg>
);

const Stars: React.FC<P> = ({ g }) => (
  <Svg>
    <defs>
      <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#020414" />
        <stop offset="0.6" stopColor="#0c2a66" />
        <stop offset="1" stopColor="#1f5fb0" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#nsky)" />
    {Array.from({ length: 220 }, (_, i) => (
      <circle
        key={i}
        cx={rnd(i + 500) * W}
        cy={rnd(i + 900) * H * 0.85}
        r={0.6 + rnd(i) * 2.4}
        fill={i % 9 === 0 ? "#9fd0ff" : "#ffffff"}
        opacity={0.25 + 0.75 * Math.abs(Math.sin(g * 0.05 * (1 + rnd(i)) + i))}
      />
    ))}
    {/* milky band */}
    <ellipse cx={540} cy={700} rx={900} ry={140} fill="#8fb8ff" opacity={0.08} transform="rotate(-30 540 700)" />
    <path d="M 0 1500 Q 540 1340 1080 1500 L 1080 1920 L 0 1920 Z" fill="#030611" />
    <Figure x={540} y={1430} s={0.75} g={g} fill="#030611" />
    {Array.from({ length: 34 }, (_, i) => {
      const sp = 2 + rnd(i) * 3;
      const y = ((g * sp + rnd(i + 2) * 2200) % 2200) - 120;
      const x = (rnd(i + 40) * W + Math.sin((g + i * 20) * 0.04) * 80 + g * 0.8) % W;
      return (
        <ellipse
          key={i}
          cx={x}
          cy={y}
          rx={12 + rnd(i) * 8}
          ry={6 + rnd(i) * 4}
          fill="#ffb7d5"
          opacity={0.85}
          transform={`rotate(${(g * 4 + i * 40) % 360} ${x} ${y})`}
        />
      );
    })}
  </Svg>
);

const Rooftops: React.FC<P> = ({ g }) => (
  <Svg>
    <defs>
      <linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#060814" />
        <stop offset="1" stopColor="#1b2a4a" />
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill="url(#rsky)" />
    <circle cx={800} cy={480} r={150} fill="#e8f0ff" />
    <circle cx={800} cy={480} r={240} fill="#9fbfff" opacity={0.12} />
    <Clouds g={g} color="#0b1224" y={520} o={0.7} />
    {[0, 1, 2].map((row) =>
      Array.from({ length: 4 }, (_, i) => {
        const x = i * 320 - 60 + row * 110;
        const y = 1050 + row * 260;
        const c = ["#0c1428", "#070c1a", "#03050c"][row];
        return (
          <g key={`${row}-${i}`} fill={c}>
            <path d={`M ${x - 40} ${y} Q ${x + 130} ${y - 70} ${x + 300} ${y} L ${x + 260} ${y + 30} L ${x} ${y + 30} Z`} />
            <rect x={x + 20} y={y + 30} width={220} height={900} />
            <circle cx={x + 70} cy={y + 110} r={14} fill="#ffb347" opacity={row === 2 ? 0 : 0.55 + 0.3 * Math.sin(g * 0.2 + i)} />
          </g>
        );
      }),
    )}
    <Figure x={430} y={1590} s={0.95} g={g} crouch fill="#010206" />
  </Svg>
);

const EyeScene: React.FC<P & { red?: boolean }> = ({ t, g, red }) => {
  const iris = red ? ["#fff1b0", "#ff2a1a", "#3a0000"] : ["#e9fbff", "#28b6ff", "#04203d"];
  const blink = t < 8 ? 1 - Math.sin((t / 8) * Math.PI) * 0.85 : 1;
  const pulse = 1 + Math.sin(g * 0.3) * 0.04;
  const rot = g * (red ? 2.4 : 0.6);
  return (
    <Svg>
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={red ? "#3b2620" : "#f6d9c2"} />
          <stop offset="1" stopColor={red ? "#1a0f0c" : "#e6b89a"} />
        </linearGradient>
        <radialGradient id="iris">
          <stop offset="0" stopColor={iris[0]} />
          <stop offset="0.45" stopColor={iris[1]} />
          <stop offset="1" stopColor={iris[2]} />
        </radialGradient>
        <radialGradient id="eglow">
          <stop offset="0" stopColor={iris[1]} stopOpacity="0.7" />
          <stop offset="1" stopColor={iris[1]} stopOpacity="0" />
        </radialGradient>
        <clipPath id="eyeclip">
          <path d={`M 90 960 Q 540 ${960 - 330 * blink} 990 930 Q 560 ${960 + 260 * blink} 90 960 Z`} />
        </clipPath>
      </defs>
      <rect width={W} height={H} fill="url(#skin)" />
      {/* hair strands crossing the frame */}
      <g fill={red ? "#0a0a12" : "#1b2440"}>
        <path d="M 0 0 L 420 0 L 180 900 L 120 860 Z" />
        <path d="M 760 0 L 1080 0 L 1080 640 L 980 760 Z" />
        <path d="M 300 0 L 520 0 L 330 620 Z" />
      </g>
      <path d="M 120 690 Q 520 560 960 680 L 950 712 Q 520 610 130 724 Z" fill="#1a1010" />
      <circle cx={560} cy={940} r={420 * pulse} fill="url(#eglow)" />
      <g clipPath="url(#eyeclip)">
        <rect width={W} height={H} fill="#fbf7f2" />
        <rect y={760} width={W} height={120} fill="#c9c3d6" opacity={0.6} />
        <circle cx={560} cy={950} r={215} fill="url(#iris)" />
        <g transform={`rotate(${rot} 560 950)`} stroke={iris[0]} strokeWidth={3} opacity={0.55} fill="none">
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i / 24) * Math.PI * 2;
            return (
              <line key={i} x1={560 + Math.cos(a) * 90} y1={950 + Math.sin(a) * 90} x2={560 + Math.cos(a) * 205} y2={950 + Math.sin(a) * 205} />
            );
          })}
          <circle cx={560} cy={950} r={150} strokeWidth={6} />
        </g>
        {red ? (
          <ellipse cx={560} cy={950} rx={26} ry={120} fill="#0a0000" />
        ) : (
          <circle cx={560} cy={950} r={78} fill="#020a14" />
        )}
        <ellipse cx={490} cy={870} rx={46} ry={34} fill="#fff" />
        <circle cx={640} cy={1030} r={18} fill="#fff" opacity={0.9} />
      </g>
      {/* lash line */}
      <path
        d={`M 70 980 Q 540 ${930 - 360 * blink} 1010 920 L 1040 890 L 990 950 Q 540 ${955 - 320 * blink} 100 970 Z`}
        fill="#0a0606"
      />
      <path d="M 960 925 L 1050 850 L 1000 935 Z M 900 905 L 980 820 L 950 915 Z" fill="#0a0606" />
      {red && <path d={`M 600 1150 Q 590 ${1150 + Math.min(260, t * 6)} 610 ${1170 + Math.min(300, t * 7)}`} stroke="#b00000" strokeWidth={14} strokeLinecap="round" fill="none" />}
    </Svg>
  );
};

const Orb: React.FC<P> = ({ t, g }) => {
  const grow = Math.min(1, t / 10);
  return (
    <Svg>
      <defs>
        <radialGradient id="orb">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#bff3ff" />
          <stop offset="0.7" stopColor="#4fb0ff" />
          <stop offset="1" stopColor="#7a3cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="#03030b" />
      <g opacity={0.7}>
        {Array.from({ length: 70 }, (_, i) => {
          const a = (i / 70) * Math.PI * 2 + rnd(i) * 0.05;
          const r0 = 220 + rnd(i + g * 0.5) * 200;
          return (
            <line
              key={i}
              x1={540 + Math.cos(a) * r0}
              y1={960 + Math.sin(a) * r0}
              x2={540 + Math.cos(a) * 1500}
              y2={960 + Math.sin(a) * 1500}
              stroke="#ffffff"
              strokeWidth={1 + rnd(i * 3 + g) * 5}
              opacity={rnd(i + g) > 0.4 ? 0.7 : 0}
            />
          );
        })}
      </g>
      <circle cx={540} cy={960} r={520 * grow} fill="url(#orb)" opacity={0.45} />
      <circle cx={540} cy={960} r={260 * grow} fill="url(#orb)" />
      <g transform={`rotate(${g * 14} 540 960)`} fill="none" stroke="#e8fbff" strokeWidth={5} opacity={0.85}>
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={540} cy={960} rx={230 * grow} ry={70 * grow} transform={`rotate(${i * 45} 540 960)`} />
        ))}
      </g>
      {Array.from({ length: 5 }, (_, i) => {
        const a = rnd(i + Math.floor(g / 2) * 7) * Math.PI * 2;
        let d = `M ${540 + Math.cos(a) * 240} ${960 + Math.sin(a) * 240}`;
        for (let k = 1; k <= 5; k++) {
          const r = 240 + k * 90;
          const aa = a + (rnd(i * 10 + k + g) - 0.5) * 0.4;
          d += ` L ${540 + Math.cos(aa) * r} ${960 + Math.sin(aa) * r}`;
        }
        return <path key={i} d={d} stroke="#c9b6ff" strokeWidth={5} fill="none" opacity={0.9} />;
      })}
      {/* reaching hand silhouette */}
      <path d="M 300 1920 L 380 1380 Q 400 1290 460 1270 L 520 1240 Q 560 1230 570 1260 L 560 1300 L 640 1290 Q 680 1300 660 1340 L 600 1420 L 640 1920 Z" fill="#000" />
    </Svg>
  );
};

const Storm: React.FC<P> = ({ g }) => {
  const strike = rnd(Math.floor(g / 6)) > 0.55;
  const seed = Math.floor(g / 6) * 13;
  let bolt = `M ${300 + rnd(seed) * 500} 0`;
  let x = 300 + rnd(seed) * 500;
  for (let y = 120; y <= 1300; y += 120) {
    x += (rnd(seed + y) - 0.5) * 220;
    bolt += ` L ${x} ${y}`;
  }
  return (
    <Svg>
      <defs>
        <linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={strike ? "#3a3f66" : "#0b0d18"} />
          <stop offset="1" stopColor={strike ? "#1a1c33" : "#05060c"} />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#tsky)" />
      <Clouds g={g * 2} color="#141729" y={160} o={0.95} />
      <Clouds g={g * 1.4 + 400} color="#0d0f1d" y={420} o={0.9} />
      {strike && (
        <>
          <path d={bolt} stroke="#b7c6ff" strokeWidth={22} fill="none" opacity={0.35} />
          <path d={bolt} stroke="#ffffff" strokeWidth={6} fill="none" />
        </>
      )}
      <g stroke="#9aa6d6" strokeWidth={2} opacity={0.35}>
        {Array.from({ length: 90 }, (_, i) => {
          const rx = (rnd(i) * 1300 + g * 6) % 1300 - 100;
          const ry = (rnd(i + 50) * 2000 + g * 55) % 2000 - 80;
          return <line key={i} x1={rx} y1={ry} x2={rx - 18} y2={ry + 70} />;
        })}
      </g>
      <path d="M 0 1480 L 520 1400 L 700 1460 L 1080 1440 L 1080 1920 L 0 1920 Z" fill="#020206" />
      <Figure x={560} y={1420} s={1.05} g={g * 1.6} sword fill="#020206" />
    </Svg>
  );
};

export const SCENES: Record<SceneId, React.FC<P>> = {
  moon: (p) => <MoonScene {...p} />,
  redMoon: (p) => <MoonScene {...p} red />,
  sunset: Sunset,
  stars: Stars,
  eye: (p) => <EyeScene {...p} />,
  redEye: (p) => <EyeScene {...p} red />,
  orb: Orb,
  storm: Storm,
  rooftops: Rooftops,
};
