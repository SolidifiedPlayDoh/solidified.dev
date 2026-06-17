import { Link } from "react-router-dom";

import { projects } from "../projects/registry";

import { GlitchReveal } from "./GlitchReveal";

type ProjectGridProps = {
  revealDelay?: number;
};

export function ProjectGrid({ revealDelay = 0 }: ProjectGridProps) {
  if (projects.length === 0) return null;

  return (
    <section className="soft-projects" aria-labelledby="projects-heading">
      <GlitchReveal variant="hero" delay={revealDelay}>
        <h2
          id="projects-heading"
          className="soft-projects__title soft-brand scene-headline"
          data-text="Projects"
        >
          Projects
        </h2>
      </GlitchReveal>
      <ul className="soft-projects__grid">
        {projects.map((project, idx) => (
          <li key={project.path}>
            <GlitchReveal variant="card" delay={revealDelay + 120 + idx * 95}>
              <Link to={project.path} className="soft-project-card">
                <span className="soft-project-card__glow" aria-hidden />
                <span className="soft-project-card__face">
                  {project.emoji && (
                    <span className="soft-project-card__emoji" aria-hidden>
                      {project.emoji}
                    </span>
                  )}
                  <span className="soft-project-card__name">{project.title}</span>
                  <span className="soft-project-card__desc">{project.description}</span>
                  {project.tags && project.tags.length > 0 && (
                    <span className="soft-project-card__tags">
                      {project.tags.join(" · ")}
                    </span>
                  )}
                </span>
              </Link>
            </GlitchReveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
