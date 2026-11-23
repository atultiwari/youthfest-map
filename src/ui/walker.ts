// The walking avatar + animated route reveal.
// Evidence: cleanroom/fixtures/_source/app.js (WALKER, playRoute(), markStep(), clearRoute()).

import type { DestZoneId, Step, ZoneId } from "../types";
import { ZONES, theName } from "../data/zones";
import { journey, same } from "../lib/pathfinding";
import { directions } from "../lib/directions";
import { $, MW, MH, reduced } from "./dom";
import { camTo, fitBox } from "./camera";
import { renderDirections } from "./panels";

const WALKER = `<g class="walker" id="walker"><g transform="scale(1.35)">
  <g id="beam"><path d="M0 0 L54 -20 A58 58 0 0 1 54 20 Z" fill="var(--route)" opacity=".2"/></g>
  <g class="hop"><circle r="21" fill="#fff" style="filter:drop-shadow(0 3px 6px rgba(15,23,42,.35))"/><circle r="18" fill="var(--route)"/>
    <g id="face"><svg x="-14" y="-15" width="28" height="28" viewBox="0 0 24 24" overflow="visible">
      <g class="bob" fill="none" stroke="#fff" stroke-width="2.3" stroke-linecap="round">
        <circle cx="13" cy="4.2" r="2.3" fill="#fff" stroke="none"/>
        <path d="M12.6 7.4 L11.4 13.4"/>
        <path class="ab" d="M12.6 8.2 L10 12.2" opacity=".75"/><path class="lb" d="M11.4 13.4 L9.6 20.4" opacity=".75"/>
        <path class="lf" d="M11.4 13.4 L14.2 20.2"/><path class="af" d="M12.6 8.2 L15.4 11.6"/>
      </g></svg></g></g></g></g>`;

interface Current {
  from: ZoneId;
  to: DestZoneId;
  steps: Step[];
  len: number;
}

let walkAnim = 0;
let current: Current | null = null;

export function getCurrent(): Current | null {
  return current;
}

export function clearRoute(): void {
  cancelAnimationFrame(walkAnim);
  current = null;
  const r = $("#routeLayer");
  const w = $("#walkerLayer");
  if (r) r.innerHTML = "";
  if (w) w.innerHTML = "";
}

export function markStep(dist: number, end = false): void {
  const lis = document.querySelectorAll<HTMLElement>(".steps li");
  if (!current || !lis.length) return;
  let a = 0;
  current.steps.forEach((s, i) => {
    if (dist >= s.at - 18) a = i;
  });
  if (end) a = current.steps.length - 1;
  lis.forEach((li, i) => {
    li.classList.toggle("active", i === a);
    li.classList.toggle("done", i < a);
  });
}

export function playRoute(from: ZoneId, to: DestZoneId): void {
  cancelAnimationFrame(walkAnim);
  const hint = $("#mapHint");

  // Main Stage and Experience Zone share one entrance.
  if (same(ZONES[from].door, ZONES[to].door)) {
    const rl = $("#routeLayer");
    const wl = $("#walkerLayer");
    if (rl) rl.innerHTML = "";
    if (wl) wl.innerHTML = "";
    const t =
      to === "experience"
        ? "The Experience Zone is in the same ground. Walk to the far side, beyond the Main Stage."
        : "The Main Stage is in the same ground, just inside the entrance from the main road.";
    current = { from, to, steps: [{ k: "arrive", t, at: 0 }], len: 0 };
    renderDirections(from, to, current.steps, []);
    markStep(1, true);
    camTo(fitBox([ZONES[from].mk, ZONES[to].mk]), 650);
    if (hint) hint.textContent = "Same entrance as " + theName(ZONES[from]);
    return;
  }

  const items = journey(from, to);
  const pts = items.map((it) => it.p);
  const steps = directions(from, to, items);
  const d = "M" + pts.map((p) => p.join(" ")).join(" L");
  const rl = $("#routeLayer");
  if (rl) {
    rl.innerHTML = `
    <path d="${d}" fill="none" stroke="var(--routeSoft)" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
    <mask id="reveal" maskUnits="userSpaceOnUse" x="0" y="0" width="${MW}" height="${MH}"><path id="revealPath" d="${d}" fill="none" stroke="#fff" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/></mask>
    <path d="${d}" fill="none" stroke="var(--route)" stroke-width="9" stroke-linecap="round" stroke-dasharray="0.1 17" mask="url(#reveal)"/>
    <path id="trackPath" d="${d}" fill="none" stroke="none"/>`;
  }
  const wl = $("#walkerLayer");
  if (wl) wl.innerHTML = WALKER;

  const track = $("#trackPath") as unknown as SVGGeometryElement | null;
  const reveal = $("#revealPath");
  if (!track || !reveal) return;
  const len = track.getTotalLength();
  reveal.setAttribute("stroke-dasharray", len + " " + len);
  current = { from, to, steps, len };
  renderDirections(from, to, steps, items);

  const w = $("#walker");
  const beam = $("#beam");
  const face = $("#face");
  if (!w || !beam || !face) return;
  let facing = 1;
  const place = (dist: number): void => {
    const p = track.getPointAtLength(dist);
    const q = track.getPointAtLength(Math.min(len, dist + 6));
    const r0 = track.getPointAtLength(Math.max(0, dist - 6));
    const dx = q.x - r0.x || 0.0001;
    const dy = q.y - r0.y;
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    w.setAttribute("transform", `translate(${p.x} ${p.y})`);
    beam.setAttribute("transform", `rotate(${ang})`);
    if (Math.abs(dx) > 0.8) facing = dx > 0 ? 1 : -1;
    face.setAttribute("transform", `scale(${facing} 1)`);
    reveal.setAttribute("stroke-dashoffset", String(len - dist));
    markStep(dist);
  };

  const finish = (): void => {
    w.classList.remove("walking");
    w.classList.add("arrived");
    markStep(len + 1, true);
    if (hint) hint.textContent = "You’ve arrived at " + theName(ZONES[to]);
  };

  place(0);
  if (reduced()) {
    place(len);
    finish();
    return;
  }
  const dur = Math.min(7200, Math.max(2600, len * 4.6));
  camTo(fitBox(pts), 650, () => {
    w.classList.add("walking");
    const t0 = performance.now();
    const tick = (now: number): void => {
      const t = Math.min(1, (now - t0) / dur);
      place(len * t);
      if (t < 1) walkAnim = requestAnimationFrame(tick);
      else finish();
    };
    walkAnim = requestAnimationFrame(tick);
  });
}
