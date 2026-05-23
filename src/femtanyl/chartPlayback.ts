import type { AnimName } from "./animations";
import { DIR_COLORS, DEFAULT_COLORS } from "./animations";
import type { ChartEvent, ChartNote, FemtanylChart } from "./chartTypes";
import { NOTE_TO_ALT, NOTE_TO_ANIM } from "./chartTypes";
import type { PicoAnimName } from "./picoAnimations";
import { PICO_NOTE_TO_ANIM } from "./picoAnimations";
import { evalStageAt } from "./stageScript";

const BPM_CHANGE_MS = 10180.4736842105;

function beatPulseAt(timeMs: number, zoomTanyl: boolean): number {
  if (!zoomTanyl) return 0;
  const bpm = timeMs >= BPM_CHANGE_MS ? 190 : 95;
  const beatMs = 60000 / bpm;
  const phase = (timeMs % beatMs) / beatMs;
  return phase < 0.08 ? 0.07 : 0;
}

const CHART_URL = `${import.meta.env.BASE_URL}femtanylFNF/chart.json`;
const INST_URL = `${import.meta.env.BASE_URL}femtanylFNF/Inst.ogg`;

export type LineIndex = 0 | 1 | 2;

export type CharSlot = {
  anim: AnimName;
  alt: boolean;
  visible: boolean;
  alpha: number;
};

export type PicoSlot = {
  anim: PicoAnimName;
  visible: boolean;
  alpha: number;
};

export type CameraState = {
  target: 0 | 1;
  zoom: number;
  singDir: "left" | "down" | "up" | "right" | null;
  shake: number;
};

export type WatchFrame = {
  timeMs: number;
  bgMode: string;
  blackScreen: boolean;
  introText: string;
  introAlpha: number;
  talkText: string;
  flicker: boolean;
  beatPulse: number;
  colors: [number, number, number];
  dad: CharSlot;
  bf: PicoSlot;
  char2: CharSlot;
  camera: CameraState;
};

type LineNotes = { notes: ChartNote[]; idx: number };

const SING_MS = 220;

function noteDuration(note: ChartNote): number {
  return note.sLen > 0 ? note.sLen : SING_MS;
}

function activeNoteAt(notes: ChartNote[], idx: number, t: number): { note: ChartNote | null; nextIdx: number } {
  let i = idx;
  while (i + 1 < notes.length && notes[i + 1]!.time <= t) i++;
  const note = notes[i] ?? null;
  if (!note || note.time > t) return { note: null, nextIdx: i };
  if (t < note.time + noteDuration(note)) return { note, nextIdx: i };
  return { note: null, nextIdx: i };
}

function animForNote(note: ChartNote, alt: boolean): AnimName {
  const id = note.id;
  return alt ? NOTE_TO_ALT[id] : NOTE_TO_ANIM[id];
}

function noteToDir(id: 0 | 1 | 2 | 3): "left" | "down" | "up" | "right" {
  return (["left", "down", "up", "right"] as const)[id];
}

const BASE_DIR: Partial<Record<AnimName, keyof typeof DIR_COLORS>> = {
  altleft: "left",
  downalt: "down",
  upalt: "up",
  rightalt: "right",
  left: "left",
  down: "down",
  up: "up",
  right: "right",
};

function colorsForAnim(anim: AnimName): [number, number, number] {
  const key = BASE_DIR[anim];
  if (key && DIR_COLORS[key]) return DIR_COLORS[key];
  return DEFAULT_COLORS;
}

export async function loadChart(): Promise<FemtanylChart> {
  const res = await fetch(CHART_URL);
  if (!res.ok) throw new Error(`Chart load failed (${res.status})`);
  return res.json() as Promise<FemtanylChart>;
}

export function createInstAudio(): HTMLAudioElement {
  const a = new Audio(INST_URL);
  a.preload = "auto";
  return a;
}

