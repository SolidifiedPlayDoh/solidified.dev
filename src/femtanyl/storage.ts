export const EPILEPSY_SKIP_KEY = "solidified.femtanylFNF.epilepsySkip.v1";
export const SETTINGS_KEY = "solidified.femtanylFNF.settings.v1";
export const WARM_BOOT_KEY = "solidified.femtanylFNF.lastVisit.v1";

/** Within this window, show the short “shaders precompiled” boot instead of full compile. */
export const WARM_BOOT_MS = 60 * 60 * 1000;

export type FemtanylSettings = {
  bgMode: string;
  charScale: number;
  pixelBg: boolean;
  pixelChar: boolean;
  postProcessing: boolean;
};

export const defaultFemtanylSettings: FemtanylSettings = {
  bgMode: "trippy",
  charScale: 1,
  pixelBg: false,
  pixelChar: false,
  postProcessing: true,
};

export function loadEpilepsySkipped(): boolean {
  try {
    return localStorage.getItem(EPILEPSY_SKIP_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveEpilepsySkipped() {
  try {
    localStorage.setItem(EPILEPSY_SKIP_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function loadFemtanylSettings(): FemtanylSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...defaultFemtanylSettings };
    const parsed = JSON.parse(raw) as Partial<FemtanylSettings>;
    return {
      bgMode: parsed.bgMode ?? defaultFemtanylSettings.bgMode,
      charScale: parsed.charScale ?? defaultFemtanylSettings.charScale,
      pixelBg: parsed.pixelBg ?? defaultFemtanylSettings.pixelBg,
      pixelChar: parsed.pixelChar ?? defaultFemtanylSettings.pixelChar,
      postProcessing: parsed.postProcessing ?? defaultFemtanylSettings.postProcessing,
    };
  } catch {
    return { ...defaultFemtanylSettings };
  }
}

export function saveFemtanylSettings(settings: FemtanylSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

export function isWarmBootVisit(): boolean {
  try {
    const raw = localStorage.getItem(WARM_BOOT_KEY);
    if (!raw) return false;
    const last = Number(raw);
    if (!Number.isFinite(last)) return false;
    return Date.now() - last < WARM_BOOT_MS;
  } catch {
    return false;
  }
}

export function markWarmBootVisit() {
  try {
    localStorage.setItem(WARM_BOOT_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

export function obsPopoutUrl(): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  return `${window.location.origin}${base}femtanylFNF/obs`;
}
