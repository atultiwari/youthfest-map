// Shared mutable UI state (single source, mirrors the original's `state`).
import type { DestZoneId, ZoneId } from "../types";

export interface AppState {
  here: ZoneId | null;
  zone: DestZoneId | null;
  tab: number;
  zoom: number;
}

export const state: AppState = { here: null, zone: null, tab: 0, zoom: 1 };

/** Default zoom for a zone layout (the original's defZoom; constant for now). */
export const defZoom = (): number => 1;
