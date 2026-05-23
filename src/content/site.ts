/**
 * Site copy re-exports. Edit `siteDefaults.ts` to change homepage text.
 */
export {
  siteContent,
  defaultSiteContent,
  type HomeLink,
  type SiteContent,
  type SiteContentDraft,
} from "./siteDefaults";

import { siteContent } from "./siteDefaults";

/** Convenience alias for bundled copy. */
export const homeCopy = {
  headline: siteContent.headline,
  lead: siteContent.lead,
  paragraphs: [...siteContent.paragraphs],
} as const;

export const homeLinks = [...siteContent.links] as const;
