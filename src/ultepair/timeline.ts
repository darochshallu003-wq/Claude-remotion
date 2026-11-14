import { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";
import { Speaker, STORY } from "./script";
import { CLIP_SECONDS } from "./timing";

// Lays the story's lines end to end and fits each scene around its lines,
// so the picture always follows the recorded voices.

export const FPS = 30;
const GAP = 0.35; // seconds between lines

export type LineTiming = { id: string; who: Speaker; text: string; start: number; end: number };
export type SceneTiming = { id: string; from: number; dur: number; lines: LineTiming[] };

export const TIMELINE: SceneTiming[] = (() => {
  let cursor = 0;
  return STORY.map((sc) => {
    let t = sc.lead;
    const lines = sc.lines.map((l, i) => {
      const start = t;
      const len = CLIP_SECONDS[l.id] ?? 3;
      t += len + (i < sc.lines.length - 1 ? GAP : 0);
      return { id: l.id, who: l.who, text: l.text, start: Math.round(start * FPS), end: Math.round((start + len) * FPS) };
    });
    const dur = Math.round((t + sc.tail) * FPS);
    const out = { id: sc.id, from: cursor, dur, lines };
    cursor += dur;
    return out;
  });
})();

export const TOTAL_FRAMES = TIMELINE.reduce((a, s) => a + s.dur, 0);

export const SceneCtx = createContext<SceneTiming>(TIMELINE[0]);

/** Scene-relative timing helpers for the scene being rendered. */
export const useScene = () => {
  const sc = useContext(SceneCtx);
  const f = useCurrentFrame();
  const line = (id: string) => {
    const l = sc.lines.find((x) => x.id === id);
    if (!l) throw new Error(`line ${id} is not in scene ${sc.id}`);
    return l;
  };
  return {
    f,
    dur: sc.dur,
    line,
    /** true while line `id` is being spoken */
    speaking: (id: string) => {
      const l = line(id);
      return f >= l.start && f < l.end;
    },
    /** true from the start of line `id` onwards */
    after: (id: string, offsetFrames = 0) => f >= line(id).start + offsetFrames,
  };
};

/** Global frame of a line's start (+ seconds), for laying audio. */
export const at = (lineId: string, plusSeconds = 0) => {
  for (const sc of TIMELINE) {
    const l = sc.lines.find((x) => x.id === lineId);
    if (l) return sc.from + l.start + Math.round(plusSeconds * FPS);
  }
  throw new Error(`unknown line ${lineId}`);
};

export const sceneAt = (id: string) => {
  const sc = TIMELINE.find((s) => s.id === id);
  if (!sc) throw new Error(`unknown scene ${id}`);
  return sc;
};
