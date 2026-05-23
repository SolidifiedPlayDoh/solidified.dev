/** Step-based stage script from songs/NULL/scripts/events.hx → milliseconds */

const BPM_START = 95;
const BPM_DOUBLE = 190;
const BPM_CHANGE_MS = 10180.4736842105;

export function stepToMs(step: number): number {
  const msPerStepStart = 60000 / (BPM_START * 4);
  const stepAtChange = BPM_CHANGE_MS / msPerStepStart;
  if (step <= stepAtChange) {
    return step * msPerStepStart;
  }
  const msPerStepFast = 60000 / (BPM_DOUBLE * 4);
  return BPM_CHANGE_MS + (step - stepAtChange) * msPerStepFast;
}

export type TimedStageAction =
  | { time: number; kind: "bg"; mode: string }
  | { time: number; kind: "dadVisible"; visible: boolean }
  | { time: number; kind: "bfVisible"; visible: boolean }
  | { time: number; kind: "char2Visible"; visible: boolean }
  | { time: number; kind: "dadAlpha"; alpha: number }
  | { time: number; kind: "char2Alpha"; alpha: number }
  | { time: number; kind: "camZoom"; zoom: number }
  | { time: number; kind: "camShake"; intensity: number; durationMs: number }
  | { time: number; kind: "intro"; text: string }
  | { time: number; kind: "introFade" }
  | { time: number; kind: "talk"; text: string }
  | { time: number; kind: "flicker"; durationMs: number }
  | { time: number; kind: "zoomTanyl"; enabled: boolean };

/** Hardcoded milestones from events.hx + femtanyl.hx intro. */
export const STAGE_TIMELINE = ([
  { time: 0, kind: "bg", mode: "black" },
  { time: 0, kind: "dadVisible", visible: false },
  { time: 0, kind: "bfVisible", visible: false },
  { time: 0, kind: "char2Visible", visible: false },
  { time: stepToMs(58), kind: "camZoom", zoom: 1.4 },
  { time: stepToMs(60), kind: "intro", text: "i" },
  { time: stepToMs(61), kind: "intro", text: "i woke" },
  { time: stepToMs(62), kind: "intro", text: "i woke up." },
  { time: stepToMs(64), kind: "introFade" },
  { time: stepToMs(64), kind: "bg", mode: "trippy" },
  { time: stepToMs(64), kind: "dadVisible", visible: true },
  { time: stepToMs(64), kind: "bfVisible", visible: true },
  { time: stepToMs(448), kind: "bg", mode: "soundwave" },
  { time: stepToMs(448), kind: "talk", text: "HEY!" },
  { time: stepToMs(448), kind: "camShake", intensity: 3, durationMs: 100 },
  { time: stepToMs(480), kind: "talk", text: "HEY!" },
  { time: stepToMs(512), kind: "talk", text: "AYY!" },
  { time: stepToMs(544), kind: "talk", text: "HEY!" },
  { time: stepToMs(576), kind: "talk", text: "HAH!" },
  { time: stepToMs(588), kind: "talk", text: "HAH!" },
  { time: stepToMs(596), kind: "talk", text: "HAH!" },
  { time: stepToMs(604), kind: "talk", text: "HAH!" },
  { time: stepToMs(652), kind: "talk", text: "AY!" },
  { time: stepToMs(668), kind: "talk", text: "AY!" },
  { time: stepToMs(676), kind: "talk", text: "HEY!" },
  { time: stepToMs(684), kind: "talk", text: "HEY!" },
  { time: stepToMs(692), kind: "talk", text: "HEY!" },
  { time: stepToMs(700), kind: "bg", mode: "epilepsy" },
  { time: stepToMs(700), kind: "camShake", intensity: 4, durationMs: 400 },
  { time: stepToMs(700), kind: "flicker", durationMs: 400 },
  { time: stepToMs(704), kind: "bg", mode: "trippy" },
  { time: stepToMs(704), kind: "zoomTanyl", enabled: true },
  { time: stepToMs(704), kind: "char2Visible", visible: true },
  { time: stepToMs(704), kind: "dadAlpha", alpha: 0.65 },
  { time: stepToMs(704), kind: "char2Alpha", alpha: 1 },
  { time: stepToMs(704), kind: "camZoom", zoom: 0.8 },
  { time: stepToMs(960), kind: "bg", mode: "infiniteDoor" },
  { time: stepToMs(1139), kind: "dadAlpha", alpha: 0 },
  { time: stepToMs(1139), kind: "char2Alpha", alpha: 0 },
  { time: stepToMs(1146), kind: "flicker", durationMs: 400 },
  { time: stepToMs(1152), kind: "bg", mode: "vortex" },
  { time: stepToMs(1152), kind: "dadAlpha", alpha: 0.65 },
  { time: stepToMs(1152), kind: "char2Alpha", alpha: 1 },
  { time: stepToMs(1152), kind: "camZoom", zoom: 0.8 },
] as TimedStageAction[]).sort((a, b) => a.time - b.time);

