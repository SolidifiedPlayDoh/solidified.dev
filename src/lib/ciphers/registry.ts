export type CypherId = "pigpen" | "morse" | "atbash";

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
    how: "A–I live in a tic-tac-toe board. J–R are the same shapes with a dot. On the X, S is the top, T left, U right, V bottom. W–Z are those same corners with a dot.",
  },
  {
    id: "morse",
    name: "Morse",
    title: "Morse code",
    blurb: "Dots and dashes for each letter. Start with one symbol, then read whole lines.",
    how: "A short beep is a dot (·). A long beep is a dash (–). Letters are separated by a space. Words are separated by /.",
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
