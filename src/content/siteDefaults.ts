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
  lead:
    "im SolidifiedPlayDoh — vibecoder, AI wrangler, and professional hardware botherer. i ship web experiments, discord plugins, embedded firmware hacks, and roblox tooling. usually in less than a day.",
  paragraphs: [
    "i hack random stuff to do things they were never meant to do — pocket radios that play FLAC, flypads that shouldn't exist, morse decoders bolted onto SDR software.",
    "most of what i make starts as a silly idea and ends up working before i gotta go to bed. AI helps me move stupid fast without cutting the chaos.",
    "this site is where i put the finished experiments.",
  ],
  links: [{ label: "GitHub", href: "https://github.com/SolidifiedPlayDoh" }],
};

/** @deprecated use `siteContent` */
export const defaultSiteContent = siteContent;

export type SiteContentDraft = SiteContent;
