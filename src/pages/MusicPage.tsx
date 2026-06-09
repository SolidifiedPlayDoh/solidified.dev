import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { CrtOverlay } from "../components/CrtOverlay";
import { musicCatalog, musicPageCopy, type MusicTrack } from "../content/musicCatalog";
import { usePageMeta } from "../hooks/usePageMeta";

import "../styles/music.css";

function TrackCard({ track }: { track: MusicTrack }) {
  return (
    <article className="music-track">
      <h2 className="music-track__title">{track.title}</h2>
      <p className="music-track__subtitle">{track.subtitle}</p>
      <p className="music-track__desc">{track.description}</p>
      <ul className="music-track__samples" aria-label="Samples used">
        {track.samples.map((sample) => (
          <li key={sample}>{sample}</li>
        ))}
      </ul>
      <audio className="music-track__player" controls preload="none" src={track.audioSrc}>
        <a href={track.audioSrc}>Download audio</a>
      </audio>
      {track.externalLinks && track.externalLinks.length > 0 && (
        <div className="music-track__links">
          {track.externalLinks.map((link) => (
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
      )}
    </article>
  );
}

function TakedownContact() {
  const email = musicPageCopy.copyright.contactEmail;
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback: user can select the visible address */
    }
  };

  return (
    <div className="soft-pill soft-pill--combo">
      <a href={`mailto:${email}`} className="soft-pill-combo__mailto">
        <span className="soft-pill__dot" aria-hidden />
        <span className="soft-pill__label">{email}</span>
      </a>
      <button
        type="button"
        className="soft-pill soft-pill-combo__copy"
        onClick={(e) => {
          e.preventDefault();
          void copyEmail();
        }}
      >
        <span className="soft-pill__label">{copied ? "copied!" : "copy"}</span>
      </button>
    </div>
  );
}

export function MusicPage() {
  usePageMeta({
    title: "Music | Solidified.dev",
    description: "Listen to SolidifiedPlayDoh mashups and remixes.",
    path: "/music",
    themeColor: "#12081f",
  });

  useEffect(() => {
    document.body.classList.add("phase-site");
    return () => document.body.classList.remove("phase-site");
  }, []);

  return (
    <>
      <CrtOverlay animateScanlines />
      <div className="soft-site music-page">
        <div className="soft-site__inner">
          <nav className="music-page__top">
            <Link to="/" className="soft-pill">
              <span className="soft-pill__dot" aria-hidden />
              <span className="soft-pill__label">← home</span>
            </Link>
          </nav>

          <hr className="soft-divider" aria-hidden />

          <header>
            <h1 className="soft-brand crt-bloom music-page__headline">{musicPageCopy.headline}</h1>
            <p className="soft-lead music-page__lead">{musicPageCopy.lead}</p>
          </header>

          <section aria-label="Tracks">
            {musicCatalog.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </section>

          <footer className="music-page__legal">
            <h2 className="music-page__legal-title">{musicPageCopy.copyright.title}</h2>
            <p className="soft-body music-page__legal-body">{musicPageCopy.copyright.body}</p>
            <TakedownContact />
          </footer>
        </div>
      </div>
    </>
  );
}
