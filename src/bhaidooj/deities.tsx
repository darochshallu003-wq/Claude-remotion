import React from "react";
import { useCurrentFrame } from "remotion";

// Yamraj and Yamuna for the Bhai Dooj short: hand-built characters in the
// series' flat-ink style, with their own iconography (Yama's tall mukut,
// handlebar moustache, kundal earrings and gada; Yamuna's dusky skin,
// river-blue saree with wave border, flowing hair, nath, jhumkas and lotus)
// and idle motion (breathing, blinking, swaying hair and earrings,
// moustache twitch, rippling aura).

const INK = "#231F1C";
const GOLD = "#E9B42A";
const GOLD_DARK = "#B9831A";
const RUBY = "#C2272D";
const EMERALD = "#2E8B6A";

export type DeityExpression = "stern" | "smile" | "laugh";

type Common = {
  size: number; // rendered width in px (height = 1.5 × size)
  expression?: DeityExpression;
  tilak?: number; // 0..1, roli tilak with rice grains
  aura?: number; // 0..1, glowing halo behind
  seed?: number;
  style?: React.CSSProperties;
};

const shade = (hex: string, amount: number) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const out = c.map((v) => Math.max(0, Math.min(255, Math.round(amount < 0 ? v * (1 + amount) : v + (255 - v) * amount))));
  return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

const Tilak: React.FC<{ amount: number; y: number }> = ({ amount, y }) =>
  amount > 0 ? (
    <g opacity={amount}>
      <rect x="193" y={y + 34 - 34 * amount} width="14" height={34 * amount} rx="7" fill={RUBY} />
      <ellipse cx="197" cy={y + 6} rx="3" ry="5" fill="#FFFFFF" transform={`rotate(-20 197 ${y + 6})`} />
      <ellipse cx="204" cy={y + 16} rx="3" ry="5" fill="#FFFFFF" transform={`rotate(25 204 ${y + 16})`} />
      <ellipse cx="198" cy={y + 26} rx="3" ry="5" fill="#FFFFFF" transform={`rotate(-10 198 ${y + 26})`} />
    </g>
  ) : null;

// ===========================================================================
// YAMRAJ

export const Yamraj: React.FC<
  Common & {
    bless?: number; // 0..1, right hand rises into abhaya mudra
    gada?: boolean;
  }
