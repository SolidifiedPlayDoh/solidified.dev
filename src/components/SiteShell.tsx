import { useEffect, type ReactNode } from "react";

import { PsychoBootProvider, usePsychoBoot } from "../context/PsychoBootContext";
import { usePointerField } from "../hooks/usePointerField";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

import { GlitchAmbience } from "./GlitchAmbience";
import { IntelLayer } from "./IntelLayer";
import { PsychoField } from "./PsychoField";

type SiteShellProps = {
  children: ReactNode;
};

function SiteShellInner({ children }: SiteShellProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { booting, bootComplete } = usePsychoBoot();
  usePointerField(bootComplete && !booting);

  return (
    <>
      <a className="skip-to-main" href="#main">
        Skip to content
      </a>
      <PsychoField reducedMotion={reducedMotion} />
      <GlitchAmbience reducedMotion={reducedMotion} />
      <IntelLayer />
      {children}
    </>
  );
}

export function SiteShell({ children }: SiteShellProps) {
  useEffect(() => {
    document.body.classList.add("phase-site");
    return () => document.body.classList.remove("phase-site");
  }, []);

  return (
    <PsychoBootProvider>
      <SiteShellInner>{children}</SiteShellInner>
    </PsychoBootProvider>
  );
}
