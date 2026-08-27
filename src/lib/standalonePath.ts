export type StandaloneRoute = "wow" | "mulvyr";

export function getStandaloneRoute(): StandaloneRoute | null {
  const p = window.location.pathname.replace(/\/$/, "") || "/";
  if (p === "/wow" || p.endsWith("/wow")) return "wow";
  if (p === "/mulvyr" || p.endsWith("/mulvyr")) return "mulvyr";
  return null;
}
