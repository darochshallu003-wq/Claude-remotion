import React from "react";
import { useCurrentFrame } from "remotion";

// Illustrations for the Bhai Dooj short, in the kraft-paper flat-ink style.

const INK = "#231F1C";
export const GOLD = "#E9B42A";
export const ROLI = "#C2272D";
export const MARIGOLD = "#F08A24";

/** Clay diya with a flickering flame. */
export const Diya: React.FC<{ size: number; lit?: number; seed?: number }> = ({ size, lit = 1, seed = 0 }) => {
  const frame = useCurrentFrame() + seed * 17;
  const flick = 1 + Math.sin(frame / 3) * 0.08 + Math.sin(frame / 5.3) * 0.05;
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ overflow: "visible" }}>
      {lit > 0 && <circle cx="100" cy="70" r={70 * flick} fill={`rgba(255,196,90,${0.28 * lit})`} />}
      {lit > 0 && (
        <g transform={`translate(100 108) scale(${lit * flick}) translate(-100 -108)`}>
          <path d="M100 30 C 120 66, 118 96, 100 108 C 82 96, 80 66, 100 30 Z" fill="#FFB43A" stroke={INK} strokeWidth={4} />
          <path d="M100 60 C 108 78, 108 94, 100 102 C 92 94, 92 78, 100 60 Z" fill="#FFF1B8" />
        </g>
      )}
      <path d="M20 112 C 30 170, 170 170, 180 112 C 150 124, 50 124, 20 112 Z" fill="#B5501C" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M150 112 L 192 96 L 178 124 Z" fill="#B5501C" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M44 132 C 80 146, 120 146, 156 132" fill="none" stroke="#F1C27D" strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
};

/** Pooja thali: diya, roli, rice and a couple of laddoos on a steel plate. */
export const Thali: React.FC<{ size: number; seed?: number }> = ({ size, seed = 0 }) => (
  <div style={{ position: "relative", width: size, height: size * 0.62 }}>
    <svg viewBox="0 0 400 248" width={size} height={size * 0.62} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <ellipse cx="200" cy="170" rx="190" ry="66" fill="#8E959C" stroke={INK} strokeWidth={6} />
      <ellipse cx="200" cy="160" rx="190" ry="66" fill="#D7DCE0" stroke={INK} strokeWidth={6} />
      <ellipse cx="200" cy="160" rx="150" ry="48" fill="none" stroke="#AAB2B8" strokeWidth={4} />
      {/* roli katori */}
      <ellipse cx="120" cy="160" rx="38" ry="16" fill={ROLI} stroke={INK} strokeWidth={4} />
      {/* rice katori */}
      <ellipse cx="290" cy="166" rx="38" ry="16" fill="#FBF7EE" stroke={INK} strokeWidth={4} />
      {[272, 286, 300, 312].map((x, i) => (
        <ellipse key={x} cx={x} cy={162 + (i % 2) * 6} rx="4" ry="2.5" fill="#E9E1CC" />
      ))}
      {/* laddoos */}
      <circle cx="200" cy="190" r="22" fill={MARIGOLD} stroke={INK} strokeWidth={4} />
      <circle cx="232" cy="194" r="20" fill={MARIGOLD} stroke={INK} strokeWidth={4} />
      {[194, 206, 226, 238].map((x) => (
        <circle key={x} cx={x} cy={x % 3 ? 186 : 192} r="2.6" fill="#B5501C" />
      ))}
    </svg>
    <div style={{ position: "absolute", left: size * 0.33, top: -size * 0.02 }}>
      <Diya size={size * 0.34} seed={seed} />
    </div>
  </div>
);

/** A single motichoor laddoo. */
export const Laddoo: React.FC<{ size: number }> = ({ size }) => (
  <svg viewBox="0 0 100 100" width={size} height={size}>
    <circle cx="50" cy="52" r="40" fill={MARIGOLD} stroke={INK} strokeWidth={5} />
    {new Array(12).fill(0).map((_, i) => (
      <circle key={i} cx={50 + Math.cos(i * 2.1) * (10 + (i % 3) * 9)} cy={52 + Math.sin(i * 2.1) * (10 + (i % 3) * 9)} r="3.2" fill="#B5501C" />
    ))}
    <ellipse cx="36" cy="36" rx="10" ry="6" fill="#FFD08A" opacity={0.7} />
  </svg>
);

