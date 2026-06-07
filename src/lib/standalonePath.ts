export type StandaloneRoute = "wow";

export function getStandaloneRoute(): StandaloneRoute | null {
  const p = window.location.pathname.replace(/\/$/, "") || "/";
  if (p === "/wow" || p.endsWith("/wow")) return "wow";
  return null;
}
