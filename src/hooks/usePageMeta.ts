import { useEffect } from "react";

export type PageMeta = {
  title: string;
  description: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  themeColor?: string;
  path?: string;
};

function setMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = meta.title;
    setMeta("name", "description", meta.description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:title", meta.title);
    setMeta("property", "og:description", meta.description);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", meta.title);
    setMeta("name", "twitter:description", meta.description);

    if (meta.path) {
      const url = meta.path.startsWith("http") ? meta.path : `${window.location.origin}${meta.path}`;
      setMeta("property", "og:url", url);
      setLink("canonical", url);
    }

    if (meta.themeColor) {
      setMeta("name", "theme-color", meta.themeColor);
    }

    if (meta.image) {
      setMeta("property", "og:image", meta.image);
      setMeta("name", "twitter:image", meta.image);
      if (meta.imageWidth) setMeta("property", "og:image:width", String(meta.imageWidth));
      if (meta.imageHeight) setMeta("property", "og:image:height", String(meta.imageHeight));
      if (meta.imageAlt) {
        setMeta("property", "og:image:alt", meta.imageAlt);
        setMeta("name", "twitter:image:alt", meta.imageAlt);
      }
    }

    return () => {
      document.title = prevTitle;
    };
  }, [
    meta.title,
    meta.description,
    meta.image,
    meta.imageWidth,
    meta.imageHeight,
    meta.imageAlt,
    meta.themeColor,
    meta.path,
  ]);
}
