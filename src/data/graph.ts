// Walkable network (Entry at the bottom). Barricaded stretches have no edge.
// Evidence: cleanroom/fixtures/_source/app.js (const N, EDGES, ROAD, LANDMARK, road()).

import type { NodeId, Point } from "../types";

export const N: Record<NodeId, Point> = {
  E: [300, 1000], C: [300, 790], J: [300, 560], S: [210, 560], B: [520, 560], K: [624, 560],
  AR: [520, 480], T4: [520, 400], AM: [395, 400], L3: [300, 400], QF: [300, 226], QM: [300, 181],
};

export const EDGES: readonly (readonly [NodeId, NodeId])[] = [
  ["E", "C"], ["C", "J"], ["J", "S"], ["J", "B"], ["B", "K"], ["B", "AR"],
  ["AR", "T4"], ["T4", "AM"], ["AM", "L3"], ["L3", "QF"], ["QF", "QM"],
];

export const ROAD: Record<string, string> = {
  "E-C": "the commercial walkway", "C-J": "the commercial walkway",
  "J-S": "the Startup road", "J-B": "the Kimaya road", "B-K": "the Kimaya road",
  "B-AR": "the connector road", "AR-T4": "the connector road",
  "T4-AM": "the Amphitheatre road", "AM-L3": "the Amphitheatre road",
  "L3-QF": "the main road", "QF-QM": "the main road",
};

export const LANDMARK: Record<NodeId, string> = {
  J: "At the junction", B: "At the next turn", T4: "At the corner", L3: "At the corner",
};

export function road(a: NodeId, b: NodeId): string {
  return ROAD[`${a}-${b}`] || ROAD[`${b}-${a}`] || "the road";
}
