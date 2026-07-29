/** Shared SEO strings — keep crawler-facing, don't clutter the UI. */

export const SEO_ORIGIN = "https://solidified.dev";

export const SEO_HANDLE = "SolidifiedPlayDoh";

/** Name variants people actually search. */
export const SEO_ALIASES = [
  "SolidifiedPlayDoh",
  "Solidified PlayDoh",
  "Solidified Play Doh",
  "solidifiedplaydoh",
  "solidified playdoh",
  "Soli",
  "Solidified",
] as const;

export const SEO_HOME_TITLE =
  "SolidifiedPlayDoh | Solidified.dev — apps, hacks, and weird web toys";

export const SEO_HOME_DESCRIPTION =
  "SolidifiedPlayDoh (also Solidified PlayDoh / Soli). Personal site for apps, hardware hacks, free downloads, fonts, and weird web toys. GitHub @SolidifiedPlayDoh.";

export const SEO_SAME_AS = [
  "https://github.com/SolidifiedPlayDoh",
  "https://www.youtube.com/@SolidifiedPlayDoh",
] as const;

export function buildJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SEO_ORIGIN}/#website`,
        url: `${SEO_ORIGIN}/`,
        name: "Solidified.dev",
        alternateName: [...SEO_ALIASES],
        description: SEO_HOME_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${SEO_ORIGIN}/#person` },
      },
      {
        "@type": "Person",
        "@id": `${SEO_ORIGIN}/#person`,
        name: SEO_HANDLE,
        alternateName: [
          "Solidified PlayDoh",
          "Solidified Play Doh",
          "Soli",
          "Solidified",
          "solidifiedplaydoh",
        ],
        url: `${SEO_ORIGIN}/`,
        sameAs: [...SEO_SAME_AS],
        jobTitle: "vibecoder",
        description:
          "SolidifiedPlayDoh builds apps, hacks hardware, and ships weird web toys at solidified.dev.",
      },
      {
        "@type": "ProfilePage",
        "@id": `${SEO_ORIGIN}/#profile`,
        url: `${SEO_ORIGIN}/`,
        name: SEO_HOME_TITLE,
        about: { "@id": `${SEO_ORIGIN}/#person` },
        mainEntity: { "@id": `${SEO_ORIGIN}/#person` },
        isPartOf: { "@id": `${SEO_ORIGIN}/#website` },
      },
    ],
  };
}
