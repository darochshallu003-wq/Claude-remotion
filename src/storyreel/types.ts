/**
 * Story-reel template: a wordless, shot-by-shot AI short (keyframe ->
 * image-to-video clips) with a handle watermark, optional hook caption,
 * a handwritten note overlay, music that drops out on the reveal, and a
 * "freeze, darken, logo" outro.
 *
 * Everything is plain JSON so a story can also be passed with
 * `npx remotion render StoryReel out.mp4 --props=story.json`.
 */

export type Sfx = {
  /** Path under public/, e.g. "sfx/whoosh.wav". */
  src: string;
  /** Seconds from the start of the shot. */
  at: number;
  volume?: number;
};

export type Note = {
  /** Handwritten text drawn on a sticky note. */
  text: string;
  /** Centre of the note, as a % of frame width / height. */
  x: number;
  y: number;
  /** Degrees. */
  rotate?: number;
  /** Seconds into the shot when the note pops in. */
  appearAt?: number;
  /** Width of the note, % of frame width. */
  size?: number;
};

export type Shot = {
  id: string;
  /** Shown on the placeholder card while the clip doesn't exist yet. */
  label: string;
  /** Path under public/ to a .mp4/.webm/.mov clip or a .png/.jpg still.
   *  Leave out to render a placeholder card (useful as an animatic). */
  src?: string;
  /** Seconds this shot stays on screen. */
  seconds: number;
  /** Seconds to skip at the start of the source clip. */
  trimStart?: number;
  /** Slow push-in: scale at shot start and end, e.g. [1, 1.08]. */
  zoom?: [number, number];
  /** Seconds of crossfade from the previous shot (0 = hard cut). */
  crossfade?: number;
  /** Mute the music for this shot (the "reveal" beat). */
  musicDrop?: boolean;
  note?: Note;
  sfx?: Sfx[];
};

export type StoryReelProps = {
  shots: Shot[];
  /** e.g. "@your.handle" — shown as a watermark and in the outro. */
  handle: string;
  /** Optional caption over the first seconds of the reel. */
  hook?: { text: string; seconds: number };
  /** Path under public/ to the music track. */
  music?: string;
  musicVolume?: number;
  /** Length of the freeze-frame outro, seconds. */
  outroSeconds: number;
  /** Two or more colours the outro logo cycles through. */
  logoColors: string[];
};
