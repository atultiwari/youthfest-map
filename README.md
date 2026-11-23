# Youthfest Festival Map

Interactive festival wayfinding map for the **Rotary Rotaract Youth Festival 2026**
(Fergusson College Ground, Pune · 21–22 November): search or tap a zone and get walked
there along the site map.

A clean, framework-free rebuild in **vanilla TypeScript + Vite**, hosted on **GitHub Pages**.

> This is an independent rebuild made with the festival organiser's consent. It is not the
> original source; it was reconstructed from the public behaviour of the live site.

## Develop

```bash
npm install
npm run dev        # local dev server
npm run check      # typecheck + unit tests + production build
npm run build      # build static site into dist/
npm run preview    # preview the production build
```

## Hosting

Every push to `main` builds the Vite site and deploys `dist/` to GitHub Pages via
`.github/workflows/deploy.yml`. No Netlify or other host required.

## Structure

```
index.html            app shell
src/                  app code (map, search, routing, walker, data) — added in batches
tests/                unit tests (Vitest)
.github/workflows/    GitHub Pages deploy
```
