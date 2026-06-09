/** Default site content bundled with the app. */
export type HomeLink = {
  label: string;
  href: string;
};

export type SiteContent = {
  headline: string;
  links: HomeLink[];
};

export const siteContent: SiteContent = {
  headline: "Solidified.dev",
  links: [
    { label: "GitHub", href: "https://github.com/SolidifiedPlayDoh" },
    { label: "SoundCloud", href: "https://soundcloud.com/solidifiedplaydoh" },
  ],
};

/** @deprecated use `siteContent` */
export const defaultSiteContent = siteContent;

export type SiteContentDraft = SiteContent;
