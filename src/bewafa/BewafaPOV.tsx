import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Mood, Pose, Presenter } from "../aasmaan/Presenter";
import { BOLD, K, MONO, pop, popIn, segments, Sticker } from "../aasmaan/ui";

// "POV: bewafa" — a 21 s heartbreak story reel made to carry a trending song
// that the poster adds from Instagram's own music library, so the file itself
// is silent. Six beats of 3.5 s each; all on-screen text is original (no
// lyrics). The curly-haired presenter acts it out: in love, waiting on a
// reply, left on "online", the story, the BEWAFA stamp, then "tag them".

const BEAT = 105; // 3.5 s
export const BEWAFA_TOTAL_FRAMES = BEAT * 6;
const HANDLE = "@mythmitao";

type Beat = { title: string; thought: string; pose: Pose; mood: Mood; Card: React.FC };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const NIGHT = "#1B2240";

const Heart: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({ size, color = K.pink, style }) => (
  <svg viewBox="0 0 100 92" width={size} height={size * 0.92} style={{ overflow: "visible", ...style }}>
    <path d="M50 88 C 18 64, 2 46, 2 27 C 2 12, 14 2, 28 2 C 38 2, 46 8, 50 16 C 54 8, 62 2, 72 2 C 86 2, 98 12, 98 27 C 98 46, 82 64, 50 88 Z" fill={color} stroke={K.ink} strokeWidth={6} strokeLinejoin="round" />
    <path d="M22 18 C 16 22, 14 28, 15 34" fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
  </svg>
);

/** A chat phone mock-up. */
const Phone: React.FC<{ status: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }> = ({ status, children, style }) => (
  <Sticker bg="#F6F7FB" style={{ left: 190, top: 400, width: 700, height: 880, overflow: "hidden", borderRadius: 48, ...style }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 30px", borderBottom: `4px solid ${K.ink}`, background: K.white }}>
      <div style={{ width: 76, height: 76, borderRadius: 38, border: `4px solid ${K.ink}`, background: "#FFC2D1", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Heart size={40} />
      </div>
      <div>
        <div style={{ fontFamily: BOLD, fontSize: 40, color: K.ink }}>meri jaan</div>
        <div style={{ fontFamily: MONO, fontSize: 28, color: K.muted }}>{status}</div>
      </div>
    </div>
    <div style={{ padding: "30px 30px", display: "flex", flexDirection: "column", gap: 22 }}>{children}</div>
  </Sticker>
);

const Msg: React.FC<{ text: string; mine?: boolean; p: number; meta?: string }> = ({ text, mine, p, meta }) => (
  <div style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: 520, ...popIn(p, mine ? 2 : -2), transformOrigin: mine ? "100% 50%" : "0% 50%" }}>
    <div
      style={{
        background: mine ? K.skyDeep : K.white,
        color: mine ? K.white : K.ink,
        border: `4px solid ${K.ink}`,
        borderRadius: 26,
        padding: "14px 24px",
        fontFamily: BOLD,
        fontSize: 40,
      }}
    >
      {text}
    </div>
    {meta && <div style={{ fontFamily: MONO, fontSize: 24, color: K.muted, textAlign: mine ? "right" : "left", marginTop: 6 }}>{meta}</div>}
  </div>
);

// ---------------------------------------------------------------- the six cards

const InLove: React.FC = () => {
  const f = useCurrentFrame();
  const h = pop(f, 4, 8);
  const tag = pop(f, 22, 9);
  const beat = 1 + 0.06 * Math.max(0, Math.sin(f / 4.5));
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 290, top: 460, transform: `scale(${beat})`, ...popIn(h, -6) }}>
        <Heart size={500} />
      </div>
      {[
        [170, 520, 70, 0],
        [840, 600, 90, 10],
        [210, 1010, 60, 20],
        [860, 1000, 70, 30],
      ].map(([x, y, s, d], i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y - ((f + d * 3) % 90) * 1.4, opacity: interpolate((f + d * 3) % 90, [0, 15, 70, 90], [0, 1, 1, 0]) }}>
          <Heart size={s} color={i % 2 ? K.red : "#FF8FB0"} />
        </div>
      ))}
      <Sticker bg={K.yellow} style={{ left: 400, top: 1000, padding: "8px 32px", ...popIn(tag, 4) }}>
        <span style={{ fontFamily: BOLD, fontSize: 56, color: K.ink }}>forever?</span>
      </Sticker>
    </AbsoluteFill>
  );
};

