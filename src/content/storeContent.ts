import { atypeFonts } from "./atypeContent";

export type StoreProduct = {
  slug: string;
  path: string;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  priceLabel: string;
  tags: string[];
  githubRepo?: string;
  releaseAssetName?: string;
  /** ISO date - used to sort the homepage shelf (newest first). */
  addedAt: string;
  isNew?: boolean;
};

export const storePageCopy = {
  headline: "Store",
  lead: "",
};

const atypeStoreProducts: StoreProduct[] = atypeFonts.map((font) => ({
  slug: `atype-${font.slug}`,
  path: `/store/atype/${font.slug}`,
  name: font.name,
  tagline: font.tagline,
  description: font.description,
  emoji: "◎",
  priceLabel: "Free",
  tags: ["Fonts", "AType"],
  addedAt: "2026-07-14",
  isNew: true,
}));

export const stillwebProduct: StoreProduct & {
  githubRepo: string;
  releaseAssetName: string;
} = {
  slug: "stillweb",
  path: "/store/stillweb",
  name: "StillWeb",
  tagline: "Chrome ad blocker.",
  description: "Blocks ads and trackers. Load unpacked and go.",
  emoji: "◉",
  priceLabel: "Free",
  tags: ["Extensions"],
  githubRepo: "SolidifiedPlayDoh/stillweb",
  releaseAssetName: "stillweb-chrome.zip",
  addedAt: "2026-06-10",
  isNew: true,
};

export const storeProducts: StoreProduct[] = [
  ...atypeStoreProducts,
  stillwebProduct,
];

export function getStoreProductByPath(path: string): StoreProduct | undefined {
  return storeProducts.find((product) => product.path === path);
}

/** Newest store items for the homepage shelf. */
export function getRecentStoreProducts(limit = 12): StoreProduct[] {
  return [...storeProducts]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit);
}

export const stillwebPageCopy = {
  headline: "StillWeb",
  lead: "Chrome ad blocker.",
  intro: [],
  installReality: {
    title: "Install",
    body: "Chrome won't sideload a .zip in one click anymore. Unzip, then Load unpacked.",
    footnote: "",
  },
  downloadTitle: "Download",
  downloadLead: "",
  installSteps: [
    {
      title: "Download",
      body: "Grab the zip.",
    },
    {
      title: "Unzip",
      body: "Extract it somewhere permanent.",
    },
    {
      title: "chrome://extensions",
      body: "Open that URL.",
    },
    {
      title: "Developer mode",
      body: "Flip it on.",
    },
    {
      title: "Load unpacked",
      body: "Pick the unzipped folder.",
    },
  ],
  features: [
    {
      title: "Network",
      body: "EasyList + EasyPrivacy.",
    },
    {
      title: "Cosmetic",
      body: "Hides leftover ad shells.",
    },
    {
      title: "YouTube",
      body: "Extra cleanup on watch pages.",
    },
    {
      title: "Controls",
      body: "Toggle modules in settings.",
    },
    {
      title: "Updates",
      body: "Checks GitHub and prompts a reload.",
    },
  ],
  about: [
    "Built because the paid ones suck.",
  ],
};

export type GithubReleaseInfo = {
  version: string;
  downloadUrl: string;
  publishedAt: string;
};

export async function fetchLatestRelease(
  repo: string,
  assetName: string,
): Promise<GithubReleaseInfo | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/releases/latest`,
      {
        headers: { Accept: "application/vnd.github+json" },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      tag_name: string;
      published_at: string;
      assets: { name: string; browser_download_url: string }[];
    };

    const asset = data.assets.find((entry) => entry.name === assetName);
    if (!asset) {
      return null;
    }

    return {
      version: data.tag_name,
      downloadUrl: asset.browser_download_url,
      publishedAt: data.published_at,
    };
  } catch {
    return null;
  }
}
