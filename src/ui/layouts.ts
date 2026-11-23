// Per-zone plan layouts. Evidence: cleanroom/fixtures/_source/app.js
// (layoutPathway1/2, layoutCommercial, layoutFood, layoutExperience, layoutStage,
// layoutStartup, layoutArt).

import { RAW } from "../data/stalls";
import { T, tree, stallBox, cardBox, cubeBox, expGroup } from "./svg-layout";

/** [width, height, innerSVG, naturalPx?] — naturalPx forces a fixed px width (wide zones). */
export type Layout = [number, number, string, number?];

type GapItem = { gap: number; draw?: (x: number, y: number) => string };
type ColItem = string | GapItem;
const isGap = (it: ColItem): it is GapItem => typeof it === "object";

function layoutPathway1(c: string): Layout {
  const sh = 36, gp = 4;
  let s = "";
  const col = (x: number, items: ColItem[], bottom: number): void => {
    let y = bottom;
    for (const it of items) {
      if (isGap(it)) {
        y -= it.gap;
        s += it.draw ? it.draw(x, y) : "";
        continue;
      }
      y -= sh;
      s += stallBox("c-" + it, x, y, 92, sh, it.replace("LS ", ""), c);
      y -= gp;
    }
  };
  s += `<rect x="128" y="40" width="104" height="600" rx="10" fill="var(--road)" stroke="var(--roadEdge)"/>` + T(180, 340, "Walkway", { rot: -90, fs: 14 });
  col(236, ["LS 1A", "LS 2A", "LS 3A", "LS 4A", "LS 5A", "LS 6A", "LS 7A", "LS 8A", "LS 9A", "LS 10A", "LS 11A",
    { gap: 52, draw: (x, y) => tree(x + 46, y + 26) }, "LS 12A", "LS 13A"], 640);
  col(32, ["LS 1B", "LS 2B", "LS 3B", "LS 4B", "LS 5B", "LS 6B", "LS 7B", "LS 8B",
    { gap: 52, draw: (x, y) => tree(x + 46, y + 26) }, "LS 9B", "LS 10B", "LS 11B"], 640);
  s += `<rect x="32" y="650" width="92" height="44" rx="6" fill="var(--bldg)"/>` + T(78, 677, "Registration", { fs: 11.5 })
    + `<rect x="236" y="650" width="92" height="44" rx="6" fill="var(--bldg)"/>` + T(282, 677, "Registration", { fs: 11.5 })
    + T(180, 722, "▲  Entry · FC College Gate 2", { fs: 14, fw: 700, c: "var(--ink)" }) + T(180, 746, "FC Road", { fs: 12 })
    + T(180, 24, "Internal gate", { fs: 12 });
  return [360, 760, s];
}

function layoutPathway2(c: string): Layout {
  const sh = 36, gp = 4;
  let s = "";
  const col = (x: number, items: ColItem[], bottom: number): void => {
    let y = bottom;
    for (const it of items) {
      if (isGap(it)) {
        y -= it.gap;
        s += it.draw ? it.draw(x, y) : "";
        continue;
      }
      y -= sh;
      s += stallBox("c-" + it, x, y, 92, sh, it, c);
      y -= gp;
    }
  };
  s += `<rect x="128" y="40" width="104" height="700" rx="10" fill="var(--road)" stroke="var(--roadEdge)"/>` + T(180, 390, "Walkway", { rot: -90, fs: 14 });
  col(236, ["1C", "2C", "3C", "4C", "5C", "6C", "7C",
    { gap: 26, draw: (x, y) => `<rect x="${x}" y="${y + 2}" width="92" height="20" rx="4" fill="var(--bldg)"/>` + T(x + 46, y + 16, "Power", { fs: 10 }) },
    { gap: 44, draw: (x, y) => T(x + 46, y + 27, "Classroom path ›", { fs: 11 }) }, "8C", "9C", "10C", "11C", "12C",
    { gap: 44, draw: (x, y) => `<rect x="${x}" y="${y + 4}" width="92" height="36" rx="6" fill="var(--bldg)"/>` + T(x + 46, y + 27, "Security", { fs: 11 }) }], 740);
  col(32, ["1D", "2D", "3D", "4D", "5D", "6D", { gap: 120, draw: (x, y) => T(x + 46, y + 64, "‹ Girls hostel", { fs: 11 }) }, "7D", "8D"], 740);
  s += T(180, 772, "▲  Pathway 2 entry gate", { fs: 14, fw: 700, c: "var(--ink)" }) + T(180, 24, "Towards Amrit Stambha", { fs: 12 });
  return [360, 820, s];
}

