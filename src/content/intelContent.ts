export type IntelBranch = {
  label: string;
  value: string;
};

export type IntelDossier = {
  id: string;
  /** Short tech tag on the stamp — not clearance theater */
  tag: string;
  subject: string;
  summary: string;
  branches: IntelBranch[];
};

/** Hover info panels — tech readout, not spy LARP. */
export const intelDossiers: Record<string, IntelDossier> = {
  brand: {
    id: "HOME",
    tag: "ROOT",
    subject: "Solidified.dev",
    summary: "My site. Random web toys live here.",
    branches: [
      { label: "AKA", value: "SolidifiedPlayDoh" },
      { label: "VIBE", value: "VIBECODER" },
      { label: "MODE", value: "ONLINE" },
    ],
  },
  about: {
    id: "ABOUT",
    tag: "BIO",
    subject: "About",
    summary: "I build fast, hack random hardware, and make silly stuff.",
    branches: [
      { label: "ROLE", value: "VIBECODER" },
      { label: "NOTES", value: "AUTISM · ADHD" },
      { label: "LOOP", value: "SILLY → WORKING" },
    ],
  },
  "link-store": {
    id: "STORE",
    tag: "LINK",
    subject: "Store",
    summary: "Downloads. Fonts, extensions, free drops.",
    branches: [
      { label: "PATH", value: "/store" },
      { label: "KIND", value: "INTERNAL" },
      { label: "COST", value: "MOSTLY FREE" },
    ],
  },
  "link-github": {
    id: "GITHUB",
    tag: "LINK",
    subject: "GitHub",
    summary: "Source dumps. Experiments, toys, half-finished chaos.",
    branches: [
      { label: "HOST", value: "github.com" },
      { label: "KIND", value: "EXTERNAL" },
      { label: "USER", value: "SolidifiedPlayDoh" },
    ],
  },
  "link-youtube": {
    id: "YOUTUBE",
    tag: "LINK",
    subject: "YouTube",
    summary: "Mashups and remixes. Audio lives over there now.",
    branches: [
      { label: "HOST", value: "youtube.com" },
      { label: "KIND", value: "EXTERNAL" },
      { label: "STUFF", value: "REMIX / MASHUP" },
    ],
  },
  "store-shelf": {
    id: "SHELF",
    tag: "ROW",
    subject: "New in the store",
    summary: "Latest drops, newest first.",
    branches: [
      { label: "VIEW", value: "PRODUCT GRID" },
      { label: "SORT", value: "RECENCY" },
      { label: "TIP", value: "CLICK TO OPEN" },
    ],
  },
  projects: {
    id: "PROJECTS",
    tag: "GRID",
    subject: "Projects",
    summary: "Stuff ive made. Click one.",
    branches: [
      { label: "LIST", value: "LIVE" },
      { label: "TIP", value: "CLICK TO ENTER" },
      { label: "FILTER", value: "NONE" },
    ],
  },
  "project-youtube": {
    id: "YT",
    tag: "MEDIA",
    subject: "YouTube",
    summary: "Mashups and remixes. Audio lives here now.",
    branches: [
      { label: "KIND", value: "EXTERNAL" },
      { label: "MEDIA", value: "AUDIO / VIDEO" },
      { label: "FEED", value: "LIVE" },
    ],
  },
  "product-atype-circles": {
    id: "CIRCLES",
    tag: "DROP",
    subject: "AType Circles",
    summary: "Circles + dots. Free typeface.",
    branches: [
      { label: "PRICE", value: "FREE" },
      { label: "TAGS", value: "#Fonts #AType" },
      { label: "TIP", value: "OPEN DETAIL" },
    ],
  },
  "product-atype-extended": {
    id: "EXTENDED",
    tag: "DROP",
    subject: "AType Circles Extended",
    summary: "Letters, digits, punctuation. Solid fallbacks.",
    branches: [
      { label: "PRICE", value: "FREE" },
      { label: "TAGS", value: "#Fonts #AType" },
      { label: "TIP", value: "OPEN DETAIL" },
    ],
  },
  "product-stillweb": {
    id: "STILLWEB",
    tag: "DROP",
    subject: "StillWeb",
    summary: "Chrome ad blocker. Load unpacked and go.",
    branches: [
      { label: "PRICE", value: "FREE" },
      { label: "TAGS", value: "#Extensions" },
      { label: "RUNS", value: "CHROME" },
    ],
  },
};

export function getIntel(id: string | null | undefined): IntelDossier | null {
  if (!id) return null;
  return intelDossiers[id] ?? null;
}
