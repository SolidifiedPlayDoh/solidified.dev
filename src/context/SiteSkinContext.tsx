import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  applySiteSkin,
  readSiteSkin,
  writeSiteSkin,
  type SiteSkin,
} from "../lib/siteSkin";

type SiteSkinContextValue = {
  skin: SiteSkin;
  setSkin: (skin: SiteSkin) => void;
};

const SiteSkinContext = createContext<SiteSkinContextValue>({
  skin: "modern",
  setSkin: () => {},
});

export function useSiteSkin() {
  return useContext(SiteSkinContext);
}

export function SiteSkinProvider({ children }: { children: ReactNode }) {
  const [skin, setSkinState] = useState<SiteSkin>(() => {
    const initial = readSiteSkin();
    applySiteSkin(initial);
    return initial;
  });

  const setSkin = useCallback((next: SiteSkin) => {
    writeSiteSkin(next);
    applySiteSkin(next);
    setSkinState(next);
  }, []);

  const value = useMemo(() => ({ skin, setSkin }), [skin, setSkin]);

  return <SiteSkinContext.Provider value={value}>{children}</SiteSkinContext.Provider>;
}
