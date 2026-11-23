// App orchestration: select a destination, frame & walk, hash routing, events.
// Evidence: cleanroom/fixtures/_source/app.js (go(), fullMap(), fromHash(), the click/
// keydown/hashchange listeners).
// NOTE (Batch 2): stall sheet, search dropdown, layout zoom and the "Show on layout"
// interactions arrive in Batch 3; their click branches are marked below.

import type { DestZoneId, ZoneId } from "./types";
import { ZONES, ORDER, theName } from "./data/zones";
import { STALLS } from "./data/stalls";
import { $, MW, MH, reduced } from "./ui/dom";
import { setVB, getVB, camTo, fitBox } from "./ui/camera";
import { buildMap } from "./ui/map";
import { renderGrid, renderWelcome } from "./ui/panels";
import { renderZone } from "./ui/zone";
import { showStall, closeSheet, highlight } from "./ui/sheet";
import { renderSearch } from "./ui/search-ui";
import { playRoute, clearRoute, getCurrent } from "./ui/walker";
import { state, defZoom } from "./ui/state";

const DEST = new Set<string>(ORDER);
const isDestZone = (v: string | undefined): v is DestZoneId => !!v && DEST.has(v);
const isZone = (v: string): v is ZoneId => v in ZONES;

interface GoOpts {
  scroll?: boolean;
}

function setMap(here: ZoneId | null, target: DestZoneId | null): void {
  const map = $("#map");
  if (map) map.innerHTML = buildMap(here, target);
}

/** Select a destination: redraw, frame and walk. */
export function go(z: DestZoneId, opts: GoOpts = {}): void {
  state.zone = z;
  state.tab = 0;
  state.zoom = defZoom();
  if (!state.here) history.replaceState(null, "", "#" + z);
  const from: ZoneId = state.here || "entry";
  setMap(state.here, z);
  setVB(getVB());
  renderGrid();
  renderZone();
  $("#mapHint")!.textContent = "Walking you to " + theName(ZONES[z]);
  $("#fullbtn")?.classList.add("on");
  if (z === from) {
    $("#dir")?.classList.remove("on");
    clearRoute();
    camTo([0, 0, MW, MH], 500);
    return;
  }
  if (opts.scroll !== false) {
    $(".panel")?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
  }
  setTimeout(() => playRoute(from, z), opts.scroll === false ? 0 : 280);
}

export function fullMap(): void {
  clearRoute();
  camTo([0, 0, MW, MH], 600);
  $("#fullbtn")?.classList.remove("on");
}

/** #<zone> opens a zone; #at-<zone> means "you are here" (zone QR standees). */
export function fromHash(): void {
  const h = location.hash.slice(1);
  state.here = null;
  if (h.startsWith("at-") && isZone(h.slice(3))) {
    state.here = h.slice(3) as ZoneId;
    state.zone = null;
  } else {
    state.zone = isDestZone(h) ? h : null;
  }
  renderWelcome();
  renderGrid();
  $("#mapHint")!.textContent = "Tap a zone to be walked there";
  clearRoute();
  setVB([0, 0, MW, MH]);
  $("#fullbtn")?.classList.remove("on");
  $("#dir")?.classList.remove("on");
  setMap(state.here, null);
  if (state.here && state.here !== "entry") {
    state.zone = state.here;
    renderZone();
    renderGrid();
    camTo(fitBox([ZONES[state.here].mk, ZONES[state.here].door], 560), 900);
    $("#fullbtn")?.classList.add("on");
  } else if (state.zone) {
    go(state.zone, { scroll: false });
  } else {
    renderZone();
  }
}

function onClick(e: MouseEvent): void {
  if (!(e.target instanceof Element)) return;
  const t = e.target;

  const mk = t.closest<HTMLElement>(".mk,.dcard");
  if (mk && isDestZone(mk.dataset.z)) {
    go(mk.dataset.z);
    return;
  }
  const cur = getCurrent();
  if (t.closest("[data-replay]") && cur) {
    playRoute(cur.from, cur.to);
    return;
  }
  if (t.closest("[data-full]") || t.closest("#fullbtn")) {
    fullMap();
    return;
  }
  if (t.closest("[data-layout]")) {
    $("#zone")?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
    return;
  }
  const stb = t.closest<HTMLElement>(".st[data-k]");
  if (stb && stb.dataset.k) {
    showStall(stb.dataset.k);
    return;
  }
  const row = t.closest<HTMLElement>(".row,.res");
  if (row && row.dataset.k) {
    $("#results")?.classList.remove("on");
    const k = row.dataset.k;
    if (k.startsWith("zone:")) {
      const zid = k.slice(5);
      if (isDestZone(zid)) go(zid);
    } else {
      showStall(k);
    }
    return;
  }
  const zb = t.closest<HTMLElement>("[data-zoom]");
  if (zb) {
    state.zoom = Math.min(3, Math.max(1, state.zoom + Number(zb.dataset.zoom) * 0.5));
    renderZone();
    return;
  }
  const wk = t.closest<HTMLElement>("[data-walk]");
  if (wk && wk.dataset.walk) {
    const st = STALLS[wk.dataset.walk];
    closeSheet();
    if (st) go(st.zone);
    return;
  }
  const gt = t.closest<HTMLElement>("[data-goto]");
  if (gt && gt.dataset.goto) {
    const st = STALLS[gt.dataset.goto];
    closeSheet();
    if (st) {
      state.zone = st.zone;
      state.zoom = defZoom();
      renderZone();
      highlight(gt.dataset.goto);
    }
    return;
  }
  if (t === $("#scrim")) {
    closeSheet();
    return;
  }
  if (!t.closest(".search")) $("#results")?.classList.remove("on");
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === "Escape") {
    closeSheet();
    $("#results")?.classList.remove("on");
  }
  if ((e.key === "Enter" || e.key === " ") && e.target instanceof Element && e.target.matches(".mk,.st[data-k]")) {
    e.preventDefault();
    e.target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  }
}

export function init(): void {
  document.addEventListener("click", onClick);
  document.addEventListener("keydown", onKeydown);
  window.addEventListener("hashchange", fromHash);
  const q = $<HTMLInputElement>("#q");
  q?.addEventListener("input", () => renderSearch(q.value));
  fromHash();
}
