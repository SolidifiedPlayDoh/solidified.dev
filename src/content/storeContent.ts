export type StoreProduct = {
  slug: string;
  path: string;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  priceLabel: string;
  tags: string[];
  githubRepo: string;
  releaseAssetName: string;
  /** ISO date — used to sort the homepage shelf (newest first). */
  addedAt: string;
  isNew?: boolean;
};

export const storePageCopy = {
  headline: "Store",
  lead: "Stuff I build that you can actually download. No accounts, no checkout flow — just grab it.",
};

export const storeProducts: StoreProduct[] = [
  {
    slug: "stillweb",
    path: "/store/stillweb",
    name: "StillWeb",
    tagline: "The ad blocker that just works.",
    description:
      "Free Chrome extension. Blocks ads and clutter without subscriptions, logins, or nonsense.",
    emoji: "◉",
    priceLabel: "Free",
    tags: ["Chrome", "Extension", "Ad blocker"],
    githubRepo: "SolidifiedPlayDoh/stillweb",
    releaseAssetName: "stillweb-chrome.zip",
    addedAt: "2026-06-10",
    isNew: true,
  },
];

/** Newest store items for the homepage shelf. */
export function getRecentStoreProducts(limit = 12): StoreProduct[] {
  return [...storeProducts]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, limit);
}

export const stillwebPageCopy = {
  headline: "StillWeb",
  lead: "The ad blocker that just works.",
  intro: [
    "StillWeb blocks ads and trackers in Chrome. No account. No credit card. No premium tier. Turn it on and browse.",
    "I built it because I was tired of extensions that cost money, break on sites, or dump you on a confusing GitHub page when you just want the thing.",
  ],
  features: [
    {
      title: "Network blocking",
      body: "Stops ad and tracker requests with EasyList + EasyPrivacy rules.",
    },
    {
      title: "Cosmetic cleanup",
      body: "Hides leftover ad boxes and empty slots the network layer misses.",
    },
    {
      title: "YouTube mode",
      body: "Extra cleanup on YouTube — promos, overlays, and watch-page clutter.",
    },
    {
      title: "Control panel",
      body: "Toggle modules on or off from a full settings page inside the extension.",
    },
  ],
  installSteps: [
    {
      title: "Download",
      body: "Click the button below. You get a .zip file — that is the extension.",
    },
    {
      title: "Unzip it",
      body: "Double-click the zip so you have a folder (stillweb-chrome or similar).",
    },
    {
      title: "Open Chrome extensions",
      body: "Go to chrome://extensions in your address bar.",
    },
    {
      title: "Turn on Developer mode",
      body: "Toggle it on in the top-right corner of the extensions page.",
    },
    {
      title: "Load unpacked",
      body: "Click Load unpacked and choose the folder you unzipped. Done.",
    },
  ],
  about: [
    "I made StillWeb because I got tired of extensions that cost money, do not work, or get blocked on sites. I just wanted an ad blocker that worked without any fuss.",
    "Free forever. No paywall. No signup. It just blocks ads — like it is supposed to.",
    "Chrome did not have many options that felt this simple, so I built my own.",
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
