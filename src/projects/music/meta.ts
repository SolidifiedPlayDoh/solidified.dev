import type { ProjectDefinition } from "../registry";
import { MusicPage } from "../../pages/MusicPage";

const project: ProjectDefinition = {
  path: "/music",
  title: "Music",
  description: "mashups and remixes — listen on site or SoundCloud.",
  emoji: "🎵",
  tags: ["SoundCloud", "mashups"],
  Component: MusicPage,
};

export default project;
