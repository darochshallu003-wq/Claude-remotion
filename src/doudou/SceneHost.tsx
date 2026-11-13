import { useLayoutEffect, useMemo, useRef } from "react";
import { AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { gsap } from "gsap";
import type { DoudouScene } from "./types";

/**
 * Mounts one scene's markup and drives its GSAP timeline from Remotion's clock.
 * The timeline is built paused and seeked to the current frame on every render, so each frame
 * is a pure function of time and any frame can be rendered alone (parallel rendering is safe).
 */
export const SceneHost: React.FC<{ scene: DoudouScene }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const html = useMemo(() => scene.html.split("__PAPER__").join(staticFile("doudou/paper.png")), [scene]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true });
      scene.build(t, gsap);
      tl.current = t;
    }, ref.current ?? undefined);
    return () => {
      tl.current = null;
      ctx.revert();
    };
  }, [scene]);

  useLayoutEffect(() => {
    tl.current?.seek(frame / fps, true);
  }, [frame, fps, scene]);

  return (
    <AbsoluteFill>
      <div ref={ref} style={{ position: "absolute", inset: 0 }} dangerouslySetInnerHTML={{ __html: html }} />
    </AbsoluteFill>
  );
};
