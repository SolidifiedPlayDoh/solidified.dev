import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { getNewsArticle } from "../content/newsContent";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  articleToDraftFields,
  clearNewsDraft,
  draftFieldsToArticle,
  loadNewsDraft,
  saveNewsDraft,
  type NewsDraftFields,
} from "../lib/newsDraft";
import { NotFoundPage } from "./NotFoundPage";

import "../styles/news.css";

function blankParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function NewsArticlePage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const base = getNewsArticle(slug);

  const [editing, setEditing] = useState(() => searchParams.has("edit"));
  const [fields, setFields] = useState<NewsDraftFields | null>(() => {
    if (!base) return null;
    return loadNewsDraft(base.slug) ?? articleToDraftFields(base);
  });
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");

  useEffect(() => {
    if (!base) {
      setFields(null);
      return;
    }
    const draft = loadNewsDraft(base.slug);
    setFields(draft ?? articleToDraftFields(base));
  }, [base]);

  useEffect(() => {
    if (!base) return;
    document.body.classList.add("phase-news");
    document.documentElement.classList.add("phase-news");
    return () => {
      document.body.classList.remove("phase-news");
      document.documentElement.classList.remove("phase-news");
    };
  }, [base]);

  useEffect(() => {
    if (!base || !fields || !editing) return;
    const id = window.setTimeout(() => {
      saveNewsDraft(base.slug, fields);
      setSaveState("saved");
    }, 350);
    return () => window.clearTimeout(id);
  }, [base, fields, editing]);

  const article =
    base && fields
      ? draftFieldsToArticle(base, fields)
      : base;

  usePageMeta({
    title: article
      ? `${article.headline} | The Solidified Times`
      : "Not found",
    description: article?.dek ?? "Article not found.",
    path: article ? `/news/${article.slug}` : undefined,
    themeColor: "#f7f7f5",
  });

  if (!base || !fields || !article) {
    return base === null ? <NotFoundPage /> : null;
  }

  const setField = <K extends keyof NewsDraftFields>(key: K, value: NewsDraftFields[K]) => {
    setSaveState("idle");
    setFields((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const exitEdit = () => {
    setEditing(false);
    if (searchParams.has("edit")) {
      navigate(`/news/${base.slug}`, { replace: true });
    }
  };

  const enterEdit = () => {
    setEditing(true);
    navigate(`/news/${base.slug}?edit=1`, { replace: true });
  };

  const resetDraft = () => {
    clearNewsDraft(base.slug);
    setFields(articleToDraftFields(base));
    setSaveState("saved");
  };

  const paragraphs = blankParagraphs(fields.body);

  return (
    <div className={`news${editing ? " news--editing" : ""}`}>
      <header className="news__masthead">
        <p className="news__paper">The Solidified Times</p>
        <p className="news__edition">Online Edition</p>
      </header>

      <main id="main" className="news__main">
        <article className="news__article">
          {editing ? (
            <>
              <label className="news__label">
                Kicker
                <input
                  className="news__input news__input--kicker"
                  value={fields.kicker}
                  onChange={(e) => setField("kicker", e.target.value)}
                />
              </label>

              <label className="news__label">
                Headline
                <textarea
                  className="news__input news__input--headline"
                  rows={2}
                  value={fields.headline}
                  onChange={(e) => setField("headline", e.target.value)}
                />
              </label>

              <label className="news__label">
                Deck
                <textarea
                  className="news__input news__input--dek"
                  rows={2}
                  value={fields.dek}
                  onChange={(e) => setField("dek", e.target.value)}
                />
              </label>

              <div className="news__edit-row">
                <label className="news__label">
                  Byline
                  <input
                    className="news__input"
                    value={fields.byline}
                    onChange={(e) => setField("byline", e.target.value)}
                  />
                </label>
                <label className="news__label">
                  Date
                  <input
                    className="news__input"
                    value={fields.dateLabel}
                    onChange={(e) => setField("dateLabel", e.target.value)}
                  />
                </label>
              </div>

              <label className="news__label">
                Dateline (shows at start of first paragraph)
                <input
                  className="news__input"
                  value={fields.dateline}
                  onChange={(e) => setField("dateline", e.target.value)}
                />
              </label>

              <label className="news__label">
                Body (blank line between paragraphs)
                <textarea
                  className="news__input news__input--body"
                  rows={16}
                  value={fields.body}
                  onChange={(e) => setField("body", e.target.value)}
                />
              </label>

              <label className="news__label">
                Editor note (optional)
                <textarea
                  className="news__input news__input--note"
                  rows={2}
                  value={fields.note}
                  onChange={(e) => setField("note", e.target.value)}
                />
              </label>
            </>
          ) : (
            <>
              <p className="news__kicker">{article.kicker}</p>
              <h1 className="news__headline">{article.headline}</h1>
              {article.dek ? <p className="news__dek">{article.dek}</p> : null}

              <p className="news__meta">
                By {article.byline}
                <span aria-hidden> | </span>
                <time dateTime={fields.dateIso || undefined}>{fields.dateLabel}</time>
              </p>

              <div className="news__body">
                {paragraphs.map((paragraph, i) => (
                  <p key={i}>
                    {i === 0 && fields.dateline.trim() ? (
                      <>
                        <span className="news__dateline">{fields.dateline.trim()} </span>
                        {paragraph}
                      </>
                    ) : (
                      paragraph
                    )}
                  </p>
                ))}
              </div>

              {article.note ? <p className="news__note">{article.note}</p> : null}
            </>
          )}
        </article>
      </main>

      <div className="news__tools">
        {editing ? (
          <>
            <span className="news__save-status" aria-live="polite">
              {saveState === "saved" ? "Saved on this device" : "Saving…"}
            </span>
            <button type="button" className="news__tool-btn" onClick={resetDraft}>
              Reset
            </button>
            <button type="button" className="news__tool-btn news__tool-btn--primary" onClick={exitEdit}>
              Done
            </button>
          </>
        ) : (
          <button type="button" className="news__tool-btn" onClick={enterEdit}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
