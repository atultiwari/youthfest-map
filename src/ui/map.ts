// SVG site map renderer. Evidence: cleanroom/fixtures/_source/app.js
// (buildMap(), barricade(), bldg(), trees(), tint(), MT(), the marker loop, #hereDot).

import type { DestZoneId, ZoneId } from "../types";
import { ZONES, ORDER } from "../data/zones";
import { ICON } from "../data/icons";
import { MW, MH } from "./dom";

interface TextOpts {
  a?: string;
  fs?: number;
  fw?: number;
  c?: string;
}

const MT = (x: number, y: number, t: string, o: TextOpts = {}): string =>
  `<text x="${x}" y="${y}" text-anchor="${o.a || "start"}" font-size="${o.fs || 18}" font-weight="${o.fw || 600}" fill="${o.c || "var(--ink)"}" font-family="Inter, sans-serif">${t}</text>`;

const tint = (c: string, a: number): string => `color-mix(in srgb, ${c} ${a}%, var(--ground))`;

function barricade(x: number, y: number, vertical: boolean): string {
  const w = 46, h = 13;
  return `<g transform="translate(${x} ${y}) ${vertical ? "rotate(90)" : ""}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="2.5" fill="#fff" stroke="#E11D48" stroke-width="2"/>
    <path d="M${-w / 2 + 5} ${h / 2} L${-w / 2 + 12} ${-h / 2} M${-w / 2 + 16} ${h / 2} L${-w / 2 + 23} ${-h / 2} M${-w / 2 + 27} ${h / 2} L${-w / 2 + 34} ${-h / 2} M${-w / 2 + 38} ${h / 2} L${-w / 2 + 44} ${-h / 2 + 2}" stroke="#E11D48" stroke-width="3.2"/></g>`;
}

const bldg = (x: number, y: number, w: number, h: number): string =>
  `<rect x="${x + 5}" y="${y + 7}" width="${w}" height="${h}" rx="6" fill="var(--bldgShade)"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="var(--bldg)"/>`;

