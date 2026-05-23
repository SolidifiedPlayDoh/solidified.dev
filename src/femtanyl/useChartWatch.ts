import { useCallback, useEffect, useRef, useState } from "react";

import type { WatchFrame } from "./chartPlayback";
import {
  buildWatchFrame,
  createInstAudio,
  evalChartEvents,
  initLineNotes,
  loadChart,
  resetLineIndices,
} from "./chartPlayback";
import type { FemtanylChart } from "./chartTypes";

export type WatchStatus = "idle" | "loading" | "playing" | "ended" | "error";

export function useChartWatch() {
  const [status, setStatus] = useState<WatchStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const watchRef = useRef<WatchFrame | null>(null);
  const chartRef = useRef<FemtanylChart | null>(null);
  const linesRef = useRef<ReturnType<typeof initLineNotes> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef(0);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    watchRef.current = null;
    resetLineIndices(linesRef.current ?? []);
    setStatus("idle");
  }, []);

  const start = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const chart = chartRef.current ?? (await loadChart());
      chartRef.current = chart;
      const lines = initLineNotes(chart);
      linesRef.current = lines;
      resetLineIndices(lines);

      const audio = audioRef.current ?? createInstAudio();
      watchRef.current = null;
      audioRef.current = audio;
      audio.currentTime = 0;

      await new Promise<void>((resolve, reject) => {
        if (audio.readyState >= 2) resolve();
        else {
          audio.addEventListener("canplay", () => resolve(), { once: true });
          audio.addEventListener("error", () => reject(new Error("Instrumental failed to load")), {
            once: true,
          });
        }
      });

      await audio.play();
      setStatus("playing");

      const tick = () => {
        const t = audio.currentTime * 1000;
        const events = evalChartEvents(chart.events, t);
        watchRef.current = buildWatchFrame(chart, t, lines, events.cameraTarget, events.altByLine);

        if (audio.ended) {
          setStatus("ended");
          watchRef.current = null;
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      audio.onended = () => {
        cancelAnimationFrame(rafRef.current);
        watchRef.current = null;
        setStatus("ended");
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Watch mode failed";
      setError(msg);
      setStatus("error");
      stop();
    }
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return {
    status,
    error,
    watchRef,
    start,
    stop,
    isWatching: status === "playing",
  };
}
