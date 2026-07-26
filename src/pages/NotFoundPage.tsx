import { useEffect } from "react";
import { Link } from "react-router-dom";

import "../styles/notfound.css";

export function NotFoundPage() {
  useEffect(() => {
    document.body.classList.add("phase-404");
    return () => document.body.classList.remove("phase-404");
  }, []);

  return (
    <div className="nf">
      <div className="nf__field" aria-hidden>
        <div className="nf__heat" />
        <div className="nf__scan" />
        <div className="nf__sweep" />
        <div className="nf__vignette" />
      </div>

      <div className="nf__frame" aria-hidden />

      <main id="main" className="nf__stage">
        <div className="nf__reticle" aria-hidden />
        <p className="nf__stamp">UNMAPPED</p>
        <h1 className="nf__code">404</h1>
        <p className="nf__title">Page not found</p>
        <p className="nf__lead">This path isn’t on the map. Head back to known ground.</p>
        <Link className="nf__cta" to="/">
          <span className="nf__cta-mark" aria-hidden>
            ▸
          </span>
          Return home
        </Link>
      </main>
    </div>
  );
}
