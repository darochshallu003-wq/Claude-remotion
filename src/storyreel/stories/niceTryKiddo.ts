import type { StoryReelProps } from "../types";

/**
 * "Nice Try, Kiddo" — grandpa and grandson out-give each other.
 *
 * Drop the generated clips into public/storyreel/nice-try-kiddo/ and set
 * each shot's `src` (e.g. "storyreel/nice-try-kiddo/01-hug.mp4"). Shots
 * without `src` render as placeholder cards, so this plays as an animatic
 * right now. Tune `seconds` / `trimStart` to keep the best part of each
 * 5s AI clip.
 */
export const niceTryKiddo: StoryReelProps = {
  handle: "@your.handle",
  hook: { text: "He thought he could outsmart Grandpa 👴", seconds: 1.8 },
  // music: "storyreel/nice-try-kiddo/music.mp3",
  musicVolume: 0.8,
  outroSeconds: 2.5,
  logoColors: ["#feda75", "#fa7e1e", "#d62976", "#962fbf", "#4f5bd5"],
  shots: [
    {
      id: "hug",
      label: "Goodbye hug — Leo slips cash into Grandpa's cardigan",
      seconds: 2,
      zoom: [1, 1.06],
    },
    {
      id: "shoebox",
      label: "Sneaker nudges the slipper box behind the umbrella stand",
      seconds: 1.5,
      sfx: [{ src: "sfx/whoosh.wav", at: 0.2, volume: 0.4 }],
    },
    {
      id: "thermos",
      label: "Grandpa hands over the thermos — and winks",
      seconds: 2,
    },
    {
      id: "leaving",
      label: "Leo walks to the bus stop, waving back",
      seconds: 1,
    },
    {
      id: "bus",
      label: "On the bus, Leo opens the thermos",
      seconds: 2.5,
      crossfade: 0.13,
    },
    {
      id: "reveal",
      label: "Cash taped under the thermos",
      seconds: 1,
      zoom: [1.02, 1.12],
      musicDrop: true,
      note: { text: "Nice try,\nkiddo ♥", x: 62, y: 58, rotate: -6, appearAt: 0.15, size: 40 },
      sfx: [{ src: "sfx/pop.wav", at: 0.15, volume: 0.6 }],
    },
    {
      id: "reaction",
      label: "Shock melts into a teary smile",
      seconds: 2.5,
    },
    {
      id: "slippers",
      label: "Grandpa dances in the new slippers and waves",
      seconds: 1.5,
      sfx: [{ src: "sfx/chime.wav", at: 0.5, volume: 0.5 }],
    },
  ],
};
