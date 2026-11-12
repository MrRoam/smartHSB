(() => {
  'use strict';
  const body=document.body, header=document.querySelector('#header');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let userMotion=true;
  try{userMotion=localStorage.getItem('hsb-motion')!=='off';}catch{}
  let motion=userMotion&&!reduce.matches;
  const motionButton=document.querySelector('#motion-toggle');
  function applyMotion(){
    motion=userMotion&&!reduce.matches;
    body.classList.toggle('motion-off',!motion);
    body.classList.toggle('js-motion',motion);
    if(motionButton){motionButton.disabled=reduce.matches;motionButton.setAttribute('aria-pressed',String(!motion));motionButton.textContent=reduce.matches?'动效：系统已关闭':'动效：'+(motion?'开启 ◉':'关闭 ○');}
    document.querySelectorAll('svg').forEach(svg=>{if(motion)svg.unpauseAnimations?.();else svg.pauseAnimations?.();});
    body.dispatchEvent(new CustomEvent('smarthsb-motion-change',{detail:{enabled:motion}}));
  }
  motionButton?.addEventListener('click',()=>{userMotion=!userMotion;try{localStorage.setItem('hsb-motion',userMotion?'on':'off');}catch{}applyMotion();});
  reduce.addEventListener('change',applyMotion);
  applyMotion();
  const groups=[...document.querySelectorAll('.nav-group')];
  function closeGroups(){groups.forEach(g=>{g.classList.remove('open');g.querySelector('.nav-trigger')?.setAttribute('aria-expanded','false');});}
  groups.forEach(group=>{
    const trigger=group.querySelector('.nav-trigger');
    function open(){closeGroups();group.classList.add('open');trigger.setAttribute('aria-expanded','true');}
    trigger.addEventListener('click',open);
    group.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover)').matches)open();});
    group.addEventListener('mouseleave',closeGroups);
    group.addEventListener('focusout',e=>{if(!group.contains(e.relatedTarget))closeGroups();});
  });
  document.addEventListener('click',e=>{if(!e.target.closest('.nav-group'))closeGroups();});
  const mobile=document.querySelector('#mobile-nav'), menuButton=document.querySelector('.menu-toggle');
  function closeMobile(){if(!mobile)return;mobile.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','打开菜单');}
  menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'关闭菜单':'打开菜单');mobile.hidden=!open;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const wasMobile=mobile&&!mobile.hidden;closeGroups();closeMobile();if(wasMobile)menuButton.focus();}});
  matchMedia('(min-width:1051px)').addEventListener('change',e=>{if(e.matches)closeMobile();});
  const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');body.append(progress);
  header?.addEventListener('focusin',()=>header.classList.remove('hidden-header'));
  let prior=scrollY,queued=false;
  function onScroll(){
    const y=scrollY, fixed=y>120;
    if(header){header.classList.toggle('sticky',fixed);body.classList.toggle('header-fixed',fixed);header.classList.toggle('hidden-header',fixed&&y>prior+4&&mobile?.hidden&&!header.contains(document.activeElement));if(y<prior-3)header.classList.remove('hidden-header');}
    const remaining=document.documentElement.scrollHeight-innerHeight;
    body.style.setProperty('--read-progress',remaining>0?String(Math.min(1,y/remaining)):'0');
    prior=y;queued=false;
  }
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(onScroll);}},{passive:true});
  onScroll();
  document.querySelectorAll('.faq-q').forEach(button=>button.addEventListener('click',()=>requestAnimationFrame(()=>{document.querySelectorAll('.faq-q').forEach(q=>q.setAttribute('aria-expanded',String(q.parentElement.classList.contains('open'))));})));
  const readingLinks=[...document.querySelectorAll('.reading-sidebar a[href^="#"]')];
  if(readingLinks.length){
    const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting)readingLinks.forEach(a=>a.classList.toggle('read-active',a.getAttribute('href')==='#'+e.target.id));});},{rootMargin:'-15% 0px -65% 0px'});
    readingLinks.forEach(a=>{const target=document.getElementById(a.hash.slice(1));if(target)io.observe(target);});
  }
  const contactForm=document.querySelector('.page-contact form.form-grid');
  if(contactForm){
    const pending=document.createElement('p');
    pending.className='contact-interface-status';pending.setAttribute('role','status');
    pending.textContent='留言接口待接入，当前不会发送或保存留言。';
    contactForm.append(pending);
    contactForm.addEventListener('submit',e=>{
      e.preventDefault();e.stopImmediatePropagation();
      pending.textContent='留言接口待接入，当前未发送或保存留言。请使用页面列出的客服联系方式。';
      window.toast?.('留言接口待接入，当前未发送或保存留言');
    },true);
  }
})();
