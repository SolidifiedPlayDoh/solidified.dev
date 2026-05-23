/**
 * Writes dist/femtanylFNF/index.html — same SPA bundle as the site, but with
 * Femtanyl-specific Open Graph tags for Discord/crawlers (no redirect).
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ORIGIN = "https://solidified.dev";
const html = readFileSync("dist/index.html", "utf8");

const meta = {
  title: "Femtanyl FNF Animator | Solidified.dev",
  description:
    "Keyboard sprite animator for the Femtanyl FNF mod — hold arrows for poses, Shift for alts, OBS pop-out. ⚠️ Flashing visuals.",
  themeColor: "#12081f",
  ogTitle: "Femtanyl FNF Animator",
  ogDescription:
    "Play premade Femtanyl sprite animations with arrow keys. Trippy FNF shaders. Photosensitivity warning.",
  ogUrl: `${ORIGIN}/femtanylFNF`,
  ogImage: `${ORIGIN}/og-femtanyl.png`,
  ogImageAlt:
    "Femtanyl character snarling with red markings on a glitchy purple background",
  twitterDescription:
    "Arrow-key sprite animator with trippy FNF shaders. OBS pop-out included.",
};

let out = html
  .replace(/<title>[^<]*<\/title>/, `<title>${meta.title}</title>`)
  .replace(
    /name="description"\s+content="[^"]*"/,
    `name="description" content="${meta.description}"`,
  )
  .replace(
    /name="theme-color"\s+content="[^"]*"/,
    `name="theme-color" content="${meta.themeColor}"`,
  )
  .replace(
    /property="og:title"\s+content="[^"]*"/,
    `property="og:title" content="${meta.ogTitle}"`,
  )
  .replace(
    /property="og:description"\s+content="[^"]*"/,
    `property="og:description" content="${meta.ogDescription}"`,
  )
  .replace(
    /property="og:url"\s+content="[^"]*"/,
    `property="og:url" content="${meta.ogUrl}"`,
  )
  .replace(
    /property="og:image:alt"\s+content="[^"]*"/,
    `property="og:image:alt" content="${meta.ogImageAlt}"`,
  )
  .replace(
    /name="twitter:title"\s+content="[^"]*"/,
    `name="twitter:title" content="${meta.ogTitle}"`,
  )
  .replace(
    /name="twitter:description"\s+content="[^"]*"/,
    `name="twitter:description" content="${meta.twitterDescription}"`,
  );

if (!out.includes('rel="canonical"')) {
  out = out.replace(
    "</head>",
    `    <link rel="canonical" href="${meta.ogUrl}" />\n  </head>`,
  );
}

mkdirSync("dist/femtanylFNF", { recursive: true });
writeFileSync("dist/femtanylFNF/index.html", out);
console.log("Wrote dist/femtanylFNF/index.html with Femtanyl Open Graph meta");
