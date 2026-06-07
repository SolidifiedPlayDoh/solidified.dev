const API = "https://api.counterapi.dev/v1/solidifiedplaydoh";
/** CounterAPI 301s without a trailing slash; browsers block that redirect (CORS). */
const FALLEN_URL = `${API}/wow-fallen/up`;
const SECRET_URL = `${API}/wow-secret-press/`;
const SECRET_UP_URL = `${API}/wow-secret-press/up`;

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

export async function fetchSecretPressCount(): Promise<number | null> {
  try {
    const res = await fetch(SECRET_URL, { signal: AbortSignal.timeout(8000) });
    return readCount(res);
  } catch {
    return null;
  }
}

export async function incrementSecretPress(): Promise<number | null> {
  try {
    const res = await fetch(SECRET_UP_URL, { signal: AbortSignal.timeout(8000) });
    return readCount(res);
  } catch {
    return null;
  }
}
