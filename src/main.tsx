import "./styles/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { isNightPath, runNightGate } from "./lib/nightPing";

/** Mirrors `dynamic-range: high` glow in CSS — not OS HDR, just our bloom preset. */
if (import.meta.env.DEV || import.meta.env.VITE_HDR_PREVIEW === "1") {
  document.documentElement.setAttribute("data-hdr-preview", "");
}

const root = document.getElementById("root")!;

if (isNightPath()) {
  document.documentElement.classList.add("night-route");
  runNightGate();
} else {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
