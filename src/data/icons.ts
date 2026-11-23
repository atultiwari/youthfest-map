// Pictograms (24x24, stroked) — ported verbatim from the live original.
// Evidence: cleanroom/fixtures/_source/app.js (const ICON, svgIcon()).

import type { ZoneId } from "../types";

export const ICON: Record<string, string> = {
  entry: "M4 21V9l8-5 8 5v12M9 21v-6h6v6",
  commercial: "M5.5 8h13l-1 12.5h-11zM9 8V6.5a3 3 0 0 1 6 0V8",
  startup:
    "M12 3c3.2 2.2 4.8 6.2 3.9 11L14 16h-4l-1.9-2C7.2 9.2 8.8 5.2 12 3zM10 16l-2.2 4.4 3-1.2M14 16l2.2 4.4-3-1.2M12 9.2v.1",
  kimaya:
    "M4 5h7v5.5a3.5 3.5 0 0 1-7 0zM13 8.5h7V14a3.5 3.5 0 0 1-7 0zM6 8h.1M9 8h.1M6.2 11.6c.8.6 2 .6 2.8 0M15 11.5h.1M18 11.5h.1M15.2 15.6c.8-.6 2-.6 2.8 0",
  art:
    "M12 3.5a8.5 8.5 0 1 0 0 17c1.4 0 2-1 2-1.9s-.9-1.4-.9-2.3 1-1.5 1.9-1.5h1.9a3.6 3.6 0 0 0 3.6-3.6c0-4.3-3.8-7.7-8.5-7.7zM7.8 11.5h.1M9.8 7.8h.1M14 7.3h.1M16.8 10.4h.1",
  amphitheatre: "M4 5h16v10H4zM12 15v4M8.5 21l3.5-2 3.5 2M7.5 9.5h4M7.5 12h7",
  food: "M7 3v8M5 3v4.2a2 2 0 0 0 4 0V3M7 11v10M16.5 3c-2.2 2.2-2.2 6.8 0 8.6V21",
  mainstage: "M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM6 11a6 6 0 0 0 12 0M12 17v4M9 21h6",
  experience: "M12 3.2l2.6 5.5 6 .7-4.5 4.1 1.2 5.9L12 16.6l-5.3 2.8 1.2-5.9-4.5-4.1 6-.7z",
  straight: "M12 20V5M6.5 10.5 12 5l5.5 5.5",
  left: "M18 20v-6a5 5 0 0 0-5-5H5M9.5 4.5 5 9l4.5 4.5",
  right: "M6 20v-6a5 5 0 0 1 5-5h8M14.5 4.5 19 9l-4.5 4.5",
  start: "M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11zM12 12.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z",
  arrive: "M6 21V4M6 4.5h11l-2.5 3.5L17 11.5H6",
  replay: "M4 12a8 8 0 1 0 2.4-5.7M4 4.5V9h4.5",
  block: "M5 5l14 14M19 5 5 19",
};

/** Build an inline SVG icon string, matching the original's svgIcon(). */
export function svgIcon(k: string, col = "#fff", w = 2): string {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICON[k]}"/></svg>`;
}

export function zoneIcon(z: ZoneId): string {
  return ICON[z];
}
