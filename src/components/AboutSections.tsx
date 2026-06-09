import type { AboutSection } from "../content/hiContent";

export function AboutSections({ sections }: { sections: AboutSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} className="hi-section" aria-labelledby={`about-${section.id}`}>
          {section.title && (
            <h2 id={`about-${section.id}`} className="hi-section__title">
              {section.title}
            </h2>
          )}
          {section.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className="soft-body hi-section__body"
              {...(!section.title && i === 0 ? { id: `about-${section.id}` } : {})}
            >
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </>
  );
}
