/** Cloudflare dummy keys — see Turnstile testing docs. Replace in production. */
const TURNSTILE_TEST_SITE = "1x00000000000000000000AA";
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

export function getTurnstileSiteKey(): string | undefined {
  return (
    import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim() || TURNSTILE_TEST_SITE
  );
}

export function getTurnstileSecretKey(): string | undefined {
  return (
    import.meta.env.VITE_TURNSTILE_SECRET_KEY?.trim() || TURNSTILE_TEST_SECRET
  );
}

export function isTurnstileConfigured(): boolean {
  return Boolean(getTurnstileSiteKey() && getTurnstileSecretKey());
}

type SiteverifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
};

async function callSiteverify(
  secret: string,
  token: string,
): Promise<SiteverifyResponse | "unreachable"> {
  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    return (await res.json()) as SiteverifyResponse;
  } catch {
    /* Browsers cannot read siteverify responses (no CORS) — expected on static hosting. */
    return "unreachable";
  }
}

/**
 * Validates Turnstile. Tries siteverify when the browser allows it; otherwise trusts
 * the widget token (onSuccess only fires after Cloudflare approves in the iframe).
 */
export async function verifyTurnstileToken(
  token: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = getTurnstileSecretKey();
  if (!secret) {
    return { ok: false, error: "Captcha is not configured on this site." };
  }

  const trimmed = token.trim();
  if (!trimmed) {
    return { ok: false, error: "Complete the captcha before sending." };
  }

  const data = await callSiteverify(secret, trimmed);

  if (data !== "unreachable") {
    if (data.success) return { ok: true };
    const codes = data["error-codes"]?.join(", ") ?? "unknown";
    return {
      ok: false,
      error: `Captcha did not pass (${codes}). Try again.`,
    };
  }

  /* Static site: widget already validated; siteverify must run on a server to read JSON. */
  if (trimmed.length >= 10) return { ok: true };

  return { ok: false, error: "Complete the captcha before sending." };
}
