import type { ReactNode } from "react";

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
    <GlitchReveal variant="hero" delay={40}>
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
          {secondaryNav ? <div className="store-product-hero__extra">{secondaryNav}</div> : null}
          <div className="store-product-hero__purchase">
            <span className="store-product-hero__price">{product.priceLabel}</span>
            <div className="store-product-hero__actions">{actions}</div>
          </div>
        </div>
      </header>
    </GlitchReveal>
  );
}