/** Wrapped gift with a ribbon bow. */
export const GiftBox: React.FC<{ size: number; open?: number }> = ({ size, open = 0 }) => (
  <svg viewBox="0 0 200 220" width={size} height={(size * 220) / 200} style={{ overflow: "visible" }}>
    <rect x="22" y="90" width="156" height="120" rx="8" fill="#8E4C9E" stroke={INK} strokeWidth={6} />
    <rect x="88" y="90" width="24" height="120" fill={GOLD} stroke={INK} strokeWidth={4} />
    <g transform={`translate(0 ${-open * 40}) rotate(${-open * 14} 20 90)`}>
      <rect x="12" y="62" width="176" height="34" rx="6" fill="#A865B8" stroke={INK} strokeWidth={6} />
      <rect x="88" y="62" width="24" height="34" fill={GOLD} stroke={INK} strokeWidth={4} />
      <path d="M100 62 C 70 20, 40 40, 60 60 Z M100 62 C 130 20, 160 40, 140 60 Z" fill={GOLD} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    </g>
  </svg>
);

/** Banana-leaf meal: rice, dal, sabzi, puri and kheer — "a meal from the sister's hand". */
export const Bhojan: React.FC<{ size: number; steam?: boolean }> = ({ size, steam = true }) => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 440 300" width={size} height={(size * 300) / 440} style={{ overflow: "visible" }}>
      <path d="M20 170 C 40 60, 400 40, 430 150 C 410 260, 60 280, 20 170 Z" fill="#3E8E4A" stroke={INK} strokeWidth={6} />
      <path d="M30 168 C 150 150, 300 140, 425 150" fill="none" stroke="#2C6B35" strokeWidth={5} />
      {/* rice mound */}
      <path d="M150 190 C 160 140, 250 140, 262 190 Z" fill="#FBF7EE" stroke={INK} strokeWidth={5} />
      {/* dal + sabzi katoris */}
      <ellipse cx="320" cy="140" rx="46" ry="20" fill="#E9B42A" stroke={INK} strokeWidth={5} />
      <ellipse cx="110" cy="130" rx="44" ry="19" fill="#9C5A2A" stroke={INK} strokeWidth={5} />
      {/* kheer */}
      <ellipse cx="330" cy="200" rx="40" ry="17" fill="#F3E3C0" stroke={INK} strokeWidth={5} />
      <circle cx="322" cy="196" r="4" fill="#5E9A3A" />
      <circle cx="338" cy="202" r="4" fill="#B5501C" />
      {/* puris */}
      <circle cx="90" cy="200" r="30" fill="#E3A852" stroke={INK} strokeWidth={5} />
      <circle cx="120" cy="214" r="26" fill="#EDB860" stroke={INK} strokeWidth={5} />
      {steam &&
        [0, 1, 2].map((i) => {
          const t = ((frame + i * 16) % 48) / 48;
          return (
            <path
              key={i}
              d={`M${180 + i * 30} ${140 - t * 80} q 10 -12 0 -24 q -10 -12 0 -24`}
              fill="none"
              stroke="#FBF7EE"
              strokeWidth={6}
              strokeLinecap="round"
              opacity={Math.sin(Math.PI * t) * 0.8}
            />
          );
        })}
    </svg>
  );
};

/** Gentle animated river band for Yamuna. */
export const River: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const frame = useCurrentFrame();
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect width={width} height={height} fill="#3B7FA8" />
      {[0, 1, 2, 3].map((row) => {
        const y = 30 + row * (height / 4);
        const off = ((frame * (1.5 + row * 0.4)) % 120) - 120;
        let d = `M${off} ${y}`;
        for (let x = off; x < width + 120; x += 60) d += ` q 15 -12 30 0 q 15 12 30 0`;
        return <path key={row} d={d} fill="none" stroke="#9CC3DA" strokeWidth={5} strokeLinecap="round" opacity={0.75} />;
      })}
    </svg>
  );
};

