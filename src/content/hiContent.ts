export type AboutSection = {
  id: string;
  title?: string;
  paragraphs: string[];
};

/** Short welcome — for when you scribble solidified.dev/hi on a wall. */
export const hiPageCopy = {
  headline: "hi!!",
  sections: [
    {
      id: "hello",
      paragraphs: [
        "hello! you probably found this posted or written somewhere — welcome to my website!! >w<",
        "i am SolidifiedPlayDoh! vibecoder, AI wrangler, and professional hardware botherer. i hack random stuff into things it was never meant to be.",
      ],
    },
  ] satisfies AboutSection[],
  moreAboutLabel: "more about me →",
};

/** Full about — the main homepage. */
export const homePageCopy = {
  headline: "Solidified.dev",
  sections: [
    {
      id: "hello",
      paragraphs: [
        "im SolidifiedPlayDoh! vibecoder, pro AI wrangler, and i love to make cool apps and hack stuff.",
        "the things i have the ability to create can rival the multi month work of pre-AI software developers. and it usually takes less than a day.",
      ],
    },
    {
      id: "homebrew",
      title: "homebrew ethos",
      paragraphs: [
        "turns out theres a name for how i am — homebrew ethos. basically i'd rather hack something together myself than wait for the official version.",
        "flash a radio into a music player. bolt AI onto roblox studio. ship a browser toy before breakfast. if it works and its silly, thats the whole point >w<",
      ],
    },
    {
      id: "how-i-work",
      paragraphs: [
        "some of my favorite things to do are hacking random stuff i have to do things that they normally are not meant to do. for example i once took an ATS pocket radio and flashed it to be a FLAC music player.",
        "most of what i make starts as a silly idea and ends up working before i gotta go to bed. i just love building things and being silly.",
      ],
    },
    {
      id: "real-talk",
      title: "real talk",
      paragraphs: [
        "i have autism and ADHD.",
        "poke around the projects below or my github if youre curious about what else i get up to.",
      ],
    },
  ] satisfies AboutSection[],
};
