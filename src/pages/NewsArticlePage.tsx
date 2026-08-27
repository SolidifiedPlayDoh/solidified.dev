import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { getNewsArticle } from "../content/newsContent";
import { usePageMeta } from "../hooks/usePageMeta";
import { NotFoundPage } from "./NotFoundPage";

import "../styles/news.css";

export function NewsArticlePage() {
  const { slug } = useParams();
  const article = getNewsArticle(slug);

  usePageMeta({
    title: article
      ? `${article.headline} | The Solidified Times`
      : "Not found",
    description: article?.dek ?? "Article not found.",
    path: article ? `/news/${article.slug}` : undefined,
    themeColor: "#f7f7f5",
  });

  useEffect(() => {
    if (!article) return;
    document.body.classList.add("phase-news");
    document.documentElement.classList.add("phase-news");
    return () => {
      document.body.classList.remove("phase-news");
      document.documentElement.classList.remove("phase-news");
    };
  }, [article]);

  if (!article) {
    return <NotFoundPage />;
  }

  return (
    <div className="news">
      <header className="news__masthead">
        <p className="news__paper">The Solidified Times</p>
        <p className="news__edition">Online Edition</p>
      </header>

      <main id="main" className="news__main">
        <article className="news__article">
          <p className="news__kicker">{article.kicker}</p>
          <h1 className="news__headline">{article.headline}</h1>
          {article.dek ? <p className="news__dek">{article.dek}</p> : null}

          <p className="news__meta">
            By {article.byline}
            <span aria-hidden> | </span>
            <time dateTime="2026-08-27">Aug. 27, 2026</time>
          </p>

          <div className="news__body">
            {article.paragraphs.map((paragraph, i) => (
              <p key={i}>
                {i === 0 ? (
                  <>
                    <span className="news__dateline">{article.dateline} </span>
                    {paragraph}
                  </>
                ) : (
                  paragraph
                )}
              </p>
            ))}
          </div>

          {article.note ? <p className="news__note">{article.note}</p> : null}
        </article>
      </main>
    </div>
  );
}
