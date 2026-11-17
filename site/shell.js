/* LOCKG app shell: app bar, back/history, glass sheets, EN/AR, order form, chat */
(function(){
const CFG={api:'https://wfxyzsuuwpezjrqkpida.supabase.co/functions/v1/lockg-api',phone:'+961 3 680 853',phoneLabel:''};
const I={
 back:['Back','رجوع'],menu:['Menu','القائمة'],close:['Close','إغلاق'],lang:['العربية','English'],
 m_product:['LOCKG ONE','LOCKG ONE'],m_room:['Place it in a room','ضعه في غرفة'],m_how:['How it works','كيف يعمل'],m_quiz:['Find yours','اختر قطعتك'],m_specs:['Specs','المواصفات'],m_story:['Story','القصة'],m_order:['Order','اطلب'],m_chat:['Ask us','اسألنا'],
 how_t:['Touch. Open. Lift.','المس. افتح. ارفع.'],
 how1:['Touch','المس'],how1p:['Your print on the sensor.','بصمتك على الحساس.'],
 how2:['Open','افتح'],how2p:['Unlocks in 0.2 s.','يفتح خلال 0.2 ثانية.'],
 how3:['Lift','ارفع'],how3p:['Take it. Close. It locks itself.','خذه. أغلق. يقفل تلقائياً.'],
 safe:['Why it stays safe','لماذا يبقى آمناً'],
 s1:['Your print only','بصمتك فقط'],s1p:['New prints need owner approval.','البصمة الجديدة تحتاج موافقة المالك.'],
 s2:['Power only to open','الطاقة للفتح فقط'],s2p:['A dead battery never leaves it open.','البطارية الفارغة لا تتركه مفتوحاً.'],
 s3:['Backup key','مفتاح احتياطي'],s3p:['Opens with no power.','يفتح بدون كهرباء.'],
 s4:['Auto lock','قفل تلقائي'],s4p:['Locks itself after 10 s.','يقفل تلقائياً بعد 10 ثوانٍ.'],
 s5:['Owner alert','تنبيه المالك'],s5p:['Wrong print? Your phone knows.','بصمة خاطئة؟ هاتفك يعرف.'],
 s6:['Bolted from inside','مثبت من الداخل'],s6p:['Hidden anchor bolts.','براغي تثبيت مخفية.'],
 story_t:['It started at home.','بدأت الفكرة من البيت.'],
 story1:['A licensed rifle. Children in the house. A closet was never the answer.','سلاح مرخّص. أطفال في البيت. والخزانة لم تكن الحل.'],
 story2:['LOCKG keeps it on the wall, in sight, locked. Your print opens it. Nobody else can.','LOCKG يبقيه على الجدار، أمام عينك، ومقفلاً. بصمتك تفتحه. لا أحد غيرك.'],
 mark:['A frame, a line, a point. The case, the rifle, your print.','إطار، خط، نقطة. الحامل، البندقية، بصمتك.'],
 specs_t:['Built to stay shut.','مصمم ليبقى مقفلاً.'],
 sp_unlock:['Unlock','الفتح'],sp_unlock_v:['Fingerprint, 0.2 s','بصمة، 0.2 ث'],
 sp_code:['Or','أو'],sp_code_v:['4 to 8 press code','رمز من 4 إلى 8 ضغطات'],
 sp_prints:['Prints','البصمات'],sp_prints_v:['Up to 10','حتى 10'],
 sp_build:['Build','الهيكل'],sp_build_v:['Steel, powder coat','فولاذ مطلي'],
 sp_key:['Backup','الاحتياط'],sp_key_v:['Mechanical key','مفتاح ميكانيكي'],
 sp_bat:['Battery','البطارية'],sp_bat_v:['About 12 months','حوالي 12 شهراً'],
 sp_mount:['Mount','التثبيت'],sp_mount_v:['4 hidden bolts','4 براغي مخفية'],
 sp_fits:['Fits','يناسب'],sp_fits_v:['AR, rifles, shotguns','AR، بنادق، شوزن'],
 sp_note:['Target specs. Licence holders only.','مواصفات مستهدفة. لحاملي الترخيص فقط.'],
 ord_t:['Order yours','اطلب قطعتك'],ord_name:['Name','الاسم'],ord_phone:['Phone','الهاتف'],ord_email:['Email (optional)','البريد (اختياري)'],ord_area:['Area','المنطقة'],
 ord_type:['I want to','أريد'],ord_buy:['Buy','الشراء'],ord_talk:['Talk first','التحدث أولاً'],
 ord_lic:['I hold a valid firearm licence.','أحمل ترخيص سلاح ساري المفعول.'],ord_send:['Send','إرسال'],
 ord_ok:['Received.','تم الاستلام.'],ord_okp:['Our team will call you soon.','سيتواصل معك فريقنا قريباً.'],
 ord_err:['Could not send. Please try again.','تعذر الإرسال. حاول مرة أخرى.'],ord_offline:['Orders open soon.','الطلبات تفتح قريباً.'],
 chat_t:['Ask LOCKG','اسأل LOCKG'],chat_hi:['Hi. Ask me anything about LOCKG.','أهلاً. اسألني أي شيء عن LOCKG.'],
 chat_ph:['Type a question','اكتب سؤالك'],chat_q1:['How fast does it open?','ما سرعة الفتح؟'],chat_q2:['Which guns fit?','ما الأسلحة المناسبة؟'],chat_q3:['How do I order?','كيف أطلب؟'],
 chat_off:['Chat opens soon. For help, contact our team','المحادثة تفتح قريباً. للمساعدة تواصل مع فريقنا'],
 d_gun:['Gun','السلاح'],d_photo:['Photos','الصور'],p_photos:['Try with my photos','جرّب بصوري'],d_color:['Color','اللون'],d_view:['View','العرض'],d_parts:['Parts','القطع'],d_child:['Child','طفل'],d_test:['Test','جرّب'],d_place:['Place','المكان'],d_order:['Order','اطلب'],
 coach:['Tap to test the lock','اضغط لتجربة القفل'],pk_gun:['Pick your gun','اختر سلاحك'],pk_color:['Pick a color','اختر اللون'],pk_view:['Look around','تجوّل'],pk_place:['Where does it go?','أين تضعه؟'],
 chat_err:['Connection lost. Try again.','انقطع الاتصال. حاول مرة أخرى.'],
};
let lang='en';try{lang=localStorage.getItem('lockg-lang')||(navigator.language||'').startsWith('ar')&&'ar'||'en';}catch(e){}
const qs=new URLSearchParams(location.search);if(qs.get('lang'))lang=qs.get('lang')==='ar'?'ar':'en';
const t=k=>{const v=I[k];return v?v[lang==='ar'?1:0]:k;};
const langFns=[];
const ICON={
 back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
 menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 8h14M5 16h14"/></svg>',
 x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v8a2.5 2.5 0 01-2.5 2.5H10l-4.5 3.5V17A2.5 2.5 0 014 14.5z"/></svg>',
 send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 cube:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/></svg>',
 room:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="16" height="10" rx="1.5"/><path d="M8 19h8"/></svg>',
 how:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></svg>',
 quiz:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 9a3 3 0 115 2.2c-1 .7-2 1.3-2 2.8M12 17.5v.1"/></svg>',
 specs:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 7h14M5 12h14M5 17h9"/></svg>',
 story:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="11" rx="1.5"/><path d="M6 13h9"/><circle cx="18.5" cy="12.5" r="1.3" fill="currentColor"/></svg>',
 bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 016 0"/></svg>',
 globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 2.5 14.5 0 17M12 3.5c-2.5 2.5-2.5 14.5 0 17"/></svg>',
 check:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'};

const UIIC={
 print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 11v4.5M8.5 12a3.5 3.5 0 017 0v2.5c0 2-.6 3.6-1.6 5"/><path d="M5.6 9.5A7 7 0 0119 12v2"/><path d="M6 13.5c0 2.6.6 4.6 1.8 6.2M10.3 20.4c-.8-1.7-1.3-3.6-1.3-5.9M4.5 6.5A9.5 9.5 0 0112 3c2.3 0 4.4.8 6 2.2"/></svg>',
 gun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M2 10h17l1-2h2v4h-9l-1 2H9l-1 4H5l1-4H2z"/></svg>',
 color:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><circle cx="8" cy="10" r="1.4" fill="currentColor"/><circle cx="12" cy="7.5" r="1.4" fill="currentColor"/><circle cx="16" cy="10" r="1.4" fill="currentColor"/><path d="M12 21c-1.5 0-2-1.5-1-2.5s.5-2.5-1-2.5"/></svg>',
 eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
 parts:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
 child:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="6" r="3"/><path d="M7 21v-5l-2-3 4-2h6l4 2-2 3v5"/></svg>',
 place:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/></svg>',
 car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 15l2-6h14l2 6v4H3z"/><circle cx="7.5" cy="16.5" r="1.3" fill="currentColor"/><circle cx="16.5" cy="16.5" r="1.3" fill="currentColor"/></svg>',
 move:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/></svg>',
 sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
 moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"/></svg>',
 tag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3" fill="currentColor"/></svg>',
 spin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M20 12a8 8 0 11-2.3-5.7M20 4v5h-5"/></svg>',
 camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.6"/></svg>',
 x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 016 0"/></svg>'};
const GUNIC={
 ar:'<svg viewBox="0 0 120 30" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M2 9v10l14-3h10l3-6z"/><path d="M29 10h22v8H29z"/><path d="M31 18l-4 9h5l3-9M42 18l2 10h6l-2-10"/><path d="M51 11h38v5H51zM89 12.5h22M111 11h6v4h-6"/><path d="M36 10V6h10v4"/></svg>',
 bolt:'<svg viewBox="0 0 120 30" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M2 10v12l30-4h8l3 5h4l1-6h26v-4H36z"/><path d="M38 10h22M73 13h45"/><rect x="38" y="4" width="28" height="4" rx="2"/></svg>',
 lever:'<svg viewBox="0 0 120 30" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M2 10v12l32-6v-4z"/><rect x="34" y="10" width="14" height="7"/><path d="M48 12h68M48 16h52"/><ellipse cx="40" cy="22" rx="6" ry="4"/></svg>',
 ou:'<svg viewBox="0 0 120 30" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M2 10v12l32-6 3 6h3l1-8"/><rect x="38" y="10" width="14" height="8"/><path d="M52 11h66M52 15.5h66"/></svg>',
 pump:'<svg viewBox="0 0 120 30" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M2 10v12l30-5 3 6h3l1-7"/><rect x="36" y="10" width="20" height="7"/><path d="M56 12h62M56 16h44"/><rect x="66" y="14" width="18" height="5" rx="2"/></svg>'};
const LOGO='<svg viewBox="0 0 40 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="1" y="1" width="38" height="22"/><line x1="7" y1="13" x2="27" y2="13"/><circle cx="33.5" cy="12" r="2.3" fill="currentColor" stroke="none"/></svg>';
const isHome=!/\/configure/.test(location.pathname);

/* fonts */
const fl=document.createElement('link');fl.rel='stylesheet';fl.href='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500&display=swap';document.head.appendChild(fl);

/* app bar */
const bar=document.createElement('div');bar.id='appbar';bar.className='glass';
bar.innerHTML=`<button class="ab-btn ab-back" aria-label="back">${ICON.back}</button><a class="ab-logo" href="/">${LOGO}LOCKG</a><div class="ab-sp"></div><button class="ab-lang"></button><button class="ab-btn ab-menu" aria-label="menu">${ICON.menu}</button>`;
document.body.appendChild(bar);
const bBack=bar.querySelector('.ab-back'),bLang=bar.querySelector('.ab-lang');
bBack.onclick=()=>{if(open)goBack();else if(!isHome)location.href='/';};
bar.querySelector('.ab-menu').onclick=()=>openMenu();
bLang.onclick=()=>setLang(lang==='ar'?'en':'ar');

/* sheet */
const scrim=document.createElement('div');scrim.id='sheet-scrim';
const sheet=document.createElement('div');sheet.id='sheet';sheet.className='glass-light';sheet.setAttribute('role','dialog');
sheet.innerHTML=`<div class="sh-grab"></div><div class="sh-head"><button class="sh-btn sh-back" aria-label="back">${ICON.back}</button><div class="sh-title"></div><button class="sh-btn sh-x" aria-label="close">${ICON.x}</button></div><div class="sh-body"></div>`;
document.body.append(scrim,sheet);
const body=sheet.querySelector('.sh-body'),title=sheet.querySelector('.sh-title');
let open=null,stack=[],backHook=null,pushed=0;
function render(e){title.textContent=e.title?t(e.title):'';body.innerHTML=typeof e.html==='function'?e.html():e.html;body.scrollTop=0;backHook=null;if(e.after)e.after(body);}
function show(id,opts){const e={id,...opts};
 if(open){stack.push(open);} open=e;render(e);
 sheet.classList.add('on');scrim.classList.add('on');document.body.classList.add('sheet-open');
 history.pushState({lockgSheet:id},'',location.pathname+location.search+'#'+id);pushed++;syncBar();}
function hide(){open=null;stack=[];sheet.classList.remove('on');scrim.classList.remove('on');document.body.classList.remove('sheet-open');syncBar();
 if(location.hash)history.replaceState(null,'',location.pathname+location.search);}
function goBack(){if(backHook&&backHook()!==false)return;history.back();}
let closing=false;function closeAll(){const n=pushed;pushed=0;if(n>0){closing=true;history.go(-n);}else hide();}
addEventListener('popstate',()=>{if(!open)return;if(closing){closing=false;hide();return;}pushed=Math.max(0,pushed-1);if(stack.length){open=stack.pop();render(open);syncBar();}else hide();});
sheet.querySelector('.sh-back').onclick=goBack;sheet.querySelector('.sh-x').onclick=closeAll;scrim.onclick=closeAll;
addEventListener('keydown',e=>{if(e.key==='Escape'&&open)goBack();});
// swipe down to close on phones
let ty=null;sheet.addEventListener('touchstart',e=>{if(body.scrollTop<=0)ty=e.touches[0].clientY;},{passive:true});
sheet.addEventListener('touchend',e=>{if(ty!==null&&e.changedTouches[0].clientY-ty>90)closeAll();ty=null;});
function syncBar(){bBack.hidden=!open&&isHome;}

/* menu */
function openMenu(){show('menu',{title:'menu',html:()=>{const it=(ic,k,attr)=>`<${attr.startsWith('href')?'a':'button'} ${attr}><i>${ICON[ic]}</i><span>${t(k)}</span><em>›</em></${attr.startsWith('href')?'a':'button'}>`;
 return `<div class="mlist">${it('cube','m_product','href="/"')}${it('room','m_room','href="/configure/"')}${it('quiz','m_quiz',isHome?'href="/configure/#quiz"':'data-go="quiz"')}${it('how','m_how','data-go="how"')}${it('specs','m_specs','data-go="specs"')}${it('story','m_story','data-go="story"')}${it('bag','m_order','data-go="order"')}${it('chat','m_chat','data-go="chat"')}${it('globe','lang','data-go="lang"')}</div>`;},
 after:b=>b.querySelectorAll('[data-go]').forEach(x=>x.onclick=()=>{const g=x.dataset.go;if(g==='lang'){setLang(lang==='ar'?'en':'ar');render(open);return;}Shell.go(g);})});}

/* built-in pages */
const PAGES={
 how:{title:'m_how',html:()=>`<h3>${t('how_t')}</h3><div class="steps">${[1,2,3].map(n=>`<div><span class="n">0${n}</span><b>${t('how'+n)}</b><p>${t('how'+n+'p')}</p></div>`).join('')}</div><div class="kick" style="margin:6px 0 10px">${t('safe')}</div><div class="safe">${[1,2,3,4,5,6].map(n=>`<div><b>${t('s'+n)}</b><span>${t('s'+n+'p')}</span></div>`).join('')}</div>`},
 specs:{title:'m_specs',html:()=>`<h3>${t('specs_t')}</h3><div class="kvs">${['unlock','code','prints','build','key','bat','mount','fits'].map(k=>`<div><span>${t('sp_'+k)}</span><b>${t('sp_'+k+'_v')}</b></div>`).join('')}</div><p style="margin-top:14px;font-size:11.5px;opacity:.7">${t('sp_note')}</p>`},
 story:{title:'m_story',html:()=>`<h3>${t('story_t')}</h3><p>${t('story1')}</p><p>${t('story2')}</p><div class="mark">${LOGO}<p>${t('mark')}</p></div>`},
 order:{title:'m_order',html:()=>{const s=window.LOCKG_SUMMARY?window.LOCKG_SUMMARY():'';return `<h3>${t('ord_t')}</h3>${s?`<div class="sumcard">${s}</div>`:''}<form class="f-grid" id="ordF" novalidate>
  <input class="f-in" name="name" required autocomplete="name" placeholder="${t('ord_name')}">
  <input class="f-in" name="phone" required inputmode="tel" autocomplete="tel" placeholder="${t('ord_phone')}">
  <input class="f-in" name="email" type="email" autocomplete="email" placeholder="${t('ord_email')}">
  <input class="f-in" name="area" placeholder="${t('ord_area')}">
  <div class="seg2"><button type="button" class="on" data-v="buy">${t('ord_buy')}</button><button type="button" data-v="talk">${t('ord_talk')}</button></div>
  <label class="f-chk"><input type="checkbox" name="lic" required> ${t('ord_lic')}</label>
  <button class="pill dark wide">${t('ord_send')}</button><p class="ferr" style="color:#9b4a35;font-size:12px;display:none"></p></form>`;},
  after:b=>{const f=b.querySelector('#ordF');let intent='buy';f.querySelectorAll('.seg2 button').forEach(x=>x.onclick=()=>{intent=x.dataset.v;f.querySelectorAll('.seg2 button').forEach(y=>y.classList.toggle('on',y===x));});
   f.onsubmit=async e=>{e.preventDefault();const err=f.querySelector('.ferr');err.style.display='none';
    const d=Object.fromEntries(new FormData(f));if(!d.name||!d.phone||!f.lic.checked){f.reportValidity();return;}
    const btn=f.querySelector('.pill');btn.disabled=true;btn.style.opacity=.6;
    try{const r=await fetch(CFG.api,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:'lead',name:d.name,phone:d.phone,email:d.email||'',area:d.area||'',intent,summary:window.LOCKG_SUMMARY?window.LOCKG_SUMMARY():'',page:location.pathname,lang})});
     if(!r.ok)throw 0;body.innerHTML=`<div class="okmark">${ICON.check}</div><h3>${t('ord_ok')}</h3><p>${t('ord_okp')}</p><button class="pill ghost wide" onclick="Shell.close()">${t('close')}</button>`;}
    catch(_){err.textContent=t('ord_err')+(CFG.phone?' · '+CFG.phone:'');err.style.display='block';btn.disabled=false;btn.style.opacity=1;}};}},
 chat:{title:'chat_t',html:()=>`<div class="chat"><div class="chat-log"></div><div class="chips-q">${['chat_q1','chat_q2','chat_q3'].map(k=>`<button data-q="${k}">${t(k)}</button>`).join('')}</div><form class="chat-in"><input class="f-in" maxlength="500" placeholder="${t('chat_ph')}"><button class="send" aria-label="send">${ICON.send}</button></form></div>`,after:b=>bindChat(b)}};
let chatLog=[];
function bindChat(b){const log=b.querySelector('.chat-log'),f=b.querySelector('form'),inp=f.querySelector('input');
 const add=(role,text)=>{const m=document.createElement('div');m.className='msg '+(role==='user'?'me':'bot');m.textContent=text;log.appendChild(m);log.scrollTop=log.scrollHeight;return m;};
 if(!chatLog.length)add('bot',t('chat_hi'));chatLog.forEach(m=>add(m.role,m.content));
 const ask=async q=>{q=q.trim();if(!q)return;b.querySelector('.chips-q').style.display='none';add('user',q);chatLog.push({role:'user',content:q});inp.value='';
  const w=add('bot','…');w.classList.add('typing');
  try{const r=await fetch(CFG.api,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:'chat',lang,page:location.pathname,messages:chatLog.slice(-12)})});
   const j=await r.json();if(!r.ok||!j.reply)throw j;w.textContent=j.reply;w.classList.remove('typing');chatLog.push({role:'assistant',content:j.reply});}
  catch(_){w.classList.remove('typing');w.textContent=t('chat_off')+(CFG.phone?': '+CFG.phone:'.');chatLog.pop();}
  log.scrollTop=log.scrollHeight;};
 f.onsubmit=e=>{e.preventDefault();ask(inp.value);};
 b.querySelectorAll('[data-q]').forEach(x=>x.onclick=()=>ask(t(x.dataset.q)));}

