import { AbsoluteFill } from "remotion";
import { AttarWale, Aman, Dadi, Mummy, Riya } from "../mitti/people";

// Dev-only preview of the illustrated cast and their expressions.
export const CastSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#C4A271", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", gap: 20, padding: 20 }}>
    <Mummy size={330} />
    <Mummy size={330} expression="disgust" />
    <Mummy size={330} expression="grin" phone />
    <Dadi size={330} />
    <Riya size={330} expression="smile" />
    <Aman size={330} expression="neutral" />
    <AttarWale size={330} />
  </AbsoluteFill>
);
