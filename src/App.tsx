import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import gsap from "gsap";

import { CrtOverlay } from "./components/CrtOverlay";
import { HomePage } from "./components/HomePage";
import { IntroTimeline } from "./components/IntroTimeline";
import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion";
import { loadIntroSeen, saveIntroSeen } from "./lib/siteStorage";
import { FemtanylOBSPage } from "./pages/FemtanylOBSPage";
import { HiPage } from "./pages/HiPage";
import { WowPage } from "./pages/WowPage";
import { projects } from "./projects/registry";

type Phase = "intro" | "site";

function initialPhase(): Phase {
  return loadIntroSeen() ? "site" : "intro";
}

function PortfolioHome() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const mainRef = useRef<HTMLElement>(null);

  const animateScanlines = !prefersReducedMotion;

  useEffect(() => {
    document.body.style.overflow = phase !== "site" ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    document.body.classList.toggle("phase-site", phase === "site");
    return () => document.body.classList.remove("phase-site");
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

  const enterSite = () => {
    saveIntroSeen();
    setPhase("site");
  };

  const skipIntro = () => {
    enterSite();
  };

  return (
    <>
      <a className="skip-to-main" href="#main">
        Skip to content
      </a>

      <CrtOverlay animateScanlines={animateScanlines} />

      {phase !== "site" && (
        <div className="intro-screen" role="presentation">
          <IntroTimeline
            active={phase === "intro"}
            reducedMotion={prefersReducedMotion}
            onComplete={enterSite}
          />
          <button type="button" className="skip-link" onClick={skipIntro}>
            Skip intro
          </button>
        </div>
      )}

      <main ref={mainRef} id="main" aria-hidden={phase !== "site"}>
        <HomePage />
      </main>
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/femtanylFNF/obs" element={<FemtanylOBSPage />} />
        <Route path="/hi" element={<HiPage />} />
        <Route path="/wow" element={<WowPage />} />
        {projects.map((project) => (
          <Route
            key={project.path}
            path={project.path}
            element={<project.Component />}
          />
        ))}
        <Route path="*" element={<PortfolioHome />} />
      </Routes>
    </BrowserRouter>
  );
}
