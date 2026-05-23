import { Link } from "react-router-dom";

import { projects } from "../projects/registry";

export function ProjectGrid() {
  if (projects.length === 0) return null;

  return (
    <section className="soft-projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading" className="soft-projects__title">
        Projects
      </h2>
      <ul className="soft-projects__grid">
        {projects.map((project) => (
          <li key={project.path}>
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
          </li>
        ))}
      </ul>
    </section>
  );
}
