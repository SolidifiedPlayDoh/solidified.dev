type FullscreenElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
  webkitRequestFullScreen?: () => Promise<void> | void;
};

export function isFullscreen(): boolean {
  const doc = document as Document & { webkitFullscreenElement?: Element | null };
  return Boolean(document.fullscreenElement || doc.webkitFullscreenElement);
}

export async function requestPageFullscreen(): Promise<boolean> {
  if (isFullscreen()) return true;
  const el = document.documentElement as FullscreenElement;
  try {
    if (el.requestFullscreen) {
      try {
        await el.requestFullscreen({ navigationUI: "hide" });
      } catch {
        await el.requestFullscreen();
      }
      return true;
    }
    const webkit = el.webkitRequestFullscreen ?? el.webkitRequestFullScreen;
    if (webkit) {
      await webkit.call(el);
      return true;
    }
  } catch {
    /* autoplay / permissions — caller retries on a user gesture */
  }
  return isFullscreen();
}
