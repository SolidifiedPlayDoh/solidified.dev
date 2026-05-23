import { useEffect, useState } from "react";

import { EpilepsyGate } from "../femtanyl/EpilepsyGate";
import { FemtanylStage } from "../femtanyl/FemtanylStage";
import { loadEpilepsySkipped } from "../femtanyl/storage";
import { useFemtanylAnimator } from "../femtanyl/useFemtanylAnimator";
import { useFemtanylSettings } from "../femtanyl/useFemtanylSettings";
import "../styles/femtanyl.css";

/** Minimal 1280×720 feed for OBS Browser Source — no chrome, settings sync from main page. */
export function FemtanylOBSPage() {
  const [animatorActive, setAnimatorActive] = useState(loadEpilepsySkipped);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useFemtanylSettings();

  const { bgRef, charRef, stageRef } = useFemtanylAnimator({
    active: animatorActive,
    obsMode: true,
    settings,
    onLoadingChange: setLoading,
    onError: setError,
  });

  useEffect(() => {
    document.body.classList.add("femtanyl-route", "femtanyl-route--obs");
    document.body.style.overflow = "hidden";
    document.title = "Femtanyl OBS feed";
    return () => {
      document.body.classList.remove("femtanyl-route", "femtanyl-route--obs");
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <EpilepsyGate onAccept={() => setAnimatorActive(true)}>
      <div className={`femtanyl-obs-page${animatorActive ? "" : " femtanyl-obs-page--gated"}`}>
        <FemtanylStage
          stageRef={stageRef}
          bgRef={bgRef}
          charRef={charRef}
          pixelBg={settings.pixelBg}
          pixelChar={settings.pixelChar}
          loading={animatorActive && loading}
          error={error}
          obsMode
        />
      </div>
    </EpilepsyGate>
  );
}
