import "./styles/global.css";
import "./styles/scene.css";
import "./styles/glitch.css";
import "./styles/psycho.css";
import "./styles/psycho-boot.css";
import "./styles/psycho-intel.css";
import "./styles/modern.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";
import { applySiteSkin, readSiteSkin } from "./lib/siteSkin";

applySiteSkin(readSiteSkin());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
