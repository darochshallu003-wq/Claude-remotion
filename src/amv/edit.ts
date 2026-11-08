// The whole edit lives here: tempo, audio, the shot list and the captions.
// Everything is counted in BEATS so cuts land on the music. Swap in your own
// song and clips without touching the rendering code.

export const FPS = 30;

/** "Not Like Us"-style tempo. Change it if your audio is a different BPM. */
export const BPM = 101;

/**
 * Audio file under public/. The bundled beat.wav is an original placeholder
 * (scripts/amv_beat.py). To use your own licensed song: drop it into
 * public/amv/ (e.g. song.mp3), point AUDIO at it, and set AUDIO_START_SECONDS
 * to the moment in the song where the edit should begin (usually a downbeat
 * a couple of bars before the drop).
 */
export const AUDIO = "amv/beat.wav";
export const AUDIO_START_SECONDS = 0;

/** Watermark / signature, like the creator tags in the reference. */
export const HANDLE = "@your.edits";

export type SceneId =
  | "moon"
  | "redMoon"
  | "sunset"
  | "stars"
  | "eye"
  | "redEye"
  | "orb"
  | "storm"
  | "rooftops";

export type Fx =
  | "punch" // zoom punch-in on the cut
  | "shake" // camera shake on the hit
  | "flash" // white flash on the cut
  | "rgb" // chromatic aberration split
  | "slowzoom" // slow push-in for the whole shot
  | "spin" // small rotation whip
  | "invert"; // one-frame negative flash

export type Shot = {
  beats: number;
  fx?: Fx[];
} & (
  | { scene: SceneId }
  /** Your own footage: path under public/, start offset in seconds. */
  | { clip: string; from?: number }
);

export type Caption = {
  atBeat: number;
  beats: number;
  text: string;
  /** banner: white strip on top (reference: 'KAKASHI AT 14'),
   *  glow: centered glowing italic (reference: "Summoning Jutsu"),
   *  slam: huge word that slams in on a hit. */
  style: "banner" | "glow" | "slam";
};

// 48 beats ~= 28.5 s, the same length as the reference shorts.
// Intro: slow 2-beat shots. Drop at beat 8: one cut per beat with hits.
// Outro: slow eye shot into the final moon.
export const SHOTS: Shot[] = [
  // --- intro (beats 0-8)
  { scene: "moon", beats: 2, fx: ["slowzoom"] },
  { scene: "stars", beats: 2, fx: ["slowzoom"] },
  { scene: "rooftops", beats: 2, fx: ["slowzoom"] },
  { scene: "eye", beats: 1.5, fx: ["slowzoom"] },
  { scene: "storm", beats: 0.5, fx: ["flash"] },
  // --- drop (beats 8-40)
  { scene: "redMoon", beats: 1, fx: ["flash", "shake", "punch", "rgb"] },
  { scene: "sunset", beats: 1, fx: ["punch"] },
  { scene: "orb", beats: 1, fx: ["punch", "rgb"] },
  { scene: "redEye", beats: 1, fx: ["shake", "flash"] },
  { scene: "storm", beats: 1, fx: ["punch"] },
  { scene: "moon", beats: 1, fx: ["punch", "spin"] },
  { scene: "sunset", beats: 0.5, fx: ["flash"] },
  { scene: "orb", beats: 0.5, fx: ["invert"] },
  { scene: "redMoon", beats: 1, fx: ["shake", "rgb"] },
  { scene: "stars", beats: 2, fx: ["slowzoom"] },
  { scene: "eye", beats: 1, fx: ["punch"] },
  { scene: "rooftops", beats: 1, fx: ["punch", "flash"] },
  { scene: "storm", beats: 1, fx: ["shake", "rgb"] },
  { scene: "sunset", beats: 1, fx: ["punch"] },
  { scene: "redEye", beats: 2, fx: ["slowzoom", "rgb"] },
  // second half of the drop
  { scene: "orb", beats: 1, fx: ["flash", "shake", "punch"] },
  { scene: "redMoon", beats: 1, fx: ["punch"] },
  { scene: "moon", beats: 1, fx: ["punch", "rgb"] },
  { scene: "storm", beats: 1, fx: ["shake"] },
  { scene: "eye", beats: 0.5, fx: ["flash"] },
  { scene: "redEye", beats: 0.5, fx: ["invert"] },
  { scene: "sunset", beats: 1, fx: ["punch", "spin"] },
  { scene: "rooftops", beats: 1, fx: ["punch"] },
  { scene: "stars", beats: 1, fx: ["punch", "rgb"] },
  { scene: "orb", beats: 0.5, fx: ["flash", "shake"] },
  { scene: "redMoon", beats: 0.5, fx: ["flash", "shake"] },
  { scene: "redEye", beats: 0.5, fx: ["flash", "shake"] },
  { scene: "storm", beats: 0.5, fx: ["flash", "shake", "rgb"] },
  { scene: "rooftops", beats: 1, fx: ["punch"] },
  { scene: "redMoon", beats: 1, fx: ["flash", "shake"] },
  { scene: "sunset", beats: 2, fx: ["slowzoom"] },
  { scene: "orb", beats: 2, fx: ["shake", "rgb", "punch"] },
  // --- outro (beats 40-48)
  { scene: "eye", beats: 4, fx: ["flash", "slowzoom"] },
  { scene: "moon", beats: 4, fx: ["flash", "slowzoom"] },
];

export const CAPTIONS: Caption[] = [
  { atBeat: 0.5, beats: 5.5, text: "'THE QUIET ONE'", style: "banner" },
  { atBeat: 6, beats: 2, text: "they never saw it coming", style: "glow" },
  { atBeat: 8, beats: 1, text: "NOT", style: "slam" },
  { atBeat: 9, beats: 1, text: "LIKE", style: "slam" },
  { atBeat: 10, beats: 1, text: "US", style: "slam" },
  { atBeat: 23, beats: 3, text: "a different kind of power", style: "glow" },
  { atBeat: 36, beats: 4, text: "NO MERCY", style: "slam" },
  { atBeat: 40, beats: 7.5, text: "'THE QUIET ONE'", style: "banner" },
];

export const beatFrames = (beats: number) => (beats * 60 * FPS) / BPM;

export const TOTAL_BEATS = SHOTS.reduce((s, x) => s + x.beats, 0);
/** Plus a short fade-out tail after the last beat. */
export const AMV_TOTAL_FRAMES = Math.round(beatFrames(TOTAL_BEATS) + FPS * 0.8);
