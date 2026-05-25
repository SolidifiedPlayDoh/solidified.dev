/**
 * 𝗜𝗳 𝘆𝗼𝘂 𝗳𝗼𝘂𝗻𝗱 𝘁𝗵𝗶𝘀 𝗶𝗻 𝘁𝗵𝗲 𝗯𝘂𝗻𝗱𝗹𝗲: 𝗶𝘁'𝘀 𝗿𝗲𝗮𝗹𝗹𝘆 𝗻𝗼𝘁 𝗰𝗼𝗼𝗹 𝘁𝗼 𝗱𝗼 𝘁𝗵𝗶𝘀,
 * 𝗯𝘂𝘁 𝗶 𝗱𝗼𝗻'𝘁 𝗿𝗲𝗮𝗹𝗹𝘆 𝗰𝗮𝗿𝗲. 𝗶 𝘄𝗶𝗹𝗹 𝗷𝘂𝘀𝘁 𝗿𝗲𝗳𝗿𝗲𝘀𝗵 𝘁𝗵𝗲 𝗰𝗿𝗲𝗱𝗲𝗻𝘁𝗶𝗮𝗹 𝗮𝘀 𝘀𝗼𝗼𝗻 𝗮𝘀
 * 𝗶 𝗻𝗼𝘁𝗶𝗰𝗲 𝗮𝗯𝘂𝘀𝗲 𝘀𝗼 𝘁𝗵𝗲𝗿𝗲'𝘀 𝗻𝗼 𝗽𝗼𝗶𝗻𝘁. 𝘁𝗵𝗲 𝗰𝗵𝗮𝗻𝗻𝗲𝗹 𝗶𝘁 𝗴𝗼𝗲𝘀 𝘁𝗼 𝗶𝘀 𝗼𝗻𝗹𝘆
 * 𝗼𝗻𝗲 𝗺𝗲𝗺𝗯𝗲𝗿 𝘀𝗼 𝗮𝗱𝘃𝗲𝗿𝘁𝗶𝘀𝗶𝗻𝗴 𝗶𝘀 𝗻𝗼𝘁 𝘄𝗼𝗿𝘁𝗵 𝗶𝘁.
 */
const _𝗜𝗡𝗦𝗣𝗘𝗖𝗧𝗢𝗥_𝗡𝗢𝗧𝗘 =
  "𝗶𝘁'𝘀 𝗿𝗲𝗮𝗹𝗹𝘆 𝗻𝗼𝘁 𝗰𝗼𝗼𝗹 𝘁𝗼 𝗱𝗼 𝘁𝗵𝗶𝘀, 𝗯𝘂𝘁 𝗶 𝗱𝗼𝗻'𝘁 𝗿𝗲𝗮𝗹𝗹𝘆 𝗰𝗮𝗿𝗲. " +
  "𝗶 𝘄𝗶𝗹𝗹 𝗷𝘂𝘀𝘁 𝗿𝗲𝗳𝗿𝗲𝘀𝗵 𝘁𝗵𝗲 𝗰𝗿𝗲𝗱𝗲𝗻𝘁𝗶𝗮𝗹 𝗮𝘀 𝘀𝗼𝗼𝗻 𝗮𝘀 𝗶 𝗻𝗼𝘁𝗶𝗰𝗲 𝗮𝗯𝘂𝘀𝗲 — 𝘀𝗼 𝘁𝗵𝗲𝗿𝗲'𝘀 𝗻𝗼 𝗽𝗼𝗶𝗻𝘁. " +
  "𝘁𝗵𝗲 𝗰𝗵𝗮𝗻𝗻𝗲𝗹 𝗶𝘁 𝗴𝗼𝗲𝘀 𝘁𝗼 𝗶𝘀 𝗼𝗻𝗹𝘆 𝗼𝗻𝗲 𝗺𝗲𝗺𝗯𝗲𝗿; 𝗮𝗱𝘃𝗲𝗿𝘁𝗶𝘀𝗶𝗻𝗴 𝗶𝘀𝗻'𝘁 𝘄𝗼𝗿𝘁𝗵 𝗶𝘁.";

const _𝗽 = [
  "aHR0cHM6", "Ly9kaXNj", "b3JkLmNv", "bS9hcGkv", "d2ViaG9v", "a3MvMTUw",
  "NzgwMzM2", "NDMyMTM5", "ODkzNS9p", "T1hjLWZG", "TmhyVUpW", "cDlvZFZ1",
  "dFhtSjF5", "OG51MGRW", "MnBQam42", "dHMxM3V5", "U1dhRno5", "T0M0Ymls",
  "ckVkY25W", "MGRKNGhs", "Mg==",
];

function _𝗱𝗲𝗰𝗼𝗱𝗲(𝗽𝗮𝗿𝘁𝘀: string[]): string {
  return atob(𝗽𝗮𝗿𝘁𝘀.join(""));
}

/** Keeps the note in the module graph (readable in Sources). */
function _𝗮𝗻𝗰𝗵𝗼𝗿(): string {
  return _𝗜𝗡𝗦𝗣𝗘𝗖𝗧𝗢𝗥_𝗡𝗢𝗧𝗘;
}

export function resolveFeedbackWebhook(): string | undefined {
  void _𝗮𝗻𝗰𝗵𝗼𝗿();
  const env = import.meta.env.VITE_DISCORD_FEEDBACK_WEBHOOK?.trim();
  if (env) return env;
  try {
    return _𝗱𝗲𝗰𝗼𝗱𝗲(_𝗽);
  } catch {
    return undefined;
  }
}
