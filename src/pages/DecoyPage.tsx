import { useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { GlitchReveal } from "../components/GlitchReveal";
import { SiteShell } from "../components/SiteShell";
import { decoyInstallSteps, decoyPageCopy } from "../content/decoyContent";
import { usePageMeta } from "../hooks/usePageMeta";
import { buildDecoyUrl, type DecoyConfig } from "../lib/decoy";
import { fileToIconDataUrl, makePlaceholderIcon } from "../lib/decoyImage";

import "../styles/decoy.css";

function shortLabel(name: string): string {
  const trimmed = name.trim() || "Decoy";
  return trimmed.length > 12 ? `${trimmed.slice(0, 11)}…` : trimmed;
}

export function DecoyPage() {
  const [name, setName] = useState(decoyPageCopy.defaultName);
  const [message, setMessage] = useState(decoyPageCopy.defaultMessage);
  const [bg, setBg] = useState(decoyPageCopy.defaultBg);
  const [fg, setFg] = useState(decoyPageCopy.defaultFg);
  const [iconDataUrl, setIconDataUrl] = useState("");
  const [iconBase64, setIconBase64] = useState("");
  const [mime, setMime] = useState("image/jpeg");
  const [link, setLink] = useState("");
  const [dragging, setDragging] = useState(false);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const hasCustomIcon = useRef(false);

  usePageMeta({
    title: "Decoy | Solidified.dev",
    description: decoyPageCopy.lead,
    path: "/decoy",
    themeColor: "#050508",
  });

  const previewIcon = useMemo(
    () => iconDataUrl || makePlaceholderIcon(name),
    [iconDataUrl, name],
  );

  const config = useMemo<DecoyConfig>(
    () => ({
      name,
      message,
      bg,
      fg,
      iconBase64: iconBase64 || previewIcon.split(",")[1] || "",
      mime,
    }),
    [name, message, bg, fg, iconBase64, previewIcon, mime],
  );

  const applyIcon = useCallback(async (file: File) => {
    const icon = await fileToIconDataUrl(file);
    hasCustomIcon.current = true;
    setIconDataUrl(icon.dataUrl);
    setIconBase64(icon.base64);
    setMime(icon.mime);
  }, []);

  const handleIconChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        await applyIcon(file);
      } catch {
        /* ignore bad uploads */
      }
    },
    [applyIcon],
  );

  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (!file) return;
      try {
        await applyIcon(file);
      } catch {
        /* ignore bad uploads */
      }
    },
    [applyIcon],
  );

  const openDecoy = useCallback(() => {
    const url = buildDecoyUrl(config);
    setLink(url);
    window.location.href = url;
  }, [config]);

  return (
    <SiteShell>
      <main id="main" className="soft-site decoy-page">
        <div className="soft-site__inner">
          <GlitchReveal variant="pill" delay={40}>
            <nav className="decoy-page__top">
              <Link to="/" className="soft-pill">
                <span className="soft-pill__dot" aria-hidden />
                <span className="soft-pill__label">← home</span>
              </Link>
            </nav>
          </GlitchReveal>

          <GlitchReveal variant="line" delay={100}>
            <hr className="soft-divider" aria-hidden />
          </GlitchReveal>

          <section className="decoy-hero">
            <GlitchReveal variant="hero" delay={160}>
              <header className="decoy-hero__copy">
                <h1
                  className="soft-brand scene-headline decoy-page__headline"
                  data-text={decoyPageCopy.headline}
                >
                  {decoyPageCopy.headline}
                </h1>
                <p className="soft-lead decoy-page__lead">{decoyPageCopy.lead}</p>
              </header>
            </GlitchReveal>

            <GlitchReveal variant="block" delay={220}>
              <aside className="decoy-phone" aria-label="Home screen preview">
                <div className="decoy-phone__frame">
                  <div className="decoy-phone__status">
                    <span>9:41</span>
                    <span>5G</span>
                  </div>
                  <div className="decoy-phone__grid">
                    {["Photos", "Maps"].map((label) => (
                      <div key={label} className="decoy-app-slot decoy-app-slot--ghost">
                        <div className="decoy-app-slot__icon" />
                        <div className="decoy-app-slot__label">{label}</div>
                      </div>
                    ))}
                    <div className="decoy-app-slot decoy-app-slot--decoy">
                      <div
                        className="decoy-app-slot__icon"
                        style={{ backgroundImage: `url('${previewIcon}')` }}
                      />
                      <div className="decoy-app-slot__label">{shortLabel(name)}</div>
                    </div>
                    {["Mail", "Notes", "Files", "Clock"].map((label) => (
                      <div key={label} className="decoy-app-slot decoy-app-slot--ghost">
                        <div className="decoy-app-slot__icon" />
                        <div className="decoy-app-slot__label">{label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="decoy-phone__dock" aria-hidden>
                    <div />
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
              </aside>
            </GlitchReveal>
          </section>

          <section className="decoy-panel">
            <GlitchReveal variant="block" delay={280}>
              <div className="decoy-card">
                <h2 className="decoy-card__title">Build your decoy</h2>
                <div className="decoy-fields">
                  <label className="decoy-field">
                    App name
                    <input
                      type="text"
                      maxLength={30}
                      value={name}
                      placeholder="Fake App"
                      onChange={(event) => {
                        setName(event.target.value);
                        if (!hasCustomIcon.current) {
                          setIconDataUrl("");
                          setIconBase64("");
                        }
                      }}
                    />
                  </label>

                  <label className="decoy-field">
                    Icon
                    <div
                      className={`decoy-drop${dragging ? " decoy-drop--drag" : ""}`}
                      onDragEnter={(event) => {
                        event.preventDefault();
                        setDragging(true);
                      }}
                      onDragOver={(event) => event.preventDefault()}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                    >
                      <input
                        ref={iconInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleIconChange}
                      />
                      <div className="decoy-drop__copy">
                        <div
                          className="decoy-drop__preview"
                          style={{ backgroundImage: `url('${previewIcon}')` }}
                        />
                        <strong>Drop an image or tap to upload</strong>
                        <span>Square works best. We crop it to an app icon.</span>
                      </div>
                    </div>
                  </label>

                  <label className="decoy-field">
                    What it says when opened
                    <textarea
                      maxLength={160}
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                    />
                  </label>

                  <div className="decoy-colors">
                    <label className="decoy-field">
                      <span>Splash background</span>
                      <div className="decoy-color-field">
                        <input
                          type="color"
                          value={bg}
                          onChange={(event) => setBg(event.target.value)}
                        />
                        <strong>Background</strong>
                      </div>
                    </label>
                    <label className="decoy-field">
                      <span>Splash text</span>
                      <div className="decoy-color-field">
                        <input
                          type="color"
                          value={fg}
                          onChange={(event) => setFg(event.target.value)}
                        />
                        <strong>Text</strong>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="decoy-actions">
                  <button className="decoy-btn decoy-btn--primary" type="button" onClick={openDecoy}>
                    Open decoy page
                  </button>
                </div>

                {link ? (
                  <div className="decoy-result">
                    <p className="decoy-result__label">Open this in Safari — it’ll tell you what to do</p>
                    <a className="decoy-hold-link" href={link}>
                      <span
                        className="decoy-hold-link__icon"
                        style={{ backgroundImage: `url('${previewIcon}')` }}
                      />
                      <span className="decoy-hold-link__text">
                        <strong>{name.trim() || "Decoy"}</strong>
                        <em>tap to open</em>
                      </span>
                    </a>
                    <p className="decoy-hint">
                      On the next page: address bar → Share → Add to Home Screen.
                    </p>
                  </div>
                ) : null}
              </div>
            </GlitchReveal>

            <GlitchReveal variant="block" delay={340}>
              <div className="decoy-card">
                <h2 className="decoy-card__title">Install on iPhone</h2>
                <div className="decoy-steps">
                  {decoyInstallSteps.map((step, index) => (
                    <div key={step.title} className="decoy-step">
                      <div className="decoy-step__num">{index + 1}</div>
                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlitchReveal>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
