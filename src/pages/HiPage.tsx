import { Link, useLocation } from "react-router-dom";

import { GlitchReveal } from "../components/GlitchReveal";
import { SiteShell } from "../components/SiteShell";
import { hiPageCopy, resolveHiSource } from "../content/hiContent";
import { usePageMeta } from "../hooks/usePageMeta";

import "../styles/hi.css";

export function HiPage() {
  const { hash } = useLocation();
  const source = resolveHiSource(hash);

  usePageMeta({
    title: "hi | Solidified.dev",
    description: source.found,
    path: "/hi",
    themeColor: "#050508",
  });

  return (
    <SiteShell>
      <main id="main" className="hi-door">
        <div className="hi-door__inner">
          <GlitchReveal variant="line" delay={0}>
            <p className="hi-door__stamp">{source.stamp}</p>
          </GlitchReveal>

          <GlitchReveal variant="hero" delay={40}>
            <h1
              className="hi-door__brand scene-headline glitch-idle"
              data-text={hiPageCopy.brand}
            >
              {hiPageCopy.brand}
            </h1>
          </GlitchReveal>

          <GlitchReveal variant="block" delay={100}>
            <p className="hi-door__lead">{hiPageCopy.lead}</p>
          </GlitchReveal>

          <GlitchReveal variant="block" delay={140}>
            <p className="hi-door__found">{source.found}</p>
          </GlitchReveal>

          <GlitchReveal variant="block" delay={180}>
            <p className="hi-door__body">{hiPageCopy.body}</p>
          </GlitchReveal>

          <GlitchReveal variant="pill" delay={220}>
            <Link to={hiPageCopy.ctaHome} className="hi-door__cta">
              {hiPageCopy.cta}
            </Link>
          </GlitchReveal>
        </div>
      </main>
    </SiteShell>
  );
}
