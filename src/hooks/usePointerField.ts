import { useEffect } from "react";

import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Writes --ptr-x / --ptr-y on :root (−0.5…0.5) for ambience parallax.
 * Idle while booting or when reduced-motion is on.
 */
export function usePointerField(enabled: boolean) {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!enabled || reducedMotion) {
      document.documentElement.style.setProperty("--ptr-x", "0");
      document.documentElement.style.setProperty("--ptr-y", "0");
      return;
    }

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      document.documentElement.style.setProperty("--ptr-x", currentX.toFixed(4));
      document.documentElement.style.setProperty("--ptr-y", currentY.toFixed(4));
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      document.documentElement.style.setProperty("--ptr-x", "0");
      document.documentElement.style.setProperty("--ptr-y", "0");
    };
  }, [enabled, reducedMotion]);
}
