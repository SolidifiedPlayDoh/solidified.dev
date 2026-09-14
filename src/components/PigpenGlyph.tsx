import { pigpenShape } from "../lib/ciphers/pigpen";

type PigpenGlyphProps = {
  letter: string;
  size?: number;
  className?: string;
};

function GridGlyph({ col, row, dotted }: { col: number; row: number; dotted: boolean }) {
  const cell = 22;
  const origin = 18;
  const x0 = origin + col * cell;
  const y0 = origin + row * cell;
  const x1 = x0 + cell;
  const y1 = y0 + cell;
  const n = row > 0;
  const s = row < 2;
  const w = col > 0;
  const e = col < 2;

  return (
    <>
      {n && <line x1={x0} y1={y0} x2={x1} y2={y0} />}
      {s && <line x1={x0} y1={y1} x2={x1} y2={y1} />}
      {w && <line x1={x0} y1={y0} x2={x0} y2={y1} />}
      {e && <line x1={x1} y1={y0} x2={x1} y2={y1} />}
      {dotted && (
        <circle cx={(x0 + x1) / 2} cy={(y0 + y1) / 2} r="4.2" fill="currentColor" stroke="none" />
      )}
    </>
  );
}

function WedgeGlyph({ dir, dotted }: { dir: "n" | "e" | "s" | "w"; dotted: boolean }) {
  const c = 50;
  const span = 28;
  const nw: [number, number] = [c - span, c - span];
  const ne: [number, number] = [c + span, c - span];
  const se: [number, number] = [c + span, c + span];
  const sw: [number, number] = [c - span, c + span];
  const rays =
    dir === "n"
      ? [nw, ne]
      : dir === "e"
        ? [ne, se]
        : dir === "s"
          ? [sw, se]
          : [nw, sw];
  const dots = { n: [c, c - 14], e: [c + 14, c], s: [c, c + 14], w: [c - 14, c] } as const;
  const [dx, dy] = dots[dir];
  const nudge = { n: "translate(0 10)", e: "translate(-10 0)", s: "translate(0 -10)", w: "translate(10 0)" };

  return (
    <g transform={nudge[dir]}>
      <line x1={c} y1={c} x2={rays[0][0]} y2={rays[0][1]} />
      <line x1={c} y1={c} x2={rays[1][0]} y2={rays[1][1]} />
      {dotted && <circle cx={dx} cy={dy} r="4.2" fill="currentColor" stroke="none" />}
    </g>
  );
}

export function PigpenGlyph({ letter, size = 88, className }: PigpenGlyphProps) {
  const shape = pigpenShape(letter);
  if (!shape) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        {shape.kind === "grid" ? (
          <GridGlyph col={shape.col} row={shape.row} dotted={shape.dotted} />
        ) : (
          <WedgeGlyph dir={shape.dir} dotted={shape.dotted} />
        )}
      </g>
    </svg>
  );
}
