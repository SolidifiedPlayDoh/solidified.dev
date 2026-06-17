const FX_KEY = "solidified-fx";
const FX_EVENT = "solidified-fx-change";

export function isSiteLite(): boolean {
  try {
    return localStorage.getItem(FX_KEY) !== "1";
  } catch {
    return true;
  }
}

export function isSiteFxEnabled(): boolean {
  return !isSiteLite();
}

export function applySiteFxClass(): void {
  document.documentElement.classList.toggle("site-lite", isSiteLite());
}

export function setSiteFxEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(FX_KEY, enabled ? "1" : "0");
  } catch {
    /* private mode */
  }
  applySiteFxClass();
  if (enabled) {
    void import("../styles/ambient.css");
    void import("../styles/wirefield.css");
  }
  window.dispatchEvent(new Event(FX_EVENT));
}

export function loadOptionalFxStyles(): void {
  if (!isSiteLite()) {
    void import("../styles/ambient.css");
    void import("../styles/wirefield.css");
  }
}

export function subscribeSiteFx(onChange: () => void): () => void {
  window.addEventListener(FX_EVENT, onChange);
  return () => window.removeEventListener(FX_EVENT, onChange);
}
