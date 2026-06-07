# Solidified portfolio (`solidified.dev`)

Vite + React + TypeScript personal site — intro gate, CRT/pastel “main phase,” and auto-listed project cards.

Handle: **Soli / Solidified** ([GitHub @SolidifiedPlayDoh](https://github.com/SolidifiedPlayDoh)).

---

## Scripts

```bash
npm install
npm run dev      # local dev server
npm run build    # production bundle → dist/
npm run preview  # preview dist/
```

---

## Adding a project page

1. Add your page component under `src/pages/` (or similar).
2. Create `src/projects/<slug>/meta.ts` exporting a `ProjectDefinition` (see `src/projects/femtanylFNF/meta.ts`).
3. The homepage **Projects** grid and app routes pick it up automatically — no manual card list.

Homepage copy lives in `src/content/siteDefaults.ts`.

Optional env var:

| Variable | Purpose |
|---------|---------|
| `VITE_SITE_ORIGIN` | Canonical origin for Open Graph URLs (default `https://solidified.dev`) |

---

## Editing site copy

- **Source defaults:** [`src/content/siteDefaults.ts`](src/content/siteDefaults.ts)
- Dev-only (or prod with flag): floating **live editor** merges into drafted content and debounces into `localStorage`; **Export JSON** → merge back into TypeScript defaults for Git-backed truth.
