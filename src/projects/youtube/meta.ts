import type { ProjectDefinition } from "../registry";
import { youtubeChannelUrl } from "../../content/youtubeContent";

const project: ProjectDefinition = {
  path: "/youtube",
  title: "YouTube",
  description: "mashups and remixes. audio lives here now.",
  emoji: "🎵",
  tags: ["YouTube", "remixes"],
  externalHref: youtubeChannelUrl,
};

export default project;
