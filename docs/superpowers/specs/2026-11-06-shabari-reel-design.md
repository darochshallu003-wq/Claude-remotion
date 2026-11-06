# Shabari Reel — design

## Intent
A ~38 s vertical (1080×1920, 30 fps) Instagram reel in the flat Indian-cartoon
storybook style of the Urmila/Lakshman reference: an emotional "long wait, one
tender payoff" story. Story: Shabari spends her whole life waiting for Ram,
sweeping his path and tasting berries so only the sweet ones are left; Ram
finally comes and eats her half-tasted berries.

## Goals / non-goals / anti-goals
- Goal: feel close to the reference — warm palette, gentle motion, one fixed
  caption, quiet emotional music, typed end card.
- Non-goal: in-shot character animation (blinks, hand moves). Not in budget.
- Anti-goals: copying the reference shot-for-shot or its branding; copyrighted
  music; characters that change look between shots.

## Approaches
- **A. AI stills + motion in Remotion (chosen).** User generates ~7 images from
  the prompts below in a free tool; Remotion adds zooms, light, particles,
  crossfades, caption, end card, music. Free; no in-shot character motion.
- B. A + image-to-video on 2–3 key shots (Higgsfield Kling 3.0 / Seedance).
  Closest to reference; needs credits (account has 0). Can be added later
  by swapping individual stills for clips.
- C. All art drawn in code like the Onion/Haldi/Tamra explainers. Free but far
  simpler figures than the reference — works against the point.

## Decided
- Story: Shabari. Caption (fixed, top, white rounded box like the reference):
  **"Shabari maa waited her whole life for Shri Ram 🙏❤️"**
- Music: original, synthesized in Python (tanpura drone + slow bansuri-like
  melody), no vocals, soft. Lives in `scripts/`, output in `public/shabari/`.
- No watermark/handle unless the user supplies one later.

## Shot list
| # | Time | File | Motion in Remotion |
|---|------|------|--------------------|
| 1 | 0–5 s | `01-sweeping.png` | slow push-in, drifting petals |
| 2 | 5–10 s | `02-tasting.png` | slow push-in toward hand/face |
| 3 | 10–14 s | `03-waiting.png` | slow pull-out, falling leaves, dusk tint |
| 4 | 14–19 s | `04-arrival.png` | slow push-in, sun-ray shimmer |
| 5 | 19–24 s | `05-tears.png` | very slow push-in, soft glow |
| 6 | 24–29 s | `06-offering.png` | gentle pan |
| 7 | 29–33 s | `07-ram-smile.png` | slow push-in, warm glow |
| 8 | 33–38 s | (code) | black end card, "SHABARI KE BER" typed out |

All images go in `public/shabari/`, 9:16, ideally ≥1080×1920.

## Image prompts

### Shared style (paste at the start of every prompt)
> Flat 2D Indian storybook cartoon illustration, bold clean dark-brown outlines,
> soft cel shading, warm palette of saffron, ochre, terracotta, leaf green and
> cream, rosy cheeks, detailed but simple painterly backgrounds, gentle
> devotional mood, vertical 9:16 composition, leave the top 15% of the frame
> as calm background (sky or foliage) for a caption. No text, no letters, no
> watermark, no logo.

### Character sheets (generate these first, then attach them as references)
**Shabari:** an elderly Indian forest-dwelling woman around 75, thin and small,
warm brown skin, gentle wrinkled face, kind deep-set eyes, silver-white hair in
a loose low bun, a simple faded saffron cotton saree draped modestly over both
shoulders, a wooden bead mala, barefoot. Full-body front view and a face
close-up, plain cream background.

**Ram (in forest exile):** a young Indian prince, serene blue skin, long dark
hair tied in a top-knot, no crown, gentle half-smile, saffron dhoti and
shoulder cloth, rudraksha mala, a wooden bow over one shoulder and a quiver of
arrows on his back, barefoot. Full-body front view and a face close-up, plain
cream background.

**Lakshman:** Ram's younger brother, fair skin, similar forest-exile attire in
light yellow, hair in a top-knot, bow in hand, alert loyal expression.
Full-body front view, plain cream background.

### Shots (style + character reference + this text)
1. **Sweeping the path** — Dawn at a small forest ashram beside a calm lake,
   thatched mud hut in the background. Elderly Shabari, bent slightly, sweeps a
   winding dirt path with a broom of twigs, and fresh marigold and lotus petals
   are scattered along the swept path. Golden morning light through tall trees,
   birds in the sky. Medium-wide shot.
2. **Tasting the berries** — Close-up of elderly Shabari sitting under a ber
   (Indian jujube) tree, a woven bamboo basket of small red and orange ber
   berries in her lap. She holds one berry to her lips, eyes closed, tasting
   it, with a patient, loving expression. A small leaf-plate beside her holds
   the sweet berries she has kept. Soft dappled light.
3. **Years of waiting** — Dusk. Elderly Shabari sits alone on the doorstep of
   her thatched hut, hands resting on her knees, gazing down a long, empty
   forest path lined with petals. Dry leaves drifting down, a lit clay diya
   beside her, purple-orange sky. Wide shot, lonely and quiet.
4. **Ram arrives** — Morning. Ram and Lakshman walk toward the viewer along the
   petal-strewn forest path, sunbeams streaming through the trees behind them,
   Ram slightly in front with a warm gentle smile. Full-body, slightly low
   angle, majestic but calm.
5. **Tears of joy** — Close-up of elderly Shabari's face, hands folded in
   namaste at her chest, eyes shining with tears of joy, a trembling smile,
   warm golden light on her face, soft blurred forest behind.
6. **The offering** — Outside the hut. Ram sits cross-legged on the bare
   ground, happily eating a berry from a leaf-plate that elderly Shabari, kneeling
   before him, offers with both hands. Lakshman stands a little behind,
   watching in surprise. Warm afternoon light, petals on the ground. Medium
   shot.
7. **Ram's smile** — Close-up of Ram's face and shoulders, holding a
   half-bitten red ber berry between his fingers, looking down with deep
   affection and a soft smile, warm glow, blurred hut and trees behind.

### Tips for consistent results
- Generate the character sheets first, then attach them to every shot prompt
  ("use the attached character exactly").
- If a shot comes out with text or a watermark, regenerate. Ask for 9:16.
- Name files exactly as in the shot list and send them over.

## Left to the builder
Exact easing/zoom amounts, particle details, crossfade lengths, caption font
(reuse an existing font in `public/fonts`), music melody and mix level.