const Waiting: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Phone status="last seen 11:42 PM">
        <Msg text="good night jaan" p={pop(f, 6)} meta="11:40 PM" />
        <Msg text="kal milte hain na?" mine p={pop(f, 24)} meta="11:41 PM · seen" />
        <Msg text="hello??" mine p={pop(f, 50)} meta="12:58 AM · seen" />
        <Msg text="kuch toh bolo" mine p={pop(f, 72)} meta="2:14 AM · seen" />
      </Phone>
    </AbsoluteFill>
  );
};

const Online: React.FC = () => {
  const f = useCurrentFrame();
  const typing = f % 50 < 30 && f > 12;
  const dots = Math.floor(f / 6) % 4;
  return (
    <AbsoluteFill>
      <Phone
        status={
          <span style={{ color: K.teal }}>
            <span style={{ display: "inline-block", width: 16, height: 16, borderRadius: 8, background: K.teal, marginRight: 10, opacity: f % 20 < 12 ? 1 : 0.3 }} />
            {typing ? "typing" + ".".repeat(dots) : "online"}
          </span>
        }
      >
        <Msg text="kuch toh bolo" mine p={1} meta="2:14 AM · seen" />
        <Msg text="please" mine p={pop(f, 20)} meta="3:02 AM · seen" />
        <div
          style={{
            alignSelf: "flex-start",
            opacity: typing ? 1 : 0,
            border: `4px solid ${K.ink}`,
            borderRadius: 26,
            background: K.white,
            padding: "18px 26px",
            display: "flex",
            gap: 12,
          }}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 18, height: 18, borderRadius: 9, background: K.ink, transform: `translateY(${Math.sin(f / 3 + i) * 5}px)` }} />
          ))}
        </div>
      </Phone>
      <Sticker bg={K.red} style={{ left: 560, top: 1150, padding: "8px 26px", ...popIn(pop(f, 60, 8), 6) }}>
        <span style={{ fontFamily: BOLD, fontSize: 44, color: K.white }}>reply: 0</span>
      </Sticker>
    </AbsoluteFill>
  );
};

const Person: React.FC<{ x: number; color: string; hair: string }> = ({ x, color, hair }) => (
  <g transform={`translate(${x} 0)`}>
    <path d="M-90 640 C -90 520, -50 470, 0 470 C 50 470, 90 520, 90 640 Z" fill={color} stroke={K.ink} strokeWidth={6} />
    <circle cx={0} cy={400} r={70} fill="#2A2A33" stroke={K.ink} strokeWidth={6} />
    <path d={hair} fill="#2A2A33" stroke={K.ink} strokeWidth={6} />
  </g>
);

