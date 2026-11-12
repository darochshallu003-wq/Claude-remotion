// Which version is rendering: "grandma" (Indian town, the original timeline), "dadi" (Indian village, Dadi) or
// "grandma_en" (English town, Grandma). Set once by the composition before the world is built (one per render page).
export type Version = "grandma" | "dadi" | "grandma_en";
export let VERSION: Version = "grandma";
export const setVersion = (v: Version) => { VERSION = v; };
export const isEN = () => VERSION === "grandma_en";
export const isVillage = () => VERSION === "dadi";
