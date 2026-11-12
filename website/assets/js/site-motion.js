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
    const shift = node.matches('.tl-row,.step') ? 'translateX(18px)' : 'translateY(22px)';
    animate(node,[{opacity:.35,transform:image?'scale(.97)':shift},{opacity:1,transform:'none'}],{delay:Number(node.dataset.motionOrder || 0)*65,duration:image?850:650});
  }), {threshold:.08});
  const targets = document.querySelectorAll('.home-minpilot .trust-item,.home-minpilot .funding-details>div,.home-minpilot .reward-art,.home-minpilot .award-grid>div,.home-minpilot .media-line,.home-minpilot .final-inner,.internal-site .sec-head,.internal-site .stat,.internal-site .step,.internal-site .icard,.internal-site .tl-row,.internal-site .s-visual,.internal-site .shot,.internal-site .platform-download-scene');
  targets.forEach(node => {
    node.dataset.motionOrder = Math.min([...node.parentElement.children].indexOf(node),4);
    entrances.observe(node);
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
