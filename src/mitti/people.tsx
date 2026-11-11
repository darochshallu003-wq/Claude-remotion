import React from "react";
import { useCurrentFrame } from "remotion";

// Illustrated Indian characters in the series' flat-ink style. Half-body,
// front-facing, with a few expressions and small idle motion (breathing,
// blinking) so they never look pasted on.

const INK = "#231F1C";

export type Expression = "smell" | "smile" | "disgust" | "grin" | "neutral";
export type HairStyle = "long" | "short" | "elder" | "bun" | "bunGrey";

export type PersonProps = {
  size: number; // rendered width in px
  skin?: string;
  hair?: HairStyle;
  outfit?: string; // kurta colour
  dupatta?: string; // scarf colour, optional
  expression?: Expression;
  bindi?: boolean;
  mustache?: boolean;
  phone?: boolean; // holding a phone at chest height
  glasses?: boolean;
  tilak?: number; // 0..1, red roli tilak with rice grains on the forehead
  seed?: number; // offsets idle motion so two people don't move in sync
  style?: React.CSSProperties;
};

export const Person: React.FC<PersonProps> = ({
  size,
  skin = "#B97A50",
  hair = "short",
  outfit = "#3E6E8E",
  dupatta,
  expression = "neutral",
  bindi = false,
  mustache = false,
  phone = false,
  glasses = false,
  tilak = 0,
  seed = 0,
  style,
}) => {
  const frame = useCurrentFrame() + seed * 37;
  const breathe = Math.sin(frame / 18) * 3;
  const blinkPhase = frame % 110;
  const blink = blinkPhase < 4 && expression !== "smell" && expression !== "disgust";
  const skinShade = shade(skin, -0.18);
  const hairColor = hair === "elder" || hair === "bunGrey" ? "#D9D4CB" : "#1B1513";
  const isBun = hair === "bun" || hair === "bunGrey";

  return (
    <svg viewBox="0 0 400 560" width={size} height={(size * 560) / 400} style={{ overflow: "visible", ...style }}>
      <g transform={`translate(0 ${breathe})`}>
        {/* long hair behind the shoulders */}
        {hair === "long" && (
          <path d="M120 150 C 100 260, 110 330, 130 360 L 270 360 C 290 330, 300 260, 280 150 Z" fill={hairColor} stroke={INK} strokeWidth={6} />
        )}

        {isBun && <circle cx="200" cy="92" r="40" fill={hairColor} stroke={INK} strokeWidth={6} />}

        {/* torso / kurta */}
        <path
          d="M70 560 C 70 450, 90 380, 140 350 C 165 338, 180 334, 200 334 C 220 334, 235 338, 260 350 C 310 380, 330 450, 330 560 Z"
          fill={outfit}
          stroke={INK}
          strokeWidth={6}
        />
        {/* collar placket + buttons */}
        <path d="M200 336 L 200 450" stroke={INK} strokeWidth={5} />
        <path d="M178 338 C 186 360, 214 360, 222 338" fill="none" stroke={INK} strokeWidth={5} />
        {[380, 410, 440].map((y) => (
          <circle key={y} cx={208} cy={y} r={4} fill={INK} />
        ))}
        {/* subtle fold shading */}
        <path d="M110 420 C 120 470, 118 520, 112 560" fill="none" stroke={INK} strokeWidth={3} opacity={0.3} />
        <path d="M290 420 C 280 470, 282 520, 288 560" fill="none" stroke={INK} strokeWidth={3} opacity={0.3} />

        {dupatta && (
          <path d="M140 350 C 170 420, 230 470, 300 540 L 330 520 C 300 440, 270 380, 250 345 Z" fill={dupatta} stroke={INK} strokeWidth={5} opacity={0.95} />
        )}

        {/* hands holding a phone */}
        {phone && (
          <g>
            <rect x="160" y="430" width="80" height="120" rx="12" fill="#1A1A1A" stroke={INK} strokeWidth={5} />
            <rect x="168" y="442" width="64" height="94" rx="6" fill="#4C6C8C" />
            <ellipse cx="160" cy="495" rx="22" ry="26" fill={skin} stroke={INK} strokeWidth={5} />
            <ellipse cx="240" cy="495" rx="22" ry="26" fill={skin} stroke={INK} strokeWidth={5} />
          </g>
        )}

        {/* neck */}
        <path d="M178 290 L 178 340 C 190 348, 210 348, 222 340 L 222 290 Z" fill={skinShade} stroke={INK} strokeWidth={5} />

        {/* ears */}
        <ellipse cx="118" cy="205" rx="16" ry="24" fill={skin} stroke={INK} strokeWidth={5} />
        <ellipse cx="282" cy="205" rx="16" ry="24" fill={skin} stroke={INK} strokeWidth={5} />

        {/* head */}
        <path d="M200 90 C 140 90, 118 140, 120 200 C 122 260, 158 305, 200 305 C 242 305, 278 260, 280 200 C 282 140, 260 90, 200 90 Z" fill={skin} stroke={INK} strokeWidth={6} />

        {/* hair */}
        {hair === "short" && (
          <path d="M120 190 C 112 120, 150 78, 205 80 C 260 82, 292 120, 280 190 C 270 150, 250 128, 225 126 C 200 140, 160 140, 135 150 C 126 160, 122 175, 120 190 Z" fill={hairColor} stroke={INK} strokeWidth={6} />
        )}
        {hair === "long" && (
          <path d="M118 210 C 105 130, 150 80, 205 80 C 262 82, 298 130, 282 210 C 275 160, 255 128, 205 118 C 160 126, 128 160, 118 210 Z" fill={hairColor} stroke={INK} strokeWidth={6} />
        )}
        {isBun && (
          <path d="M118 205 C 108 128, 152 86, 205 86 C 258 88, 296 128, 282 205 C 276 160, 252 132, 205 126 C 158 132, 126 160, 118 205 Z" fill={hairColor} stroke={INK} strokeWidth={6} />
        )}
        {isBun && <path d="M200 88 C 196 104, 196 114, 200 126" stroke={hair === "bunGrey" ? "#A9A39A" : "#3A2E28"} strokeWidth={4} fill="none" />}
        {hair === "long" && <path d="M205 82 C 200 100, 200 110, 204 120" stroke="#3A2E28" strokeWidth={4} fill="none" />}
        {hair === "elder" && (
          <>
            {/* topi */}
            <path d="M138 128 C 150 92, 250 92, 262 128 L 262 140 L 138 140 Z" fill="#F4F1EA" stroke={INK} strokeWidth={6} />
            <path d="M126 180 C 124 150, 132 142, 140 140 M274 180 C 276 150, 268 142, 260 140" stroke={INK} strokeWidth={5} fill="none" />
            {/* beard */}
            <path d="M128 220 C 132 290, 170 330, 200 332 C 230 330, 268 290, 272 220 C 255 250, 235 262, 200 262 C 165 262, 145 250, 128 220 Z" fill={hairColor} stroke={INK} strokeWidth={5} />
          </>
        )}

        {/* eyebrows */}
        {expression === "disgust" ? (
          <>
            <path d="M150 172 L 182 182" stroke={INK} strokeWidth={7} strokeLinecap="round" />
            <path d="M250 172 L 218 182" stroke={INK} strokeWidth={7} strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M148 168 C 160 160, 176 160, 186 166" fill="none" stroke={hair === "elder" ? "#CFC8BA" : INK} strokeWidth={7} strokeLinecap="round" />
            <path d="M214 166 C 224 160, 240 160, 252 168" fill="none" stroke={hair === "elder" ? "#CFC8BA" : INK} strokeWidth={7} strokeLinecap="round" />
          </>
        )}

        {/* eyes */}
        {expression === "smell" || blink ? (
          <>
            <path d="M152 198 C 160 206, 176 206, 184 198" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
            <path d="M216 198 C 224 206, 240 206, 248 198" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          </>
        ) : expression === "disgust" ? (
          <>
            <path d="M152 194 L 180 204 L 152 212" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <path d="M248 194 L 220 204 L 248 212" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <ellipse cx="168" cy="200" rx="10" ry="12" fill={INK} />
            <ellipse cx="232" cy="200" rx="10" ry="12" fill={INK} />
            <circle cx="172" cy="196" r="3.5" fill="#FFFFFF" />
            <circle cx="236" cy="196" r="3.5" fill="#FFFFFF" />
          </>
        )}

        {glasses && (
          <g fill="none" stroke={INK} strokeWidth={5}>
            <circle cx="168" cy="200" r="24" />
            <circle cx="232" cy="200" r="24" />
            <path d="M192 198 C 196 192, 204 192, 208 198 M144 196 L 122 190 M256 196 L 278 190" />
          </g>
        )}
        {bindi && <circle cx="200" cy="168" r="7" fill="#C2272D" />}
        {tilak > 0 && (
          <g opacity={tilak}>
            <rect x="193" y={180 - 40 * tilak} width="14" height={40 * tilak} rx="7" fill="#C2272D" />
            <ellipse cx="197" cy="152" rx="3" ry="5" fill="#FFFFFF" transform="rotate(-20 197 152)" />
            <ellipse cx="204" cy="162" rx="3" ry="5" fill="#FFFFFF" transform="rotate(25 204 162)" />
            <ellipse cx="198" cy="171" rx="3" ry="5" fill="#FFFFFF" transform="rotate(-10 198 171)" />
          </g>
        )}

        {/* nose */}
        <path d="M200 206 C 196 226, 190 236, 196 242 C 200 245, 206 244, 210 240" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />

        {mustache && <path d="M168 258 C 182 246, 196 250, 200 256 C 204 250, 218 246, 232 258 C 218 262, 206 262, 200 258 C 194 262, 182 262, 168 258 Z" fill="#1B1513" />}

        {/* mouth */}
        {expression === "smell" && <path d="M180 266 C 192 276, 208 276, 220 266" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
        {expression === "smile" && <path d="M174 262 C 188 280, 212 280, 226 262" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
        {expression === "neutral" && <path d="M184 270 L 216 270" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
        {expression === "grin" && (
          <path d="M170 258 C 180 296, 220 296, 230 258 Z" fill="#7A2320" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        )}
        {expression === "disgust" && (
          <>
            <path d="M174 272 C 184 262, 192 280, 200 270 C 208 260, 216 280, 226 270" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
            <path d="M192 276 C 192 296, 210 296, 210 278" fill="#D46A7A" stroke={INK} strokeWidth={5} />
          </>
        )}

        {/* cheeks */}
        {(expression === "smell" || expression === "smile" || expression === "grin") && (
          <>
            <ellipse cx="148" cy="236" rx="16" ry="9" fill="#E07A6A" opacity={0.45} />
            <ellipse cx="252" cy="236" rx="16" ry="9" fill="#E07A6A" opacity={0.45} />
          </>
        )}
      </g>
    </svg>
  );
};

/** Lighten (amount > 0) or darken (amount < 0) a #rrggbb colour. */
const shade = (hex: string, amount: number) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const out = c.map((v) => Math.max(0, Math.min(255, Math.round(amount < 0 ? v * (1 + amount) : v + (255 - v) * amount))));
  return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

// The cast, so the same people recur across scenes.
export const Riya: React.FC<Partial<PersonProps> & { size: number }> = (p) => (
  <Person skin="#B97A50" hair="long" outfit="#E3A52A" dupatta="#C2272D" bindi expression="smile" {...p} />
);
export const Aman: React.FC<Partial<PersonProps> & { size: number }> = (p) => (
  <Person skin="#9C6440" hair="short" outfit="#3E6E8E" mustache expression="neutral" seed={3} {...p} />
);
export const AttarWale: React.FC<Partial<PersonProps> & { size: number }> = (p) => (
  <Person skin="#A06A44" hair="elder" outfit="#EDE6D6" expression="smile" seed={5} {...p} />
);
export const Mummy: React.FC<Partial<PersonProps> & { size: number }> = (p) => (
  <Person skin="#A8704A" hair="bun" outfit="#8E2A3C" dupatta="#E3A52A" bindi expression="neutral" seed={7} {...p} />
);
export const Dadi: React.FC<Partial<PersonProps> & { size: number }> = (p) => (
  <Person skin="#9E6A46" hair="bunGrey" outfit="#E8E0CF" dupatta="#B5501C" bindi glasses expression="smile" seed={11} {...p} />
);
