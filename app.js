(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let stored = null;
  try { stored = localStorage.getItem('nobrand-motion'); } catch {}
  let motionOff = stored === 'off' || (stored !== 'on' && reduceQuery.matches);
  const menu = $('#menu');
  const menuButton = $('.menu-toggle');
  const closeMenu = () => {menu.close(); document.body.classList.remove('menu-open'); menuButton.setAttribute('aria-expanded', 'false');};
  menuButton.addEventListener('click', () => {menu.showModal(); document.body.classList.add('menu-open'); menuButton.setAttribute('aria-expanded','true');});
  $('.menu-close').addEventListener('click', closeMenu);
  menu.addEventListener('close', () => {document.body.classList.remove('menu-open'); menuButton.setAttribute('aria-expanded','false');});
  $$('dialog a').forEach(link => link.addEventListener('click', closeMenu));
  const panels = $$('.work-panel');
  const dots = $$('.work-dots i');
  const steps = $$('.process-step');
  let panelIndex = -1, stepIndex = -1, ticking = false;
  const clamp = (n, min=0, max=1) => Math.min(max, Math.max(min,n));
  const progress = el => {const r=el.getBoundingClientRect(); return clamp(-r.top / Math.max(1,r.height-window.innerHeight));};
  const hero=$('.hero'), why=$('.why'), work=$('.work'), process=$('.process');
  const one=$('.line-one'), two=$('.line-two'), heroBottom=$('.hero-bottom');
  const whyOne=$('.why-title>span:first-child'), whyTwo=$('.why-title>span:last-child');
  function setPanel(index) {
    if (panelIndex===index) return;
    panelIndex=index;
    panels.forEach((p,i) => {p.classList.toggle('active',i===index); p.inert=motionOff?false:i!==index;});
    dots.forEach((dot,i) => dot.classList.toggle('active',i===index));
    $('.work-counter').textContent=`0${index+1} / 03`;
  }
  function setStep(index) {
    if (stepIndex===index) return;
    stepIndex=index;
    steps.forEach((step,i) => step.classList.toggle('active',i===index));
  }
  function render() {
    ticking=false;
    const mobile=window.innerWidth<=700;
    const total=document.documentElement.scrollHeight-window.innerHeight;
    $('.page-progress span').style.transform=`scaleX(${total>0?clamp(window.scrollY/total):0})`;
    if(motionOff) return;
    const hp=progress(hero);
    if(!mobile){
      one.style.transform=`translateX(${-hp*90}px)`;
      two.style.transform=`translateX(${hp*70}px)`;
      heroBottom.style.opacity=1-clamp((hp-.2)*1.05,0,.8);
      heroBottom.style.transform=`translateY(${-hp*25}px)`;
    }else{one.style.transform='';two.style.transform='';heroBottom.style.opacity='';heroBottom.style.transform='';}
    const wp=progress(why);
    whyOne.style.transform=`translateX(${-wp*(mobile?12:38)}px)`;
    whyTwo.style.transform=`translateX(${(1-wp)*(mobile?8:40)}px)`;
    $('.why .scene-line span').style.transform=`scaleX(${wp})`;
    setPanel(Math.min(2,Math.floor(progress(work)*3.25)));
    const pp=progress(process);
    setStep(Math.min(3,Math.floor(pp*4.15)));
    $('.process .scene-line span').style.transform=`scaleX(${pp})`;
  }
  function requestRender(){if(!ticking){requestAnimationFrame(render);ticking=true;}}
  function applyMotion() {
    document.body.classList.toggle('motion-off',motionOff);
    document.body.classList.toggle('motion-ready',!motionOff);
    $('#motion-toggle').textContent=motionOff?'MOTION: OFF':'MOTION: ON';
    $('#motion-toggle').setAttribute('aria-pressed',String(motionOff));
    $('#motion-toggle').setAttribute('aria-label',motionOff?'Enable scroll motion':'Pause scroll motion');
    panels.forEach((p,i)=>p.inert=motionOff?false:i!==Math.max(0,panelIndex));
    render();
  }
  $('#motion-toggle').addEventListener('click',()=>{const before=$('#motion-toggle').getBoundingClientRect().top;motionOff=!motionOff;try{localStorage.setItem('nobrand-motion',motionOff?'off':'on');}catch{}applyMotion();window.scrollBy({top:$('#motion-toggle').getBoundingClientRect().top-before,behavior:'instant'});});
  reduceQuery.addEventListener('change',e=>{motionOff=e.matches;applyMotion();});
  const observer = new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.08});
  $$('.reveal').forEach(el=>observer.observe(el));
  window.addEventListener('scroll',requestRender,{passive:true});
  window.addEventListener('resize',requestRender,{passive:true});
  window.addEventListener('pageshow',requestRender);
  applyMotion();
  const form=$('#program-form');
  form.addEventListener('submit', e=>{e.preventDefault(); if(!form.reportValidity())return;const replyEmail=$('#email').value.trim();
    const subject='NoBrand — Brand Launch Program Request / 索取品牌啟動方案';
    const body='Hello Fengworks team,\n\nI would like to receive the full NoBrand 7-week Brand Launch Program, including scope, process and fee.\n\nPlease reply to: '+replyEmail+'\n\n您好，我想索取 NoBrand 7 週品牌啟動完整方案，了解服務內容、合作流程與費用。\n\n回覆 Email：'+replyEmail;
    $('#email-draft').href='mailto:info@fengworks.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
    form.classList.add('submitted');$('#form-result').hidden=false;$('#email').value='';$('#consent').checked=false;});
  $('.reset-form').addEventListener('click',()=>{form.classList.remove('submitted');$('#form-result').hidden=true;$('#email').focus();});
})();
