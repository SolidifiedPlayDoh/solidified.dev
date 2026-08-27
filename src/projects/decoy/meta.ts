import type { ProjectDefinition } from "../registry";
import { DecoyPage } from "../../pages/DecoyPage";

const project: ProjectDefinition = {
  path: "/decoy",
  title: "Decoy",
  description: "fake iPhone home screen apps. custom name, custom icon, safari add to home screen.",
  emoji: "◈",
  tags: ["Tools", "Web", "iOS"],
  Component: DecoyPage,
};

export default project;
