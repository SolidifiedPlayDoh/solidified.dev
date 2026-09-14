export type CypherId = "pigpen" | "morse" | "caesar" | "atbash";

export type CypherMeta = {
  id: CypherId;
  name: string;
  title: string;
  blurb: string;
  how: string;
};

export const CYPHERS: CypherMeta[] = [
  {
    id: "pigpen",
    name: "Pigpen",
    title: "Pigpen cypher",
    blurb: "Each letter is a piece of a tic-tac-toe grid or an X. Learn to read the shapes.",
    how: "A–I live in a tic-tac-toe board. J–R are the same shapes with a dot. S–Z are the four corners of an X, then those same corners with a dot.",
  },
  {
    id: "morse",
    name: "Morse",
    title: "Morse code",
    blurb: "Dots and dashes for each letter. Start with one symbol, then read whole lines.",
    how: "A short beep is a dot (·). A long beep is a dash (–). Letters are separated by a space. Words are separated by /.",
  },
  {
    id: "caesar",
    name: "Caesar",
    title: "Caesar shift",
    blurb: "Every letter slides forward in the alphabet by a fixed number.",
    how: "If the shift is 3, A becomes D, B becomes E, and so on. Z wraps around to C. The quiz tells you the shift so you can practice doing it in your head.",
  },
  {
    id: "atbash",
    name: "Atbash",
    title: "Atbash cypher",
    blurb: "A mirrors Z, B mirrors Y, and the alphabet folds in half.",
    how: "Write the alphabet forward, then backward under it. A lines up with Z, B with Y, C with X. Same mapping both ways.",
  },
];

export function getCypher(id: string | undefined): CypherMeta | undefined {
  if (!id) return undefined;
  return CYPHERS.find((item) => item.id === id.toLowerCase());
}