const INTRO_FADE_START = stepToMs(64);
const INTRO_FADE_MS = 1200;

export type StageState = {
  bgMode: string;
  dadVisible: boolean;
  bfVisible: boolean;
  char2Visible: boolean;
  dadAlpha: number;
  char2Alpha: number;
  camZoom: number;
  camShakeUntil: number;
  camShakeIntensity: number;
  introText: string;
  introAlpha: number;
  talkText: string;
  talkUntil: number;
  blackScreen: boolean;
  flickerUntil: number;
  zoomTanyl: boolean;
};

export const DEFAULT_STAGE: StageState = {
  bgMode: "black",
  dadVisible: false,
  bfVisible: false,
  char2Visible: false,
  dadAlpha: 1,
  char2Alpha: 1,
  camZoom: 1,
  camShakeUntil: 0,
  camShakeIntensity: 0,
  introText: "",
  introAlpha: 0,
  talkText: "",
  talkUntil: 0,
  blackScreen: true,
  flickerUntil: 0,
  zoomTanyl: false,
};

export function evalStageAt(timeMs: number): StageState {
  const s = { ...DEFAULT_STAGE };
  let introFadeStart = false;

  for (const action of STAGE_TIMELINE) {
    if (action.time > timeMs) break;
    switch (action.kind) {
      case "bg":
        s.bgMode = action.mode;
        s.blackScreen = action.mode === "black";
        break;
      case "dadVisible":
        s.dadVisible = action.visible;
        break;
      case "bfVisible":
        s.bfVisible = action.visible;
        break;
      case "char2Visible":
        s.char2Visible = action.visible;
        break;
      case "dadAlpha":
        s.dadAlpha = action.alpha;
        break;
      case "char2Alpha":
        s.char2Alpha = action.alpha;
        break;
      case "camZoom":
        s.camZoom = action.zoom;
        break;
      case "camShake":
        s.camShakeIntensity = action.intensity;
        s.camShakeUntil = action.time + action.durationMs;
        break;
      case "intro":
        s.introText = action.text;
        s.introAlpha = 1;
        break;
      case "introFade":
        introFadeStart = true;
        break;
      case "talk":
        s.talkText = action.text;
        s.talkUntil = action.time + 1200;
        break;
      case "flicker":
        s.flickerUntil = action.time + action.durationMs;
        break;
      case "zoomTanyl":
        s.zoomTanyl = action.enabled;
        break;
    }
  }

  if (introFadeStart && timeMs >= INTRO_FADE_START) {
    const t = Math.min(1, (timeMs - INTRO_FADE_START) / INTRO_FADE_MS);
    s.introAlpha = 1 - t;
    if (t >= 1) {
      s.introText = "";
      s.introAlpha = 0;
    }
    s.blackScreen = t < 1;
  } else if (s.introText && !introFadeStart) {
    s.introAlpha = 1;
    s.blackScreen = true;
  }

  if (timeMs > s.camShakeUntil) s.camShakeIntensity = 0;
  if (timeMs > s.talkUntil) s.talkText = "";
  if (timeMs > s.flickerUntil) s.flickerUntil = 0;

  return s;
}
