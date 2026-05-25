# Solidified portfolio (`solidified.dev`)

Vite + React + TypeScript personal site — intro gate, CRT/pastel “main phase,” auto-listed project cards, and a **Discord presence card** fed by **Lanyard**.

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

## Discord presence card / no public email

The homepage **does not list email**. Contact narrative points people to **Discord** (bots, commissions). The sidebar card polls:

`GET https://api.lanyard.rest/v1/users/<your_discord_snowflake>`

every 30 seconds and shows avatar, status, optional activities/custom status and Spotify metadata when exposed by Lanyard.

### Env vars (`import.meta.env`)

| Variable | Purpose |
|---------|---------|
| `VITE_DISCORD_USER_ID` | Your numeric Discord user snowflake — required for presence + sane default profile links. Enable **Developer Mode** in Discord → right‑click yourself → **Copy User ID**. |
| `VITE_DISCORD_LINK_HREF` | *(Optional)* Overrides every bundled “Discord” pill / CTA (e.g. server invite vanity URL). |
| `VITE_FEEDBACK_URL` | *(Optional)* Cloudflare Worker proxy instead of direct Discord. |
| `VITE_DISCORD_FEEDBACK_WEBHOOK` | *(Optional)* Override the bundled feedback webhook URL. |

### Site feedback button

**Feedback** (bottom-left, every page except OBS pop-out) posts to Discord after **Cloudflare Turnstile** and blocks invite/ad patterns (`discord.gg`, etc.). Blocked ad attempts still ping Discord with client metadata (IP via ipify, UA, timezone, viewport). Set real Turnstile keys in GitHub Actions (`VITE_TURNSTILE_SITE_KEY`, `VITE_TURNSTILE_SECRET_KEY`) — test keys ship as fallback and always pass.

### Adding a project page

1. Add your page component under `src/pages/` (or similar).
2. Create `src/projects/<slug>/meta.ts` exporting a `ProjectDefinition` (see `src/projects/femtanylFNF/meta.ts`).
3. The homepage **Projects** grid and app routes pick it up automatically — no manual card list.

Homepage copy lives in `src/content/siteDefaults.ts`.

**Local `.env` example** (copy from `.env.example`):

```bash
VITE_DISCORD_USER_ID=1220125293272891475
# VITE_DISCORD_LINK_HREF=https://discord.gg/your-invite
```

This repo also bundles that snowflake in `siteDefaults.ts` so builds work before you set Cloudflare env vars. Override with `VITE_DISCORD_USER_ID` anytime.

Live presence endpoint: `https://api.lanyard.rest/v1/users/1220125293272891475`

### Opt in to Lanyard

Per upstream docs, **join the Lanyard Discord**: [discord.gg/UrXF2cfJ7F](https://discord.gg/UrXF2cfJ7F) — then your presence is picked up without self-hosting. Full API details: [github.com/Phineas/lanyard](https://github.com/Phineas/lanyard).

---

## Editing site copy

- **Source defaults:** [`src/content/siteDefaults.ts`](src/content/siteDefaults.ts)
- Dev-only (or prod with flag): floating **live editor** merges into drafted content and debounces into `localStorage`; **Export JSON** → merge back into TypeScript defaults for Git-backed truth.
