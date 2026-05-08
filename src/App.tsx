import { useEffect, useLayoutEffect, useRef, useState } from "react";

import gsap from "gsap";

import { CrtOverlay } from "./components/CrtOverlay";
import { HomePage } from "./components/HomePage";
import { IntroGate } from "./components/IntroGate";
import { IntroTimeline } from "./components/IntroTimeline";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";

type Phase = "gate" | "intro" | "site";

export function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("gate");
  const mainRef = useRef<HTMLElement>(null);

  const animateScanlines = phase !== "site" && !prefersReducedMotion;

  useEffect(() => {
    document.body.style.overflow = phase !== "site" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useLayoutEffect(() => {
    const m = mainRef.current;
    if (!m) return;
    if (phase === "site") {
      gsap.fromTo(
        m,
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: prefersReducedMotion ? 0.2 : 0.85,
          ease: "power2.out",
          clearProps: "transform",
          overwrite: "auto",
        },
      );
    } else {
      gsap.set(m, { autoAlpha: 0, clearProps: "transform" });
    }
  }, [phase, prefersReducedMotion]);

  useEffect(() => {
    if (phase === "site") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
  }, [phase]);

  const skipIntro = () => {
    setPhase("site");
  };

  const beginIntro = () => {
    setPhase("intro");
  };

  return (
    <>
      <a className="skip-to-main" href="#main">
        Skip to content
      </a>

      <CrtOverlay animateScanlines={animateScanlines} />

      {phase !== "site" && (
        <div className="intro-screen" role="presentation">
          {phase === "gate" ? (
            <>
              <IntroGate onPress={beginIntro} />
              <button type="button" className="skip-link" onClick={skipIntro}>
                Skip intro
              </button>
            </>
          ) : (
            <>
              <IntroTimeline
                active={phase === "intro"}
                reducedMotion={prefersReducedMotion}
                onComplete={() => {
                  setPhase("site");
                }}
              />
              <button type="button" className="skip-link" onClick={skipIntro}>
                Skip intro
              </button>
            </>
          )}
        </div>
      )}

      <main ref={mainRef} id="main" aria-hidden={phase !== "site"}>
        <HomePage />
      </main>
    </>
  );
}
