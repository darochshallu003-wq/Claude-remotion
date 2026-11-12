// Fridge Gang cast: every character is drawn here once and reused by every episode.
// Each character is drawn in local coordinates with its feet at (0, 0), body going up (negative y).
// The rig (engine/rig.js) animates these parts by id: <prefix>-<who>-{sq,br,eyeL,eyeR,pupL,pupR,
// lidL,lidR,browL,browR,mouth,armL,armR,sweat,extra}.

export const INK = "#2A1B14";

// Voices: Microsoft Hindi neural voices (edge-tts), pitched and paced per character.
export const VOICES = {
  tamatar: { voice: "hi-IN-MadhurNeural", pitch: "+38Hz", rate: "+12%" },
  aloo: { voice: "hi-IN-MadhurNeural", pitch: "-22Hz", rate: "-12%" },
  bhindi: { voice: "hi-IN-SwaraNeural", pitch: "+14Hz", rate: "+10%" },
  mummy: { voice: "hi-IN-SwaraNeural", pitch: "-6Hz", rate: "+4%" },
  pizza: { voice: "hi-IN-MadhurNeural", pitch: "-35Hz", rate: "-18%" },
  mirchi: { voice: "hi-IN-SwaraNeural", pitch: "+48Hz", rate: "+4%" },
};

// Mouth shapes, centred on the mouth anchor. [d, filled]
export const MOUTHS = {
  smile: ["M-34,-6 Q0,26 34,-6", false],
  flat: ["M-26,4 L26,4", false],
  frown: ["M-30,14 Q0,-12 30,14", false],
  fear: ["M-34,6 Q-23,-6 -11,6 Q0,18 11,6 Q23,-6 34,6", false],
  smirk: ["M-30,6 Q4,12 32,-10", false],
  grin: ["M-44,-10 Q0,52 44,-10 Q0,2 -44,-10 Z", true],
  o: ["M-15,0 Q-15,-17 0,-17 Q15,-17 15,0 Q15,19 0,19 Q-15,19 -15,0 Z", true],
  open: ["M-32,-10 Q0,-18 32,-10 Q30,36 0,38 Q-30,36 -32,-10 Z", true],
  yell: ["M-36,-16 Q0,-24 36,-16 Q34,46 0,50 Q-34,46 -36,-16 Z", true],
};

// Brow shapes for the left brow; the right brow is the same path mirrored.
export const BROWS = {
  neutral: "M-22,0 Q0,-8 22,0",
  worried: "M-22,6 Q0,-2 22,-14",
  angry: "M-22,-12 Q0,-6 22,6",
  raised: "M-22,-8 Q0,-24 22,-8",
  sly: "M-22,-4 Q0,-10 22,4",
};

// Moods: [brows, resting mouth, lid] — lid "half" covers the top of each eye.
export const MOODS = {
  normal: ["neutral", "smile", "none"],
  happy: ["raised", "grin", "none"],
  scared: ["worried", "fear", "none"],
  sad: ["worried", "frown", "none"],
  sleepy: ["neutral", "flat", "half"],
  sly: ["sly", "smirk", "half"],
  angry: ["angry", "frown", "none"],
  shock: ["raised", "o", "none"],
  cool: ["neutral", "smirk", "none"],
  droop: ["worried", "frown", "half"],
};

const eye = (p, who, side, { x, y, rx, ry, pr, body }) => `
  <g transform="translate(${x},${y})">
    <g id="${p}-${who}-eye${side}">
      <ellipse rx="${rx}" ry="${ry}" fill="#fff" stroke="${INK}" stroke-width="6"/>
      <g id="${p}-${who}-pup${side}">
        <circle cx="0" cy="3" r="${pr}" fill="${INK}"/>
        <circle cx="${-pr * 0.35}" cy="${3 - pr * 0.4}" r="${pr * 0.32}" fill="#fff"/>
      </g>
      <path id="${p}-${who}-lid${side}" d="M0,0" fill="${body}" stroke="${INK}" stroke-width="6"
        data-rx="${rx}" data-ry="${ry}"/>
    </g>
  </g>
  <g transform="translate(${x},${y - ry - 16}) scale(${side === "L" ? 1 : -1},1)">
    <path id="${p}-${who}-brow${side}" d="${BROWS.neutral}" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
  </g>`;

