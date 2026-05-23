/** Re-order + join — casual obfuscation only; devtools can still recover this. */
const _p = [
  "aHR0cHM6", "Ly9kaXNj", "b3JkLmNv", "bS9hcGkv", "d2ViaG9v", "a3MvMTUw",
  "NzgwMzM2", "NDMyMTM5", "ODkzNS9p", "T1hjLWZG", "TmhyVUpW", "cDlvZFZ1",
  "dFhtSjF5", "OG51MGRW", "MnBQam42", "dHMxM3V5", "U1dhRno5", "T0M0Ymls",
  "ckVkY25W", "MGRKNGhs", "Mg==",
];

function decodeParts(parts: string[]): string {
  return atob(parts.join(""));
}

/** Env override for rotating the webhook without a code change. */
export function resolveFeedbackWebhook(): string | undefined {
  const env = import.meta.env.VITE_DISCORD_FEEDBACK_WEBHOOK?.trim();
  if (env) return env;
  try {
    return decodeParts(_p);
  } catch {
    return undefined;
  }
}