/** A wooden door; `thorns` (0..1) grows a thorny branch across it. */
export const ThornDoor: React.FC<{ size: number; thorns?: number }> = ({ size, thorns = 0 }) => (
  <svg viewBox="0 0 300 440" width={size} height={(size * 440) / 300} style={{ overflow: "visible" }}>
    <path d="M20 430 L 20 90 C 20 30, 280 30, 280 90 L 280 430 Z" fill="#3A2E28" stroke={INK} strokeWidth={6} />
    <path d="M44 420 L 44 100 C 44 56, 256 56, 256 100 L 256 420 Z" fill="#6B4A32" stroke={INK} strokeWidth={5} />
    <line x1="150" y1="64" x2="150" y2="420" stroke={INK} strokeWidth={5} />
    {[150, 260, 360].map((y) => (
      <line key={y} x1="44" y1={y} x2="256" y2={y} stroke="#4E3524" strokeWidth={4} />
    ))}
    <circle cx="130" cy="260" r="9" fill={GOLD} stroke={INK} strokeWidth={3} />
    <circle cx="170" cy="260" r="9" fill={GOLD} stroke={INK} strokeWidth={3} />
    {thorns > 0 &&
      [0, 1].map((k) => {
        const y0 = 180 + k * 150;
        const len = 300 * thorns;
        return (
          <g key={k}>
            <path d={`M0 ${y0 + 30} L ${len} ${y0 - 20}`} stroke="#5B4A1E" strokeWidth={10} strokeLinecap="round" />
            {new Array(8).fill(0).map((_, i) => {
              const x = 18 + i * 36;
              if (x > len) return null;
              const y = y0 + 30 - (x / 300) * 50;
              const up = i % 2 ? -1 : 1;
              return <path key={i} d={`M${x - 8} ${y} L ${x} ${y - 26 * up} L ${x + 8} ${y} Z`} fill="#7A6328" stroke={INK} strokeWidth={3} />;
            })}
          </g>
        );
      })}
  </svg>
);

/** Rolled scroll that unrolls (0..1) to show its children. */
export const Scroll: React.FC<{ width: number; open: number; children: React.ReactNode }> = ({ width, open, children }) => {
  const h = 360 * open;
  return (
    <div style={{ position: "relative", width, height: h + 80 }}>
      <div style={{ position: "absolute", left: 20, right: 20, top: 40, height: h, background: "#F4E6C4", borderLeft: `6px solid ${INK}`, borderRight: `6px solid ${INK}`, overflow: "hidden" }}>
        <div style={{ padding: "34px 30px", opacity: open > 0.8 ? (open - 0.8) * 5 : 0 }}>{children}</div>
      </div>
      {[0, h + 40].map((y, i) => (
        <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: 40, borderRadius: 20, background: "linear-gradient(#C9A86A, #8E6A35)", border: `6px solid ${INK}` }} />
      ))}
    </div>
  );
};

/** Marigold-style makhamali garland hanging in a U. */
export const Garland: React.FC<{ width: number; grow?: number; color?: string }> = ({ width, grow = 1, color = "#B23A8C" }) => {
  const n = 15;
  return (
    <svg viewBox="0 0 300 160" width={width} height={(width * 160) / 300} style={{ overflow: "visible" }}>
      {new Array(n).fill(0).map((_, i) => {
        if (i / n > grow) return null;
        const t = i / (n - 1);
        const x = 20 + t * 260;
        const y = 20 + Math.sin(Math.PI * t) * 110;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={14} fill={i % 2 ? color : "#E85FA8"} stroke={INK} strokeWidth={3} />
            <circle cx={x - 4} cy={y - 4} r={4} fill="#FFFFFF" opacity={0.5} />
          </g>
        );
      })}
    </svg>
  );
};

/** Seven colour dots of Nepal's saptarangi tika. */
export const SAPTARANGI = ["#C2272D", "#F08A24", "#E9C46A", "#3E9A4A", "#2F7FA8", "#8E4C9E", "#E85FA8"];
