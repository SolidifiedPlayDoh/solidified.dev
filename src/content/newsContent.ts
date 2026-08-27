export type NewsArticle = {
  slug: string;
  headline: string;
  dek: string;
  byline: string;
  dateline: string;
  kicker: string;
  paragraphs: string[];
  /** Optional footer note under the story */
  note?: string;
};

export const newsArticles: Record<string, NewsArticle> = {
  "Flying-Pigs-Discovered-In-Nevada": {
    slug: "Flying-Pigs-Discovered-In-Nevada",
    headline: "Flying Pigs Discovered In Nevada",
    dek: "Witnesses say several pigs were observed leaving the ground and staying up there for a bit.",
    byline: "Staff Report",
    dateline: "RENO, Nev.",
    kicker: "Nevada",
    paragraphs: [
      "Several witnesses in Nevada reported on Tuesday that pigs have been observed flying over parts of the state, ending years of debate about whether that was even a thing.",
      "The first credible sightings came from a ranch outside Reno, where a family reported three pigs seemingly ignoring the rules of gravity.",
      "\"I said I'd finish the roof when pigs fly\" said a individual close to the location of the first sighting \"So I guess I'm starting Thursday\"",
      "this is still an ongoing phenomenon and if you see pigs flying above you. do not try to feed them.",
    ],
    note: "This is a joke article. please do not take this seriously its for a joke. honestly how did you even find this i only link to it in a youtube comment somewhere",
  },
};

/** Old joke URL → current slug */
const newsAliases: Record<string, string> = {
  "Flying-Pigs-Discovered-In-California": "Flying-Pigs-Discovered-In-Nevada",
};

function canonicalSlug(slug: string): string {
  if (newsAliases[slug]) return newsAliases[slug];
  const lower = slug.toLowerCase();
  for (const [from, to] of Object.entries(newsAliases)) {
    if (from.toLowerCase() === lower) return to;
  }
  return slug;
}

/** Resolve a /news/:slug path. Accepts exact slug, aliases, or case-insensitive match. */
export function getNewsArticle(slug: string | undefined): NewsArticle | null {
  if (!slug) return null;
  const key = canonicalSlug(slug);
  if (newsArticles[key]) return newsArticles[key];
  const lower = key.toLowerCase();
  for (const article of Object.values(newsArticles)) {
    if (article.slug.toLowerCase() === lower) return article;
  }
  return null;
}
