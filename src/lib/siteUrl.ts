/** Canonical site origin for Open Graph absolute URLs. */
export const SITE_ORIGIN =
  import.meta.env.VITE_SITE_ORIGIN?.replace(/\/$/, "") ||
  "https://solidified.dev";

export function absoluteUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${p}`;
}
