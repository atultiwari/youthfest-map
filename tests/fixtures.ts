// Loaders for the Stage-3 oracle fixtures (observed behaviour of the live original).
import { readFileSync } from "node:fs";

export interface OracleStep {
  k: string;
  t: string;
  at: number;
}
export interface OraclePoint {
  p: [number, number];
  node: string | null;
  at: number;
}
export interface OracleRoute {
  self?: boolean;
  steps?: OracleStep[];
  usesConnector?: boolean;
  sharedEntrance?: boolean;
  points?: OraclePoint[];
}
export interface OracleStall {
  key: string;
  zone: string;
  label: string;
  name: string;
  tag: string;
  by: string;
  sub: string;
  cubes: string;
  short: string;
}
export interface Oracle {
  counts: Record<string, number>;
  stallTotal: number;
  order: string[];
  routes: Record<string, OracleRoute>;
  stalls: Record<string, OracleStall>;
}

export interface IxQuery {
  term: string;
  count: number;
  empty: string | null;
  items: { k: string; text: string }[];
}
export interface Interactions {
  queries: IxQuery[];
  sheets: { k: string; text: string }[];
}

function read<T>(name: string): T {
  const url = new URL(`./fixtures/${name}`, import.meta.url);
  return JSON.parse(readFileSync(url, "utf8")) as T;
}

export const oracle = read<Oracle>("data-oracle.json");
export const interactions = read<Interactions>("interactions.json");
