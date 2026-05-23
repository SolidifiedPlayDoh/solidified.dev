import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { FemtanylAbout } from "../femtanyl/FemtanylAbout";
import { EpilepsyGate } from "../femtanyl/EpilepsyGate";
import { FemtanylStage } from "../femtanyl/FemtanylStage";
import { FemtanylWatchDisclaimer } from "../femtanyl/FemtanylWatchDisclaimer";
import { loadEpilepsySkipped, obsPopoutUrl } from "../femtanyl/storage";
import { useChartWatch } from "../femtanyl/useChartWatch";
import { useFemtanylAnimator } from "../femtanyl/useFemtanylAnimator";
import { useFemtanylBootOverlay } from "../femtanyl/useFemtanylBootOverlay";
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
  const [watchDisclaimerOpen, setWatchDisclaimerOpen] = useState(false);

  const {
    settings,
    setBgMode,
    setCharScale,
    setPixelBg,
    setPixelChar,
    setPostProcessing,
  } = useFemtanylSettings();

  const chartWatch = useChartWatch();

  const {
    bgRef,
    charRef,
    stageRef,
    cameraWrapRef,
    panelRef,
    introRef,
    talkRef,
    postRef,
    toggleRecord,
  } = useFemtanylAnimator({
    active: animatorActive,
    settings,
    watchRef: chartWatch.watchRef,
    onLoadingChange: setLoading,
    onError: setError,
  });

  const boot = useFemtanylBootOverlay(animatorActive, loading);

  useEffect(() => {
    document.body.classList.add("femtanyl-route");
    document.body.style.overflow = "auto";

    const fontId = "femtanyl-slender-font";
    if (!document.getElementById(fontId)) {
      const style = document.createElement("style");
      style.id = fontId;
      style.textContent = `@font-face{font-family:Slender;src:url(${import.meta.env.BASE_URL}femtanylFNF/fonts/slender.ttf) format("truetype");}`;
      document.head.appendChild(style);
    }

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
            cameraWrapRef={cameraWrapRef}
            bgRef={bgRef}
            charRef={charRef}
            introRef={introRef}
            talkRef={talkRef}
            postRef={postRef}
            pixelBg={settings.pixelBg}
            pixelChar={settings.pixelChar}
            boot={boot}
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

            <label className="femtanyl-check">
              <input
                type="checkbox"
                checked={settings.postProcessing}
                onChange={(e) => setPostProcessing(e.target.checked)}
              />
              Post processing (mod shaders &amp; screen FX)
            </label>

            <button type="button" className="femtanyl-btn femtanyl-btn--secondary" onClick={openObsWindow}>
              Pop out OBS feed (1280×720)
            </button>

            <button
              type="button"
              className="femtanyl-btn femtanyl-btn--watch"
              disabled={chartWatch.isWatching || chartWatch.status === "loading"}
              onClick={() => setWatchDisclaimerOpen(true)}
            >
              {chartWatch.isWatching ? "Playing chart…" : "Watch full chart (no input)"}
            </button>

            {chartWatch.isWatching && (
              <button type="button" className="femtanyl-btn femtanyl-btn--secondary" onClick={() => chartWatch.stop()}>
                Stop playback
              </button>
            )}

            {chartWatch.error && (
              <p className="femtanyl-watch-error" role="alert">
                {chartWatch.error}
              </p>
            )}

            <button type="button" onClick={handleRecord} disabled={chartWatch.isWatching}>
              {recording ? "Stop recording" : "Record WebM clip"}
            </button>
          </aside>
        </div>

        <FemtanylAbout />

        <FemtanylWatchDisclaimer
          open={watchDisclaimerOpen}
          onCancel={() => setWatchDisclaimerOpen(false)}
          onConfirm={() => {
            setWatchDisclaimerOpen(false);
            void chartWatch.start();
          }}
        />
      </div>
    </EpilepsyGate>
  );
}
