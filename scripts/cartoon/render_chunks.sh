#!/bin/bash
# Render GrandmaShort at 1080x1920 in shot-aligned chunks (skips chunks already rendered), then concat + mux the mix.
cd "$(dirname "$0")/../.."
mkdir -p out/grandma/chunks
for r in 0-256 257-611 612-871 872-1087 1088-1334 1335-1581 1582-1894 1895-2099; do
  f=out/grandma/chunks/c_$r.mp4
  [ -s "$f" ] && continue
  node scripts/cartoon/render.mjs "$f.tmp.mp4" 1 "$r" 2>&1 | grep -E "frames,|done|Error" | tail -2
  mv "$f.tmp.mp4" "$f" && echo "chunk $r ok $(date +%T)"
done
