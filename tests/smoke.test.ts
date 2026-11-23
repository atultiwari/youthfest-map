import { describe, it, expect } from "vitest";
import { appVersion } from "../src/main";

describe("app scaffold", () => {
  it("exposes a version string", () => {
    expect(appVersion()).toBe("0.0.0");
  });
});
