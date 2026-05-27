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
  .ctr{position:fixed;top:.85rem;right:.85rem;left:.85rem;max-width:14rem;margin:0 0 0 auto;padding:.45rem .65rem;border-radius:8px;border:1px solid rgba(255,77,240,.35);background:rgba(10,6,20,.88);font:600 .68rem/1.35 ui-monospace,monospace;text-align:right;color:#c9b8e8;z-index:2}
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
<p class="ctr" id="ctr" aria-live="polite">you are the … person to fall for it :broken_heart:</p>
<main>
  <h1>YOU WISH</h1>
  <p class="k">tricked ya</p>
  <img class="st" src="/wow-sticker.png" alt="" width="160" height="160" draggable="false"/>
  <p class="p">hahha you are <strong>NOT</strong> getting solidifiedplaydoh exclusive content you horny bastard</p>
  <a href="/">← leave</a>
</main>
<script>
(function(){
  var el=document.getElementById("ctr");
  function line(n){el.textContent="you are the "+n+" person to fall for it :broken_heart:";}
  fetch("https://api.counterapi.dev/v1/solidifiedplaydoh/wow-fallen/up")
    .then(function(r){return r.json()})
    .then(function(d){if(typeof d.count==="number")line(d.count);})
    .catch(function(){});
})();
</script>
</body></html>
`;

mkdirSync("dist/wow", { recursive: true });
writeFileSync("dist/wow/index.html", html);
writeFileSync("dist/wow.html", html);
console.log("Wrote dist/wow/index.html and dist/wow.html");
