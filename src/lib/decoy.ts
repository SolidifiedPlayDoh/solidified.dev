export type DecoyConfig = {
  name: string;
  message: string;
  bg: string;
  fg: string;
  iconBase64: string;
  mime: string;
};

function stripHash(color: string): string {
  return color.replace(/^#/, "");
}

export function encodeDecoyHash(config: DecoyConfig): string {
  const p = new URLSearchParams();
  p.set("v", "1");
  p.set("n", config.name.trim() || "Decoy");
  p.set("m", config.message.trim() || "This app does nothing. That is the joke.");
  p.set("bg", stripHash(config.bg));
  p.set("fg", stripHash(config.fg));
  p.set("t", config.mime || "image/jpeg");
  if (config.iconBase64) p.set("i", config.iconBase64);
  return p.toString();
}

export function decoyPagePath(baseUrl = import.meta.env.BASE_URL): string {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${base}decoy.html`;
}

export function buildDecoyUrl(
  config: DecoyConfig,
  origin = window.location.origin,
  baseUrl = import.meta.env.BASE_URL,
): string {
  return `${origin}${decoyPagePath(baseUrl)}#${encodeDecoyHash(config)}`;
}

export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "decoy"
  );
}
