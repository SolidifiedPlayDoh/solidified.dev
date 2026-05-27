const FALLEN_URL = "https://api.counterapi.dev/v1/solidifiedplaydoh/wow-fallen/up";
const SECRET_BASE = "https://api.counterapi.dev/v1/solidifiedplaydoh/wow-secret-press";

async function readCount(res: Response): Promise<number | null> {
  if (!res.ok) return null;
  const data = (await res.json()) as { count?: number };
  return typeof data.count === "number" ? data.count : null;
}

export async function registerWowFall(): Promise<number | null> {
  try {
    const res = await fetch(FALLEN_URL, { signal: AbortSignal.timeout(8000) });
    return readCount(res);
  } catch {
    return null;
  }
}

export function formatFallenLine(count: number | null): string {
  if (count == null) {
    return "you are the … person to fall for it 💔";
  }
  return `you are the ${count} person to fall for it 💔`;
}

export async function fetchSecretPressCount(): Promise<number> {
  try {
    const res = await fetch(SECRET_BASE, { signal: AbortSignal.timeout(8000) });
    const n = await readCount(res);
    return n ?? 0;
  } catch {
    return 0;
  }
}

export async function incrementSecretPress(): Promise<number | null> {
  try {
    const res = await fetch(`${SECRET_BASE}/up`, { signal: AbortSignal.timeout(8000) });
    return readCount(res);
  } catch {
    return null;
  }
}
