#!/usr/bin/env bash
# Deploy feedback proxy — webhook stays in Cloudflare secrets only.
set -euo pipefail
cd "$(dirname "$0")/../workers/feedback-proxy"

echo "→ Checking Cloudflare login…"
npx wrangler@latest whoami || {
  echo "Run: npx wrangler login"
  exit 1
}

echo "→ Deploying worker…"
npx wrangler@latest deploy

echo ""
echo "→ Set webhook secret (paste URL when prompted; input is hidden):"
npx wrangler@latest secret put DISCORD_WEBHOOK_URL

echo ""
echo "Done. Add the workers.dev URL as GitHub secret VITE_FEEDBACK_URL, then redeploy the site."
