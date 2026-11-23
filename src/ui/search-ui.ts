// Search dropdown rendering. Evidence: cleanroom/fixtures/_source/app.js (#q input handler).
// Matching logic lives in src/lib/search.ts (oracle-verified).

import { ZONES } from "../data/zones";
import { norm, searchStalls } from "../lib/search";
import { $, esc } from "./dom";

export function renderSearch(raw: string): void {
  const out = $("#results");
  if (!out) return;
  if (!norm(raw).trim()) {
    out.classList.remove("on");
    return;
  }
  const { zones, stalls } = searchStalls(raw);
  let html = zones
    .map(
      (z) =>
        `<button class="res" data-k="zone:${z}"><span class="tagno" style="background:${ZONES[z].color}">Zone ${ZONES[z].n}</span><span><span class="t">${ZONES[z].name}</span><br><span class="z">Walk me there</span></span></button>`,
    )
    .join("");
  html += stalls
    .map(
      (st) =>
        `<button class="res" data-k="${st.key}"><span class="tagno" style="background:${ZONES[st.zone].color}">${st.label.replace("Stall ", "")}</span><span><span class="t">${esc(st.name)}</span><br><span class="z">${ZONES[st.zone].name}${st.zone === "commercial" ? ", " + st.sub : ""}</span></span></button>`,
    )
    .join("");
  out.innerHTML = html || `<div class="empty">Nothing matches “${esc(raw)}”. Try one word from the stall or college name.</div>`;
  out.classList.add("on");
}
