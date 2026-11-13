(function () {
  var items = document.querySelectorAll('.hero-ticker');
  if (!items.length) return;

  function layout() {
    items.forEach(function (el) {
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
})();
