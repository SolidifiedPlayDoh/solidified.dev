import { Link } from "react-router-dom";

import { AboutSections } from "./AboutSections";
import { GlitchReveal } from "./GlitchReveal";
import { MatrixNotice } from "./MatrixNotice";
import { homePageCopy } from "../content/hiContent";
import { siteContent } from "../content/siteDefaults";

import { ProjectGrid } from "./ProjectGrid";
import { StoreShelf } from "./StoreShelf";

import "../styles/hi.css";

export function HomePage() {
  return (
    <div className="soft-site">
      <MatrixNotice />
      <div className="soft-site__inner">
        <GlitchReveal variant="line" delay={0}>
          <hr className="soft-divider" aria-hidden />
        </GlitchReveal>

        <GlitchReveal variant="hero" delay={90}>
          <header>
            <h1
              className="soft-brand scene-headline hi-page__headline"
              data-text={homePageCopy.headline}
            >
              {homePageCopy.headline}
            </h1>
          </header>
        </GlitchReveal>

        <GlitchReveal variant="block" delay={200}>
          <AboutSections sections={homePageCopy.sections} />
        </GlitchReveal>

        <GlitchReveal variant="block" delay={320}>
          <div className="hi-page__links">
            {siteContent.links.map((link, idx) => (
              <GlitchReveal key={link.href} variant="pill" delay={380 + idx * 70}>
                {link.href.startsWith("/") ? (
                  <Link to={link.href} className="soft-pill">
                    <span className="soft-pill__dot" aria-hidden />
                    <span className="soft-pill__label">{link.label}</span>
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="soft-pill"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="soft-pill__dot" aria-hidden />
                    <span className="soft-pill__label">{link.label}</span>
                  </a>
                )}
              </GlitchReveal>
            ))}
          </div>
        </GlitchReveal>

        <GlitchReveal variant="line" delay={480}>
          <hr className="soft-divider soft-divider--thick" aria-hidden />
        </GlitchReveal>

        <StoreShelf revealDelay={520} />

        <ProjectGrid revealDelay={640} />
      </div>
    </div>
  );
}
