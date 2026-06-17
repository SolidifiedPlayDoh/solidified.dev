import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

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
  const prefersReducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setActive(true);
      return;
    }
    const id = window.setTimeout(() => setActive(true), delay);
    return () => window.clearTimeout(id);
  }, [delay, prefersReducedMotion]);

  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;

  return (
    <div
      className={[
        "glitch-reveal",
        `glitch-reveal--${variant}`,
        active ? "glitch-reveal--active" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <span className="glitch-reveal__wire" aria-hidden />
      <span className="glitch-reveal__scan" aria-hidden />
      <div className="glitch-reveal__content">{children}</div>
    </div>
  );
}
