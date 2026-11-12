// usage: node scripts/cartoon/render.mjs <out.mp4> [scale] [from-to]   (GrandmaShort, h264 crf 16, SwiftShader WebGL)
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
const [out, scale = String(4 / 3), range] = process.argv.slice(2);
const browserExecutable = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
const chromiumOptions = { gl: "swangle" };
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: "GrandmaShort", browserExecutable, chromiumOptions, timeoutInMilliseconds: 300000 });
const t0 = Date.now();
let last = 0;
await renderMedia({
  composition, serveUrl, browserExecutable, chromiumOptions, codec: "h264", crf: 16, outputLocation: out, scale: Number(scale),
  concurrency: Number(process.env.CONC || 4), timeoutInMilliseconds: 600000, muted: true,
  ...(range ? { frameRange: range.split("-").map(Number) } : {}),
  onProgress: ({ renderedFrames }) => { if (renderedFrames - last >= 50) { last = renderedFrames; console.log(`${renderedFrames} frames, ${((Date.now() - t0) / 1000).toFixed(0)} s`); } },
});
console.log("done", ((Date.now() - t0) / 1000).toFixed(0) + "s");
