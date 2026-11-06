(() => {
  'use strict';
  const mobile = document.querySelector('#mobile-nav');
  const toggle = document.querySelector('.menu-toggle');
  if (!mobile || !toggle) return;

  function closeMobile() {
    mobile.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开菜单');
    mobile.querySelectorAll('details[open]').forEach(details => { details.open = false; });
  }

  // The original homepage switches at 800px; the restored hierarchy needs 1050px.
  matchMedia('(min-width:1051px)').addEventListener('change', e => {
    if (e.matches) closeMobile();
  });

  mobile.querySelectorAll('.mobile-nav-group').forEach(details => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      mobile.querySelectorAll('.mobile-nav-group[open]').forEach(other => {
        if (other !== details) other.open = false;
      });
    });
  });

  const groups = [...document.querySelectorAll('.navigation-complete .nav-group')];
  groups.forEach(group => {
    const trigger = group.querySelector('.nav-trigger');
    const links = [...group.querySelectorAll('.dropdown a')];
    trigger.addEventListener('keydown', e => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      groups.forEach(other => {
        const open = other === group;
        other.classList.toggle('open', open);
        other.querySelector('.nav-trigger').setAttribute('aria-expanded', String(open));
      });
      (e.key === 'ArrowDown' ? links[0] : links[links.length - 1])?.focus();
    });
    links.forEach((link, index) => link.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowDown') next = (index + 1) % links.length;
      if (e.key === 'ArrowUp') next = (index - 1 + links.length) % links.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = links.length - 1;
      if (next !== undefined) { e.preventDefault(); links[next].focus(); }
    }));
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const active = document.activeElement;
    const group = active?.closest('.navigation-complete .nav-group');
    if (group) group.querySelector('.nav-trigger')?.focus();
    if (mobile.contains(active)) { closeMobile(); toggle.focus(); }
  });
})();
