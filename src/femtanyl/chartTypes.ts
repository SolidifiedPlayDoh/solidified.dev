import type { AnimName } from "./animations";

export type ChartNote = {
  id: 0 | 1 | 2 | 3;
  time: number;
  sLen: number;
  type?: number;
};

export type ChartEvent = {
  name: string;
  time: number;
  params: unknown[];
};

export type StrumLine = {
  notes: ChartNote[];
  position?: string;
  visible?: boolean;
  characters?: string[];
};

export type FemtanylChart = {
  events: ChartEvent[];
  strumLines: StrumLine[];
  scrollSpeed?: number;
};

export const NOTE_TO_ANIM: Record<0 | 1 | 2 | 3, AnimName> = {
  0: "left",
  1: "down",
  2: "up",
  3: "right",
};

export const NOTE_TO_ALT: Record<0 | 1 | 2 | 3, AnimName> = {
  0: "altleft",
  1: "downalt",
  2: "upalt",
  3: "rightalt",
};
