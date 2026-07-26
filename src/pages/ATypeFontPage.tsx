import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";

import { GlitchReveal } from "../components/GlitchReveal";
import { SiteShell } from "../components/SiteShell";
import { StoreProductHero } from "../components/StoreProductHero";
import {
  atypeHub,
  getATypeFont,
  getGlyphKindsForFont,
} from "../content/atypeContent";
import { getStoreProductByPath } from "../content/storeContent";
import { usePageMeta } from "../hooks/usePageMeta";

import "../styles/atype.css";
import "../styles/store.css";

export function ATypeFontPage() {
  const { slug = "" } = useParams();
  const font = getATypeFont(slug);
  const product = font ? getStoreProductByPath(`/store/atype/${font.slug}`) : undefined;
  const [live, setLive] = useState(font?.preview ?? "POLYCORIA");

  const meta = useMemo(
    () =>
      font
        ? {
            title: `${font.name} | Store | Solidified.dev`,
            description: font.description,
            path: `/store/atype/${font.slug}`,
            themeColor: "#080506",
          }
        : {
            title: "Store | Solidified.dev",
            description: "Font not found.",
            path: "/store",
            themeColor: "#080506",
          },
    [font],
  );

  usePageMeta(meta);

  if (!font || !product) {
    return <Navigate to="/store" replace />;
  }

  const glyphKinds = getGlyphKindsForFont(font);

  return (
    <SiteShell>
      <main id="main" className="soft-site atype-page">
        <div className="soft-site__inner">
          <StoreProductHero
            product={product}
            preview={
              <span
                className="store-product-hero__font-preview"
                style={{ fontFamily: `"${font.family}", sans-serif` }}
              >
                {font.preview}
              </span>
            }
            secondaryNav={
              <Link to="/store?tag=AType" className="soft-pill">
                <span className="soft-pill__label">Browse #AType</span>
              </Link>
            }
            actions={
              <>
                <a
                  className="store-download__button"
                  href={font.filePath}
                  download={font.fileName}
                >
                  Download .ttf
                </a>
                <a
                  className="store-product-hero__secondary"
                  href={font.filePath}
                  target="_blank"
                  rel="noreferrer"
                >
                  Preview file
                </a>
              </>
            }
          />
          <p className="atype-filemeta store-product-filemeta">{font.fileName}</p>

          <GlitchReveal variant="block" delay={260}>
            <section className="atype-section scene-panel" aria-labelledby="atype-try">
              <h2 id="atype-try" className="scene-panel__title">
                Try it out
              </h2>
              <label className="atype-try__label" htmlFor="atype-live">
                Type something
              </label>
              <textarea
                id="atype-live"
                className="atype-try__input"
                spellCheck={false}
                value={live}
                onChange={(e) => setLive(e.target.value)}
                rows={3}
                style={{ fontFamily: `"${font.family}", sans-serif` }}
              />
              <p
                className="atype-try__preview"
                style={{ fontFamily: `"${font.family}", sans-serif` }}
              >
                {live || " "}
              </p>
              <p className="atype-try__alphabet" style={{ fontFamily: `"${font.family}", sans-serif` }}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
              </p>
              {font.tryExtras && (
                <p className="atype-try__alphabet atype-try__alphabet--dim" style={{ fontFamily: `"${font.family}", sans-serif` }}>
                  {font.tryExtras}
                </p>
              )}
            </section>
          </GlitchReveal>

          <GlitchReveal variant="block" delay={360}>
            <section className="atype-section scene-panel" aria-labelledby="atype-howto-font">
              <h2 id="atype-howto-font" className="scene-panel__title">
                {atypeHub.howToTitle}
              </h2>
              <p className="soft-body atype-section__lead">{atypeHub.howToLead}</p>

              <div className="atype-howto" role="table" aria-label="How to read AType glyphs">
                <div className="atype-howto__head" role="row">
                  <span role="columnheader">Looks like</span>
                  <span role="columnheader">Means</span>
                  <span role="columnheader">Examples</span>
                </div>
                {glyphKinds.map((kind) => (
                  <div key={kind.id} className="atype-howto__row" role="row">
                    <div className="atype-howto__sample" role="cell">
                      <span
                        className={`atype-sample atype-sample--${kind.kind}`}
                        style={{ fontFamily: `"${font.family}", sans-serif` }}
                        aria-hidden
                      >
                        {kind.sample}
                      </span>
                      <span className="atype-howto__label">{kind.title}</span>
                    </div>
                    <p className="atype-howto__meaning soft-body" role="cell">
                      {kind.meaning}
                    </p>
                    <p className="atype-howto__examples" role="cell">
                      {kind.examples}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </GlitchReveal>

          <GlitchReveal variant="block" delay={440}>
            <section className="atype-section scene-panel" aria-labelledby="atype-install">
              <h2 id="atype-install" className="scene-panel__title">
                Install
              </h2>
              <ol className="atype-install__steps">
                <li>Download the `.ttf` above.</li>
                <li>On macOS: double-click → Install Font.</li>
                <li>
                  In CSS:
                  <pre className="atype-code">{`@font-face {
  font-family: "${font.family}";
  src: url("${font.fileName}") format("truetype");
}`}</pre>
                </li>
              </ol>
            </section>
          </GlitchReveal>
        </div>
      </main>
    </SiteShell>
  );
}
