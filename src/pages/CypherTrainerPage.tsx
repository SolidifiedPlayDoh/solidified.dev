import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";

import { CipherPrompt, MorseChart, PigpenChart } from "../components/CipherPrompt";
import { SiteShell } from "../components/SiteShell";
import { usePageMeta } from "../hooks/usePageMeta";
import {
  choiceDistractors,
  normalizeGuess,
  randomLetter,
  randomPhrase,
  shuffle,
} from "../lib/ciphers/phrases";
import { CYPHERS, getCypher, type CypherId } from "../lib/ciphers/registry";

import "../styles/cypher.css";

type Mode = "letters" | "type" | "choice";
type Phase = "ask" | "feedback";

type Question = {
  answer: string;
  shift?: number;
  choices?: string[];
};

function nextQuestion(cypher: CypherId, mode: Mode, previous?: string): Question {
  if (mode === "letters") {
    const shift = cypher === "caesar" ? 1 + Math.floor(Math.random() * 12) : undefined;
    return { answer: randomLetter(previous), shift };
  }

  let phrase = randomPhrase();
  const prev = previous ? normalizeGuess(previous) : "";
  while (normalizeGuess(phrase) === prev) {
    phrase = randomPhrase();
  }
  const shift = cypher === "caesar" ? 1 + Math.floor(Math.random() * 12) : undefined;
  if (mode === "choice") {
    return {
      answer: phrase,
      shift,
      choices: shuffle([phrase, ...choiceDistractors(phrase, 3)]),
    };
  }
  return { answer: phrase, shift };
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
  const [phase, setPhase] = useState<Phase>("ask");
  const [question, setQuestion] = useState<Question>(() => nextQuestion(cypher, "letters"));
  const [typed, setTyped] = useState("");
  const [guess, setGuess] = useState("");
  const [correct, setCorrect] = useState(false);
  const [right, setRight] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showKey, setShowKey] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  usePageMeta({
    title: `${title} trainer | Solidified.dev`,
    description: `Practice reading ${name}. Letters first, then whole sentences.`,
    path: `/cyphertrainers/${cypher}`,
    themeColor: "#f3efe6",
  });

  const goNext = useCallback(
    (nextMode: Mode = mode) => {
      setQuestion((prev) => nextQuestion(cypher, nextMode, prev.answer));
      setPhase("ask");
      setTyped("");
      setGuess("");
      setCorrect(false);
    },
    [cypher, mode],
  );

  const changeMode = (next: Mode) => {
    setMode(next);
    setRight(0);
    setWrong(0);
    setStreak(0);
    setQuestion(nextQuestion(cypher, next));
    setPhase("ask");
    setTyped("");
    setGuess("");
    setCorrect(false);
    setShowKey(false);
  };

  const grade = useCallback(
    (value: string) => {
      if (phase !== "ask") return;
      const expected = normalizeGuess(question.answer);
      const got = normalizeGuess(value);
      if (!got) return;
      const ok = got === expected;
      setGuess(got);
      setCorrect(ok);
      setPhase("feedback");
      if (ok) {
        setRight((n) => n + 1);
        setStreak((n) => n + 1);
      } else {
        setWrong((n) => n + 1);
        setStreak(0);
      }
    },
    [phase, question.answer],
  );

  useEffect(() => {
    if (mode !== "letters" || phase !== "ask") return;

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.length !== 1) return;
      if (!/[a-z]/i.test(event.key)) return;
      event.preventDefault();
      grade(event.key);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [grade, mode, phase]);

  useEffect(() => {
    if (mode === "type" && phase === "ask") {
      inputRef.current?.focus();
    }
  }, [mode, phase, question.answer]);

  useEffect(() => {
    if (phase !== "feedback" || !correct) return;
    const id = window.setTimeout(() => goNext(), 850);
    return () => window.clearTimeout(id);
  }, [phase, correct, goNext]);

  const promptSize = mode === "letters" ? "letter" : "sentence";
  const expected = useMemo(() => normalizeGuess(question.answer), [question.answer]);

  return (
    <SiteShell>
      <main id="main" className="soft-site cypher-page">
        <div className="soft-site__inner">
          <header className="cypher-head">
            <h1>{title}</h1>
            <p>{how}</p>
          </header>

          <div className="cypher-modes" role="tablist" aria-label="Practice mode">
            <ModeButton current={mode} id="letters" onPick={changeMode}>
              Letters
            </ModeButton>
            <ModeButton current={mode} id="type" onPick={changeMode}>
              Type a sentence
            </ModeButton>
            <ModeButton current={mode} id="choice" onPick={changeMode}>
              Multiple choice
            </ModeButton>
          </div>

          <p className="cypher-score">
            {right} right · {wrong} wrong · streak {streak}
          </p>

          <section className="cypher-card" aria-live="polite">
            {cypher === "caesar" && question.shift != null && (
              <p className="cypher-hint">Shift is {question.shift}. Undo it to get the real letter.</p>
            )}

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
              shift={question.shift}
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
                  <p>Yes — {expected}</p>
                ) : (
                  <p>
                    Not quite. You said {guess || "nothing"}. The right answer is{" "}
                    <strong>{expected}</strong>.
                  </p>
                )}
                <button type="button" onClick={() => goNext()}>
                  Next
                </button>
              </div>
            )}
          </section>

          <details
            className="cypher-key"
            open={showKey}
            onToggle={(event) => setShowKey(event.currentTarget.open)}
          >
            <summary>Show the key (peek if you get stuck)</summary>
            {cypher === "pigpen" && <PigpenChart />}
            {cypher === "morse" && <MorseChart />}
            {cypher === "caesar" && (
              <p className="cypher-key__note">
                Count forward {question.shift ?? 3} letters for the cypher, or backward the same
                amount to decode.
              </p>
            )}
            {cypher === "atbash" && (
              <p className="cypher-key__note">A↔Z · B↔Y · C↔X · D↔W · E↔V · F↔U · G↔T · H↔S · I↔R · J↔Q · K↔P · L↔O · M↔N</p>
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