const Story: React.FC = () => {
  const f = useCurrentFrame();
  const card = pop(f, 2, 13);
  const heart = pop(f, 26, 7, 220);
  const tag = pop(f, 46, 9);
  const progress = interpolate(f, [0, BEAT], [0.05, 1], clamp);
  return (
    <AbsoluteFill>
      <Sticker bg="#2B2F45" style={{ left: 230, top: 390, width: 620, height: 900, overflow: "hidden", borderRadius: 34, ...popIn(card, -2) }}>
        <div style={{ position: "absolute", left: 20, right: 20, top: 18, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.35)" }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 4, background: K.white }} />
        </div>
        <div style={{ position: "absolute", left: 24, top: 46, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, padding: 5, background: `conic-gradient(${K.orange}, ${K.pink}, ${K.purple}, ${K.orange})` }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#FFC2D1", border: `3px solid #2B2F45` }} />
          </div>
          <span style={{ fontFamily: BOLD, fontSize: 32, color: K.white }}>meri jaan · 2m</span>
        </div>
        <svg viewBox="0 0 620 900" width="620" height="900" style={{ position: "absolute", left: 0, top: 0 }}>
          <defs>
            <linearGradient id="dusk2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FF8A5B" />
              <stop offset="1" stopColor="#6A3B8C" />
            </linearGradient>
          </defs>
          <rect y="150" width="620" height="750" fill="url(#dusk2)" />
          <circle cx="310" cy="420" r="120" fill="#FFD166" opacity={0.85} />
          <Person x={220} color="#C2272D" hair="M150 380 C 150 300, 290 300, 290 380 C 300 470, 280 520, 270 540 L 170 540 C 160 520, 140 470, 150 380 Z" />
          <Person x={400} color="#3E6E8E" hair="M336 380 C 330 320, 470 320, 464 380 C 440 350, 360 350, 336 380 Z" />
        </svg>
        <div style={{ position: "absolute", left: 250, top: 340, ...popIn(heart, 0) }}>
          <Heart size={120} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 70,
            textAlign: "center",
            ...popIn(tag, -3),
          }}
        >
          <span style={{ fontFamily: BOLD, fontSize: 46, color: K.ink, background: K.white, borderRadius: 14, padding: "6px 22px" }}>new beginnings</span>
        </div>
      </Sticker>
    </AbsoluteFill>
  );
};

const Stamp: React.FC = () => {
  const f = useCurrentFrame();
  const split = interpolate(f, [8, 30], [0, 1], clamp);
  const stamp = pop(f, 40, 7, 260);
  const shake = f >= 40 && f < 52 ? Math.sin(f * 3) * (52 - f) * 1.6 : 0;
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      {/* the heart cracks and falls apart */}
      <svg viewBox="0 0 100 92" width={520} height={478} style={{ position: "absolute", left: 280, top: 470, overflow: "visible" }}>
        <defs>
          <clipPath id="lefthalf">
            <path d="M-10 -10 L 50 -10 L 44 30 L 56 46 L 46 62 L 50 100 L -10 100 Z" />
          </clipPath>
          <clipPath id="righthalf">
            <path d="M110 -10 L 50 -10 L 44 30 L 56 46 L 46 62 L 50 100 L 110 100 Z" />
          </clipPath>
        </defs>
        {[
          ["lefthalf", -1],
          ["righthalf", 1],
        ].map(([id, dir]) => (
          <g key={id} clipPath={`url(#${id})`} transform={`translate(${Number(dir) * split * 14} ${split * split * 18}) rotate(${Number(dir) * split * 14} 50 88)`}>
            <path d="M50 88 C 18 64, 2 46, 2 27 C 2 12, 14 2, 28 2 C 38 2, 46 8, 50 16 C 54 8, 62 2, 72 2 C 86 2, 98 12, 98 27 C 98 46, 82 64, 50 88 Z" fill={K.pink} stroke={K.ink} strokeWidth={4} />
            <path d="M50 -10 L 50 16 L 44 30 L 56 46 L 46 62 L 50 100" fill="none" stroke={K.ink} strokeWidth={4} strokeLinejoin="round" />
          </g>
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 760,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(1, stamp * 3),
          transform: `scale(${2.6 - 1.6 * stamp}) rotate(-9deg)`,
        }}
      >
        <div
          style={{
            border: `12px solid ${K.red}`,
            borderRadius: 24,
            padding: "4px 40px",
            fontFamily: BOLD,
            fontSize: 170,
            color: K.red,
            letterSpacing: 6,
            background: "rgba(255,255,255,0.88)",
            boxShadow: `10px 10px 0 ${K.ink}`,
          }}
        >
          <span style={{ display: "inline-block", marginTop: 18 }}>BEWAFA</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Tag: React.FC = () => {
  const f = useCurrentFrame();
  const c = pop(f, 4, 12);
  const share = pop(f, 30, 8);
  const follow = pop(f, 52, 11);
  return (
    <AbsoluteFill>
      <Sticker style={{ left: 110, top: 470, width: 860, padding: "22px 30px", ...popIn(c, -2) }}>
        <div style={{ fontFamily: MONO, fontSize: 28, color: K.muted }}>comments</div>
        <div style={{ fontFamily: BOLD, fontSize: 48, color: K.ink, marginTop: 6, whiteSpace: "nowrap" }}>
          <span style={{ background: K.purple, color: K.white, borderRadius: 14, padding: "0 14px" }}>@tag_karo</span> ye tumhare liye
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <Heart size={40} />
          <span style={{ fontFamily: MONO, fontSize: 28, color: K.muted }}>2.4K · reply</span>
        </div>
      </Sticker>
      <Sticker bg={K.orange} style={{ left: 200, top: 800, padding: "10px 36px", ...popIn(share, 4) }}>
        <span style={{ fontFamily: BOLD, fontSize: 60, color: K.ink }}>share karo, dukh baanto</span>
      </Sticker>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, display: "flex", justifyContent: "center", opacity: follow, transform: `translateY(${(1 - follow) * 30}px)` }}>
        <span style={{ fontFamily: BOLD, fontSize: 44, color: K.white, background: K.ink, borderRadius: 999, padding: "10px 38px" }}>FOLLOW {HANDLE}</span>
      </div>
    </AbsoluteFill>
  );
};

