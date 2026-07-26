import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import { usePsychoBoot } from "../context/PsychoBootContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export type GlitchRevealVariant = "block" | "hero" | "line" | "card" | "pill";

type GlitchRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: GlitchRevealVariant;
};

export function GlitchReveal({
  children,
  className,
  delay = 0,
  variant = "block",
}: GlitchRevealProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { bootComplete } = usePsychoBoot();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!bootComplete) {
      setActive(false);
      return;
    }

    if (reducedMotion) {
      setActive(true);
      return;
    }

    const boot = window.setTimeout(() => setActive(true), Math.max(0, delay));
    return () => window.clearTimeout(boot);
  }, [bootComplete, delay, reducedMotion]);

  const classes = [
    "glitch-reveal",
    `glitch-reveal--${variant}`,
    active ? "glitch-reveal--active" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const style = {
    "--reveal-delay": `${Math.min(delay, 80)}ms`,
  } as CSSProperties;

  return (
    <div className={classes} style={style}>
      {!reducedMotion && bootComplete && (
        <>
          <span className="glitch-reveal__wire" aria-hidden />
          <span className="glitch-reveal__scan" aria-hidden />
        </>
      )}
      <div className="glitch-reveal__content">{children}</div>
    </div>
  );
}
