# AnimeEdit — beat-synced anime edit (AMV short)

A 1080x1920, ~29 s vertical edit built in the style of trending anime edits:
hard cuts on the beat, zoom punches, camera shake, white flashes, RGB split,
negative-frame hits, contrast/saturation grade, grain, vignette, and three
caption styles (top white banner, glowing italic reveal, slam words).

```
npm run render:amv          # -> out/anime-edit.mp4
npm run studio              # preview / tweak, composition "AnimeEdit"
python3 scripts/amv_beat.py # regenerate the placeholder beat
```

Everything you'd change lives in `src/amv/edit.ts`.

## Using the real song

The repo ships an **original** 101 BPM placeholder beat (`public/amv/beat.wav`)
because a commercial track can't be bundled. To cut to "Not Like Us" (or any
song you have the rights to use):

1. Put the audio file in `public/amv/`, e.g. `public/amv/song.mp3`.
2. In `edit.ts` set `AUDIO = "amv/song.mp3"`.
3. Set `AUDIO_START_SECONDS` to where the edit should start in the song —
   pick a downbeat two bars (8 beats) before the drop, because the edit's
   drop is at beat 8.
4. "Not Like Us" is ~101 BPM, so `BPM = 101` already matches. For another
   song, set its BPM and every cut moves with it.

## Using your own anime clips

Each entry in `SHOTS` is either a built-in drawn scene (`scene: "moon"`) or
your footage:

```ts
{ clip: "amv/clips/01.mp4", from: 12.4, beats: 1, fx: ["punch", "flash"] },
```

`from` is the start time in seconds inside the clip; the shot lasts `beats`
beats. Clips are muted, scaled to cover 9:16, and get the same effects.

## Effects (`fx`)

| fx | what it does |
| --- | --- |
| `punch` | zoom punch-in on the cut |
| `shake` | decaying camera shake |
| `flash` | white flash on the cut |
| `rgb` | chromatic aberration split |
| `slowzoom` | slow push-in across the shot |
| `spin` | small rotation whip |
| `invert` | 3-frame negative flash |

## Captions

`CAPTIONS` entries take `atBeat`, `beats`, `text` and a `style`:
`banner` (white strip on top), `glow` (letter-by-letter red glow) or
`slam` (big word hitting on the beat). Change `HANDLE` for your watermark.
