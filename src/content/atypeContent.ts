export type ATypeGlyphKind = {
  id: string;
  title: string;
  meaning: string;
  examples: string;
  sample: string;
  kind: "letter" | "plain" | "solid";
};

export type ATypeFont = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  fileName: string;
  filePath: string;
  family: string;
  preview: string;
  features: string[];
  status: "ready" | "wip";
  /** Which how-to-read rows to show on this font's page */
  glyphKindIds: Array<ATypeGlyphKind["id"]>;
  /** Extra try-it alphabet line (digits/punct). Omit for letter-only fonts. */
  tryExtras?: string;
};

export const atypeGlyphKinds: ATypeGlyphKind[] = [
  {
    id: "letter",
    title: "Letter",
    meaning: "Circle with dots. Imagine lines between the dots.",
    examples: "A-Z · a-z",
    sample: "N",
    kind: "letter",
  },
  {
    id: "plain",
    title: "Punctuation & digits",
    meaning: "Circle with the character inside.",
    examples: "0-9 · ? . , ! : ;",
    sample: "!",
    kind: "plain",
  },
  {
    id: "solid",
    title: "Rare / unknown",
    meaning: "Solid circle. No custom glyph yet.",
    examples: "@ # $ % & * / …",
    sample: "@",
    kind: "solid",
  },
];

export const atypeFonts: ATypeFont[] = [
  {
    slug: "circles",
    name: "AType Circles",
    tagline: "Circles + dots",
    description: "Circles with dots. Read the gaps.",
    fileName: "ATypeographyCircles-Regular.ttf",
    filePath: "/atype/fonts/ATypeographyCircles-Regular.ttf",
    family: "AType Circles",
    preview: "POLYCORIA",
    features: ["A-Z / a-z", "circles + dots"],
    status: "ready",
    glyphKindIds: ["letter"],
  },
  {
    slug: "circles-extended",
    name: "AType Circles Extended",
    tagline: "Letters + digits + punctuation",
    description: "Letters, digits, punctuation, solid fallbacks.",
    fileName: "ATypeographyCircles-Extended.ttf",
    filePath: "/atype/fonts/ATypeographyCircles-Extended.ttf",
    family: "AType Circles Extended",
    preview: "TYPE 3!",
    features: ["letters", "0-9 & punctuation", "solid fallback"],
    status: "ready",
    glyphKindIds: ["letter", "plain", "solid"],
    tryExtras: "0123456789 ?.,!:;",
  },
];

export const atypeHub = {
  headline: "AType",
  lead: "Fonts.",
  howToTitle: "How to read",
  howToLead: "Connect the dots.",
};

export function getATypeFont(slug: string): ATypeFont | undefined {
  return atypeFonts.find((font) => font.slug === slug);
}

export function getGlyphKindsForFont(font: ATypeFont): ATypeGlyphKind[] {
  return atypeGlyphKinds.filter((kind) => font.glyphKindIds.includes(kind.id));
}
