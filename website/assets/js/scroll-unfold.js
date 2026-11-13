/* ==========================================================================
   M-03 · 滚动展开（Scroll-Unfold）
   用法：给块级容器加 class="unfold js-unfold"
   参数与源站 minpilot.webflow.io 一致：
     start = 容器顶边到达视口底部（top bottom）
     end   = 容器 30% 高度线到达视口 50% 高度线（30% 50%）
     区间  = 0.5 × 视口高 + 0.3 × 容器高
     scrub = 0.8s（滚动停下后约 0.8s 补完剩余差值）
     clamp = true（越界停住 0% / 100%）
     双向、1:1 跟随滚动
   ========================================================================== */
(function () {
  'use strict';

  var wraps = [].slice.call(document.querySelectorAll('.js-unfold'));
  if (!wraps.length) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || document.body.classList.contains('motion-off')) return;

  var SMOOTH = 0.8;          // 秒，与源站 scrub: 0.8 一致
  var EPS = 0.0008;

  var items = wraps.map(function (el) {
    el.classList.add('is-unfold');
    return { el: el, cur: 0 };
  });

  function progress(it) {
    var rect = it.el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var h = rect.height;
    var startTop = vh;                       // 顶边贴视口底
    var endTop = vh * 0.5 - h * 0.3;         // 30% 线贴视口中线
    var span = startTop - endTop;
    if (span <= 0) return 1;
    var p = (startTop - rect.top) / span;
    return p < 0 ? 0 : p > 1 ? 1 : p;
  }

  function paint(it, p) {
    var side = (1 - p) * 50;                 // 左右各裁掉的一半宽度（%）
    if (side < 0.05) {
      it.el.style.clipPath = 'none';
    } else {
      var s = side.toFixed(3) + '%';
      it.el.style.clipPath = 'inset(0 ' + s + ' 0 ' + s + ')';
    }
  }

  items.forEach(function (it) {
    it.cur = progress(it);                   // 首帧直接到位，避免已在视口内的元素重新长一次
    paint(it, it.cur);
  });

  var last = performance.now();
  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    var k = 1 - Math.exp(-dt / (SMOOTH / 3));   // 时间常数 ≈0.27s，0.8s 收敛约 95%
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var t = progress(it);
      if (Math.abs(t - it.cur) < EPS) {
        if (it.cur === t) continue;
        it.cur = t;
      } else {
        it.cur += (t - it.cur) * k;
      }
      paint(it, it.cur);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
