import { useEffect, useRef, type RefObject } from "react";

import {
  ANIMATIONS,
  CHAR_NORM_HEIGHT,
  DEFAULT_COLORS,
  DIR_COLORS,
  FPS,
  framePath,
  KEY_MAP,
  type AnimName,
} from "./animations";
import { BackgroundRenderer } from "./background";
import type { WatchFrame } from "./chartPlayback";
import { PostProcessRenderer } from "./postProcess";
import {
  PICO_ANIMATIONS,
  picoFramePath,
  type PicoAnimName,
} from "./picoAnimations";
import {
  applyCanvasDisplaySize,
  configure2dSmoothing,
  internalBufferSize,
} from "./pixel";
import type { FemtanylSettings } from "./storage";

const W = 1280;
const H = 720;

type SlotKey = "dad" | "char2";

type SlotAnim = {
  anim: AnimName;
  frameIndex: number;
  frameTimer: number;
};

type PicoSlotAnim = {
  anim: PicoAnimName;
  frameIndex: number;
  frameTimer: number;
};

type SmoothCam = {
  pan: number;
  zoom: number;
  angle: number;
  shakeX: number;
  shakeY: number;
};

/** Map FNF defaultCamZoom directly (0.8–1.4) to canvas scale. */
function gameZoomToCanvas(z: number) {
  return 0.88 + z * 0.36;
}

