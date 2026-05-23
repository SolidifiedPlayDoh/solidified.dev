/** Animation defs parsed from femtanyl character + atlas */
export const FPS = 24;

/** Idle frame box height from atlas — all anims scale to this on-screen. */
export const CHAR_NORM_HEIGHT = 561;

type AnimDef = {
  prefix: string;
  frames: number;
  offset: [number, number];
  loop: boolean;
  /** Atlas frameWidth / frameHeight (symbol box), not crop size. */
  frameW: number;
  frameH: number;
};

export const ANIMATIONS: Record<string, AnimDef> = {
  idle: { prefix: "idle", frames: 6, offset: [0, 0], loop: true, frameW: 307, frameH: 561 },
  left: { prefix: "left", frames: 14, offset: [20, -20], loop: true, frameW: 374, frameH: 540 },
  down: { prefix: "down", frames: 14, offset: [-26, -56], loop: true, frameW: 296, frameH: 503 },
  up: { prefix: "up", frames: 14, offset: [-30, 30], loop: true, frameW: 282, frameH: 592 },
  right: { prefix: "right", frames: 14, offset: [-10, 0], loop: true, frameW: 318, frameH: 555 },
  altleft: { prefix: "altleft", frames: 14, offset: [140, -65], loop: true, frameW: 403, frameH: 503 },
  downalt: { prefix: "downalt", frames: 14, offset: [-20, -165], loop: true, frameW: 309, frameH: 397 },
  upalt: { prefix: "upalt", frames: 14, offset: [0, 105], loop: true, frameW: 362, frameH: 676 },
  rightalt: { prefix: "rightalt", frames: 14, offset: [-45, -70], loop: true, frameW: 408, frameH: 488 },
};

export type AnimName = keyof typeof ANIMATIONS;

export const KEY_MAP: Record<
  string,
  { base: AnimName; alt: AnimName }
> = {
  ArrowLeft: { base: "left", alt: "altleft" },
  ArrowDown: { base: "down", alt: "downalt" },
  ArrowUp: { base: "up", alt: "upalt" },
  ArrowRight: { base: "right", alt: "rightalt" },
};

export const DIR_COLORS: Record<string, [number, number, number]> = {
  left: [0.5, 0.2, 1.0],
  down: [0.45, 0.0, 1.2],
  up: [0.1, 1.2, 1.0],
  right: [1.2, 0.2, 1.0],
};

export const DEFAULT_COLORS: [number, number, number] = [0.1, 1.1, 1.0];

const SPRITE_BASE = `${import.meta.env.BASE_URL}femtanylFNF/sprites`;

export function framePath(prefix: string, index: number) {
  return `${SPRITE_BASE}/${prefix}${String(index).padStart(4, "0")}.png`;
}
