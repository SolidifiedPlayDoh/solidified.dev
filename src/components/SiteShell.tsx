import { useEffect, type ReactNode } from "react";

import { PsychoBootProvider, usePsychoBoot } from "../context/PsychoBootContext";
import { useSiteSkin } from "../context/SiteSkinContext";
import { usePointerField } from "../hooks/usePointerField";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

import { Breadcrumbs } from "./Breadcrumbs";
import { GlitchAmbience } from "./GlitchAmbience";
import { IntelLayer } from "./IntelLayer";
import { PsychoField } from "./PsychoField";
import { isPsychoSkin } from "../lib/siteSkin";

type SiteShellProps = {
  children: ReactNode;
};

function SiteShellInner({ children }: SiteShellProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { skin } = useSiteSkin();
  const psycho = isPsychoSkin(skin);
  const { booting, bootComplete } = usePsychoBoot();
  usePointerField(psycho && bootComplete && !booting);

  return (
    <>
      <a className="skip-to-main" href="#main">
        Skip to content
      </a>
      {psycho && (
        <>
          <PsychoField reducedMotion={reducedMotion} />
          <GlitchAmbience reducedMotion={reducedMotion} />
          <IntelLayer />
        </>
      )}
      <Breadcrumbs />
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
