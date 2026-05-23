import { siteContent } from "../content/siteDefaults";

import { DiscordPresenceCard } from "./DiscordPresenceCard";
import { ProjectGrid } from "./ProjectGrid";

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
          </div>

          <div className="soft-column soft-column--aside">
            <DiscordPresenceCard />

            <nav className="soft-nav" aria-label="Links">
              <ul>
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
