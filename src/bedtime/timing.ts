import { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";

export const FPS = 30;

export type Who = "n" | "p" | "j" | "c";
export type Line = { who: Who; text: string; start: number; end: number };

// ---------------------------------------------------------------------------
// Which character is speaking right now (so their mouth can move)

export const BeatCtx = createContext<{ lines: Line[]; lead: number }>({ lines: [], lead: 0 });

/** Current line for this scene, from the scene's own frame. */
const useLine = () => {
  const frame = useCurrentFrame();
  const { lines, lead } = useContext(BeatCtx);
  const sec = (frame - lead) / FPS;
  return { sec, line: lines.find((l) => sec >= l.start && sec <= l.end) };
};

/** Mouth openness (0..1) for `who`, moving only while they speak. */
export const useTalk = (who: Who) => {
  const frame = useCurrentFrame();
  const { line } = useLine();
  if (!line || line.who !== who) return 0;
  return Math.max(0, Math.sin(frame * 0.85)) * (0.6 + 0.4 * Math.sin(frame * 0.31));
};

/** Seconds into the voice clip, for timing actions to the narration. */
export const useStoryTime = () => useLine().sec;

/** Start time (s) of line `i` of this scene. */
export const useLineStart = (i: number) => useContext(BeatCtx).lines[i]?.start ?? 0;

