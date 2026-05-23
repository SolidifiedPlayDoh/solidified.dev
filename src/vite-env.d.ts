/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Canonical origin for Open Graph URLs, e.g. `https://solidified.dev` */
  readonly VITE_SITE_ORIGIN?: string;
  /** Your numeric Discord snowflake ID, used by the Lanyard presence card (`api.lanyard.rest`) and fallback profile URL. */
  readonly VITE_DISCORD_USER_ID?: string;
  /**
   * Optional override for Discord pills + CTA (server invite vanity link, Discord app deep link, etc.).
   * If unset, Discord links resolve to `https://discord.com/users/{VITE_DISCORD_USER_ID}` when ID is set.
   */
  readonly VITE_DISCORD_LINK_HREF?: string;
  /** Optional Cloudflare Worker URL (JSON proxy). */
  readonly VITE_FEEDBACK_URL?: string;
  /** Optional override for bundled obfuscated Discord feedback webhook. */
  readonly VITE_DISCORD_FEEDBACK_WEBHOOK?: string;
}
