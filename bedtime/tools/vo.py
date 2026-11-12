"""Generate the bedtime story narration, one clip per scene, with edge-tts.

Usage: python3 tools/vo.py <out_dir> [voice] [rate]
Writes <out_dir>/<scene>.mp3 and prints each clip's duration.
"""

import asyncio
import json
import os
import ssl
import subprocess
import sys

import edge_tts
from edge_tts import communicate

# Trust the environment's CA bundle (edge-tts pins certifi by default).
_ca = os.environ.get("SSL_CERT_FILE") or "/root/.ccr/ca-bundle.crt"
if os.path.exists(_ca):
    communicate._SSL_CTX = ssl.create_default_context(cafile=_ca)

LINES = {
    "s1": "Bramble... and the Little Lost Star.",
    "s2": "In a meadow of sleepy flowers, there lived a small hedgehog named Bramble.",
    "s3": "One night, a tiny star tumbled out of the sky... and landed. Plink! In the clover.",
    "s4": "“I’m lost,” whispered the little star. “And I can’t find my way home.”",
    "s5": "So Bramble carried her up the tallest hill, step by step, past the snoring frogs.",
    "s6": "At the very top, Old Owl spread her soft wings, and flew the star back to her place in the sky.",
    "s7": "“Thank you, Bramble,” she twinkled. “I’ll shine for you every night.”",
    "s8": "And Bramble curled up in the clover, and fell fast asleep. Goodnight, Bramble. Goodnight, little star.",
    "end": "The End. Sweet dreams.",
}


async def main():
    out = sys.argv[1]
    voice = sys.argv[2] if len(sys.argv) > 2 else "en-GB-SoniaNeural"
    rate = sys.argv[3] if len(sys.argv) > 3 else "-14%"
    os.makedirs(out, exist_ok=True)
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    timings = {}
    for key, text in LINES.items():
        path = os.path.join(out, key + ".mp3")
        words = []
        with open(path, "wb") as f:
            async for chunk in edge_tts.Communicate(
                text, voice, rate=rate, pitch="-2Hz", boundary="WordBoundary", proxy=proxy
            ).stream():
                if chunk["type"] == "audio":
                    f.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    words.append({"w": chunk["text"], "t": round(chunk["offset"] / 1e7, 3)})
        timings[key] = words
        dur = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
            capture_output=True, text=True,
        ).stdout.strip()
        timings[key + "_dur"] = float(dur)
        print(f"{key}\t{dur}")
    with open(os.path.join(out, "words.json"), "w") as f:
        json.dump(timings, f, indent=1)


if __name__ == "__main__":
    asyncio.run(main())
