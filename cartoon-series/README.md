# Fridge Gang 🥔🍅🫛

A Hinglish cartoon series made in code with [HyperFrames](https://hyperframes.heygen.com): every
episode happens inside one fridge, where the vegetables come alive whenever the door is shut.

| | Episode | Status |
| --- | --- | --- |
| 1 | **Sabzi Kaun Banega?** — it's Sunday; the gang fakes being rotten so Mummy won't cook them. She orders pizza… and a pizza slice moves in. | rendered: `episodes/ep01/renders/fridge-gang-ep01.mp4` |
| 2 | *open* — set up by Ep 1: Pizza, the cool new neighbour (and Mirchi, peeking out of the crisper) | — |

## The cast (`engine/cast.mjs`)

| Character | Who they are | Voice |
| --- | --- | --- |
| **Tamatar** | anxious, ripe, always picked first; panics, then over-commits to every plan | Madhur, pitched up |
| **Aloo** | lazy, unbothered — "main toh har sabzi mein hota hoon"; wins by doing nothing | Madhur, pitched down, slow |
| **Bhindi** | the schemer with a bindi; names every plan "Operation …" | Swara |
| **Mummy** | only her hand (red and gold bangles) and her voice; the gang's weather | Swara |
| **Pizza** | sunglasses, smooth talker, new in Ep 1 | Madhur, deep and slow |
| **Mirchi** | hidden in the crisper drawer in Ep 1: a future episode's cast | — |

Series rules: the gang freezes whenever the light comes on; Mummy is never seen above the wrist;
every episode ends on the fridge door with magnet letters and a tease of the next episode.

## Make the next episode

```bash
cp -r episodes/ep01/episode.mjs episodes/ep02/episode.mjs   # then rewrite its shots
node engine/build.mjs ep02 --lines      # list the lines to voice
python3 engine/voice.py ep02            # Hindi neural voices (edge-tts) + lip-sync tracks
node engine/build.mjs ep02              # writes the HyperFrames project in episodes/ep02/
cd episodes/ep02
npx hyperframes check                   # lint, runtime, layout, readability
npx hyperframes snapshot --review       # look at the beats before rendering
npx hyperframes preview --background    # optional: edit in the Studio
npm run render                          # -> renders/fridge-gang-ep02.mp4
```

An episode is a list of shots. Each shot has a cast with marks, its lines (`say` is voiced in
Devanagari + English, `cap` is the speech bubble; CAPS words take the speaker's colour), sound
effects, and an `act(R, L)` function that animates the rig: `R.hop`, `R.arm`, `R.lean`, `R.mood`
(`normal happy scared sad sleepy sly angry shock cool droop`), `R.look`, `R.shake`, `R.sweat`,
`R.cam` (punch-ins), `R.light` (door open/shut), `R.slam` (title words). Lip-sync, blinks, breathing,
eyes-on-the-speaker, bubble placement and the hand-drawn line boil are automatic. Lines are timed by
the voice, so changing a line never breaks the timing.

Requirements: Node 22+, Python 3 with `edge-tts` and `numpy`, FFmpeg, `npx hyperframes@0.9.39`.
Sound effects are the bundled HyperFrames set (Pixabay licence, see `assets/sfx/CREDITS.md`).
