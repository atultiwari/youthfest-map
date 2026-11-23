// Shared domain types for the festival map.
// Learned from the live original's inline data model (cleanroom/fixtures/_source/app.js:
// ZONES, N/EDGES, the flat STALLS index, journey()/directions()).

export type ZoneId =
  | "entry"
  | "commercial"
  | "startup"
  | "kimaya"
  | "art"
  | "amphitheatre"
  | "food"
  | "mainstage"
  | "experience";

/** Zones that hold stalls / appear as destinations (everything except entry). */
export type DestZoneId = Exclude<ZoneId, "entry">;

export type NodeId = string;
export type Point = readonly [number, number];

export interface Zone {
  /** Printed number on the standee; "" for entry. */
  readonly n: number | "";
  readonly name: string;
  readonly short: string;
  readonly color: string;
  readonly node: NodeId;
  /** Marker centre on the map. */
  readonly mk: Point;
  /** Door the route starts/ends at. */
  readonly door: Point;
  readonly how: string;
  readonly sub?: string;
  /** When false, theName() omits the leading "the" (used by Kimaya). */
  readonly the?: boolean;
}

export interface Stall {
  readonly key: string;
  readonly zone: DestZoneId;
  readonly label: string;
  readonly name: string;
  readonly tag: string;
  readonly by: string;
  readonly sub: string;
  readonly cubes: string;
  readonly short: string;
}

/** A turn-by-turn direction step; `k` is the icon key, `t` the text, `at` the distance along the path. */
export interface Step {
  readonly k: string;
  readonly t: string;
  readonly at: number;
}

/** A point on the computed journey; `node` is the graph node, or null for a door hop. */
export interface JourneyItem {
  p: Point;
  node: NodeId | null;
  at: number;
}
