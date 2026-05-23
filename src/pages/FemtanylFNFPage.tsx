import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { EpilepsyGate } from "../femtanyl/EpilepsyGate";
import { FemtanylStage } from "../femtanyl/FemtanylStage";
import { loadEpilepsySkipped, obsPopoutUrl } from "../femtanyl/storage";
import { useFemtanylAnimator } from "../femtanyl/useFemtanylAnimator";
import { useFemtanylSettings } from "../femtanyl/useFemtanylSettings";
import { usePageMeta } from "../hooks/usePageMeta";
import { absoluteUrl } from "../lib/siteUrl";
import "../styles/femtanyl.css";

const FEMTANYL_OG = {
  title: "Femtanyl FNF Animator | Solidified.dev",
  description:
    "Keyboard sprite animator for the Femtanyl FNF mod — arrow keys, alt poses, trippy shaders, OBS pop-out. ⚠️ Flashing visuals.",
  image: absoluteUrl("/og-femtanyl.png"),
  imageWidth: 842,
  imageHeight: 842,
  imageAlt: "Femtanyl character snarling with red markings on a glitchy purple background",
  themeColor: "#12081f",
  path: "/femtanylFNF",
} as const;

export function FemtanylFNFPage() {
  usePageMeta(FEMTANYL_OG);
  const [animatorActive, setAnimatorActive] = useState(loadEpilepsySkipped);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  const {
    settings,
    setBgMode,
    setCharScale,
    setPixelBg,
    setPixelChar,
  } = useFemtanylSettings();

  const { bgRef, charRef, stageRef, panelRef, toggleRecord } = useFemtanylAnimator({
    active: animatorActive,
    settings,
    onLoadingChange: setLoading,
    onError: setError,
  });

  useEffect(() => {
    document.body.classList.add("femtanyl-route");
    document.body.style.overflow = "auto";
    return () => {
      document.body.classList.remove("femtanyl-route");
      document.body.style.overflow = "";
    };
  }, []);

  const openObsWindow = () => {
    window.open(
      obsPopoutUrl(),
      "femtanyl-obs-feed",
      "popup=yes,width=1280,height=720,menubar=no,toolbar=no,location=no,status=no",
    );
  };

  const handleRecord = () => {
    if (recording) {
      toggleRecord();
      setRecording(false);
    } else {
      setRecording(toggleRecord());
    }
  };

  return (
    <EpilepsyGate onAccept={() => setAnimatorActive(true)}>
      <div
        className={`femtanyl-page${animatorActive ? "" : " femtanyl-page--gated"}`}
      >
        <header className="femtanyl-page__header">
          <Link to="/" className="femtanyl-page__back">
            ← solidified.dev
          </Link>
          <h1 className="femtanyl-page__title">Femtanyl FNF character animator</h1>
          <p className="femtanyl-page__disclaimer">
            I do <strong>not</strong> own the character art, music, shaders, or other assets from
            the Femtanyl Friday Night Funkin&apos; mod. Those belong to the mod&apos;s creators. I
            only wrote this page so you can play the premade sprite animations with your keyboard.
          </p>
        </header>

        <div className="femtanyl-layout">
          <FemtanylStage
            stageRef={stageRef}
            bgRef={bgRef}
            charRef={charRef}
            pixelBg={settings.pixelBg}
            pixelChar={settings.pixelChar}
            loading={animatorActive && loading}
            error={error}
          />

          <aside className="femtanyl-panel" ref={panelRef}>
            <h2 className="femtanyl-panel__heading">Controls</h2>
            <p className="femtanyl-hint">
              Hold <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> to play that
              direction&apos;s animation. <kbd>Shift</kbd> uses alternate poses. Release keys to
              return to idle.
            </p>

            <label>
              Background
              <select
                value={settings.bgMode}
                onChange={(e) => setBgMode(e.target.value)}
              >
                <option value="trippy">Trippy (from the mod)</option>
                <option value="epilepsy">Rainbow cycle</option>
                <option value="green">Solid green</option>
              </select>
            </label>

            <label>
              Character scale
              <input
                type="range"
                min={0.25}
                max={1}
                step={0.05}
                value={settings.charScale}
                onChange={(e) => setCharScale(parseFloat(e.target.value))}
              />
              <span>{settings.charScale.toFixed(2)}</span>
            </label>

            <label className="femtanyl-check">
              <input
                type="checkbox"
                checked={settings.pixelBg}
                onChange={(e) => setPixelBg(e.target.checked)}
              />
              Pixelated background
            </label>

            <label className="femtanyl-check">
              <input
                type="checkbox"
                checked={settings.pixelChar}
                onChange={(e) => setPixelChar(e.target.checked)}
              />
              Pixelated character
            </label>

            <button type="button" className="femtanyl-btn femtanyl-btn--secondary" onClick={openObsWindow}>
              Pop out OBS feed (1280×720)
            </button>

            <button type="button" onClick={handleRecord}>
              {recording ? "Stop recording" : "Record WebM clip"}
            </button>
          </aside>
        </div>
      </div>
    </EpilepsyGate>
  );
}
