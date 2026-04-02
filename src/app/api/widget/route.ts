import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const SYMBOL_MAP: Record<string, string> = {
  gold: "XAU",
  silver: "XAG",
  platinum: "XPT",
  palladium: "XPD",
  copper: "HG",
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const metalsParam = searchParams.get("metals") || "gold";
  const theme = searchParams.get("theme") === "light" ? "light" : "dark";

  const symbols = metalsParam
    .split(",")
    .map((m) => SYMBOL_MAP[m.trim().toLowerCase()])
    .filter(Boolean);
  if (symbols.length === 0) symbols.push("XAU");

  const html = buildHTML(symbols, theme);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=30, s-maxage=30",
      "X-Frame-Options": "ALLOWALL",
    },
  });
}

function buildHTML(symbols: string[], theme: "dark" | "light"): string {
  const dk = theme === "dark";
  const bg = dk ? "#0d1117" : "#ffffff";
  const txt0 = dk ? "#f1f3f7" : "#111827";
  const txt1 = dk ? "#c8cdd8" : "#374151";
  const txt2 = dk ? "#8891a5" : "#6b7280";
  const txt3 = dk ? "#5a6478" : "#9ca3af";
  const border = dk ? "rgba(255,255,255,.06)" : "rgba(0,0,0,.07)";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="referrer" content="no-referrer-when-downgrade">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:${bg};color:${txt0};padding:14px 16px;overflow:hidden}
.hdr{display:flex;align-items:center;gap:6px;margin-bottom:10px}
.dot{width:6px;height:6px;border-radius:50%;background:#34D399;flex-shrink:0;animation:p 2s infinite}
@keyframes p{0%,100%{opacity:1}50%{opacity:.3}}
.ttl{font-size:11px;font-weight:600;color:${txt2};text-transform:uppercase;letter-spacing:.5px}
.row{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid ${border}}
.row:last-of-type{border-bottom:none}
.nm{display:flex;align-items:center;gap:8px}
.ic{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
.lbl{font-size:13px;font-weight:500;color:${txt1}}
.rt{display:flex;align-items:center;gap:8px}
.prc{font-size:14px;font-weight:700;font-variant-numeric:tabular-nums}
.chg{font-size:11px;font-weight:600;padding:2px 6px;border-radius:4px;font-variant-numeric:tabular-nums;white-space:nowrap}
.up{color:#34D399;background:rgba(52,211,153,.1)}
.dn{color:#F87171;background:rgba(248,113,113,.1)}
.ft{margin-top:8px;padding-top:8px;border-top:1px solid ${border};text-align:center}
.ft a{font-size:10px;color:${txt3};text-decoration:none;transition:color .2s}
.ft a:hover{color:#D6B35A}
.ft .br{color:#D6B35A;font-weight:700}
.ld{text-align:center;padding:16px 0;color:${txt2};font-size:12px}
.err{text-align:center;padding:16px 0;color:#F87171;font-size:12px}
.err a{color:#D6B35A;cursor:pointer;text-decoration:underline}
</style>
</head>
<body>
<div id="w"><div class="ld">Loading\u2026</div></div>
<script>
(function(){
var S=${JSON.stringify(symbols)};
var N={XAU:"Gold",XAG:"Silver",XPT:"Platinum",XPD:"Palladium",HG:"Copper"};
var C={XAU:"#D6B35A",XAG:"#A8B2C1",XPT:"#E5E7EB",XPD:"#9CA3AF",HG:"#B87333"};
var el=document.getElementById("w");

function fmt(n){
  if(n>=100)return"$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
  if(n>=1)return"$"+n.toFixed(2);
  return"$"+n.toFixed(4);
}

function render(prices){
  var h='<div class="hdr"><span class="dot"></span><span class="ttl">Live Prices</span></div>';
  var found=0;
  S.forEach(function(sym){
    var p;
    for(var i=0;i<prices.length;i++){if(prices[i].symbol===sym){p=prices[i];break;}}
    if(!p)return;
    found++;
    var up=p.changePct>=0;
    h+='<div class="row"><div class="nm"><div class="ic" style="background:'+C[sym]+'20;color:'+C[sym]+'">'+N[sym][0]+'</div><span class="lbl">'+N[sym]+'</span></div><div class="rt"><span class="prc">'+fmt(p.price)+'</span><span class="chg '+(up?"up":"dn")+'">'+(up?"+":"")+p.changePct.toFixed(2)+'%</span></div></div>';
  });
  if(!found){el.innerHTML='<div class="err">No data available</div>';return;}
  h+='<div class="ft"><a href="https://metalorix.com?ref=widget" target="_blank" rel="noopener">Powered by <span class="br">Metalorix</span></a></div>';
  el.innerHTML=h;
  try{window.parent.postMessage({type:"mtx-resize",h:document.body.scrollHeight},"*");}catch(e){}
}

function load(){
  fetch("/api/prices").then(function(r){return r.json();}).then(function(d){
    if(d&&d.prices)render(d.prices);
    else el.innerHTML='<div class="err">Unable to load prices. <a onclick="load()">Retry</a></div>';
  }).catch(function(){
    el.innerHTML='<div class="err">Unable to load prices. <a onclick="load()">Retry</a></div>';
  });
}

load();
setInterval(load,60000);
})();
</script>
</body>
</html>`;
}
