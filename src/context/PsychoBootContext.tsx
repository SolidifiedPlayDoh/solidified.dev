import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { PsychoBootOverlay } from "../components/PsychoBootOverlay";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const BOOT_SEEN_KEY = "solidified.psychoBoot.seen";

/** Survives SPA navigations within one document load. */
let bootPlayedThisDocument = false;

function readBootSeen(): boolean {
  try {
    return window.localStorage.getItem(BOOT_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function writeBootSeen() {
  try {
    window.localStorage.setItem(BOOT_SEEN_KEY, "1");
  } catch {
    /* private mode / blocked storage */
  }
}

type PsychoBootContextValue = {
  /** True once UI may start landing (handoff) or boot was skipped. */
  bootComplete: boolean;
  /** True while the full-screen boot sequence is playing. */
  booting: boolean;
};

const PsychoBootContext = createContext<PsychoBootContextValue>({
  bootComplete: true,
  booting: false,
});

export function usePsychoBoot() {
  return useContext(PsychoBootContext);
}

function forceBootFromQuery(): boolean {
  try {
    return new URLSearchParams(window.location.search).has("psycho");
  } catch {
    return false;
  }
}

type PsychoBootProviderProps = {
  children: ReactNode;
};

export function PsychoBootProvider({ children }: PsychoBootProviderProps) {
  const reducedMotion = usePrefersReducedMotion();
  const force = forceBootFromQuery();
  const alreadySeen = !force && (bootPlayedThisDocument || readBootSeen());
  const skip = reducedMotion || alreadySeen;
  const [bootComplete, setBootComplete] = useState(skip);
  const [booting, setBooting] = useState(!skip);

  useEffect(() => {
    if (reducedMotion) {
      setBooting(false);
      setBootComplete(true);
    }
  }, [reducedMotion]);

  useEffect(() => {
    document.body.classList.toggle("psycho-booting", booting);
    return () => {
      document.body.classList.remove("psycho-booting");
      document.body.classList.remove("psycho-handoff");
      document.body.classList.remove("psycho-from-boot");
      document.body.classList.remove("psycho-settled");
    };
  }, [booting]);

  const beginHandoff = useCallback(() => {
    document.body.classList.add("psycho-handoff");
    document.body.classList.add("psycho-from-boot");
    setBootComplete(true);
  }, []);

  const finishBoot = useCallback(() => {
    bootPlayedThisDocument = true;
    writeBootSeen();
    document.body.classList.remove("psycho-handoff");
    setBooting(false);
    setBootComplete(true);
    // After land finishes, lock final layout — removing from-boot alone
    // would restart the old reveal animation and paint text twice.
    window.setTimeout(() => {
      document.body.classList.add("psycho-settled");
      document.body.classList.remove("psycho-from-boot");
    }, 600);
  }, []);

  const value = useMemo(
    () => ({ bootComplete, booting }),
    [bootComplete, booting],
  );

  return (
    <PsychoBootContext.Provider value={value}>
      {booting && (
        <PsychoBootOverlay onHandoff={beginHandoff} onFinished={finishBoot} />
      )}
      {children}
    </PsychoBootContext.Provider>
  );
}
