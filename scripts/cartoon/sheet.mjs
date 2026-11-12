// usage: node scripts/cartoon/sheet.mjs <outDir> <every> [from-to] [dpr]
// Renders every Nth frame of GrandmaShort in one browser session (low-res preview: WebGL buffer at dpr x 1080x1920),
// writes <outDir>/f_<frame>.jpg; tile them with ffmpeg afterwards.
import fs from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderFrames, selectComposition } from "@remotion/renderer";
const [outDir, every = "30", range, dpr = "0.4"] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const browserExecutable = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
const chromiumOptions = { gl: "swangle" };
const inputProps = { post: { dpr: Number(dpr) } };
const serveUrl = await bundle({ entryPoint: path.resolve(process.env.ENTRY || "src/sandboxes/grandma/index.tsx"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: process.env.COMP || "GrandmaShort", browserExecutable, chromiumOptions, inputProps, timeoutInMilliseconds: 300000 });
const [a, b] = range ? range.split("-").map(Number) : [0, composition.durationInFrames - 1];
const t0 = Date.now();
await renderFrames({
  composition, serveUrl, inputProps, browserExecutable, chromiumOptions, outputDir: outDir, imageFormat: "jpeg", jpegQuality: 80,
  frameRange: [a, b], everyNthFrame: Number(every), concurrency: Number(process.env.CONC || 3), scale: 0.4, timeoutInMilliseconds: 300000,
  onStart: () => {}, onFrameUpdate: () => {},
  onBrowserLog: (l) => { if (l.type === "error") console.log("[err]", l.text.slice(0, 200)); },
});
console.log("frames done", ((Date.now() - t0) / 1000).toFixed(0) + "s");
