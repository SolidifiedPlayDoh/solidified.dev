import type { ProjectDefinition } from "../registry";
import { FemtanylFNFPage } from "../../pages/FemtanylFNFPage";

const project: ProjectDefinition = {
  path: "/femtanylFNF",
  title: "Femtanyl FNF Animator",
  description:
    "Keyboard-driven sprite animator for the Femtanyl mod — arrow keys play the premade poses.",
  emoji: "🎭",
  tags: ["FNF", "WebGL"],
  Component: FemtanylFNFPage,
};

export default project;
