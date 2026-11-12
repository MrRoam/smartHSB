/* 轻提示：首页未加载 main.js，此处提供同名 toast，供语言切换等占位入口使用 */
(() => {
  let el = null, timer = null;
  window.toast = msg => {
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('show'), 2600);
  };
})();

(() => {
  'use strict';
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
  let savedMotion;
  try { savedMotion = localStorage.getItem('hsb-motion'); } catch {}
  let userMotion = savedMotion !== 'off';
  let motion = userMotion && !prefersReduced.matches;
  const body = document.body;
  const toggle = document.querySelector('#motion-toggle');
  const canvasRenderers = [];
  const activeAnimations = new Set();
  let pendingMarketPaint = null;
  function animateElement(el, frames, options) {
    if (!motion || document.hidden || !el.animate) return null;
    const animation = el.animate(frames, options);
    activeAnimations.add(animation);
    animation.finished.then(() => activeAnimations.delete(animation), () => activeAnimations.delete(animation));
    return animation;
  }
  function finishEnhancements() {
    pendingMarketPaint?.();
    activeAnimations.forEach(animation => animation.cancel());
    activeAnimations.clear();
  }
  function applyMotion() {
    motion = userMotion && !prefersReduced.matches;
    body.classList.toggle('motion-off', !motion);
    body.classList.toggle('js-motion', motion);
    toggle.disabled = prefersReduced.matches;
    toggle.setAttribute('aria-pressed', String(!motion));
    toggle.innerHTML = prefersReduced.matches ? '动效：系统已关闭' : `动效：${motion ? '开启' : '关闭'} <span aria-hidden="true">${motion ? '◉' : '○'}</span>`;
    if (!motion) finishEnhancements();
    document.querySelectorAll('svg').forEach(svg => {
      if (motion) svg.unpauseAnimations?.(); else svg.pauseAnimations?.();
    });
    canvasRenderers.forEach(renderer => renderer());
    body.dispatchEvent(new CustomEvent('smarthsb-motion-change',{detail:{enabled:motion}}));
  }
  applyMotion();
  toggle.addEventListener('click', () => {
    userMotion = !userMotion;
    try { localStorage.setItem('hsb-motion', userMotion ? 'on' : 'off'); } catch {}
    applyMotion();
  });
  prefersReduced.addEventListener('change', applyMotion);
  function syncVisibility() {
    body.classList.toggle('is-background', document.hidden);
    if (document.hidden) finishEnhancements();
  }
  document.addEventListener('visibilitychange', syncVisibility);
  syncVisibility();
  // All copy is readable before enhancement, and after cancellation or script failure.
  if ('IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('.overview-intro h2, .platform-copy, .platform-visual, .markets .section-head');
    const entrance = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting || !motion || document.hidden) return;
      entrance.unobserve(entry.target);
      if (entry.target.matches('.platform-copy')) {
        [entry.target.querySelector('h2'), entry.target.querySelector('.body-large'), entry.target.querySelector('.platform-actions')].filter(Boolean).forEach((el, i) => {
          animateElement(el, [{opacity:0, transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}], {duration:700,delay:i*80,easing:'cubic-bezier(.22,1,.36,1)'});
        });
      } else if (entry.target.matches('.overview-intro h2')) {
        [...entry.target.childNodes].forEach(node => {
          if (node.nodeName === 'BR') node.replaceWith(document.createElement('br'));
        });
        // Lines retain their existing break points and accessible text order.
        const lines = entry.target.innerHTML.split(/<br\s*\/?\s*>/i);
        entry.target.replaceChildren();
        lines.forEach((line, i) => {
          const span = document.createElement('span'); span.className = 'reveal-line'; span.innerHTML = line; entry.target.append(span);
          animateElement(span,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,delay:i*80,easing:'cubic-bezier(.22,1,.36,1)'});
        });
      } else {
        animateElement(entry.target,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{duration:entry.target.matches('.platform-visual')?800:700,delay:80,easing:'cubic-bezier(.22,1,.36,1)'});
      }
    }), {threshold:.15});
    revealTargets.forEach(el => entrance.observe(el));
    const floatObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-onscreen',entry.isIntersecting)),{threshold:.12});
    document.querySelectorAll('.platform-float').forEach(el => floatObserver.observe(el));
  }

  const header = document.querySelector('#header');
  header.classList.remove('hidden-header');
  const groups = [...document.querySelectorAll('.nav-group')];
  function closeGroups() { groups.forEach(group => { group.classList.remove('open'); group.querySelector('button').setAttribute('aria-expanded','false'); }); }
  groups.forEach(group => {
    const trigger = group.querySelector('button');
    function setOpen(open) { closeGroups(); group.classList.toggle('open', open); trigger.setAttribute('aria-expanded', String(open)); }
    // Hover may open the menu before the click arrives; clicking must keep it open.
    trigger.addEventListener('click', () => setOpen(true));
    group.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) setOpen(true); });
    group.addEventListener('mouseleave', closeGroups);
    group.addEventListener('focusout', e => { if (!group.contains(e.relatedTarget)) closeGroups(); });
  });
  document.addEventListener('click', e => { if (!e.target.closest('.nav-group')) closeGroups(); });
  const menu = document.querySelector('#mobile-nav');
  const menuToggle = document.querySelector('.menu-toggle');
  function closeMobile() { menu.hidden = true; menuToggle.setAttribute('aria-expanded','false'); menuToggle.setAttribute('aria-label','打开菜单'); }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单'); menu.hidden = !open;
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeGroups(); closeMobile(); } });
  matchMedia('(min-width:1051px)').addEventListener('change', e => { if (e.matches) closeMobile(); });
  header.addEventListener('focusin', () => header.classList.remove('hidden-header'));
  let scrollQueued = false;
  addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      header.classList.toggle('sticky', y > 120);
      scrollQueued = false;
    });
  }, {passive:true});

  const marketData = {
    gold:{symbol:'XAU / USD',name:'黄金，全球共同的语言。',description:'关注黄金与白银，把握贵金属市场的变化。',icon:'Au',price:'2,384.70',change:'+0.45% ↗',short:'黄金 / 美元',values:[164,155,160,139,144,126,137,105,112,126,90,101,82,94,62,72,49,60,32,40,20,29]},
    fx:{symbol:'EUR / USD',name:'让视野，跨越边界。',description:'连接主要货币对，观察全球经济的每一次变化。',icon:'€',price:'1.08640',change:'+0.12% ↗',short:'欧元 / 美元',values:[125,112,130,118,97,112,84,105,91,70,83,98,72,55,71,53,62,35,50,37,23,32]},
    index:{symbol:'HK50',name:'追踪市场的整体脉搏。',description:'关注全球主要股指，理解更广泛的市场趋势。',icon:'↗',price:'18,420.5',change:'+0.28% ↗',short:'恒生指数',values:[155,151,139,150,130,118,133,107,117,103,111,80,91,75,89,55,65,45,60,28,36,22]},
    energy:{symbol:'USOIL',name:'感受全球经济的能量。',description:'探索原油等能源品种，关注供需与市场变化。',icon:'Oil',price:'71.240',change:'−0.35% ↘',short:'WTI 原油',values:[45,55,32,40,64,51,78,67,88,69,104,86,112,96,127,110,141,123,152,135,160,149]}
  };
  const panel = document.querySelector('#market-panel');
  function paintMarket(key) {
    const data = marketData[key];
    document.querySelector('#market-symbol').textContent=data.symbol;
    document.querySelector('#market-name').textContent=data.name;
    document.querySelector('#market-description').textContent=data.description;
    document.querySelector('#market-icon').textContent=data.icon;
    document.querySelectorAll('[data-instrument-group]').forEach(group => {
      const active = group.dataset.instrumentGroup === key;
      group.hidden = !active;
      if (active) group.querySelector('.instrument-list').scrollTop = 0;
    });
    const path = data.values.map((v,i)=>(i?'L':'M')+(i*600/(data.values.length-1)).toFixed(1)+' '+v).join('');
    document.querySelector('.large-line').setAttribute('d',path);
    document.querySelector('.large-area').setAttribute('d',path+'L600 200H0Z');
    const down = data.values[data.values.length-1] > data.values[0];
    document.querySelector('.large-line').style.stroke = down ? '#9D333B' : '';
    document.querySelector('.large-area').style.fill = down ? 'url(#largeFillDown)' : '';
    document.querySelector('#market-price').textContent = data.price;
    const change = document.querySelector('#market-change');
    change.textContent = data.change; change.classList.toggle('negative',down);
    document.querySelector('#market-status').textContent = `${data.symbol}；报价和图表为非实时展示示例。`;
    panel.setAttribute('aria-busy','false');
    const lastV = data.values[data.values.length-1];
    const yPct = (lastV/200*100).toFixed(1)+'%';
    const baseline = document.querySelector('#chart-baseline'), tag = document.querySelector('#chart-last');
    if (baseline) { baseline.style.top = yPct; baseline.classList.toggle('down', down); }
    if (tag) { tag.style.top = yPct; tag.textContent = data.price; tag.classList.toggle('down', down); }
  }
  let marketAnimation = null, marketGeneration = 0;
  async function selectMarket(key, animate = true) {
    if (!marketData[key]) return;
    const generation = ++marketGeneration;
    marketAnimation?.cancel();
    document.querySelectorAll('.market-tab').forEach(tab => {
      const active = tab.dataset.market === key;
      tab.classList.toggle('active',active); tab.setAttribute('aria-selected',String(active)); tab.tabIndex=active?0:-1;
    });
    panel.setAttribute('aria-labelledby','tab-'+key);
    panel.setAttribute('aria-busy','true');
    const commit = () => { paintMarket(key); pendingMarketPaint = null; };
    pendingMarketPaint = commit;
    const url = new URL(location.href); url.searchParams.set('market',key);
    try { history.replaceState(null,'',url); } catch {}
    if (!animate || !motion || document.hidden || !panel.animate) { commit(); return; }
    marketAnimation = animateElement(panel,[{opacity:1},{opacity:0}],{duration:120,easing:'ease-out'});
    try { await marketAnimation.finished; } catch { return; }
    if (generation !== marketGeneration) return;
    commit();
    marketAnimation = animateElement(panel,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'cubic-bezier(.22,1,.36,1)'});
  }
  const tabs=[...document.querySelectorAll('.market-tab')];
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>selectMarket(tab.dataset.market));
    tab.addEventListener('keydown',e=>{
      let next;
      if(e.key==='ArrowRight'||e.key==='ArrowDown')next=(index+1)%tabs.length;
      if(e.key==='ArrowLeft'||e.key==='ArrowUp')next=(index+tabs.length-1)%tabs.length;
      if(e.key==='Home')next=0;
      if(e.key==='End')next=tabs.length-1;
      if(next!==undefined){e.preventDefault();tabs[next].focus();selectMarket(tabs[next].dataset.market);}
    });
  });
  const requestedMarket = new URL(location.href).searchParams.get('market');
  selectMarket(marketData[requestedMarket] ? requestedMarket : 'gold',false);
  document.querySelector('.market-selector').hidden = false;
  document.querySelectorAll('[data-hero-market]').forEach(button => button.addEventListener('click',()=>{
    const data=marketData[button.dataset.heroMarket];
    document.querySelectorAll('[data-hero-market]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});
    document.querySelector('.instrument-icon').textContent=data.icon;
    document.querySelector('.widget-top strong').textContent=data.short;
    document.querySelector('.widget-top small').textContent=data.symbol;
    document.querySelector('.widget-price b').textContent=data.price;
    document.querySelector('.widget-price>span').textContent=data.change;
    const color=button.dataset.heroMarket==='energy'?'#b85a60':'#167e6c';
    document.querySelector('.widget-price>span').style.color=color;
    document.querySelector('.chart-line').style.stroke=color;
    document.querySelector('.chart-area').style.fill=color==='#b85a60'?'url(#chartFillDown)':'url(#chartFill)';
    const path=data.values.map((v,i)=>(i?'L':'M')+(i*320/(data.values.length-1)).toFixed(1)+' '+(v*.55+8).toFixed(1)).join('');
    document.querySelector('.chart-line').setAttribute('d',path);
    document.querySelector('.chart-area').setAttribute('d',path+'L320 120H0Z');
    if(motion){const line=document.querySelector('.chart-line');line.style.animation='none';void line.getBoundingClientRect();line.style.animation='drawLine 1.2s cubic-bezier(.3,0,.3,1) forwards';}
  }));
  document.querySelectorAll('.tool-chart i').forEach((bar,i)=>{bar.style.setProperty('--bar-h',([28,45,35,60,42,72,53,85,62,94,77][i])+'px');bar.style.transitionDelay=i*.035+'s';});

  // Source bitmap: column.com/images/index/map-source.png. Rendered as points,
  // with independently implemented entrance, breathing and pointer response.
  function pointMap(canvas, isFooter=false){
    if(!canvas)return;
    const ctx=canvas.getContext('2d');
    if(!ctx)return;
    let w=0,h=0,dpr=1,start=performance.now(),last=0,frame=0,visible=true;
    const pointer={x:-10000,y:-10000};
    const points=window.WORLD_POINTS||[];
    const gridLayer=document.createElement('canvas');
    function buildGrid(){
      gridLayer.width=w*dpr;gridLayer.height=h*dpr;
      const g=gridLayer.getContext('2d');
      g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,w,h);
      const step=9;
      g.fillStyle='#9ca8bf';
      for(let y=22;y<h;y+=step)for(let x=4;x<w;x+=step){const edge=Math.min(1,x/100,(w-x)/100,y/70,(h-y)/90);g.globalAlpha=.14*Math.max(0,edge);g.beginPath();g.arc(x,y,.65,0,Math.PI*2);g.fill();}
      g.globalAlpha=1;
    }
    const hubs=[
      [61,31,'NYC'],
      [108,24,'LDN'],
      [167,60,'JKT'],
      [171,43,'HKG'],
      [184,34,'TYO']
    ];
    const arcs=[[0,1,0],[1,3,.24],[1,2,.48],[4,3,.16],[3,2,.66]];
    function size(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);buildGrid();restart();}
    function draw(now,force=false){
      const introMix=!isFooter?(window.__hsbHeroIntroMix||0):0;
      const frameGap=introMix>.005?15:32;
      if(!force&&(!visible||document.hidden||now-last<frameGap)){if(motion)frame=requestAnimationFrame(draw);return;}
      last=now;ctx.clearRect(0,0,w,h);
      const mobile=w<600;
      const progress=motion?Math.min(1,Math.max(0,(now-start-260)/5000)):1;
      const eased=1-Math.pow(1-progress,4);
      const introBoot=motion?Math.min(1,Math.max(0,(now-start)/480)):1;
      const mapReveal=Math.max(eased,introMix*introBoot*.95);
      const mapW=mobile?w*2.0:w*1.15;
      const cell=mapW/220;
      const mapH=cell*110;
      const originX=mobile?-mapW*.46:w*.5-mapW*.32;
      const originY=isFooter?-mapH*.3:mobile?220:50;
      const zoom=1+(1-Math.max(eased,introMix*.65))*.6;
      const cx=w*.7,cy=h*.45;
      // The quiet grid is pre-rendered to an offscreen layer on resize;
      // each frame only blits it and animates the map points.
      ctx.globalAlpha=1-introMix*.55;
      ctx.drawImage(gridLayer,0,0,w,h);
      points.forEach((p,i)=>{
        let x=originX+p[0]*cell,y=originY+p[1]*cell;
        x=cx+(x-cx)*zoom;y=cy+(y-cy)*zoom;
        if(x< -8||x>w+8||y< -8||y>h+8)return;
        const wave=motion?Math.sin(now*.00055+p[0]*.023+p[1]*.04)*.1:0;
        const dx=x-pointer.x,dy=y-pointer.y,dist=Math.hypot(dx,dy);
        let push=motion?Math.max(0,1-dist/100):0;
        if(push>0&&dist>1){x+=dx/dist*push*5;y+=dy/dist*push*5;}
        const edge=Math.max(0,Math.min(1,y/65,(h-y)/100));
        const fade=mobile?.7:Math.max(.16+.24*introMix,Math.min(1,(x-w*.12)/(w*.4)));
        const radar=introMix>.01?Math.max(0,Math.sin(now*.0024-p[0]*.055))*.22*introMix:0;
        ctx.globalAlpha=(.52+introMix*.14+wave+radar+push*.15)*edge*fade*mapReveal;
        const blend=p[1]/110;
        const lr=142+blend*10,lg=195-blend*28,lb=190+blend*35;
        const dr=56+blend*38,dg=212-blend*48,db=186+blend*64;
        const r=Math.round(lr+(dr-lr)*introMix),g=Math.round(lg+(dg-lg)*introMix),b=Math.round(lb+(db-lb)*introMix);
        ctx.fillStyle=`rgb(${r},${g},${b})`;
        const radius=Math.max(.6,cell*.4*(.65+mapReveal*.35)+push*.7+introMix*.18);
        ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fill();
      });
      if(introMix>.02){
        const hubPts=hubs.map(hb=>{
          const hx=cx+(originX+hb[0]*cell-cx)*zoom;
          const hy=cy+(originY+hb[1]*cell-cy)*zoom;
          return {x:hx,y:hy,code:hb[2]};
        });
        ctx.lineWidth=1.15;
        arcs.forEach(([a,b,off])=>{
          const p1=hubPts[a],p2=hubPts[b];
          const span=Math.hypot(p2.x-p1.x,p2.y-p1.y);
          const mx=(p1.x+p2.x)*.5,my=(p1.y+p2.y)*.5-span*.2;
          ctx.strokeStyle=`rgba(94,234,212,${(.24*introMix*introBoot).toFixed(3)})`;
          ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.quadraticCurveTo(mx,my,p2.x,p2.y);ctx.stroke();
          const t=((now*.00062+off)%1),mt=1-t;
          const px=mt*mt*p1.x+2*mt*t*mx+t*t*p2.x;
          const py=mt*mt*p1.y+2*mt*t*my+t*t*p2.y;
          ctx.fillStyle=`rgba(167,243,208,${(.9*introMix*introBoot).toFixed(3)})`;
          ctx.beginPath();ctx.arc(px,py,2.1,0,Math.PI*2);ctx.fill();
        });
        ctx.font='600 8.5px SuisseMono,monospace';
        hubPts.forEach((hp,idx)=>{
          if(hp.x<8||hp.x>w-8||hp.y<16||hp.y>h-16)return;
          const pulse=((now*.0012+idx*.23)%1);
          const isHQ=hp.code==='JKT';
          ctx.strokeStyle=isHQ?`rgba(250,204,21,${((1-pulse)*.55*introMix).toFixed(3)})`:`rgba(110,231,183,${((1-pulse)*.5*introMix).toFixed(3)})`;
          ctx.lineWidth=1;
          ctx.beginPath();ctx.arc(hp.x,hp.y,3+pulse*13,0,Math.PI*2);ctx.stroke();
          ctx.fillStyle=isHQ?`rgba(250,204,21,${(.95*introMix).toFixed(3)})`:`rgba(110,231,183,${(.92*introMix).toFixed(3)})`;
          ctx.beginPath();ctx.arc(hp.x,hp.y,2.6,0,Math.PI*2);ctx.fill();
          if(!mobile){
            ctx.fillStyle=`rgba(203,213,225,${(.75*introMix*introBoot).toFixed(3)})`;
            ctx.fillText(hp.code,hp.x+6,hp.y+3);
          }
        });
      }
      ctx.globalAlpha=1;
      if(motion)frame=requestAnimationFrame(draw);
    }
    const parent=canvas.parentElement;
    parent.addEventListener('pointermove',e=>{if(!motion)return;const r=canvas.getBoundingClientRect();pointer.x=e.clientX-r.left;pointer.y=e.clientY-r.top;},{passive:true});
    parent.addEventListener('pointerleave',()=>{pointer.x=-10000;pointer.y=-10000;});
    new ResizeObserver(size).observe(canvas);
    new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(canvas);
    function restart(){cancelAnimationFrame(frame);if(motion)frame=requestAnimationFrame(draw);else draw(performance.now(),true);}
    canvasRenderers.push(restart);size();
  }
  pointMap(document.querySelector('#world-dots'));
  pointMap(document.querySelector('#footer-dots'),true);
})();
