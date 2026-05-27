/**
 * Static /wow prank page — no React bundle.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>You wish · Solidified.dev</title>
<style>
  html,body{margin:0;min-height:100vh;background:#0a0614;color:#e8d4ff;font-family:system-ui,sans-serif}
  main{box-sizing:border-box;max-width:28rem;margin:0 auto;padding:3rem 1.5rem}
  .e{margin:0 0 .75rem;font:600 .72rem/1.4 ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:#ff4df0}
  h1{margin:0 0 1rem;font-size:clamp(2.2rem,8vw,3rem);font-weight:600;line-height:1.05;color:#ffe8fb;text-shadow:0 0 32px rgba(255,77,240,.45)}
  p{margin:0 0 1rem;font-size:.95rem;line-height:1.55;color:#c9b8e8}
  .s{margin:0 0 1.5rem;font:600 1.1rem/1 ui-monospace,monospace;color:#ff4df0}
  a{font:600 .78rem/1 ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;color:#39f6ff;text-decoration:none}
  a:hover{text-decoration:underline}
</style>
</head><body>
<main>
  <p class="e">solidified.dev / wow</p>
  <h1>You wish.</h1>
  <p>This link was never going to be what you hoped. You still clicked it anyway. Bold of you. Wrong, but bold.</p>
  <p style="margin:0 0 1rem;font-size:.88rem;color:#9a88b8">Go touch grass or keep L'ing — either way, not here &gt;:3</p>
  <p class="s">&gt;;3</p>
  <a href="/">← escape to the real site</a>
</main>
</body></html>
`;

mkdirSync("dist/wow", { recursive: true });
writeFileSync("dist/wow/index.html", html);
writeFileSync("dist/wow.html", html);
console.log("Wrote dist/wow/index.html and dist/wow.html");
