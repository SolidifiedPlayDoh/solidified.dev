import { useEffect } from "react";

import { youtubeChannelUrl } from "../content/youtubeContent";

/** Legacy /music bookmarks → YouTube channel */
export function MusicRedirect() {
  useEffect(() => {
    window.location.replace(youtubeChannelUrl);
  }, []);

  return (
    <p>
      Taking you to{" "}
      <a href={youtubeChannelUrl} rel="noopener noreferrer" target="_blank">
        YouTube
      </a>
      …
    </p>
  );
}
