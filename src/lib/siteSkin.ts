export type SiteSkin = "modern" | "psycho";

const STORAGE_KEY = "solidified.siteSkin";

export const MODERN_THEME_COLOR = "#f3efe6";
export const PSYCHO_THEME_COLOR = "#050508";

/** @deprecated use MODERN_THEME_COLOR */
export const HANDMADE_THEME_COLOR = MODERN_THEME_COLOR;

export function isPsychoSkin(skin: SiteSkin): boolean {
  return skin === "psycho";
}

function isSkin(value: string | null): value is SiteSkin {
  return value === "modern" || value === "psycho";
}

export function readSiteSkin(): SiteSkin {
  try {
    const fromQuery = new URLSearchParams(window.location.search).get("skin");
    if (fromQuery === "handmade") {
      writeSiteSkin("modern");
      return "modern";
    }
    if (isSkin(fromQuery)) {
      writeSiteSkin(fromQuery);
      return fromQuery;
    }
  } catch {
    /* ignore */
  }

  writeSiteSkin("modern");
  return "modern";
}

export function writeSiteSkin(skin: SiteSkin) {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, skin);
  } catch {
    /* private mode */
  }
}

export function applySiteSkin(skin: SiteSkin) {
  document.documentElement.dataset.skin = skin;
  document.documentElement.style.colorScheme = skin === "modern" ? "light" : "dark";

  let theme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
  if (!theme) {
    theme = document.createElement("meta");
    theme.name = "theme-color";
    document.head.appendChild(theme);
  }
  theme.content = skin === "modern" ? MODERN_THEME_COLOR : PSYCHO_THEME_COLOR;
}
