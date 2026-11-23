// Stalls — ported verbatim from the live original.
// Evidence: cleanroom/fixtures/_source/app.js (P1A/P1B/P2C/P2D, FOOD, EXPL, STARTUP, ART,
// add(), fmtCubes(), cubeText(), and the flat STALLS index).
// Owners' phone numbers are deliberately not published (as in the original).

import type { Stall, DestZoneId } from "../types";

// [label, name|null, tagline, by]. A null name marks an unallocated slot.
type Row = readonly [string, string | null, string?, string?];
// Experience: [id, label, full name, short label, tagline, cube numbers].
type ExplRow = readonly [string, string, string, string, string, readonly (number | string)[]];

const P1A: readonly Row[] = [
  ["LS 1A", "Maharashtra Adolescent Health Academy", "Reaching the unreached", "Chitra Kulkarni"],
  ["LS 2A", "Ganpat University – Centre of Excellence", "", "Jitendra Gupta"],
  ["LS 3A", "Ganpat University – Centre of Excellence", "", "Jitendra Gupta"],
  ["LS 4A", "Torque Technics", "KYC – Know Your Career and Enhance Your Skills", "Sanjeev Ogale"],
  ["LS 5A", "MANET – MIT-ADT", "Anchor your future at MANET", "Capt. Prerit Misra"],
  ["LS 6A", "BVDUCOA", "", "Rtn. Shrikant Nikam"],
  ["LS 7A", "The Edubridge Program", "", "Crystal Lifestyles (Sports City)"],
  ["LS 8A", "MindLyft AI", "", "Shubham Jadhav"],
  ["LS 9A", "SNDTWU Chetna", "", "Rtn. Pallavi Raut, SNDT"],
  ["LS 10A", "Dnyanadeep Academy for UPSC & MPSC", "", "Shubham Jadhav"],
  ["LS 11A", "Chinmay Education Consultancy / Basic Tutorials", "Overseas education and tuition classes", "Rtn. Sameer Basic"],
  ["LS 12A", "Maharshi Karve Stree Shikshan Samstha (MKSS)", "", "Ujwal Tyade"],
  ["LS 13A", "Krishna Popalghat", "", ""],
];
const P1B: readonly Row[] = [
  ["LS 1B", "Sana Cyber Forensics", "Investigation and Data Security Services Pvt Ltd", "Nachiket Dandekar"],
  ["LS 2B", "Herbayog", "Essence of Ayurveda", "The Varma Pharmacy Pvt Ltd"],
  ["LS 3B", "Raytechi Shala", "", "Rtn. Jyoti Sawardekar"],
  ["LS 4B", "Raytechi Shala", "", "Rtn. Jyoti Sawardekar"],
  ["LS 5B", "New PPC Stationery & Printing Hub", "", "Newppc Gindra"],
  ["LS 6B", "AARNELL Education Pvt Ltd", "", "Rtn. Vaishali Rawalh"],
  ["LS 7B", "Merchant Navy", "Your future beyond the horizon", "Rtn. Capt. Anil Mehta (Sports City)"],
  ["LS 8B", "Anvisha Holidays", "", "Rtn. Vishal Yeole"],
  ["LS 9B", "PCET", "", "SB Patil College"],
  ["LS 10B", "PCU", "", "SB Patil College"],
  ["LS 11B", "Worldwide Properties", "", "Rtn. Priya Phadnis"],
];
const P2C: readonly Row[] = [
  ["1C", "Jaipur Elegance", "", "Rtn. Shruti Marulkar"],
  ["2C", "Sanmati Bal Niketan", "", ""],
  ["3C", "Skolarmind", "Best study option for enhancing quality, ensuring success", "Archhiita Maadkke"],
  ["4C", "Bhoi Foundation, Pune", "Youth Against Narcotics", "Dr. Milind Bhoi"],
  ["5C", "ISTRO Safety Training & Education Services Pvt Ltd", "", "Rtn. Ashok Shinde"],
  ["6C", "Jeevan Anand Corporate Insurance Services", "Since 1993", "Shashikant Pande"],
  ["7C", "Mireva", "", "Rashmi Joshi"],
  ["8C", "Marathwada College Tourism", "", "Anil Bhosale"],
  ["9C", "Bureau of Indian Standards", "Pune Branch Office", "Harsh Bis"],
  ["10C", "Kaamya Crystals", "", "Rtn. Dr. Aarti Nawathe"],
  ["11C", "EuroGlobal Education Pvt Ltd, Pune", "", "Mayuresh Kulkarni"],
  ["12C", null],
];
const P2D: readonly Row[] = [
  ["1D", "MAHER", "", "Maher NGO"],
  ["2D", "Criticam Medical Systems LLP", "", "Girish Mathkar"],
  ["3D", "RYE – NGSE", "Rotary Youth Exchange and New Generations Service Exchange", "Sarika Rode"],
  ["4D", "Let’s RISE", "", "Prasad Ganpule"],
  ["5D", "B G Kelkar Group Tours and Education", "", "Manish Kelkar"],
  ["6D", "Suvarna Prakash Talent Solutions", "", "Rtn. Akshay Pandit"],
  ["7D", "EduPath", "", "Ravi Bendre"],
  ["8D", null],
];

