import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { CipherPrompt, MorseChart, PigpenChart } from "../components/CipherPrompt";
import { QuizTimingChart, type QuizHit } from "../components/QuizTimingChart";
import { SiteShell } from "../components/SiteShell";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  choiceDistractors,
  letterQuizDeck,
  normalizeGuess,
  randomPhrase,
  shuffle,
} from "../lib/ciphers/phrases";
import { CYPHERS, getCypher, type CypherId } from "../lib/ciphers/registry";

import "../styles/cypher.css";

const QUIZ_LEN = 50;

type Mode = "letters" | "type" | "choice";
type Phase = "ask" | "feedback";
type Status = "ready" | "running" | "done";

type Question = {
  answer: string;
  choices?: string[];
};

type Trial = {
  answer: string;
  guess: string;
  ms: number;
  correct: boolean;
};

function makeQuestions(mode: Mode): Question[] {
  if (mode === "letters") {
    return letterQuizDeck(QUIZ_LEN).map((letter) => ({
      answer: letter,
    }));
  }

  const items: Question[] = [];
  let previous = "";
  for (let i = 0; i < QUIZ_LEN; i++) {
    let phrase = randomPhrase();
    while (normalizeGuess(phrase) === previous) {
      phrase = randomPhrase();
    }
    previous = normalizeGuess(phrase);
    if (mode === "choice") {
      items.push({
        answer: phrase,
        choices: shuffle([phrase, ...choiceDistractors(phrase, 3)]),
      });
    } else {
      items.push({ answer: phrase });
    }
  }
  return items;
}

export function CypherTrainerPage() {
  const { cypher: slug = "" } = useParams();
  const meta = getCypher(slug);

  if (!meta) {
    return <UnknownCypher slug={slug} />;
  }

  return (
    <Trainer
      key={meta.id}
      cypher={meta.id}
      name={meta.name}
      title={meta.title}
      how={meta.how}
    />
  );
}

