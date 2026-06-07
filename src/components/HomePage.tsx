import { Link } from "react-router-dom";

import { homeAboutCopy } from "../content/hiContent";
import { siteContent } from "../content/siteDefaults";

import { ProjectGrid } from "./ProjectGrid";

import "../styles/hi.css";

export function HomePage() {
  return (
    <div className="soft-site">
      <div className="soft-site__inner">
        <hr className="soft-divider" aria-hidden />

        <section className="soft-columns" aria-label="About">
          <div className="soft-column soft-column--text">
            <h1 className="soft-brand crt-bloom">{siteContent.headline}</h1>
            <p className="soft-lead">{siteContent.lead}</p>
            {siteContent.paragraphs.map((block, i) => (
              <p key={i} className="soft-body">
                {block}
              </p>
            ))}
            <p className="soft-body home-hi-link">
              <Link to="/hi" className="soft-pill">
                <span className="soft-pill__dot" aria-hidden />
                <span className="soft-pill__label">{homeAboutCopy.hiLinkLabel}</span>
              </Link>
            </p>
          </div>

          <div className="soft-column soft-column--aside">
            <nav className="soft-nav" aria-label="Links">
              <ul>
                <li>
                  <Link to="/hi" className="soft-pill">
                    <span className="soft-pill__dot" aria-hidden />
                    <span className="soft-pill__label">Hi</span>
                  </Link>
                </li>
                {siteContent.links.map((link, idx) => (
                  <li key={`${idx}-${link.href}`}>
                    <a
                      href={link.href}
                      className="soft-pill"
                      rel="noopener noreferrer"
                    >
                      <span className="soft-pill__dot" aria-hidden />
                      <span className="soft-pill__label">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>

        <hr className="soft-divider soft-divider--thick" aria-hidden />

        <ProjectGrid />
      </div>
    </div>
  );
}
