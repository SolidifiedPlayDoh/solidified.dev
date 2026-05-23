/**
 * Cloudflare Worker — forwards site feedback to a Discord webhook.
 * The webhook URL lives only in Worker secrets (DISCORD_WEBHOOK_URL), never in the Vite bundle.
 *
 * Deploy: see workers/feedback-proxy/README.md
 */

const MAX_MESSAGE = 2000;
const ALLOWED_ORIGINS = new Set([
  "https://solidified.dev",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function corsHeaders(origin, env) {
  const extra = env.ALLOWED_ORIGIN?.trim();
  const allowed =
    (origin && ALLOWED_ORIGINS.has(origin)) ||
    (extra && origin === extra);
  const allowOrigin = allowed ? origin : ALLOWED_ORIGINS.values().next().value;
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") ?? "";
    const cors = corsHeaders(origin, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, cors);
    }

    const webhook = env.DISCORD_WEBHOOK_URL?.trim();
    if (!webhook) {
      return json({ error: "Webhook not configured" }, 503, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400, cors);
    }

    const message = String(body.message ?? "").trim();
    const page = String(body.page ?? "").trim().slice(0, 500);
    const context = String(body.context ?? "").trim().slice(0, 200);

    if (message.length < 8 || message.length > MAX_MESSAGE) {
      return json({ error: "Message length invalid" }, 400, cors);
    }

    const embed = {
      title: "Site feedback",
      description: message.slice(0, 4096),
      color: 0x39f6ff,
      fields: [
        { name: "Page", value: page || "(unknown)", inline: false },
      ],
      timestamp: new Date().toISOString(),
    };
    if (context) {
      embed.fields.push({ name: "Context", value: context, inline: true });
    }

    const discordRes = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "solidified.dev",
        embeds: [embed],
      }),
    });

    if (!discordRes.ok) {
      return json({ error: "Discord webhook failed" }, 502, cors);
    }

    return json({ ok: true }, 200, cors);
  },
};
