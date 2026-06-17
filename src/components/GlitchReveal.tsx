import type { ReactNode } from "react";

export type GlitchRevealVariant = "block" | "hero" | "line" | "card" | "pill";

type GlitchRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: GlitchRevealVariant;
};

/** Lightweight wrapper — keeps page structure, no reveal animation. */
export function GlitchReveal({ children, className }: GlitchRevealProps) {
  return <div className={className}>{children}</div>;
}
