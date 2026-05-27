export type StandaloneRoute = "night" | "wow";

export function getStandaloneRoute(): StandaloneRoute | null {
  const p = window.location.pathname.replace(/\/$/, "") || "/";
  if (p === "/night" || p.endsWith("/night")) return "night";
  if (p === "/wow" || p.endsWith("/wow")) return "wow";
  return null;
}

/** @deprecated use getStandaloneRoute() */
export function isNightPath(): boolean {
  return getStandaloneRoute() === "night";
}
