import { Link } from "react-router-dom";

import { getRecentStoreProducts } from "../content/storeContent";

import { GlitchReveal } from "./GlitchReveal";
import { StoreTagPills } from "./StoreTagPills";

import "../styles/store.css";

type StoreShelfProps = {
  revealDelay?: number;
};

export function StoreShelf({ revealDelay = 0 }: StoreShelfProps) {
  const products = getRecentStoreProducts();

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="store-shelf" aria-labelledby="store-shelf-heading" data-intel="store-shelf">
      <GlitchReveal variant="hero" delay={revealDelay}>
        <div className="store-shelf__header">
          <h2
            id="store-shelf-heading"
            className="store-shelf__title soft-brand scene-headline"
            data-text="New in the store"
          >
            New in the store
          </h2>
          <Link to="/store" className="store-shelf__all soft-pill" data-intel="link-store">
            <span className="soft-pill__dot" aria-hidden />
            <span className="soft-pill__label">See all</span>
          </Link>
        </div>
      </GlitchReveal>

      <div className="store-shelf__viewport">
        <ul className="store-shelf__track" role="list">
          {products.map((product, idx) => (
            <li key={product.slug} className="store-shelf__item">
              <GlitchReveal variant="card" delay={revealDelay + 100 + idx * 90}>
                <article
                  className="store-shelf-card"
                  data-intel={
                    product.slug === "stillweb"
                      ? "product-stillweb"
                      : product.slug.includes("extended")
                        ? "product-atype-extended"
                        : product.slug.startsWith("atype-")
                          ? "product-atype-circles"
                          : undefined
                  }
                >
                  <span className="store-shelf-card__glow" aria-hidden />
                  <div className="store-shelf-card__face">
                    {product.isNew && (
                      <span className="store-shelf-card__badge">New</span>
                    )}
                    <Link to={product.path} className="store-shelf-card__product-link">
                      <span className="store-shelf-card__emoji" aria-hidden>
                        {product.emoji}
                      </span>
                      <span className="store-shelf-card__name">{product.name}</span>
                      <span className="store-shelf-card__tagline">{product.tagline}</span>
                    </Link>
                    <div className="store-shelf-card__meta">
                      <span className="store-shelf-card__price">{product.priceLabel}</span>
                      <StoreTagPills tags={product.tags.slice(0, 2)} compact />
                    </div>
                  </div>
                </article>
              </GlitchReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
