# Stream system-design reel: voiceover script (Hinglish)

Regenerate the AI voice with `python3 scripts/vo_tts.py stream`, or record one clip per scene as `public/stream/vo/<file>.mp3`; then run `python3 scripts/vo_timing.py stream` and re-render.

## 1. `hook.mp3`  (~9.61 s)

आख़िरी ball, चार runs चाहिए। आप साँस रोककर देख रहे हैं… और तभी पड़ोस से आवाज़ आती है, छक्का! आपकी screen पर, ball अभी डली भी नहीं।

## 2. `ask.mp3`  (~7.26 s)

उस पल आपके साथ तीन करोड़ लोग live देख रहे हैं। Interview का सवाल: ऐसा streaming system कैसे बनाओगे?

## 3. `crash.mp3`  (~10.23 s)

एक server से सबको video भेजो, तो हर किसी को दो Mbps चाहिए। तीन करोड़ गुणा दो, यानी साठ terabits हर second. कोई एक server ये नहीं झेल सकता।

## 4. `cdn.mp3`  (~11.0 s)

इसलिए video की copies पहुँचाई जाती हैं देश भर के छोटे servers पर, आपके शहर के पास। Patna वाला Patna से देखता है, Chennai वाला Chennai से। इसे कहते हैं CDN.

## 5. `chunks.mp3`  (~10.57 s)

Live video को चार-चार second के टुकड़ों में काटा जाता है। आपके शहर का server हर टुकड़ा सिर्फ़ एक बार लाता है, और फिर लाखों लोगों को वही देता है। इसे कहते हैं caching.

## 6. `abr.mp3`  (~9.66 s)

आप train में हो, tunnel आया, network गिरा? Video रुकता नहीं, बस quality गिर जाती है, टेन-एटी पी से फ़ोर-एटी पी। इसे कहते हैं adaptive bitrate.

## 7. `herd.mp3`  (~10.55 s)

पर wicket गिरते ही, एक ही second में पचास लाख लोग app खोलते हैं। और उसी पल scorecard का cache expire हो गया, तो सारी requests सीधे main server पर। Server गया।

## 8. `coalesce.mp3`  (~10.09 s)

Fix सीधा है। एक जैसी requests को रोक लो, main server तक सिर्फ़ एक जाए, और जवाब आते ही सबको एक साथ बाँट दो। इसे कहते हैं request coalescing.

## 9. `recap.mp3`  (~9.71 s)

तो पूरा design: पास में CDN, टुकड़ों की caching, network के हिसाब से quality, और भीड़ के लिए request coalescing. तीन करोड़ लोग, और कोई buffering नहीं।

## 10. `cta.mp3`  (~11.39 s)

अब stream आपका है। टुकड़े दो second के रखोगे, या दस second के? छोटे टुकड़े, तो पड़ोसी से पहले छक्का दिखेगा, पर server पर पाँच गुना requests. Comment में बताओ, वजह के साथ।
