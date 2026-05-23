type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function FemtanylWatchDisclaimer({ open, onCancel, onConfirm }: Props) {
  if (!open) return null;

  return (
    <div className="femtanyl-watch-modal" role="dialog" aria-modal="true" aria-labelledby="watch-disclaimer-title">
      <div className="femtanyl-watch-modal__panel">
        <h2 id="watch-disclaimer-title" className="femtanyl-watch-modal__title">
          Watch full chart playback
        </h2>
        <div className="femtanyl-watch-modal__body">
          <p>
            <strong>Asset disclaimer:</strong> I do <strong>not</strong> own any of the art, music,
            charts, shaders, or other assets from the Femtanyl Friday Night Funkin&apos; mod. Those
            belong to the mod&apos;s creators. I only built this page as a{" "}
            <strong>web-based viewer / tool</strong> for FNF mod content — not an official port or
            reimplementation of the game.
          </p>
          <p>
            Playback uses the mod&apos;s chart timing and instrumental audio synced to sprite
            animations. There is no gameplay input — watch only. Flashing visuals may still appear.
          </p>
        </div>
        <div className="femtanyl-watch-modal__actions">
          <button type="button" className="femtanyl-btn femtanyl-btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="femtanyl-btn" onClick={onConfirm}>
            I understand — play chart
          </button>
        </div>
      </div>
    </div>
  );
}