const BEATS: Beat[] = [
  { title: "POV: usne kaha *'sirf tum'*", thought: "duniya ka sabse *lucky* banda", pose: "open", mood: "happy", Card: InLove },
  { title: "raat *2 baje* tak...", thought: "bas *ek reply* aa jaye", pose: "phone", mood: "happy", Card: Waiting },
  { title: "*online* hai, reply nahi", thought: "typing... phir *gayab*", pose: "phone", mood: "sad", Card: Online },
  { title: "phir dekhi uski *story*", thought: "ye... *kaun* hai?!", pose: "rest", mood: "shock", Card: Story },
  { title: "dil ne ek hi *word* bola", thought: "...", pose: "rest", mood: "sad", Card: Stamp },
  { title: "*tag* karo us bewafa ko", thought: "dil toota hai, *wifi* nahi", pose: "point", mood: "sad", Card: Tag },
];

// ---------------------------------------------------------------- frame pieces

const Rain: React.FC<{ amount: number }> = ({ amount }) => {
  const f = useCurrentFrame();
  if (amount <= 0) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, opacity: amount }}>
      {Array.from({ length: 70 }, (_, i) => {
        const x = (i * 157) % 1180 - 50;
        const y = ((f * 38 + i * 271) % 2100) - 120;
        return <line key={i} x1={x} y1={y} x2={x - 14} y2={y + 70} stroke="#BFD4FF" strokeWidth={4} strokeLinecap="round" opacity={0.7} />;
      })}
    </svg>
  );
};

const Title: React.FC<{ text: string; dark: number }> = ({ text, dark }) => (
  <span style={{ fontFamily: BOLD, fontSize: 70, letterSpacing: -1, color: dark > 0.5 ? K.white : K.ink }}>
    {segments(text).map((s, i) =>
      s.hl ? (
        <span key={i} style={{ color: K.pink, fontStyle: "italic", display: "inline-block", transform: "skewX(-8deg)", margin: "0 6px" }}>
          {s.text}
        </span>
      ) : (
        <span key={i}>{s.text}</span>
      ),
    )}
  </span>
);

