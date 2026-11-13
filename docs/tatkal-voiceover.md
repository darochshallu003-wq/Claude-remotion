# Tatkal system-design reel: voiceover script (Hinglish)

Regenerate the AI voice with `python3 scripts/vo_tts.py tatkal` (questions are asked by a second voice), or record one clip per scene as `public/tatkal/vo/<file>.mp3`; then run `python3 scripts/vo_timing.py tatkal` and re-render.

## 1. `hook.mp3`  (~8.63 s)

सुबह के नौ बजकर उनसठ मिनट। दस बजे AC तत्काल खुलेगा। आपकी उँगली तैयार है… और आपके साथ, दस लाख लोगों की भी।

## 2. `ask.mp3`  (~7.86 s)

Interview में यही सवाल आता है। एक train, तीन सौ seats, और एक ही minute में दस लाख लोग। आप system कैसे बनाओगे?

## 3. `crash.mp3`  (~7.35 s)

सबको सीधा database पर भेज दिया, तो database वहीं बैठ जाएगा। लाखों requests एक साथ, और सबको timeout.

## 4. `queue.mp3`  (~10.07 s)

तो पहले सबको line में लगाओ। हर user को एक token मिलता है, और अंदर उतने ही लोग जाते हैं जितने server संभाल सके। इसे कहते हैं virtual waiting room.

## 5. `hold.mp3`  (~13.11 s)

आप अंदर आए, seat चुनी, B4 की बत्तीस नंबर। Payment में दो मिनट लगेंगे। तब तक ये seat किसी और को क्यों नहीं मिलती? क्योंकि वो lock हो गई है, पाँच मिनट के timer के साथ। इसे कहते हैं TTL.

## 6. `expire.mp3`  (~6.18 s)

Payment नहीं किया? Timer ख़त्म, lock हटा, और seat वापस line में खड़े अगले इंसान के पास।

## 7. `race.mp3`  (~8.1 s)

पर एक पेच है। अगर ठीक उसी millisecond पर दो लोग एक ही seat पर click कर दें तो? दोनों को लगेगा seat उनकी है।

## 8. `cas.mp3`  (~9.08 s)

इसलिए seat सिर्फ़ एक शर्त पर बदलती है, अगर वो अभी भी खाली है। पहला जीतता है, दूसरे को साफ़ मना। इसे कहते हैं compare-and-set.

## 9. `pay.mp3`  (~12.66 s)

और payment पर network अटका, आपने घबराकर दो बार Pay दबा दिया तो? हर payment के साथ एक unique key जाती है। वही key दोबारा आई, तो पैसा दोबारा नहीं कटता। इसे कहते हैं idempotency key.

## 10. `recap.mp3`  (~11.41 s)

तो पूरा design: बाहर waiting room, अंदर seat पर timer वाला lock, हर seat पर compare-and-set, और payment पर idempotency key. चार परतें, और एक भी seat दो बार नहीं बिकती।

## 11. `cta.mp3`  (~6.85 s)

अब system आपका है। Lock का timer दस मिनट रखोगे, या दो मिनट? Comment में जवाब दो, वजह के साथ।
