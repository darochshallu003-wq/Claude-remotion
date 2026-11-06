import { AbsoluteFill } from "remotion";
import { AttarWale, Aman, Riya } from "../mitti/people";

// Dev-only preview of the illustrated cast and their expressions.
export const CastSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#C4A271", flexDirection: "row", flexWrap: "wrap", alignContent: "flex-start", gap: 20, padding: 20 }}>
    <Riya size={330} expression="smell" />
    <Riya size={330} expression="grin" />
    <Aman size={330} expression="disgust" />
    <Aman size={330} expression="neutral" />
    <AttarWale size={330} />
    <Aman size={330} expression="smile" phone />
  </AbsoluteFill>
);
