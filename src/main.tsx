import "./styles/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

/** Mirrors `dynamic-range: high` glow in CSS — not OS HDR, just our bloom preset. */
if (import.meta.env.DEV || import.meta.env.VITE_HDR_PREVIEW === "1") {
  document.documentElement.setAttribute("data-hdr-preview", "");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
