import { makeEpisode, Shot } from "./kit";
import * as narak from "./narak/script";
import * as stories from "./stories/script";
import * as owl from "./owl/script";
import * as govardhan from "./govardhan/script";
import * as bhaidooj from "./bhaidooj/script";
import * as colours from "./colours/script";
import * as delhiair from "./delhiair/script";
import * as green from "./green/script";
import * as diyascience from "./diyascience/script";
import * as varq from "./varq/script";
import * as safai from "./safai/script";
import * as spacephoto from "./spacephoto/script";
import * as sweets from "./sweets/script";
import * as muhurat from "./muhurat/script";
import * as bahikhata from "./bahikhata/script";
import * as world from "./world/script";
import * as dice from "./dice/script";

// Diwali fact series. Each entry becomes a composition named `id`;
// voiceover lives in public/diwali/<slug>/vo.
type Ep = { id: string; slug: string; mod: { SCRIPT: Shot[]; HAS_VOICEOVER: boolean } };

export const LIST: Ep[] = [
  { id: "Diwali01Narak", slug: "narak", mod: narak },
  { id: "Diwali02Stories", slug: "stories", mod: stories },
  { id: "Diwali03Owl", slug: "owl", mod: owl },
  { id: "Diwali04Govardhan", slug: "govardhan", mod: govardhan },
  { id: "Diwali05BhaiDooj", slug: "bhaidooj", mod: bhaidooj },
  { id: "Diwali06Colours", slug: "colours", mod: colours },
  { id: "Diwali07DelhiAir", slug: "delhiair", mod: delhiair },
  { id: "Diwali08Green", slug: "green", mod: green },
  { id: "Diwali09DiyaScience", slug: "diyascience", mod: diyascience },
  { id: "Diwali10Varq", slug: "varq", mod: varq },
  { id: "Diwali11Safai", slug: "safai", mod: safai },
  { id: "Diwali12SpacePhoto", slug: "spacephoto", mod: spacephoto },
  { id: "Diwali13Sweets", slug: "sweets", mod: sweets },
  { id: "Diwali14Muhurat", slug: "muhurat", mod: muhurat },
  { id: "Diwali15BahiKhata", slug: "bahikhata", mod: bahikhata },
  { id: "Diwali16World", slug: "world", mod: world },
  { id: "Diwali17Dice", slug: "dice", mod: dice },
];

export const EPISODES = LIST.map((e) => {
  const ex = makeEpisode(e.slug, e.mod.SCRIPT, e.mod.HAS_VOICEOVER);
  return { id: e.id, Component: ex.Component, totalFrames: ex.totalFrames };
});
