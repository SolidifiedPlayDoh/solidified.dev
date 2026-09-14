export const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type GridCell = { kind: "grid"; col: number; row: number; dotted: boolean };
type WedgeCell = { kind: "wedge"; dir: "n" | "e" | "s" | "w"; dotted: boolean };

export type PigpenShape = GridCell | WedgeCell;

const GRID_LETTERS = "ABCDEFGHI";
const GRID_DOT_LETTERS = "JKLMNOPQR";
const WEDGE_ORDER: Array<WedgeCell["dir"]> = ["n", "w", "e", "s"];

export function pigpenShape(letter: string): PigpenShape | null {
  const ch = letter.toUpperCase();
  const grid = GRID_LETTERS.indexOf(ch);
  if (grid >= 0) {
    return { kind: "grid", col: grid % 3, row: Math.floor(grid / 3), dotted: false };
  }
  const dotted = GRID_DOT_LETTERS.indexOf(ch);
  if (dotted >= 0) {
    return { kind: "grid", col: dotted % 3, row: Math.floor(dotted / 3), dotted: true };
  }
  const wedgePlain = "STUV".indexOf(ch);
  if (wedgePlain >= 0) {
    return { kind: "wedge", dir: WEDGE_ORDER[wedgePlain], dotted: false };
  }
  const wedgeDot = "WXYZ".indexOf(ch);
  if (wedgeDot >= 0) {
    return { kind: "wedge", dir: WEDGE_ORDER[wedgeDot], dotted: true };
  }
  return null;
}

export function isPigpenLetter(ch: string): boolean {
  return pigpenShape(ch) !== null;
}
