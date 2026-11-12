/* Isolated design review interactions. Production never loads this script. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 540px)');
  const toggle = document.getElementById('motion-toggle');
  let enabled = false;
  const running = new Set();
  const finalise = () => { running.forEach(a => a.cancel()); running.clear(); };
  function syncMotion() {
    const active = enabled && !media.matches;
    document.body.classList.toggle('motion-on', active);
    document.body.classList.toggle('motion-off', !active);
    toggle.setAttribute('aria-pressed', String(active));
    toggle.textContent = media.matches ? '系统已减少动效' : `动效演示：${active ? '开启' : '关闭'}`;
    toggle.disabled = media.matches;
    if (!active) finalise();
  }
  toggle.addEventListener('click', () => { enabled = !enabled; syncMotion(); });
  media.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('is-background', document.hidden);
    if (document.hidden) finalise();
  });
  syncMotion();
  function animate(el, frames, options) {
    if (!enabled || media.matches || document.hidden || !el.animate) return;
    const a = el.animate(frames, options);
    running.add(a);
    a.finished.then(() => running.delete(a), () => running.delete(a));
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('is-onscreen', entry.isIntersecting);
      if (entry.isIntersecting && enabled && !entry.target.dataset.played && !media.matches) {
        entry.target.dataset.played = 'true';
        animate(entry.target, [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
    }), { threshold: .12 }).observe(document.querySelector('.float-card'));
    const entrance = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting || !enabled || media.matches || entry.target.dataset.played) return;
      entry.target.dataset.played = 'true';
      animate(entry.target, [{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' });
    }), { threshold: .15 });
    document.querySelectorAll('[data-entrance]').forEach(el => entrance.observe(el));
  }
  const menuButton = document.querySelector('.menu-button');
  const menu = document.getElementById('review-links');
  const setMenu = open => { menu.classList.toggle('is-open', open); menuButton.setAttribute('aria-expanded', String(open)); };
  menuButton.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
  menu.addEventListener('click', e => { if (e.target.closest('a') && mobile.matches) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuButton.focus(); } });
  const data = JSON.parse(document.getElementById('market-data').textContent);
  const tabs = [...document.querySelectorAll('.market-tab')];
  const tablist = document.querySelector('.market-tabs');
  const groups = [...document.querySelectorAll('.instrument-group')];
  const panel = document.getElementById('market-panel');
  let tabAnimation;
  function select(key, focus = false) {
    const record = data[key];
    if (!record) return;
    if (tabAnimation) tabAnimation.cancel();
    tabs.forEach(tab => {
      const selected = tab.dataset.market === key;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected) { panel.setAttribute('aria-labelledby', tab.id); if (focus) tab.focus(); }
    });
    groups.forEach(group => { group.hidden = group.dataset.instrumentGroup !== key; });
    document.getElementById('market-symbol').textContent = record.symbol;
    document.getElementById('market-name').textContent = record.name;
    document.getElementById('market-description').textContent = record.description;
    document.getElementById('market-price').textContent = record.price;
    const change = document.getElementById('market-change');
    change.textContent = record.change;
    change.classList.toggle('negative', key === 'energy');
    const path = record.values.map((v, i) => `${i ? 'L' : 'M'}${(i * 500 / (record.values.length - 1)).toFixed(1)} ${(v * .8 + 12).toFixed(1)}`).join(' ');
    document.getElementById('chart-line').setAttribute('d', path);
    document.getElementById('chart-line').setAttribute('stroke', key === 'energy' ? '#9d333b' : '#006c45');
    document.getElementById('chart-area').setAttribute('d', `${path} L500 190 H0Z`);
    document.getElementById('market-status').textContent = `${record.label}，${record.count} 个品种。报价与图表为非实时展示示例。`;
    if (enabled && !media.matches && panel.animate) {
      // Design-review sample demonstrates entry only; exit choreography remains specified.
      tabAnimation = panel.animate([{ opacity: .25 }, { opacity: 1 }], { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)' });
      running.add(tabAnimation);
      const current = tabAnimation;
      current.finished.then(() => running.delete(current), () => running.delete(current));
    }
    const url = new URL(location.href);
    url.searchParams.set('market', key);
    try { history.replaceState(null, '', url); } catch { /* file previews can forbid URL changes */ }
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab.dataset.market));
    tab.addEventListener('keydown', e => {
      let index;
      if (e.key === 'ArrowRight') index = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') index = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') index = 0;
      else if (e.key === 'End') index = tabs.length - 1;
      else return;
      e.preventDefault();
      select(tabs[index].dataset.market, true);
    });
  });
  const initial = new URL(location.href).searchParams.get('market');
  select(data[initial] ? initial : 'gold');
  tablist.hidden = false;
  document.querySelectorAll('[data-js-note]').forEach(el => { el.hidden = true; });
})();
