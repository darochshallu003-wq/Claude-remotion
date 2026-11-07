import React from "react";
import { Beat, makeExplainer } from "../explainer/Explainer";
import { ReelContext, TeacherLook, Words } from "./kit";

// Step-by-step whiteboard reel: the explainer engine (transitions, VO,
// music, outro) with the reel's word timings and teacher provided to every
// scene through ReelContext.

export const makeReel = ({
  script,
  scenes,
  project,
  words,
  teacher,
  outroSeconds,
}: {
  script: Beat[];
  scenes: Record<string, React.FC>;
  /** Folder name under src/ and public/; clips live in public/<project>/vo. */
  project: string;
  words: Words;
  teacher: TeacherLook;
  outroSeconds: number;
}) => {
  const explainer = makeExplainer({ script, scenes, voDir: `${project}/vo`, hasVoiceover: true, outroSeconds });
  const Inner = explainer.Component;
  const Component: React.FC = () => (
    <ReelContext.Provider value={{ words, teacher }}>
      <Inner />
    </ReelContext.Provider>
  );
  return { Component, totalFrames: explainer.totalFrames };
};
