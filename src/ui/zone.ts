// Zone detail panel. Full per-zone layouts (commercial/food/experience/startup/art/stage)
// and the stall directory are implemented in Batch 3; for now this clears the section.
// Evidence: cleanroom/fixtures/_source/app.js (renderZone(), layout* functions).

import { $ } from "./dom";

export function renderZone(): void {
  const box = $("#zone");
  if (box) box.innerHTML = "";
}
