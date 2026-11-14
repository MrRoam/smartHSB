(function () {
  var items = document.querySelectorAll('.hero-ticker');
  if (!items.length) return;

  // 无障碍：系统「减少动效」或页内动效开关关闭时，滚动交给 CSS 静态居中，
  // 这里不再测量宽度、不再写入 --ticker-* 变量，避免无意义的强制布局。
  var reducedQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function motionOff() {
    return !!(reducedQuery && reducedQuery.matches) || document.body.classList.contains('motion-off');
  }

  function layout() {
    var still = motionOff();
    items.forEach(function (el) {
      if (still) {
        el.classList.remove('is-static');
        el.style.removeProperty('--ticker-from');
        el.style.removeProperty('--ticker-to');
        el.style.removeProperty('--ticker-dur');
        return;
      }
      var track = el.querySelector('.hero-ticker__track');
      if (!track) return;
      var pad = 12;
      var travel = el.clientWidth - track.scrollWidth - pad * 2;
      el.style.setProperty('--ticker-from', pad + 'px');
      el.style.setProperty('--ticker-to', (pad + travel) + 'px');
      // 速度约 45px/s（原 90 的一半），单程限 8–20s
      var dur = Math.min(20, Math.max(8, Math.abs(travel) / 45));
      el.classList.toggle('is-static', Math.abs(travel) < 40);
      el.style.setProperty('--ticker-dur', dur.toFixed(2) + 's');
    });
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(layout).catch(function () {});
  }
  layout();
  window.addEventListener('load', layout);
  var t;
  window.addEventListener('resize', function () {
    clearTimeout(t);
    t = setTimeout(layout, 120);
  });

  // 偏好/开关变化时重新排版：关 → 静止居中，开 → 恢复滚动
  if (reducedQuery) {
    if (reducedQuery.addEventListener) reducedQuery.addEventListener('change', layout);
    else if (reducedQuery.addListener) reducedQuery.addListener(layout);
  }
  document.body.addEventListener('smarthsb-motion-change', layout);
})();
