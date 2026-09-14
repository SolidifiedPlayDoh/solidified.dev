import { PigpenGlyph } from "./PigpenGlyph";
import { encodeMorseLetter } from "../lib/ciphers/morse";
import { atbashLetter, atbashText, shiftLetter, shiftText } from "../lib/ciphers/shift";
import { isPigpenLetter } from "../lib/ciphers/pigpen";
import type { CypherId } from "../lib/ciphers/registry";

type CipherPromptProps = {
  cypher: CypherId;
  text: string;
  shift?: number;
  size?: "letter" | "sentence";
};

function MorseMarks({ code }: { code: string }) {
  return (
    <span className="cypher-morse" aria-hidden>
      {code.split("").map((mark, i) => (
        <span key={`${mark}-${i}`} className={mark === "." ? "cypher-morse__dot" : "cypher-morse__dash"}>
          {mark === "." ? "·" : "–"}
        </span>
      ))}
    </span>
  );
}

export function CipherPrompt({ cypher, text, shift = 3, size = "letter" }: CipherPromptProps) {
  const glyphSize = size === "letter" ? 120 : 52;

  if (cypher === "pigpen") {
    return (
      <div className={`cypher-glyphs cypher-glyphs--${size}`} aria-hidden>
        {text.split(" ").map((word, wi) => (
          <span key={`w-${wi}`} className="cypher-glyphs__word">
            {word.split("").map((ch, i) => {
              if (!isPigpenLetter(ch)) {
                return (
                  <span key={`ch-${i}`} className="cypher-glyphs__plain">
                    {ch}
                  </span>
                );
              }
              return <PigpenGlyph key={`${ch}-${i}`} letter={ch} size={glyphSize} />;
            })}
          </span>
        ))}
      </div>
    );
  }

  if (cypher === "morse") {
    if (size === "letter") {
      const code = encodeMorseLetter(text) ?? "";
      return (
        <p className="cypher-morse-block" aria-hidden>
          <MorseMarks code={code} />
        </p>
      );
    }
    return (
      <p className="cypher-morse-line" aria-hidden>
        {text.split(" ").map((word, wi) => (
          <span key={`w-${wi}`} className="cypher-morse-word">
            {word.split("").map((ch, ci) => {
              const code = encodeMorseLetter(ch);
              if (!code) return null;
              return (
                <span key={`${ch}-${ci}`} className="cypher-morse-letter">
                  <MorseMarks code={code} />
                </span>
              );
            })}
          </span>
        ))}
      </p>
    );
  }

  if (cypher === "caesar") {
    const shown = size === "letter" ? shiftLetter(text, shift) : shiftText(text, shift);
    return (
      <p className={`cypher-latin cypher-latin--${size}`} aria-hidden>
        {shown}
      </p>
    );
  }

  const shown = size === "letter" ? atbashLetter(text) : atbashText(text);
  return (
    <p className={`cypher-latin cypher-latin--${size}`} aria-hidden>
      {shown}
    </p>
  );
}

export function PigpenChart() {
  const rows = ["ABCDEFGHI", "JKLMNOPQR", "STUV", "WXYZ"];
  const labels = ["A–I (grid)", "J–R (grid + dot)", "S–V (X)", "W–Z (X + dot)"];

  return (
    <div className="cypher-chart">
      {rows.map((row, i) => (
        <div key={row} className="cypher-chart__row">
          <p className="cypher-chart__label">{labels[i]}</p>
          <div className="cypher-chart__glyphs">
            {row.split("").map((letter) => (
              <div key={letter} className="cypher-chart__cell">
                <PigpenGlyph letter={letter} size={44} />
                <span>{letter}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MorseChart() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  return (
    <div className="cypher-chart cypher-chart--morse">
      {letters.map((letter) => (
        <div key={letter} className="cypher-chart__cell">
          <MorseMarks code={encodeMorseLetter(letter) ?? ""} />
          <span>{letter}</span>
        </div>
      ))}
    </div>
  );
}
