import "./styles/global.css";
import "./styles/scene.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { getStandaloneRoute } from "./lib/standalonePath";
import { WowPage } from "./pages/WowPage";

const root = document.getElementById("root")!;
const standalone = getStandaloneRoute();

if (standalone === "wow") {
  document.documentElement.classList.add("wow-route");
  document.body.classList.add("wow-route");
  createRoot(root).render(<WowPage />);
} else {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
