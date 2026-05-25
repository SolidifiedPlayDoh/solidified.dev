import "./styles/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { isNightPath } from "./lib/nightPath";
import { NightRemovedPage } from "./pages/NightRemovedPage";

/** Mirrors `dynamic-range: high` glow in CSS — not OS HDR, just our bloom preset. */
if (import.meta.env.DEV || import.meta.env.VITE_HDR_PREVIEW === "1") {
  document.documentElement.setAttribute("data-hdr-preview", "");
}

const root = document.getElementById("root")!;

if (isNightPath()) {
  document.documentElement.classList.add("night-removed-route");
  createRoot(root).render(<NightRemovedPage />);
} else {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
