import React from "react";

// Drawings for the TV-screen explainer, in the series' ink style.

export const INK = "#2A2420";

/** The test picture (sunset over hills) as a colour function on [0,1]². */
export const picture = (u: number, v: number): [number, number, number] => {
  const hill = 0.66 + 0.06 * Math.sin(u * 7.5 + 1.2) + 0.03 * Math.sin(u * 17);
  if (v > hill) {
    const d = (v - hill) / (1 - hill);
    return [Math.round(60 + 30 * d), Math.round(150 - 50 * d), Math.round(70 - 20 * d)];
  }
  const sx = u - 0.66;
  const sy = (v - 0.46) * 1.78;
  if (sx * sx + sy * sy < 0.11 * 0.11) return [255, 214, 77];
  const t = v / hill;
  return [Math.round(43 + (247 - 43) * t), Math.round(76 + (163 - 76) * t), Math.round(155 + (92 - 155) * t)];
};

/** Smooth vector version of the same picture. */
export const Picture: React.FC<{ w: number; h: number; id: string }> = ({ w, h, id }) => {
  let d = `M 0 ${h}`;
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    d += ` L ${u * w} ${(0.66 + 0.06 * Math.sin(u * 7.5 + 1.2) + 0.03 * Math.sin(u * 17)) * h}`;
  }
  d += ` L ${w} ${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(43,76,155)" />
          <stop offset="70%" stopColor="rgb(247,163,92)" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(60,150,70)" />
          <stop offset="100%" stopColor="rgb(90,100,50)" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${id}s)`} />
      <ellipse cx={0.66 * w} cy={0.46 * h} rx={0.11 * w} ry={(0.11 * w) / 1.78 * (h / w) * 1.78 * (w / h)} fill="rgb(255,214,77)" />
      <path d={d} fill={`url(#${id}g)`} />
    </svg>
  );
};

/** TV set: bezel, screen (children), stand. */
export const TvSet: React.FC<{ w: number; children: React.ReactNode; glow?: number }> = ({ w, children, glow = 0 }) => {
  const h = (w * 9) / 16;
  return (
    <div style={{ position: "relative", width: w + 40, height: h + 130 }}>
      {glow > 0 && <div style={{ position: "absolute", inset: -60, borderRadius: 60, background: "radial-gradient(ellipse, rgba(247,163,92,0.35), rgba(0,0,0,0) 70%)", opacity: glow }} />}
      <div style={{ position: "absolute", left: 0, top: 0, width: w + 40, height: h + 40, borderRadius: 22, background: "#1C1A19", border: `6px solid ${INK}`, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 20, top: 20, width: w, height: h, overflow: "hidden", borderRadius: 6, background: "#000" }}>{children}</div>
      <div style={{ position: "absolute", left: (w + 40) / 2 - 20, top: h + 40, width: 40, height: 50, background: "#2E2B29" }} />
      <div style={{ position: "absolute", left: (w + 40) / 2 - 160, top: h + 88, width: 320, height: 22, borderRadius: 11, background: "#2E2B29", border: `4px solid ${INK}` }} />
    </div>
  );
};

/** Grid of pixels, each drawn as R, G, B bars; `blend` 0..1 overlays the full colour. */
export const PixelGrid: React.FC<{ cols: number; rows: number; cell: number; blend: number }> = ({ cols, rows, cell, blend }) => {
  const rects: React.ReactNode[] = [];
  const bw = cell / 3;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const [r, g, b] = picture((i + 0.5) / cols, (j + 0.5) / rows);
      const x = i * cell;
      const y = j * cell;
      rects.push(
        <g key={`${i}-${j}`}>
          <rect x={x + bw * 0 + bw * 0.08} y={y + cell * 0.06} width={bw * 0.84} height={cell * 0.88} rx={bw * 0.2} fill="#FF2A2A" opacity={r / 255} />
          <rect x={x + bw * 1 + bw * 0.08} y={y + cell * 0.06} width={bw * 0.84} height={cell * 0.88} rx={bw * 0.2} fill="#2AFF4A" opacity={g / 255} />
          <rect x={x + bw * 2 + bw * 0.08} y={y + cell * 0.06} width={bw * 0.84} height={cell * 0.88} rx={bw * 0.2} fill="#3A6BFF" opacity={b / 255} />
          {blend > 0 && <rect x={x} y={y} width={cell} height={cell} fill={`rgb(${r},${g},${b})`} opacity={blend} />}
        </g>,
      );
    }
  }
  return (
    <svg width={cols * cell} height={rows * cell} style={{ display: "block", background: "#000" }}>
      {rects}
    </svg>
  );
};

/** Phone outline with a white screen and a water drop magnifying the subpixels. */
export const Phone: React.FC<{ w: number; drop: number }> = ({ w, drop }) => {
  const h = w * 2;
  const r = w * 0.34 * drop;
  const cx = w / 2;
  const cy = h * 0.45;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <pattern id="sub" width={27} height={22} patternUnits="userSpaceOnUse">
          <rect width={27} height={22} fill="#111" />
          <rect x={1} y={2} width={7} height={18} rx={2} fill="#FF2A2A" />
          <rect x={10} y={2} width={7} height={18} rx={2} fill="#2AFF4A" />
          <rect x={19} y={2} width={7} height={18} rx={2} fill="#3A6BFF" />
        </pattern>
        <clipPath id="dropclip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <rect x={4} y={4} width={w - 8} height={h - 8} rx={w * 0.12} fill="#1C1A19" stroke={INK} strokeWidth={8} />
      <rect x={w * 0.06} y={w * 0.12} width={w * 0.88} height={h - w * 0.24} rx={w * 0.06} fill="#F4F4F0" />
      <rect x={w * 0.38} y={w * 0.05} width={w * 0.24} height={w * 0.035} rx={6} fill="#3A3634" />
      {r > 1 && (
        <g>
          <rect x={cx - r} y={cy - r} width={2 * r} height={2 * r} fill="url(#sub)" clipPath="url(#dropclip)" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(160,210,240,0.9)" strokeWidth={8} />
          <ellipse cx={cx - r * 0.35} cy={cy - r * 0.45} rx={r * 0.28} ry={r * 0.14} fill="#FFFFFF" opacity={0.7} transform={`rotate(-30 ${cx - r * 0.35} ${cy - r * 0.45})`} />
        </g>
      )}
    </svg>
  );
};
