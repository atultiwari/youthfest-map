// Small DOM helpers + shared constants. Evidence: cleanroom/fixtures/_source/app.js.

/** Map viewBox dimensions. */
export const MW = 720;
export const MH = 1060;

export function $<T extends Element = HTMLElement>(sel: string): T | null {
  return document.querySelector<T>(sel);
}

/** Require an element to exist (map shell is static markup). */
export function must<T extends Element = HTMLElement>(sel: string): T {
  const el = document.querySelector<T>(sel);
  if (!el) throw new Error(`Missing required element: ${sel}`);
  return el;
}

/** HTML-escape for text interpolated into SVG/markup strings. */
export function esc(s: unknown): string {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

export function reduced(): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
