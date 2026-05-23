import { useEffect, useRef } from "react";

import {
  ANIMATIONS,
  DEFAULT_COLORS,
  DIR_COLORS,
  FPS,
  framePath,
  KEY_MAP,
  type AnimName,
} from "./animations";
import { BackgroundRenderer } from "./background";
import {
  applyCanvasDisplaySize,
  configure2dSmoothing,
  internalBufferSize,
} from "./pixel";
import type { FemtanylSettings } from "./storage";

const W = 1280;
const H = 720;

type Options = {
  active: boolean;
  obsMode?: boolean;
  settings: FemtanylSettings;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (message: string | null) => void;
};

export function useFemtanylAnimator({
  active,
  obsMode = false,
  settings,
  onLoadingChange,
  onError,
}: Options) {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const charRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const stateRef = useRef({
    bg: null as BackgroundRenderer | null,
    images: new Map<string, HTMLImageElement>(),
    keys: new Set<string>(),
    altHeld: false,
    currentAnim: "idle" as AnimName,
    frameIndex: 0,
    frameTimer: 0,
    colorCurrent: [...DEFAULT_COLORS] as [number, number, number],
    last: performance.now(),
    raf: 0,
    recorder: null as MediaRecorder | null,
    recordChunks: [] as Blob[],
    recordCanvas: null as HTMLCanvasElement | null,
    recordCtx: null as CanvasRenderingContext2D | null,
    recording: false,
    pixelBg: false,
    pixelChar: false,
  });

  const ensureBgBuffer = (
    bgCanvas: HTMLCanvasElement,
    pixelBg: boolean,
    s: (typeof stateRef)["current"],
  ) => {
    const bw = internalBufferSize(W, pixelBg);
    const bh = internalBufferSize(H, pixelBg);
    if (bgCanvas.width === bw && bgCanvas.height === bh && s.bg) return;
    bgCanvas.width = bw;
    bgCanvas.height = bh;
    s.bg = new BackgroundRenderer(bgCanvas);
    s.bg.setMode(settingsRef.current.bgMode);
    s.pixelBg = pixelBg;
  };

  const ensureCharBuffer = (
    charCanvas: HTMLCanvasElement,
    charCtx: CanvasRenderingContext2D,
    pixelChar: boolean,
    s: (typeof stateRef)["current"],
  ) => {
    const cw = internalBufferSize(W, pixelChar);
    const ch = internalBufferSize(H, pixelChar);
    if (charCanvas.width === cw && charCanvas.height === ch) {
      configure2dSmoothing(charCtx, pixelChar);
      s.pixelChar = pixelChar;
      return;
    }
    charCanvas.width = cw;
    charCanvas.height = ch;
    configure2dSmoothing(charCtx, pixelChar);
    s.pixelChar = pixelChar;
  };

  useEffect(() => {
    if (!active) return;

    const bgCanvas = bgRef.current;
    const charCanvas = charRef.current;
    const stageEl = stageRef.current;
    if (!bgCanvas || !charCanvas || !stageEl) return;

    const charCtx = charCanvas.getContext("2d", { alpha: true })!;
    const s = stateRef.current;
    const cfg0 = settingsRef.current;
    ensureBgBuffer(bgCanvas, cfg0.pixelBg, s);
    ensureCharBuffer(charCanvas, charCtx, cfg0.pixelChar, s);

    let cancelled = false;
    onLoadingChange?.(true);
    onError?.(null);

    const paths = new Set<string>();
    for (const def of Object.values(ANIMATIONS)) {
      for (let i = 0; i < def.frames; i++) {
        paths.add(framePath(def.prefix, i));
      }
    }

    Promise.all(
      [...paths].map(
        (p) =>
          new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              s.images.set(p, img);
              resolve();
            };
            img.onerror = () => reject(new Error(`Failed to load ${p}`));
            img.src = p;
          }),
      ),
    )
      .then(() => {
        if (cancelled) return;
        onLoadingChange?.(false);
        fitStage();
      })
      .catch((err: Error) => {
        if (!cancelled) {
          onLoadingChange?.(false);
          onError?.(err.message);
        }
      });

    const fitStage = () => {
      const panelW = obsMode ? 0 : (panelRef.current?.getBoundingClientRect().width ?? 0);
      const gap = obsMode ? 0 : 16;
      const pad = obsMode ? 0 : 32;
      let maxW: number;
      let maxH: number;
      if (obsMode) {
        maxW = window.innerWidth;
        maxH = window.innerHeight;
      } else {
        maxW = Math.min(W, window.innerWidth - panelW - gap - pad);
        maxH = window.innerHeight - pad;
      }
      let displayW = maxW;
      let displayH = (displayW * H) / W;
      if (displayH > maxH) {
        displayH = maxH;
        displayW = (displayH * W) / H;
      }
      stageEl.style.width = `${displayW}px`;
      stageEl.style.height = `${displayH}px`;
      applyCanvasDisplaySize(bgCanvas, displayW, displayH);
      applyCanvasDisplaySize(charCanvas, displayW, displayH);
    };

    const onResize = () => fitStage();
    window.addEventListener("resize", onResize);
    const ro = obsMode
      ? null
      : panelRef.current
        ? new ResizeObserver(fitStage)
        : null;
    ro?.observe(panelRef.current!);

    const activeDirection = () => {
      for (const k of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]) {
        if (s.keys.has(k)) return k;
      }
      return null;
    };

    const pickAnim = (): AnimName => {
      const key = activeDirection();
      if (!key) return "idle";
      const map = KEY_MAP[key];
      return s.altHeld ? map.alt : map.base;
    };

    const lerpColor = (
      a: [number, number, number],
      b: [number, number, number],
      t: number,
    ): [number, number, number] => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];

    const targetColors = (): [number, number, number] => {
      const key = activeDirection();
      if (!key) return DEFAULT_COLORS;
      const base = KEY_MAP[key].base;
      return DIR_COLORS[base] ?? DEFAULT_COLORS;
    };

    const tick = (now: number) => {
      if (cancelled) return;
      const dt = Math.min((now - s.last) / 1000, 0.05);
      s.last = now;
      const cfg = settingsRef.current;
      ensureBgBuffer(bgCanvas, cfg.pixelBg, s);
      ensureCharBuffer(charCanvas, charCtx, cfg.pixelChar, s);

      s.bg?.setMode(cfg.bgMode);
      s.colorCurrent = lerpColor(s.colorCurrent, targetColors(), 0.12);
      s.bg?.setColors(...s.colorCurrent);
      s.bg?.update(dt);
      s.bg?.draw();

      const next = pickAnim();
      if (next !== s.currentAnim) {
        s.currentAnim = next;
        s.frameIndex = 0;
        s.frameTimer = 0;
      }

      const def = ANIMATIONS[s.currentAnim];
      s.frameTimer += dt;
      const frameDur = 1 / FPS;
      while (s.frameTimer >= frameDur) {
        s.frameTimer -= frameDur;
        s.frameIndex++;
        if (s.frameIndex >= def.frames) {
          s.frameIndex = def.loop ? 0 : def.frames - 1;
        }
      }

      const path = framePath(def.prefix, s.frameIndex);
      const img = s.images.get(path);
      if (img) {
        const bufW = charCanvas.width;
        const bufH = charCanvas.height;
        const toBuf = cfg.pixelChar ? bufW / W : 1;
        charCtx.clearRect(0, 0, bufW, bufH);
        configure2dSmoothing(charCtx, cfg.pixelChar);

        const scale = cfg.charScale;
        let sw = img.width * scale;
        let sh = img.height * scale;
        let ox = def.offset[0] * scale;
        let oy = def.offset[1] * scale;
        let x = W / 2 - sw / 2 + ox;
        let y = H - sh - 40 + oy;

        if (cfg.pixelChar) {
          x = Math.round(x * toBuf);
          y = Math.round(y * toBuf);
          sw = Math.round(sw * toBuf);
          sh = Math.round(sh * toBuf);
        }

        charCtx.drawImage(img, x, y, sw, sh);
      }

      if (s.recording && s.recordCtx && s.recordCanvas) {
        const rc = s.recordCtx;
        rc.imageSmoothingEnabled = false;
        rc.clearRect(0, 0, W, H);
        rc.drawImage(bgCanvas, 0, 0, W, H);
        rc.drawImage(charCanvas, 0, 0, W, H);
      }

      s.raf = requestAnimationFrame(tick);
    };

    s.raf = requestAnimationFrame(tick);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key in KEY_MAP) {
        e.preventDefault();
        s.keys.add(e.key);
      }
      if (e.key === "Shift") s.altHeld = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key in KEY_MAP) s.keys.delete(e.key);
      if (e.key === "Shift") s.altHeld = false;
    };
    const onBlur = () => {
      s.keys.clear();
      s.altHeld = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    return () => {
      cancelled = true;
      cancelAnimationFrame(s.raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      ro?.disconnect();
      if (s.recorder?.state === "recording") s.recorder.stop();
    };
  }, [active, obsMode, onLoadingChange, onError]);

  const toggleRecord = () => {
    const bgCanvas = bgRef.current;
    const charCanvas = charRef.current;
    const s = stateRef.current;
    if (s.recorder?.state === "recording") {
      s.recorder.stop();
      s.recording = false;
      return false;
    }

    if (!bgCanvas || !charCanvas) return false;

    if (!s.recordCanvas) {
      s.recordCanvas = document.createElement("canvas");
      s.recordCanvas.width = W;
      s.recordCanvas.height = H;
      s.recordCtx = s.recordCanvas.getContext("2d")!;
    }

    const stream = s.recordCanvas.captureStream(60);
    s.recordChunks = [];
    const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
      ? "video/webm;codecs=vp9"
      : "video/webm";
    s.recorder = new MediaRecorder(stream, {
      mimeType: mime,
      videoBitsPerSecond: 8_000_000,
    });
    s.recorder.ondataavailable = (e) => {
      if (e.data.size) s.recordChunks.push(e.data);
    };
    s.recorder.onstop = () => {
      s.recording = false;
      const blob = new Blob(s.recordChunks, { type: s.recorder!.mimeType });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `femtanyl-anim-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(a.href);
    };

    s.recording = true;
    s.recorder.start(100);
    return true;
  };

  return {
    bgRef,
    charRef,
    stageRef,
    panelRef,
    toggleRecord,
    isRecording: () => stateRef.current.recording,
  };
}
