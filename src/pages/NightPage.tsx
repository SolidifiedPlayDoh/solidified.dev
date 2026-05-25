import { useEffect } from "react";

import { runNightGate } from "../lib/nightPing";
import "../styles/night.css";

/** SPA in-app navigation to /night — direct loads skip React in main.tsx. */
export function NightPage() {
  useEffect(() => {
    document.documentElement.classList.add("night-route");
    runNightGate();
    return () => document.documentElement.classList.remove("night-route");
  }, []);

  return null;
}
