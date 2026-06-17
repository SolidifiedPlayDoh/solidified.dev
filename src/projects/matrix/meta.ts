import type { ProjectDefinition } from "../registry";
import { MatrixPage } from "../../pages/MatrixPage";

const project: ProjectDefinition = {
  path: "/matrix",
  title: "Matrix",
  description: "Public homeserver at matrix.solidified.dev — what it is and how to join.",
  emoji: "💬",
  tags: ["chat", "Synapse", "open signup"],
  Component: MatrixPage,
};

export default project;
