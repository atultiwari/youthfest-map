// Search over zones + stalls.
// Evidence: cleanroom/fixtures/_source/app.js (norm(), the #q input handler).

import type { DestZoneId, Stall } from "../types";
import { ZONES, ORDER } from "../data/zones";
import { STALLS } from "../data/stalls";

/** Lowercase, NFKD-normalize, strip punctuation to spaces. Matches the original's norm(). */
export function norm(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9 ]/g, " ");
}

export interface SearchResult {
  readonly zones: DestZoneId[];
  readonly stalls: Stall[];
}

/**
 * Multi-word AND match over label/name/tagline/owner/zone; zone matches first.
 * Stall hits capped at 30, same as the original.
 */
export function searchStalls(raw: string): SearchResult {
  const q = norm(raw).trim();
  if (!q) return { zones: [], stalls: [] };
  const w = q.split(/\s+/);
  const zones = ORDER.filter((z) =>
    w.every((x) => norm(ZONES[z].name + " " + ZONES[z].short).includes(x)),
  );
  const stalls = Object.values(STALLS)
    .filter((st) => {
      const hay = norm(
        [st.label, st.label.replace(/\s/g, ""), st.name, st.tag, st.by, ZONES[st.zone].name].join(" "),
      );
      return w.every((x) => hay.includes(x));
    })
    .slice(0, 30);
  return { zones, stalls };
}
