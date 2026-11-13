(function () {
  var items = document.querySelectorAll('.bottom-ticker');
  if (!items.length) return;

  function layout() {
    items.forEach(function (el) {
      var track = el.querySelector('.bottom-ticker__track');
      if (!track) return;
      var pad = 18;
      var travel = el.clientWidth - track.scrollWidth - pad * 2;
      el.style.setProperty('--ticker-from', pad + 'px');
      el.style.setProperty('--ticker-to', (pad + travel) + 'px');
      // 速度约 55px/s，往返各算一次，限制在 5–15s
      var dur = Math.min(10, Math.max(4, Math.abs(travel) / 90));
      el.classList.toggle('is-static', Math.abs(travel) < 60);
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
