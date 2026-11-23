import { defineConfig } from "vitest/config";

// base must match the GitHub Pages project path: https://<user>.github.io/youthfest-map/
export default defineConfig({
  base: "/youthfest-map/",
  build: { outDir: "dist" },
  test: { environment: "node" },
});
