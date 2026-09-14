import { type ReactNode } from "react";

import { useSiteSkin } from "../context/SiteSkinContext";

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
  variant = "block",
}: GlitchRevealProps) {
  const { skin } = useSiteSkin();

  if (skin !== "psycho") {
    return <>{children}</>;
  }

  const classes = [
    "glitch-reveal",
    `glitch-reveal--${variant}`,
    "glitch-reveal--active",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="glitch-reveal__content">{children}</div>
    </div>
  );
}
