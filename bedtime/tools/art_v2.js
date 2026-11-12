      // ---- v2 storybook art: layered shading, quills, feathers, glossy eyes ----
      // Tapered spikes fanned around an ellipse (hedgehog quills, owl tufts).
      function quills(cx, cy, rx0, ry0, rx1, ry1, a0, a1, n, w, col, tip, jit) {
        let s = "";
        for (let i = 0; i < n; i++) {
          const t = n === 1 ? 0 : i / (n - 1);
          const a = ((a0 + (a1 - a0) * t + Math.sin(i * 2.3) * jit) * Math.PI) / 180;
          const bx = cx + Math.cos(a) * rx0, by = cy + Math.sin(a) * ry0;
          const len = 1 + Math.sin(i * 1.7) * 0.06;
          const tx = cx + Math.cos(a) * rx1 * len, ty = cy + Math.sin(a) * ry1 * len;
          const nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
          s += `<path d="M${P(bx - nx)} ${P(by - ny)} L${P(tx)} ${P(ty)} L${P(bx + nx)} ${P(by + ny)} Z" fill="${col}" />`;
          if (tip) {
            const mx = bx + (tx - bx) * 0.66, my = by + (ty - by) * 0.66;
            s += `<path d="M${P(mx - nx * 0.4)} ${P(my - ny * 0.4)} L${P(tx)} ${P(ty)} L${P(mx + nx * 0.4)} ${P(my + ny * 0.4)} Z" fill="${tip}" />`;
          }
        }
        return s;
      }

      function starM(id, sad) {
        const R = 56, r = 25;
        const v = [];
        for (let i = 0; i < 10; i++) {
          const a = -Math.PI / 2 + (i * Math.PI) / 5;
          v.push([Math.cos(a) * (i % 2 ? r : R), Math.sin(a) * (i % 2 ? r : R)]);
        }
        let facets = "";
        for (let i = 0; i < 10; i++) {
          const [x1, y1] = v[i], [x2, y2] = v[(i + 1) % 10];
          facets += `<path d="M0 0 L${P(x1)} ${P(y1)} L${P(x2)} ${P(y2)} Z" fill="${i % 2 ? "#ffffff" : "#c77a12"}" opacity="${i % 2 ? 0.2 : 0.12}" />`;
        }
        return `
        <circle id="${id}-glow" r="120" fill="url(#glow)" />
        <g id="${id}-body">
          <path d="${starPath(R + 4, r + 2)}" fill="#fff3c4" opacity="0.55" stroke="#fff3c4" stroke-width="8" stroke-linejoin="round" />
          <path d="${starPath(R, r)}" fill="url(#starBody)" stroke="#fff6d2" stroke-width="4" stroke-linejoin="round" />
          ${facets}
          <ellipse cx="-14" cy="-24" rx="11" ry="5" transform="rotate(-35 -14 -24)" fill="#ffffff" opacity="0.6" />
          <path id="${id}-dim" d="${starPath(R, r)}" fill="#4a4470" opacity="0" />
          <ellipse cx="-13" cy="-2" rx="5" ry="6.5" fill="url(#eyeG)" />
          <ellipse cx="13" cy="-2" rx="5" ry="6.5" fill="url(#eyeG)" />
          <circle cx="-11.5" cy="-4.5" r="1.9" fill="#fff" />
          <circle cx="14.5" cy="-4.5" r="1.9" fill="#fff" />
          <ellipse cx="-22" cy="10" rx="7" ry="4.5" fill="url(#blush)" />
          <ellipse cx="22" cy="10" rx="7" ry="4.5" fill="url(#blush)" />
          <path id="${id}-happy" d="M-9 11 Q0 19 9 11" stroke="#6a3f0e" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="${sad ? 0 : 1}" />
          <path id="${id}-sad" d="M-8 17 Q0 10 8 17" stroke="#6a3f0e" stroke-width="3.5" fill="none" stroke-linecap="round" opacity="${sad ? 1 : 0}" />
          <path id="${id}-tl" d="M-15 6 q-4 7 0 10 q4 -3 0 -10Z" fill="#bfe6ff" opacity="0" />
          <path id="${id}-tr" d="M15 6 q-4 7 0 10 q4 -3 0 -10Z" fill="#bfe6ff" opacity="0" />
        </g>`;
      }

      function hogFace(id) {
        return `
          <ellipse cx="64" cy="14" rx="57" ry="47" fill="url(#hogFace)" />
          <ellipse cx="106" cy="25" rx="31" ry="19" fill="url(#hogFace)" />
          <path d="M20 -18 l8 4 M14 -4 l9 2 M16 12 l9 0 M22 28 l8 -3" stroke="#d2a77a" stroke-width="2.5" stroke-linecap="round" opacity="0.7" />
          <circle cx="40" cy="-26" r="14" fill="url(#hogFace)" stroke="#c99a6c" stroke-width="2" />
          <ellipse cx="41" cy="-25" rx="6.5" ry="7" fill="#c98f7e" />
          <path d="M108 30 L150 22 M108 34 L148 36 M106 38 L142 48" stroke="#fff4dc" stroke-width="1.6" opacity="0.55" stroke-linecap="round" />
          <ellipse cx="133" cy="20" rx="11.5" ry="9.5" fill="url(#noseG)" />
          <ellipse cx="129.5" cy="16" rx="4" ry="2.4" fill="#fff" opacity="0.7" />
          <path d="M65 -6 Q76 -12 88 -5" stroke="#3a2418" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.8" />
          <g id="${id}-eye"><ellipse cx="76" cy="4" rx="9.5" ry="10.5" fill="url(#eyeG)" /><circle cx="79.5" cy="0" r="3.4" fill="#fff" /><circle cx="72.5" cy="8.5" r="1.5" fill="#fff" opacity="0.75" /></g>
          <path id="${id}-eyec" d="M66 6 Q76 14 86 6" stroke="#2a1a10" stroke-width="4" fill="none" stroke-linecap="round" opacity="0" />
          <ellipse cx="93" cy="35" rx="14" ry="8.5" fill="url(#blush)" />
          <path d="M110 38 Q118 45 127 38" stroke="#2b1a12" stroke-width="3.5" fill="none" stroke-linecap="round" />`;
      }

      function hogM(id, s, rider) {
        return `<g id="${id}"><g transform="scale(${s})"><g id="${id}-bob">
          <ellipse cx="-8" cy="76" rx="124" ry="16" fill="url(#shadowG)" />
          <g id="${id}-f2"><ellipse cx="-52" cy="62" rx="21" ry="12.5" fill="url(#hogFoot)" /><path d="M-66 68 q3 4 6 0 M-56 70 q3 4 6 0 M-46 69 q3 4 6 0" stroke="#8a6040" stroke-width="2" fill="none" /></g>
          <g id="${id}-f1"><ellipse cx="38" cy="64" rx="21" ry="12.5" fill="url(#hogFoot)" /><path d="M24 70 q3 4 6 0 M34 72 q3 4 6 0 M44 71 q3 4 6 0" stroke="#8a6040" stroke-width="2" fill="none" /></g>
          ${quills(-12, -4, 82, 54, 140, 104, -214, -16, 36, 7.5, "#2f1c12", "#c9a27c", 3)}
          ${quills(-12, -2, 62, 40, 122, 88, -206, -28, 32, 6.5, "#4a2e1f", "#e0bf98", 4)}
          <ellipse cx="-14" cy="8" rx="100" ry="62" fill="url(#hogFur)" />
          ${quills(-14, 6, 26, 18, 98, 66, -200, -42, 28, 5, "#6e4630", "#ecd3ac", 5)}
          <ellipse cx="18" cy="42" rx="68" ry="30" fill="url(#hogBelly)" />
          <g id="${id}-arm" opacity="0"><ellipse cx="92" cy="-34" rx="12.5" ry="22" fill="url(#hogFoot)" /></g>
          ${hogFace(id)}
          ${rider ? `<g transform="translate(-34 -132) scale(0.4)"><g id="${id}-pip">${starM(id + "-pip")}</g></g>` : ""}
        </g></g></g>`;
      }

      function ballM(id, s) {
        return `<g id="${id}"><g transform="scale(${s})"><g id="${id}-breath">
          <ellipse cx="0" cy="80" rx="130" ry="18" fill="url(#shadowG)" />
          ${quills(0, 0, 72, 58, 118, 96, 0, 352, 50, 7.5, "#2f1c12", "#c9a27c", 2)}
          <ellipse cx="0" cy="4" rx="94" ry="74" fill="url(#hogFur)" />
          ${quills(-4, 0, 26, 20, 88, 68, -200, 20, 30, 5, "#6e4630", "#ecd3ac", 5)}
          <ellipse cx="40" cy="32" rx="52" ry="38" fill="url(#hogFace)" />
          <ellipse cx="83" cy="35" rx="10" ry="8.5" fill="url(#noseG)" />
          <ellipse cx="80" cy="32" rx="3.5" ry="2" fill="#fff" opacity="0.7" />
          <path d="M27 22 Q38 31 49 22" stroke="#2a1a10" stroke-width="4" fill="none" stroke-linecap="round" />
          <ellipse cx="55" cy="46" rx="12" ry="7" fill="url(#blush)" />
          <ellipse cx="-20" cy="68" rx="21" ry="11" fill="url(#hogFoot)" />
        </g></g></g>`;
      }

      function owlWing(id, cx) {
        let f = "";
        for (let k = 0; k < 4; k++) {
          const y = 0 + k * 20;
          f += `<path d="M${cx - 22} ${y} q11 12 22 0 q11 12 22 0" stroke="#3b281d" stroke-width="2.5" fill="none" opacity="0.55" />`;
        }
        return `<g id="${id}"><ellipse cx="${cx}" cy="6" rx="34" ry="74" fill="url(#owlWing)" />${f}
          <path d="M${cx - 26} 56 q8 26 13 22 q5 6 13 -2 q8 8 13 -2 q6 4 13 -18" fill="#4a3326" /></g>`;
      }

      function owlM(id, s, asleep) {
        let scallops = "";
        for (let row = 0; row < 6; row++) {
          for (let col = -3; col <= 3; col++) {
            const x = col * 13 + (row % 2 ? 6.5 : 0), y = 2 + row * 13;
            if ((x / 42) ** 2 + ((y - 28) / 52) ** 2 < 0.78)
              scallops += `<path d="M${P(x - 5)} ${P(y)} q5 6 10 0" stroke="#b39371" stroke-width="2.2" fill="none" />`;
          }
        }
        return `<g id="${id}"><g transform="scale(${s})"><g id="${id}-bob">
          ${owlWing(id + "-wl", -64)}${owlWing(id + "-wr", 64)}
          <g id="${id}-head">
            <path d="M-54 -64 L-44 -110 L-20 -76 Z M54 -64 L44 -110 L20 -76 Z" fill="#6e523f" />
            <path d="M-44 -104 L-38 -80 M-40 -98 L-30 -78 M44 -104 L38 -80 M40 -98 L30 -78" stroke="#3b281d" stroke-width="2" opacity="0.6" />
          </g>
          <ellipse cx="0" cy="0" rx="71" ry="89" fill="url(#owlBody)" />
          <ellipse cx="0" cy="30" rx="47" ry="57" fill="url(#owlBelly)" />
          ${scallops}
          <path d="M-62 -34 Q-60 -72 -26 -66 Q0 -62 0 -44 Q0 -62 26 -66 Q60 -72 62 -34 Q60 0 26 -2 Q8 -2 0 -16 Q-8 -2 -26 -2 Q-60 0 -62 -34 Z" fill="url(#owlDisc)" />
          <g id="${id}-eyes" opacity="${asleep ? 0 : 1}">
            <circle cx="-26" cy="-32" r="22" fill="#3b281d" />
            <circle cx="26" cy="-32" r="22" fill="#3b281d" />
            <circle cx="-26" cy="-32" r="19.5" fill="url(#irisG)" />
            <circle cx="26" cy="-32" r="19.5" fill="url(#irisG)" />
            <circle cx="-24" cy="-30" r="10" fill="#120a05" />
            <circle cx="28" cy="-30" r="10" fill="#120a05" />
            <circle cx="-20" cy="-35" r="4" fill="#fff" />
            <circle cx="32" cy="-35" r="4" fill="#fff" />
            <circle cx="-28" cy="-25" r="1.8" fill="#fff" opacity="0.7" />
            <circle cx="24" cy="-25" r="1.8" fill="#fff" opacity="0.7" />
            <path d="M-50 -46 Q-26 -60 -2 -46 L-2 -40 Q-26 -50 -50 -40 Z M2 -46 Q26 -60 50 -46 L50 -40 Q26 -50 2 -40 Z" fill="#8a6a54" />
          </g>
          <g id="${id}-shut" opacity="${asleep ? 1 : 0}">
            <circle cx="-26" cy="-32" r="22" fill="#a68569" />
            <circle cx="26" cy="-32" r="22" fill="#a68569" />
            <path d="M-42 -30 Q-26 -19 -10 -30 M10 -30 Q26 -19 42 -30" stroke="#3a2618" stroke-width="4" fill="none" stroke-linecap="round" />
          </g>
          <path d="M-10 -16 L10 -16 L0 6 Z" fill="url(#beakG)" />
          <path d="M-22 86 l-6 12 M-16 86 v13 M-10 86 l6 12 M10 86 l-6 12 M16 86 v13 M22 86 l6 12" stroke="#e39a3e" stroke-width="4.5" stroke-linecap="round" />
        </g></g></g>`;
      }

      function frogM(x, y, s, rot) {
        return `<g transform="translate(${P(x)} ${P(y)}) rotate(${P(rot || 0)}) scale(${s})">
          <ellipse cx="0" cy="22" rx="46" ry="8" fill="url(#shadowG)" />
          <ellipse cx="0" cy="0" rx="45" ry="27" fill="url(#frogG)" />
          <ellipse cx="-14" cy="-6" rx="7" ry="4" fill="#2a5636" opacity="0.45" />
          <ellipse cx="16" cy="-2" rx="5" ry="3" fill="#2a5636" opacity="0.45" />
          <circle cx="-20" cy="-22" r="13" fill="url(#frogG)" />
          <circle cx="20" cy="-22" r="13" fill="url(#frogG)" />
          <path d="M-28 -22 q8 6 16 0 M12 -22 q8 6 16 0" stroke="#173320" stroke-width="3" fill="none" stroke-linecap="round" />
          <path d="M-14 4 q14 8 28 0" stroke="#173320" stroke-width="3" fill="none" stroke-linecap="round" />
          <ellipse cx="0" cy="12" rx="27" ry="10" fill="#bfe0a8" opacity="0.55" />
          <ellipse cx="-27" cy="2" rx="7" ry="4" fill="url(#blush)" />
          <ellipse cx="27" cy="2" rx="7" ry="4" fill="url(#blush)" />
        </g>`;
      }

      function bunnyM(x, y, s, flip) {
        return `<g transform="translate(${P(x)} ${P(y)}) scale(${flip ? -s : s} ${s})">
          <ellipse cx="0" cy="32" rx="70" ry="9" fill="url(#shadowG)" />
          <ellipse cx="0" cy="0" rx="58" ry="36" fill="url(#bunnyG)" />
          <circle cx="-56" cy="-4" r="15" fill="#ffffff" />
          <ellipse cx="34" cy="-18" rx="34" ry="30" fill="url(#bunnyG)" />
          <ellipse cx="10" cy="-42" rx="11" ry="36" fill="url(#bunnyG)" transform="rotate(-70 10 -42)" />
          <ellipse cx="22" cy="-46" rx="11" ry="34" fill="url(#bunnyG)" transform="rotate(-58 22 -46)" />
          <ellipse cx="22" cy="-46" rx="5" ry="24" fill="url(#earPink)" transform="rotate(-58 22 -46)" />
          <path d="M-30 -10 q8 4 16 0 M-10 18 q8 4 16 0" stroke="#b6acc9" stroke-width="2" fill="none" opacity="0.7" />
          <path d="M36 -20 q7 5 14 0" stroke="#4a4058" stroke-width="3" fill="none" stroke-linecap="round" />
          <ellipse cx="64" cy="-12" rx="5.5" ry="4.5" fill="#f2a0b4" />
          <ellipse cx="48" cy="-4" rx="9" ry="5.5" fill="url(#blush)" />
        </g>`;
      }

      function cloudM(x, y, s, op) {
        return `<g transform="translate(${P(x)} ${P(y)}) scale(${s})" opacity="${op || 0.9}">
          <ellipse cx="0" cy="20" rx="170" ry="46" fill="url(#cloudG)" />
          <circle cx="-70" cy="0" r="58" fill="url(#cloudG)" />
          <circle cx="10" cy="-26" r="76" fill="url(#cloudG)" />
          <circle cx="90" cy="4" r="52" fill="url(#cloudG)" />
          <path d="M-120 -20 Q-90 -62 -50 -48 M-40 -80 Q10 -112 60 -78 M70 -40 Q100 -54 130 -30" stroke="#c9ccff" stroke-width="5" fill="none" opacity="0.35" stroke-linecap="round" />
        </g>`;
      }

      function flowersM(k, x0, x1, base, open) {
        const cols = ["#c9a7e8", "#f6b6c9", "#9fd3e6", "#ffd9a0"];
        seed = 7 + k * 31;
        let s = "";
        const n = Math.round((x1 - x0) / 118);
        for (let i = 0; i < n; i++) {
          const x = x0 + i * 118 + rnd() * 50;
          const b = base + rnd() * 40;
          const h = 80 + rnd() * 90;
          const c = cols[Math.floor(rnd() * cols.length)];
          const lean = (rnd() - 0.5) * 30;
          const hx = x + lean * 1.6, hy = b - h + 4;
          let head;
          if (open) {
            head = `<g class="fh" transform="translate(${P(hx)} ${P(hy)})"><g class="pet">`;
            for (let p = 0; p < 5; p++) {
              const a = (p / 5) * Math.PI * 2;
              head += `<ellipse cx="${P(Math.cos(a) * 12)}" cy="${P(Math.sin(a) * 12)}" rx="11" ry="9" transform="rotate(${P((a * 180) / Math.PI)} ${P(Math.cos(a) * 12)} ${P(Math.sin(a) * 12)})" fill="${c}" stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5" />`;
            }
            head += `</g><circle r="7" fill="url(#pollen)" /></g>`;
          } else {
            const rot = `rotate(${P(lean * 2.4)} ${P(hx)} ${P(hy + 6)})`;
            head = `<ellipse cx="${P(hx)}" cy="${P(hy + 6)}" rx="15" ry="20" fill="${c}" transform="${rot}" />
              <ellipse cx="${P(hx)}" cy="${P(hy + 6)}" rx="15" ry="20" fill="url(#budShade)" transform="${rot}" />
              <path d="M${P(hx)} ${P(hy - 12)} L${P(hx)} ${P(hy + 24)}" stroke="#000" stroke-opacity="0.12" stroke-width="2" transform="${rot}" />
              <path d="M${P(hx - 9)} ${P(hy + 20)} Q${P(hx)} ${P(hy + 32)} ${P(hx + 9)} ${P(hy + 20)}" fill="#3d7a55" transform="${rot}" />`;
          }
          s += `<g class="fl"><path d="M${P(x)} ${P(b)} Q${P(x + lean)} ${P(b - h * 0.6)} ${P(hx)} ${P(hy)}" stroke="#4b8a63" stroke-width="5" fill="none" /><path d="M${P(x - 16)} ${P(b - h * 0.4)} q14 -6 16 4 q-10 2 -16 -4Z" fill="#4b8a63" />${head}</g>`;
        }
        return s;
      }

      function cloverM(k, y0, y1) {
        seed = 99 + k * 13;
        let s = "";
        for (let i = 0; i < 30; i++) {
          const x = 30 + rnd() * 1860, y = y0 + rnd() * (y1 - y0), r = 7 + rnd() * 5;
          const col = i % 3 ? "#2f6b4c" : "#3b7d5a";
          s += `<g fill="${col}"><circle cx="${P(x - r * 0.8)}" cy="${P(y)}" r="${P(r)}"/><circle cx="${P(x + r * 0.8)}" cy="${P(y)}" r="${P(r)}"/><circle cx="${P(x)}" cy="${P(y - r * 1.1)}" r="${P(r)}"/><circle cx="${P(x - r * 0.3)}" cy="${P(y - r * 0.6)}" r="${P(r * 0.35)}" fill="#7fbf96" opacity="0.35"/></g>`;
        }
        return s;
      }

      // A hill: gradient body plus a thin moonlit rim along its top edge.
      function hillP(d, top, grad, op) {
        return `<path d="${d} L1920 1080 L0 1080 Z" fill="url(#${grad})" ${op ? `opacity="${op}"` : ""} />
          <path d="${d}" fill="none" stroke="#9fb8e6" stroke-width="3" opacity="0.28" />`;
      }
      function fogM(y, op) {
        return `<ellipse cx="960" cy="${y}" rx="1300" ry="70" fill="url(#fogG)" opacity="${op || 1}" />`;
      }

      function meadowM(k, open) {
        return `
          ${hillP("M0 740 Q360 660 760 710 T1500 680 T1920 700", 0, "hillFar")}
          ${fogM(760, 0.9)}
          ${hillP("M0 810 Q480 740 980 790 T1920 770", 0, "hillMid")}
          ${flowersM(k, 40, 1900, 840, open)}
          ${hillP("M0 880 Q600 840 1100 870 T1920 860", 0, "hillNear")}
          ${cloverM(k, 890, 1040)}`;
      }

      function canopyM(blobs) {
        let s = "";
        blobs.forEach(([x, y, r, g]) => {
          s += `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${g})" />`;
        });
        seed = 4242 + blobs.length;
        blobs.forEach(([x, y, r]) => {
          for (let i = 0; i < 6; i++) {
            const a = rnd() * Math.PI * 2, d = rnd() * r * 0.75;
            s += `<ellipse cx="${P(x + Math.cos(a) * d)}" cy="${P(y + Math.sin(a) * d - r * 0.15)}" rx="${P(r * 0.22)}" ry="${P(r * 0.14)}" fill="#7fc79c" opacity="0.13" />`;
          }
        });
        return s;
      }

      function oakM(id) {
        return `
          ${hillP("M0 800 Q500 760 960 790 T1920 780", 0, "hillMid")}
          <path d="M470 880 Q520 640 540 420 L700 420 Q720 640 790 880 Z" fill="url(#barkG)" />
          <path d="M560 860 Q570 700 575 470 M610 870 Q622 700 618 480 M660 860 Q665 700 668 470 M520 840 Q540 760 545 700" stroke="#2a1910" stroke-width="5" fill="none" opacity="0.45" stroke-linecap="round" />
          <path d="M520 880 Q470 900 400 905 M760 880 Q820 900 880 902 M600 880 Q560 920 520 940" stroke="#4a3226" stroke-width="22" fill="none" stroke-linecap="round" />
          <path d="M560 470 Q500 360 420 330 M660 460 Q720 350 820 320" stroke="#4a3226" stroke-width="34" fill="none" stroke-linecap="round" />
          ${canopyM([[420, 300, 150, "leafDark"], [620, 220, 190, "leafG"], [830, 300, 150, "leafDark"], [540, 360, 120, "leafG"], [720, 360, 120, "leafG"]])}
          <circle id="${id}-doorglow" cx="620" cy="800" r="200" fill="url(#doorglow)" />
          <path d="M556 880 L556 790 A64 64 0 0 1 684 790 L684 880 Z" fill="#2a1910" />
          <path id="${id}-door" d="M572 880 L572 792 A48 48 0 0 1 668 792 L668 880 Z" fill="#ffcf7a" />
          <path d="M596 880 L596 760 M620 880 L620 746 M644 880 L644 760" stroke="#b07a3a" stroke-width="2.5" opacity="0.5" />
          <circle cx="652" cy="840" r="5.5" fill="#8a5a22" />
          <circle cx="600" cy="560" r="28" fill="#2a1910" />
          <circle id="${id}-win" cx="600" cy="560" r="19" fill="#ffd88f" />
          <path d="M600 541 L600 579 M581 560 L619 560" stroke="#2a1910" stroke-width="3" />
          ${flowersM(40, 900, 1900, 860, false)}
          ${cloverM(40, 900, 1040)}`;
      }

      function hillM() {
        return `
          <path d="M0 1080 L0 990 Q700 930 1600 440 Q1720 390 1920 470 L1920 1080 Z" fill="url(#hillMid)" />
          <path d="M0 990 Q700 930 1600 440 Q1720 390 1920 470" fill="none" stroke="#9fb8e6" stroke-width="3" opacity="0.3" />
          <path d="M0 1080 L0 1030 Q760 980 1660 520 Q1760 480 1920 540 L1920 1080 Z" fill="url(#hillNear)" opacity="0.6" />`;
      }
      const H = { x0: 0, y0: 990, cx: 700, cy: 930, x1: 1600, y1: 440 };
      function hill(t) {
        const u = 1 - t;
        return {
          x: u * u * H.x0 + 2 * u * t * H.cx + t * t * H.x1,
          y: u * u * H.y0 + 2 * u * t * H.cy + t * t * H.y1,
          a: (Math.atan2(2 * u * (H.cy - H.y0) + 2 * t * (H.y1 - H.cy), 2 * u * (H.cx - H.x0) + 2 * t * (H.x1 - H.cx)) * 180) / Math.PI,
        };
      }

      function crookedTreeM(k) {
        return `<g transform="scale(${k})">
          <path d="M0 0 Q-30 -90 10 -170 Q40 -230 -20 -290 L-6 -298 Q60 -230 30 -168 Q0 -90 26 0 Z" fill="url(#barkG)" />
          <path d="M8 -20 Q-10 -90 18 -160 M16 -200 Q30 -240 0 -280" stroke="#2a1910" stroke-width="3" fill="none" opacity="0.5" />
          <path d="M-10 -260 Q-90 -270 -170 -250" stroke="#4a3226" stroke-width="16" fill="none" stroke-linecap="round" />
          <path d="M20 -200 Q80 -230 120 -300" stroke="#4a3226" stroke-width="12" fill="none" stroke-linecap="round" />
          ${canopyM([[130, -320, 46, "leafDark"], [-20, -320, 56, "leafG"], [-190, -262, 34, "leafDark"]])}
        </g>`;
      }
