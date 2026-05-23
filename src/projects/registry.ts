import type { ComponentType } from "react";

export type ProjectDefinition = {
  path: string;
  title: string;
  description: string;
  emoji?: string;
  tags?: string[];
  Component: ComponentType;
};

const modules = import.meta.glob<{ default: ProjectDefinition }>(
  "./*/meta.ts",
  { eager: true },
);

/** All projects under `src/projects/<name>/meta.ts`, sorted by title. */
export const projects: ProjectDefinition[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.title.localeCompare(b.title));
