# The Goodbye Money: production notes

Made with the `cartoon-3d-short` skill (three.js inside Remotion, 2D cards in a 3D world).

## Where things are
- Script + sources: `docs/grandma-short/SCRIPT.md`
- Voice: `scripts/grandma_voice.py` -> `public/grandma/voice.wav` + `words.json` (edge-tts `en-IN-PrabhatNeural`, +25 %,
  sentence pauses trimmed to 0.32 s / beats 0.6 s; 69.5 s)
- Picture: `src/videos/grandma/` (composition `GrandmaShort`, 1080x1920, 30 fps, 2100 frames), registered in `src/Root.tsx`
  - `story.ts` shots / cameras / DOF / kicks, `cast.ts` who stands where per shot, `world.ts` scene + per-frame posing,
    `build.ts` lane houses (`laneHouse`, `buildLane`) + taxi (`buildTaxi`), `toon.ts` cast outfits, held items, insert cards
  - sandbox entry for previews: `src/sandboxes/grandma/index.tsx`
- Sound: `scripts/grandma_audio/sound.py` (score + SFX + mix) -> `out/grandma/audio/` (mix.wav, stems, cues.md)
- Render helpers (Linux / no GPU): `scripts/cartoon/sheet.mjs` (every Nth frame, low-res), `tile.py` (contact sheet),
  `stills.mjs`, `render.mjs`, `render_chunks.sh` (shot-aligned chunks; delete a chunk to re-render only it)

## Changes from the bridge template
- Golden preset warmed (lit [1.5, .98, .62], shade [.34, .28, .40]) and the golden sun moved behind the lens shoulder
  (az 128, el 24) so faces and facades are lit; shot 14 alone looks into a low sun (az 4, el 6).
- Sight-line rays stop at the look point (x0.97): with +1.5 m they reached Grandma's wall and culled her house.
- Seated passengers: card base 0.42 m, scale 0.93, so shoulders clear the window line.

## Gotchas met here
- `--scale 1.3333` fails at stitching (2559.94 px): pass exactly 4/3.
- edge-tts needs the proxy CA (`certifi.where` patched in the voice script).
- A geometric-gap loop (`gap *= 0.82`) never reaches its end time: always floor the gap.
- Render speed with SwiftShader on 4 CPUs: ~13 s per 2K frame, ~1.5 s per preview frame (dpr 0.4).