function drawTalkBubble(ctx: CanvasRenderingContext2D, text: string, dadX: number) {
  const x = dadX + 180;
  const y = H * 0.38;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((8 * Math.PI) / 180);
  ctx.font = '55px Slender, Georgia, serif';
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#fff";
  ctx.strokeText(text, 0, 0);
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

type Options = {
  active: boolean;
  obsMode?: boolean;
  settings: FemtanylSettings;
  watchRef?: RefObject<WatchFrame | null>;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (message: string | null) => void;
};

function drawCharacter(
  ctx: CanvasRenderingContext2D,
  images: Map<string, HTMLImageElement>,
  anim: AnimName,
  frameIndex: number,
  anchorX: number,
  charScale: number,
  pixelChar: boolean,
  bufW: number,
  alpha: number,
  flipX: boolean,
) {
  const def = ANIMATIONS[anim];
  const path = framePath(def.prefix, frameIndex);
  const img = images.get(path);
  if (!img) return;

  const toBuf = pixelChar ? bufW / W : 1;
  const boxScale = (CHAR_NORM_HEIGHT / def.frameH) * charScale;
  const boxW = def.frameW * boxScale;
  const boxH = def.frameH * boxScale;
  const fit = Math.min(boxW / img.width, boxH / img.height);
  let sw = img.width * fit;
  let sh = img.height * fit;
  let ox = def.offset[0] * charScale;
  let oy = def.offset[1] * charScale;
  let x = anchorX - boxW / 2 + (boxW - sw) / 2 + ox;
  let y = H - boxH - 40 + (boxH - sh) + oy;

  if (pixelChar) {
    x = Math.round(x * toBuf);
    y = Math.round(y * toBuf);
    sw = Math.round(sw * toBuf);
    sh = Math.round(sh * toBuf);
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  if (flipX) {
    ctx.translate(x + sw, y);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0, sw, sh);
  } else {
    ctx.drawImage(img, x, y, sw, sh);
  }
  ctx.restore();
}

function drawPico(
  ctx: CanvasRenderingContext2D,
  images: Map<string, HTMLImageElement>,
  anim: PicoAnimName,
  frameIndex: number,
  anchorX: number,
  charScale: number,
  pixelChar: boolean,
  bufW: number,
  alpha: number,
) {
  const def = PICO_ANIMATIONS[anim];
  const path = picoFramePath(def.prefix, frameIndex);
  const img = images.get(path);
  if (!img) return;

  const toBuf = pixelChar ? bufW / W : 1;
  const scale = charScale;
  let sw = img.width * scale;
  let sh = img.height * scale;
  let ox = def.offset[0] * scale;
  let oy = def.offset[1] * scale;
  let x = anchorX - sw / 2 + ox;
  let y = H - sh - 40 + oy;

  if (pixelChar) {
    x = Math.round(x * toBuf);
    y = Math.round(y * toBuf);
    sw = Math.round(sw * toBuf);
    sh = Math.round(sh * toBuf);
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, x, y, sw, sh);
  ctx.restore();
}

export function useFemtanylAnimator({
  active,
  obsMode = false,
  settings,
  watchRef,
  onLoadingChange,
  onError,
}: Options) {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const charRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraWrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const talkRef = useRef<HTMLDivElement>(null);
  const postRef = useRef<HTMLCanvasElement>(null);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const stateRef = useRef({
    bg: null as BackgroundRenderer | null,
    post: null as PostProcessRenderer | null,
    images: new Map<string, HTMLImageElement>(),
    keys: new Set<string>(),
    altHeld: false,
    currentAnim: "idle" as AnimName,
    frameIndex: 0,
    frameTimer: 0,
    slots: {
      dad: { anim: "idle" as AnimName, frameIndex: 0, frameTimer: 0 },
      char2: { anim: "idle" as AnimName, frameIndex: 0, frameTimer: 0 },
    } as Record<SlotKey, SlotAnim>,
    pico: { anim: "idle" as PicoAnimName, frameIndex: 0, frameTimer: 0 } as PicoSlotAnim,
    picoImages: new Map<string, HTMLImageElement>(),
    smoothCam: { pan: 0, zoom: 1, angle: 0, shakeX: 0, shakeY: 0 } as SmoothCam,
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

  const advanceSlot = (slot: SlotAnim, dt: number) => {
    const def = ANIMATIONS[slot.anim];
    slot.frameTimer += dt;
    const frameDur = 1 / FPS;
    while (slot.frameTimer >= frameDur) {
      slot.frameTimer -= frameDur;
      slot.frameIndex++;
      if (slot.frameIndex >= def.frames) {
        slot.frameIndex = def.loop ? 0 : def.frames - 1;
      }
    }
  };

  const setSlotAnim = (slot: SlotAnim, anim: AnimName) => {
    if (slot.anim !== anim) {
      slot.anim = anim;
      slot.frameIndex = 0;
      slot.frameTimer = 0;
    }
  };

  const setPicoAnim = (slot: PicoSlotAnim, anim: PicoAnimName) => {
    if (slot.anim !== anim) {
      slot.anim = anim;
      slot.frameIndex = 0;
      slot.frameTimer = 0;
    }
  };

  const advancePicoSlot = (slot: PicoSlotAnim, dt: number) => {
    const def = PICO_ANIMATIONS[slot.anim];
    slot.frameTimer += dt;
    const frameDur = 1 / 24;
    while (slot.frameTimer >= frameDur) {
      slot.frameTimer -= frameDur;
      slot.frameIndex++;
      if (slot.frameIndex >= def.frames) {
        slot.frameIndex = def.loop ? 0 : def.frames - 1;
      }
    }
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
    let wasWatching = false;
    onLoadingChange?.(true);
    onError?.(null);

    const paths = new Set<string>();
    for (const def of Object.values(ANIMATIONS)) {
      for (let i = 0; i < def.frames; i++) {
        paths.add(framePath(def.prefix, i));
      }
    }
    for (const def of Object.values(PICO_ANIMATIONS)) {
      for (let i = 0; i < def.frames; i++) {
        paths.add(picoFramePath(def.prefix, i));
      }
    }

    Promise.all(
      [...paths].map(
        (p) =>
          new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              if (p.includes("/pico-sprites/")) s.picoImages.set(p, img);
              else s.images.set(p, img);
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
      const postCanvas = postRef.current;
      if (postCanvas) applyCanvasDisplaySize(postCanvas, displayW, displayH);
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
      const watch = watchRef?.current ?? null;
      const watching = watch !== null;
      if (watching && !wasWatching) {
        s.smoothCam = { pan: 0, zoom: gameZoomToCanvas(1.4), angle: 0, shakeX: 0, shakeY: 0 };
      }
      wasWatching = watching;

      ensureBgBuffer(bgCanvas, cfg.pixelBg, s);
      ensureCharBuffer(charCanvas, charCtx, cfg.pixelChar, s);

      const postOn = cfg.postProcessing;
      const bgMode =
        watching && postOn ? watch.bgMode : cfg.bgMode;
      const colorTarget = watching ? watch.colors : targetColors();
      s.bg?.setMode(bgMode);
      s.colorCurrent = lerpColor(s.colorCurrent, colorTarget, 0.12);
      s.bg?.setColors(...s.colorCurrent);
      if (watching) s.bg!.booming = 1.35;
      s.bg?.update(dt);
      s.bg?.draw();

      const bufW = charCanvas.width;
      const bufH = charCanvas.height;
      charCtx.clearRect(0, 0, bufW, bufH);
      configure2dSmoothing(charCtx, cfg.pixelChar);

      if (watching) {
        const cam = s.smoothCam;
        const wrap = cameraWrapRef.current;
        if (wrap) wrap.style.transform = "";

        const moveAmt = watch.camera.target === 0 ? 20 : 9;
        const targetPan = watch.camera.target === 0 ? 42 : -42;
        let singPan = 0;
        let singAngle = 0;
        if (watch.camera.singDir === "left") {
          singPan = moveAmt;
          singAngle = 2;
        } else if (watch.camera.singDir === "right") {
          singPan = -moveAmt;
          singAngle = -2;
        }
        const beatBump = postOn ? watch.beatPulse : 0;
        const targetZoom = gameZoomToCanvas(watch.camera.zoom) + beatBump;
        const lerp = 0.1;
        cam.pan += (targetPan + singPan - cam.pan) * lerp;
        cam.zoom += (targetZoom - cam.zoom) * lerp;
        cam.angle += (singAngle - cam.angle) * lerp;
        cam.shakeX = Math.sin(watch.timeMs * 0.022) * watch.camera.shake * 0.35;
        cam.shakeY = Math.cos(watch.timeMs * 0.019) * watch.camera.shake * 0.35;

        const dadX = W * 0.36;
        const pivotX = W * 0.5;
        const pivotY = H * 0.58;

        const flickerMul =
          postOn && watch.flicker
            ? Math.floor(watch.timeMs / 50) % 2 === 0
              ? 0.45
              : 1
            : 1;

        charCtx.save();
        charCtx.translate(pivotX + cam.pan + cam.shakeX, pivotY + cam.shakeY);
        charCtx.rotate((cam.angle * Math.PI) / 180);
        charCtx.scale(cam.zoom, cam.zoom);
        charCtx.translate(-pivotX, -pivotY);
        charCtx.globalAlpha = flickerMul;

        if (watch.char2.visible) {
          setSlotAnim(s.slots.char2, watch.char2.anim);
          advanceSlot(s.slots.char2, dt);
          drawCharacter(
            charCtx,
            s.images,
            s.slots.char2.anim,
            s.slots.char2.frameIndex,
            dadX - 20,
            cfg.charScale,
            cfg.pixelChar,
            bufW,
            watch.char2.alpha,
            false,
          );
        }
        if (watch.dad.visible) {
          setSlotAnim(s.slots.dad, watch.dad.anim);
          advanceSlot(s.slots.dad, dt);
          drawCharacter(
            charCtx,
            s.images,
            s.slots.dad.anim,
            s.slots.dad.frameIndex,
            dadX,
            cfg.charScale,
            cfg.pixelChar,
            bufW,
            watch.dad.alpha,
            false,
          );
        }
        if (watch.bf.visible) {
          setPicoAnim(s.pico, watch.bf.anim);
          advancePicoSlot(s.pico, dt);
          drawPico(
            charCtx,
            s.picoImages,
            s.pico.anim,
            s.pico.frameIndex,
            W * 0.64,
            cfg.charScale,
            cfg.pixelChar,
            bufW,
            watch.bf.alpha,
          );
        }
        charCtx.restore();

        if (watch.talkText) {
          drawTalkBubble(charCtx, watch.talkText, dadX);
        }

        const introEl = introRef.current;
        if (introEl) {
          if (watch.introText && watch.introAlpha > 0.02) {
            introEl.textContent = watch.introText;
            introEl.style.opacity = String(watch.introAlpha);
            introEl.hidden = false;
          } else {
            introEl.hidden = true;
          }
        }

        const talkEl = talkRef.current;
        if (talkEl) talkEl.hidden = true;
      } else {
        const wrap = cameraWrapRef.current;
        if (wrap) wrap.style.transform = "";
        const introEl = introRef.current;
        if (introEl) introEl.hidden = true;
        const talkEl = talkRef.current;
        if (talkEl) talkEl.hidden = true;

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

        drawCharacter(
          charCtx,
          s.images,
          s.currentAnim,
          s.frameIndex,
          W / 2,
          cfg.charScale,
          cfg.pixelChar,
          bufW,
          1,
          false,
        );
      }

      const postCanvas = postRef.current;
      if (postOn && postCanvas) {
        if (!s.post) {
          try {
            s.post = new PostProcessRenderer(postCanvas);
          } catch {
            s.post = null;
          }
        }
        if (s.post) {
          s.post.update(dt);
          s.post.draw(bgCanvas, charCanvas, W, H);
          postCanvas.hidden = false;
          bgCanvas.style.visibility = "hidden";
          charCanvas.style.visibility = "hidden";
        }
      } else if (postCanvas) {
        postCanvas.hidden = true;
        bgCanvas.style.visibility = "";
        charCanvas.style.visibility = "";
      }

      if (s.recording && s.recordCtx && s.recordCanvas) {
        const rc = s.recordCtx;
        rc.imageSmoothingEnabled = false;
        rc.clearRect(0, 0, W, H);
        const src =
          postOn && postCanvas && !postCanvas.hidden ? postCanvas : null;
        if (src) {
          rc.drawImage(src, 0, 0, W, H);
        } else {
          rc.drawImage(bgCanvas, 0, 0, W, H);
          rc.drawImage(charCanvas, 0, 0, W, H);
        }
      }

      s.raf = requestAnimationFrame(tick);
    };

    s.raf = requestAnimationFrame(tick);

    const onKeyDown = (e: KeyboardEvent) => {
      if (watchRef?.current) return;
      if (e.key in KEY_MAP) {
        e.preventDefault();
        s.keys.add(e.key);
      }
      if (e.key === "Shift") s.altHeld = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (watchRef?.current) return;
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
  }, [active, obsMode, watchRef, onLoadingChange, onError]);

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
    cameraWrapRef,
    panelRef,
    introRef,
    talkRef,
    postRef,
    toggleRecord,
    isRecording: () => stateRef.current.recording,
  };
}
