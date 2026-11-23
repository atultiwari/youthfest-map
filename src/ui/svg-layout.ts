// SVG layout primitives for zone plans.
// Evidence: cleanroom/fixtures/_source/app.js (stallBox, T, tree, wrapText, fitText,
// labelText, CUBE, cubeBox, expGroup, cardBox).

import { STALLS } from "../data/stalls";
import { esc } from "./dom";

export interface TextOpts {
  a?: string;
  fs?: number;
  fw?: number;
  c?: string;
  rot?: number;
}

export const T = (x: number, y: number, t: string | number, o: TextOpts = {}): string =>
  `<text x="${x}" y="${y}" text-anchor="${o.a || "middle"}" font-size="${o.fs || 12}" font-weight="${o.fw || 500}" fill="${o.c || "var(--muted)"}" font-family="Inter, sans-serif" ${o.rot ? `transform="rotate(${o.rot} ${x} ${y})"` : ""}>${t}</text>`;

export const tree = (x: number, y: number): string =>
  `<circle cx="${x}" cy="${y}" r="13" fill="#8DBF85" opacity=".9"/>`;

export function stallBox(
  key: string, x: number, y: number, w: number, h: number,
  label: string | number, color: string, opts: { fs?: number } = {},
): string {
  const st = STALLS[key];
  const idle = !st;
  const fs = opts.fs || 13;
  return `<g class="st${idle ? " idle" : ""}" data-k="${idle ? "" : key}" ${idle ? "" : 'tabindex="0" role="button" aria-label="' + esc(label + ", " + st.name) + '"'}>
    <rect class="ring" x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" rx="5" fill="none" stroke="var(--here)" stroke-width="2.5"/>
    <rect class="box" x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${idle ? "var(--idle)" : "var(--stall)"}" stroke="${idle ? "var(--line)" : color}" stroke-width="1.6"/>
    <text x="${x + w / 2}" y="${y + h / 2 + fs * 0.36}" text-anchor="middle" font-size="${fs}" font-weight="600" fill="${idle ? "var(--idleText)" : "var(--ink)"}" font-family="Inter, sans-serif">${label}</text></g>`;
}

export function wrapText(text: string | number, maxW: number, f: number): string[] {
  const words = String(text).split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const t = cur ? cur + " " + w : w;
    if (t.length * f * 0.58 <= maxW || !cur) cur = t;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export function fitText(text: string | number, w: number, h: number, maxF = 12, minF = 7.5): { f: number; lines: string[] } {
  for (let f = maxF; f >= minF; f -= 0.5) {
    const lines = wrapText(text, w, f);
    if (lines.every((l) => l.length * f * 0.58 <= w) && lines.length * f * 1.2 <= h) return { f, lines };
  }
  return { f: minF, lines: wrapText(text, w, minF) };
}

export function labelText(lines: string[], f: number, cx: number, cy: number, fill: string, weight = 600): string {
  const lh = f * 1.2;
  const y0 = cy - (lines.length * lh) / 2 + f * 0.92;
  return lines
    .map(
      (l, i) =>
        `<text x="${cx}" y="${(y0 + i * lh).toFixed(1)}" text-anchor="middle" font-size="${f}" font-weight="${weight}" fill="${fill}" font-family="Inter, sans-serif">${esc(l)}</text>`,
    )
    .join("");
}

const CUBE = { CW: 104, CH: 30, RW: 52, RH: 64 };

export interface CubeRect {
  x: number;
  y: number;
  w: number;
  h: number;
  row: boolean;
}

export function cubeBox(cubes: readonly (number | string)[]): CubeRect {
  const n = cubes.map((v) => (typeof v === "string" ? +v.replace("Op", "") : v));
  const op = typeof cubes[0] === "string";
  const lo = Math.min(...n), hi = Math.max(...n), cnt = hi - lo + 1;
  const { CW, CH, RW, RH } = CUBE;
  if (op) return { x: 1338, y: 160 + (8 - hi) * CH, w: CW, h: cnt * CH, row: false };
  if (hi <= 16) return { x: 12, y: 610 - hi * CH, w: CW, h: cnt * CH, row: false };
  if (hi <= 24) return { x: 128 + (lo - 17) * RW, y: 62, w: cnt * RW, h: RH, row: true };
  if (hi <= 34) return { x: 552, y: 130 + (lo - 25) * CH, w: CW, h: cnt * CH, row: false };
  if (hi <= 44) return { x: 660, y: 130 + (44 - hi) * CH, w: CW, h: cnt * CH, row: false };
  if (hi <= 52) return { x: 776 + (lo - 45) * RW, y: 62, w: cnt * RW, h: RH, row: true };
  return { x: 1196, y: 130 + (lo - 53) * CH, w: CW, h: cnt * CH, row: false };
}

export function expGroup(key: string, r: CubeRect, badge: string, name: string, color: string): string {
  const st = STALLS[key];
  const g = 1.5, x = r.x + g, y = r.y + g, w = r.w - 2 * g, h = r.h - 2 * g;
  const area = r.row ? { x: x + 3, y: y + 24, w: w - 6, h: h - 28 } : { x: x + 27, y: y + 2, w: w - 31, h: h - 4 };
  const { f, lines } = fitText(name, area.w, area.h, r.row ? 11 : 12, 7.5);
  const bx = x + 13, by = r.row ? y + 13 : y + h / 2;
  return `<g class="st" data-k="${key}" tabindex="0" role="button" aria-label="${esc(badge + ", " + st.name)}">
    <rect class="ring" x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" rx="8" fill="none" stroke="var(--here)" stroke-width="2.5"/>
    <rect class="box" x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="var(--stall)" stroke="${color}" stroke-width="1.6"/>
    <circle cx="${bx}" cy="${by}" r="9.5" fill="${color}"/>
    <text x="${bx}" y="${by + 3.3}" text-anchor="middle" font-size="${badge.length > 2 ? 8 : 9.5}" font-weight="700" fill="#fff" font-family="Inter, sans-serif">${badge}</text>
    ${labelText(lines, f, area.x + area.w / 2, area.y + area.h / 2, "var(--ink)")}</g>`;
}

export function cardBox(key: string, x: number, y: number, w: number, h: number, label: string, color: string): string {
  const st = STALLS[key];
  const idle = !st;
  const nm = idle ? "Not allocated" : st.name;
  const { f, lines } = fitText(nm, w - 16, h - 30, 14, 8.5);
  return `<g class="st${idle ? " idle" : ""}" data-k="${idle ? "" : key}" ${idle ? "" : `tabindex="0" role="button" aria-label="${esc(label + ", " + st.name)}"`}>
    <rect class="ring" x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" rx="9" fill="none" stroke="var(--here)" stroke-width="2.5"/>
    <rect class="box" x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${idle ? "var(--idle)" : "var(--stall)"}" stroke="${idle ? "var(--line)" : color}" stroke-width="1.6"/>
    ${T(x + w / 2, y + 21, label, { fs: 12, fw: 700, c: idle ? "var(--idleText)" : color })}
    ${labelText(lines, f, x + w / 2, y + 24 + (h - 24) / 2, idle ? "var(--idleText)" : "var(--ink)")}</g>`;
}
