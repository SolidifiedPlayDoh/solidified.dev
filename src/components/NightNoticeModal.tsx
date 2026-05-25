type Props = {
  open: boolean;
  onDismiss: () => void;
};

export function NightNoticeModal({ open, onDismiss }: Props) {
  if (!open) return null;

  return (
    <div
      className="site-notice"
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-notice-title"
    >
      <div className="site-notice__panel">
        <h2 id="site-notice-title" className="site-notice__title">
          Quick note about /night
        </h2>
        <div className="site-notice__body">
          <p>
            If you had an old <strong>/night</strong> link, it doesn&apos;t go anywhere useful
            anymore. I removed it after someone spammed invites and abused the redirect — sorry
            if that caused confusion or pinged you at a weird time.
          </p>
          <p>
            The rest of the site is unchanged. Thanks for understanding.
          </p>
        </div>
        <button type="button" className="site-notice__btn" onClick={onDismiss}>
          Got it
        </button>
      </div>
    </div>
  );
}
