import { Link } from "react-router-dom";

import { GlitchReveal } from "../components/GlitchReveal";
import { SiteShell } from "../components/SiteShell";
import { matrixHomeserver, matrixPageCopy } from "../content/matrixContent";
import { usePageMeta } from "../hooks/usePageMeta";

import "../styles/matrix.css";

export function MatrixPage() {
  usePageMeta({
    title: "Matrix | Solidified.dev",
    description: "What Matrix is and how to join the solidified.dev homeserver.",
    path: "/matrix",
    themeColor: "#14061f",
  });

  return (
    <SiteShell>
      <main id="main" className="soft-site matrix-page">
        <div className="soft-site__inner">
          <GlitchReveal variant="pill" delay={40}>
            <nav className="matrix-page__top">
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
                className="soft-brand scene-headline matrix-page__headline"
                data-text={matrixPageCopy.headline}
              >
                {matrixPageCopy.headline}
              </h1>
              <p className="soft-lead matrix-page__lead">{matrixPageCopy.lead}</p>
            </header>
          </GlitchReveal>

          {matrixPageCopy.sections.map((section, idx) => (
            <GlitchReveal key={section.id} variant="block" delay={260 + idx * 100}>
              <section className="matrix-section" aria-labelledby={`matrix-${section.id}`}>
                <h2 id={`matrix-${section.id}`} className="matrix-section__title">
                  {section.title}
                </h2>
                {"body" in section &&
                  section.body?.map((paragraph) => (
                    <p key={paragraph} className="soft-body matrix-section__body">
                      {paragraph}
                    </p>
                  ))}
                {"homeserver" in section && section.homeserver && (
                  <p className="matrix-homeserver">
                    <span className="matrix-homeserver__label">Homeserver</span>
                    <a href={section.homeserver} className="matrix-homeserver__url">
                      {section.homeserver}
                    </a>
                  </p>
                )}
                {"steps" in section && section.steps && (
                  <ol className="matrix-steps">
                    {section.steps.map((step, stepIdx) => (
                      <li key={step.title} className="matrix-steps__item">
                        <span className="matrix-steps__num">{stepIdx + 1}</span>
                        <div>
                          <h3 className="matrix-steps__title">{step.title}</h3>
                          <p className="soft-body matrix-steps__body">{step.body}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
                {"links" in section && section.links && (
                  <div className="matrix-section__links">
                    {section.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="soft-pill"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <span className="soft-pill__dot" aria-hidden />
                        <span className="soft-pill__label">{link.label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </section>
            </GlitchReveal>
          ))}

          <GlitchReveal variant="block" delay={720}>
            <footer className="matrix-page__cta">
              <a href={matrixHomeserver} className="soft-pill">
                <span className="soft-pill__dot" aria-hidden />
                <span className="soft-pill__label">Open {matrixHomeserver}</span>
              </a>
            </footer>
          </GlitchReveal>
        </div>
      </main>
    </SiteShell>
  );
}
