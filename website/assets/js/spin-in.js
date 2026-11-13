/* ==========================================================================
   M-10 · 旋转飞入（Spin-Fly-In）
   规范：docs/handover-20261113/动效规范库.md → M-10
   用法：<div class="spin-group"> 包住一组 <div class="spin-in">
   - 组触发（组顶边到视口 90%），播一次，不随滚动回退
   - 组内错峰 70ms/枚（组上 data-sp-step 可覆盖）
   - 动效关闭 / 减少动效 / 无 IntersectionObserver：直接落终态
   - 不用 {once:true}：卡内 img 的动画结束事件会冒泡上来，once 会被
     首个冒泡事件吃掉；必须判断 animationName 后手动解绑
   ========================================================================== */
(function () {
  'use strict';

  var groups = [].slice.call(document.querySelectorAll('.spin-group'));
  if (!groups.length) return;

  var body = document.body;
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function motionOn() {
    return !body.classList.contains('motion-off') && !(reduce && reduce.matches);
  }

  var DUR = 900;   // 单卡时长（ms），与 CSS --sp-dur 保持一致
  var STEP = 70;   // 错峰步长（ms）

  var list = groups.map(function (group) {
    var items = [].slice.call(group.querySelectorAll('.spin-in'));
    if (!items.length) return null;
    var step = parseFloat(group.getAttribute('data-sp-step'));
    return {
      group: group,
      items: items,
      step: isFinite(step) ? step : STEP,
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
    g.items.forEach(function (el, i) {
      var delay = i * g.step;
      el.style.animationDelay = delay + 'ms';
      el.classList.add('si-play');
      // 只认卡片自身的动画名；img 的 spinIcon10 结束事件会冒泡上来
      var onEnd = function (e) {
        if (e.animationName !== 'spinFlyIn10') return;
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

  // 一组一个 observer：组触发，播完即断开
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
