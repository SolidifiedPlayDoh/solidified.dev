import { useEffect, useState } from "react";

import { mulvyrPageCopy } from "../content/mulvyrContent";
import { usePageMeta } from "../hooks/usePageMeta";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { isFullscreen, requestPageFullscreen } from "../lib/requestFullscreen";

import "../styles/mulvyr.css";

const QR = `${import.meta.env.BASE_URL}mulvyr-qr.svg`;

export function MulvyrPage() {
  const reducedMotion = usePrefersReducedMotion();
  const [percent, setPercent] = useState(reducedMotion ? 100 : 0);

  usePageMeta({
    title: " ",
    description: mulvyrPageCopy.headline,
    path: "/mulvyr",
    themeColor: "#0078D7",
  });

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("mulvyr-route");
    body.classList.add("mulvyr-route");
    body.classList.remove("phase-site");

    return () => {
      html.classList.remove("mulvyr-route");
      body.classList.remove("mulvyr-route");
    };
  }, []);

  useEffect(() => {
    void requestPageFullscreen();

    const onGesture = () => {
      void requestPageFullscreen().then((ok) => {
        if (ok || isFullscreen()) {
          window.removeEventListener("pointerdown", onGesture);
          window.removeEventListener("keydown", onGesture);
          window.removeEventListener("touchstart", onGesture);
        }
      });
    };

    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    window.addEventListener("touchstart", onGesture, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("touchstart", onGesture);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const tick = window.setInterval(() => {
      setPercent((n) => {
        if (n >= 100) {
          window.clearInterval(tick);
          return 100;
        }
        return n + 1;
      });
    }, 220);
    return () => window.clearInterval(tick);
  }, [reducedMotion]);

  return (
    <main className="bsod" onContextMenu={(event) => event.preventDefault()}>
      <div className="bsod__inner">
        <p className="bsod__face" aria-hidden>
          {mulvyrPageCopy.face}
        </p>
        <h1 className="bsod__headline">{mulvyrPageCopy.headline}</h1>
        <p className="bsod__collect">{mulvyrPageCopy.collect}</p>
        <p className="bsod__pct" aria-live="polite">
          {percent}% complete
        </p>
        <div className="bsod__details">
          <div className="bsod__qr">
            <img src={QR} alt="" width={132} height={132} draggable={false} />
          </div>
          <div className="bsod__help">
            <p>{mulvyrPageCopy.moreInfo}</p>
            <p>{mulvyrPageCopy.support}</p>
            <p>
              Stop code: {mulvyrPageCopy.stopCode}
              <br />
              What failed: {mulvyrPageCopy.whatFailed}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
