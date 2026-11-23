// Zone detail panel: per-zone layout, hints, note cards and the stall directory.
// Evidence: cleanroom/fixtures/_source/app.js (renderZone(), svgWrap(), rows()).

import type { DestZoneId } from "../types";
import { ZONES } from "../data/zones";
import { STALLS, RAW, cubeText } from "../data/stalls";
import { svgIcon } from "../data/icons";
import { $, esc } from "./dom";
import { state } from "./state";
import {
  type Layout,
  layoutCommercial, layoutFood, layoutExperience, layoutStage, layoutStartup, layoutArt,
} from "./layouts";

function svgWrap([W, H, inner, minPx]: Layout): string {
  const style = minPx
    ? `width:${state.zoom * minPx}px;max-width:none;height:auto`
    : `width:${state.zoom * 100}%;max-width:${state.zoom === 1 ? Math.max(W, 420) + "px" : "none"};height:auto`;
  return `<svg viewBox="0 0 ${W} ${H}" style="${style}">${inner}</svg>`;
}

function rows(keys: string[]): string {
  return keys
    .filter((k) => STALLS[k])
    .map((k) => {
      const st = STALLS[k];
      const extra = st.tag || st.cubes ? `<br><span class="s">${esc([st.tag, cubeText(st.cubes)].filter(Boolean).join(" · "))}</span>` : "";
      return `<button class="row" data-k="${k}"><span class="tagno" style="background:${ZONES[st.zone].color}">${st.label.replace("Stall ", "")}</span><span><span class="t">${esc(st.name)}</span>${extra}</span></button>`;
    })
    .join("");
}

const SUB: Record<DestZoneId, string> = {
  commercial: "stalls across two pathways",
  food: "food stalls",
  experience: "exhibitors, including the Defence Corridor",
  mainstage: "Ceremonies, cultural performances and the live band",
  startup: "startups from young founders",
  art: "hands-on art and craft stalls",
  amphitheatre: "Talks, career sessions and the hackathon finals",
  kimaya: "Street plays, drawing competition and pottery",
};

function subtitle(z: DestZoneId, count: number): string {
  switch (z) {
    case "commercial": return `${count} ${SUB.commercial}`;
    case "food": return `${count} ${SUB.food}`;
    case "experience": return `${count} ${SUB.experience}`;
    case "startup": return `${count} ${SUB.startup}`;
    case "art": return `${count} ${SUB.art}`;
    default: return SUB[z];
  }
}

function layoutFor(z: DestZoneId, color: string): { layout: Layout; keys: string[] } | null {
  switch (z) {
    case "commercial": return { layout: layoutCommercial(color), keys: [...RAW.P1A, ...RAW.P1B, ...RAW.P2C, ...RAW.P2D].map((r) => "c-" + r[0]) };
    case "food": return { layout: layoutFood(color), keys: Object.keys(RAW.FOOD).map((p) => "f-" + p) };
    case "experience": return { layout: layoutExperience(color), keys: RAW.EXPL.map((e) => "x-" + e[0]) };
    case "startup": return { layout: layoutStartup(color), keys: RAW.STARTUP.map((r) => "g-" + r[0]) };
    case "mainstage": return { layout: layoutStage(color), keys: [] };
    case "art": return { layout: layoutArt(color), keys: RAW.ART.map((r) => "aa-" + r[0]) };
    default: return null;
  }
}

export function renderZone(): void {
  const z = state.zone;
  const box = $("#zone");
  if (!box) return;
  if (!z) {
    box.innerHTML = "";
    return;
  }
  const Z = ZONES[z];
  const count = Object.values(STALLS).filter((s) => s.zone === z).length;
  const sub = subtitle(z, count);
  const picked = layoutFor(z, Z.color);

  let body = "";
  if (picked) {
    body += `<div class="layoutbox"><div class="zoom"><button data-zoom="-1" aria-label="Zoom out">−</button><button data-zoom="1" aria-label="Zoom in">+</button></div>${svgWrap(picked.layout)}</div>`;
    body += `<div class="hint">Tap a stall for details. Use + and − to zoom, and drag to move around.${z === "experience" ? " The ground is wide, so swipe sideways to see all of it." : ""}${z === "startup" ? " All eight stalls are in one line, so swipe sideways. Grey stalls are not allocated yet." : ""}</div>`;
    if (z === "mainstage") body += `<div class="note"><strong>Ceremonies and performances</strong>The stage faces the seating area, with the green room behind the stage. See the festival agenda for timings.</div>`;
    if (picked.keys.length) body += `<div class="list"><h3>Stall directory</h3>${rows(picked.keys)}</div>`;
  } else {
    body += `<div class="note"><strong>${Z.name}</strong>${sub}. See the festival agenda for session timings.</div>`;
  }

  box.innerHTML = `<div class="panel zone" style="--zc:${Z.color}"><div class="zhead"><span class="ic">${svgIcon(z)}</span><div><h2>${Z.n}. ${Z.name}</h2><p>${sub}</p></div></div><div class="zbody">${body}</div></div>`;
  const lb = box.querySelector<HTMLElement>(".layoutbox");
  if (lb && z === "commercial") lb.scrollTop = lb.scrollHeight;
}
