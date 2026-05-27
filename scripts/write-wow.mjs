/**
 * Static /wow prank page — no React bundle.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title>YOU WISH · Solidified.dev</title>
<style>
  html,body{margin:0;min-height:100vh;background:#0a0614;color:#e8d4ff;font-family:system-ui,sans-serif}
  main{box-sizing:border-box;max-width:22rem;margin:0 auto;padding:2.5rem 1.25rem 3rem;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
  h1{margin:0;font-size:clamp(2.6rem,12vw,3.75rem);font-weight:800;line-height:.95;letter-spacing:.04em;color:#ffe8fb;text-shadow:0 0 40px rgba(255,77,240,.5)}
  .k{margin:.35rem 0 1.25rem;font:600 1rem/1 ui-monospace,monospace;letter-spacing:.2em;color:#ff4df0}
  .st{width:min(10rem,42vw);height:auto;margin:0 0 1.25rem;transform:rotate(-6deg);filter:drop-shadow(0 12px 28px rgba(255,77,240,.35));image-rendering:pixelated}
  .p{margin:0;font-size:1rem;line-height:1.45;color:#d4c0f5}
  .p strong{color:#ff6ef5}
  a{margin-top:1.75rem;font:600 .72rem/1 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:#39f6ff;text-decoration:none;opacity:.85}
  a:hover{opacity:1;text-decoration:underline}
</style>
</head><body>
<main>
  <h1>YOU WISH</h1>
  <p class="k">tricked ya</p>
  <img class="st" src="/wow-sticker.png" alt="" width="160" height="160" draggable="false"/>
  <p class="p">hahha you are <strong>NOT</strong> getting solidifiedplaydoh exclusive content you horny bastard</p>
  <a href="/">← leave</a>
</main>
</body></html>
`;

mkdirSync("dist/wow", { recursive: true });
writeFileSync("dist/wow/index.html", html);
writeFileSync("dist/wow.html", html);
console.log("Wrote dist/wow/index.html and dist/wow.html");
