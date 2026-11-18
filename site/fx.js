/* LOCKG FX: the creative layer. Shared by every page. Light, GPU friendly, respects reduced motion. */
(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(pointer:fine)').matches;
const css=`
#fx-veil{position:fixed;inset:0;z-index:200;background:#070605;display:grid;place-items:center;pointer-events:none;transition:opacity .9s cubic-bezier(.6,0,.2,1) .15s}
#fx-veil.off{opacity:0}
#fx-veil .wm{display:flex;gap:.55em;font:300 clamp(28px,5vw,54px)/1 'Cormorant Garamond',Georgia,serif;color:#F2EDE4;letter-spacing:.1em}
#fx-veil .wm span{opacity:0;transform:translateY(18px);filter:blur(8px);animation:fxL .9s cubic-bezier(.2,.8,.2,1) forwards}
#fx-veil .bar{position:absolute;left:50%;top:calc(50% + 46px);width:min(240px,50vw);height:1px;transform:translateX(-50%);background:rgba(200,165,116,.18);overflow:hidden}
#fx-veil .bar i{position:absolute;inset:0;background:linear-gradient(90deg,transparent,#E6C893,transparent);transform:translateX(-100%);animation:fxS 1.2s .35s cubic-bezier(.6,0,.2,1) forwards}
#fx-veil .tag{position:absolute;top:calc(50% + 64px);left:0;right:0;text-align:center;font:500 9.5px/1 Jost,sans-serif;letter-spacing:.5em;color:#9C7A4E;opacity:0;animation:fxF .8s .9s forwards}
@keyframes fxL{to{opacity:1;transform:none;filter:none}}
@keyframes fxS{to{transform:translateX(100%)}}
@keyframes fxF{to{opacity:1}}
#fx-glow{position:fixed;left:0;top:0;width:520px;height:520px;margin:-260px 0 0 -260px;border-radius:50%;pointer-events:none;z-index:3;background:radial-gradient(circle,rgba(200,165,116,.10),rgba(200,165,116,.04) 35%,transparent 65%);mix-blend-mode:screen;opacity:0;transition:opacity .6s}
body.fx-glow #fx-glow{opacity:1}
.fx-ring{position:fixed;z-index:95;pointer-events:none;border-radius:50%;border:1.5px solid #E6C893;box-shadow:0 0 24px rgba(200,165,116,.6),inset 0 0 18px rgba(200,165,116,.35);transform:translate(-50%,-50%) scale(.2);opacity:.95;animation:fxR 1.1s cubic-bezier(.15,.7,.2,1) forwards}
.fx-ring.r2{animation-delay:.12s;border-color:rgba(230,200,147,.6)}
.fx-ring.bad{border-color:#d0604f;box-shadow:0 0 24px rgba(208,96,79,.6)}
@keyframes fxR{to{transform:translate(-50%,-50%) scale(1);opacity:0}}
#fx-flash{position:fixed;inset:0;z-index:94;pointer-events:none;background:radial-gradient(circle at var(--x,50%) var(--y,80%),rgba(230,200,147,.28),transparent 55%);opacity:0}
#fx-flash.on{animation:fxFl .9s ease-out}
#fx-flash.bad{background:radial-gradient(circle at var(--x,50%) var(--y,80%),rgba(208,96,79,.3),transparent 55%)}
@keyframes fxFl{0%{opacity:0}15%{opacity:1}100%{opacity:0}}
.fx-spark{position:fixed;z-index:96;width:6px;height:6px;border-radius:50%;pointer-events:none;background:#F1D9A8;box-shadow:0 0 10px #C8A574}
.fx-rise{opacity:0;transform:translateY(22px);filter:blur(6px);transition:opacity 1s cubic-bezier(.2,.8,.2,1),transform 1s cubic-bezier(.2,.8,.2,1),filter 1s}
.fx-rise.in{opacity:1;transform:none;filter:none}
.fx-sheen{position:relative;overflow:hidden}
.fx-sheen::after{content:"";position:absolute;inset:-20%;background:linear-gradient(105deg,transparent 40%,rgba(255,240,210,.35) 50%,transparent 60%);transform:translateX(-120%);animation:fxSh 5.5s 2s ease-in-out infinite;pointer-events:none}
@keyframes fxSh{0%{transform:translateX(-120%)}22%,100%{transform:translateX(120%)}}

html,body,button,a,label,input,.dk,.gpill,.card{touch-action:manipulation}
body{animation:fxIn .6s cubic-bezier(.2,.8,.2,1)}
body.fx-out{opacity:0;transform:scale(.985);filter:blur(4px);transition:opacity .32s,transform .32s,filter .32s}
@keyframes fxIn{from{opacity:0;filter:blur(4px)}to{opacity:1;filter:none}}
.fx-tap{position:absolute;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(242,226,190,.55),rgba(200,165,116,.18) 45%,transparent 70%);transform:translate(-50%,-50%) scale(0);animation:fxTap .6s cubic-bezier(.2,.8,.2,1) forwards;z-index:0}
@keyframes fxTap{to{transform:translate(-50%,-50%) scale(1);opacity:0}}
.dk svg,.dk i{transition:transform .35s cubic-bezier(.3,1.6,.4,1)}
.dk.fx-pop svg{transform:translateY(-4px) scale(1.18)}
.dk-main{animation:fxBreath 3.2s ease-in-out infinite}
@keyframes fxBreath{0%,100%{box-shadow:0 0 0 0 rgba(200,165,116,.0),0 10px 30px rgba(0,0,0,.35)}50%{box-shadow:0 0 0 10px rgba(200,165,116,.12),0 0 34px rgba(200,165,116,.35)}}
.lab .num,.lab>b{animation:fxDot 2.6s ease-in-out infinite}
@keyframes fxDot{50%{box-shadow:0 0 0 6px rgba(200,165,116,.15)}}
@media (prefers-reduced-motion: reduce){body,.dk-main,.lab .num,.lab>b{animation:none}}
@media (prefers-reduced-motion: reduce){.fx-rise{opacity:1;transform:none;filter:none}.fx-sheen::after{display:none}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const $=(t,c,p=document.body)=>{const e=document.createElement(t);if(c)e.className=c;p.appendChild(e);return e;};
const ready=f=>document.readyState!=='loading'?f():addEventListener('DOMContentLoaded',f);

/* 1. opening veil: once per visit */
let VEIL=false;
ready(()=>{
 if(!RM&&!sessionStorage.getItem('lockg-veil')){VEIL=true;
  try{sessionStorage.setItem('lockg-veil','1');}catch(e){}
  const v=$('div');v.id='fx-veil';v.innerHTML=`<div class="wm">${'LOCKG'.split('').map((c,i)=>`<span style="animation-delay:${.08+i*.09}s">${c}</span>`).join('')}</div><div class="bar"><i></i></div><div class="tag">LOCKED TO THE WALL</div>`;
  const t0=performance.now(),go=()=>{const w=Math.max(0,1650-(performance.now()-t0));setTimeout(()=>{v.classList.add('off');setTimeout(()=>v.remove(),1100);},w);};
  if(document.readyState==='complete')go();else{addEventListener('load',go,{once:true});setTimeout(()=>{if(!v.classList.contains('off'))go();},4500);}
 }
 /* 2. gold light that follows the pointer (desktop) */
 if(FINE&&!RM){const g=$('div');g.id='fx-glow';let x=innerWidth/2,y=innerHeight/2,tx=x,ty=y;
  addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;document.body.classList.add('fx-glow');},{passive:true});
  document.addEventListener('pointerleave',()=>document.body.classList.remove('fx-glow'));
  (function f(){x+=(tx-x)*.12;y+=(ty-y)*.12;g.style.transform=`translate(${x}px,${y}px)`;requestAnimationFrame(f);})();}
 /* 3. magnetic buttons (desktop) */
 if(FINE&&!RM){document.addEventListener('pointermove',e=>{const b=e.target.closest&&e.target.closest('.gpill,#next,.q-go,.dk-main');document.querySelectorAll('.fx-mag').forEach(m=>{if(m!==b){m.style.transform='';m.classList.remove('fx-mag');}});
  if(!b)return;const r=b.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);b.classList.add('fx-mag');b.style.transition='transform .25s cubic-bezier(.2,.8,.2,1)';b.style.transform=`translate(${dx*.1}px,${dy*.18}px)`;},{passive:true});}

 /* 6. no double-tap zoom, no pinch zoom of the page (the 3D keeps its own pinch) */
 let lastT=0;document.addEventListener('touchend',e=>{const n=Date.now();if(n-lastT<320&&!e.target.closest('input,textarea,button,a,label,select,canvas'))e.preventDefault();lastT=n;},{passive:false});
 ['gesturestart','gesturechange'].forEach(t=>document.addEventListener(t,e=>e.preventDefault(),{passive:false}));
 document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});
 /* 7. gold tap ripple inside buttons + dock icon pop */
 document.addEventListener('pointerdown',e=>{if(RM)return;const b=e.target.closest&&e.target.closest('.gpill,.dk,.dk-main,.card,.tile,.q-go,#next,.tog button,.guns button,.mlist a,.mlist button');if(!b)return;
  const r=b.getBoundingClientRect(),cs=getComputedStyle(b);if(cs.position==='static')b.style.position='relative';if(cs.overflow!=='hidden')b.style.overflow='hidden';
  const t=document.createElement('span');t.className='fx-tap';const d=Math.max(r.width,r.height)*2.2;t.style.width=t.style.height=d+'px';t.style.left=(e.clientX-r.left)+'px';t.style.top=(e.clientY-r.top)+'px';b.appendChild(t);setTimeout(()=>t.remove(),650);
  if(b.classList.contains('dk')){b.classList.add('fx-pop');setTimeout(()=>b.classList.remove('fx-pop'),260);}
  try{navigator.vibrate&&navigator.vibrate(6);}catch(_){}},{passive:true});
 /* 8. soft page transitions between LOCKG pages */
 document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href]');if(!a||RM||e.metaKey||e.ctrlKey||a.target)return;const u=new URL(a.href,location.href);
  if(u.origin!==location.origin||(u.pathname===location.pathname&&u.search===location.search))return;e.preventDefault();document.body.classList.add('fx-out');setTimeout(()=>location.href=u.href,300);});
 addEventListener('pageshow',e=>{if(e.persisted)document.body.classList.remove('fx-out');});
 /* 4. reveal anything marked .fx-rise */
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.15});
 const scan=()=>document.querySelectorAll('.fx-rise:not(.in)').forEach(el=>{if(!el.dataset.fxd){el.dataset.fxd=1;el.style.transitionDelay=((VEIL?1.5:0)+(+el.dataset.d||0))+'s';}io.observe(el);});scan();setInterval(scan,1200);
});

/* 5. effects other scripts can call */
function centerOf(el){const r=el.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2];}
const FX={
 ripple(el,bad){if(RM||!el)return;const [x,y]=centerOf(el);const size=Math.max(innerWidth,innerHeight)*.55;
  for(const c of ['','r2']){const r=$('div','fx-ring '+c+(bad?' bad':''));r.style.left=x+'px';r.style.top=y+'px';r.style.width=r.style.height=size+'px';setTimeout(()=>r.remove(),1400);}
  let f=document.getElementById('fx-flash');if(!f){f=$('div');f.id='fx-flash';}f.className=bad?'bad':'';f.style.setProperty('--x',x+'px');f.style.setProperty('--y',y+'px');void f.offsetWidth;f.classList.add('on');},
 sparks(el,n=28){if(RM||!el)return;const [x,y]=centerOf(el);for(let i=0;i<n;i++){const s=$('div','fx-spark');s.style.left=x+'px';s.style.top=y+'px';const a=Math.random()*Math.PI*2,v=80+Math.random()*180;
  s.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*v}px),calc(-50% + ${Math.sin(a)*v+90}px)) scale(.15)`,opacity:0}],{duration:900+Math.random()*700,easing:'cubic-bezier(.2,.8,.2,1)'}).onfinish=()=>s.remove();}},
 count(el,to,fmt,ms=600){if(!el)return;const from=+(el.dataset.v||to);el.dataset.v=to;if(RM||from===to){el.textContent=fmt(to);return;}const t0=performance.now();
  (function f(t){const k=Math.min(1,(t-t0)/ms),e=1-Math.pow(1-k,3);el.textContent=fmt(Math.round(from+(to-from)*e));if(k<1)requestAnimationFrame(f);})(t0);},
 buzz(p){try{navigator.vibrate&&navigator.vibrate(p||12);}catch(e){}},
 /* floating gold dust for a three.js scene */
 dust(THREE,scene,opts={}){if(RM)return null;const n=opts.n||420,box=opts.box||[3.2,2.6,2.4],c=opts.center||[0,1.2,.6];
  const g=new THREE.BufferGeometry(),p=new Float32Array(n*3),sd=new Float32Array(n);
  for(let i=0;i<n;i++){p[i*3]=c[0]+(Math.random()-.5)*box[0];p[i*3+1]=c[1]+(Math.random()-.5)*box[1];p[i*3+2]=c[2]+(Math.random()-.5)*box[2];sd[i]=Math.random()*6.28;}
  g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('seed',new THREE.BufferAttribute(sd,1));
  const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{t:{value:0},px:{value:Math.min(devicePixelRatio,2)},a:{value:opts.alpha||.55}},
   vertexShader:`attribute float seed;uniform float t;uniform float px;varying float vA;void main(){vec3 q=position;q.x+=sin(t*.13+seed)*.08;q.y+=sin(t*.09+seed*2.)*.12+mod(t*.012+seed*.1,.6)-.3;q.z+=cos(t*.11+seed)*.08;vec4 mv=modelViewMatrix*vec4(q,1.);gl_Position=projectionMatrix*mv;gl_PointSize=px*(2.2+1.6*sin(seed*3.))*(2.4/-mv.z);vA=.35+.65*abs(sin(t*.6+seed*4.));}`,
   fragmentShader:`uniform float a;varying float vA;void main(){vec2 d=gl_PointCoord-.5;float r=length(d);if(r>.5)discard;gl_FragColor=vec4(1.,.86,.62,(1.-r*2.)*vA*a);}`});
  const pts=new THREE.Points(g,m);pts.frustumCulled=false;scene.add(pts);return {pts,tick:(s)=>{m.uniforms.t.value=s;}};}
};
window.LOCKG_FX=FX;
})();
