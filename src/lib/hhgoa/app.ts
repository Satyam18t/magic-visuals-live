/* eslint-disable */
// @ts-nocheck
// App logic ported verbatim from hhgoa-2026-id-generator.html (source of truth).
export function initHHGoa() {

/* =========================================================================
   UTIL
   ========================================================================= */
function hexToRgb(hex){ const v=parseInt(hex.slice(1),16); return {r:(v>>16)&255,g:(v>>8)&255,b:v&255}; }
function hexA(hex,a){ const c=hexToRgb(hex); return `rgba(${c.r},${c.g},${c.b},${a})`; }
function uid(len){ const chars='23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; let out=''; const arr=new Uint8Array(len); (crypto.getRandomValues?crypto.getRandomValues(arr):arr.forEach((_,i)=>arr[i]=Math.random()*256)); for(let i=0;i<len;i++) out+=chars[arr[i]%chars.length]; return out; }
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* =========================================================================
   CARD PALETTE (postcard, fixed identity — used for the printed card only)
   ========================================================================= */
const CARD = {
  bg:'#F5EEDA', bgSoft:'#EFE5C9', ink:'#0E3B2E', ink2:'#175C41',
  yellow:'#FFC933', yellowDeep:'#E8A400', coral:'#D9663B',
  line:'rgba(14,59,46,0.22)', faint:'rgba(14,59,46,0.5)'
};
/* Boarding-pass palette — deep green ground, yellow header, pink badge
   accent. This is what the SINGLE ID card renders in now. */
const CARD2 = {
  bg:'#0B4A2C', bgDeep:'#062E1B', panel:'rgba(255,247,234,0.11)', panelLine:'rgba(255,247,234,0.26)',
  ink2:'#0E5C36', yellow:'#FFD23F', yellowSoft:'#FFE98A', yellowDeep:'#E8A400', cream:'#FFF7EA',
  pink:'#FF6E9B', pinkDeep:'#D93E6B', pattern:'rgba(255,247,234,0.06)', sky:'#F97A4D'
};

/* =========================================================================
   ROUTER — screens + browser history, without losing form state
   ========================================================================= */
const SCREENS = ['landing','select','single','squad','result'];
let currentScreen = 'landing';
function showScreen(name, push){
  SCREENS.forEach(s=> document.getElementById('screen-'+s).classList.toggle('active', s===name));
  currentScreen = name;
  window.scrollTo({top:0,behavior:'instant'});
  document.getElementById('topnav').classList.toggle('show', name!=='landing' || splashDone);
  if(name==='landing') startHeroBG(); else stopHeroBG();
  if(push!==false) history.pushState({screen:name}, '', '#'+name);
}
addEventListener('popstate', (e)=>{
  const s = (e.state && e.state.screen) || 'landing';
  showScreen(s, false);
});
history.replaceState({screen:'landing'}, '', '#landing');

/* =========================================================================
   SPLASH
   ========================================================================= */
let splashDone=false;
setTimeout(()=>{
  document.getElementById('splash').classList.add('out');
  document.getElementById('topnav').classList.add('show');
  splashDone=true;
  setTimeout(()=> document.getElementById('splash').remove(), 550);
}, 1700);

/* =========================================================================
   NAV WIRING
   ========================================================================= */
document.getElementById('navCreateBtn').onclick=()=> showScreen('select');
document.getElementById('heroCreateBtn').onclick=()=> showScreen('select');
document.getElementById('backFromSelect').onclick=()=> showScreen('landing');
document.getElementById('backFromSingle').onclick=()=>{ if(singleStep>0){ singleGoStep(singleStep-1);} else { showScreen('select'); } };
document.getElementById('backFromSquad').onclick=()=>{ if(squadStep>0){ squadGoStep(squadStep-1);} else { showScreen('select'); } };
document.getElementById('selectSingle').onclick=()=>{ showScreen('single'); singleGoStep(0,false); };
document.getElementById('selectSquad').onclick=()=>{ showScreen('squad'); squadGoStep(0,false); };
document.getElementById('startOverBtn').onclick=()=>{ location.reload(); };
document.getElementById('editBtn').onclick=()=>{
  if(lastGenerated==='single'){ showScreen('single'); singleGoStep(4,false);} else { showScreen('squad'); squadGoStep(2,false); }
};

/* =========================================================================
   COUNTDOWN + hype pulse
   ========================================================================= */
function updateCountdown(){
  const eventDate = new Date('2026-10-28T00:00:00');
  const diff = Math.max(0, Math.ceil((eventDate-new Date())/(1000*60*60*24)));
  document.getElementById('countdownStat').textContent = diff + 'd';
}
updateCountdown();

/* =========================================================================
   HYPE VIDEO MODAL
   ========================================================================= */
const hypeModal=document.getElementById('hypeModal');
const hypeVideo=document.getElementById('hypeVideo');
let hypeLoaded=false;
function openHype(){
  hypeModal.classList.add('show');
  document.addEventListener('keydown', hypeEscHandler);
}
function closeHype(){
  hypeModal.classList.remove('show');
  if(hypeLoaded){ hypeVideo.pause(); }
  document.removeEventListener('keydown', hypeEscHandler);
}
function hypeEscHandler(e){ if(e.key==='Escape') closeHype(); }
document.getElementById('hypeBtn').onclick=openHype;
document.getElementById('hypeBtnHero').onclick=openHype;
document.getElementById('hypeCloseBtn').onclick=closeHype;
hypeModal.addEventListener('click', e=>{ if(e.target===hypeModal) closeHype(); });
document.getElementById('hypeUploadTrigger').onclick=()=> document.getElementById('hypeFileInput').click();
document.getElementById('hypeFileInput').onchange=(e)=>{
  const f=e.target.files[0]; if(!f) return;
  hypeVideo.src=URL.createObjectURL(f);
  hypeVideo.style.display='block';
  document.getElementById('hypeEmptyState').style.display='none';
  hypeLoaded=true;
  hypeVideo.play().catch(()=>{});
};

/* =========================================================================
   HERO BACKGROUND — cheap canvas grid/particles, recolored for green bg
   ========================================================================= */
const HeroBG = (function(){
  const canvas=document.getElementById('heroCanvas');
  const hctx=canvas.getContext('2d');
  let w,h,dpr=Math.min(devicePixelRatio||1,2);
  let dots=[], mouseX=0.5, mouseY=0.4, t=0, running=false, raf=null;
  function resize(){
    w=innerWidth; h=innerHeight;
    canvas.width=w*dpr; canvas.height=h*dpr;
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    hctx.setTransform(dpr,0,0,dpr,0,0);
    dots = Array.from({length: w<700?20:40}, ()=>({x:Math.random()*w,y:Math.random()*h,r:0.7+Math.random()*1.4,a:0.12+Math.random()*0.26,vy:0.025+Math.random()*0.05}));
  }
  addEventListener('resize', ()=>{ if(running) resize(); });
  addEventListener('mousemove', e=>{ mouseX=e.clientX/w; mouseY=e.clientY/h; });
  function frame(){
    if(!running) return;
    t+=1;
    hctx.clearRect(0,0,w,h);
    const gShiftX=(mouseX-0.5)*10, gShiftY=(mouseY-0.5)*6;
    hctx.strokeStyle='rgba(255,247,234,0.035)'; hctx.lineWidth=1;
    const gap=56;
    for(let x=-gap; x<w+gap; x+=gap){ hctx.beginPath(); hctx.moveTo(x+gShiftX,0); hctx.lineTo(x+gShiftX,h); hctx.stroke(); }
    for(let y=-gap; y<h+gap; y+=gap){ hctx.beginPath(); hctx.moveTo(0,y+gShiftY); hctx.lineTo(w,y+gShiftY); hctx.stroke(); }
    dots.forEach(d=>{
      d.y-=d.vy; if(d.y<-4) d.y=h+4;
      hctx.beginPath(); hctx.fillStyle=`rgba(255,210,63,${d.a})`;
      hctx.arc(d.x+Math.sin(t*0.01+d.x)*3,d.y,d.r,0,Math.PI*2); hctx.fill();
    });
    if(!reduceMotion) raf=requestAnimationFrame(frame);
  }
  return { start(){ if(running) return; running=true; resize(); frame(); }, stop(){ running=false; if(raf) cancelAnimationFrame(raf); } };
})();
function startHeroBG(){ HeroBG.start(); }
function stopHeroBG(){ HeroBG.stop(); }
startHeroBG();

/* =========================================================================
   AMBIENT BACKGROUND — always-on, very low intensity, no mouse tracking.
   Runs behind every screen so nothing feels static, without ever
   distracting from forms (per spec: no mouse-follow effects off-hero).
   ========================================================================= */
const AmbientBG = (function(){
  const canvas=document.getElementById('ambientBG');
  const actx=canvas.getContext('2d');
  let w,h,dpr=Math.min(devicePixelRatio||1,2), motes=[], glows=[], t=0, raf=null;
  function resize(){
    w=innerWidth; h=innerHeight;
    canvas.width=w*dpr; canvas.height=h*dpr;
    canvas.style.width=w+'px'; canvas.style.height=h+'px';
    actx.setTransform(dpr,0,0,dpr,0,0);
    motes = Array.from({length: w<700?16:30}, ()=>({x:Math.random()*w,y:Math.random()*h,r:0.6+Math.random()*1.3,a:0.05+Math.random()*0.14,vy:0.012+Math.random()*0.03,vx:(Math.random()-0.5)*0.012}));
    glows = Array.from({length:3}, (_,i)=>({x:Math.random()*w,y:Math.random()*h,r:180+Math.random()*160,phase:Math.random()*Math.PI*2,speed:0.0018+Math.random()*0.001}));
  }
  addEventListener('resize', resize);
  function frame(){
    t+=1;
    actx.clearRect(0,0,w,h);
    glows.forEach(g=>{
      const gx=g.x+Math.sin(t*g.speed+g.phase)*40, gy=g.y+Math.cos(t*g.speed*0.8+g.phase)*30;
      const grad=actx.createRadialGradient(gx,gy,0,gx,gy,g.r);
      grad.addColorStop(0,'rgba(255,210,63,0.05)'); grad.addColorStop(1,'rgba(255,210,63,0)');
      actx.fillStyle=grad; actx.beginPath(); actx.arc(gx,gy,g.r,0,Math.PI*2); actx.fill();
    });
    motes.forEach(m=>{
      m.y-=m.vy; m.x+=m.vx;
      if(m.y<-4) m.y=h+4; if(m.x<-4) m.x=w+4; if(m.x>w+4) m.x=-4;
      actx.beginPath(); actx.fillStyle=`rgba(255,247,234,${m.a})`;
      actx.arc(m.x,m.y,m.r,0,Math.PI*2); actx.fill();
    });
    raf=requestAnimationFrame(frame);
  }
  return { start(){ resize(); if(!reduceMotion) frame(); else { actx.clearRect(0,0,w,h); } } };
})();
AmbientBG.start();

/* =========================================================================
   DATA — stacks / tiers / flavor text
   ========================================================================= */
const STACKS = ['Frontend','Backend','AI/ML','Web3','Design','Product','DevOps','Mobile','Hardware','Cybersecurity','Founder','Marketing'];
const ABILITY_NAMES = ['Midnight Ship','Chaos Merge','Silent Deploy','Scope Creep','Vibe Debug','Genesis Push','Launch Sprint','Terminal Trance','Feature Flood','Sandbox Break'];
const ABILITY_TEXT = [
  'Ships features while everyone else is still reading the docs.',
  'Turns an idea into a deployed API before the chai gets cold.',
  'Debugs by instinct. It usually works.',
  'Rarely ships on time — but always ships something.',
  'Runs on twelve percent battery and full ambition.',
  'Once fixed a bug by staring at it long enough.',
  'Merges first, apologises later.',
  'Believes localhost is a state of mind.',
];
const TOOLKIT_ITEMS = ['Filter Coffee','Mechanical Keys','Lo-fi Beats','Second Monitor','Notion Docs','Cold Brew','Vim Motions','Dark Mode','Rubber Duck','Terminal Bell'];
const TIERS = [
  {key:'Bronze',   weight:42},
  {key:'Silver',   weight:31},
  {key:'Gold',     weight:20},
  {key:'Platinum', weight:7},
];
function weightedTier(){
  const total=TIERS.reduce((a,r)=>a+r.weight,0);
  let roll=Math.random()*total;
  for(const r of TIERS){ if(roll<r.weight) return r; roll-=r.weight; }
  return TIERS[0];
}
function pickN(arr,n){ const pool=[...arr]; const out=[]; while(out.length<n && pool.length){ out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]); } return out; }

