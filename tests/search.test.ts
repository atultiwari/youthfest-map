import { describe, it, expect } from "vitest";
import { searchStalls } from "../src/lib/search";
import { interactions } from "./fixtures";

describe("search parity with the oracle", () => {
  it.each(interactions.queries.map((q) => [q.term, q] as const))(
    "query %s returns the same results in the same order",
    (_term, q) => {
      const res = searchStalls(q.term);
      const keys = [...res.zones.map((z) => `zone:${z}`), ...res.stalls.map((s) => s.key)];
      const expected = q.items.map((i) => i.k);
      expect(keys).toEqual(expected);
      expect(keys.length).toBe(q.count);
    },
  );

  it("returns nothing for an unmatched query", () => {
    const empty = interactions.queries.find((q) => q.empty);
    expect(empty).toBeDefined();
    const res = searchStalls(empty!.term);
    expect(res.zones.length + res.stalls.length).toBe(0);
  });
});
