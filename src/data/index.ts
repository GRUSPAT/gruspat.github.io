import type { Tile } from "../store/types";
import { heroTiles } from "./sections/hero";
import { projectsTiles } from "./sections/projects";
import { achievementsTiles } from "./sections/achievements";
import { hobbyTiles } from "./sections/hobby";
import { contactTiles } from "./sections/contact";

export * from "./settings";
export * from "./types";
export * from "./factories";
export * from "./sections/hero";
export * from "./sections/projects";
export * from "./sections/achievements";
export * from "./sections/hobby";
export * from "./sections/contact";
export * from "./tags";

export const sectionTilesMap: Record<string, Tile[]> = {
  hero: heroTiles,
  projects: projectsTiles,
  achievements: achievementsTiles,
  hobby: hobbyTiles,
  contact: contactTiles,
};