/** Thought bubble beside the presenter, words appearing one after another. */
const Thought: React.FC<{ text: string; local: number }> = ({ text, local }) => {
  const p = pop(local, 10, 12, 240);
  const segs = segments(text).map((g) => ({ hl: g.hl, words: g.text.split(" ").filter(Boolean) }));
  let wi = 0;
  return (
    <div style={{ position: "absolute", left: 560, top: 1390, maxWidth: 470, transformOrigin: "0% 70%", transform: `scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 2.5) }}>
      {/* thought dots towards the head */}
      {[
        [-34, 70, 14],
        [-62, 92, 9],
      ].map(([x, y, r], i) => (
        <div key={i} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: r, background: K.white, border: `4px solid ${K.ink}` }} />
      ))}
      <div
        style={{
          background: K.white,
          border: `5px solid ${K.ink}`,
          borderRadius: 36,
          boxShadow: `7px 7px 0 ${K.ink}`,
          padding: "16px 28px 18px",
          fontFamily: BOLD,
          fontSize: 46,
          lineHeight: 1.22,
          color: K.ink,
        }}
      >
        {segs.map((g, gi) => {
          const first = wi;
          wi += g.words.length;
          const words = g.words.map((w, k) => (
            <span key={k} style={{ opacity: local >= 14 + (first + k) * 7 ? 1 : 0.15 }}>
              {w}
              {k < g.words.length - 1 ? " " : ""}
            </span>
          ));
          return (
            <React.Fragment key={gi}>
              {g.hl ? <span style={{ background: K.purple, color: K.white, borderRadius: 12, padding: "0 10px" }}>{words}</span> : words}{" "}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export const BewafaPOV: React.FC = () => {
  const frame = useCurrentFrame();
  const bi = Math.min(BEATS.length - 1, Math.floor(frame / BEAT));
  const local = frame - bi * BEAT;
  const b = BEATS[bi];
  const prev = BEATS[Math.max(0, bi - 1)];
  // night falls as the story goes on
  const dark = interpolate(frame, [BEAT * 1.6, BEAT * 2.4], [0, 1], clamp);
  const rain = interpolate(frame, [BEAT * 2, BEAT * 3], [0, 0.6], clamp) + interpolate(frame, [BEAT * 4, BEAT * 4.4], [0, 0.4], clamp);
  const titleIn = pop(local, 0, 16, 160);
  const poseT = bi === 0 ? 1 : pop(local, 0, 14, 190);
  // "talking" to himself in short bursts while the thought appears
  const mouth = b.mood === "shock" || local < 14 || local > 60 ? 0 : Math.abs(Math.sin(local / 2.4)) * 0.6;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundColor: K.paper,
          backgroundImage: `radial-gradient(${K.dot} 2.6px, transparent 3px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: "20px 20px",
        }}
      />
      <AbsoluteFill style={{ background: NIGHT, opacity: dark * 0.92 }} />
      <AbsoluteFill style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.12) 2.6px, transparent 3px)`, backgroundSize: "40px 40px", backgroundPosition: "20px 20px", opacity: dark }} />

      {BEATS.map((beat, i) => (
        <Sequence key={i} from={i * BEAT} durationInFrames={BEAT}>
          <CardStage>
            <beat.Card />
          </CardStage>
        </Sequence>
      ))}

      <Rain amount={rain} />

      <div style={{ position: "absolute", left: 64, right: 64, top: 168 }}>
        <div style={{ fontFamily: MONO, fontSize: 34, color: dark > 0.5 ? "#B9A8FF" : K.purple }}>{`// part ${bi + 1} of 6 · bewafa`}</div>
        <div style={{ marginTop: 6, opacity: titleIn, transform: `translateY(${(1 - titleIn) * 26}px)` }}>
          <Title text={b.title} dark={dark} />
        </div>
      </div>
      <div style={{ position: "absolute", top: 96, left: 64, padding: "6px 18px", borderRadius: 999, border: `3px solid ${K.ink}`, background: K.white, fontFamily: MONO, fontSize: 26, color: K.ink }}>
        {HANDLE}
      </div>

      <div style={{ position: "absolute", left: -30, bottom: -40 }}>
        <Presenter width={600} frame={frame} pose={b.pose} prevPose={prev.pose} poseT={poseT} mouth={mouth} mood={b.mood} />
      </div>
      <Thought text={b.thought} local={local} />
    </AbsoluteFill>
  );
};

/** Each beat's card pops in and shrinks away at the cut. */
const CardStage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const p = pop(f, 0, 14, 170);
  const out = interpolate(f, [BEAT - 6, BEAT], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 2) * (1 - out), transform: `translateY(${(1 - p) * 60}px) scale(${0.92 + 0.08 * p - out * 0.05})` }}>
      {children}
    </AbsoluteFill>
  );
};
