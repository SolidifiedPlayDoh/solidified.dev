import { Link } from "react-router-dom";

import { SiteShell } from "../components/SiteShell";
import { usePageMeta } from "../hooks/usePageMeta";
import { CYPHERS } from "../lib/ciphers/registry";

import "../styles/cypher.css";

export function CypherTrainersIndexPage() {
  usePageMeta({
    title: "Cypher trainers | Solidified.dev",
    description:
      "50-question quizzes for pigpen, Morse, and Atbash. Timed letters with a graph of slow symbols.",
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
              50-question quizzes. Letters are timed so you get a graph of which symbols slow you
              down. Misses show the right answer, then the next question.
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
