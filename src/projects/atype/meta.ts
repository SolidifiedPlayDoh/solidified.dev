import type { ProjectDefinition } from "../registry";
import { ATypePage } from "../../pages/ATypePage";

const project: ProjectDefinition = {
  path: "/atype",
  title: "AType",
  description: "Circles with dots. Read the gaps.",
  emoji: "◎",
  tags: ["typeface", "download"],
  Component: ATypePage,
};

export default project;
