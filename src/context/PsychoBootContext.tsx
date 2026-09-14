import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import { useSiteSkin } from "./SiteSkinContext";

type PsychoBootContextValue = {
  bootComplete: boolean;
  booting: boolean;
};

const PsychoBootContext = createContext<PsychoBootContextValue>({
  bootComplete: true,
  booting: false,
});

export function usePsychoBoot() {
  return useContext(PsychoBootContext);
}

type PsychoBootProviderProps = {
  children: ReactNode;
};

/** Boot overlay is gone — flashing intro was seizure-triggering. */
export function PsychoBootProvider({ children }: PsychoBootProviderProps) {
  const { skin } = useSiteSkin();

  useEffect(() => {
    document.body.classList.remove("psycho-booting", "psycho-handoff", "psycho-from-boot");
    if (skin === "psycho") {
      document.body.classList.add("psycho-settled");
    } else {
      document.body.classList.remove("psycho-settled");
    }
    return () => {
      document.body.classList.remove(
        "psycho-booting",
        "psycho-handoff",
        "psycho-from-boot",
        "psycho-settled",
      );
    };
  }, [skin]);

  const value = useMemo(() => ({ bootComplete: true, booting: false }), []);

  return <PsychoBootContext.Provider value={value}>{children}</PsychoBootContext.Provider>;
}
