// Directions panel, destinations grid and welcome banner.
// Evidence: cleanroom/fixtures/_source/app.js (renderDirections(), renderGrid(), renderWelcome()).

import type { DestZoneId, JourneyItem, Step, ZoneId } from "../types";
import { ZONES, ORDER, theName } from "../data/zones";
import { STALLS } from "../data/stalls";
import { svgIcon } from "../data/icons";
import { usesConnector } from "../lib/directions";
import { $ } from "./dom";
import { state } from "./state";

const WITH_LAYOUT: readonly DestZoneId[] = ["commercial", "food", "experience", "mainstage", "art", "startup"];

export function renderDirections(from: ZoneId, to: DestZoneId, steps: Step[], items: JourneyItem[]): void {
  const Z = ZONES[to];
  const box = $("#dir");
  if (!box) return;
  box.style.setProperty("--zc", Z.color);
  const hasLayout = WITH_LAYOUT.includes(to);
  box.innerHTML = `<div class="dirhead"><span class="ic">${svgIcon(to)}</span><div class="grow"><small>${from === "entry" ? "From FC College Gate 2" : "From " + theName(ZONES[from])}</small><strong>To ${theName(Z)}</strong></div>
      <button class="iconbtn" data-replay aria-label="Replay the walk">${svgIcon("replay", "currentColor", 2.2).replace("<svg", '<svg width="16" height="16"')}Replay</button></div>
    <ol class="steps">${steps.map((s) => `<li class="${s.k === "arrive" ? "arrive" : ""}"><span class="si">${svgIcon(s.k, "var(--muted)", 2.2)}</span><span class="tx">${s.t}</span></li>`).join("")}</ol>
    ${usesConnector(items) ? `<div class="notice">${svgIcon("block", "#E11D48", 2.4).replace("<svg", '<svg width="16" height="16" style="flex:none"')}<span>The direct road from the junction to the Amphitheatre is closed. This is the only way through.</span></div>` : ""}
    <div class="dirfoot">${hasLayout ? `<button class="btn" data-layout>See ${to === "mainstage" ? "the stage layout" : "stall layout"}</button>` : `<button class="btn" data-layout>About ${Z.short.toLowerCase()}</button>`}<button class="btn ghost" data-full>Full map</button></div>`;
  box.classList.add("on");
}

function gridSub(z: DestZoneId): string {
  const n = Object.values(STALLS).filter((s) => s.zone === z).length;
  const map: Record<DestZoneId, string> = {
    commercial: `${n} stalls`,
    food: `${n} food stalls`,
    experience: `${n} exhibitors`,
    mainstage: "Ceremonies and shows",
    startup: `${n} startups`,
    art: `${n} craft stalls`,
    amphitheatre: "Talks and sessions",
    kimaya: "Plays, art and pottery",
  };
  return map[z];
}

export function renderGrid(): void {
  const title = $("#destTitle");
  if (title) title.textContent = state.here && state.here !== "entry" ? "Where to next?" : "Where do you want to go?";
  const grid = $("#grid");
  if (!grid) return;
  grid.innerHTML = ORDER.map(
    (z) => `<button class="dcard${state.here === z ? " here" : ""}" style="--zc:${ZONES[z].color}" data-z="${z}" aria-pressed="${state.zone === z}">
      <span class="ic">${svgIcon(z)}<i>${ZONES[z].n}</i></span><span><span class="t">${ZONES[z].name}</span><span class="s">${state.here === z ? "You are here" : gridSub(z)}</span></span></button>`,
  ).join("");
}

export function renderWelcome(): void {
  const w = $("#welcome");
  if (!w) return;
  if (!state.here) {
    w.classList.remove("on");
    return;
  }
  const Z = ZONES[state.here];
  w.style.setProperty("--zc", Z.color);
  w.innerHTML = `<span class="ic">${svgIcon(state.here)}</span><div><small>${state.here === "entry" ? "Welcome to the festival" : "You are here"}</small><strong>${state.here === "entry" ? "FC College Gate 2" : Z.name}</strong><span>Pick a destination and we’ll walk you there.</span></div>`;
  w.classList.add("on");
}
