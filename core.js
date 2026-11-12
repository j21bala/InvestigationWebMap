const REL={c:["Sujeto central","#d63a3a"],fam1:["Familiar 1.º grado","#0f9bb0"],afin:["Cónyuge / afinidad","#9b6bd1"],fam2:["Familiar 2.º grado","#d9822b"],pj:["Persona jurídica","#6f8396"],ext:["Tercero por identificar","#e0524a"],amigo:["Amigo / allegado","#2f8f9d"],neg:["Vínculo comercial","#c9a227"],pol:["Vínculo político","#7a6ff0"]};
const RISK={alto:["Alto","#d63a3a"],medio:["Medio","#e3a21a"],bajo:["Bajo","#3aa76d"],na:["Sin evaluar","#8b98a5"]};
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ini=s=>(s||"?").split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();
const byId=(ns,i)=>ns.find(n=>n.id===i);

function layout(ns){
  const c=ns.find(n=>n.id==="c");if(c.x==null){c.x=800;c.y=600}
  const l1=ns.filter(n=>n.parent==="c");
  l1.forEach((n,i)=>{if(n.x==null){const a=(-90+i*360/l1.length)*Math.PI/180;n.x=800+340*Math.cos(a);n.y=600+340*Math.sin(a)}});
  ns.forEach(n=>{if(n.x==null){const p=byId(ns,n.parent)||c,sib=ns.filter(m=>m.parent===n.parent),k=sib.indexOf(n),
    a=Math.atan2(p.y-600,p.x-800)+(k-(sib.length-1)/2)*0.55;n.x=p.x+180*Math.cos(a);n.y=p.y+180*Math.sin(a)}});
}

function cardHTML(n,ns){
  const p=byId(ns,n.parent),rel=REL[n.rel]||REL.ext,rk=RISK[n.risk]||RISK.na;
  const prod=(t,b)=>`<div class="rounded-lg border border-slate-700 p-3"><div class="flex justify-between items-center"><b>${t}</b><span class="px-2 py-0.5 rounded-full text-xs font-semibold ${b?.cliente?"bg-emerald-600":"bg-slate-600"}">Cliente: ${b?.cliente?"Sí":"No"}</span></div>${(b?.productos||[]).length?`<ul class="mt-2 space-y-1 text-sm">${b.productos.map(x=>`<li class="flex justify-between gap-2 bg-slate-800 rounded px-2 py-1"><span>${esc(x.tipo)}</span><span class="font-mono">${esc(x.numero)}</span></li>`).join("")}</ul>`:`<p class="mt-2 text-xs text-slate-400">Sin productos registrados</p>`}</div>`;
  const sec=(t,v)=>v?`<div><h4 class="text-xs uppercase tracking-wide text-slate-400 mb-1">${t}</h4><p class="text-sm whitespace-pre-line">${esc(v)}</p></div>`:"";
  return `<div class="space-y-4">
  <div class="flex gap-3 items-center">${n.photo?`<img src="${esc(n.photo)}" class="w-20 h-20 rounded-full object-cover border-4" style="border-color:${rel[1]}">`:`<div class="w-20 h-20 rounded-full grid place-items-center text-2xl font-bold bg-slate-700 border-4" style="border-color:${rel[1]}">${ini(n.name)}</div>`}
  <div><h2 class="text-xl font-bold leading-tight">${esc(n.name)}</h2>
  <div class="flex flex-wrap gap-1 mt-1"><span class="px-2 py-0.5 rounded-full text-xs" style="background:${rel[1]}">${rel[0]}</span><span class="px-2 py-0.5 rounded-full text-xs" style="background:${rk[1]}">Riesgo ${rk[0]}</span></div></div></div>
  ${sec("Descripción",n.desc)}
  <div class="grid grid-cols-2 gap-2 text-sm"><div><h4 class="text-xs uppercase text-slate-400">Documento</h4>${esc(n.doc||"—")}</div><div><h4 class="text-xs uppercase text-slate-400">Vinculado a</h4>${esc(p?p.name:"—")}</div></div>
  <div class="space-y-2">${prod("Banco",n.bank)}${prod("Fiduciaria",n.fid)}</div>
  ${sec("Evidencia",n.evid)}${sec("Señales de alerta",n.flags)}
  <p class="text-xs text-slate-400">Fuente: ${esc(n.src||"sin registrar")}${n.upd?` · Actualizado: ${esc(n.upd)}`:""}</p></div>`;
}

