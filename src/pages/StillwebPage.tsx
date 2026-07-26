import { useEffect, useState } from "react";

import { GlitchReveal } from "../components/GlitchReveal";
import { SiteShell } from "../components/SiteShell";
import { StoreProductHero } from "../components/StoreProductHero";
import {
  fetchLatestRelease,
  stillwebProduct,
  stillwebPageCopy,
  type GithubReleaseInfo,
} from "../content/storeContent";
import { usePageMeta } from "../hooks/usePageMeta";

import "../styles/store.css";

const product = stillwebProduct;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function StillwebPage() {
  const [release, setRelease] = useState<GithubReleaseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: "StillWeb | Store | Solidified.dev",
    description:
      "Download StillWeb. Free Chrome ad blocker.",
    path: "/store/stillweb",
    themeColor: "#080506",
  });

  useEffect(() => {
    let active = true;

    fetchLatestRelease(product.githubRepo, product.releaseAssetName).then((info) => {
      if (active) {
        setRelease(info);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <SiteShell>
      <main id="main" className="soft-site store-page store-detail">
        <div className="soft-site__inner">
          <StoreProductHero
            product={product}
            actions={
              loading ? (
                <span className="store-download__status">Checking latest release…</span>
              ) : release ? (
                <a
                  href={release.downloadUrl}
                  className="store-download__button"
                  rel="noopener noreferrer"
                >
                  Download {release.version}
                </a>
              ) : (
                <a
                  href={`https://github.com/${product.githubRepo}/releases`}
                  className="store-download__button"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View downloads
                </a>
              )
            }
          />
          {release && (
            <p className="store-product-filemeta">
              Released {formatDate(release.publishedAt)} · Chrome / Edge / Brave
            </p>
          )}

          <GlitchReveal variant="block" delay={240}>
            <section className="store-section" aria-labelledby="stillweb-features">
              <h2 id="stillweb-features" className="store-section__title">
                Features
              </h2>
              <ul className="store-feature-list">
                {stillwebPageCopy.features.map((feature) => (
                  <li key={feature.title} className="store-feature-list__item">
                    <h3>{feature.title}</h3>
                    <p className="soft-body">{feature.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          </GlitchReveal>

          <GlitchReveal variant="block" delay={320}>
            <section className="store-section" aria-labelledby="stillweb-install">
              <h2 id="stillweb-install" className="store-section__title">
                Setup
              </h2>
              <p className="soft-body store-section__body">{stillwebPageCopy.installReality.body}</p>
              <ol className="store-steps">
                {stillwebPageCopy.installSteps.map((step, idx) => (
                  <li key={step.title} className="store-steps__item">
                    <span className="store-steps__num">{idx + 1}</span>
                    <div>
                      <h3 className="store-steps__title">{step.title}</h3>
                      <p className="soft-body store-steps__body">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </GlitchReveal>

          <GlitchReveal variant="block" delay={400}>
            <section className="store-section" aria-labelledby="stillweb-about">
              <h2 id="stillweb-about" className="store-section__title">
                Notes
              </h2>
              {stillwebPageCopy.about.map((paragraph) => (
                <p key={paragraph} className="soft-body store-section__body">
                  {paragraph}
                </p>
              ))}
            </section>
          </GlitchReveal>
        </div>
      </main>
    </SiteShell>
  );
}
