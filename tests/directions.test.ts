import { describe, it, expect } from "vitest";
import { journey } from "../src/lib/pathfinding";
import { directions, usesConnector } from "../src/lib/directions";
import type { ZoneId } from "../src/types";
import { oracle } from "./fixtures";

const nonSelf = Object.entries(oracle.routes).filter(([, r]) => !r.self);

describe("directions parity with the oracle (all from→to routes)", () => {
  it.each(nonSelf)("%s produces the same turn-by-turn text", (key, route) => {
    const [from, to] = key.split("->") as [ZoneId, ZoneId];
    const items = journey(from, to);
    const mine = directions(from, to, items).map((s) => ({ k: s.k, t: s.t }));
    const expected = (route.steps ?? []).map((s) => ({ k: s.k, t: s.t }));
    expect(mine).toEqual(expected);
  });

  it.each(nonSelf)("%s flags the connector the same way", (key, route) => {
    const [from, to] = key.split("->") as [ZoneId, ZoneId];
    expect(usesConnector(journey(from, to))).toBe(route.usesConnector);
  });
});

describe("directions landmarks", () => {
  it("includes the closed-road connector routes", () => {
    const amph = oracle.routes["entry->amphitheatre"];
    expect(amph.usesConnector).toBe(true);
  });
});
