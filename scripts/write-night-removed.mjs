/**
 * Static /night page — no bundle, no redirect, apology only.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>Page removed · Solidified.dev</title>
<style>
  html,body{margin:0;min-height:100vh;background:#050508;color:#b9c7d8;font-family:system-ui,sans-serif}
  main{box-sizing:border-box;max-width:32rem;margin:0 auto;padding:3rem 1.5rem}
  .e{margin:0 0 .75rem;font:600 .72rem/1.4 ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:#39f6ff}
  h1{margin:0 0 1rem;font-size:1.5rem;font-weight:600;color:#e8fbff}
  p{margin:0 0 .85rem;font-size:.95rem;line-height:1.55}
  .d{color:#8a9bab;font-size:.88rem}
  a{display:inline-block;margin-top:1.25rem;font:600 .78rem/1 ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase;color:#39f6ff;text-decoration:none}
  a:hover{text-decoration:underline}
</style>
</head><body>
<main>
  <p class="e">solidified.dev / night</p>
  <h1>This page was removed</h1>
  <p>Sorry about that — this link used to go somewhere else, but I had to take it down after someone spammed invites and abused it. I'm really sorry if you were sent here and that caused any confusion or annoyance.</p>
  <p class="d">If you need me, use the contact options on the main site.</p>
  <a href="/">← Back to solidified.dev</a>
</main>
</body></html>
`;

mkdirSync("dist/night", { recursive: true });
writeFileSync("dist/night/index.html", html);
writeFileSync("dist/night.html", html);
console.log("Wrote dist/night/index.html and dist/night.html");
