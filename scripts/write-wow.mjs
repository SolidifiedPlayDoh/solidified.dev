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
  .sec{position:fixed;left:.75rem;bottom:.75rem;z-index:2;display:flex;flex-direction:column;align-items:flex-start;gap:.15rem}
  .sec-l{margin:0;font:600 .58rem/1.2 ui-monospace,monospace;letter-spacing:.08em;text-transform:lowercase;color:#9a88b8;display:flex;flex-direction:column;align-items:center}
  .sec-a{font-size:.7rem;color:#ff4df0;line-height:1}
  .sec-r{display:flex;align-items:center;gap:.4rem;padding-left:.15rem}
  .sec-b{width:1.65rem;height:1.65rem;padding:0;border-radius:50%;border:1px solid rgba(255,77,240,.55);background:radial-gradient(circle at 35% 30%,#3a1f4a,#120a18);cursor:pointer;box-shadow:0 0 12px rgba(255,77,240,.25)}
  .sec-b:hover{border-color:#ff4df0}
  .sec-n{min-width:1.25rem;font:600 .62rem/1 ui-monospace,monospace;color:#ff6ef5}
  main{box-sizing:border-box;max-width:22rem;margin:0 auto;padding:2.5rem 1.25rem 3rem;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
  h1{margin:0;font-size:clamp(2.6rem,12vw,3.75rem);font-weight:800;line-height:.95;letter-spacing:.04em;color:#ffe8fb;text-shadow:0 0 40px rgba(255,77,240,.5)}
  .k{margin:.35rem 0 1.25rem;font:600 1rem/1 ui-monospace,monospace;letter-spacing:.2em;color:#ff4df0}
  .st{width:min(10rem,42vw);height:auto;margin:0 0 1.25rem;filter:drop-shadow(0 12px 28px rgba(255,77,240,.35));image-rendering:pixelated}
  .p{margin:0;font-size:1rem;line-height:1.45;color:#d4c0f5}
  .p strong{color:#ff6ef5}
  a{margin-top:1.75rem;font:600 .72rem/1 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:#39f6ff;text-decoration:none;opacity:.85}
  a:hover{opacity:1;text-decoration:underline}
</style>
</head><body>
<p class="ctr" id="ctr" aria-live="polite">you are the … person to fall for it 💔</p>
<div class="sec">
  <p class="sec-l">secret button<span class="sec-a" aria-hidden>↓</span></p>
  <div class="sec-r">
    <button type="button" class="sec-b" id="sec-b" aria-label="Secret button"></button>
    <span class="sec-n" id="sec-n" aria-live="polite">…</span>
  </div>
</div>
<main>
  <h1>YOU WISH</h1>
  <p class="k">tricked ya</p>
  <img class="st" src="/wow-sticker.png" alt="" width="160" height="160" draggable="false"/>
  <p class="p">hahha you are <strong>NOT</strong> getting solidifiedplaydoh exclusive content you horny bastard</p>
  <a href="/">← leave</a>
</main>
<script>
(function(){
  var fallen=document.getElementById("ctr");
  var sn=document.getElementById("sec-n");
  function fallenLine(n){fallen.textContent="you are the "+n+" person to fall for it \\uD83D\\uDC94";}
  fetch("https://api.counterapi.dev/v1/solidifiedplaydoh/wow-fallen/up")
    .then(function(r){return r.json()})
    .then(function(d){if(typeof d.count==="number")fallenLine(d.count);})
    .catch(function(){});
  function showSecret(n){sn.textContent=String(n);}
  fetch("https://api.counterapi.dev/v1/solidifiedplaydoh/wow-secret-press/")
    .then(function(r){return r.json()})
    .then(function(d){if(typeof d.count==="number")showSecret(d.count);else showSecret(0);})
    .catch(function(){showSecret(0);});
  document.getElementById("sec-b").addEventListener("click",function(){
    fetch("https://api.counterapi.dev/v1/solidifiedplaydoh/wow-secret-press/up")
      .then(function(r){return r.json()})
      .then(function(d){if(typeof d.count==="number")showSecret(d.count);});
  });
})();
</script>
</body></html>
`;

mkdirSync("dist/wow", { recursive: true });
writeFileSync("dist/wow/index.html", html);
writeFileSync("dist/wow.html", html);
console.log("Wrote dist/wow/index.html and dist/wow.html");
