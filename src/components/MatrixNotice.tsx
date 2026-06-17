import { useState } from "react";
import { Link } from "react-router-dom";

import { matrixNoticeCopy } from "../content/matrixContent";

const STORAGE_KEY = "solidified-matrix-notice-v1";

function loadDismissed(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function saveDismissed() {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function MatrixNotice() {
  const [open, setOpen] = useState(() => !loadDismissed());

  if (!open) return null;

  const dismiss = () => {
    saveDismissed();
    setOpen(false);
  };

  return (
    <div
      className="site-notice"
      role="dialog"
      aria-modal="true"
      aria-labelledby="matrix-notice-title"
    >
      <div className="site-notice__panel">
        <h2 id="matrix-notice-title" className="site-notice__title">
          {matrixNoticeCopy.title}
        </h2>
        <div className="site-notice__body">
          {matrixNoticeCopy.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="site-notice__actions">
          <Link to="/matrix" className="site-notice__btn site-notice__btn--ghost" onClick={dismiss}>
            {matrixNoticeCopy.learnMoreLabel}
          </Link>
          <button type="button" className="site-notice__btn" onClick={dismiss}>
            {matrixNoticeCopy.dismissLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
