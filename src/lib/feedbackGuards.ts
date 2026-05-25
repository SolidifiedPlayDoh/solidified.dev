export type AdScanResult =
  | { blocked: false }
  | { blocked: true; reason: string; label: string };

const RULES: { label: string; reason: string; test: RegExp }[] = [
  {
    label: "discord.gg",
    reason: "Discord invite links aren’t allowed in feedback.",
    test: /discord\.gg\/[^\s]+/i,
  },
  {
    label: "discord invite",
    reason: "Discord invite links aren’t allowed in feedback.",
    test: /discord(?:app)?\.com\/invite\/[^\s]+/i,
  },
  {
    label: "dsc.gg",
    reason: "Short invite links aren’t allowed in feedback.",
    test: /\bdsc\.gg\/[^\s]+/i,
  },
  {
    label: "telegram promo",
    reason: "Telegram invite links aren’t allowed in feedback.",
    test: /\bt\.me\/[^\s]+/i,
  },
];

/** Block obvious server / invite advertising in feedback text. */
export function scanForAdvertising(text: string): AdScanResult {
  const normalized = text.trim();
  for (const rule of RULES) {
    if (rule.test.test(normalized)) {
      return { blocked: true, reason: rule.reason, label: rule.label };
    }
  }
  return { blocked: false };
}
