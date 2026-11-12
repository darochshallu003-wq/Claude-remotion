// The home stage: inside the fridge (1080 x 1920 world units). Shelves, props, Mummy's hand.
import { INK } from "./cast.mjs";

export const SHELF_Y = 1186; // feet line on the middle shelf
export const TOP_SHELF_Y = 556;

const ribs = Array.from({ length: 19 }, (_, i) => `<path d="M120,${180 + i * 90} L960,${180 + i * 90}" />`).join("");

export function fridgeBack() {
  return `
  <rect x="-200" y="-200" width="1480" height="2320" fill="#E2EFF7"/>
  <g stroke="#D2E4EF" stroke-width="5">${ribs}</g>
  <path d="M-200,-200 L120,140 L120,1780 L-200,2120 Z" fill="#CCE0EC" stroke="${INK}" stroke-width="6"/>
  <path d="M1280,-200 L960,140 L960,1780 L1280,2120 Z" fill="#CCE0EC" stroke="${INK}" stroke-width="6"/>
  <path d="M120,140 L960,140" stroke="${INK}" stroke-width="6"/>
  <rect x="400" y="150" width="280" height="24" rx="12" fill="#FFFFFF" stroke="${INK}" stroke-width="6"/>`;
}

export function topShelf(props = {}) {
  const eggs = [0, 1, 2, 3]
    .map((i) => `<ellipse cx="${205 + i * 62}" cy="${490}" rx="27" ry="34" fill="#F4E6CC" stroke="${INK}" stroke-width="5"/>`)
    .join("");
  return `
  <path d="M120,500 L960,500 L1080,560 L0,560 Z" fill="#BFE3F2" opacity="0.8"/>
  <g id="${props.p}-eggs">
    ${eggs}
    <path d="M160,512 L440,512 L430,556 L170,556 Z" fill="#9C8A70" stroke="${INK}" stroke-width="6"/>
  </g>
  <g id="${props.p}-katori">
    <path d="M520,486 L700,486 Q690,556 610,556 Q530,556 520,486 Z" fill="#B8C3CB" stroke="${INK}" stroke-width="6"/>
    <ellipse cx="610" cy="486" rx="90" ry="16" fill="#FBFBF5" stroke="${INK}" stroke-width="6"/>
    <path d="M548,508 Q560,540 600,546" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.7"/>
  </g>
  <g id="${props.p}-bottle"${props.bottle === false ? ' opacity="0"' : ""}>
    <rect x="782" y="232" width="62" height="40" rx="8" fill="#2E7FC1" stroke="${INK}" stroke-width="6"/>
    <path d="M770,290 Q770,270 792,268 L834,268 Q856,270 856,290 L866,330 L866,540 Q866,556 850,556 L776,556 Q760,556 760,540 L760,330 Z"
      fill="#A8DAF0" stroke="${INK}" stroke-width="6"/>
    <rect x="760" y="380" width="106" height="70" fill="#5BB8E0" stroke="${INK}" stroke-width="5"/>
    <path d="M780,300 L780,530" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.6"/>
  </g>
  <rect x="-40" y="556" width="1160" height="32" fill="#F7FBFD" stroke="${INK}" stroke-width="6"/>`;
}

export function midShelf() {
  return `
  <path d="M120,1140 L960,1140 L1080,1212 L0,1212 Z" fill="#BFE3F2" opacity="0.85"/>`;
}

export function midShelfFront() {
  return `<rect x="-40" y="1206" width="1160" height="36" fill="#F7FBFD" stroke="${INK}" stroke-width="6"/>`;
}

