import { Link } from "react-router-dom";

import { AboutSections } from "../components/AboutSections";
import { GlitchReveal } from "../components/GlitchReveal";
import { SiteShell } from "../components/SiteShell";
import { hiPageCopy } from "../content/hiContent";
import { siteContent } from "../content/siteDefaults";
import { usePageMeta } from "../hooks/usePageMeta";

import "../styles/hi.css";

export function HiPage() {
  usePageMeta({
    title: "Hi | Solidified.dev",
    description:
      "hello!! im SolidifiedPlayDoh — welcome to my corner of the internet >w<",
    path: "/hi",
    themeColor: "#14061f",
  });

  return (
    <SiteShell>
      <main id="main" className="soft-site hi-page hi-page--short">
        <div className="soft-site__inner">
          <GlitchReveal variant="hero" delay={60}>
            <header>
              <h1
                className="soft-brand scene-headline hi-page__headline"
                data-text={hiPageCopy.headline}
              >
                {hiPageCopy.headline}
              </h1>
            </header>
          </GlitchReveal>

          <GlitchReveal variant="block" delay={180}>
            <AboutSections sections={hiPageCopy.sections} />
          </GlitchReveal>

          <div className="hi-page__links">
            <GlitchReveal variant="pill" delay={300}>
              <Link to="/" className="soft-pill">
                <span className="soft-pill__dot" aria-hidden />
                <span className="soft-pill__label">{hiPageCopy.moreAboutLabel}</span>
              </Link>
            </GlitchReveal>
            {siteContent.links.map((link, idx) => (
              <GlitchReveal key={link.href} variant="pill" delay={360 + idx * 70}>
                <a
                  href={link.href}
                  className="soft-pill"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="soft-pill__dot" aria-hidden />
                  <span className="soft-pill__label">{link.label}</span>
                </a>
              </GlitchReveal>
            ))}
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
