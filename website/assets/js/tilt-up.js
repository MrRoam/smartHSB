/* ==========================================================================
   M-06 · 后仰扶正（Tilt-Up）—— 原生实现，无依赖
   规范：00-项目管理/2026-11-12_动效规范库.md → M-06

   关键约束（改之前先读）：
   1) 透视写在目标元素的直接父级（.tilt-stage）上，否则退化成纵向压扁；
   2) 触发进度必须用 offsetTop 链算布局位置，不能用 getBoundingClientRect().top
      —— 元素自身带 rotateX 时包围盒顶边随角度变化，会自反馈抖动；
   3) 容器高度取 offsetHeight，同理不能用包围盒高度。
   ========================================================================== */
(function () {
  'use strict';

  var els = [].slice.call(document.querySelectorAll('.js-tilt-up'));
  if (!els.length) return;

  var ANGLE = 45;        // deg，起始后仰角
  var DROP = -30;        // %，起始上抬量（按自身高度）
  var SMOOTH = 0.8;      // 秒，等同 ScrollTrigger scrub: 0.8
  var EPS = 0.0008;

  function readNum(el, attr, fallback) {
    var v = parseFloat(el.getAttribute(attr));
    return isFinite(v) ? v : fallback;
  }

  function layoutTop(el) {
    var y = 0, n = el;
    while (n) { y += n.offsetTop; n = n.offsetParent; }
    return y;
  }

  var items = els.map(function (el) {
    return {
      el: el,
      angle: readNum(el, 'data-tu-angle', ANGLE),
      drop: readNum(el, 'data-tu-drop', DROP),
      top: 0,
      h: 0,
      cur: 0
    };
  });

  function measure(it) {
    it.top = layoutTop(it.el);
    it.h = it.el.offsetHeight;
  }

  function progress(it) {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var startY = it.top - vh;                       // 容器顶边贴视口底
    var endY = it.top - (vh * 0.5 - it.h * 0.3);    // 容器 30% 线到视口中线
    var span = endY - startY;
    if (span <= 0) return 1;
    var p = (window.scrollY - startY) / span;
    return p < 0 ? 0 : p > 1 ? 1 : p;
  }

  function paint(it, p) {
    var k = 1 - p;
    if (k < 0.001) {
      it.el.style.transform = 'none';
      it.el.classList.add('tu-done');               // 让位给 hover 等后续状态
      return;
    }
    it.el.classList.remove('tu-done');
    it.el.style.transform =
      'translateY(' + (it.drop * k).toFixed(2) + '%) ' +
      'rotateX(' + (it.angle * k).toFixed(2) + 'deg)';
  }

  function still() {
    items.forEach(function (it) {
      it.el.style.transform = 'none';
      it.el.classList.add('tu-done');
    });
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || document.body.classList.contains('motion-off')) {
    items.forEach(measure);
    still();
    return;
  }

  items.forEach(measure);
  // 首帧直接落到当前进度，避免已在视口内的块重新倒一遍
  items.forEach(function (it) { it.cur = progress(it); paint(it, it.cur); });

  var last = performance.now();
  var running = true;

  function tick(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    var k = 1 - Math.exp(-dt / (SMOOTH / 3));        // 时间常数 ≈0.27s，0.8s 收敛约 95%
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

  // 尺寸变化后重测布局位置（内容高度可能变）
  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      items.forEach(measure);
      items.forEach(function (it) { it.cur = progress(it); paint(it, it.cur); });
    }, 150);
  });

  // 与首页动效开关联动
  document.body.addEventListener('smarthsb-motion-change', function (e) {
    if (e.detail && e.detail.enabled) {
      items.forEach(measure);
      items.forEach(function (it) { it.cur = progress(it); paint(it, it.cur); });
      if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); }
    } else {
      running = false;
      still();
    }
  });
})();
