/* ==========================================================================
   M-03 · 滚动展开（Scroll-Unfold）· 标准宽度型
   用法：容器加 class="js-m3w"，内部内容包一层 <div class="m3w-body">
   与 scroll-unfold.js（M-03+C clip-path 版）同节奏：
     start = 容器顶边到达视口底部（top bottom）
     end   = 容器 30% 高度线到达视口 50% 高度线（30% 50%）
     scrub = 0.8s（时间常数 ≈0.27s，0.8s 收敛约 95%）
     clamp = true（越界停住 0% / 100%），双向、1:1 跟随滚动
   差异点：paint 写 width 百分比；.m3w-body 宽度锁定为最终像素宽，
   展开时中心两侧对称裁切、文字零重排；window load 时重新量宽防字体漂移
   ========================================================================== */
(function () {
  'use strict';

  var wins = [].slice.call(document.querySelectorAll('.js-m3w'));
  if (!wins.length) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || document.body.classList.contains('motion-off')) return;

  var SMOOTH = 0.8;          // 秒，scrub: 0.8
  var EPS = 0.0008;

  var items = wins.map(function (win) {
    var body = win.querySelector(':scope > .m3w-body') || win.firstElementChild;
    if (!body) return null;
    lockBody(body);
    win.classList.add('is-m3w');
    return { win: win, body: body, cur: 0 };
  }).filter(Boolean);
  if (!items.length) return;

  function lockBody(body) {
    body.style.width = '';                   // 先还原，取自然宽度
    body.style.width = body.offsetWidth + 'px';
  }

  function progress(it) {
    var rect = it.win.getBoundingClientRect();
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
    it.win.style.width = (p * 100).toFixed(3) + '%';
  }

  items.forEach(function (it) {
    it.cur = progress(it);                   // 首帧直接到位，避免已在视口内的元素重新长一次
    paint(it, it.cur);
  });

  // 字体加载等导致内容宽度变化时，重新锁定并按当前进度重绘
  // 注意：必须先把窗口临时放到 100% 宽再量，否则窗口处于 0% 时量出 0px 会锁死
  window.addEventListener('load', function () {
    items.forEach(function (it) {
      var prev = it.win.style.width;
      it.win.style.width = '100%';
      lockBody(it.body);
      it.win.style.width = prev;
      paint(it, it.cur);
    });
  });

  var last = performance.now();
  function tick(now) {
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    var k = 1 - Math.exp(-dt / (SMOOTH / 3));
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