// Food Court: sign position -> [code, name, tagline, by].
const FOOD: Record<number, Row> = {
  1: ["F01", "Kadhipan Snacks", "", "Rtn. Ankita Joshi"],
  2: ["F02", "Spade and Clover Panipuri", "", "Rohit Kumbhar"],
  3: ["F03", "Waffle Station × The Paradise", "", "Atul Zadpe"],
  4: ["F04", "Vayam Bharatiya", "", "Pruthviraj Chavan"],
  6: ["F06", "Cakes Over People", "", "Anuradhan"],
  7: ["F07", "OBagl", "Gourmet bagel sandwiches", "Varun Ahuja"],
  9: ["F20", "Mankar Dosa", "Warje Branch", "Rtn. Savita Pravin"],
  10: ["F25", "Sampada Mahila Bachat Gat", "", "Stree Shakti"],
  11: ["F26", "Freshly Yours", "", "Nikhil Jain"],
  12: ["F28", "Rajasthani Royal Thali", "", "Kishanlal Sharma"],
  13: ["F29", "Parampara Dining", "", "Madndar Kulkarni"],
  14: ["F30", "Rotary Indian Food Stall", "", "Madndar Kulkarni"],
  15: ["F31", "Rotary Indian Food Stall", "", "Madndar Kulkarni"],
};

const EXPL: readonly ExplRow[] = [
  ["1", "Stall 1", "Deccan Education Society", "DES (host)", "Host", [1]],
  ["2", "Stall 2", "NEA", "NEA", "", [2, 3, 4]],
  ["3", "Stall 3", "NSF", "NSF", "", [5, 6, 7]],
  ["4", "Stall 4", "AISSMS", "AISSMS", "", [8, 9, 10]],
  ["5", "Stall 5", "Dnyanadeep Academy", "Dnyanadeep Academy", "", [11, 12, 13]],
  ["6", "Stall 6", "MindLyft AI", "MindLyft AI", "", [14, 15, 16]],
  ["7", "Stall 7", "Cyber Security", "Cyber Security", "", [17, 18]],
  ["8", "Stall 8", "Cosmos Bank", "Cosmos Bank", "", [19, 20]],
  ["9", "Stall 9", "Tolani Maritime Institute", "Tolani Maritime", "", [21]],
  ["10", "Stall 10", "WOL3D", "WOL3D 3D printing", "3D printing", [22, 23, 24]],
  ["11", "Stall 11", "Jadhwar College", "Jadhwar College", "", [25]],
  ["12", "Stall 12", "Kinetic", "Kinetic", "", [26, 27]],
  ["13", "Stall 13", "CRPF", "CRPF", "Central Reserve Police Force", [28, 29, 30]],
  ["14", "Stall 14", "Rajmata Jijau College", "Rajmata Jijau College", "", [31, 32, 33, 34]],
  ["15", "Stall 15", "Carver Aviation", "Carver Aviation", "", [35, 36, 37]],
  ["16", "Stall 16", "Centre for Science Education & Communication", "CSEC, SPPU", "SPPU", [38, 39]],
  ["17", "Stall 17", "DRDO", "DRDO", "Defence Research and Development Organisation", [40, 41, 42, 43, 44]],
  ["18", "Stall 18", "Deccan College", "Deccan College", "", [45, 46]],
  ["19", "Stall 19", "Ruby Hall Clinic", "Ruby Hall Clinic", "", [47, 48]],
  ["20", "Stall 20", "BIS", "BIS", "Bureau of Indian Standards", [49, 50, 51]],
  ["21", "Stall 21", "Bakliwal Tutorials", "Bakliwal Tutorials", "", [52]],
  ["22", "Stall 22", "Soft Access Solutions", "Soft Access Solutions", "", [53]],
  ["23", "Stall 23", "Maharashtra Knowledge Corporation Ltd", "MKCL", "MKCL", [54, 55, 56]],
  ["24", "Stall 24", "Nandan Buildcon", "Nandan Buildcon", "", [57, 58]],
  ["25", "Stall 25", "LEDO India", "LEDO India", "", [59]],
  ["26", "Stall 26", "Zesty Vibe", "Zesty Vibe", "", [60]],
  ["27", "Stall 27", "BIG FM", "BIG FM", "", [61]],
  ["28", "Stall 28", "Sakal", "Sakal", "", [62]],
  ["Op1", "Open 1", "Neebe", "Neebe", "Open ground + stall", ["Op1", "Op2"]],
  ["Op2", "Open 2", "Indian Air Force", "Air Force", "", ["Op3", "Op4"]],
  ["Op3", "Open 3", "Indian Navy", "Navy", "", ["Op5", "Op6"]],
  ["Op4", "Open 4", "Indian Army", "Army", "", ["Op7", "Op8"]],
];

