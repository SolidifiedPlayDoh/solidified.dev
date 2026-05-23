# Wire up feedback (≈5 minutes, no coding)

Your Discord webhook must **never** go in the website code or GitHub repo. It only lives in Cloudflare as an encrypted secret.

> **If you already pasted your webhook in chat or committed it somewhere:** Discord → your feedback channel → **Integrations** → **Webhooks** → **Edit** → **Reset token** (or delete and make a new webhook). Use the **new** URL only in step 4 below.

## 1. Cloudflare account

1. Open [dash.cloudflare.com](https://dash.cloudflare.com) and sign up or log in (free plan is fine).
2. You do **not** need to move `solidified.dev` DNS unless you want to — Workers work on `*.workers.dev` without touching your domain.

## 2. Create the worker (browser UI)

1. Left sidebar → **Workers & Pages** → **Create**.
2. Choose **Create Worker** → name it something like `solidified-feedback` → **Deploy**.
3. On the worker page, **Edit code** (or **Quick edit**).
4. Delete everything in the editor and paste the full contents of [`worker.js`](./worker.js) from this folder.
5. **Save and deploy**.

## 3. Allow your site to call the worker

The worker already allows `https://solidified.dev` and local dev. If you use another preview URL, add a secret in step 4 called `ALLOWED_ORIGIN` with that exact origin (e.g. `https://solidifiedplaydoh.github.io`).

## 4. Add the Discord webhook (secret)

1. On the worker page → **Settings** → **Variables and Secrets**.
2. **Add** → type **Secret** → name: `DISCORD_WEBHOOK_URL`
3. Value: paste your **new** Discord webhook URL (from channel Integrations → Webhooks).
4. Save / deploy again if prompted.

## 5. Copy the worker URL

On the worker overview you’ll see a URL like:

`https://solidified-feedback.<your-subdomain>.workers.dev`

Copy that **exact** URL (no trailing slash).

## 6. Tell the website where to send feedback

### GitHub Pages (production)

1. GitHub repo → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret**
   - Name: `VITE_FEEDBACK_URL`
   - Value: the worker URL from step 5
3. Push any commit to `main`, or re-run the **Deploy to GitHub Pages** workflow.

### Local dev (optional)

In the repo root `.env` (not committed):

```bash
VITE_FEEDBACK_URL=https://solidified-feedback.<your-subdomain>.workers.dev
```

Restart `npm run dev`.

## 7. Test

1. Open the site → click **Feedback** (bottom-left).
2. Send a short test message.
3. Check your Discord feedback channel.

If it fails, open the browser **Network** tab, click the failed request, and check the response status (403 = wrong origin, 503 = webhook secret missing).

## Optional: CLI instead of the dashboard

If you prefer terminal after `npx wrangler login`:

```bash
cd workers/feedback-proxy
npx wrangler deploy
npx wrangler secret put DISCORD_WEBHOOK_URL
# paste webhook when prompted — never commit it
```

Then do step 6 with the printed `*.workers.dev` URL.
