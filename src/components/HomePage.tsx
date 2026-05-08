import { homeCopy } from "../content/site";

export function HomePage() {
  return (
    <div className="grid-floor home-shell">
      <header className="home-hero">
        <p className="neon-hero crt-bloom home-title">{homeCopy.headline}</p>
        <p className="body-copy home-lead">{homeCopy.lead}</p>
        <ul className="home-notes">
          {homeCopy.notes.map((line) => (
            <li key={line} className="neon-sub">
              {line}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}
