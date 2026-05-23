import type { RefObject } from "react";

type Props = {
  stageRef: RefObject<HTMLDivElement | null>;
  bgRef: RefObject<HTMLCanvasElement | null>;
  charRef: RefObject<HTMLCanvasElement | null>;
  pixelBg: boolean;
  pixelChar: boolean;
  loading: boolean;
  error: string | null;
  obsMode?: boolean;
};

export function FemtanylStage({
  stageRef,
  bgRef,
  charRef,
  pixelBg,
  pixelChar,
  loading,
  error,
  obsMode = false,
}: Props) {
  return (
    <div
      className={
        obsMode ? "femtanyl-obs-wrap" : "femtanyl-stage-wrap"
      }
    >
      <div
        className={`femtanyl-stage${obsMode ? " femtanyl-stage--obs" : ""}`}
        ref={stageRef}
      >
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
        {(loading || error) && (
          <p className="femtanyl-loading" role="status">
            {error ?? "Loading sprites…"}
          </p>
        )}
      </div>
    </div>
  );
}
