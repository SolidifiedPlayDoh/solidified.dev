import type { RefObject } from "react";

import { FemtanylBootOverlay } from "./FemtanylBootOverlay";

type BootState = {
  visible: boolean;
  message: string;
  progress: number;
};

type Props = {
  stageRef: RefObject<HTMLDivElement | null>;
  cameraWrapRef?: RefObject<HTMLDivElement | null>;
  bgRef: RefObject<HTMLCanvasElement | null>;
  charRef: RefObject<HTMLCanvasElement | null>;
  introRef?: RefObject<HTMLDivElement | null>;
  talkRef?: RefObject<HTMLDivElement | null>;
  postRef?: RefObject<HTMLCanvasElement | null>;
  pixelBg: boolean;
  pixelChar: boolean;
  boot: BootState;
  error: string | null;
  obsMode?: boolean;
};

export function FemtanylStage({
  stageRef,
  cameraWrapRef,
  bgRef,
  charRef,
  introRef,
  talkRef,
  postRef,
  pixelBg,
  pixelChar,
  boot,
  error,
  obsMode = false,
}: Props) {
  return (
    <div className={obsMode ? "femtanyl-obs-wrap" : "femtanyl-stage-wrap"}>
      <div
        className={`femtanyl-stage${obsMode ? " femtanyl-stage--obs" : ""}${boot.visible ? " femtanyl-stage--booting" : ""}`}
        ref={stageRef}
      >
        <div className="femtanyl-stage__camera" ref={cameraWrapRef}>
          <canvas
            id="femtanyl-bg"
            ref={bgRef}
            className={pixelBg ? "femtanyl-render--pixel" : "femtanyl-render--smooth"}
          />
          <canvas
            id="femtanyl-char"
            ref={charRef}
            className={pixelChar ? "femtanyl-render--pixel" : "femtanyl-render--smooth"}
          />
        </div>
        <canvas
          ref={postRef}
          className="femtanyl-post femtanyl-render--smooth"
          hidden
          aria-hidden
        />
        <div ref={introRef} className="femtanyl-intro" hidden />
        <div ref={talkRef} className="femtanyl-talk" hidden />
        {boot.visible && (
          <FemtanylBootOverlay message={boot.message} progress={boot.progress} />
        )}
        {error && !boot.visible && (
          <p className="femtanyl-loading femtanyl-loading--error" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