function createMap(svg,o){
  const v={x:0,y:0,k:.7},hid={};let drag=null;
  function draw(){
    const ns=o.nodes(),sel=o.sel();
    let h=`<defs><clipPath id="cp"><circle r="27"/></clipPath><clipPath id="cc"><circle r="42"/></clipPath></defs><g transform="translate(${v.x},${v.y}) scale(${v.k})">`;
    ns.forEach(n=>{const p=byId(ns,n.parent);if(!p)return;h+=`<line x1="${p.x}" y1="${p.y}" x2="${n.x}" y2="${n.y}" stroke="#5b7a8c" stroke-width="1.5" opacity="${hid[n.rel]?.1:.7}" ${n.rel=="ext"?'stroke-dasharray="5 4"':""}/>`});
    ns.forEach(n=>{
      const c=n.id==="c",r=c?46:30,col=(REL[n.rel]||REL.ext)[1],rk=(RISK[n.risk]||RISK.na)[1],q=r*.73;
      h+=`<g class="node" data-id="${n.id}" transform="translate(${n.x},${n.y})" opacity="${hid[n.rel]?.15:1}" style="cursor:grab"><circle r="${r}" fill="#1d2a35" stroke="${col}" stroke-width="${sel===n.id?6:3}"/>`;
      h+=n.photo?`<image href="${esc(n.photo)}" x="${-(r-3)}" y="${-(r-3)}" width="${2*(r-3)}" height="${2*(r-3)}" clip-path="url(#${c?"cc":"cp"})" preserveAspectRatio="xMidYMid slice"/>`:`<text text-anchor="middle" y="5" font-size="15" font-weight="600" fill="#e6edf3">${ini(n.name)}</text>`;
      h+=`<circle cx="${q}" cy="${-q}" r="7" fill="${rk}" stroke="#0f171e" stroke-width="2"/>`;
      if(n.bank?.cliente)h+=`<g transform="translate(${-q},${q})"><circle r="8" fill="#16a34a"/><text y="3" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">B</text></g>`;
      if(n.fid?.cliente)h+=`<g transform="translate(${q},${q})"><circle r="8" fill="#2563eb"/><text y="3" font-size="9" font-weight="700" fill="#fff" text-anchor="middle">F</text></g>`;
      h+=`<text text-anchor="middle" y="${r+16}" font-size="12" font-weight="500" fill="#e6edf3">${esc(n.name.length>26?n.name.slice(0,25)+"…":n.name)}</text></g>`;
    });
    svg.innerHTML=h+"</g>";
  }
  function center(id){const n=byId(o.nodes(),id||"c"),r=svg.getBoundingClientRect();v.x=r.width/2-n.x*v.k;v.y=r.height/2-n.y*v.k;draw()}
  svg.addEventListener("pointerdown",e=>{const g=e.target.closest(".node"),n=g&&byId(o.nodes(),g.dataset.id);drag={n,sx:e.clientX,sy:e.clientY,ox:v.x,oy:v.y,mv:0,nx:n?.x,ny:n?.y};svg.setPointerCapture(e.pointerId)});
  svg.addEventListener("pointermove",e=>{if(!drag)return;const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;drag.mv=Math.abs(dx)+Math.abs(dy);if(drag.mv<4)return;
    if(drag.n){drag.n.x=drag.nx+dx/v.k;drag.n.y=drag.ny+dy/v.k}else{v.x=drag.ox+dx;v.y=drag.oy+dy}draw()});
  svg.addEventListener("pointerup",()=>{if(!drag)return;const d=drag;drag=null;if(d.mv<4)o.onSelect(d.n?d.n.id:null);else if(d.n&&o.onMove)o.onMove()});
  svg.addEventListener("wheel",e=>{e.preventDefault();const r=svg.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top,k=Math.min(3,Math.max(.25,v.k*(e.deltaY<0?1.1:.9)));v.x=mx-(mx-v.x)*k/v.k;v.y=my-(my-v.y)*k/v.k;v.k=k;draw()},{passive:false});
  window.addEventListener("resize",()=>center());
  return{draw,center,hid};
}

function legend(el,map){
  Object.keys(REL).filter(k=>k!="c").forEach(k=>{const b=document.createElement("button");
    b.className="px-3 py-1 rounded-full text-xs border";b.style.borderColor=REL[k][1];b.textContent=REL[k][0];
    b.onclick=()=>{map.hid[k]=!map.hid[k];b.style.opacity=map.hid[k]?.35:1;map.draw()};el.appendChild(b)});
}