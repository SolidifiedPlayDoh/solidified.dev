import { useCallback, useEffect, useState } from "react";

import {
  defaultFemtanylSettings,
  loadFemtanylSettings,
  saveFemtanylSettings,
  SETTINGS_KEY,
  type FemtanylSettings,
} from "./storage";

export function useFemtanylSettings() {
  const [settings, setSettings] = useState<FemtanylSettings>(loadFemtanylSettings);

  const patch = useCallback((partial: Partial<FemtanylSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      saveFemtanylSettings(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === SETTINGS_KEY) {
        setSettings(loadFemtanylSettings());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return {
    settings,
    setBgMode: (bgMode: string) => patch({ bgMode }),
    setCharScale: (charScale: number) => patch({ charScale }),
    setPixelBg: (pixelBg: boolean) => patch({ pixelBg }),
    setPixelChar: (pixelChar: boolean) => patch({ pixelChar }),
    resetSettings: () => {
      const next = { ...defaultFemtanylSettings };
      saveFemtanylSettings(next);
      setSettings(next);
    },
  };
}
