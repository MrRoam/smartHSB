/* ==========================================================================
   M-08「翻页」/ Page Flip —— 规范：00-项目管理/2026-11-12_动效规范库.md
   用于「同一块容器内换内容」的交互（筛选 chip、分组切换、分页…）：
   旧内容绕顶边向前翻倒并淡出（160ms），换内容后新内容绕顶边翻平（240ms），
   容器高度在新旧内容之间平滑过渡，避免行数变少时整块塌缩。
   用法：
     window.hsbFlip(container, function () { 改 DOM });
   可选：window.hsbFlip(el, swap, { out: 160, in: 240, angle: 82 })
   无障碍：prefers-reduced-motion 或 body.motion-off 时直接换内容，不做动画。
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var EASE_OUT = 'cubic-bezier(0.4, 0, 1, 1)';
  var EASE_IN = 'cubic-bezier(0.2, 0.8, 0.25, 1)';

  function motionOn() {
    return !document.body.classList.contains('motion-off') && !reduced.matches;
  }

  // 关键帧带 offset：前段保持不透明（看得见"翻"），后段才淡出/淡入，
  // 否则 opacity 与旋转同速率衰减，观感只剩"压扁+消失"，读不出翻页。
  // 刻意不用 perspective：带透视时 rotateX 会近大远小，宽表格被放大 1.2~1.5 倍
  // 横向溢出容器，日期列会被裁掉半个字。平行投影下宽度恒定、只压纵向，
  // 翻页感靠"绕顶边压扁 + 亮度下沉"表达，且零裁切。
  function frames(angle, type, origin) {
    var half = Math.round(angle * 0.45);
    if (type === 'out') {
      return [
        { transformOrigin: origin, transform: 'translateY(0) rotateX(0deg)', opacity: 1, filter: 'brightness(1)', offset: 0 },
        { transformOrigin: origin, transform: 'translateY(1.5%) rotateX(' + half + 'deg)', opacity: 1, filter: 'brightness(.97)', offset: 0.5 },
        { transformOrigin: origin, transform: 'translateY(4%) rotateX(' + angle + 'deg)', opacity: 0, filter: 'brightness(.92)', offset: 1 }
      ];
    }
    return [
      { transformOrigin: origin, transform: 'translateY(-8%) rotateX(-' + angle + 'deg)', opacity: 0, filter: 'brightness(.92)', offset: 0 },
      { transformOrigin: origin, transform: 'translateY(-3%) rotateX(-' + half + 'deg)', opacity: 1, filter: 'brightness(.97)', offset: 0.45 },
      { transformOrigin: origin, transform: 'translateY(0) rotateX(0deg)', opacity: 1, filter: 'brightness(1)', offset: 1 }
    ];
  }

  window.hsbFlip = function (el, swap, opts) {
    opts = opts || {};
    if (!el || typeof swap !== 'function') return;
    if (el.__flipBusy) return;

    if (!motionOn() || !el.animate) { swap(); return; }

    var D_OUT = opts.out || 280;
    var D_IN = opts.in || 340;
    var ANGLE = opts.angle || 88;
    var ORIGIN = opts.origin || '50% 0%';
    var HEIGHT_EASE = 'height ' + (D_IN + 40) + 'ms ' + EASE_IN;

    var prev = {
      height: el.style.height,
      overflow: el.style.overflow,
      transition: el.style.transition
    };
    var h0 = el.getBoundingClientRect().height;

    // 3D 翻转会近大远小地把元素"撑"出边界，由父级裁切
    var host = el.parentElement;
    var prevHostOverflow = host ? host.style.overflow : '';

    el.__flipBusy = true;
    // 兜底：动画被外部打断（页面切换/元素被移除）时不至于永久锁死
    var safeTimer = setTimeout(function () { el.__flipBusy = false; }, D_OUT + D_IN + 1200);
    el.style.height = h0 + 'px';
    el.style.overflow = 'hidden';
    if (host) host.style.overflow = 'hidden';

    var out = el.animate(frames(ANGLE, 'out', ORIGIN),
      { duration: D_OUT, easing: EASE_OUT, fill: 'both' });

    out.finished.then(function () {
      out.cancel();
      // 量新内容高度：先放开高度，读完后立刻钉回旧高度，避免闪动
      el.style.height = 'auto';
      swap();
      var h1 = el.getBoundingClientRect().height;
      el.style.height = h0 + 'px';
      void el.offsetHeight;
      el.style.transition = HEIGHT_EASE;
      el.style.height = h1 + 'px';

      var inp = el.animate(frames(ANGLE, 'in', ORIGIN),
        { duration: D_IN, easing: EASE_IN, fill: 'both' });

      inp.finished.then(function () {
        inp.cancel();
        el.style.transition = prev.transition;
        el.style.height = prev.height;
        el.style.overflow = prev.overflow;
        if (host) host.style.overflow = prevHostOverflow;
        clearTimeout(safeTimer);
        el.__flipBusy = false;
      }).catch(function () {
        el.style.transition = prev.transition;
        el.style.height = prev.height;
        el.style.overflow = prev.overflow;
        if (host) host.style.overflow = prevHostOverflow;
        clearTimeout(safeTimer);
        el.__flipBusy = false;
      });
    }).catch(function () {
      swap();
      el.style.height = prev.height;
      el.style.overflow = prev.overflow;
      if (host) host.style.overflow = prevHostOverflow;
      clearTimeout(safeTimer);
      el.__flipBusy = false;
    });
  };
})();
