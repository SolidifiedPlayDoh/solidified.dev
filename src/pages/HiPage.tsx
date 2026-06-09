import { Link } from "react-router-dom";
import { useEffect } from "react";

import { AboutSections } from "../components/AboutSections";
import { CrtOverlay } from "../components/CrtOverlay";
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
    themeColor: "#12081f",
  });

  useEffect(() => {
    document.body.classList.add("phase-site");
    return () => document.body.classList.remove("phase-site");
  }, []);

  return (
    <>
      <CrtOverlay animateScanlines />
      <div className="soft-site hi-page hi-page--short">
        <div className="soft-site__inner">
          <header>
            <h1 className="soft-brand crt-bloom hi-page__headline">{hiPageCopy.headline}</h1>
          </header>

          <AboutSections sections={hiPageCopy.sections} />

          <div className="hi-page__links">
            <Link to="/" className="soft-pill">
              <span className="soft-pill__dot" aria-hidden />
              <span className="soft-pill__label">{hiPageCopy.moreAboutLabel}</span>
            </Link>
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