/* =========================================================================
   CENTRAL STATE
   ========================================================================= */
const STATE = {
  generatorType:null,
  single:{ name:'', email:'', phone:'', role:'', company:'', location:'', linkedin:'', github:'', instagram:'', twitter:'', portfolio:'', stacks:[], photo:null },
  squad:{ name:'', tagline:'', members:[] },
  card:{ tier:TIERS[2], abilityName:'', abilityText:'', toolkit:[], id:'', setNo:Math.floor(Math.random()*498)+1 }
};
let lastGenerated=null;

/* =========================================================================
   REUSABLE PHOTO EDITOR
   photoState: {img,scale,offsetX,offsetY,rotation,baseScale}
   ========================================================================= */
function newPhotoState(){ return {img:null,scale:1,offsetX:0,offsetY:0,rotation:0,baseScale:1}; }
function computeBaseScale(img, box){ return Math.max(box/img.width, box/img.height); }

function buildPhotoEditor(container, photoState, opts){
  opts = opts||{}; const shape = opts.shape||'circle'; const onChange = opts.onChange||function(){};
  container.innerHTML = `
    <div class="photo-editor">
      <div class="pe-upload" id="pu-${opts.id}">
        <input type="file" accept="image/*" id="pf-${opts.id}">
        <div class="pu-icon">↑</div>
        <div class="pu-title">Upload photo</div>
        <div class="pu-sub">Drag &amp; drop, or click to choose</div>
      </div>
      <div class="pe-editing" id="pe-${opts.id}" style="display:none;">
        <div class="pe-canvas-wrap">
          <canvas class="pe-canvas ${shape==='square'?'square':''}" id="pc-${opts.id}" width="300" height="300"></canvas>
        </div>
        <div class="pe-controls">
          <div class="pe-row"><label><span>Zoom</span><span id="pz-${opts.id}">100%</span></label><input type="range" id="pzs-${opts.id}" min="100" max="300" value="100"></div>
          <div class="pe-row"><label><span>Rotate</span><span id="pr-${opts.id}">0°</span></label><input type="range" id="prs-${opts.id}" min="-180" max="180" value="0"></div>
          <div class="pe-btnrow">
            <button class="mini-btn" id="prb-${opts.id}" type="button">Reset</button>
            <button class="mini-btn" id="pcb-${opts.id}" type="button">Change Photo</button>
          </div>
        </div>
      </div>
    </div>`;
  const uploadZone=container.querySelector('#pu-'+opts.id);
  const fileInput=container.querySelector('#pf-'+opts.id);
  const editingBox=container.querySelector('#pe-'+opts.id);
  const pcanvas=container.querySelector('#pc-'+opts.id);
  const pctx=pcanvas.getContext('2d');
  const zoomSlider=container.querySelector('#pzs-'+opts.id);
  const rotSlider=container.querySelector('#prs-'+opts.id);
  const zoomVal=container.querySelector('#pz-'+opts.id);
  const rotVal=container.querySelector('#pr-'+opts.id);

  function drawMini(){
    const S=300, cx=S/2, cy=S/2;
    pctx.clearRect(0,0,S,S);
    pctx.fillStyle='#DDD3B4'; pctx.fillRect(0,0,S,S);
    if(photoState.img){
      const total = photoState.baseScale * photoState.scale;
      const dw = photoState.img.width*total, dh = photoState.img.height*total;
      pctx.save();
      if(shape==='circle'){ pctx.beginPath(); pctx.arc(cx,cy,S/2,0,Math.PI*2); pctx.clip(); }
      pctx.translate(cx+photoState.offsetX, cy+photoState.offsetY);
      pctx.rotate(photoState.rotation*Math.PI/180);
      pctx.drawImage(photoState.img, -dw/2, -dh/2, dw, dh);
      pctx.restore();
    }
  }
  function loadFile(file){
    const reader=new FileReader();
    reader.onload=(ev)=>{
      const img=new Image();
      img.onload=()=>{
        photoState.img=img;
        photoState.baseScale=computeBaseScale(img, 300);
        photoState.scale=1; photoState.offsetX=0; photoState.offsetY=0; photoState.rotation=0;
        uploadZone.style.display='none'; editingBox.style.display='flex';
        zoomSlider.value=100; rotSlider.value=0; zoomVal.textContent='100%'; rotVal.textContent='0°';
        drawMini(); onChange();
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  }
  fileInput.onchange=(e)=>{ const f=e.target.files[0]; if(f) loadFile(f); };
  ['dragover','dragleave','drop'].forEach(evt=>{
    uploadZone.addEventListener(evt, e=>{
      e.preventDefault();
      uploadZone.classList.toggle('drag', evt==='dragover');
      if(evt==='drop'){ const f=e.dataTransfer.files[0]; if(f) loadFile(f); }
    });
  });
  container.querySelector('#pcb-'+opts.id).onclick=()=> fileInput.click();
  container.querySelector('#prb-'+opts.id).onclick=()=>{
    photoState.scale=1; photoState.offsetX=0; photoState.offsetY=0; photoState.rotation=0;
    zoomSlider.value=100; rotSlider.value=0; zoomVal.textContent='100%'; rotVal.textContent='0°';
    drawMini(); onChange();
  };
  zoomSlider.oninput=(e)=>{ photoState.scale=e.target.value/100; zoomVal.textContent=e.target.value+'%'; drawMini(); onChange(); };
  rotSlider.oninput=(e)=>{ photoState.rotation=+e.target.value; rotVal.textContent=e.target.value+'°'; drawMini(); onChange(); };

  let dragging=false, dragStart={x:0,y:0}, dragOrigin={x:0,y:0};
  function pt(e){ const r=pcanvas.getBoundingClientRect(); const sx=300/r.width, sy=300/r.height; const cx=((e.touches?e.touches[0].clientX:e.clientX)-r.left)*sx; const cy=((e.touches?e.touches[0].clientY:e.clientY)-r.top)*sy; return {x:cx,y:cy}; }
  function down(e){ if(!photoState.img) return; const p=pt(e); dragging=true; dragStart=p; dragOrigin={x:photoState.offsetX,y:photoState.offsetY}; }
  function move(e){ if(!dragging) return; e.preventDefault(); const p=pt(e); photoState.offsetX=dragOrigin.x+(p.x-dragStart.x); photoState.offsetY=dragOrigin.y+(p.y-dragStart.y); drawMini(); onChange(); }
  function up(){ dragging=false; }
  pcanvas.addEventListener('mousedown', down);
  addEventListener('mousemove', move);
  addEventListener('mouseup', up);
  pcanvas.addEventListener('touchstart', down, {passive:true});
  pcanvas.addEventListener('touchmove', move, {passive:false});
  pcanvas.addEventListener('touchend', up);

  if(photoState.img){ uploadZone.style.display='none'; editingBox.style.display='flex'; drawMini(); }
  return { redraw: drawMini };
}

/* =========================================================================
   SINGLE FORM — steps, validation, chips
   ========================================================================= */
let singleStep=0;
const singleSteps = document.querySelectorAll('#screen-single .form-step');
STACKS.forEach(s=>{
  const chip=document.createElement('div'); chip.className='chip'; chip.textContent=s;
  chip.onclick=()=>{
    const idx=STATE.single.stacks.indexOf(s);
    if(idx>-1){ STATE.single.stacks.splice(idx,1); chip.classList.remove('active'); }
    else{ if(STATE.single.stacks.length>=2) return; STATE.single.stacks.push(s); chip.classList.add('active'); }
  };
  document.getElementById('s-stackChips').appendChild(chip);
});
function singleBuildProgress(){
  const track=document.getElementById('singleProgress'); track.innerHTML='';
  for(let i=0;i<5;i++){ const seg=document.createElement('div'); seg.className='progress-seg'+(i<singleStep?' done':i===singleStep?' active':''); seg.innerHTML='<i></i>'; track.appendChild(seg); }
}
function singleGoStep(n, push){
  singleStep=n;
  singleSteps.forEach(el=> el.hidden = (+el.dataset.step !== n));
  singleBuildProgress();
  if(n===4) singleBuildSummary();
  window.scrollTo({top:0,behavior:'instant'});
}
function validate(id, errId, cond){
  const el=document.getElementById(id), err=document.getElementById(errId);
  const ok = cond;
  el.classList.toggle('err', !ok);
  if(err) err.classList.toggle('show', !ok);
  return ok;
}
document.querySelectorAll('#screen-single [data-next]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    if(singleStep===0){
      STATE.single.name=document.getElementById('s-name').value.trim();
      STATE.single.email=document.getElementById('s-email').value.trim();
      STATE.single.phone=document.getElementById('s-phone').value.trim();
      const okName=validate('s-name','err-s-name', STATE.single.name.length>0);
      const okEmail=validate('s-email','err-s-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(STATE.single.email));
      if(!okName || !okEmail) return;
    }
    if(singleStep===1){
      STATE.single.role=document.getElementById('s-role').value.trim();
      STATE.single.company=document.getElementById('s-company').value.trim();
      STATE.single.location=document.getElementById('s-location').value.trim();
      const err=document.getElementById('err-s-stack');
      if(STATE.single.stacks.length===0){ err.classList.add('show'); return; } else err.classList.remove('show');
    }
    if(singleStep===2){
      STATE.single.linkedin=document.getElementById('s-linkedin').value.trim();
      STATE.single.github=document.getElementById('s-github').value.trim();
      STATE.single.instagram=document.getElementById('s-instagram').value.trim();
      STATE.single.twitter=document.getElementById('s-twitter').value.trim();
      STATE.single.portfolio=document.getElementById('s-portfolio').value.trim();
    }
    if(singleStep===3){
      const err=document.getElementById('err-s-photo');
      if(!STATE.single.photo || !STATE.single.photo.img){ err.classList.add('show'); return; } else err.classList.remove('show');
    }
    singleGoStep(singleStep+1);
  });
});
document.querySelectorAll('#screen-single [data-prev]').forEach(btn=> btn.addEventListener('click', ()=> singleGoStep(singleStep-1)));

