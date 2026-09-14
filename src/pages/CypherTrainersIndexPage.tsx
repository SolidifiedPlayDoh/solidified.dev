import { Link } from "react-router-dom";

import { SiteShell } from "../components/SiteShell";
import { usePageMeta } from "../hooks/usePageMeta";
import { CYPHERS } from "../lib/ciphers/registry";

import "../styles/cypher.css";

export function CypherTrainersIndexPage() {
  usePageMeta({
    title: "Cypher trainers | Solidified.dev",
    description:
      "Practice quizzes for pigpen, Morse, Caesar, and Atbash. Learn to read cyphers with friends.",
    path: "/cyphertrainers",
    themeColor: "#f3efe6",
  });

  return (
    <SiteShell>
      <main id="main" className="soft-site cypher-page">
        <div className="soft-site__inner">
          <header className="cypher-head">
            <h1>Cypher trainers</h1>
            <p>
              Tiny practice quizzes for reading cyphers. Start with single letters. When that feels
              easy, switch to random sentences so you cannot cheat off the shape of a famous quote.
            </p>
            <p>
              If you miss, it tells you the right answer, then the next question. Share a link with
              a friend and race streaks.
            </p>
          </header>

          <ul className="cypher-index">
            {CYPHERS.map((item) => (
              <li key={item.id}>
                <Link to={`/cyphertrainers/${item.id}`}>
                  <strong>{item.name}</strong>
                  <span>{item.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </SiteShell>
  );
}
