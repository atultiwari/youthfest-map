import { describe, it, expect } from "vitest";
import { STALLS, fmtCubes, cubeText } from "../src/data/stalls";
import { ZONES, ORDER } from "../src/data/zones";
import { oracle } from "./fixtures";

describe("stall data vs oracle", () => {
  it("has 99 stalls total, matching the oracle", () => {
    expect(Object.keys(STALLS).length).toBe(99);
    expect(Object.keys(STALLS).length).toBe(oracle.stallTotal);
  });

  it("matches the oracle's full flat stall index exactly", () => {
    expect(STALLS).toEqual(oracle.stalls);
  });

  it("per-zone counts match the oracle", () => {
    for (const z of ORDER) {
      const n = Object.values(STALLS).filter((s) => s.zone === z).length;
      expect(n, z).toBe(oracle.counts[z]);
    }
  });

  it("excludes unallocated slots", () => {
    for (const k of ["c-12C", "c-8D", "g-G06", "g-G07"]) {
      expect(STALLS[k], k).toBeUndefined();
    }
  });
});

describe("cube formatting", () => {
  it("formats single, range and open cubes", () => {
    expect(fmtCubes([1])).toBe("1");
    expect(fmtCubes([40, 41, 42, 43, 44])).toBe("40–44");
    expect(fmtCubes(["Op1", "Op2"])).toBe("Op1–Op2");
  });
  it("labels cube text with the right singular/plural", () => {
    expect(cubeText("1")).toBe("Cube 1");
    expect(cubeText("40–44")).toBe("Cubes 40–44");
    expect(cubeText("")).toBe("");
  });
});

describe("zones", () => {
  it("has 8 destinations plus entry", () => {
    expect(ORDER.length).toBe(8);
    expect(Object.keys(ZONES).length).toBe(9);
  });
});