STATE.single.photo = newPhotoState();
buildPhotoEditor(document.getElementById('s-photoEditor'), STATE.single.photo, {id:'single', shape:'circle', onChange:()=>{ if(!document.getElementById('screen-result').classList.contains('active')) return; drawResultCard(); }});

function singleBuildSummary(){
  const s=STATE.single;
  const rows=[
    ['Name', s.name||'—'], ['Email', s.email||'—'], ['Role', s.role||'—'],
    ['Company', s.company||'—'], ['Location', s.location||'—'],
    ['Stack', s.stacks.join(', ')||'—'],
    ['Links', [s.linkedin,s.github,s.instagram,s.twitter,s.portfolio].filter(Boolean).join(', ')||'—'],
    ['Photo', s.photo && s.photo.img ? 'Uploaded' : 'Missing']
  ];
  document.getElementById('s-summary').innerHTML = rows.map(r=>`<div class="summary-row"><span>${r[0]}</span><span>${r[1]}</span></div>`).join('');
}
document.getElementById('s-generateBtn').onclick=()=> runGeneration('single');

/* =========================================================================
   SQUAD FORM — steps, members (max 4)
   ========================================================================= */
let squadStep=0;
const squadSteps = document.querySelectorAll('#screen-squad .form-step');
function squadBuildProgress(){
  const track=document.getElementById('squadProgress'); track.innerHTML='';
  for(let i=0;i<3;i++){ const seg=document.createElement('div'); seg.className='progress-seg'+(i<squadStep?' done':i===squadStep?' active':''); seg.innerHTML='<i></i>'; track.appendChild(seg); }
}
function squadGoStep(n){
  squadStep=n;
  squadSteps.forEach(el=> el.hidden = (+el.dataset.step !== n));
  squadBuildProgress();
  if(n===2) squadBuildSummary();
  window.scrollTo({top:0,behavior:'instant'});
}
function addMember(){
  if(STATE.squad.members.length>=4) return;
  const idx=STATE.squad.members.length;
  const member = { name:'', role:'', photo:newPhotoState() };
  STATE.squad.members.push(member);
  renderMembers();
}
function removeMember(idx){ STATE.squad.members.splice(idx,1); renderMembers(); }
function renderMembers(){
  const wrap=document.getElementById('q-members'); wrap.innerHTML='';
  STATE.squad.members.forEach((m,idx)=>{
    const card=document.createElement('div'); card.className='member-card';
    card.innerHTML=`
      <div class="mc-head"><span>Member 0${idx+1}</span><button class="mc-remove" type="button">Remove</button></div>
      <div class="field-row">
        <div class="field"><label>Name</label><input type="text" class="m-name" value="${m.name}" placeholder="Full name" maxlength="20"></div>
        <div class="field"><label>Role</label><input type="text" class="m-role" value="${m.role}" placeholder="e.g. Backend" maxlength="18"></div>
      </div>
      <div class="m-photo-slot"></div>`;
    card.querySelector('.mc-remove').onclick=()=> removeMember(idx);
    card.querySelector('.m-name').oninput=(e)=> m.name=e.target.value.trim();
    card.querySelector('.m-role').oninput=(e)=> m.role=e.target.value.trim();
    buildPhotoEditor(card.querySelector('.m-photo-slot'), m.photo, {id:'m'+idx, shape:'square', onChange:()=>{}});
    wrap.appendChild(card);
  });
  document.getElementById('q-addMember').disabled = STATE.squad.members.length>=4;
}
document.getElementById('q-addMember').onclick=addMember;

