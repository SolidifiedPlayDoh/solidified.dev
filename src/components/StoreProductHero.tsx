import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import type { StoreProduct } from "../content/storeContent";

import { GlitchReveal } from "./GlitchReveal";
import { StoreTagPills } from "./StoreTagPills";

type StoreProductHeroProps = {
  product: StoreProduct;
  actions: ReactNode;
  preview?: ReactNode;
  secondaryNav?: ReactNode;
};

export function StoreProductHero({
  product,
  actions,
  preview,
  secondaryNav,
}: StoreProductHeroProps) {
  return (
    <>
      <GlitchReveal variant="pill" delay={40}>
        <nav className="store-page__top store-page__top--split" aria-label="Product navigation">
          <Link to="/store" className="soft-pill">
            <span className="soft-pill__dot" aria-hidden />
            <span className="soft-pill__label">← store</span>
          </Link>
          <div className="store-detail__nav-end">
            {secondaryNav}
            <span className="store-detail__badge">{product.priceLabel}</span>
          </div>
        </nav>
      </GlitchReveal>

      <GlitchReveal variant="line" delay={100}>
        <hr className="soft-divider" aria-hidden />
      </GlitchReveal>

      <GlitchReveal variant="hero" delay={160}>
        <header className="store-product-hero">
          <div className="store-product-hero__visual">
            {preview ?? (
              <span className="store-product-hero__icon" aria-hidden>
                {product.emoji}
              </span>
            )}
          </div>
          <div className="store-product-hero__info">
            <h1
              className="soft-brand scene-headline store-page__headline"
              data-text={product.name}
            >
              {product.name}
            </h1>
            <p className="store-product-hero__tagline">{product.tagline}</p>
            {product.description && (
              <p className="soft-body store-product-hero__description">{product.description}</p>
            )}
            <StoreTagPills tags={product.tags} />
            <div className="store-product-hero__purchase">
              <span className="store-product-hero__price">{product.priceLabel}</span>
              <div className="store-product-hero__actions">{actions}</div>
            </div>
          </div>
        </header>
      </GlitchReveal>
    </>
  );
}
