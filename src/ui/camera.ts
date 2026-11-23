// Map camera: animated viewBox pan/zoom. Evidence: cleanroom/fixtures/_source/app.js
// (vb, setVB(), fitBox(), camTo()).

import type { Point } from "../types";
import { $, MW, MH, reduced } from "./dom";

export type Box = [number, number, number, number];

let vb: Box = [0, 0, MW, MH];
let camAnim = 0;

export function getVB(): Box {
  return vb;
}

export function setVB(v: Box): void {
  vb = v;
  $("#map")?.setAttribute("viewBox", v.map((n) => n.toFixed(1)).join(" "));
}

/** Frame a set of points with padding, preserving the map aspect ratio. */
export function fitBox(pts: readonly Point[], minW = 400): Box {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const pad = 90;
  const ratio = MW / MH;
  const x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad;
  const y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
  let w = x1 - x0, h = y1 - y0;
  if (w / h > ratio) h = w / ratio;
  else w = h * ratio;
  if (w < minW) {
    w = minW;
    h = w / ratio;
  }
  if (w > MW) {
    w = MW;
    h = MH;
  }
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return [
    Math.min(Math.max(cx - w / 2, 0), MW - w),
    Math.min(Math.max(cy - h / 2, 0), MH - h),
    w,
    h,
  ];
}

export function camTo(target: Box, ms: number, done?: () => void): void {
  cancelAnimationFrame(camAnim);
  if (reduced()) {
    setVB(target);
    done?.();
    return;
  }
  const from = vb.slice() as Box;
  const t0 = performance.now();
  const ease = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const step = (now: number): void => {
    const t = Math.min(1, (now - t0) / ms);
    const e = ease(t);
    setVB(from.map((v2, i) => v2 + (target[i] - v2) * e) as Box);
    if (t < 1) camAnim = requestAnimationFrame(step);
    else done?.();
  };
  camAnim = requestAnimationFrame(step);
}
