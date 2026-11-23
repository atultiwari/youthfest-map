// Stall detail bottom sheet + "show on layout" highlight.
// Evidence: cleanroom/fixtures/_source/app.js (showStall(), closeSheet(), highlight()).

import { STALLS, cubeText } from "../data/stalls";
import { ZONES } from "../data/zones";
import { $, esc, reduced } from "./dom";

export function showStall(k: string): void {
  const st = STALLS[k];
  if (!st) return;
  const Z = ZONES[st.zone];
  const sh = $("#sheet");
  if (!sh) return;
  sh.style.setProperty("--zc", Z.color);
  sh.innerHTML = `<div class="grab"></div><span class="no" style="background:${Z.color}">${st.label}</span>
    <h3 id="sheetTitle">${esc(st.name)}</h3>${st.tag ? `<p class="tag">${esc(st.tag)}</p>` : ""}
    <dl><dt>Zone</dt><dd>${Z.n}. ${Z.name}${st.zone === "commercial" ? ", " + st.sub : ""}</dd>${st.cubes ? `<dt>Position</dt><dd>${cubeText(st.cubes)}</dd>` : ""}${st.by ? `<dt>Stall by</dt><dd>${esc(st.by)}</dd>` : ""}</dl>
    <div class="acts"><button class="btn" data-walk="${k}">Walk me there</button><button class="btn ghost" data-goto="${k}">Show on layout</button></div>`;
  sh.classList.add("on");
  $("#scrim")?.classList.add("on");
  setTimeout(() => sh.querySelector<HTMLElement>(".btn")?.focus(), 60);
}

export function closeSheet(): void {
  $("#sheet")?.classList.remove("on");
  $("#scrim")?.classList.remove("on");
}

export function highlight(k: string): void {
  requestAnimationFrame(() => {
    document.querySelectorAll(".hl").forEach((e) => e.classList.remove("hl"));
    const b = document.querySelector(`.st[data-k="${k}"]`);
    const r = document.querySelector(`.row[data-k="${k}"]`);
    b?.classList.add("hl");
    r?.classList.add("hl");
    (b || r || $("#zone"))?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center", inline: "center" });
  });
}
