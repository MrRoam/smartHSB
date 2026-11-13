/* ==========================================================================
   M-05 · 方位移入（Directional Slide-In）
   规范：00-项目管理/2026-11-12_动效规范库.md → M-05
   参数与源站 minpilot.webflow.io 特性区一致：
     单块 500ms，power1.out = cubic-bezier(0.5, 1, 0.89, 1)
     起始 opacity 0 + 自身尺寸 60% 的方位偏移，无 scale / rotate / blur
     组内错峰总量 0.4s：step = 400 / (n - 1)
     触发 = 组顶边到达视口 90%（rootMargin -10%），播一次，不 scrub
   data-dir 未显式写死的块按 R2「按序轮转」下→左→右→上自动分配；
   全组要同向（R1）时逐个写 data-dir，脚本不覆盖已有值。
   ========================================================================== */
(function () {
  'use strict';

  var groups = [].slice.call(document.querySelectorAll('.si-group'));
  if (!groups.length) return;

  var body = document.body;
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function motionOn() {
    return !body.classList.contains('motion-off') && !(reduce && reduce.matches);
  }

  var TOTAL = 400;   // 错峰总量（ms）
  var DUR = 500;     // 单块时长（ms）
  var DIRS = ['bottom', 'left', 'right', 'top'];

  var list = groups.map(function (group) {
    var items = [].slice.call(group.querySelectorAll('.slide-in'));
    if (!items.length) return null;
    items.forEach(function (el, i) {
      if (!el.hasAttribute('data-dir')) el.setAttribute('data-dir', DIRS[i % 4]);
    });
    // 组级位移覆盖：整幅宽块用 60% 自身宽度会位移过大（规范约束 2），
    // 写 data-si-shift="120px" 让全组改用固定距离，轴按各自 data-dir 决定
    var shift = group.getAttribute('data-si-shift');
    if (shift) {
      items.forEach(function (el) {
        var d = el.getAttribute('data-dir');
        el.style.setProperty(d === 'left' || d === 'right' ? '--si-x' : '--si-y', shift);
      });
    }
    var total = parseFloat(group.getAttribute('data-si-total'));
    return {
      group: group,
      items: items,
      total: isFinite(total) ? total : TOTAL,
      io: null,
      played: false
    };
  }).filter(Boolean);

  if (!list.length) return;

  function finish(el) {
    el.classList.remove('si-play');
    el.classList.add('si-done');       // 让初始隐藏规则失效，transform 交还元素
    el.style.removeProperty('animation-delay');
  }

  // 动效关闭 / 不支持 IO：一次性落到终态，内容不得被初始 opacity 挡住
  if (!motionOn() || !('IntersectionObserver' in window)) {
    list.forEach(function (g) {
      g.played = true;
      g.items.forEach(finish);
    });
    return;
  }

  function play(g) {
    if (g.played) return;
    g.played = true;
    var step = g.items.length > 1 ? g.total / (g.items.length - 1) : 0;
    g.items.forEach(function (el, i) {
      var delay = i * step;
      el.style.animationDelay = delay + 'ms';
      el.classList.add('si-play');
      // 不用 {once:true}：块内子元素动画结束也会冒泡上来，once 会被首个事件吃掉
      var onEnd = function (e) {
        if (e.animationName !== 'slideIn05') return;
        el.removeEventListener('animationend', onEnd);
        finish(el);
      };
      el.addEventListener('animationend', onEnd);
      // 兜底：标签页切走等情况下 animationend 可能不派发，避免停在 opacity 0
      setTimeout(function () {
        el.removeEventListener('animationend', onEnd);
        finish(el);
      }, delay + DUR + 250);
    });
  }

  // 一组一个 observer：组触发，不随滚动回退
  list.forEach(function (g) {
    g.io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        g.io.disconnect();
        play(g);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    g.io.observe(g.group);
  });

  // 全站动效开关：关闭时立即定格终态，重新开启不重播
  body.addEventListener('smarthsb-motion-change', function (e) {
    if (e.detail && e.detail.enabled) return;
    list.forEach(function (g) {
      if (g.io) g.io.disconnect();
      g.played = true;
      g.items.forEach(finish);
    });
  });
})();