// The crisper drawer below the stage, with a green chilli peeking out: a future cast member.
export function crisper(p) {
  return `
  <rect x="60" y="1300" width="960" height="560" rx="34" fill="#CDEAD8" stroke="${INK}" stroke-width="6"/>
  <g opacity="0.9">
    <ellipse cx="220" cy="1420" rx="90" ry="46" fill="#6DBE5A" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="320" cy="1400" rx="70" ry="40" fill="#5AAE48" stroke="${INK}" stroke-width="5"/>
    <ellipse cx="760" cy="1420" rx="64" ry="54" fill="#F2D640" stroke="${INK}" stroke-width="5"/>
    <g id="${p}-mirchi">
      <path d="M470,1440 Q520,1360 640,1372 Q560,1392 520,1448 Z" fill="#3E9B37" stroke="${INK}" stroke-width="5"/>
      <path d="M640,1372 q14,-10 26,-2" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="586" cy="1386" r="6" fill="${INK}"/><circle cx="604" cy="1384" r="6" fill="${INK}"/>
    </g>
  </g>
  <rect x="60" y="1300" width="960" height="120" rx="34" fill="#E6F5EC" opacity="0.55"/>
  <rect x="420" y="1330" width="240" height="30" rx="15" fill="#A9D3BA" stroke="${INK}" stroke-width="5"/>`;
}

// Mummy's arm reaching in from the right, with red and gold bangles. Its hand sits at about (860, 0)
// in the group's own space; the rig moves the group with x/y.
export function hand(p) {
  return `<g id="${p}-hand" opacity="0">
    <g id="${p}-hand-in">
      <path d="M1400,-70 L960,-56 Q900,-54 872,-36 L872,40 Q900,56 960,54 L1400,70 Z" fill="#C68A5C" stroke="${INK}" stroke-width="7"/>
      <rect x="1010" y="-74" width="22" height="148" rx="8" fill="#D7263D" stroke="${INK}" stroke-width="5"/>
      <rect x="1038" y="-76" width="16" height="152" rx="6" fill="#E2B23A" stroke="${INK}" stroke-width="5"/>
      <rect x="1060" y="-76" width="22" height="152" rx="8" fill="#D7263D" stroke="${INK}" stroke-width="5"/>
      <path d="M880,-40 Q820,-62 770,-50 Q744,-40 770,-30 L830,-28 Q760,-22 740,-6 Q734,8 760,8 L830,6
        Q770,20 758,34 Q756,50 780,46 L840,34 Q800,52 804,62 Q812,74 840,64 L880,44 Z"
        fill="#C68A5C" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M884,-40 Q852,-84 812,-92 Q790,-90 806,-74 L846,-36" fill="#C68A5C" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
    </g>
  </g>`;
}

export function pizzaBox(p) {
  return `<g id="${p}-box" opacity="0">
    <path d="M-150,-70 L150,-70 L150,0 L-150,0 Z" fill="#E7C08A" stroke="${INK}" stroke-width="7"/>
    <g id="${p}-lid">
      <path d="M-158,-86 L158,-86 L150,-70 L-150,-70 Z" fill="#F0CF9C" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
    </g>
    <circle cx="0" cy="-36" r="22" fill="#C8402F" stroke="${INK}" stroke-width="5"/>
    <path d="M-10,-40 Q0,-30 10,-40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
  </g>`;
}

// End card world: the outside of the fridge door, retro mint, with a handle.
export function fridgeDoor() {
  return `
  <rect x="-1200" y="-600" width="3480" height="3120" fill="#8FD3C1"/>
  <rect x="60" y="80" width="960" height="1760" rx="60" fill="#9EDCCB" stroke="${INK}" stroke-width="8"/>
  <path d="M60,1210 L1020,1210" stroke="${INK}" stroke-width="8"/>
  <rect x="900" y="280" width="46" height="420" rx="23" fill="#E9F3F0" stroke="${INK}" stroke-width="7"/>
  <rect x="900" y="1300" width="46" height="300" rx="23" fill="#E9F3F0" stroke="${INK}" stroke-width="7"/>
  <path d="M120,160 Q118,600 130,1150" fill="none" stroke="#C6EDE2" stroke-width="16" stroke-linecap="round"/>`;
}
