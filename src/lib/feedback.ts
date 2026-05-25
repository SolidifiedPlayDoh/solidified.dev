import { scanForAdvertising } from "./feedbackGuards";
import { collectClientMeta, formatMetaForDiscord, type FeedbackMeta } from "./feedbackMeta";
import { resolveFeedbackWebhook } from "./feedbackWebhook";
import { verifyTurnstileToken } from "./turnstile";

export type FeedbackPayload = {
  message: string;
  page: string;
  context?: string;
  turnstileToken: string;
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

type DiscordEmbedOpts = {
  title: string;
  description: string;
  color: number;
  meta?: FeedbackMeta;
  context?: string;
  page: string;
};

function discordEmbed(opts: DiscordEmbedOpts) {
  const fields: { name: string; value: string; inline?: boolean }[] = [
    { name: "Page", value: opts.page || "(unknown)", inline: false },
  ];
  if (opts.context) {
    fields.push({ name: "Context", value: opts.context, inline: true });
  }
  if (opts.meta) {
    fields.push({
      name: "Client",
      value: formatMetaForDiscord(opts.meta).slice(0, 1024),
      inline: false,
    });
  }
  return {
    username: "solidified.dev",
    embeds: [
      {
        title: opts.title,
        description: opts.description.slice(0, 4096),
        color: opts.color,
        fields,
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

/** Browser-safe: multipart + no-cors avoids JSON CORS blocks on third-party POST. */
async function postToIngress(target: string, body: Record<string, unknown>): Promise<boolean> {
  try {
    const form = new FormData();
    form.append("payload_json", JSON.stringify(body));
    await fetch(target, { method: "POST", body: form, mode: "no-cors" });
    return true;
  } catch {
    return false;
  }
}

async function sendIngressEmbed(
  target: string,
  opts: DiscordEmbedOpts,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const ok = await postToIngress(target, discordEmbed(opts));
  return ok ? { ok: true } : { ok: false, error: "Could not reach Discord." };
}

async function submitViaProxy(
  endpoint: string,
  payload: FeedbackPayload,
  meta: FeedbackMeta,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, meta }),
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

async function notifyBlockedAttempt(
  payload: FeedbackPayload,
  meta: FeedbackMeta,
  adLabel: string,
): Promise<void> {
  const ingress = resolveFeedbackWebhook();
  if (!ingress) return;

  await sendIngressEmbed(ingress, {
    title: "🚫 Feedback blocked (advertising)",
    description: `Detected **${adLabel}** in a submission.\n\n~~message withheld~~`,
    color: 0xff4466,
    meta,
    context: payload.context,
    page: payload.page,
  });
}

export async function submitFeedback(
  payload: FeedbackPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const captcha = await verifyTurnstileToken(payload.turnstileToken);
  if (!captcha.ok) return captcha;

  const ad = scanForAdvertising(payload.message);
  const meta = await collectClientMeta(ad.blocked ? [`ad:${ad.label}`] : []);

  if (ad.blocked) {
    void notifyBlockedAttempt(payload, meta, ad.label);
    return { ok: false, error: ad.reason };
  }

  const embedOpts: DiscordEmbedOpts = {
    title: "Site feedback",
    description: payload.message,
    color: 0x39f6ff,
    meta,
    context: payload.context,
    page: payload.page,
  };

  const proxy = getFeedbackProxyUrl();
  if (proxy) return submitViaProxy(proxy, payload, meta);

  const ingress = resolveFeedbackWebhook();
  if (ingress) return sendIngressEmbed(ingress, embedOpts);

  return { ok: false, error: "Feedback is not configured." };
}