export function buildWatchFrame(
  _chart: FemtanylChart,
  timeMs: number,
  lines: LineNotes[],
  cameraTarget: 0 | 1,
  altByLine: boolean[],
): WatchFrame {
  const stage = evalStageAt(timeMs);

  const dad: CharSlot = {
    anim: "idle",
    alt: false,
    visible: stage.dadVisible,
    alpha: stage.dadAlpha,
  };
  const bf: PicoSlot = { anim: "idle", visible: stage.bfVisible, alpha: 1 };
  const char2: CharSlot = {
    anim: "idle",
    alt: false,
    visible: stage.char2Visible,
    alpha: stage.char2Alpha,
  };

  let color: [number, number, number] = DEFAULT_COLORS;
  let singDir: CameraState["singDir"] = null;

  for (let li = 0; li < 3; li++) {
    const ln = lines[li]!;
    const { note, nextIdx } = activeNoteAt(ln.notes, ln.idx, timeMs);
    ln.idx = nextIdx;
    if (!note) continue;

    if (li === 0) {
      const alt = altByLine[0] ?? false;
      dad.anim = animForNote(note, alt);
      dad.alt = alt;
      if (cameraTarget === 0) {
        color = colorsForAnim(dad.anim);
        singDir = noteToDir(note.id);
      }
    } else if (li === 1) {
      bf.anim = PICO_NOTE_TO_ANIM[note.id];
      if (cameraTarget === 1) {
        singDir = noteToDir(note.id);
      }
    } else if (li === 2) {
      const alt = altByLine[2] ?? false;
      char2.anim = animForNote(note, alt);
      char2.alt = alt;
    }
  }

  const shake =
    stage.camShakeIntensity > 0 && timeMs <= stage.camShakeUntil ? stage.camShakeIntensity : 0;

  const flicker = stage.flickerUntil > 0 && timeMs <= stage.flickerUntil;

  return {
    timeMs,
    bgMode: stage.blackScreen ? "black" : stage.bgMode,
    blackScreen: stage.blackScreen,
    introText: stage.introText,
    introAlpha: stage.introAlpha,
    talkText: stage.talkText,
    flicker,
    beatPulse: beatPulseAt(timeMs, stage.zoomTanyl),
    colors: color,
    dad,
    bf,
    char2,
    camera: {
      target: cameraTarget,
      zoom: stage.camZoom,
      singDir,
      shake,
    },
  };
}

export function initLineNotes(chart: FemtanylChart): LineNotes[] {
  return chart.strumLines.map((sl) => ({
    notes: [...sl.notes].sort((a, b) => a.time - b.time),
    idx: 0,
  }));
}

const sortedEventCache = new WeakMap<ChartEvent[], ChartEvent[]>();

function sortedEvents(events: ChartEvent[]): ChartEvent[] {
  let sorted = sortedEventCache.get(events);
  if (!sorted) {
    sorted = [...events].sort((a, b) => a.time - b.time);
    sortedEventCache.set(events, sorted);
  }
  return sorted;
}

export function evalChartEvents(events: ChartEvent[], timeMs: number): {
  cameraTarget: 0 | 1;
  altByLine: boolean[];
} {
  let cameraTarget: 0 | 1 = 0;
  const altByLine = [false, false, false];
  for (const ev of sortedEvents(events)) {
    if (ev.time > timeMs) break;
    if (ev.name === "Camera Movement" && typeof ev.params[0] === "number") {
      cameraTarget = ev.params[0] === 1 ? 1 : 0;
    }
    if (ev.name === "Alt Animation Toggle") {
      const enabled = Boolean(ev.params[0]);
      const line = typeof ev.params[2] === "number" ? (ev.params[2] as LineIndex) : 0;
      if (line >= 0 && line <= 2) altByLine[line] = enabled;
    }
  }
  return { cameraTarget, altByLine };
}

export function resetLineIndices(lines: LineNotes[]) {
  for (const ln of lines) ln.idx = 0;
}
