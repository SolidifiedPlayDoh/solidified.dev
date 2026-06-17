import type { ProjectDefinition } from "../registry";
import { StorePage } from "../../pages/StorePage";

const project: ProjectDefinition = {
  path: "/store",
  title: "Store",
  description: "free downloads — extensions and tools, no checkout required.",
  emoji: "⬇",
  tags: ["downloads", "free"],
  Component: StorePage,
};

export default project;
