/** Pico (boyfriend) sprites from mod atlas — data/characters/pico.xml */
export const PICO_FPS = 24;

export type PicoAnimName =
  | "idle"
  | "left"
  | "down"
  | "up"
  | "right"
  | "hit"
  | "shoot"
  | "dead";

export const PICO_ANIMATIONS: Record<
  PicoAnimName,
  { prefix: string; frames: number; offset: [number, number]; loop: boolean }
> = {
  idle: { prefix: "idle", frames: 1, offset: [0, 0], loop: true },
  left: { prefix: "left", frames: 1, offset: [40, 25], loop: false },
  down: { prefix: "down", frames: 1, offset: [0, 0], loop: false },
  up: { prefix: "up", frames: 1, offset: [0, 25], loop: false },
  right: { prefix: "right", frames: 1, offset: [-30, 15], loop: false },
  hit: { prefix: "hit", frames: 9, offset: [0, 0], loop: false },
  shoot: { prefix: "shoot", frames: 10, offset: [0, 0], loop: false },
  dead: { prefix: "dead", frames: 1, offset: [0, 0], loop: false },
};

export const PICO_NOTE_TO_ANIM: Record<0 | 1 | 2 | 3, PicoAnimName> = {
  0: "left",
  1: "down",
  2: "up",
  3: "right",
};

const PICO_BASE = `${import.meta.env.BASE_URL}femtanylFNF/pico-sprites`;

export function picoFramePath(prefix: string, index: number) {
  return `${PICO_BASE}/${prefix}${String(index).padStart(4, "0")}.png`;
}
