type Props = {
  message: string;
  progress: number;
};

export function FemtanylBootOverlay({ message, progress }: Props) {
  const pct = Math.round(progress * 100);

  return (
    <div className="femtanyl-boot" role="status" aria-live="polite" aria-busy="true">
      <div className="femtanyl-boot__panel">
        <p className="femtanyl-boot__label">Femtanyl render pipeline</p>
        <p className="femtanyl-boot__message">{message}</p>
        <div className="femtanyl-boot__bar" aria-hidden>
          <div
            className="femtanyl-boot__bar-fill"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="femtanyl-boot__pct">{pct}%</p>
      </div>
    </div>
  );
}
