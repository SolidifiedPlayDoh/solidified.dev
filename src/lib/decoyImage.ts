const PLACEHOLDER_BG = "#9b9cff";
const PLACEHOLDER_FG = "#050508";

export async function fileToIconDataUrl(
  file: File,
  size = 180,
  quality = 0.82,
): Promise<{ dataUrl: string; base64: string; mime: string }> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");

  ctx.fillStyle = "#0c0c14";
  ctx.fillRect(0, 0, size, size);

  const scale = Math.max(size / bitmap.width, size / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h);
  bitmap.close();

  const mime = "image/jpeg";
  const dataUrl = canvas.toDataURL(mime, quality);
  const base64 = dataUrl.split(",")[1] ?? "";
  return { dataUrl, base64, mime };
}

export function makePlaceholderIcon(
  label: string,
  bg = PLACEHOLDER_BG,
  fg = PLACEHOLDER_FG,
): string {
  const canvas = document.createElement("canvas");
  canvas.width = 180;
  canvas.height = 180;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 180, 180);

  ctx.fillStyle = fg;
  ctx.font = "800 72px Syne, Arial Narrow, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const initial = (label.trim().charAt(0) || "D").toUpperCase();
  ctx.fillText(initial, 90, 96);

  return canvas.toDataURL("image/jpeg", 0.9);
}
