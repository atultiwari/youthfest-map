// Turn-by-turn directions generated from the journey geometry.
// Evidence: cleanroom/fixtures/_source/app.js (directions(), usesConnector()).

import type { JourneyItem, Step, ZoneId } from "../types";
import { ZONES, theName } from "../data/zones";
import { road, LANDMARK } from "../data/graph";

/** True when the route uses the Amphitheatre connector (triggers the closed-road notice). */
export function usesConnector(items: readonly JourneyItem[]): boolean {
  return items.some((it) => it.node === "B") && items.some((it) => it.node === "T4");
}

export function directions(from: ZoneId, to: ZoneId, items: JourneyItem[]): Step[] {
  const B = ZONES[to];
  const steps: Step[] = [];
  steps.push({
    k: "start",
    t: from === "entry" ? "Start at FC College Gate 2" : "Start at " + theName(ZONES[from]),
    at: 0,
  });

  let skip = -1;
  if (from !== "entry" && !items[0].node && items[1] && items[1].node && items[2] && items[2].node) {
    // leaving a zone: one combined instruction for stepping out onto the first road
    const it = items[1], nx = items[2];
    const a: [number, number] = [it.p[0] - items[0].p[0], it.p[1] - items[0].p[1]];
    const b: [number, number] = [nx.p[0] - it.p[0], nx.p[1] - it.p[1]];
    const cross = (a[0] * b[1] - a[1] * b[0]) / (Math.hypot(...a) * Math.hypot(...b));
    const turn = Math.abs(cross) >= 0.5 ? (cross > 0 ? "right" : "left") : null;
    steps.push({
      k: turn || "straight",
      t:
        "Leave " + theName(ZONES[from]) +
        (turn ? " and turn " + turn + " onto " : " and walk along ") +
        road(it.node as string, nx.node as string),
      at: it.at,
    });
    skip = 1;
  } else {
    const firstNet = items.findIndex((it, i) => it.node && items[i + 1] && items[i + 1].node);
    if (firstNet >= 0) {
      steps.push({
        k: "straight",
        t: "Walk along " + road(items[firstNet].node as string, items[firstNet + 1].node as string),
        at: items[firstNet].at + 1,
      });
    }
  }

  for (let i = 1; i < items.length - 1; i++) {
    const it = items[i], nx = items[i + 1];
    if (i === skip || !it.node || !nx.node) continue; // the last hop into a zone is the arrival
    const a: [number, number] = [it.p[0] - items[i - 1].p[0], it.p[1] - items[i - 1].p[1]];
    const b: [number, number] = [nx.p[0] - it.p[0], nx.p[1] - it.p[1]];
    const cross = (a[0] * b[1] - a[1] * b[0]) / (Math.hypot(...a) * Math.hypot(...b));
    if (Math.abs(cross) < 0.5) {
      const pv = items[i - 1];
      if (pv.node && LANDMARK[it.node] && road(pv.node, it.node) !== road(it.node, nx.node)) {
        steps.push({
          k: "straight",
          t: LANDMARK[it.node] + ", continue straight onto " + road(it.node, nx.node),
          at: it.at,
        });
      }
      continue;
    }
    const dir = cross > 0 ? "right" : "left";
    const lm = LANDMARK[it.node];
    steps.push({
      k: dir,
      t: (lm ? lm + ", turn " : "Turn ") + dir + " onto " + road(it.node, nx.node),
      at: it.at,
    });
  }

  let side = "ahead";
  const L = items.length - 1, last = items[L];
  if (!last.node && L >= 2) {
    const pv = items[L - 1], pp = items[L - 2];
    const a: [number, number] = [pv.p[0] - pp.p[0], pv.p[1] - pp.p[1]];
    const b: [number, number] = [last.p[0] - pv.p[0], last.p[1] - pv.p[1]];
    const cross = (a[0] * b[1] - a[1] * b[0]) / (Math.hypot(...a) * Math.hypot(...b) || 1);
    side = Math.abs(cross) < 0.4 ? "ahead" : cross > 0 ? "on your right" : "on your left";
  }

  let arrive =
    to === "commercial"
      ? "You’re at the Commercial Stalls. Stalls line both sides of the walkway."
      : `Arrive at ${theName(B)}. It’s ${side === "ahead" ? "straight ahead" : side}.`;
  if (to === "experience") arrive = "Enter Fergusson College Ground on your right. The Experience Zone is on the far side, beyond the Main Stage.";
  if (to === "mainstage") arrive = "Enter Fergusson College Ground on your right. The Main Stage is just inside.";
  steps.push({ k: "arrive", t: arrive, at: last.at });
  return steps;
}