/* chat button */
const fab=document.createElement('button');fab.id='chatfab';fab.className='glass';fab.setAttribute('aria-label','chat');fab.innerHTML=ICON.chat;fab.onclick=()=>Shell.go('chat');document.body.appendChild(fab);

/* i18n */
function applyI18n(){document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';bLang.textContent=t('lang');
 document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;const v=(window.LOCKG_I18N&&window.LOCKG_I18N[k])||I[k];if(v)el.innerHTML=v[lang==='ar'?1:0];});}
function setLang(l){lang=l;try{localStorage.setItem('lockg-lang',l);}catch(e){}applyI18n();langFns.forEach(f=>f(l));}

const extra={};
window.Shell={t:k=>{const p=window.LOCKG_I18N&&window.LOCKG_I18N[k];return p?p[lang==='ar'?1:0]:t(k);},get lang(){return lang},onLang:f=>langFns.push(f),
 UIIC,GUNIC,go(id){const p=extra[id]||PAGES[id];if(p)show(id,p);},register(id,p){extra[id]=p;},show,close:closeAll,get body(){return body},setBack(fn){backHook=fn;},render:()=>open&&render(open),CFG};
applyI18n();syncBar();
addEventListener('load',()=>{const h=location.hash.slice(1);if(h&&(extra[h]||PAGES[h])){history.replaceState(null,'',location.pathname+location.search);setTimeout(()=>Shell.go(h),400);}});
})();
