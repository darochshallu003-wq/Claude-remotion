# StoryReel template

A reusable edit for wordless AI story reels (keyframe → image-to-video
clips): hard cuts with optional crossfades, a handle watermark, an
optional hook caption, a handwritten sticky note for the reveal, music
that drops out on the reveal beat, and a freeze-frame outro with an
animated logo and handle.

Composition id: **`StoryReel`** (1080×1920, 30 fps). Its length is worked
out from the props: the sum of the shot lengths plus `outroSeconds`.

## Files

| File | What it is |
|---|---|
| `src/storyreel/types.ts` | Prop types (every field is documented there) |
| `src/storyreel/StoryReel.tsx` | Timeline, shot layers, music, outro |
| `src/storyreel/overlays.tsx` | Watermark, hook caption, sticky note, outro logo |
| `src/storyreel/stories/niceTryKiddo.ts` | The "Nice Try, Kiddo" story (default props) |
| `public/storyreel/fonts/` | Caveat handwriting font (SIL OFL) |

## Making a reel

1. Generate the clips and put them in `public/storyreel/<story>/`,
   e.g. `01-hug.mp4`. Stills (`.png`/`.jpg`) also work.
2. In the story file, set each shot's `src` to its path under `public/`.
   A shot with no `src` renders as a labelled placeholder card, so the
   reel plays as an animatic before any clip exists.
3. Tune each shot:
   - `seconds`: time on screen
   - `trimStart`: seconds to skip at the start of the 5s AI clip
   - `zoom`: `[from, to]` for a slow push-in
   - `crossfade`: seconds to fade in from the previous shot (0 = hard cut)
   - `musicDrop`: silence the music for this shot (the reveal)
   - `note`: sticky-note text, position (% of the frame), rotation and timing
   - `sfx`: sound effects relative to the start of the shot (`sfx/pop.wav`,
     `sfx/whoosh.wav` and `sfx/chime.wav` are already in `public/sfx`)
4. Set `handle`, `music` (path under `public/`) and, if you want, `hook`.
5. Preview with `npm run studio`, then render with `npm run render:story`.

Clip audio is muted, because the music track and sound effects replace it.

## A new story without code

Every prop is plain JSON, so you can render a different story from a
file:

```bash
npx remotion render StoryReel out/my-story.mp4 --props=my-story.json
```

## In a cloud session

Remotion tries to download its own Chrome, and that host is blocked
here. Use the browser that's already installed:

```bash
--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
```
