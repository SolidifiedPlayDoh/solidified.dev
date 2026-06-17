import { useSiteLite } from "../hooks/useSiteLite";
import { setSiteFxEnabled } from "../lib/siteFx";

export function SiteFxToggle() {
  const lite = useSiteLite();

  return (
    <p className="site-fx-toggle">
      <button
        type="button"
        className="site-fx-toggle__btn"
        onClick={() => {
          setSiteFxEnabled(lite);
          window.location.reload();
        }}
      >
        {lite ? "Enable visual effects" : "Use performance mode"}
      </button>
      <span className="site-fx-toggle__hint">
        {lite ? "Recommended on slower devices." : "Heavier animations are on."}
      </span>
    </p>
  );
}
