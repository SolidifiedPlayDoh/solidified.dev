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

/** Snowflake for Lanyard + profile links when `VITE_DISCORD_USER_ID` is unset. */
export const bundledDiscordUserId = "1220125293272891475";

/** Discord user ID: env override, else bundled default for this portfolio. */
export function resolveDiscordUserId(): string | undefined {
  const fromEnv = import.meta.env.VITE_DISCORD_USER_ID?.trim();
  if (fromEnv) return fromEnv;
  return bundledDiscordUserId;
}

/** Primary Discord/contact URL for link pills — invite, server, or profile. */
export function resolveDiscordHref(): string {
  const custom = import.meta.env.VITE_DISCORD_LINK_HREF?.trim();
  if (custom) return custom;
  const uid = resolveDiscordUserId();
  if (uid) return `https://discord.com/users/${encodeURIComponent(uid)}`;
  return "https://discord.com/";
}

export const siteContent: SiteContent = {
  headline: "Solidified.dev",
  lead: "Hai im solidifedplaydoh. i am a vibecoder and i love to make experimental dev & build-y things. this website is still a work in progress so lmk on discord if somethings weird.",
  paragraphs: [],
  links: [{ label: "GitHub", href: "https://github.com/SolidifiedPlayDoh" }],
};

/** @deprecated use `siteContent` */
export const defaultSiteContent = siteContent;

export type SiteContentDraft = SiteContent;