export function layoutCommercial(c: string): Layout {
  const [, h1, s1] = layoutPathway1(c);
  const [, h2, s2] = layoutPathway2(c);
  const p1 = s1.replace("T(180, 24, 'Internal gate', {fs:12})", "").replace(">Internal gate<", ">Pathway 1 · A and B stalls<");
  const p2 = s2.replace(">▲  Pathway 2 entry gate<", ">▲  Pathway 2 · C and D stalls<");
  return [360, h2 + h1 + 10, `${p2}<g transform="translate(0 ${h2 + 10})">${p1}</g>`];
}

export function layoutFood(c: string): Layout {
  let s = `<rect x="70" y="92" width="300" height="380" rx="18" fill="var(--road)" stroke="var(--roadEdge)"/>`;
  for (let i = 0; i < 6; i++) s += stallBox("f-" + (15 + i), 70 + i * 50, 30, 46, 50, 15 + i, c, { fs: 16 });
  for (let i = 0; i < 7; i++) s += stallBox("f-" + (1 + i), 382, 92 + i * 54, 50, 50, 1 + i, c, { fs: 16 });
  for (let i = 0; i < 7; i++) s += stallBox("f-" + (14 - i), 8, 92 + i * 54, 50, 50, 14 - i, c, { fs: 16 });
  for (const [x, y] of [[140, 200], [220, 200], [300, 200], [140, 300], [220, 300], [300, 300]] as [number, number][]) {
    s += `<circle cx="${x}" cy="${y}" r="20" fill="var(--bldg)" opacity=".75"/><circle cx="${x}" cy="${y}" r="7" fill="var(--bldgText)" opacity=".5"/>`;
  }
  s += T(220, 400, "Seating", { fs: 14 }) + T(220, 520, "▲  Food Court entrance", { fs: 15, fw: 700, c: "var(--ink)" });
  return [440, 560, s];
}

export function layoutExperience(c: string): Layout {
  const W = 1640, H = 668;
  let s = `<rect x="2" y="44" width="${W - 4}" height="${H - 56}" rx="10" fill="none" stroke="var(--line)" stroke-width="2"/>`;
  s += `<rect x="668" y="640" width="224" height="10" fill="var(--ground)"/><rect x="1456" y="640" width="96" height="10" fill="var(--ground)"/>`;
  s += `<rect x="1316" y="52" width="304" height="486" rx="8" fill="color-mix(in srgb, ${c} 6%, transparent)" stroke="${c}" stroke-dasharray="6 6" stroke-width="1.5"/>`
    + T(1529, 232, "Defence corridor", { fs: 15, fw: 700, c: "var(--ink)" }) + T(1529, 252, "Army · Navy · Air Force", { fs: 12 })
    + T(1529, 456, "Sports section", { fs: 13, fw: 700, c: "var(--ink)" });
  s += `<rect x="880" y="300" width="150" height="120" rx="8" fill="var(--bldg)"/>` + T(955, 356, "Aeroplane", { fs: 13, fw: 700, c: "var(--ink)" }) + T(955, 374, "area", { fs: 12 });
  RAW.EXPL.forEach(([id, label, , short, , cubes]) => {
    const badge = label.startsWith("Open") ? "O" + label.split(" ")[1] : label.split(" ")[1];
    s += expGroup("x-" + id, cubeBox(cubes), badge, short, c);
  });
  s += T(780, 632, "Entry ›", { fs: 15, fw: 700, c: "var(--ink)" }) + T(1504, 632, "‹ Exit", { fs: 15, fw: 700, c: "var(--ink)" });
  return [W, H, s, 1350];
}

