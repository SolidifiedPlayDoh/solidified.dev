import { Link } from "react-router-dom";

import { AboutSections } from "./AboutSections";
import { GlitchReveal } from "./GlitchReveal";
import { homePageCopy } from "../content/hiContent";
import { SEO_HOME_DESCRIPTION, SEO_HOME_TITLE } from "../content/seo";
import { siteContent } from "../content/siteDefaults";
import { usePageMeta } from "../hooks/usePageMeta";

import { ProjectGrid } from "./ProjectGrid";
import { StoreShelf } from "./StoreShelf";

import "../styles/hi.css";

const linkIntel: Record<string, string> = {
  "/store": "link-store",
  "https://github.com/SolidifiedPlayDoh": "link-github",
  "https://www.youtube.com/@SolidifiedPlayDoh": "link-youtube",
};

export function HomePage() {
  usePageMeta({
    title: SEO_HOME_TITLE,
    description: SEO_HOME_DESCRIPTION,
    path: "/",
    themeColor: "#050508",
  });

  return (
    <div className="soft-site">
      <div className="soft-site__inner">
        <GlitchReveal variant="line" delay={0}>
          <hr className="soft-divider" aria-hidden />
        </GlitchReveal>

        <GlitchReveal variant="hero" delay={0}>
          <header data-intel="brand">
            <h1
              className="soft-brand scene-headline hi-page__headline glitch-idle"
              data-text={homePageCopy.headline}
            >
              {homePageCopy.headline}
            </h1>
          </header>
        </GlitchReveal>

        <GlitchReveal variant="block" delay={70}>
          <div data-intel="about">
            <AboutSections sections={homePageCopy.sections} />
          </div>
        </GlitchReveal>

        <GlitchReveal variant="block" delay={110}>
          <div className="hi-page__links">
            {siteContent.links.map((link, idx) => (
              <GlitchReveal key={link.href} variant="pill" delay={130 + idx * 45}>
                {link.href.startsWith("/") ? (
                  <Link
                    to={link.href}
                    className="soft-pill"
                    data-intel={linkIntel[link.href]}
                  >
                    <span className="soft-pill__dot" aria-hidden />
                    <span className="soft-pill__label">{link.label}</span>
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className="soft-pill"
                    data-intel={linkIntel[link.href]}
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

        <GlitchReveal variant="line" delay={220}>
          <hr className="soft-divider soft-divider--thick" aria-hidden />
        </GlitchReveal>

        <StoreShelf revealDelay={250} />

        <ProjectGrid revealDelay={320} />
      </div>
    </div>
  );
}
