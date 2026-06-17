import { useEffect, type ReactNode } from "react";

import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useSiteLite } from "../hooks/useSiteLite";

import { CrtOverlay } from "./CrtOverlay";
import { GlitchAmbience } from "./GlitchAmbience";
import { WireframeField } from "./WireframeField";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const lite = useSiteLite();
  const heavyFx = !lite && !prefersReducedMotion;

  useEffect(() => {
    document.body.classList.add("phase-site");
    return () => document.body.classList.remove("phase-site");
  }, []);

  return (
    <>
      <a className="skip-to-main" href="#main">
        Skip to content
      </a>
      {heavyFx ? <WireframeField /> : null}
      {heavyFx ? (
        <CrtOverlay animateScanlines />
      ) : lite ? null : (
        <CrtOverlay animateScanlines={false} />
      )}
      {heavyFx ? <GlitchAmbience reducedMotion={false} /> : null}
      {children}
    </>
  );
}
