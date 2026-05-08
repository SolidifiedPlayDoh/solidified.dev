# solidified-portfolio

Neon CRT **intro reel** → crossfade into a minimal **solidified.dev** prototype shell.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Deploy with GitHub Pages → **solidified.dev**

Use this when you want the site hosted on **GitHub** and **`solidified.dev`** pointing at it ([GitHub Pages](https://docs.github.com/pages)).

### One-time repo setup

1. Push this project to GitHub (e.g. [`Solidifiedplaydoh/portfolio`](https://github.com/Solidifiedplaydoh)).

2. In the repo on GitHub: **Settings → Pages**  
   - **Build and deployment**: **Source** → **GitHub Actions** (not “Deploy from a branch” unless you prefer the old flow).

3. Confirm [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml) exists on the default branch (e.g. `main`). Pushing triggers a build; **`dist/`** uploads as the Pages artifact.

4. Wait for green check **Actions**. Your site appears at **`https://<USERNAME>.github.io/<REPO>/`** until you add a custom domain.
   - If assets 404 there, temporarily set **`VITE_BASE_PATH`** to your repo name in the workflow `npm run build` step: `VITE_BASE_PATH: /<REPO>/` (see workflow comment).

### Point **solidified.dev** at GitHub Pages

1. Repo **Settings → Pages → Custom domain** → **`solidified.dev`** (save).  
   - [`public/CNAME`](public/CNAME) is **`solidified.dev`** so publishes stay aligned with that hostname.

2. In **Cloudflare** (or your registrar) DNS for **`solidified.dev`**:
   - **Recommended (subdomain)** `www` → **`CNAME`** **`Solidified.github.io`** (exact casing doesn’t matter; use your GitHub username).
   - **Apex** `solidified.dev`: use GitHub’s [documented IPs / ALIAS guidance](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), or **`CNAME` flattening / ALIAS** to **`Solidified.github.io`** depending on DNS host. Cloudflare apex often uses a **`CNAME`** to **`USERNAME.github.io`** with **Flatten** / **Proxied DNS** carefulness—follow GitHub’s “apex domain” checklist when you validate in Settings.

3. Repo **Pages** will show **DNS check** progress; HTTPS is issued automatically after propagation.

### Optional: **`github.io/repo/`** preview only

In the workflow **`Install and build`** step:

```yaml
env:
  VITE_BASE_PATH: /YOUR-REPO-NAME/
```

Rebuild. For **`https://solidified.dev/`** with no path prefix, use **`/`** (default, leave unset).

---

## Share locally without deploying (tunnel)

Expose Vite briefly with [Cloudflare quick tunnels](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/do-more-with-tunnels/trycloudflare/):

```bash
cloudflared tunnel --url http://localhost:5173
```

## Copy

Edit [`src/content/site.ts`](src/content/site.ts) (`homeCopy`).

## Alternative: Cloudflare Pages

Instead of GitHub Pages, you can attach the repo in **Workers & Pages** with **`npm run build`** / **`dist`**. Avoid running **both** GH Pages **and** Cloudflare Pages on the **exact same hostname**.

## Notes

- **Skip intro** is keyboard-accessible.
- **`prefers-reduced-motion`** shortens the intro and quiets CRT motion.
