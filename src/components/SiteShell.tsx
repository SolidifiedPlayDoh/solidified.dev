import { useEffect, type ReactNode } from "react";

import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

import { CrtOverlay } from "./CrtOverlay";
import { GlitchAmbience } from "./GlitchAmbience";
import { WireframeField } from "./WireframeField";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    document.body.classList.add("phase-site");
    return () => document.body.classList.remove("phase-site");
  }, []);

  return (
    <>
      <a className="skip-to-main" href="#main">
        Skip to content
      </a>
      <WireframeField />
      <CrtOverlay animateScanlines={!prefersReducedMotion} />
      <GlitchAmbience reducedMotion={prefersReducedMotion} />
      {children}
    </>
  );
}
