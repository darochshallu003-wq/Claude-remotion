# Bedtime story: परी और जुगनू (नींद वाली सैर)

An original Hindi bedtime story for small children (~1:55, 1080×1920). Pari can't sleep, so Jugnu the firefly takes her to say goodnight to the sleeping birds, the yawning frog, the clouds and Chanda Mama, then brings her home to bed.

- Story, speakers and line timings: `src/bedtime/story.json`
- Composition: `BedtimeStory` (`src/bedtime/`)

## Regenerate

```sh
python3 scripts/story_tts.py      # voices every line, writes public/bedtime/vo/*.mp3 and the timings in story.json
python3 scripts/make_lullaby.py   # original music-box lullaby + crickets -> public/bedtime/lullaby.mp3
npx remotion render BedtimeStory out/bedtime-story.mp4
```

Edit a line's `text` (or `who`) in `story.json` and rerun `story_tts.py`; the scenes and captions follow the new timings.

## Voices (edge-tts)

| who | character | voice |
| --- | --- | --- |
| `n` | narrator | hi-IN-SwaraNeural, slow and soft |
| `p` | परी | hi-IN-SwaraNeural, raised pitch |
| `j` | जुगनू | hi-IN-MadhurNeural, raised pitch, bright |
| `c` | चाँद मामा | hi-IN-MadhurNeural, slow and warm |

## Script

1. **title** — आज की कहानी है… परी और जुगनू की, नींद वाली सैर।
2. **awake** — एक छोटे से गाँव में, एक छोटी सी बच्ची रहती थी, परी। रात हो गई थी, सब सो गए थे… पर परी की आँखें खुली थीं। *परी:* “मुझे तो नींद ही नहीं आ रही।”
3. **jugnu** — तभी खिड़की पर, एक नन्ही सी रोशनी टिमटिमाई। *जुगनू:* “नमस्ते परी! मैं हूँ जुगनू। चलो, सबको शुभ रात्रि कहने चलें!”
4. **birds** — सबसे पहले वो पहुँचे, नीम के पेड़ पर। घोंसले में चिड़िया के बच्चे, माँ के पंखों में दुबक कर सो रहे थे। *परी:* “शुभ रात्रि, नन्ही चिड़िया।”
5. **pond** — फिर वो पहुँचे तालाब के पास। कमल के पत्ते पर बैठा मेंढक, बड़ी सी जम्हाई ले रहा था। *परी:* “शुभ रात्रि, मेंढक भैया।”
6. **clouds** — जुगनू परी को ऊपर ले गया, बादलों तक। बादल रुई के तकियों जैसे नरम थे, और धीरे-धीरे तैर रहे थे। *परी:* “शुभ रात्रि, बादल।”
7. **moon** — और सबसे ऊपर, चाँद मामा मुस्कुरा रहे थे। *चाँद मामा:* “परी बिटिया, अब सोने का समय है। मैं रात भर, तुम्हारी खिड़की पर रोशनी रखूँगा।”
8. **home** — जुगनू परी को वापस घर ले आया। परी ने रज़ाई ओढ़ी, और आँखें मूँद लीं। *परी:* “शुभ रात्रि, जुगनू।” *जुगनू:* “शुभ रात्रि, परी।”
9. **sleep** — बाहर चाँद चमकता रहा, तारे टिमटिमाते रहे… और परी, मीठे सपनों में खो गई। शुभ रात्रि, बच्चो।

End card: शुभ रात्रि · मीठे सपने देखना
