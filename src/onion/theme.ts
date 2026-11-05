import { staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

// Fonts are bundled under public/onion/fonts (SIL OFL licences alongside),
// so renders never need to reach Google Fonts.
export const HEAD = "Oswald";
export const MONO = "IBM Plex Mono";
export const DEVA = "Tiro Devanagari Hindi";

loadFont({
  family: HEAD,
  url: staticFile("onion/fonts/oswald-700-latin.woff2"),
  weight: "200 700", // variable font
});
loadFont({
  family: MONO,
  url: staticFile("onion/fonts/plexmono-500-latin.woff2"),
  weight: "500",
});
loadFont({
  family: DEVA,
  url: staticFile("onion/fonts/tiro-400-devanagari.woff2"),
  weight: "400",
});
loadFont({
  family: DEVA,
  url: staticFile("onion/fonts/tiro-400-latin.woff2"),
  weight: "400",
});

export const C = {
  slate: "#151925",
  slate2: "#232A3B",
  paper: "#EFE6D2",
  paperDark: "#E2D6BC",
  ink: "#2A2420",
  cream: "#F3EBDD",
  muted: "#8C91A6",
  purple: "#8E4C9E",
  purpleLight: "#C892D6",
  orange: "#F08A24",
  rust: "#B5501C",
  sulfur: "#E7C548",
  enzyme: "#4F8FD6",
  green: "#5E9A3A",
  red: "#D9412B",
};

export const FPS = 30;
export const W = 1080;
export const H = 1920;
