// Zones — ported verbatim from the live original.
// Evidence: cleanroom/fixtures/_source/app.js (const ZONES, ORDER, theName()).
// Numbered in walking order, same as the printed standees.

import type { Zone, ZoneId, DestZoneId } from "../types";

export const ZONES: Record<ZoneId, Zone> = {
  entry: {
    n: "", name: "Entry & Registration", short: "Entry", color: "#334155", node: "E",
    mk: [300, 1000], door: [300, 1000], sub: "FC College Gate 2",
    how: "FC College Gate 2 on FC Road. Registration desks are just inside the gate.",
  },
  commercial: {
    n: 1, name: "Commercial Stalls", short: "Commercial stalls", color: "#2563EB", node: "C",
    mk: [336, 790], door: [300, 790],
    how: "Straight ahead from FC College Gate 2. Stalls line both sides of the walkway: Pathway 1 (A and B stalls) comes first, followed by Pathway 2 (C and D stalls).",
  },
  startup: {
    n: 2, name: "Youth Startup Zone", short: "Youth startups", color: "#16A34A", node: "S",
    mk: [180, 632], door: [210, 572],
    how: "Walk through the commercial stalls to the junction and turn left. The Youth Startup Zone is on your left, just past the junction.",
  },
  kimaya: {
    n: 3, name: "Kimaya", short: "Kimaya", color: "#0891B2", node: "K",
    mk: [574, 624], door: [624, 582], the: false,
    how: "At the junction after the commercial stalls, turn right and follow the road to its end.",
  },
  art: {
    n: 4, name: "Art & Craft Experience Zone", short: "Art & craft", color: "#D97706", node: "AR",
    mk: [606, 480], door: [534, 480],
    how: "At the junction, turn right, then take the first left. The Art & Craft Zone is on your right.",
  },
  amphitheatre: {
    n: 5, name: "N. M. Wadia Amphitheatre", short: "Amphitheatre", color: "#7C3AED", node: "AM",
    mk: [344, 341], door: [395, 382],
    how: "At the junction, turn right and take the first left past the Art & Craft Zone. At the end, turn left. The Amphitheatre entrance is on your right. The direct road from the junction is closed.",
  },
  food: {
    n: 6, name: "Food Court", short: "Food court", color: "#EA580C", node: "QF",
    mk: [82, 226], door: [274, 226],
    how: "Follow the route towards the Amphitheatre, continue to the main road and turn right. The Food Court is on your left.",
  },
  mainstage: {
    n: 7, name: "Main Stage", short: "Main stage", color: "#4338CA", node: "QM",
    mk: [433, 150], door: [336, 181],
    how: "Follow the route towards the Amphitheatre, continue to the main road and turn right. The Main Stage is on your right, inside Fergusson College Ground.",
  },
  experience: {
    n: 8, name: "Experience Zone", short: "Experience zone", color: "#DB2777", node: "QM",
    mk: [615, 150], door: [336, 181],
    how: "Follow the route towards the Amphitheatre, continue to the main road and turn right. Enter Fergusson College Ground on your right, the same entrance as the Main Stage. The Experience Zone is on the far side of the ground.",
  },
};

export const ORDER: readonly DestZoneId[] = [
  "commercial", "startup", "kimaya", "art", "amphitheatre", "food", "mainstage", "experience",
];

/** "the <name>" unless the zone opts out (Kimaya). Matches the original's theName(). */
export function theName(z: Zone): string {
  return (z.the === false ? "" : "the ") + z.name;
}
