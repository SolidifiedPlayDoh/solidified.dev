import { alphabetLetters } from "../lib/ciphers/phrases";

export type QuizHit = {
  letter: string;
  ms: number;
  correct: boolean;
};

type Bucket = {
  letter: string;
  avgMs: number;
  misses: number;
  hits: number;
};

function bucketsFromHits(hits: QuizHit[]): Bucket[] {
  const letters = alphabetLetters();
  return letters.map((letter) => {
    const rows = hits.filter((hit) => hit.letter === letter);
    const hitsN = rows.length;
    const avgMs =
      hitsN === 0 ? 0 : Math.round(rows.reduce((sum, row) => sum + row.ms, 0) / hitsN);
    return {
      letter,
      avgMs,
      misses: rows.filter((row) => !row.correct).length,
      hits: hitsN,
    };
  });
}

export function QuizTimingChart({ hits }: { hits: QuizHit[] }) {
  const buckets = bucketsFromHits(hits);
  const timed = buckets.filter((bucket) => bucket.hits > 0);
  const maxMs = Math.max(800, ...timed.map((bucket) => bucket.avgMs));
  const chartH = 160;
  const chartW = 520;
  const gap = 4;
  const barW = (chartW - gap * (buckets.length - 1)) / buckets.length;
  const slow = [...timed].sort((a, b) => b.avgMs - a.avgMs).slice(0, 3);

  return (
    <figure className="cypher-chart-wrap">
      <figcaption>
        Average time to press each letter. Taller bars are slower — those are the ones to drill.
      </figcaption>
      <svg
        className="cypher-timechart"
        viewBox={`0 0 ${chartW} ${chartH + 28}`}
        role="img"
        aria-label="Average reaction time for each letter"
      >
        {buckets.map((bucket, i) => {
          const h = bucket.hits === 0 ? 0 : Math.max(2, (bucket.avgMs / maxMs) * chartH);
          const x = i * (barW + gap);
          const y = chartH - h;
          const miss = bucket.misses > 0;
          return (
            <g key={bucket.letter}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                className={miss ? "cypher-timechart__bar is-miss" : "cypher-timechart__bar"}
              />
              <text
                x={x + barW / 2}
                y={chartH + 14}
                textAnchor="middle"
                className="cypher-timechart__label"
              >
                {bucket.letter}
              </text>
              <title>
                {bucket.hits === 0
                  ? `${bucket.letter}: not in this quiz`
                  : `${bucket.letter}: ${bucket.avgMs} ms average, ${bucket.misses} miss${bucket.misses === 1 ? "" : "es"}`}
              </title>
            </g>
          );
        })}
      </svg>
      <p className="cypher-chart-scale">0 ms at the bottom · {maxMs} ms at the top</p>
      {slow.length > 0 ? (
        <p className="cypher-chart-slow">
          Slowest: {slow.map((bucket) => `${bucket.letter} (${bucket.avgMs} ms)`).join(" · ")}
        </p>
      ) : null}
    </figure>
  );
}
