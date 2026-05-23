import { type ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";

import { loadEpilepsySkipped, saveEpilepsySkipped } from "./storage";

type Props = {
  children: ReactNode;
  onAccept: () => void;
};

export function EpilepsyGate({ children, onAccept }: Props) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(loadEpilepsySkipped);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (dismissed) {
    return <>{children}</>;
  }

  const accept = () => {
    if (dontShowAgain) saveEpilepsySkipped();
    setDismissed(true);
    onAccept();
  };

  const retreat = () => {
    navigate("/");
  };

  return (
    <>
      <div className="femtanyl-epilepsy-backdrop" aria-hidden />
      <div
        className="femtanyl-epilepsy-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="femtanyl-epilepsy-title"
        aria-describedby="femtanyl-epilepsy-desc"
      >
        <h2 id="femtanyl-epilepsy-title" className="femtanyl-epilepsy-dialog__title">
          Photosensitivity / epilepsy warning
        </h2>
        <p id="femtanyl-epilepsy-desc" className="femtanyl-epilepsy-dialog__body">
          This entire page uses rapidly changing colors, flashing patterns, and high-contrast
          motion (including shader backgrounds). It may trigger seizures or discomfort in people
          with photosensitive epilepsy or similar conditions.
        </p>
        <p className="femtanyl-epilepsy-dialog__body femtanyl-epilepsy-dialog__body--muted">
          If you are sensitive to flashing visuals, use &ldquo;RETREAT, ME LADS!!!&rdquo; to return
          home. Otherwise confirm below to continue.
        </p>

        <label className="femtanyl-epilepsy-dialog__check">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          Do not show again
        </label>

        <div className="femtanyl-epilepsy-dialog__actions">
          <button type="button" className="femtanyl-btn femtanyl-btn--primary" onClick={accept}>
            I&apos;m good
          </button>
          <button
            type="button"
            className="femtanyl-btn femtanyl-btn--retreat"
            onClick={retreat}
          >
            RETREAT, ME LADS!!!
          </button>
        </div>
      </div>
    </>
  );
}
