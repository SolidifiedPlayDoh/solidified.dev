import { useEffect, useRef, useState } from "react";

import { isWarmBootVisit, markWarmBootVisit } from "./storage";

const BOOT_MESSAGES = [
  "Compiling shaders for background…",
  "Linking GLSL fragment stages…",
  "Warming up WebGL render context…",
  "Unpacking sprite atlas…",
  "Syncing animation frame timings…",
] as const;

const WARM_MESSAGE = "Shaders Precompiled";

const COLD_MIN_BOOT_MS = 1_850;
const COLD_FINISH_MS = 300;
const MESSAGE_MS = 520;

const WARM_MIN_BOOT_MS = 500;
const WARM_FINISH_MS = 120;

type BootPhase = "idle" | "booting" | "done";

export function useFemtanylBootOverlay(active: boolean, assetsLoading: boolean) {
  const [phase, setPhase] = useState<BootPhase>("idle");
  const [fastBoot, setFastBoot] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const bootStart = useRef(0);
  const finishTimer = useRef(0);
  const fastBootRef = useRef(false);

  useEffect(() => {
    if (!active) {
      setPhase("idle");
      setProgress(0);
      setMsgIndex(0);
      setFastBoot(false);
      return;
    }
    const warm = isWarmBootVisit();
    fastBootRef.current = warm;
    setFastBoot(warm);
    setPhase("booting");
    bootStart.current = performance.now();
  }, [active]);

  useEffect(() => {
    if (phase !== "booting") return;

    const minBoot = fastBootRef.current ? WARM_MIN_BOOT_MS : COLD_MIN_BOOT_MS;
    const finishMs = fastBootRef.current ? WARM_FINISH_MS : COLD_FINISH_MS;
    const loadCap = fastBootRef.current ? 0.92 : 0.78;

    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - bootStart.current;
      const timeRatio = Math.min(1, elapsed / minBoot);
      const loadFactor = assetsLoading ? loadCap : 1;
      setProgress(Math.min(0.98, timeRatio * 0.98 * loadFactor));

      if (elapsed >= minBoot && !assetsLoading) {
        setProgress(1);
        finishTimer.current = window.setTimeout(() => {
          markWarmBootVisit();
          setPhase("done");
        }, finishMs);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(finishTimer.current);
    };
  }, [phase, assetsLoading]);

  useEffect(() => {
    if (phase !== "booting" || fastBoot) return;
    const id = window.setInterval(() => {
      setMsgIndex((i) => (i + 1) % BOOT_MESSAGES.length);
    }, MESSAGE_MS);
    return () => window.clearInterval(id);
  }, [phase, fastBoot]);

  const message = fastBoot ? WARM_MESSAGE : BOOT_MESSAGES[msgIndex];

  return {
    visible: phase === "booting",
    message,
    progress,
  };
}
