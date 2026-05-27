import "./styles/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { getStandaloneRoute } from "./lib/standalonePath";
import { NightRemovedPage } from "./pages/NightRemovedPage";
import { WowPage } from "./pages/WowPage";

/** Mirrors `dynamic-range: high` glow in CSS — not OS HDR, just our bloom preset. */
if (import.meta.env.DEV || import.meta.env.VITE_HDR_PREVIEW === "1") {
  document.documentElement.setAttribute("data-hdr-preview", "");
}

const root = document.getElementById("root")!;
const standalone = getStandaloneRoute();

if (standalone === "night") {
  document.documentElement.classList.add("night-removed-route");
  createRoot(root).render(<NightRemovedPage />);
} else if (standalone === "wow") {
  document.documentElement.classList.add("wow-route");
  createRoot(root).render(<WowPage />);
} else {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
