import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// "Give Claude one topic" carousel: warm paper, ink-black display type,
// coral accents, italic serif captions and a mono footer. All fonts are
// bundled under public/ (SIL OFL) so renders never reach the network.

export const DISPLAY = "Archivo Black";
export const UI = "Inter";
export const SERIF = "Instrument Serif";
export const MONO = "IBM Plex Mono";

loadFont({ family: DISPLAY, url: staticFile("carousel/fonts/archivo-black-latin-400-normal.woff2"), weight: "400" });
loadFont({ family: SERIF, url: staticFile("carousel/fonts/instrument-serif-latin-400-italic.woff2"), weight: "400", style: "italic" });
for (const w of [500, 600, 700]) {
  loadFont({ family: UI, url: staticFile(`carousel/fonts/inter-latin-${w}-normal.woff2`), weight: String(w) });
}
loadFont({ family: MONO, url: staticFile("onion/fonts/plexmono-500-latin.woff2"), weight: "500" });

export const K = {
  paper: "#EEE8DE",
  paperLine: "rgba(120,100,80,0.07)",
  card: "#FFFDF9",
  ink: "#1F1B18",
  coral: "#D9634C",
  coralSoft: "#F3D3CA",
  muted: "#9C9187",
  hair: "#DDD4C8",
  term: "#1D1B19",
  green: "#3FA45B",
};

export const FPS = 30;
export const W = 1080;
export const H = 1350;
/** Length of every slide except the call to action. */
export const SLIDE_FRAMES = 180;
export const CTA_FRAMES = 210;
export const TOTAL_SLIDES = 9;
export const HANDLE = "@mythmitao";

/** Muted half-size render of DahiExplainer used as on-screen "footage". */
export const DAHI_SRC = "carousel/dahi-muted.mp4";
/** Its real length, shown on the player timecode. */
export const DAHI_SECONDS = 83.7;
/** Scene start times (seconds) inside the Dahi explainer. */
export const DAHI_AT = {
  hook: 0.5,
  jaman: 6.6,
  acid: 14.2,
  net: 22,
  cold: 29.6,
  hot: 40.4,
  twist: 46.4,
  khandaan: 52.9,
  tips: 62.9,
};
