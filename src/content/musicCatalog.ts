export type MusicTrack = {
  id: string;
  title: string;
  subtitle: string;
  samples: string[];
  description: string;
  audioSrc: string;
  externalLinks?: { label: string; href: string }[];
};

const base = `${import.meta.env.BASE_URL}music`;

export const musicCatalog: MusicTrack[] = [
  {
    id: "crush-burnt-rice",
    title: "CRUSH × Burnt Rice",
    subtitle: "mashup",
    samples: ["2hollis — crush", "Shawn Wasabi — Burnt Rice (feat. Yung GEMMY)"],
    description: "chopped-up club mashup — crush vocals over burnt rice energy.",
    audioSrc: `${base}/crush-burnt-rice.mp3`,
    externalLinks: [
      {
        label: "SoundCloud",
        href: "https://soundcloud.com/solidifiedplaydoh/crush-x-rice-mashup",
      },
    ],
  },
  {
    id: "evrry-dy-ad4ydreem",
    title: "EVRRY_DY-IZS-[A]D4YDREEM",
    subtitle: "mashup",
    samples: [
      "Femtanyl — P3T",
      "Far East Movement — Like a G6",
      "Dizzee Rascal, Armand Van Helden — Bonkers",
    ],
    description: "femtanyl x like a g6 x bonkers energy. listen here or on soundcloud.",
    audioSrc: `${base}/evrry-dy-ad4ydreem.mp3`,
    externalLinks: [
      {
        label: "SoundCloud",
        href: "https://soundcloud.com/solidifiedplaydoh/evrry_dy-izs-a-d4ydreem",
      },
    ],
  },
];

export const musicPageCopy = {
  headline: "Music",
  lead: "unofficial fan mashups and remixes by SolidifiedPlayDoh. not for sale, not affiliated with the original artists.",
  copyright: {
    title: "copyright",
    body:
      "these tracks use samples, vocals, and lyrics owned by other people. i don't claim any of that — this is fan/parody mashup stuff for fun. if you own the rights and want a track down, i'll remove it.",
    contactEmail: "takedown@solidified.dev",
  },
};