> = ({ size, expression = "stern", tilak = 0, aura = 0, bless = 0, gada = true, seed = 13, style }) => {
  const frame = useCurrentFrame() + seed * 37;
  const breathe = Math.sin(frame / 18) * 3;
  const blink = (frame + 60) % 120 < 4;
  const twitch = Math.sin(frame / 9) * 3 + (frame % 90 < 8 ? Math.sin(frame) * 4 : 0);
  const swing = Math.sin(frame / 14) * 8;
  const skin = "#3F5A6B";
  const skinDark = shade(skin, -0.25);
  const hair = "#15110F";

  // blessing arm: shoulder → elbow → hand; the hand rises from the hip to
  // beside the shoulder as `bless` goes 0 → 1
  const sx = 100;
  const sy = 400;
  const ex = 62 - 8 * bless;
  const ey = 478 - 4 * bless;
  const hx = 74 - 4 * bless;
  const hy = 566 - 196 * bless;
  const bandA = (Math.atan2(ey - sy, ex - sx) * 180) / Math.PI;
  const armPath = `M${sx} ${sy} L ${ex} ${ey} L ${hx} ${hy + 18}`;

  return (
    <svg viewBox="0 0 400 600" width={size} height={size * 1.5} style={{ overflow: "visible", ...style }}>
      <defs>
        <radialGradient id={`yamaAura${seed}`}>
          <stop offset="55%" stopColor="#F08A24" stopOpacity={0.0} />
          <stop offset="75%" stopColor="#F08A24" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#C2272D" stopOpacity={0} />
        </radialGradient>
      </defs>
      {aura > 0 && (
        <g opacity={aura} transform={`rotate(${frame * 0.6} 200 210)`}>
          <circle cx="200" cy="210" r="190" fill={`url(#yamaAura${seed})`} />
          {new Array(16).fill(0).map((_, i) => (
            <path key={i} d="M200 18 L 212 52 L 188 52 Z" fill="#F08A24" opacity={0.7} transform={`rotate(${i * 22.5} 200 210)`} />
          ))}
        </g>
      )}

      {/* gada (mace), behind the body on the viewer's right */}
      {gada && (
        <g transform={`rotate(${Math.sin(frame / 22) * 2} 335 520)`}>
          <rect x="327" y="250" width="16" height="360" rx="8" fill="#8E6A35" stroke={INK} strokeWidth={5} />
          <rect x="322" y="300" width="26" height="12" rx="4" fill={GOLD} stroke={INK} strokeWidth={4} />
          <circle cx="335" cy="222" r="52" fill={GOLD} stroke={INK} strokeWidth={6} />
          {[-36, -12, 12, 36].map((dx) => (
            <path key={dx} d={`M${335 + dx} 176 C ${335 + dx * 1.3} 210, ${335 + dx * 1.3} 236, ${335 + dx} 268`} fill="none" stroke={GOLD_DARK} strokeWidth={5} />
          ))}
          <circle cx="335" cy="164" r="12" fill={GOLD} stroke={INK} strokeWidth={5} />
          <circle cx="318" cy="204" r="10" fill="#FFF1B8" opacity={0.6} />
        </g>
      )}

      <g transform={`translate(0 ${breathe})`}>
        {/* long hair behind shoulders */}
        <path d="M128 200 C 108 290, 112 360, 128 400 L 272 400 C 288 360, 292 290, 272 200 Z" fill={hair} stroke={INK} strokeWidth={6} />

        {/* torso: bare chest */}
        <path d="M58 600 C 56 470, 80 400, 140 378 C 165 370, 182 366, 200 366 C 218 366, 235 370, 260 378 C 320 400, 344 470, 342 600 Z" fill={skin} stroke={INK} strokeWidth={6} />
        <path d="M150 440 C 170 456, 190 456, 198 446 M202 446 C 210 456, 230 456, 250 440" fill="none" stroke={skinDark} strokeWidth={4} strokeLinecap="round" />
        {/* dhoti waistband */}
        <path d="M60 570 C 140 590, 260 590, 340 570 L 342 600 L 58 600 Z" fill="#7A1F2B" stroke={INK} strokeWidth={5} />
        <path d="M62 572 C 140 592, 260 592, 338 572" fill="none" stroke={GOLD} strokeWidth={6} />
        {/* angavastram sash, shoulder to hip */}
        <path d="M118 386 C 170 450, 240 520, 300 586 L 340 572 C 290 500, 220 430, 160 376 Z" fill={RUBY} stroke={INK} strokeWidth={5} />
        <path d="M138 392 C 186 448, 250 512, 314 582" fill="none" stroke={GOLD} strokeWidth={5} strokeDasharray="2 12" strokeLinecap="round" />
        {/* yagnopavit thread */}
        <path d="M150 384 C 190 470, 230 520, 262 560" fill="none" stroke="#F4F1EA" strokeWidth={4} />
        {/* layered necklaces */}
        <path d="M150 380 C 170 420, 230 420, 250 380" fill="none" stroke={GOLD} strokeWidth={9} />
        <path d="M136 384 C 160 460, 240 460, 264 384" fill="none" stroke={GOLD} strokeWidth={6} />
        <circle cx="200" cy="452" r="13" fill={EMERALD} stroke={INK} strokeWidth={4} />
        <circle cx="200" cy="418" r="8" fill={RUBY} stroke={INK} strokeWidth={3} />

        {/* left arm (viewer right) gripping the gada */}
        <path d="M300 396 C 330 420, 342 450, 336 500" fill="none" stroke={INK} strokeWidth={50} strokeLinecap="round" />
        <path d="M300 396 C 330 420, 342 450, 336 500" fill="none" stroke={skin} strokeWidth={38} strokeLinecap="round" />
        <rect x="312" y="414" width="44" height="14" rx="6" fill={GOLD} stroke={INK} strokeWidth={4} transform="rotate(30 334 421)" />
        {gada && <ellipse cx="335" cy="512" rx="26" ry="30" fill={skin} stroke={INK} strokeWidth={5} />}

        {/* right arm (viewer left): rests, or rises to bless */}
        <path d={armPath} fill="none" stroke={INK} strokeWidth={50} strokeLinecap="round" strokeLinejoin="round" />
        <path d={armPath} fill="none" stroke={skin} strokeWidth={38} strokeLinecap="round" strokeLinejoin="round" />
        <rect x={-22} y={-7} width="44" height="14" rx="6" fill={GOLD} stroke={INK} strokeWidth={4} transform={`translate(${sx + (ex - sx) * 0.55} ${sy + (ey - sy) * 0.55}) rotate(${bandA + 90})`} />
        {bless > 0.3 ? (
          <g transform={`translate(${hx} ${hy}) scale(${0.6 + 0.4 * bless})`} opacity={Math.min(1, (bless - 0.3) * 3)}>
            {/* open palm facing out, fingers up */}
            {[-14, -4, 6, 16].map((dx, i) => (
              <rect key={dx} x={dx - 5} y={-46 + Math.abs(i - 1.5) * 4} width="11" height="40" rx="5.5" fill={skin} stroke={INK} strokeWidth={4} />
            ))}
            <path d="M-24 -10 C -36 -20, -38 -6, -26 6" fill={skin} stroke={INK} strokeWidth={4} />
            <rect x="-24" y="-14" width="48" height="40" rx="14" fill={skin} stroke={INK} strokeWidth={5} />
            <circle cx="0" cy="6" r="6" fill={RUBY} />
          </g>
        ) : (
          <ellipse cx={hx} cy={hy + 20} rx="24" ry="28" fill={skin} stroke={INK} strokeWidth={5} />
        )}

        {/* neck */}
        <path d="M172 310 L 172 372 C 186 382, 214 382, 228 372 L 228 310 Z" fill={skinDark} stroke={INK} strokeWidth={5} />

        {/* ears + kundal */}
        <ellipse cx="116" cy="240" rx="15" ry="24" fill={skin} stroke={INK} strokeWidth={5} />
        <ellipse cx="284" cy="240" rx="15" ry="24" fill={skin} stroke={INK} strokeWidth={5} />
        {[116, 284].map((x, i) => (
          <g key={x} transform={`rotate(${swing * (i ? -1 : 1)} ${x} 262)`}>
            <circle cx={x} cy="290" r="20" fill="none" stroke={GOLD} strokeWidth={9} />
            <circle cx={x} cy="290" r="20" fill="none" stroke={INK} strokeWidth={2} />
            <circle cx={x} cy="312" r="6" fill={RUBY} stroke={INK} strokeWidth={2} />
          </g>
        ))}

        {/* head: broad jaw */}
        <path d="M200 140 C 140 140, 116 190, 118 244 C 120 300, 156 336, 200 336 C 244 336, 280 300, 282 244 C 284 190, 260 140, 200 140 Z" fill={skin} stroke={INK} strokeWidth={6} />
        {/* side hair under the crown */}
        <path d="M118 236 C 112 196, 124 168, 140 160 L 146 200 C 132 206, 124 220, 118 236 Z" fill={hair} stroke={INK} strokeWidth={4} />
        <path d="M282 236 C 288 196, 276 168, 260 160 L 254 200 C 268 206, 276 220, 282 236 Z" fill={hair} stroke={INK} strokeWidth={4} />

        {/* brows */}
        {expression === "stern" ? (
          <>
            <path d="M142 204 L 186 220" stroke={hair} strokeWidth={11} strokeLinecap="round" />
            <path d="M258 204 L 214 220" stroke={hair} strokeWidth={11} strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M142 212 C 156 198, 176 198, 188 208" fill="none" stroke={hair} strokeWidth={11} strokeLinecap="round" />
            <path d="M212 208 C 224 198, 244 198, 258 212" fill="none" stroke={hair} strokeWidth={11} strokeLinecap="round" />
          </>
        )}

        {/* eyes */}
        {blink || expression === "laugh" ? (
          <>
            <path d="M150 238 C 160 230, 176 230, 186 238" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
            <path d="M214 238 C 224 230, 240 230, 250 238" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M146 238 C 158 222, 178 222, 190 238 C 178 250, 158 250, 146 238 Z" fill="#FBF7EE" stroke={INK} strokeWidth={5} />
            <path d="M210 238 C 222 222, 242 222, 254 238 C 242 250, 222 250, 210 238 Z" fill="#FBF7EE" stroke={INK} strokeWidth={5} />
            <circle cx="170" cy="238" r="9" fill={INK} />
            <circle cx="230" cy="238" r="9" fill={INK} />
            <circle cx="173" cy="235" r="3" fill="#FFFFFF" />
            <circle cx="233" cy="235" r="3" fill="#FFFFFF" />
          </>
        )}

        {/* nose */}
        <path d="M200 246 C 194 266, 186 276, 194 282 C 200 286, 208 284, 212 278" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />

        {/* mouth (under the moustache) */}
        {expression === "stern" && <path d="M180 312 L 220 312" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
        {expression === "smile" && <path d="M174 306 C 188 324, 212 324, 226 306" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
        {expression === "laugh" && <path d="M170 302 C 180 338, 220 338, 230 302 Z" fill="#7A2320" stroke={INK} strokeWidth={6} strokeLinejoin="round" />}

        {/* handlebar moustache with curled tips */}
        <g transform={`rotate(${-twitch} 200 290)`}>
          <path d="M200 292 C 186 280, 160 282, 142 292 C 126 300, 112 292, 112 278 C 112 266, 124 262, 130 270 C 124 274, 126 284, 136 282 C 152 276, 176 272, 200 284 Z" fill={hair} stroke={INK} strokeWidth={3} />
        </g>
        <g transform={`rotate(${twitch} 200 290)`}>
          <path d="M200 292 C 214 280, 240 282, 258 292 C 274 300, 288 292, 288 278 C 288 266, 276 262, 270 270 C 276 274, 274 284, 264 282 C 248 276, 224 272, 200 284 Z" fill={hair} stroke={INK} strokeWidth={3} />
        </g>

        {/* cheeks when happy */}
        {expression !== "stern" && (
          <>
            <ellipse cx="146" cy="272" rx="15" ry="8" fill="#E07A6A" opacity={0.35} />
            <ellipse cx="254" cy="272" rx="15" ry="8" fill="#E07A6A" opacity={0.35} />
          </>
        )}

        <Tilak amount={tilak} y={168} />

        {/* tall mukut */}
        <g>
          {/* side flares */}
          <path d="M132 170 C 104 150, 96 120, 108 98 C 118 124, 132 136, 148 142 Z" fill={GOLD} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d="M268 170 C 296 150, 304 120, 292 98 C 282 124, 268 136, 252 142 Z" fill={GOLD} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          {/* tiers */}
          <path d="M136 172 L 150 96 L 250 96 L 264 172 Z" fill={GOLD} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <path d="M156 100 L 168 48 L 232 48 L 244 100 Z" fill={GOLD} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <path d="M174 52 C 180 20, 220 20, 226 52 Z" fill={GOLD} stroke={INK} strokeWidth={6} />
          <path d="M200 26 L 206 6 L 200 -6 L 194 6 Z" fill={GOLD} stroke={INK} strokeWidth={4} />
          {/* bands + jewels */}
          <rect x="130" y="158" width="140" height="22" rx="6" fill={GOLD_DARK} stroke={INK} strokeWidth={5} />
          {[150, 175, 225, 250].map((x) => (
            <circle key={x} cx={x} cy="169" r="5" fill="#FBF7EE" stroke={INK} strokeWidth={2} />
          ))}
          <path d="M200 112 L 216 132 L 200 152 L 184 132 Z" fill={RUBY} stroke={INK} strokeWidth={4} />
          <circle cx="200" cy="169" r="9" fill={EMERALD} stroke={INK} strokeWidth={3} />
          <circle cx="200" cy="74" r="10" fill={EMERALD} stroke={INK} strokeWidth={3} />
          <circle cx="166" cy="134" r="6" fill={RUBY} stroke={INK} strokeWidth={2} />
          <circle cx="234" cy="134" r="6" fill={RUBY} stroke={INK} strokeWidth={2} />
          <path d="M156 104 L 244 104" stroke={GOLD_DARK} strokeWidth={4} />
          <path d="M150 90 L 160 104 M250 90 L 240 104" stroke={INK} strokeWidth={3} />
          <ellipse cx="166" cy="70" rx="5" ry="12" fill="#FFF1B8" opacity={0.6} />
        </g>
      </g>
    </svg>
  );
};

// ===========================================================================
// YAMUNA

export const Yamuna: React.FC<
  Common & {
    holding?: "lotus" | "namaste" | "none";
  }
> = ({ size, expression = "smile", tilak = 0, aura = 0, holding = "lotus", seed = 17, style }) => {
  const frame = useCurrentFrame() + seed * 37;
  const breathe = Math.sin(frame / 18) * 3;
  const blink = frame % 104 < 4;
  const sway = Math.sin(frame / 16);
  const jhumka = Math.sin(frame / 11) * 10;
  const skin = "#8A5A3C";
  const skinDark = shade(skin, -0.2);
  const hair = "#15110F";
  const saree = "#2F7FA8";
  const wave = "#9CC3DA";

  const hairSide = (side: 1 | -1) => {
    // wavy hair strand flowing down one side, tips sway
    const x0 = 200 + side * 80;
    const tip = sway * 10 * side;
    return `M${x0} 190 C ${x0 + side * 40} 260, ${x0 + side * 20} 330, ${x0 + side * 46 + tip} 400 C ${x0 + side * 60 + tip} 450, ${x0 + side * 40 + tip} 500, ${x0 + side * 64 + tip * 1.4} 540 L ${x0 + side * 4 + tip} 540 C ${x0 - side * 10} 480, ${x0 - side * 30} 420, ${x0 - side * 34} 360 Z`;
  };

  return (
    <svg viewBox="0 0 400 600" width={size} height={size * 1.5} style={{ overflow: "visible", ...style }}>
      {/* rippling water aura */}
      {aura > 0 &&
        [0, 1, 2].map((i) => {
          const t = ((frame + i * 30) % 90) / 90;
          return <circle key={i} cx="200" cy="230" r={120 + t * 110} fill="none" stroke={wave} strokeWidth={8 - t * 6} opacity={aura * (1 - t) * 0.9} />;
        })}

      <g transform={`translate(0 ${breathe})`}>
        {/* flowing hair behind */}
        <path d={hairSide(-1)} fill={hair} stroke={INK} strokeWidth={5} />
        <path d={hairSide(1)} fill={hair} stroke={INK} strokeWidth={5} />
        <path d="M128 190 C 124 260, 130 320, 140 372 L 260 372 C 270 320, 276 260, 272 190 Z" fill={hair} />

        {/* saree body */}
        <path d="M64 600 C 64 470, 86 404, 140 380 C 165 370, 182 366, 200 366 C 218 366, 235 370, 260 380 C 314 404, 336 470, 336 600 Z" fill={saree} stroke={INK} strokeWidth={6} />
        {/* blouse neckline */}
        <path d="M160 372 C 172 404, 228 404, 240 372" fill={skinDark} stroke={INK} strokeWidth={4} />
        {/* wave pattern on the body */}
        {[470, 520, 570].map((y, r) => {
          const off = ((frame * 0.8 + r * 20) % 40) - 40;
          let d = `M${80 + off} ${y}`;
          for (let x = 80 + off; x < 330; x += 40) d += ` q 10 -10 20 0 q 10 10 20 0`;
          return <path key={y} d={d} fill="none" stroke={wave} strokeWidth={4} strokeLinecap="round" opacity={0.7} clipPath={`url(#yamunaBody${seed})`} />;
        })}
        <clipPath id={`yamunaBody${seed}`}>
          <path d="M64 600 C 64 470, 86 404, 140 380 C 165 370, 182 366, 200 366 C 218 366, 235 370, 260 380 C 314 404, 336 470, 336 600 Z" />
        </clipPath>
        {/* pallu over the left shoulder with a gold border */}
        <path d="M232 372 C 270 380, 312 420, 330 600 L 250 600 C 250 520, 236 450, 214 396 Z" fill="#3B95C2" stroke={INK} strokeWidth={5} />
        <path d="M236 378 C 272 392, 304 440, 318 600" fill="none" stroke={GOLD} strokeWidth={10} />
        <path d="M236 378 C 272 392, 304 440, 318 600" fill="none" stroke={RUBY} strokeWidth={3} strokeDasharray="4 10" />

        {/* necklace */}
        <path d="M156 376 C 172 420, 228 420, 244 376" fill="none" stroke={GOLD} strokeWidth={8} />
        {[170, 185, 200, 215, 230].map((x, i) => (
          <circle key={x} cx={x} cy={404 + (i === 2 ? 8 : Math.abs(i - 2) * -3)} r={i === 2 ? 9 : 5} fill={i === 2 ? RUBY : GOLD} stroke={INK} strokeWidth={2} />
        ))}

        {/* hands */}
        {holding === "lotus" && (
          <g>
            <path d="M120 420 C 120 480, 150 500, 186 492" fill="none" stroke={INK} strokeWidth={42} strokeLinecap="round" />
            <path d="M120 420 C 120 480, 150 500, 186 492" fill="none" stroke={skin} strokeWidth={30} strokeLinecap="round" />
            <path d="M280 420 C 280 480, 250 500, 214 492" fill="none" stroke={INK} strokeWidth={42} strokeLinecap="round" />
            <path d="M280 420 C 280 480, 250 500, 214 492" fill="none" stroke={skin} strokeWidth={30} strokeLinecap="round" />
            {[130, 270].map((x) => (
              <rect key={x} x={x - 22} y="452" width="44" height="10" rx="5" fill={GOLD} stroke={INK} strokeWidth={3} />
            ))}
            {/* lotus */}
            <g transform={`translate(200 470) rotate(${sway * 3})`}>
              {[-60, -30, 0, 30, 60].map((a) => (
                <path key={a} d="M0 0 C -18 -30, -10 -62, 0 -76 C 10 -62, 18 -30, 0 0 Z" fill={a === 0 ? "#F7A8C8" : "#EE7FAE"} stroke={INK} strokeWidth={4} transform={`rotate(${a})`} />
              ))}
              <circle cx="0" cy="-8" r="9" fill={GOLD} stroke={INK} strokeWidth={3} />
            </g>
            <ellipse cx="186" cy="494" rx="22" ry="18" fill={skin} stroke={INK} strokeWidth={4} />
            <ellipse cx="214" cy="494" rx="22" ry="18" fill={skin} stroke={INK} strokeWidth={4} />
          </g>
        )}
        {holding === "namaste" && (
          <g>
            <path d="M120 420 C 116 490, 160 500, 192 470" fill="none" stroke={INK} strokeWidth={42} strokeLinecap="round" />
            <path d="M120 420 C 116 490, 160 500, 192 470" fill="none" stroke={skin} strokeWidth={30} strokeLinecap="round" />
            <path d="M280 420 C 284 490, 240 500, 208 470" fill="none" stroke={INK} strokeWidth={42} strokeLinecap="round" />
            <path d="M280 420 C 284 490, 240 500, 208 470" fill="none" stroke={skin} strokeWidth={30} strokeLinecap="round" />
            <path d="M200 400 C 184 420, 184 470, 196 486 L 204 486 C 216 470, 216 420, 200 400 Z" fill={skin} stroke={INK} strokeWidth={5} />
            <line x1="200" y1="410" x2="200" y2="484" stroke={INK} strokeWidth={3} />
            {[136, 264].map((x) => (
              <rect key={x} x={x - 22} y="462" width="44" height="10" rx="5" fill={GOLD} stroke={INK} strokeWidth={3} transform={`rotate(${x < 200 ? 40 : -40} ${x} 467)`} />
            ))}
          </g>
        )}

        {/* neck */}
        <path d="M178 300 L 178 370 C 190 378, 210 378, 222 370 L 222 300 Z" fill={skinDark} stroke={INK} strokeWidth={5} />

        {/* ears + swinging jhumkas */}
        <ellipse cx="124" cy="234" rx="14" ry="22" fill={skin} stroke={INK} strokeWidth={5} />
        <ellipse cx="276" cy="234" rx="14" ry="22" fill={skin} stroke={INK} strokeWidth={5} />
        {[124, 276].map((x, i) => (
          <g key={x} transform={`rotate(${jhumka * (i ? -1 : 1)} ${x} 252)`}>
            <circle cx={x} cy="258" r="6" fill={GOLD} stroke={INK} strokeWidth={2} />
            <path d={`M${x - 16} 292 C ${x - 14} 268, ${x + 14} 268, ${x + 16} 292 Z`} fill={GOLD} stroke={INK} strokeWidth={3} />
            {[-10, 0, 10].map((dx) => (
              <circle key={dx} cx={x + dx} cy="298" r="3.5" fill={RUBY} />
            ))}
          </g>
        ))}

        {/* face: soft oval */}
        <path d="M200 132 C 146 132, 124 180, 126 230 C 128 286, 160 318, 200 318 C 240 318, 272 286, 274 230 C 276 180, 254 132, 200 132 Z" fill={skin} stroke={INK} strokeWidth={6} />

        {/* hair top with centre parting */}
        <path d="M124 222 C 112 150, 154 112, 200 112 C 246 112, 288 150, 276 222 C 268 178, 246 152, 200 146 C 154 152, 132 178, 124 222 Z" fill={hair} stroke={INK} strokeWidth={6} />
        <path d="M200 112 C 198 124, 198 136, 200 146" stroke="#3A2E28" strokeWidth={4} fill="none" />
        {/* small tiara */}
        <path d="M150 132 L 160 104 L 178 120 L 200 88 L 222 120 L 240 104 L 250 132 C 220 122, 180 122, 150 132 Z" fill={GOLD} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <circle cx="200" cy="112" r="8" fill="#2C5FA8" stroke={INK} strokeWidth={3} />
        {/* maang tikka */}
        <path d="M200 140 L 200 160" stroke={GOLD} strokeWidth={4} />
        <path d="M200 158 L 208 168 L 200 180 L 192 168 Z" fill={GOLD} stroke={INK} strokeWidth={3} />
        <circle cx="200" cy="169" r="3.5" fill={RUBY} />

        {/* brows */}
        <path d="M150 196 C 160 186, 176 186, 186 192" fill="none" stroke={hair} strokeWidth={6} strokeLinecap="round" />
        <path d="M214 192 C 224 186, 240 186, 250 196" fill="none" stroke={hair} strokeWidth={6} strokeLinecap="round" />

        {/* eyes with kajal */}
        {blink || expression === "laugh" ? (
          <>
            <path d="M152 222 C 160 230, 178 230, 186 222" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
            <path d="M214 222 C 222 230, 240 230, 248 222" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M148 220 C 160 204, 180 204, 192 220 C 180 230, 160 230, 148 220 Z" fill="#FBF7EE" stroke={INK} strokeWidth={5} />
            <path d="M208 220 C 220 204, 240 204, 252 220 C 240 230, 220 230, 208 220 Z" fill="#FBF7EE" stroke={INK} strokeWidth={5} />
            <circle cx="170" cy="218" r="8" fill={INK} />
            <circle cx="230" cy="218" r="8" fill={INK} />
            <circle cx="173" cy="215" r="2.6" fill="#FFFFFF" />
            <circle cx="233" cy="215" r="2.6" fill="#FFFFFF" />
            <path d="M192 220 L 202 214 M208 220 L 198 214" stroke={INK} strokeWidth={0} />
            <path d="M146 220 L 138 214 M254 220 L 262 214" stroke={INK} strokeWidth={4} strokeLinecap="round" />
          </>
        )}

        {/* bindi (sits under a tilak if one is applied) */}
        <circle cx="200" cy="192" r="6" fill={RUBY} />
        <Tilak amount={tilak} y={180} />

        {/* nose + nath */}
        <path d="M200 226 C 196 244, 190 252, 196 258 C 200 261, 206 260, 210 256" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <circle cx="214" cy="268" r="14" fill="none" stroke={GOLD} strokeWidth={4} />
        <circle cx="222" cy="279" r="3.5" fill={RUBY} />
        <path d="M226 260 C 250 250, 262 240, 272 232" fill="none" stroke={GOLD} strokeWidth={2.5} strokeDasharray="3 3" />

        {/* mouth */}
        {expression === "stern" && <path d="M184 286 L 216 286" stroke="#7A2320" strokeWidth={6} strokeLinecap="round" />}
        {expression === "smile" && <path d="M180 280 C 192 296, 208 296, 220 280 C 208 286, 192 286, 180 280 Z" fill="#B23A48" stroke={INK} strokeWidth={4} strokeLinejoin="round" />}
        {expression === "laugh" && <path d="M176 276 C 184 308, 216 308, 224 276 Z" fill="#7A2320" stroke={INK} strokeWidth={5} strokeLinejoin="round" />}

        {/* cheeks */}
        {expression !== "stern" && (
          <>
            <ellipse cx="152" cy="252" rx="14" ry="8" fill="#E07A6A" opacity={0.4} />
            <ellipse cx="248" cy="252" rx="14" ry="8" fill="#E07A6A" opacity={0.4} />
          </>
        )}
      </g>
    </svg>
  );
};
