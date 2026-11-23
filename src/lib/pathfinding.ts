// Shortest-path + journey construction over the walkable graph.
// Evidence: cleanroom/fixtures/_source/app.js (shortest(), same(), journey()).

import type { JourneyItem, NodeId, Point, ZoneId } from "../types";
import { N, EDGES } from "../data/graph";
import { ZONES } from "../data/zones";

export function same(p: Point | null, q: Point | null): boolean {
  return !!p && !!q && p[0] === q[0] && p[1] === q[1];
}

/** Dijkstra over the node graph by euclidean edge weight. Barricades are missing edges. */
export function shortest(a: NodeId, b: NodeId): NodeId[] {
  if (a === b) return [a];
  const adj: Record<NodeId, [NodeId, number][]> = {};
  for (const k in N) adj[k] = [];
  for (const [u, v] of EDGES) {
    const d = Math.hypot(N[u][0] - N[v][0], N[u][1] - N[v][1]);
    adj[u].push([v, d]);
    adj[v].push([u, d]);
  }
  const dist: Record<NodeId, number> = {};
  const prev: Record<NodeId, NodeId> = {};
  const todo = new Set(Object.keys(N));
  for (const k in N) dist[k] = Infinity;
  dist[a] = 0;
  while (todo.size) {
    let u: NodeId | null = null;
    for (const k of todo) if (u === null || dist[k] < dist[u]) u = k;
    if (u === null) break;
    todo.delete(u);
    if (u === b) break;
    for (const [v, d] of adj[u]) {
      if (dist[u] + d < dist[v]) {
        dist[v] = dist[u] + d;
        prev[v] = u;
      }
    }
  }
  const p: NodeId[] = [b];
  while (p[0] !== a) p.unshift(prev[p[0]]);
  return p;
}

/** The journey: {p, node, at} from the start door to the destination door. */
export function journey(from: ZoneId, to: ZoneId): JourneyItem[] {
  const A = ZONES[from], B = ZONES[to];
  const items: JourneyItem[] = shortest(A.node, B.node).map((k) => ({ p: N[k], node: k, at: 0 }));
  if (from !== "entry" && !same(items[0].p, A.door)) items.unshift({ p: A.door, node: null, at: 0 });
  if (!same(items[items.length - 1].p, B.door)) items.push({ p: B.door, node: null, at: 0 });
  let acc = 0;
  items.forEach((it, i) => {
    if (i) acc += Math.hypot(it.p[0] - items[i - 1].p[0], it.p[1] - items[i - 1].p[1]);
    it.at = acc;
  });
  return items;
}
