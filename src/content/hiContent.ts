export type AboutSection = {
  id: string;
  title?: string;
  paragraphs: string[];
};

export type HiSource = {
  /** Canonical hash without # */
  id: string;
  /** Alternate hashes that map here */
  aliases?: string[];
  /** Short stamp shown above the brand */
  stamp: string;
  /** How they probably found this */
  found: string;
};

/** Short door page — solidified.dev/hi#radio etc. */
export const hiPageCopy = {
  brand: "solidified.dev",
  lead: "you found me.",
  body: "im SolidifiedPlayDoh. i make apps and i hack hardware into doing stuff it wasnt meant for.",
  cta: "the rest of the site →",
  ctaHome: "/",
};

export const hiSources: HiSource[] = [
  {
    id: "wall",
    stamp: "WALL",
    found:
      "you probably saw this written on a wall somewhere. hi. this is my website.",
  },
  {
    id: "qr",
    stamp: "QR",
    found: "you probably scanned a qr code that pointed here. this is my website.",
  },
  {
    id: "radio",
    aliases: ["kiwisdr", "sdr", "ham", "shortwave"],
    stamp: "RADIO",
    found:
      "you probably found this on a kiwisdr, in a radio username, or heard it on the air. this is my site.",
  },
  {
    id: "sticker",
    stamp: "STICKER",
    found:
      "you probably got this off a sticker, or typed it in after staring at one. this is my website.",
  },
  {
    id: "flyer",
    aliases: ["poster"],
    stamp: "FLYER",
    found: "you probably grabbed this off a flyer or poster. this is my website.",
  },
  {
    id: "note",
    aliases: ["paper", "scrap"],
    stamp: "NOTE",
    found:
      "you probably found this on a scrap of paper or a sticky note. this is my website.",
  },
  {
    id: "discord",
    stamp: "DISCORD",
    found: "you probably clicked this from discord. this is my website.",
  },
  {
    id: "irc",
    stamp: "IRC",
    found: "you probably saw this in irc. this is my website.",
  },
  {
    id: "github",
    stamp: "GITHUB",
    found: "you probably followed a link from github. heres more of my stuff.",
  },
  {
    id: "bio",
    aliases: ["profile", "username"],
    stamp: "BIO",
    found:
      "you probably found this in a username or profile bio somewhere. this is my website.",
  },
  {
    id: "bus",
    aliases: ["transit", "bart", "muni"],
    stamp: "TRANSIT",
    found:
      "you probably saw this on a bus, bart, or somewhere on transit. this is my website.",
  },
];

export const hiDefaultSource: HiSource = {
  id: "default",
  stamp: "HI",
  found:
    "you probably found a random link and decided to check it out. this is my website.",
};

const hiSourceByKey = new Map<string, HiSource>();
for (const source of hiSources) {
  hiSourceByKey.set(source.id, source);
  for (const alias of source.aliases ?? []) {
    hiSourceByKey.set(alias, source);
  }
}

/** Resolve `#radio`, `#KiwiSDR`, empty hash, unknown junk → a hi source. */
export function resolveHiSource(hash: string): HiSource {
  const key = hash.replace(/^#/, "").trim().toLowerCase();
  if (!key) return hiDefaultSource;
  return hiSourceByKey.get(key) ?? hiDefaultSource;
}

/** Full about - the main homepage. */
export const homePageCopy = {
  headline: "Solidified.dev",
  sections: [
    {
      id: "hello",
      paragraphs: [
        "im SolidifiedPlayDoh! vibecoder, pro AI wrangler, and i love to make cool apps and hack stuff.",
        "i can knock out stuff that used to take people months. usually it takes me less than a day.",
      ],
    },
    {
      id: "how-i-work",
      paragraphs: [
        "some of my favorite things to do are hacking random stuff i have to do things that they normally are not meant to do. for example i once took an ATS pocket radio and flashed it to be a FLAC music player.",
        "most of what i make starts as a silly idea and ends up working. i just like building things and being silly.",
      ],
    },
    {
      id: "btw",
      title: "btw",
      paragraphs: [
        "i have autism and ADHD.",
        "poke around the projects below or my github if youre curious about what else i get up to.",
      ],
    },
  ] satisfies AboutSection[],
};