function UnknownCypher({ slug }: { slug: string }) {
  usePageMeta({
    title: "Unknown cypher | Solidified.dev",
    description: "That cypher trainer is not on the list yet.",
    path: `/cyphertrainers/${slug}`,
    themeColor: "#f3efe6",
  });

  return (
    <SiteShell>
      <main id="main" className="soft-site cypher-page">
        <div className="soft-site__inner">
          <h1>No trainer for “{slug}”</h1>
          <p>These are the ones that exist right now:</p>
          <ul>
            {CYPHERS.map((item) => (
              <li key={item.id}>
                <Link to={`/cyphertrainers/${item.id}`}>{item.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </SiteShell>
  );
}

function Trainer({
  cypher,
  name,
  title,
  how,
}: {
  cypher: CypherId;
  name: string;
  title: string;
  how: string;
}) {
  const [mode, setMode] = useState<Mode>("letters");
  const [status, setStatus] = useState<Status>("ready");
  const [phase, setPhase] = useState<Phase>("ask");
  const [deck, setDeck] = useState<Question[]>(() => makeQuestions("letters"));
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [guess, setGuess] = useState("");
  const [correct, setCorrect] = useState(false);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [showKey, setShowKey] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shownAt = useRef(0);

  const question = deck[index] ?? deck[0];
  const answered = trials.length;
  const right = trials.filter((trial) => trial.correct).length;
  const percent = answered === 0 ? 0 : Math.round((right / answered) * 100);
  const finalPercent = Math.round((right / QUIZ_LEN) * 100);

  usePageMeta({
    title: `${title} quiz | Solidified.dev`,
    description: `50-question ${name} quiz. Timed letters with a graph of which symbols slow you down.`,
    path: `/cyphertrainers/${cypher}`,
    themeColor: "#f3efe6",
  });

  const resetQuiz = useCallback(
    (nextMode: Mode) => {
      setMode(nextMode);
      setDeck(makeQuestions(nextMode));
      setIndex(0);
      setStatus("ready");
      setPhase("ask");
      setTyped("");
      setGuess("");
      setCorrect(false);
      setTrials([]);
      setShowKey(false);
    },
    [cypher],
  );

  const startQuiz = () => {
    setStatus("running");
    setPhase("ask");
    shownAt.current = performance.now();
  };

  const goNext = useCallback(() => {
    if (index + 1 >= QUIZ_LEN) {
      setStatus("done");
      setPhase("ask");
      return;
    }
    setIndex((n) => n + 1);
    setPhase("ask");
    setTyped("");
    setGuess("");
    setCorrect(false);
  }, [index]);

  const grade = useCallback(
    (value: string) => {
      if (status !== "running" || phase !== "ask") return;
      const expected = normalizeGuess(question.answer);
      const got = normalizeGuess(value);
      if (!got) return;
      const ok = got === expected;
      const ms = Math.max(0, Math.round(performance.now() - shownAt.current));
      setGuess(got);
      setCorrect(ok);
      setPhase("feedback");
      setTrials((rows) => [
        ...rows,
        { answer: expected, guess: got, ms, correct: ok },
      ]);
    },
    [phase, question.answer, status],
  );

  useEffect(() => {
    if (status !== "running" || phase !== "ask") return;
    shownAt.current = performance.now();
  }, [index, phase, status]);

  useEffect(() => {
    if (mode !== "letters" || status !== "running" || phase !== "ask") return;

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.length !== 1) return;
      if (!/[a-z]/i.test(event.key)) return;
      event.preventDefault();
      grade(event.key);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [grade, mode, phase, status]);

  useEffect(() => {
    if (mode === "type" && status === "running" && phase === "ask") {
      inputRef.current?.focus();
    }
  }, [mode, phase, status, question.answer]);

  useEffect(() => {
    if (status !== "running" || phase !== "feedback") return;
    const wait = correct ? 400 : 1100;
    const id = window.setTimeout(() => goNext(), wait);
    return () => window.clearTimeout(id);
  }, [correct, goNext, phase, status]);

  const promptSize = mode === "letters" ? "letter" : "sentence";
  const expected = useMemo(() => normalizeGuess(question?.answer ?? ""), [question?.answer]);
  const letterHits: QuizHit[] = trials.map((trial) => ({
    letter: trial.answer,
    ms: trial.ms,
    correct: trial.correct,
  }));

  return (
    <SiteShell>
      <main id="main" className="soft-site cypher-page">
        <div className="soft-site__inner">
          <header className="cypher-head">
            <h1>{title}</h1>
            <p>{how}</p>
          </header>

          <div className="cypher-modes" role="tablist" aria-label="Quiz type">
            <ModeButton current={mode} id="letters" onPick={resetQuiz}>
              Letters
            </ModeButton>
            <ModeButton current={mode} id="type" onPick={resetQuiz}>
              Type a sentence
            </ModeButton>
            <ModeButton current={mode} id="choice" onPick={resetQuiz}>
              Multiple choice
            </ModeButton>
          </div>

          {status === "ready" && (
            <section className="cypher-card">
              <p className="cypher-ask">
                {QUIZ_LEN} questions.{" "}
                {mode === "letters"
                  ? "A symbol shows, then you press the letter. Each press is timed so the graph can show which ones slow you down."
                  : "Same length as the letter quiz. You get a percent at the end."}
              </p>
              <button type="button" onClick={startQuiz}>
                Start quiz
              </button>
            </section>
          )}

          {status === "running" && (
            <>
              <p className="cypher-score">
                Question {index + 1} of {QUIZ_LEN}
                {answered > 0 ? ` · ${percent}% right so far` : null}
              </p>
              <div className="cypher-progress" aria-hidden>
                <span style={{ width: `${(answered / QUIZ_LEN) * 100}%` }} />
              </div>

              <section className="cypher-card" aria-live="polite">
                <p className="cypher-ask">
                  {mode === "letters"
                    ? "What letter is this? Press it on your keyboard."
                    : mode === "type"
                      ? "Type what it says."
                      : "Which one matches the cypher?"}
                </p>

                <CipherPrompt
                  cypher={cypher}
                  text={question.answer}
                  size={promptSize}
                />

                {mode === "type" && phase === "ask" && (
                  <form
                    className="cypher-type"
                    onSubmit={(event: FormEvent) => {
                      event.preventDefault();
                      grade(typed);
                    }}
                  >
                    <label htmlFor="cypher-guess">Your answer</label>
                    <input
                      id="cypher-guess"
                      ref={inputRef}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      value={typed}
                      onChange={(event) => setTyped(event.target.value)}
                    />
                    <button type="submit">Check</button>
                  </form>
                )}

                {mode === "choice" && phase === "ask" && (
                  <div className="cypher-choices">
                    {question.choices?.map((option) => (
                      <button key={option} type="button" onClick={() => grade(option)}>
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {phase === "feedback" && (
                  <div className={`cypher-feedback ${correct ? "is-right" : "is-wrong"}`}>
                    {correct ? (
                      <p>
                        Yes — {expected}
                        {mode === "letters" ? ` · ${trials[trials.length - 1]?.ms ?? 0} ms` : null}
                      </p>
                    ) : (
                      <p>
                        Not quite. You said {guess || "nothing"}. The right answer is{" "}
                        <strong>{expected}</strong>.
                      </p>
                    )}
                  </div>
                )}
              </section>
            </>
          )}

          {status === "done" && (
            <section className="cypher-card cypher-results">
              <p className="cypher-results__percent">{finalPercent}%</p>
              <p>
                {right} of {QUIZ_LEN} right
                {mode === "letters"
                  ? ` · ${Math.round(trials.reduce((sum, trial) => sum + trial.ms, 0) / trials.length)} ms average`
                  : null}
              </p>
              {mode === "letters" ? <QuizTimingChart hits={letterHits} /> : null}
              <button type="button" onClick={() => resetQuiz(mode)}>
                Take again
              </button>
            </section>
          )}

          <details
            className="cypher-key"
            open={showKey}
            onToggle={(event) => setShowKey(event.currentTarget.open)}
          >
            <summary>Show the key (peek if you get stuck)</summary>
            {cypher === "pigpen" && <PigpenChart />}
            {cypher === "morse" && <MorseChart />}
            {cypher === "atbash" && (
              <p className="cypher-key__note">
                A↔Z · B↔Y · C↔X · D↔W · E↔V · F↔U · G↔T · H↔S · I↔R · J↔Q · K↔P · L↔O · M↔N
              </p>
            )}
          </details>
        </div>
      </main>
    </SiteShell>
  );
}

function ModeButton({
  current,
  id,
  onPick,
  children,
}: {
  current: Mode;
  id: Mode;
  onPick: (mode: Mode) => void;
  children: string;
}) {
  const selected = current === id;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      className={selected ? "is-on" : undefined}
      onClick={() => onPick(id)}
    >
      {children}
    </button>
  );
}
