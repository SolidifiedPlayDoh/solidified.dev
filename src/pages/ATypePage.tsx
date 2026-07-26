import { Link } from "react-router-dom";

import { GlitchReveal } from "../components/GlitchReveal";
import { SiteShell } from "../components/SiteShell";
import { atypeFonts, atypeHub } from "../content/atypeContent";
import { usePageMeta } from "../hooks/usePageMeta";

import "../styles/atype.css";

export function ATypePage() {
  usePageMeta({
    title: "AType | Solidified.dev",
    description: "Choose an AType font.",
    path: "/atype",
    themeColor: "#080506",
  });

  return (
    <SiteShell>
      <main id="main" className="soft-site atype-page">
        <div className="soft-site__inner">
          <GlitchReveal variant="pill" delay={40}>
            <nav className="atype-page__top">
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
                className="soft-brand scene-headline atype-page__headline"
                data-text={atypeHub.headline}
              >
                {atypeHub.headline}
              </h1>
              <p className="soft-lead atype-page__lead">{atypeHub.lead}</p>
            </header>
          </GlitchReveal>

          <section className="atype-picker" aria-labelledby="atype-pick">
            <GlitchReveal variant="hero" delay={220}>
              <h2 id="atype-pick" className="atype-picker__title">
                Choose a font
              </h2>
            </GlitchReveal>

            <ul className="atype-cards">
              {atypeFonts.map((font, idx) => (
                <li key={font.slug}>
                  <GlitchReveal variant="card" delay={280 + idx * 90}>
                    <Link
                      to={`/store/atype/${font.slug}`}
                      className="atype-card soft-project-card"
                    >
                      <span className="soft-project-card__glow" aria-hidden />
                      <span className="atype-card__face soft-project-card__face">
                        <span
                          className="atype-card__preview"
                          style={{ fontFamily: `"${font.family}", sans-serif` }}
                        >
                          {font.preview}
                        </span>
                        <span className="soft-project-card__name">{font.name}</span>
                        <span className="soft-project-card__desc">{font.tagline}</span>
                        <span className="soft-project-card__tags">
                          {font.features.join(" · ")}
                        </span>
                        <span className="atype-card__cta">Open →</span>
                      </span>
                    </Link>
                  </GlitchReveal>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
