# TV screen explainer: voiceover script (Hinglish)

Regenerate the AI voice with `python3 scripts/vo_tts.py tv` (questions are asked by a second voice), or record one clip per scene as `public/tv/vo/<file>.mp3`; then run `python3 scripts/vo_timing.py tv` and re-render with `npx remotion render TvExplainer out/tv-screen.mp4`.

## 1. `hook.mp3`  (~6.66 s)

TV पे करोड़ों रंग दिखते हैं… पर असल में ये सिर्फ़ तीन रंगों का खेल है। कैसे? चलो zoom करते हैं।

## 2. `pixels.mp3`  (~11.41 s)

TV की picture लाखों छोटे-छोटे dots से बनी होती है, जिन्हें pixels कहते हैं। और हर pixel के अंदर तीन और छोटी lights होती हैं: red, green और blue. इन्हें subpixels कहते हैं।

## 3. `mixing.mp3`  (~11.39 s)

अब magic देखो। Red और green light मिलें, तो yellow दिखता है। तीनों पूरे जलें, तो white. और तीनों बंद, तो black. हर subpixel की brightness बदलकर, TV करोड़ों रंग बना लेता है।

## 4. `numbers.mp3`  (~12.47 s)

एक 4K TV में होते हैं 3840 गुणा 2160, यानी करीब 83 लाख pixels. और हर एक में तीन subpixels, मतलब ढाई करोड़ छोटी lights, जो एक साथ control होती हैं।

## 5. `lcd.mp3`  (~16.67 s)

पर LED TV में ये lights खुद नहीं जलतीं। पीछे होती है LED backlight, जो white light देती है। उसके आगे liquid crystals होते हैं, जो voltage मिलने पर मुड़ते हैं, और दो polarizers के बीच light को रोकते या जाने देते हैं। फिर color filter से red, green और blue बनता है।

## 6. `oled.mp3`  (~10.79 s)

OLED TV में backlight होती ही नहीं। यहाँ हर subpixel खुद अपनी light बनाता है। Black दिखाना हो, तो pixel पूरा बंद। इसीलिए OLED का black एकदम असली black होता है।

## 7. `motion.mp3`  (~10.11 s)

और picture हिलती कैसे है? Screen एक second में साठ या उससे ज़्यादा बार नई picture बनाती है। हमारी आँखें इन तेज़ frames को जोड़कर smooth motion देखती हैं।

## 8. `tryit.mp3`  (~11.77 s)

खुद देखना है? Phone की screen पर पानी की एक छोटी सी बूँद डालो। वो magnifying glass बन जाएगी, और आपको red, green, blue subpixels दिख जाएँगे। बाद में screen साफ़ कर देना।

## 9. `cta.mp3`  (~4.07 s)

आपके घर में LED TV है या OLED? Comment में बताइए।
