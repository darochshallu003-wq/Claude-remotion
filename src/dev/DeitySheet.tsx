import React from "react";
import { AbsoluteFill } from "remotion";
import { KraftBg } from "../mitti/kraft";
import { HEAD, MONO } from "../onion/theme";
import { Yamraj, Yamuna } from "../bhaidooj/deities";

// Model sheet for the Bhai Dooj deities: each pose the short uses.
const Cell: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ width: 500, display: "flex", flexDirection: "column", alignItems: "center" }}>
    {children}
    <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 2, color: "#231F1C", marginTop: 10 }}>{label}</div>
  </div>
);

export const DeitySheet: React.FC = () => (
  <AbsoluteFill>
    <KraftBg />
    <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontFamily: HEAD, fontWeight: 700, fontSize: 64, color: "#231F1C" }}>YAMRAJ · YAMUNA</div>
    <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", flexWrap: "wrap", justifyContent: "center", rowGap: 40 }}>
      <Cell label="YAMRAJ · STERN"><Yamraj size={380} /></Cell>
      <Cell label="YAMRAJ · VARDAAN"><Yamraj size={380} expression="smile" bless={1} aura={1} tilak={1} /></Cell>
      <Cell label="YAMUNA · LOTUS"><Yamuna size={380} aura={1} /></Cell>
      <Cell label="YAMUNA · NAMASTE"><Yamuna size={380} holding="namaste" expression="laugh" /></Cell>
    </div>
  </AbsoluteFill>
);
