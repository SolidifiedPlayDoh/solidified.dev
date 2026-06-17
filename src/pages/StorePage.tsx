import { Link } from "react-router-dom";

import { GlitchReveal } from "../components/GlitchReveal";
import { SiteShell } from "../components/SiteShell";
import { storePageCopy, storeProducts } from "../content/storeContent";
import { usePageMeta } from "../hooks/usePageMeta";

import "../styles/store.css";

export function StorePage() {
  usePageMeta({
    title: "Store | Solidified.dev",
    description: "Download free tools and extensions from Solidified.dev.",
    path: "/store",
    themeColor: "#14061f",
  });

  return (
    <SiteShell>
      <main id="main" className="soft-site store-page">
        <div className="soft-site__inner">
          <GlitchReveal variant="pill" delay={40}>
            <nav className="store-page__top">
              <Link to="/" className="soft-pill">
                <span className="soft-pill__dot" aria-hidden />
                <span className="soft-pill__label">← home</span>
              </Link>
            </nav>
          </GlitchReveal>

          <GlitchReveal variant="line" delay={100}>
            <hr className="soft-divider" aria-hidden />
          </GlitchReveal>

          <GlitchReveal variant="hero" delay={160}>
            <header>
              <h1
                className="soft-brand scene-headline store-page__headline"
                data-text={storePageCopy.headline}
              >
                {storePageCopy.headline}
              </h1>
              <p className="soft-lead store-page__lead">{storePageCopy.lead}</p>
            </header>
          </GlitchReveal>

          <ul className="store-grid">
            {storeProducts.map((product, idx) => (
              <li key={product.slug}>
                <GlitchReveal variant="card" delay={260 + idx * 100}>
                  <Link to={product.path} className="store-card">
                    <span className="store-card__glow" aria-hidden />
                    <span className="store-card__face">
                      <span className="store-card__row">
                        <span className="store-card__emoji" aria-hidden>
                          {product.emoji}
                        </span>
                        <span className="store-card__price">{product.priceLabel}</span>
                      </span>
                      <span className="store-card__name">{product.name}</span>
                      <span className="store-card__tagline">{product.tagline}</span>
                      <span className="store-card__desc">{product.description}</span>
                      <span className="store-card__tags">{product.tags.join(" · ")}</span>
                    </span>
                  </Link>
                </GlitchReveal>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </SiteShell>
  );
}
