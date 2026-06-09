import { AboutSections } from "./AboutSections";
import { homePageCopy } from "../content/hiContent";
import { siteContent } from "../content/siteDefaults";

import { ProjectGrid } from "./ProjectGrid";

import "../styles/hi.css";

export function HomePage() {
  return (
    <div className="soft-site">
      <div className="soft-site__inner">
        <hr className="soft-divider" aria-hidden />

        <header>
          <h1 className="soft-brand crt-bloom hi-page__headline">{homePageCopy.headline}</h1>
        </header>

        <AboutSections sections={homePageCopy.sections} />

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

        <hr className="soft-divider soft-divider--thick" aria-hidden />

        <ProjectGrid />
      </div>
    </div>
  );
}
