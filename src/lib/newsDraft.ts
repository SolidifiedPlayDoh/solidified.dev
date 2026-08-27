import type { NewsArticle } from "../content/newsContent";

const STORAGE_PREFIX = "solidified.news.draft.v1.";

export type NewsDraftFields = {
  kicker: string;
  headline: string;
  dek: string;
  byline: string;
  dateline: string;
  /** Display date, e.g. Aug. 27, 2026 */
  dateLabel: string;
  /** machine date for <time datetime> */
  dateIso: string;
  /** Body text; blank line between paragraphs */
  body: string;
  note: string;
};

export function articleToDraftFields(article: NewsArticle): NewsDraftFields {
  return {
    kicker: article.kicker,
    headline: article.headline,
    dek: article.dek,
    byline: article.byline,
    dateline: article.dateline,
    dateLabel: "Aug. 27, 2026",
    dateIso: "2026-08-27",
    body: article.paragraphs.join("\n\n"),
    note: article.note ?? "",
  };
}

export function draftFieldsToArticle(
  base: NewsArticle,
  fields: NewsDraftFields,
): NewsArticle {
  const paragraphs = fields.body
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  return {
    ...base,
    kicker: fields.kicker.trim() || base.kicker,
    headline: fields.headline.trim() || base.headline,
    dek: fields.dek.trim(),
    byline: fields.byline.trim() || base.byline,
    dateline: fields.dateline.trim() || base.dateline,
    paragraphs: paragraphs.length > 0 ? paragraphs : base.paragraphs,
    note: fields.note.trim() || undefined,
  };
}

export function loadNewsDraft(slug: string): NewsDraftFields | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + slug);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<NewsDraftFields>;
    if (!parsed || typeof parsed !== "object") return null;
    return {
      kicker: String(parsed.kicker ?? ""),
      headline: String(parsed.headline ?? ""),
      dek: String(parsed.dek ?? ""),
      byline: String(parsed.byline ?? ""),
      dateline: String(parsed.dateline ?? ""),
      dateLabel: String(parsed.dateLabel ?? ""),
      dateIso: String(parsed.dateIso ?? ""),
      body: String(parsed.body ?? ""),
      note: String(parsed.note ?? ""),
    };
  } catch {
    return null;
  }
}

export function saveNewsDraft(slug: string, fields: NewsDraftFields) {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify(fields));
  } catch {
    /* private mode / quota */
  }
}

export function clearNewsDraft(slug: string) {
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + slug);
  } catch {
    /* ignore */
  }
}