const STARTUP: readonly Row[] = [
  ["G01", "Pottery Den", "", "Archana Deshpande"],
  ["G02", "Aura", "", "Archana Deshpande"],
  ["G03", "Kayo Printees", "", "Mrudula Mahamunkar"],
  ["G04", "House of Bahava", "", "Hritik"],
  ["G05", "Trackk", "", "Manas Navjekar"],
  ["G06", null],
  ["G07", null],
  ["G08", "Pune Protein Company", "", "Samkit"],
];

const ART: readonly Row[] = [
  ["AA1", "ZiMi 3D Creations", "", "Vishal Shah"],
  ["AA2", "Twisted Bliss", "Find your perfect twist", "Ankita"],
  ["AA3", "Creative Canopies", "", "Pooja"],
  ["AA4", "Lumascenta", "", "Madhura Mungi"],
  ["AA5", "Unnati Pediatric Rehabilitation Center", "", "Dr. Rohan Wale"],
  ["AA6", "Ombre Nail Bar · M3D Works", "", "Labdhi Desai"],
];

/** Format a cube list like the original: "1", "2–4", "Op1–Op2". */
export function fmtCubes(cubes: readonly (number | string)[]): string {
  const n = cubes.map((v) => (typeof v === "string" ? +v.replace("Op", "") : v));
  const lo = Math.min(...n), hi = Math.max(...n);
  const p = typeof cubes[0] === "string" ? "Op" : "";
  return lo === hi ? p + lo : p ? `${p}${lo}–${p}${hi}` : `${lo}–${hi}`;
}

/** "Cube 1" / "Cubes 2–4" / "" — matches the original's cubeText(). */
export function cubeText(s: string): string {
  return s ? (s.includes("–") ? "Cubes " : "Cube ") + s : "";
}

function build(): Record<string, Stall> {
  const out: Record<string, Stall> = {};
  const add = (
    zone: DestZoneId, key: string, label: string, name: string,
    tag = "", by = "", sub = "", cubes = "", short = "",
  ): void => {
    out[key] = { key, zone, label, name, tag, by, sub, cubes, short };
  };

  for (const r of [...P1A, ...P1B]) if (r[1]) add("commercial", `c-${r[0]}`, r[0], r[1], r[2], r[3], "Pathway 1");
  for (const r of [...P2C, ...P2D]) if (r[1]) add("commercial", `c-${r[0]}`, r[0], r[1], r[2], r[3], "Pathway 2");
  for (const [p, r] of Object.entries(FOOD)) add("food", `f-${p}`, `Stall ${p}`, r[1] as string, r[2], r[3], `Code ${r[0]}`);
  for (const [id, label, name, short, tag, cubes] of EXPL) add("experience", `x-${id}`, label, name, tag, "", "Experience Zone", fmtCubes(cubes), short);
  for (const r of STARTUP) if (r[1]) add("startup", `g-${r[0]}`, r[0], r[1], r[2], r[3], "10 × 10 ft");
  for (const r of ART) add("art", `aa-${r[0]}`, r[0], r[1] as string, r[2], r[3], "10 × 10 ft");

  return out;
}

/** Flat index of every stall, keyed by its map/search key. */
export const STALLS: Record<string, Stall> = build();

export const RAW = { P1A, P1B, P2C, P2D, FOOD, EXPL, STARTUP, ART };
