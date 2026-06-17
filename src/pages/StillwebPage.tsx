import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { GlitchReveal } from "../components/GlitchReveal";
import { SiteShell } from "../components/SiteShell";
import {
  fetchLatestRelease,
  stillwebPageCopy,
  storeProducts,
  type GithubReleaseInfo,
} from "../content/storeContent";
import { usePageMeta } from "../hooks/usePageMeta";

import "../styles/store.css";

const product = storeProducts.find((entry) => entry.slug === "stillweb")!;

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
      "Download StillWeb — a free Chrome ad blocker that just works. No account, no paywall.",
    path: "/store/stillweb",
    themeColor: "#14061f",
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
          <GlitchReveal variant="pill" delay={40}>
            <nav className="store-page__top store-page__top--split">
              <Link to="/store" className="soft-pill">
                <span className="soft-pill__dot" aria-hidden />
                <span className="soft-pill__label">← store</span>
              </Link>
              <span className="store-detail__badge">Free forever</span>
            </nav>
          </GlitchReveal>

          <GlitchReveal variant="line" delay={100}>
            <hr className="soft-divider" aria-hidden />
          </GlitchReveal>

          <GlitchReveal variant="hero" delay={160}>
            <header className="store-detail__hero">
              <span className="store-detail__icon" aria-hidden>
                {product.emoji}
              </span>
              <div>
                <h1
                  className="soft-brand scene-headline store-page__headline"
                  data-text={stillwebPageCopy.headline}
                >
                  {stillwebPageCopy.headline}
                </h1>
                <p className="soft-lead store-page__lead">{stillwebPageCopy.lead}</p>
              </div>
            </header>
          </GlitchReveal>

          <GlitchReveal variant="block" delay={240}>
            <section className="store-section store-install" aria-labelledby="stillweb-install-info">
              <h2 id="stillweb-install-info" className="store-section__title">
                {stillwebPageCopy.installReality.title}
              </h2>
              <p className="soft-body store-section__body">{stillwebPageCopy.installReality.body}</p>
              <p className="soft-body store-section__body store-callout__note">
                {stillwebPageCopy.installReality.footnote}
              </p>
            </section>
          </GlitchReveal>

          <GlitchReveal variant="block" delay={300}>
            <section
              className="store-section store-download"
              aria-labelledby="stillweb-download"
            >
              <h2 id="stillweb-download" className="store-section__title">
                {stillwebPageCopy.downloadTitle}
              </h2>
              <p className="soft-body store-section__body">
                {stillwebPageCopy.downloadLead}
              </p>

              <div className="store-download__actions">
                {loading ? (
                  <span className="store-download__status">Checking for latest release…</span>
                ) : release ? (
                  <>
                    <a
                      href={release.downloadUrl}
                      className="store-download__button"
                      rel="noopener noreferrer"
                    >
                      Download {release.version} (.zip)
                    </a>
                    <p className="store-download__meta">
                      Released {formatDate(release.publishedAt)} · Chrome / Edge / Brave
                    </p>
                  </>
                ) : (
                  <p className="store-download__status">
                    Release not found yet. Check{" "}
                    <a
                      href={`https://github.com/${product.githubRepo}/releases`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      GitHub releases
                    </a>
                    .
                  </p>
                )}
              </div>
            </section>
          </GlitchReveal>

          {stillwebPageCopy.intro.map((paragraph) => (
            <GlitchReveal key={paragraph} variant="block" delay={320}>
              <p className="soft-body store-detail__intro">{paragraph}</p>
            </GlitchReveal>
          ))}

          <GlitchReveal variant="block" delay={380}>
            <section className="store-section" aria-labelledby="stillweb-features">
              <h2 id="stillweb-features" className="store-section__title">
                What it does
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

          <GlitchReveal variant="block" delay={440}>
            <section className="store-section" aria-labelledby="stillweb-install">
              <h2 id="stillweb-install" className="store-section__title">
                Quick setup
              </h2>
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

          <GlitchReveal variant="block" delay={500}>
            <section className="store-section" aria-labelledby="stillweb-about">
              <h2 id="stillweb-about" className="store-section__title">
                Why I made this
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
