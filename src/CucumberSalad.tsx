import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";

// Poppins Bold (SIL OFL, see public/fonts/OFL.txt), bundled so renders
// don't need to reach Google Fonts.
const fontFamily = "Poppins";
loadFont({
  family: fontFamily,
  url: staticFile("fonts/Poppins-Bold.woff2"),
  weight: "700",
});

export const FPS = 30;
const s = (seconds: number) => Math.round(seconds * FPS);

type Item = { name: string; color: string; at: number };
type Group = { out: number; items: Item[] };

// Times (seconds) match when each ingredient appears in the source clip.
// Ingredients added in quick succession share a group, so their labels
// stack up and stay on screen long enough to read.
const GROUPS: Group[] = [
  { out: 13.6, items: [{ name: "Cucumber", color: "#3f9b3a", at: 2.0 }] },
  { out: 17.6, items: [{ name: "Greek Yogurt", color: "#7fb6d9", at: 14.0 }] },
  {
    out: 23.0,
    items: [
      { name: "Salt & Black Pepper", color: "#5b5b5b", at: 18.0 },
      { name: "Chilli Flakes", color: "#e0452b", at: 18.6 },
      { name: "Fresh Coriander", color: "#2f8f3a", at: 19.0 },
    ],
  },
  {
    out: 36.0,
    items: [
      { name: "Sesame Seeds", color: "#d9b77a", at: 29.7 },
      { name: "Pomegranate Seeds", color: "#c0182f", at: 30.9 },
    ],
  },
];

const Label: React.FC<{ item: Item; out: number }> = ({ item, out }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = s(item.at);
  const end = s(out);

  const enter = spring({
    frame: frame - start,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  const exit = interpolate(frame, [end - 8, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 28px 14px 18px",
        borderRadius: 999,
        background: "rgba(255,255,255,0.94)",
        boxShadow: "0 6px 18px rgba(0,0,0,0.28)",
        opacity: Math.min(enter, exit),
        transform: `translateX(${(1 - enter) * -60}px) scale(${
          0.85 + 0.15 * enter
        })`,
      }}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: 999,
          background: item.color,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily,
          fontWeight: 700,
          fontSize: 40,
          color: "#1d3b1a",
          whiteSpace: "nowrap",
        }}
      >
        {item.name}
      </span>
    </div>
  );
};

export const CucumberSalad: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile("cucumber-salad.mp4")} />
      {/* Lower-middle area: clear of the logo at the top and the
          YouTube Shorts buttons and caption at the bottom. */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "0 0 330px 36px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {GROUPS.flatMap((g) =>
            g.items
              .filter((it) => frame >= s(it.at) && frame < s(g.out))
              .map((it) => <Label key={it.name} item={it} out={g.out} />)
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
