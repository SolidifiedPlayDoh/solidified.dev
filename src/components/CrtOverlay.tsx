type CrtOverlayProps = {
  animateScanlines: boolean;
};

export function CrtOverlay({ animateScanlines }: CrtOverlayProps) {
  return (
    <div className="crt-shell" aria-hidden="true">
      <div
        className={
          animateScanlines ? "crt-scan crt-scan--animate" : "crt-scan"
        }
      />
      <div className="crt-vignette" />
      <div className="crt-noise" />
    </div>
  );
}
