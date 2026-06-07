import { Link } from "react-router-dom";
import { useEffect } from "react";

import { ProjectGrid } from "../components/ProjectGrid";
import { CrtOverlay } from "../components/CrtOverlay";
import { hiPageCopy } from "../content/hiContent";
import { siteContent } from "../content/siteDefaults";
import { usePageMeta } from "../hooks/usePageMeta";

import "../styles/hi.css";

export function HiPage() {
  usePageMeta({
    title: "Hi | Solidified.dev",
    description:
      "hello!! im SolidifiedPlayDoh — vibecoder, AI wrangler, hardware hacker. welcome to my corner of the internet >w<",
    path: "/hi",
    themeColor: "#12081f",
  });

  useEffect(() => {
    document.body.classList.add("phase-site");
    return () => document.body.classList.remove("phase-site");
  }, []);

  return (
    <>
      <CrtOverlay animateScanlines />
      <div className="soft-site hi-page">
        <div className="soft-site__inner">
          <nav className="hi-page__top" aria-label="Page links">
            <Link to="/" className="soft-pill">
              <span className="soft-pill__dot" aria-hidden />
              <span className="soft-pill__label">← home</span>
            </Link>
          </nav>

          <hr className="soft-divider" aria-hidden />

          <header>
            <h1 className="soft-brand crt-bloom hi-page__headline">{hiPageCopy.headline}</h1>
          </header>

          {hiPageCopy.sections.map((section) => (
            <section key={section.id} className="hi-section" aria-labelledby={`hi-${section.id}`}>
              {"title" in section && section.title && (
                <h2 id={`hi-${section.id}`} className="hi-section__title">
                  {section.title}
                </h2>
              )}
              {section.paragraphs.map((paragraph, i) => (
                <p
                  key={i}
                  className="soft-body hi-section__body"
                  {...(!("title" in section && section.title) && i === 0
                    ? { id: `hi-${section.id}` }
                    : {})}
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <hr className="soft-divider soft-divider--thick" aria-hidden />

          <ProjectGrid />

          <div className="hi-page__links">
            {siteContent.links.map((link) => (
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
        </div>
      </div>
    </>
  );
}
