import { Link, useSearchParams } from "react-router-dom";

import { GlitchReveal } from "../components/GlitchReveal";
import { SiteShell } from "../components/SiteShell";
import { StoreTagPills } from "../components/StoreTagPills";
import { storePageCopy, storeProducts } from "../content/storeContent";
import { usePageMeta } from "../hooks/usePageMeta";

import "../styles/store.css";

export function StorePage() {
  const [searchParams] = useSearchParams();
  const storeTags = Array.from(new Set(storeProducts.flatMap((product) => product.tags)));
  const requestedTag = searchParams.get("tag");
  const activeTag =
    storeTags.find((tag) => tag.toLowerCase() === requestedTag?.toLowerCase()) ?? null;
  const visibleProducts = activeTag
    ? storeProducts.filter((product) => product.tags.includes(activeTag))
    : storeProducts;

  usePageMeta({
    title: "Store | Solidified.dev",
    description: "Download free tools, extensions, and fonts from Solidified.dev.",
    path: "/store",
    themeColor: "#080506",
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
              {storePageCopy.lead ? (
                <p className="soft-lead store-page__lead">{storePageCopy.lead}</p>
              ) : null}
            </header>
          </GlitchReveal>

          <GlitchReveal variant="block" delay={220}>
            <section className="store-catalog" aria-labelledby="store-catalog-title">
              <div className="store-catalog__heading">
                <h2 id="store-catalog-title" className="store-catalog__title">
                  {activeTag ? `#${activeTag}` : "All"}
                </h2>
                <span className="store-catalog__count">{visibleProducts.length}</span>
              </div>
              <div className="store-catalog__filters" aria-label="Filter products">
                <Link
                  to="/store"
                  className={
                    activeTag ? "store-tag-pill" : "store-tag-pill store-tag-pill--active"
                  }
                  aria-current={activeTag ? undefined : "page"}
                >
                  All
                </Link>
                <StoreTagPills tags={storeTags} activeTag={activeTag} />
              </div>
            </section>
          </GlitchReveal>

          <ul className="store-grid" aria-live="polite">
            {visibleProducts.map((product, idx) => (
              <li key={product.slug}>
                <GlitchReveal variant="card" delay={260 + idx * 100}>
                  <article className="store-card">
                    <span className="store-card__glow" aria-hidden />
                    <div className="store-card__face">
                      <Link to={product.path} className="store-card__product-link">
                        <span className="store-card__row">
                          <span className="store-card__emoji" aria-hidden>
                            {product.emoji}
                          </span>
                          <span className="store-card__price">{product.priceLabel}</span>
                        </span>
                        <span className="store-card__name">{product.name}</span>
                        <span className="store-card__tagline">{product.tagline}</span>
                        <span className="store-card__desc">{product.description}</span>
                        <span className="store-card__cta">Open →</span>
                      </Link>
                      <StoreTagPills tags={product.tags} compact />
                    </div>
                  </article>
                </GlitchReveal>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </SiteShell>
  );
}
