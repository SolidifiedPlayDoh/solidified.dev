export function isNightPath(): boolean {
  const p = window.location.pathname.replace(/\/$/, "") || "/";
  return p === "/night" || p.endsWith("/night");
}
