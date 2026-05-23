import { resolveFeedbackWebhook } from "./feedbackWebhook";

export type FeedbackPayload = {
  message: string;
  page: string;
  context?: string;
};

export const FEEDBACK_OPEN_EVENT = "solidified:open-feedback";

export type FeedbackOpenDetail = {
  prefill?: string;
  context?: string;
};

/** Optional Cloudflare Worker proxy (JSON). */
export function getFeedbackProxyUrl(): string | undefined {
  const url = import.meta.env.VITE_FEEDBACK_URL?.trim();
  return url || undefined;
}

export function isFeedbackEnabled(): boolean {
  return Boolean(getFeedbackProxyUrl() || resolveFeedbackWebhook());
}

export function openFeedbackDialog(detail?: FeedbackOpenDetail) {
  window.dispatchEvent(
    new CustomEvent<FeedbackOpenDetail>(FEEDBACK_OPEN_EVENT, { detail }),
  );
}

function discordPayload(payload: FeedbackPayload) {
  const fields: { name: string; value: string; inline?: boolean }[] = [
    { name: "Page", value: payload.page || "(unknown)", inline: false },
  ];
  if (payload.context) {
    fields.push({ name: "Context", value: payload.context, inline: true });
  }
  return {
    username: "solidified.dev",
    embeds: [
      {
        title: "Site feedback",
        description: payload.message.slice(0, 4096),
        color: 0x39f6ff,
        fields,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

/** Browser-safe: multipart + no-cors avoids Discord JSON CORS blocks. */
async function submitViaDiscordWebhook(
  webhookUrl: string,
  payload: FeedbackPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const body = new FormData();
    body.append("payload_json", JSON.stringify(discordPayload(payload)));
    await fetch(webhookUrl, { method: "POST", body, mode: "no-cors" });
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach Discord." };
  }
}

async function submitViaProxy(
  endpoint: string,
  payload: FeedbackPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: text || `Server returned ${res.status}`,
      };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the feedback server." };
  }
}

export async function submitFeedback(
  payload: FeedbackPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const proxy = getFeedbackProxyUrl();
  if (proxy) return submitViaProxy(proxy, payload);

  const webhook = resolveFeedbackWebhook();
  if (webhook) return submitViaDiscordWebhook(webhook, payload);

  return { ok: false, error: "Feedback is not configured." };
}
