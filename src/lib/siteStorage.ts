const INTRO_SEEN_KEY = "solidified.introSeen.v1";

export function loadIntroSeen(): boolean {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveIntroSeen(): void {
  try {
    localStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* private mode */
  }
}