const arm = (p, who, side, { x, y, len, bend, hand }) => {
  const s = side === "L" ? -1 : 1;
  return `
  <g id="${p}-${who}-arm${side}" data-sx="${x * s}" data-sy="${y}">
    <path d="M${x * s},${y} Q${(x + bend) * s},${y + len * 0.55} ${(x + bend * 0.4) * s},${y + len}"
      fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
    <circle cx="${(x + bend * 0.4) * s}" cy="${y + len + 6}" r="${hand}" fill="#fff" stroke="${INK}" stroke-width="6"/>
  </g>`;
};

const feet = (dx, c = INK) => `
  <ellipse cx="${-dx}" cy="-10" rx="34" ry="15" fill="${c}"/>
  <ellipse cx="${dx}" cy="-10" rx="34" ry="15" fill="${c}"/>`;

const face = (p, who, f) => `</g><g id="${p}-${who}-face">
  ${eye(p, who, "L", { ...f.eye, x: -f.eye.dx, body: f.body })}
  ${eye(p, who, "R", { ...f.eye, x: f.eye.dx, body: f.body })}
  <g transform="translate(${f.mouth.x},${f.mouth.y}) scale(${f.mouth.s})">
    <path id="${p}-${who}-mouth" d="${MOUTHS.smile[0]}" fill="none" stroke="${INK}" stroke-width="${7 / f.mouth.s}"
      stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <path id="${p}-${who}-sweat" d="M0,-26 Q16,0 0,10 Q-16,0 0,-26 Z" fill="#8FD0F2" stroke="${INK}" stroke-width="5"
    transform="translate(${f.sweat[0]},${f.sweat[1]})" opacity="0"/>`;

