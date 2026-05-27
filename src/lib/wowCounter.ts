const COUNTER_URL = "https://api.counterapi.dev/v1/solidifiedplaydoh/wow-fallen/up";

export async function registerWowFall(): Promise<number | null> {
  try {
    const res = await fetch(COUNTER_URL, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { count?: number };
    return typeof data.count === "number" ? data.count : null;
  } catch {
    return null;
  }
}

export function formatFallenLine(count: number | null): string {
  if (count == null) {
    return "you are the … person to fall for it :broken_heart:";
  }
  return `you are the ${count} person to fall for it :broken_heart:`;
}
