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
  installReality: {
    title: "Why isn’t it just one click?",
    body: "Chrome used to install .crx files straight from a download — click, confirm, done. Google removed that on Windows and Mac years ago. A .zip or .crx from a website won’t auto-add itself anymore.",
    footnote:
      "Setup takes about a minute — no coding, just a few clicks in Chrome. You only do it once.",
  },
  downloadTitle: "Get StillWeb",
  downloadLead:
    "Download the latest build, unzip it once, then tell Chrome to load that folder.",
  installSteps: [
    {
      title: "Download",
      body: "Grab the zip below. It’s the extension folder, packed up.",
    },
    {
      title: "Unzip",
      body: "Double-click the zip. Leave the folder somewhere you won’t delete (Downloads is fine).",
    },
    {
      title: "Open Extensions",
      body: "Type chrome://extensions in your address bar and hit Enter.",
    },
    {
      title: "Developer mode on",
      body: "Flip the Developer mode switch in the top-right. Sounds scary — it’s just Chrome’s “install from folder” mode.",
    },
    {
      title: "Load unpacked",
      body: "Click Load unpacked, pick the folder you unzipped. StillWeb shows up in your toolbar. Done.",
    },
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