// Each character: draw(p) returns the inner parts; meta gives the rig what it needs.
export const CAST = {
  tamatar: {
    name: "Tamatar",
    height: 250,
    headTop: -250,
    body: "#E8402E",
    draw: (p) => `
      ${feet(46)}
      ${arm(p, "tamatar", "L", { x: 116, y: -118, len: 92, bend: 26, hand: 16 })}
      ${arm(p, "tamatar", "R", { x: 116, y: -118, len: 92, bend: 26, hand: 16 })}
      <ellipse cx="0" cy="-122" rx="128" ry="114" fill="#E8402E" stroke="${INK}" stroke-width="7"/>
      <path d="M70,-30 Q118,-80 112,-150 Q128,-60 60,-18 Z" fill="#C22D1F"/>
      <ellipse cx="-62" cy="-188" rx="24" ry="14" fill="#fff" opacity="0.6" transform="rotate(-25 -62 -188)"/>
      <path d="M0,-236 L-22,-262 L-6,-246 L-30,-232 L-2,-232 L-12,-206 L6,-226 L28,-210 L18,-234 L44,-244 L14,-246 L20,-270 Z"
        fill="#3FA34D" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M2,-250 Q-2,-276 12,-290" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
      <g id="${p}-tamatar-extra" opacity="0">
        <ellipse cx="74" cy="-104" rx="22" ry="17" fill="#4A2A1E" stroke="${INK}" stroke-width="4"/>
        <path d="M60,-110 Q74,-100 88,-108" fill="none" stroke="#2A140C" stroke-width="3"/>
        <path d="M-96,-60 Q-80,-70 -64,-62 M-100,-44 Q-84,-54 -68,-46" fill="none" stroke="#9C2216" stroke-width="5" stroke-linecap="round"/>
      </g>
      ${face(p, "tamatar", {
        body: "#E8402E",
        eye: { dx: 42, y: -146, rx: 30, ry: 36, pr: 13 },
        mouth: { x: 0, y: -82, s: 1 },
        sweat: [96, -210],
      })}`,
  },
  aloo: {
    name: "Aloo",
    height: 300,
    headTop: -300,
    body: "#C99A5B",
    draw: (p) => `
      ${feet(70, "#5A3A22")}
      ${arm(p, "aloo", "L", { x: 170, y: -140, len: 70, bend: 22, hand: 18 })}
      ${arm(p, "aloo", "R", { x: 170, y: -140, len: 70, bend: 22, hand: 18 })}
      <path d="M-150,-60 Q-196,-150 -150,-232 Q-100,-300 -10,-292 Q70,-304 140,-252 Q196,-196 176,-110
        Q170,-30 90,-14 Q0,0 -80,-12 Q-130,-24 -150,-60 Z" fill="#C99A5B" stroke="${INK}" stroke-width="7"/>
      <path d="M120,-40 Q176,-90 168,-170 Q190,-80 100,-24 Z" fill="#A87A40"/>
      <circle cx="-110" cy="-120" r="7" fill="#8A6334"/><circle cx="120" cy="-210" r="6" fill="#8A6334"/>
      <circle cx="96" cy="-70" r="8" fill="#8A6334"/><circle cx="-60" cy="-250" r="6" fill="#8A6334"/>
      <g id="${p}-aloo-extra">
        <g class="sprout" data-i="0"><path d="M-40,-286 Q-56,-330 -36,-352" fill="none" stroke="#5DAA3C" stroke-width="9" stroke-linecap="round"/>
          <ellipse cx="-30" cy="-358" rx="16" ry="10" fill="#7CC456" stroke="${INK}" stroke-width="4"/></g>
        <g class="sprout" data-i="1"><path d="M20,-292 Q24,-344 6,-372" fill="none" stroke="#5DAA3C" stroke-width="9" stroke-linecap="round"/>
          <ellipse cx="2" cy="-378" rx="18" ry="11" fill="#7CC456" stroke="${INK}" stroke-width="4"/></g>
        <g class="sprout" data-i="2"><path d="M80,-276 Q110,-312 98,-338" fill="none" stroke="#5DAA3C" stroke-width="9" stroke-linecap="round"/>
          <ellipse cx="100" cy="-344" rx="14" ry="9" fill="#7CC456" stroke="${INK}" stroke-width="4"/></g>
      </g>
      ${face(p, "aloo", {
        body: "#C99A5B",
        eye: { dx: 52, y: -186, rx: 28, ry: 28, pr: 12 },
        mouth: { x: 0, y: -112, s: 1.2 },
        sweat: [140, -250],
      })}`,
  },
  bhindi: {
    name: "Bhindi",
    height: 560,
    headTop: -560,
    body: "#5DAA3C",
    draw: (p) => `
      ${feet(30, "#2F5E1E")}
      ${arm(p, "bhindi", "L", { x: 56, y: -262, len: 112, bend: 30, hand: 15 })}
      ${arm(p, "bhindi", "R", { x: 56, y: -262, len: 112, bend: 30, hand: 15 })}
      <path d="M-62,-40 Q-74,-280 -40,-470 Q-20,-536 6,-546 Q36,-530 46,-470 Q76,-280 62,-40 Q60,-12 0,-10 Q-60,-12 -62,-40 Z"
        fill="#5DAA3C" stroke="${INK}" stroke-width="7"/>
      <path d="M-22,-60 Q-34,-300 -14,-500 M22,-60 Q34,-300 16,-500" fill="none" stroke="#3E7F27" stroke-width="5" stroke-linecap="round"/>
      <path d="M-16,-536 Q4,-560 24,-536 L18,-520 Q4,-528 -10,-520 Z" fill="#3E7F27" stroke="${INK}" stroke-width="5"/>
      <path d="M4,-552 Q14,-590 44,-600" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="0" cy="-468" r="9" fill="#D7263D" stroke="${INK}" stroke-width="3"/>
      <path d="M-58,-408 l-12,-8 M-56,-400 l-14,0 M58,-408 l12,-8 M56,-400 l14,0" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
      ${face(p, "bhindi", {
        body: "#5DAA3C",
        eye: { dx: 26, y: -404, rx: 21, ry: 27, pr: 10 },
        mouth: { x: 0, y: -334, s: 0.8 },
        sweat: [58, -470],
      })}`,
  },
  mirchi: {
    name: "Mirchi",
    height: 250,
    headTop: -300,
    body: "#2FA84F",
    draw: (p) => `
      ${feet(24, "#1F6B34")}
      ${arm(p, "mirchi", "L", { x: 44, y: -128, len: 62, bend: 18, hand: 12 })}
      ${arm(p, "mirchi", "R", { x: 44, y: -128, len: 62, bend: 18, hand: 12 })}
      <path d="M-46,-214 Q-58,-120 -40,-58 Q-26,-14 4,-12 Q40,-10 56,-36 Q70,-56 84,-44 Q92,-34 82,-22
        Q60,8 8,10 Q-56,10 -64,-60 Q-74,-140 -50,-226 Z" fill="#2FA84F" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M-50,-226 Q-40,-250 0,-252 Q40,-250 50,-224 Q60,-130 44,-60 Q36,-30 4,-12" fill="#2FA84F" stroke="${INK}" stroke-width="7"/>
      <path d="M30,-200 Q44,-130 30,-70" fill="none" stroke="#7FD38F" stroke-width="10" stroke-linecap="round" opacity="0.7"/>
      <path d="M-44,-236 Q0,-268 46,-236 Q30,-222 0,-224 Q-30,-222 -44,-236 Z" fill="#1F6B34" stroke="${INK}" stroke-width="5"/>
      <path d="M2,-256 Q0,-290 26,-304" fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round"/>
      <path d="M26,-304 q14,-6 22,4 q-12,8 -22,-4 Z" fill="#7CC456" stroke="${INK}" stroke-width="4"/>
      <ellipse cx="-34" cy="-128" rx="13" ry="8" fill="#F58FA0" opacity="0.85"/>
      <ellipse cx="34" cy="-128" rx="13" ry="8" fill="#F58FA0" opacity="0.85"/>
      ${face(p, "mirchi", {
        body: "#2FA84F",
        eye: { dx: 22, y: -168, rx: 19, ry: 24, pr: 10 },
        mouth: { x: 0, y: -118, s: 0.62 },
        sweat: [48, -220],
      })}`,
  },
  pizza: {
    name: "Pizza",
    height: 300,
    headTop: -320,
    body: "#F6C445",
    draw: (p) => `
      ${arm(p, "pizza", "L", { x: 92, y: -190, len: 80, bend: 24, hand: 15 })}
      ${arm(p, "pizza", "R", { x: 92, y: -190, len: 80, bend: 24, hand: 15 })}
      <path d="M-140,-290 Q0,-310 140,-290 L8,-8 Q0,4 -8,-8 Z" fill="#F6C445" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M-156,-282 Q-160,-330 -110,-332 Q0,-352 110,-332 Q160,-330 156,-282 Q0,-304 -156,-282 Z"
        fill="#D9984A" stroke="${INK}" stroke-width="7"/>
      <circle cx="-62" cy="-232" r="20" fill="#C8402F" stroke="${INK}" stroke-width="4"/>
      <circle cx="52" cy="-150" r="18" fill="#C8402F" stroke="${INK}" stroke-width="4"/>
      <circle cx="-8" cy="-82" r="13" fill="#C8402F" stroke="${INK}" stroke-width="4"/>
      <path d="M40,-260 q8,30 0,52" fill="none" stroke="#F9DC86" stroke-width="10" stroke-linecap="round"/>
      ${face(p, "pizza", {
        body: "#F6C445",
        eye: { dx: 34, y: -232, rx: 22, ry: 22, pr: 9 },
        mouth: { x: 0, y: -168, s: 0.85 },
        sweat: [70, -280],
      })}
      <g id="${p}-pizza-extra">
        <path d="M-78,-252 L-8,-252 Q-6,-212 -40,-210 Q-74,-212 -78,-252 Z M8,-252 L78,-252 Q74,-212 40,-210 Q6,-212 8,-252 Z"
          fill="${INK}"/>
        <path d="M-8,-246 L8,-246" stroke="${INK}" stroke-width="7"/>
        <path d="M-64,-244 l18,0" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
      </g>`,
  },
};

export function drawChar(p, who) {
  const c = CAST[who];
  return `<g id="${p}-${who}" class="ch" data-who="${who}">
    <g id="${p}-${who}-sz"><g id="${p}-${who}-pose"><g id="${p}-${who}-sq"><g id="${p}-${who}-br"><g id="${p}-${who}-body">${c.draw(p)}</g></g></g></g></g>
  </g>`;
}