document.querySelectorAll('#screen-squad [data-next]').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    if(squadStep===0){
      STATE.squad.name=document.getElementById('q-name').value.trim();
      STATE.squad.tagline=document.getElementById('q-tagline').value.trim();
      if(!validate('q-name','err-q-name', STATE.squad.name.length>0)) return;
      if(STATE.squad.members.length===0) addMember();
    }
    if(squadStep===1){
      const err=document.getElementById('err-q-members');
      const valid = STATE.squad.members.length>0 && STATE.squad.members.every(m=> m.name.length>0 && m.photo.img);
      if(!valid){ err.classList.add('show'); return; } else err.classList.remove('show');
    }
    squadGoStep(squadStep+1);
  });
});
document.querySelectorAll('#screen-squad [data-prev]').forEach(btn=> btn.addEventListener('click', ()=> squadGoStep(squadStep-1)));

function squadBuildSummary(){
  const q=STATE.squad;
  const rows=[['Squad Name', q.name||'—'], ['Tagline', q.tagline||'—'], ['Members', q.members.map(m=>m.name+' ('+(m.role||'—')+')').join(', ')||'—']];
  document.getElementById('q-summary').innerHTML = rows.map(r=>`<div class="summary-row"><span>${r[0]}</span><span>${r[1]}</span></div>`).join('');
}
document.getElementById('q-generateBtn').onclick=()=> runGeneration('squad');

/* =========================================================================
   GENERATION FLOW
   ========================================================================= */
function rollCardFlavor(){
  STATE.card.tier = weightedTier();
  STATE.card.abilityName = ABILITY_NAMES[Math.floor(Math.random()*ABILITY_NAMES.length)];
  STATE.card.abilityText = ABILITY_TEXT[Math.floor(Math.random()*ABILITY_TEXT.length)];
  STATE.card.toolkit = pickN(TOOLKIT_ITEMS,3);
}
function runGeneration(type){
  lastGenerated=type;
  rollCardFlavor();
  STATE.card.id = type==='single' ? 'HHG-26-'+uid(6) : 'HHG-SQ-'+uid(4);
  const overlay=document.getElementById('genOverlay');
  document.getElementById('genWord').textContent = 'Building your ID...';
  overlay.classList.add('show');
  setTimeout(()=>{
    document.getElementById('genWord').textContent = 'Your HH Goa ID is ready';
    setTimeout(()=>{
      overlay.classList.remove('show');
      showScreen('result');
      document.getElementById('resultTitle').textContent = type==='single' ? 'Your Pass' : 'Your Squad Pass';
      const box=document.getElementById('stageBox');
      box.classList.remove('in');
      requestAnimationFrame(()=> requestAnimationFrame(()=> box.classList.add('in')));
      drawResultCard();
    }, 350);
  }, 950);
}
document.getElementById('rerollBtn').onclick=()=>{ rollCardFlavor(); drawResultCard(); };

/* =========================================================================
   CANVAS RENDER — shared postcard helpers
   ========================================================================= */
const canvas=document.getElementById('resultCanvas');
const ctx=canvas.getContext('2d');
const W=canvas.width, H=canvas.height;

