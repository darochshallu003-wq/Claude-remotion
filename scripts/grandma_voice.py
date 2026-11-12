"""Narration for the Goodbye Money short: voice.mp3 + words.json (word times in seconds).

Uses edge-tts word boundaries. Usage: python3 scripts/grandma_voice.py <grandma|dadi|grandma_en> [rate]
"""
import asyncio, json, pathlib, sys
# TLS through the session proxy: point certifi at the proxy CA when it exists.
import os as _os, certifi as _c
if _os.path.exists("/root/.ccr/ca-bundle.crt"): _c.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / (sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("en-") else "grandma")
VO = [
    "Grandma will spend three days feeding you, and thirty seconds trying to pay you for it.",
    "Sunday evening. Bags packed. The car is running.",
    "Surveys say more than eighty percent of grandparents give their grandkids cash. The rest just haven't caught you yet.",
    "It starts with a handshake. A note folded smaller than a stamp, pressed into your palm.",
    "You say, no, Grandma. You give it back.",
    "Refuse once, and it's in your shirt pocket.",
    "Refuse twice, it's in your bag, between the socks.",
    "Refuse three times, and she hands it to the driver, with instructions.",
    "The car pulls away. You wave. You won.",
    "Luckily, you made the driver give it back.",
    "Unluckily, she had already hidden five hundred and one rupees inside your lunch box.",
    "Why five hundred and one? In India, gifts like this end in a one, never a zero.",
    "A zero is an ending. A one is a beginning.",
    "That extra rupee is a tiny loan, like a library book you haven't returned yet. You have to come back.",
    "So the money was never the gift. The one rupee was your ticket home.",
    "Next month you visit, and give her the rupee back.",
    "She smiles, and slips you one thousand and one.",
]
VO_DADI = [
    "Dadi will spend three days feeding you, and thirty seconds trying to pay you for it.",
    "Sunday evening. Bags packed. The car is running.",
    "Surveys say more than eighty percent of grandparents give their grandkids cash. The rest just haven't caught you yet.",
    "It starts with a handshake. A note folded smaller than a stamp, pressed into your palm.",
    "You say, no, Dadi. You give it back.",
    "Refuse once, and it's in your shirt pocket.",
    "Refuse twice, it's in your bag, between the socks.",
    "Refuse three times, and she hands it to the driver, with instructions.",
    "The car pulls away. You wave. You won.",
    "Luckily, you made the driver give it back.",
    "Unluckily, she had already hidden five hundred and one rupees inside your lunch box.",
    "Why five hundred and one? In India, gifts like this end in a one, never a zero.",
    "A zero is an ending. A one is a beginning.",
    "That extra rupee is a tiny loan, like a library book you haven't returned yet. You have to come back.",
    "So the money was never the gift. The one rupee was your ticket home.",
    "Next month you visit, and give her the rupee back.",
    "She smiles, and slips you one thousand and one.",
]
VO_EN = [
    "Grandma will spend three days feeding you, and thirty seconds trying to pay you for it.",
    "Sunday evening. Bags packed. The car is running.",
    "In one survey, half of grandparents gave their grandkids cash. Most said they didn't know what else to buy. The rest just haven't caught you yet.",
    "It starts with a handshake. A tenner folded smaller than a stamp, pressed into your palm.",
    "You say, no, Grandma. You give it back.",
    "Refuse once, and it's in your coat pocket.",
    "Refuse twice, it's in your bag, between the socks.",
    "Refuse three times, and she hands it to the driver, with instructions.",
    "The car pulls away. You wave. You won.",
    "Luckily, you made the driver give it back.",
    "Unluckily, she had already hidden twenty pounds and a lucky penny inside your sandwich box.",
    "Why the penny? There's an old rule. Never give an empty purse.",
    "A coin inside keeps the money coming back.",
    "And that penny is a tiny loan, like a library book you haven't returned yet. You have to come back.",
    "So the money was never the gift. The penny was your ticket home.",
    "Next month you visit, and give her the penny back.",
    "She smiles, and slips you fifty quid.",
]
# versions: name -> (lines, voice, rate)
VERSIONS = {"grandma": (VO, "en-IN-PrabhatNeural", "+25%"), "dadi": (VO_DADI, "en-IN-PrabhatNeural", "+25%"),
            "grandma_en": (VO_EN, "en-GB-RyanNeural", "+12%")}

async def main():
    lines, voice, rate = VERSIONS[OUT.name]
    if len(sys.argv) > 2: rate = sys.argv[2]
    OUT.mkdir(parents=True, exist_ok=True)
    text = " ".join(lines)
    c = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary")
    words, audio = [], bytearray()
    async for ch in c.stream():
        if ch["type"] == "audio":
            audio += ch["data"]
        elif ch["type"] == "WordBoundary":
            s = ch["offset"] / 1e7
            words.append({"w": ch["text"], "s": round(s, 3), "e": round(s + ch["duration"] / 1e7, 3)})
    (OUT / "voice.mp3").write_bytes(audio)
    (OUT / "words.json").write_text(json.dumps(words, indent=0))
    print(len(words), "words, last ends", words[-1]["e"], "s")

asyncio.run(main())


# ---- pause trim: sentence pauses -> GAP, beat changes -> BEAT_GAP (run after the TTS) ----
GAP, BEAT_GAP, KEEP = 0.32, 0.6, 0.09
BEAT_AFTER = {"it", "yet", "instructions", "won", "box", "home", "purse", "back"}  # last word of a beat


def trim():
    import subprocess, wave, array
    src, wav = OUT / "voice.mp3", OUT / "voice_raw.wav"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-ac", "1", "-ar", "48000", str(wav)], check=True)
    with wave.open(str(wav)) as f:
        sr = f.getframerate(); pcm = array.array("h", f.readframes(f.getnframes()))
    words = json.loads((OUT / "words.json").read_text())
    out, t_src, shift = array.array("h"), 0.0, 0.0
    new = []
    for i, w in enumerate(words):
        if i:
            prev = words[i - 1]
            gap = w["s"] - prev["e"]
            beat = prev["w"] in BEAT_AFTER or (prev["w"] == "back" and w["w"] in ("Refuse", "So", "Unluckily"))
            target = BEAT_GAP if beat else GAP
            if gap > target:  # cut the middle of the gap
                a, b = prev["e"] + KEEP, w["s"] - KEEP
                cut = gap - target
                mid = (a + b) / 2
                c0, c1 = mid - cut / 2, mid + cut / 2
                out.extend(pcm[int(t_src * sr):int(c0 * sr)]); t_src = c1; shift += cut
        new.append({"w": w["w"], "s": round(w["s"] - shift, 3), "e": round(w["e"] - shift, 3)})
    out.extend(pcm[int(t_src * sr):int((words[-1]["e"] + 0.6) * sr)])
    with wave.open(str(OUT / "voice.wav"), "w") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr); f.writeframes(out.tobytes())
    (OUT / "words.json").write_text(json.dumps(new, indent=0))
    wav.unlink()
    print("trimmed:", round(len(out) / sr, 2), "s")


trim()
