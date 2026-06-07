/** Default site content bundled with the app. */
export type HomeLink = {
  label: string;
  href: string;
};

export type SiteContent = {
  headline: string;
  lead: string;
  paragraphs: string[];
  links: HomeLink[];
};

export const siteContent: SiteContent = {
  headline: "Solidified.dev",
  lead: "Hai im solidifedplaydoh. i am a vibecoder and i love to make experimental dev & build-y things. this website is still a work in progress.",
  paragraphs: [],
  links: [{ label: "GitHub", href: "https://github.com/SolidifiedPlayDoh" }],
};

/** @deprecated use `siteContent` */
export const defaultSiteContent = siteContent;

export type SiteContentDraft = SiteContent;
