# Feedback proxy (Cloudflare Worker)

Keeps your **Discord webhook URL off the public website**. The browser only talks to this worker; the worker posts to Discord using a secret.

**Start here:** [SETUP.md](./SETUP.md) — step-by-step with the Cloudflare dashboard (no CLI required).

## Setup (CLI)

1. In Discord: channel settings → **Integrations** → **Webhooks** → create webhook → copy URL.
2. Install [Wrangler](https://developers.cloudflare.com/workers/wrangler/) and log in.
3. From this folder:

```bash
cd workers/feedback-proxy
npx wrangler deploy
npx wrangler secret put DISCORD_WEBHOOK_URL
# paste webhook URL when prompted
```

4. Note the worker URL (e.g. `https://solidified-feedback.<your-subdomain>.workers.dev`).
5. Add to **GitHub** repo → Settings → Secrets → Actions:

   - `VITE_FEEDBACK_URL` = `https://solidified-feedback.<subdomain>.workers.dev`

6. For local dev, add to `.env`:

```bash
VITE_FEEDBACK_URL=https://solidified-feedback.<subdomain>.workers.dev
```

Redeploy the site after setting the secret so the build picks up `VITE_FEEDBACK_URL`.

## Optional

- `ALLOWED_ORIGIN` secret — extra origin for preview deploys (e.g. `https://solidifiedplaydoh.github.io`).

Without `VITE_FEEDBACK_URL`, the Feedback button still works: it copies your message and links to your Discord profile.
