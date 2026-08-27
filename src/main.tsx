import "./styles/global.css";
import "./styles/scene.css";
import "./styles/glitch.css";
import "./styles/psycho.css";
import "./styles/psycho-boot.css";
import "./styles/psycho-intel.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { getStandaloneRoute } from "./lib/standalonePath";
import { MulvyrPage } from "./pages/MulvyrPage";
import { WowPage } from "./pages/WowPage";

const root = document.getElementById("root")!;
const standalone = getStandaloneRoute();

if (standalone === "wow") {
  document.documentElement.classList.add("wow-route");
  document.body.classList.add("wow-route");
  createRoot(root).render(<WowPage />);
} else if (standalone === "mulvyr") {
  document.documentElement.classList.add("mulvyr-route");
  document.body.classList.add("mulvyr-route");
  createRoot(root).render(<MulvyrPage />);
} else {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