export function layoutStage(c: string): Layout {
  const s = `<rect x="30" y="20" width="824" height="380" rx="10" fill="none" stroke="var(--line)" stroke-width="2"/>`
    + `<rect x="133" y="96" width="106" height="182" rx="8" fill="${c}"/>` + T(186, 192, "Main stage", { fs: 15, fw: 700, c: "#fff" })
    + `<rect x="341" y="98" width="211" height="182" rx="8" fill="var(--road)" stroke="var(--casing)"/>` + T(446, 194, "Seating", { fs: 15, fw: 700, c: "var(--ink)" })
    + `<rect x="36" y="146" width="60" height="44" rx="6" fill="var(--bldg)"/>` + T(66, 172, "Green room", { fs: 10 })
    + T(560, 384, "Entry ›", { fs: 14, fw: 700, c: "var(--ink)" }) + T(740, 384, "‹ Exit", { fs: 14, fw: 700, c: "var(--ink)" });
  return [880, 420, s];
}

export function layoutStartup(c: string): Layout {
  const bw = 118, bh = 104, gap = 6, pad = 14, W = pad * 2 + 8 * bw + 7 * gap, top = 84;
  let s = `<rect x="${pad}" y="46" width="${W - 2 * pad}" height="24" rx="6" fill="var(--road)" stroke="var(--casing)" stroke-width="1.5"/>` + T(pad + 12, 62, "Startup road", { a: "start", fs: 12, fw: 600 });
  RAW.STARTUP.forEach((r, i) => {
    s += cardBox("g-" + r[0], pad + i * (bw + gap), top, bw, bh, r[0], c);
  });
  s += T(pad + 2, top + bh + 24, "◂ Junction", { a: "start", fs: 12.5, fw: 700, c: "var(--ink)" }) + T(W - pad - 2, top + bh + 24, "Barricade, no entry ▸", { a: "end", fs: 12.5, fw: 700, c: "#E11D48" });
  s += T(pad, 22, "Youth Startup Zone · 10 × 10 ft stalls", { a: "start", fs: 12.5, fw: 600 }) + T(pad, 36, "G01 is nearest the junction", { a: "start", fs: 11.5 });
  return [W, top + bh + 40, s, 960];
}

export function layoutArt(c: string): Layout {
  const bw = 210, bh = 70, gap = 6, pad = 14, rw = 28, W = pad * 2 + rw + 10 + bw, top = 50;
  const H = top + 6 * bh + 5 * gap + 56;
  let s = T(W / 2, 22, "10 × 10 ft stalls", { fs: 12.5, fw: 600 });
  s += `<rect x="${pad}" y="${top}" width="${rw}" height="${6 * bh + 5 * gap}" rx="6" fill="var(--road)" stroke="var(--casing)" stroke-width="1.5"/>` + T(pad + rw / 2, top + 3 * bh, "Connector road", { fs: 12, fw: 600, rot: -90 });
  RAW.ART.forEach((r, i) => {
    s += cardBox("aa-" + r[0], pad + rw + 10, top + (5 - i) * (bh + gap), bw, bh, r[0], c);
  });
  s += T(W / 2, top - 4, "▴ Towards the Amphitheatre", { fs: 12, fw: 700, c: "var(--ink)" }) + T(W / 2, H - 18, "▾ From the Kimaya road · AA1 is nearest", { fs: 12, fw: 700, c: "var(--ink)" });
  return [W, H, s];
}
