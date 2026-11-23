import { describe, it, expect } from "vitest";
import { shortest, journey, same } from "../src/lib/pathfinding";
import { ZONES } from "../src/data/zones";
import type { ZoneId } from "../src/types";
import { oracle } from "./fixtures";

describe("shortest path", () => {
  it("returns a single node for identical endpoints", () => {
    expect(shortest("E", "E")).toEqual(["E"]);
  });
  it("routes entry→mainstage via the connector nodes", () => {
    const p = shortest("E", "QM");
    expect(p[0]).toBe("E");
    expect(p.at(-1)).toBe("QM");
    expect(p).toContain("B");
    expect(p).toContain("T4");
  });
});

describe("journey", () => {
  it("starts/ends at the right doors", () => {
    const j = journey("entry", "commercial");
    expect(same(j[j.length - 1].p, ZONES.commercial.door)).toBe(true);
  });

  const nonSelf = Object.entries(oracle.routes).filter(([, r]) => !r.self);
  it.each(nonSelf)("%s matches the oracle's journey geometry", (key, route) => {
    const [from, to] = key.split("->") as [ZoneId, ZoneId];
    const mine = journey(from, to).map((it) => ({
      p: [Math.round(it.p[0]), Math.round(it.p[1])],
      node: it.node,
      at: Math.round(it.at),
    }));
    expect(mine).toEqual(route.points);
  });
});
