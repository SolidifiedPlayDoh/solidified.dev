export type FeedbackMeta = {
  ip?: string;
  userAgent: string;
  viewport: string;
  timezone: string;
  language: string;
  platform: string;
  referrer: string;
  deviceMemory?: string;
  hardwareConcurrency?: string;
  flags: string[];
};

async function fetchPublicIp(): Promise<string | undefined> {
  try {
    const res = await fetch("https://api.ipify.org?format=json", {
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as { ip?: string };
    return data.ip?.trim() || undefined;
  } catch {
    return undefined;
  }
}

/** Best-effort client metadata (IP is approximate; no GPS). */
export async function collectClientMeta(flags: string[] = []): Promise<FeedbackMeta> {
  const nav = navigator;
  const ip = await fetchPublicIp();

  return {
    ip,
    userAgent: nav.userAgent.slice(0, 512),
    viewport: `${window.innerWidth}×${window.innerHeight} (@${devicePixelRatio}x)`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: nav.language,
    platform: nav.platform || "unknown",
    referrer: document.referrer || "(direct)",
    deviceMemory:
      "deviceMemory" in nav ? String((nav as Navigator & { deviceMemory?: number }).deviceMemory) : undefined,
    hardwareConcurrency:
      nav.hardwareConcurrency != null ? String(nav.hardwareConcurrency) : undefined,
    flags,
  };
}

export function formatMetaForDiscord(meta: FeedbackMeta): string {
  const lines = [
    meta.ip ? `**IP:** ${meta.ip}` : "**IP:** (lookup failed)",
    `**TZ:** ${meta.timezone}`,
    `**Lang:** ${meta.language}`,
    `**Viewport:** ${meta.viewport}`,
    `**Platform:** ${meta.platform}`,
    meta.deviceMemory ? `**RAM (approx):** ${meta.deviceMemory} GB` : null,
    meta.hardwareConcurrency ? `**CPU threads:** ${meta.hardwareConcurrency}` : null,
    `**Referrer:** ${meta.referrer.slice(0, 200)}`,
    `**UA:** \`${meta.userAgent.slice(0, 180)}\``,
  ].filter(Boolean);
  if (meta.flags.length) {
    lines.push(`**Flags:** ${meta.flags.join(", ")}`);
  }
  return lines.join("\n");
}
