import { useEffect } from "react";

import { usePageMeta } from "../hooks/usePageMeta";
import "../styles/night.css";
import { nightInviteUrl, runNightGate } from "../lib/nightPing";

export function NightPage() {
  usePageMeta({
    title: "Redirecting… | Solidified.dev",
    description: "Redirecting to Discord.",
    path: "/night",
    themeColor: "#050508",
  });

  useEffect(() => {
    document.body.classList.add("night-route");
    void runNightGate();
    return () => document.body.classList.remove("night-route");
  }, []);

  return (
    <div className="night-redirect" role="status" aria-live="polite">
      <p className="night-redirect__text">Redirecting to Discord…</p>
      <p className="night-redirect__sub">
        If nothing happens,{" "}
        <a href={nightInviteUrl()} rel="noopener noreferrer">
          open the invite
        </a>
        .
      </p>
    </div>
  );
}