function roundRectPath(x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function wrapText(text, x, y, maxWidth, lineHeight){
  const words=text.split(' '); let line=''; const lines=[];
  words.forEach(w=>{ const test=line+w+' '; if(ctx.measureText(test).width>maxWidth && line!==''){ lines.push(line); line=w+' '; } else line=test; });
  lines.push(line);
  lines.forEach((l,i)=> ctx.fillText(l.trim(), x, y+i*lineHeight));
  return lines.length;
}
function drawRibbon(cx, y, text, bg, textColor){
  ctx.font='700 16px "JetBrains Mono"';
  const tw=ctx.measureText(text).width;
  const rw=tw+74, rh=42, x=cx-rw/2;
  ctx.fillStyle=bg;
  ctx.beginPath();
  ctx.moveTo(x,y); ctx.lineTo(x+rw,y); ctx.lineTo(x+rw-14,y+rh/2); ctx.lineTo(x+rw,y+rh);
  ctx.lineTo(x,y+rh); ctx.lineTo(x+14,y+rh/2); ctx.closePath(); ctx.fill();
  ctx.fillStyle=textColor; ctx.textAlign='center';
  ctx.fillText(text, cx, y+rh/2+5.5);
  ctx.textAlign='left';
}
function drawBarcode(x,y,w,h,color,seed){
  let s=seed; const rnd=()=>{ s=(s*9301+49297)%233280; return s/233280; };
  let cx=x; ctx.fillStyle=color;
  while(cx < x+w){ const bw=1.4+rnd()*3.6; if(rnd()>0.38) ctx.fillRect(cx,y,bw,h); cx+=bw+1.6; }
}
function drawImageInFrame(cx, cy, boxSize, photo){
  if(!photo.img) return;
  const total = photo.baseScale * photo.scale * (boxSize/300);
  const dw = photo.img.width*total, dh = photo.img.height*total;
  ctx.save();
  ctx.translate(cx + photo.offsetX*(boxSize/300), cy + photo.offsetY*(boxSize/300));
  ctx.rotate(photo.rotation*Math.PI/180);
  ctx.drawImage(photo.img, -dw/2, -dh/2, dw, dh);
  ctx.restore();
}
function star(cx,cy,s,color,alpha){
  ctx.save(); ctx.globalAlpha=alpha!=null?alpha:1; ctx.fillStyle=color;
  ctx.beginPath();
  ctx.moveTo(cx,cy-s); ctx.lineTo(cx+s*0.22,cy-s*0.22); ctx.lineTo(cx+s,cy);
  ctx.lineTo(cx+s*0.22,cy+s*0.22); ctx.lineTo(cx,cy+s); ctx.lineTo(cx-s*0.22,cy+s*0.22);
  ctx.lineTo(cx-s,cy); ctx.lineTo(cx-s*0.22,cy-s*0.22); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function palmSilhouette(cx, baseY, scale, color){
  ctx.save(); ctx.translate(cx,baseY); ctx.scale(scale,scale); ctx.fillStyle=color;
  ctx.fillRect(-3,-46,6,46);
  ctx.save(); ctx.rotate(-0.15); ctx.fillRect(-2,-50,4,36); ctx.restore();
  const fronds=[[-1,-0.55],[-0.6,-1],[0,-1.15],[0.6,-1],[1,-0.55]];
  fronds.forEach(([dx,dy])=>{
    ctx.save(); ctx.translate(0,-46);
    ctx.beginPath(); ctx.moveTo(0,0);
    ctx.quadraticCurveTo(dx*20,dy*22, dx*40, dy*30);
    ctx.quadraticCurveTo(dx*22,dy*14, 0,4);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  });
  ctx.restore();
}
function arcText(text, cx, cy, radius, startAngle, spread, color, font){
  ctx.save(); ctx.fillStyle=color; ctx.font=font; ctx.textAlign='center'; ctx.textBaseline='middle';
  const chars=text.split('');
  const step = chars.length>1 ? spread/(chars.length-1) : 0;
  chars.forEach((ch,i)=>{
    const ang = startAngle - spread/2 + step*i;
    ctx.save();
    ctx.translate(cx+radius*Math.sin(ang), cy-radius*Math.cos(ang));
    ctx.rotate(ang);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
  ctx.restore();
}
function verticalText(text, x, y, color, font, spacing, upward){
  ctx.save(); ctx.translate(x,y); ctx.rotate(upward? -Math.PI/2 : Math.PI/2);
  ctx.font=font; ctx.fillStyle=color; ctx.textAlign='left'; ctx.textBaseline='middle';
  let xx = -(text.length*spacing)/2;
  text.split('').forEach(ch=>{ ctx.fillText(ch, xx, 0); xx+=spacing; });
  ctx.restore();
}
function postageStamp(cx, cy, w, h, rotation){
  ctx.save();
  ctx.translate(cx,cy); ctx.rotate(rotation);
  roundRectPath(-w/2,-h/2,w,h,4);
  ctx.fillStyle=CARD.bgSoft; ctx.fill();
  ctx.setLineDash([5,4]); ctx.lineWidth=2.4; ctx.strokeStyle=CARD.ink2;
  roundRectPath(-w/2,-h/2,w,h,4); ctx.stroke();
  ctx.setLineDash([]);
  ctx.save();
  roundRectPath(-w/2+8,-h/2+8,w-16,h*0.56,3); ctx.clip();
  ctx.fillStyle='#BFE3D6'; ctx.fillRect(-w/2+8,-h/2+8,w-16,h*0.56);
  ctx.beginPath(); ctx.arc(w*0.16,-h*0.18,10,0,Math.PI*2); ctx.fillStyle=CARD.yellow; ctx.fill();
  ctx.fillStyle=CARD.ink2; ctx.fillRect(-w/2+8, h*0.02, w-16, h*0.12);
  palmSilhouette(-w*0.20, h*0.14, 0.42, CARD.ink2);
  ctx.restore();
  ctx.textAlign='center';
  ctx.font='800 12px "JetBrains Mono"'; ctx.fillStyle=CARD.ink;
  ctx.fillText('GOA', 0, h*0.30);
  ctx.font='700 8px "JetBrains Mono"'; ctx.fillStyle=CARD.coral;
  ctx.fillText('I N D I A', 0, h*0.42);
  ctx.textAlign='left';
  ctx.restore();
}
function sealBadge(cx, cy, r){
  ctx.save();
  ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2); ctx.fillStyle=CARD.bgSoft; ctx.fill();
  ctx.lineWidth=2; ctx.strokeStyle=CARD.ink2; ctx.stroke();
  ctx.setLineDash([2,3]); ctx.beginPath(); ctx.arc(cx,cy,r-7,0,Math.PI*2); ctx.strokeStyle=hexA(CARD.ink2,0.5); ctx.stroke();
  ctx.setLineDash([]);
  palmSilhouette(cx, cy+22, 0.46, CARD.ink2);
  arcText('BUILD IN GOA', cx, cy, r-16, 0, 2.7, CARD.ink, '700 9.5px "JetBrains Mono"');
  ctx.textAlign='center'; ctx.font='700 7.5px "JetBrains Mono"'; ctx.fillStyle=CARD.coral;
  ctx.fillText('SHIP FROM PARADISE', cx, cy+r-14);
  ctx.textAlign='left';
  ctx.restore();
}
function zigzagRing(cx,cy,rInner,rOuter,teeth,color){
  ctx.beginPath();
  for(let i=0;i<=teeth*2;i++){
    const ang=(i/(teeth*2))*Math.PI*2;
    const rad = i%2===0 ? rOuter : rInner;
    const px=cx+rad*Math.cos(ang), py=cy+rad*Math.sin(ang);
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  }
  ctx.closePath(); ctx.fillStyle=color; ctx.fill();
}
function stickyNote(cx, cy, w, h, rotation, text){
  ctx.save(); ctx.translate(cx,cy); ctx.rotate(rotation);
  ctx.save(); ctx.shadowColor='rgba(14,59,46,0.28)'; ctx.shadowBlur=10; ctx.shadowOffsetY=4;
  ctx.fillStyle=CARD.yellow; ctx.fillRect(-w/2,-h/2,w,h); ctx.restore();
  ctx.fillStyle=hexA(CARD.ink,0.08); ctx.beginPath(); ctx.moveTo(w/2-14,h/2); ctx.lineTo(w/2,h/2); ctx.lineTo(w/2,h/2-14); ctx.closePath(); ctx.fill();
  ctx.fillStyle=CARD.coral; ctx.textAlign='center'; ctx.font='800 14px "JetBrains Mono"';
  const lines=text.split('\n');
  lines.forEach((l,i)=> ctx.fillText(l, 0, -((lines.length-1)*16)/2 + i*16 + 5));
  ctx.textAlign='left';
  ctx.restore();
}
function sunWaveFooter(cx, cy, w){
  ctx.save();
  ctx.beginPath(); ctx.rect(cx-w/2, cy-46, w, 46); ctx.clip();
  const grad=ctx.createLinearGradient(0,cy-46,0,cy);
  grad.addColorStop(0,'#F6E6B8'); grad.addColorStop(1,CARD.bgSoft);
  ctx.fillStyle=grad; ctx.fillRect(cx-w/2,cy-46,w,46);
  ctx.beginPath(); ctx.arc(cx, cy-2, 22, 0, Math.PI*2); ctx.fillStyle=CARD.yellow; ctx.fill();
  ctx.fillStyle=CARD.ink2;
  ctx.beginPath(); ctx.moveTo(cx-w/2,cy); ctx.quadraticCurveTo(cx-w*0.28,cy-30,cx-w*0.12,cy-10);
  ctx.quadraticCurveTo(cx,cy-2,cx+w*0.14,cy-16); ctx.quadraticCurveTo(cx+w*0.3,cy-28,cx+w/2,cy-6);
  ctx.lineTo(cx+w/2,cy); ctx.closePath(); ctx.fill();
  ctx.restore();
}
let qrCanvas=null;
try{
  new QRCode(document.getElementById('qrHidden'), {text:'https://hhgoa.com', width:160, height:160, colorDark:'#0E3B2E', colorLight:'#F5EEDA', correctLevel: QRCode.CorrectLevel.M});
  setTimeout(()=>{ qrCanvas=document.querySelector('#qrHidden canvas'); }, 200);
}catch(e){}

/* ---- ornament wallpaper for the boarding-pass card ---- */
function cardWallpaper(bx,by,bw,bh,color){
  ctx.save();
  let seed=42; const rnd=()=>{ seed=(seed*9301+49297)%233280; return seed/233280; };
  for(let gy=by+40; gy<by+bh-40; gy+=150){
    for(let gx=bx+40; gx<bx+bw-40; gx+=140){
      const jitterX=(rnd()-0.5)*40, jitterY=(rnd()-0.5)*40, sc=0.5+rnd()*0.3, rot=(rnd()-0.5)*0.6;
      ctx.save(); ctx.translate(gx+jitterX, gy+jitterY); ctx.rotate(rot); ctx.scale(sc,sc);
      ctx.strokeStyle=color; ctx.lineWidth=2.2; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(0,20); ctx.quadraticCurveTo(-6,-10,-2,-34); ctx.stroke();
      [[-1,-0.6],[0,-1],[1,-0.6]].forEach(([dx,dy])=>{
        ctx.beginPath(); ctx.moveTo(-2,-30);
        ctx.quadraticCurveTo(dx*20,dy*22,dx*36,dy*30);
        ctx.stroke();
      });
      ctx.restore();
    }
  }
  ctx.restore();
}
/* ---- SINGLE ID CARD — boarding-pass style ---- */
function drawSingleCard(){
  ctx.clearRect(0,0,W,H);
  const r = STATE.card.tier, s = STATE.single;

  /* outer dashed frame */
  roundRectPath(0,0,W,H,40); ctx.fillStyle=CARD2.bgDeep; ctx.fill();
  const bx=20, by=20, bw=W-40, bh=H-40;
  roundRectPath(bx,by,bw,bh,32);
  const bgGrad=ctx.createLinearGradient(0,by,0,by+bh);
  bgGrad.addColorStop(0,'#0F5A34'); bgGrad.addColorStop(0.45,CARD2.bg); bgGrad.addColorStop(1,CARD2.bgDeep);
  ctx.fillStyle=bgGrad; ctx.fill();
  ctx.save(); roundRectPath(bx,by,bw,bh,32); ctx.clip();
  cardWallpaper(bx,by,bw,bh,CARD2.pattern);
  /* soft sunrise glow behind the header, matching brand */
  const sunGlow=ctx.createRadialGradient(W/2,by+70,10,W/2,by+70,320);
  sunGlow.addColorStop(0,hexA(CARD2.yellow,0.35)); sunGlow.addColorStop(1,hexA(CARD2.yellow,0));
  ctx.fillStyle=sunGlow; ctx.fillRect(bx,by,bw,320);
  /* dashed outer perforation, like a real ticket stub */
  ctx.setLineDash([3,7]); ctx.lineWidth=2; ctx.strokeStyle=hexA(CARD2.cream,0.35);
  roundRectPath(bx+14,by+14,bw-28,bh-28,26); ctx.stroke(); ctx.setLineDash([]);

  /* lanyard tab */
  roundRectPath(W/2-58,4,116,26,13); ctx.fillStyle=CARD2.bgDeep; ctx.fill();
  ctx.beginPath(); ctx.arc(W/2,17,4,0,Math.PI*2); ctx.fillStyle=hexA(CARD2.cream,0.5); ctx.fill();

  const padX=bx+50, contentW=bw-100;

  /* header — sunrise-gradient rounded bar */
  const hdrY=by+38, hdrH=112;
  roundRectPath(padX, hdrY, contentW, hdrH, 18);
  const hdrGrad=ctx.createLinearGradient(padX,hdrY,padX+contentW,hdrY+hdrH);
  hdrGrad.addColorStop(0,CARD2.yellowSoft); hdrGrad.addColorStop(0.6,CARD2.yellow); hdrGrad.addColorStop(1,CARD2.sky);
  ctx.fillStyle=hdrGrad; ctx.fill();
  ctx.textAlign='left';
  ctx.font='400 42px "Anton"'; ctx.fillStyle=CARD2.ink2;
  ctx.fillText('HACKER HOUSE', padX+28, hdrY+52);
  const hhWidth=ctx.measureText('HACKER HOUSE ').width;
  ctx.font='400 30px "Anton"'; ctx.fillStyle=CARD2.pinkDeep;
  ctx.fillText('GOA', padX+28+hhWidth, hdrY+52);
  ctx.font='700 14px "JetBrains Mono"'; ctx.fillStyle=hexA(CARD2.ink2,0.85);
  ctx.fillText('BUILDER PASS · 2026 · 28–31 OCT, GOA', padX+28, hdrY+82);
  /* small sun + wave ornament tucked in header corner */
  ctx.save();
  ctx.beginPath(); ctx.arc(padX+contentW-52, hdrY+30, 13, 0, Math.PI*2); ctx.fillStyle=hexA(CARD2.pinkDeep,0.28); ctx.fill();
  ctx.strokeStyle=hexA(CARD2.ink2,0.4); ctx.lineWidth=2; ctx.beginPath();
  ctx.moveTo(padX+contentW-78,hdrY+52); ctx.quadraticCurveTo(padX+contentW-64,hdrY+42,padX+contentW-50,hdrY+52);
  ctx.quadraticCurveTo(padX+contentW-36,hdrY+62,padX+contentW-22,hdrY+52); ctx.stroke();
  ctx.restore();

  /* corner VIP stamp with a holographic sweep */
  ctx.save(); ctx.translate(bx+bw-92, hdrY+hdrH+50); ctx.rotate(0.18);
  roundRectPath(-58,-24,116,48,8);
  const holoGrad=ctx.createLinearGradient(-58,-24,58,24);
  holoGrad.addColorStop(0,hexA(CARD2.pink,0.10)); holoGrad.addColorStop(0.5,hexA(CARD2.yellowSoft,0.22)); holoGrad.addColorStop(1,hexA(CARD2.pink,0.10));
  ctx.fillStyle=holoGrad; ctx.fill();
  ctx.setLineDash([5,4]); ctx.lineWidth=2.4; ctx.strokeStyle=CARD2.pink;
  roundRectPath(-58,-24,116,48,8); ctx.stroke(); ctx.setLineDash([]);
  ctx.textAlign='center'; ctx.font='800 15px "JetBrains Mono"'; ctx.fillStyle=CARD2.pink;
  ctx.fillText('GOA 2026', 0,-3);
  ctx.font='700 10px "JetBrains Mono"'; ctx.fillStyle=CARD2.cream; ctx.fillText('· VIP ·', 0,14);
  ctx.restore();
  ctx.textAlign='left';

  /* margin text */
  verticalText('28 – 31 OCT 2026', bx+28, by+bh*0.58, hexA(CARD2.cream,0.4), '700 12px "JetBrains Mono"', 15, true);
  verticalText('GOA, INDIA', bx+bw-28, by+bh*0.58, hexA(CARD2.pink,0.65), '700 12px "JetBrains Mono"', 15, true);

  /* photo */
  const mcx=W/2, mcy=hdrY+hdrH+190, mr=176;
  ctx.beginPath(); ctx.arc(mcx,mcy,mr+14,0,Math.PI*2); ctx.strokeStyle=CARD2.yellow; ctx.lineWidth=6; ctx.stroke();
  ctx.beginPath(); ctx.arc(mcx,mcy,mr+5,0,Math.PI*2); ctx.strokeStyle=CARD2.pink; ctx.lineWidth=2.4; ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.arc(mcx,mcy,mr,0,Math.PI*2); ctx.clip();
  ctx.fillStyle='#0B4A2C'; ctx.fillRect(mcx-mr,mcy-mr,mr*2,mr*2);
  if(s.photo && s.photo.img){
    drawImageInFrame(mcx, mcy, mr*2, s.photo);
  } else { ctx.fillStyle=hexA(CARD2.cream,0.4); ctx.font='500 18px "Space Grotesk"'; ctx.textAlign='center'; ctx.fillText('upload a photo', mcx, mcy+6); ctx.textAlign='left'; }
  ctx.restore();
  /* tier badge — holographic sticker seal, overlapping photo */
  const badgeX=mcx+mr*0.66, badgeY=mcy+mr*0.66, badgeR=54;
  const holoBadge=ctx.createLinearGradient(badgeX-badgeR,badgeY-badgeR,badgeX+badgeR,badgeY+badgeR);
  holoBadge.addColorStop(0,CARD2.pinkDeep); holoBadge.addColorStop(0.45,CARD2.pink); holoBadge.addColorStop(0.75,CARD2.yellowSoft); holoBadge.addColorStop(1,CARD2.pink);
  ctx.beginPath(); ctx.arc(badgeX,badgeY,badgeR,0,Math.PI*2); ctx.fillStyle=holoBadge; ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(badgeX,badgeY,badgeR,0,Math.PI*2); ctx.clip();
  ctx.strokeStyle=hexA(CARD2.cream,0.35); ctx.lineWidth=6;
  for(let i=-2;i<=2;i++){ ctx.beginPath(); ctx.moveTo(badgeX-badgeR+i*22,badgeY-badgeR); ctx.lineTo(badgeX+badgeR+i*22,badgeY+badgeR); ctx.stroke(); }
  ctx.restore();
  ctx.lineWidth=4; ctx.strokeStyle=CARD2.bg; ctx.beginPath(); ctx.arc(badgeX,badgeY,badgeR,0,Math.PI*2); ctx.stroke();
  ctx.setLineDash([1.5,3.5]); ctx.lineWidth=1.4; ctx.strokeStyle=hexA(CARD2.cream,0.55);
  ctx.beginPath(); ctx.arc(badgeX,badgeY,badgeR-7,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
  ctx.textAlign='center'; ctx.fillStyle=CARD2.cream;
  ctx.font='800 11px "JetBrains Mono"'; ctx.fillText('BUILDER', badgeX, badgeY-5);
  ctx.font='400 18px "Anton"'; ctx.fillText(r.key.toUpperCase(), badgeX, badgeY+18);
  ctx.textAlign='left';

  /* name + role pill */
  const nameY=mcy+mr+92;
  ctx.textAlign='center';
  let fs=54; ctx.font=`400 ${fs}px "Anton"`;
  const nameStr=(s.name||'YOUR NAME').toUpperCase();
  while(ctx.measureText(nameStr).width>contentW-40 && fs>26){ fs-=2; ctx.font=`400 ${fs}px "Anton"`; }
  ctx.fillStyle=CARD2.cream; ctx.fillText(nameStr, W/2, nameY);

  const roleText = (s.role || (s.stacks[0]||'Builder')).toUpperCase();
  ctx.font='800 15px "JetBrains Mono"'; const rpw=ctx.measureText(roleText).width+52;
  const rpY=nameY+30;
  roundRectPath(W/2-rpw/2,rpY,rpw,42,21); ctx.fillStyle=CARD2.pink; ctx.fill();
  ctx.fillStyle=CARD2.cream; ctx.fillText(roleText, W/2, rpY+28);
  ctx.textAlign='left';

  /* details grid — only rows with real content, so nothing looks empty */
  const rows=[{label:'ROLE & LOCATION', value:(s.role||'Builder')+' · '+(s.location||'Goa, India')}];
  if(s.twitter) rows.push({label:'TWITTER / X', value:s.twitter});
  if(s.linkedin) rows.push({label:'LINKEDIN', value:s.linkedin});
  if(s.github) rows.push({label:'GITHUB', value:s.github});
  if(s.instagram) rows.push({label:'INSTAGRAM', value:s.instagram});
  if(s.portfolio) rows.push({label:'PORTFOLIO', value:s.portfolio});
  if(s.email) rows.push({label:'EMAIL', value:s.email});
  if(rows.length<3) rows.push({label:'BUILDER CLASS', value: s.stacks.length? s.stacks.join(' · '):'General Builder'});
  const gridRows=rows.slice(0,7);

  let gy=rpY+80; const rowH=78, colW=(contentW-18)/2, gap=18;
  ctx.font='400 15px "Space Grotesk"';
  for(let i=0;i<gridRows.length;i+=2){
    const pair=[gridRows[i], gridRows[i+1]];
    pair.forEach((rw,j)=>{
      if(!rw) return;
      const cx0=padX+j*(colW+gap);
      roundRectPath(cx0,gy,colW,rowH-14,12); ctx.fillStyle=CARD2.panel; ctx.fill();
      ctx.strokeStyle=CARD2.panelLine; ctx.lineWidth=1.2; roundRectPath(cx0,gy,colW,rowH-14,12); ctx.stroke();
      ctx.font='700 11px "JetBrains Mono"'; ctx.fillStyle=CARD2.pink;
      ctx.fillText(rw.label, cx0+18, gy+26);
      let val=rw.value, fsz=17; ctx.font=`500 ${fsz}px "Space Grotesk"`; ctx.fillStyle=CARD2.cream;
      while(ctx.measureText(val).width>colW-36 && val.length>4){ val=val.slice(0,-1); }
      if(val!==rw.value) val=val.slice(0,-1)+'…';
      ctx.fillText(val, cx0+18, gy+50);
    });
    gy+=rowH;
  }

  /* footer position is fixed; fill any leftover space above it so the
     card never reads as empty, whether 1 or 7 detail rows were drawn */
  const ftY=by+bh-118;
  const leftover = ftY-30-gy;
  if(leftover>150){
    const smY=gy+8, smH=Math.min(140, leftover-40);
    roundRectPath(padX, smY, contentW, smH, 14); ctx.fillStyle=CARD2.panel; ctx.fill();
    ctx.strokeStyle=CARD2.panelLine; ctx.lineWidth=1.2; roundRectPath(padX, smY, contentW, smH, 14); ctx.stroke();
    ctx.font='700 12px "JetBrains Mono"'; ctx.fillStyle=CARD2.pink; ctx.textAlign='left';
    ctx.fillText('SIGNATURE MOVE', padX+22, smY+30);
    ctx.font='400 25px "Anton"'; ctx.fillStyle=CARD2.yellow;
    ctx.fillText(STATE.card.abilityName, padX+22, smY+64);
    ctx.font='400 15px "Space Grotesk"'; ctx.fillStyle=hexA(CARD2.cream,0.75);
    wrapText(STATE.card.abilityText, padX+22, smY+90, contentW-44, 20);
    if(smH>110){
      ctx.font='700 11px "JetBrains Mono"'; ctx.fillStyle=CARD2.pink;
      ctx.fillText('TOOLKIT', padX+22, smY+smH-18);
      ctx.font='500 13px "Space Grotesk"'; ctx.fillStyle=hexA(CARD2.cream,0.85);
      ctx.fillText(STATE.card.toolkit.join('   ·   '), padX+150, smY+smH-18);
    }
  }
  ctx.save();
  ctx.strokeStyle=hexA(CARD2.cream,0.14); ctx.lineWidth=2; ctx.beginPath();
  const waveY=ftY-38;
  ctx.moveTo(padX,waveY);
  ctx.bezierCurveTo(padX+contentW*0.25,waveY-16,padX+contentW*0.35,waveY+16,padX+contentW*0.5,waveY);
  ctx.bezierCurveTo(padX+contentW*0.65,waveY-16,padX+contentW*0.75,waveY+16,padX+contentW,waveY);
  ctx.stroke(); ctx.restore();
  palmSilhouette(padX+10, by+bh-176, 0.65, hexA(CARD2.ink2,0.7));
  palmSilhouette(bx+bw-50-10, by+bh-176, 0.65, hexA(CARD2.ink2,0.7));

  /* footer */
  ctx.strokeStyle=hexA(CARD2.cream,0.18); ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(padX, ftY); ctx.lineTo(padX+contentW, ftY); ctx.stroke();
  if(qrCanvas){
    roundRectPath(padX, ftY+18, 80, 80, 10); ctx.fillStyle=CARD2.cream; ctx.fill();
    ctx.drawImage(qrCanvas, padX+8, ftY+26, 64, 64);
  }
  const bcX=padX+104, bcW=contentW-104;
  ctx.textAlign='left'; ctx.font='700 16px "JetBrains Mono"'; ctx.fillStyle=CARD2.cream;
  ctx.fillText('PASS ID  '+STATE.card.id, bcX, ftY+38);
  ctx.font='400 11px "JetBrains Mono"'; ctx.fillStyle=hexA(CARD2.cream,0.55);
  ctx.fillText('SET 01 · NO. '+String(STATE.card.setNo).padStart(4,'0')+' / 0500', bcX, ftY+56);
  drawBarcode(bcX, ftY+66, bcW, 26, CARD2.cream, STATE.card.setNo*7919);
  ctx.restore();
  drawRibbon(W/2, H-58, '#FRAMEINGOA', CARD2.pink, CARD2.cream);
}

/* ---- SQUAD CARD ---- */
function drawSquadCard(){
  ctx.clearRect(0,0,W,H);
  const q = STATE.squad, members = q.members;
  roundRectPath(0,0,W,H,34); ctx.fillStyle=CARD.ink; ctx.fill();
  const bx=17, by=17, bw=W-34, bh=H-34;
  roundRectPath(bx,by,bw,bh,24); ctx.fillStyle=CARD.yellow; ctx.fill();
  const bx2=bx+7, by2=by+7, bw2=bw-14, bh2=bh-14;
  roundRectPath(bx2,by2,bw2,bh2,20);
  const sqGrad=ctx.createLinearGradient(0,by2,0,by2+bh2);
  sqGrad.addColorStop(0,'#FBF3DC'); sqGrad.addColorStop(0.5,CARD.bg); sqGrad.addColorStop(1,CARD.bgSoft);
  ctx.fillStyle=sqGrad; ctx.fill();
  ctx.save(); roundRectPath(bx2,by2,bw2,bh2,20); ctx.clip();
  ctx.fillStyle=hexA(CARD.ink,0.035);
  for(let gy=by2+30; gy<by2+bh2-30; gy+=28){ for(let gx=bx2+30; gx<bx2+bw2-30; gx+=28){ ctx.beginPath(); ctx.arc(gx,gy,1.1,0,Math.PI*2); ctx.fill(); } }
  const sunGlowQ=ctx.createRadialGradient(bx2+bw2*0.82,by2+40,4,bx2+bw2*0.82,by2+40,190);
  sunGlowQ.addColorStop(0,hexA(CARD.yellow,0.5)); sunGlowQ.addColorStop(1,hexA(CARD.yellow,0));
  ctx.fillStyle=sunGlowQ; ctx.fillRect(bx2,by2,bw2,240);
  ctx.setLineDash([3,7]); ctx.lineWidth=1.6; ctx.strokeStyle=hexA(CARD.ink,0.16);
  roundRectPath(bx2+12,by2+12,bw2-24,bh2-24,16); ctx.stroke(); ctx.setLineDash([]);
  const padX=bx2+52;

  verticalText('28 – 31 OCT 2026', bx2+30, by2+bh2*0.5, hexA(CARD.ink,0.6), '700 12px "JetBrains Mono"', 15, true);
  verticalText('GOA, INDIA', bx2+bw2-30, by2+bh2*0.5, hexA(CARD.coral,0.8), '700 12px "JetBrains Mono"', 15, true);
  star(bx2+bw2*0.5-190, by2+66, 8, CARD.coral, 0.85);
  star(bx2+bw2*0.5+196, by2+58, 6, CARD.ink2, 0.7);

  const titleY=by2+150;
  ctx.textAlign='center'; ctx.font='700 12px "JetBrains Mono"'; ctx.fillStyle=CARD.coral;
  ctx.fillText('HH GOA 2026 · SQUAD PASS', bx2+bw2/2, titleY-56);
  let fs=52; ctx.font=`400 ${fs}px "Anton"`;
  const nameStr=(q.name||'YOUR SQUAD').toUpperCase();
  while(ctx.measureText(nameStr).width>bw2-140 && fs>26){ fs-=2; ctx.font=`400 ${fs}px "Anton"`; }
  ctx.fillStyle=CARD.ink; ctx.fillText(nameStr, bx2+bw2/2, titleY);
  ctx.font='400 15px "Space Grotesk"'; ctx.fillStyle=hexA(CARD.ink,0.65);
  ctx.fillText(q.tagline || 'Building together in Goa', bx2+bw2/2, titleY+30);
  ctx.textAlign='left';

  const gridTop=titleY+70, cellW=(bw2-104)/2, cellH=210, gap=16;
  const n=Math.max(members.length,1);
  for(let i=0;i<n;i++){
    const col=i%2, row=Math.floor(i/2);
    const cx0=padX+col*(cellW+gap), cy0=gridTop+row*(cellH+gap);
    roundRectPath(cx0,cy0,cellW,cellH,16);
    ctx.fillStyle=CARD.bgSoft; ctx.fill();
    ctx.strokeStyle=hexA(CARD.ink,0.18); ctx.lineWidth=1.4; roundRectPath(cx0,cy0,cellW,cellH,16); ctx.stroke();
    const m = members[i];
    const pr=58, pcx=cx0+cellW/2, pcy=cy0+70;
    ctx.beginPath(); ctx.arc(pcx,pcy,pr+5,0,Math.PI*2); ctx.fillStyle=CARD.yellow; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(pcx,pcy,pr,0,Math.PI*2); ctx.clip();
    ctx.fillStyle='#DDD3B4'; ctx.fillRect(pcx-pr,pcy-pr,pr*2,pr*2);
    if(m && m.photo && m.photo.img){ drawImageInFrame(pcx,pcy,pr*2,m.photo); }
    else { ctx.fillStyle=hexA(CARD.ink,0.4); ctx.font='400 11px "Space Grotesk"'; ctx.textAlign='center'; ctx.fillText('no photo', pcx, pcy+4); ctx.textAlign='left'; }
    ctx.restore();
    ctx.beginPath(); ctx.arc(pcx,pcy,pr,0,Math.PI*2); ctx.strokeStyle=CARD.ink; ctx.lineWidth=3; ctx.stroke();

    ctx.textAlign='center';
    ctx.font='400 20px "Anton"'; ctx.fillStyle=CARD.ink;
    ctx.fillText((m && m.name ? m.name : 'TBD').toUpperCase(), pcx, cy0+cellH-46);
    ctx.font='700 10.5px "JetBrains Mono"'; ctx.fillStyle=CARD.coral;
    ctx.fillText((m && m.role ? m.role : '—').toUpperCase(), pcx, cy0+cellH-24);
    ctx.textAlign='left';
  }
  const gridBottom = gridTop + Math.ceil(n/2)*(cellH+gap) - gap;

  const ftY=by2+bh2-146;
  ctx.strokeStyle=hexA(CARD.ink,0.2); ctx.lineWidth=1.2;
  ctx.beginPath(); ctx.moveTo(padX, ftY); ctx.lineTo(padX+bw2-104, ftY); ctx.stroke();
  if(qrCanvas){
    ctx.font='700 8px "JetBrains Mono"'; ctx.fillStyle=CARD.ink2; ctx.textAlign='center'; ctx.fillText('GOA', padX+38, ftY+14); ctx.textAlign='left';
    roundRectPath(padX, ftY+20, 76, 76, 10); ctx.fillStyle=CARD.bg; ctx.fill();
    ctx.strokeStyle=hexA(CARD.ink,0.35); ctx.lineWidth=1.4; roundRectPath(padX, ftY+20, 76, 76, 10); ctx.stroke();
    ctx.drawImage(qrCanvas, padX+7, ftY+27, 62, 62);
  }
  const bcX=padX+100, bcW=bw2-104-100;
  ctx.textAlign='left'; ctx.font='700 15px "JetBrains Mono"'; ctx.fillStyle=CARD.ink;
  ctx.fillText('SQUAD ID  '+STATE.card.id, bcX, ftY+38);
  ctx.font='400 11px "JetBrains Mono"'; ctx.fillStyle=hexA(CARD.ink,0.55);
  ctx.fillText(members.length+' BUILDERS · SET 01 / 0500', bcX, ftY+56);
  drawBarcode(bcX, ftY+66, bcW, 26, CARD.ink, STATE.card.setNo*7919);

  palmSilhouette(padX+10, ftY-24, 0.5, hexA(CARD.ink2,0.7));
  palmSilhouette(bx2+bw2-52-10, ftY-24, 0.5, hexA(CARD.ink2,0.7));

  ctx.restore();
  drawRibbon(W/2, H-58, '#FRAMEINGOA', CARD.coral, CARD.bg);
}

function drawResultCard(){
  if(lastGenerated==='squad') drawSquadCard(); else drawSingleCard();
}

/* =========================================================================
   DOWNLOAD / SHARE
   ========================================================================= */
document.getElementById('downloadBtn').onclick=()=>{
  const link=document.createElement('a');
  const nm = lastGenerated==='squad' ? (STATE.squad.name||'squad') : (STATE.single.name||'card');
  link.download=`hhgoa-pass-${nm.replace(/\s+/g,'-').toLowerCase()}.png`;
  link.href=canvas.toDataURL('image/png');
  link.click();
};
document.getElementById('shareBtn').onclick=async ()=>{
  const text = lastGenerated==='squad'
    ? `${STATE.squad.name} just pulled our HH Goa 2026 Squad Pass #FrameInGoa`
    : `I pulled a ${STATE.card.tier.key.toUpperCase()} HH Goa 2026 Builder Pass — ${STATE.card.abilityName} #FrameInGoa`;
  canvas.toBlob(async (blob)=>{
    const file=new File([blob],'hhgoa-pass.png',{type:'image/png'});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      try{ await navigator.share({files:[file], text, title:'HH Goa 2026 Pass'}); return; }catch(err){}
    }
    const link=document.createElement('a');
    link.download='hhgoa-pass.png'; link.href=URL.createObjectURL(blob); link.click();
    setTimeout(()=>window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,'_blank'), 300);
  }, 'image/png');
};

/* init */
singleGoStep(0,false);
squadGoStep(0,false);

}
