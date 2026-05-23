import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** GitHub Pages at `/<repo>/`: set `VITE_BASE_PATH=my-repo`. Custom apex domain: `/` */
function viteBase(raw: string | undefined): "/" | `/${string}/` {
  if (!raw || raw === "/" || raw === "") return "/";
  const trimmed = raw.trim();
  let out = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  out = out.endsWith("/") ? out : `${out}/`;
  if (out === "//") return "/";
  return out as `/${string}/`;
}

export default defineConfig({
  plugins: [react()],
  base: viteBase(process.env.VITE_BASE_PATH),
  server: {
    host: true,
  },
  preview: {
    host: true,
  },
});