const trees = (list: readonly [number, number, number][]): string =>
  list
    .map(
      ([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--tree)"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.45}" fill="var(--tree)" opacity=".7" style="filter:brightness(1.08)"/>`,
    )
    .join("");

const LAB: Record<DestZoneId, [number, number, string?, number?]> = {
  commercial: [376, 797],
  startup: [180, 676, "middle", 15],
  kimaya: [600, 631],
  art: [606, 524, "middle", 14],
  amphitheatre: [370, 346, "start", 14],
  food: [108, 233],
  mainstage: [433, 196, "middle", 16],
  experience: [615, 196, "middle", 15],
};

/** Build the full map SVG innerHTML for the given current location and target zone. */
export function buildMap(here: ZoneId | null, target: DestZoneId | null): string {
  const Z = ZONES;
  let s = `<rect width="${MW}" height="${MH}" fill="var(--ground)"/>`;
  s += trees([
    [30, 190, 16], [26, 470, 13], [34, 620, 15], [30, 960, 14], [704, 330, 12], [706, 640, 11],
    [700, 965, 15], [560, 330, 14], [600, 340, 10], [470, 962, 13], [150, 962, 15],
  ]);
  ([
    [58, 690, 170, 60], [58, 770, 170, 130], [404, 620, 120, 110], [404, 760, 120, 150],
    [556, 700, 140, 200], [640, 420, 60, 116], [58, 330, 214, 110], [58, 60, 214, 80],
  ] as [number, number, number, number][]).forEach((b) => (s += bldg(...b)));
  s += `<rect x="326" y="46" width="378" height="242" rx="12" fill="var(--green)"/>`;

  const fp = (z: DestZoneId, x: number, y: number, w: number, h: number): void => {
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${tint(Z[z].color, z === target ? 30 : 16)}" stroke="${Z[z].color}" stroke-width="${z === target ? 3 : 1.4}"/>`;
  };
  fp("mainstage", 338, 64, 190, 214);
  fp("experience", 538, 64, 156, 214);
  fp("food", 58, 160, 214, 132);
  fp("amphitheatre", 322, 302, 150, 78);
  fp("kimaya", 548, 584, 152, 80);

  const line = (z: DestZoneId, x: number, y: number, w: number, h: number, n: number, vert: boolean): void => {
    const on = z === target, col = Z[z].color;
    s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${tint(col, on ? 34 : 18)}" stroke="${col}" stroke-width="${on ? 3 : 1.4}"/>`;
    for (let i = 1; i < n; i++) {
      const t = vert ? y + (h * i) / n : x + (w * i) / n;
      s += vert
        ? `<line x1="${x}" y1="${t}" x2="${x + w}" y2="${t}" stroke="${col}" stroke-opacity=".45"/>`
        : `<line x1="${t}" y1="${y}" x2="${t}" y2="${y + h}" stroke="${col}" stroke-opacity=".45"/>`;
    }
  };
  line("startup", 134, 574, 152, 26, 8, false);
  line("art", 536, 408, 26, 144, 6, true);

  const cf = tint(Z.commercial.color, target === "commercial" ? 30 : 16);
  const cw = target === "commercial" ? 3 : 1.4;
  for (const [y0, h] of [[640, 132], [798, 142]] as [number, number][]) {
    for (const x0 of [246, 318]) {
      s += `<rect x="${x0}" y="${y0}" width="36" height="${h}" rx="4" fill="${cf}" stroke="${Z.commercial.color}" stroke-width="${cw}"/>`;
      for (let y = y0 + 22; y < y0 + h; y += 22) {
        s += `<line x1="${x0}" y1="${y}" x2="${x0 + 36}" y2="${y}" stroke="${Z.commercial.color}" stroke-opacity=".3"/>`;
      }
    }
  }
  s += MT(236, 712, "Pathway 2", { a: "end", fs: 13, c: "var(--muted)", fw: 500 });
  s += MT(236, 874, "Pathway 1", { a: "end", fs: 13, c: "var(--muted)", fw: 500 });

  const roads = ["M300 1012 V40", "M95 560 H705", "M520 560 V400", "M520 400 H300"];
  roads.forEach((d) => (s += `<path d="${d}" fill="none" stroke="var(--casing)" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>`));
  roads.forEach((d) => (s += `<path d="${d}" fill="none" stroke="var(--road)" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>`));
  s += `<rect x="0" y="1014" width="${MW}" height="46" fill="var(--road)" stroke="var(--casing)" stroke-width="2"/>` + MT(360, 1044, "FC Road", { a: "middle", fs: 16, c: "var(--faint)" });
  s += bldg(318, 950, 64, 36) + MT(350, 973, "Reg.", { a: "middle", fs: 14, c: "var(--bldgText)", fw: 500 });
  s += MT(400, 1004, "Gate 2", { fs: 16, c: "var(--muted)" }) + MT(704, 34, "Fergusson College Ground", { a: "end", fs: 14, c: "var(--muted)", fw: 500 });
  s += barricade(300, 526, false) + barricade(96, 560, true) + barricade(704, 560, true) + barricade(300, 46, false);
  s += `<g id="routeLayer"></g>`;

  for (const z of ORDER) {
    const [x, y] = Z[z].mk;
    const on = z === target;
    const [lx, ly, la, lf] = LAB[z];
    s += `<g class="mk" data-z="${z}" tabindex="0" role="button" aria-label="${Z[z].n}. ${Z[z].name}">
      ${on ? `<circle class="destpulse" cx="${x}" cy="${y}" r="21" fill="${Z[z].color}" opacity=".5"/>` : ""}
      <circle class="disc" cx="${x}" cy="${y}" r="19" fill="${Z[z].color}" stroke="#fff" stroke-width="3"/>
      <g transform="translate(${x - 11} ${y - 11}) scale(.92)"><path d="${ICON[z]}" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></g>
      <circle cx="${x + 15}" cy="${y - 15}" r="9" fill="#fff" stroke="${Z[z].color}" stroke-width="2"/>${MT(x + 15, y - 11, String(Z[z].n), { a: "middle", fs: 11, fw: 700, c: Z[z].color })}
      ${MT(lx, ly, Z[z].short, { a: la || "start", fs: (lf || 17) + (on ? 1 : 0), fw: on ? 700 : 600 })}
    </g>`;
  }

  const [hx, hy] = Z[here || "entry"].door;
  s += `<g id="hereDot"><circle class="ping" cx="${hx}" cy="${hy}" r="16" fill="var(--here)"/><circle cx="${hx}" cy="${hy}" r="9" fill="var(--here)" stroke="#fff" stroke-width="3"/></g>`;
  s += `<g id="walkerLayer"></g>`;
  return s;
}
