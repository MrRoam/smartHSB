/* Optional shared choreography. Existing page controllers own motion preference. */
(() => {
  'use strict';
  const body = document.body;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set();
  const enabled = () => !reduce.matches && !body.classList.contains('motion-off') && !document.hidden;
  function animate(node, frames, options) {
    if (!enabled() || !node?.animate) return;
    const animation = node.animate(frames, {duration:650,easing:'cubic-bezier(.22,1,.36,1)',...options});
    active.add(animation);
    animation.finished.then(() => active.delete(animation), () => active.delete(animation));
  }
  function sync() {
    body.classList.toggle('is-background', document.hidden);
    if (!enabled()) {active.forEach(animation => animation.cancel());active.clear();}
  }
  body.addEventListener('smarthsb-motion-change', sync);
  document.addEventListener('visibilitychange', sync);
  reduce.addEventListener('change', sync);
  new MutationObserver(sync).observe(body, {attributes:true,attributeFilter:['class']});
  sync();
  if (!('IntersectionObserver' in window)) return;

  const regions = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.classList.toggle('motion-visible', entry.isIntersecting);
  }), {threshold:0,rootMargin:'50px'});
  document.querySelectorAll('.internal-site .page-hero,.inner-scene,.trade-hero-scene,.platform-download-scene,.tool-scene,.trade-quotes-surface,.platform-float,.platform-insight,.reward-art,.footer-wordmark').forEach(node => {
    node.classList.add('motion-region');regions.observe(node);
  });
  document.querySelectorAll('.insight-bars i').forEach((bar, index) => bar.style.setProperty('--bar-index',index));

  const entrances = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entrances.unobserve(entry.target);
    const node = entry.target;
    const image = node.matches('.s-visual,.shot,.reward-art,.platform-download-scene');
    animate(node,[{opacity:0,transform:image?'scale(.97)':'translateY(60%)'},{opacity:1,transform:'none'}],{duration:image?850:500,easing:'cubic-bezier(.5,1,.89,1)'});
  }), {threshold:.08});
  // M-01/M-02/M-05 components own their entrances. Never animate their ancestors too.
  const targets = document.querySelectorAll('.internal-site .motion-heading,.internal-site .s-visual,.internal-site .shot,.internal-site .platform-download-scene');
  targets.forEach(node => {
    entrances.observe(node);
  });

  // Event-driven pointer glow: one frame for the current card, none while idle.
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
  let pointerFrame = 0;
  document.querySelectorAll('.internal-site .motion-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (!enabled() || !finePointer.matches) return;
      cancelAnimationFrame(pointerFrame);
      const x = event.clientX, y = event.clientY;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        if (!enabled()) return;
        const bounds = card.getBoundingClientRect();
        card.style.setProperty('--pointer-x', `${x - bounds.left}px`);
        card.style.setProperty('--pointer-y', `${y - bounds.top}px`);
      });
    }, {passive:true});
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(pointerFrame);pointerFrame = 0;
      card.style.removeProperty('--pointer-x');card.style.removeProperty('--pointer-y');
    });
  });

  // Keep the complete content usable while tab/FAQ state changes are in motion.
  document.querySelectorAll('.internal-site .tabs [data-tab]').forEach(button => button.addEventListener('click', () => {
    requestAnimationFrame(() => {
      const section = button.closest('section');
      const panel = section?.querySelector('.tab-panel.active');
      if (panel) {panel.getAnimations().forEach(animation => animation.cancel());animate(panel,[{opacity:.45,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:280});}
    });
  }));
  document.querySelectorAll('.faq-q').forEach(button => button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    if (item?.classList.contains('open')) animate(item.querySelector('.faq-a'),[{opacity:.3,transform:'translateY(-5px)'},{opacity:1,transform:'none'}],{duration:260});
  }));
  document.querySelectorAll('.faq-list details').forEach(details => details.addEventListener('toggle', () => {
    if (details.open) animate(details.querySelector('div'),[{opacity:.3,transform:'translateY(-5px)'},{opacity:1,transform:'none'}],{duration:260});
  }));
})();
