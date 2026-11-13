/* ==========================================================================
   M-04「飞入」/ Fly-In —— 规范：00-项目管理/2026-11-12_动效规范库.md
   目标元素：.fly-in（各自独立触发，顶边到视口 90% 时播一次）
   组错峰：.fi-group[data-fi-step="70"]，data-fi-order="reverse" 逆序
   初始态由本脚本加 .fi-ready（不依赖 html.js 标记，任何页面都可直接用）；
   播放结束加 .fi-done 归还 transform / opacity，并清掉 animation-delay。
   ========================================================================== */
(function () {
  'use strict';

  var items = Array.prototype.slice.call(document.querySelectorAll('.fly-in'));
  if (!items.length) return;

  var body = document.body;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function motionOn() {
    return !body.classList.contains('motion-off') && !reduced.matches;
  }

  function clearDelay(el) { el.style.removeProperty('animation-delay'); }

  function finish(el) {
    el.classList.remove('fi-play');
    el.classList.add('fi-done');
    clearDelay(el);
  }

  // data-fi-shift：覆盖距离（可写在元素或组容器上），符号跟随方向
  items.forEach(function (el) {
    var group = el.closest('.fi-group');
    var shift = el.getAttribute('data-fi-shift') || (group && group.getAttribute('data-fi-shift'));
    if (!shift) return;
    var dir = el.getAttribute('data-fi-dir') || 'right';
    if (dir === 'up' || dir === 'down') {
      el.style.setProperty('--fi-x', '0px');
      el.style.setProperty('--fi-y', (dir === 'up' ? '-' : '') + shift);
    } else {
      el.style.setProperty('--fi-y', '0px');
      el.style.setProperty('--fi-x', (dir === 'left' ? '-' : '') + shift);
    }
  });

  if (!motionOn() || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('fi-done'); });
    return;
  }

  items.forEach(function (el) { el.classList.add('fi-ready'); });

  // 组内同层 .fly-in 的顺序（嵌套组只取直接归属本组的）
  function peersOf(el) {
    var group = el.closest('.fi-group');
    if (!group) return null;
    return Array.prototype.filter.call(group.querySelectorAll('.fly-in'), function (n) {
      return n.closest('.fi-group') === group;
    });
  }

  function delayOf(el) {
    var peers = peersOf(el);
    if (!peers || peers.length < 2) return 0;
    var group = el.closest('.fi-group');
    var step = parseInt(group.getAttribute('data-fi-step') || '0', 10) || 0;
    if (!step) return 0;
    var i = peers.indexOf(el);
    if ((group.getAttribute('data-fi-order') || '') === 'reverse') i = peers.length - 1 - i;
    return i * step;
  }

  function play(el) {
    var delay = delayOf(el);
    if (delay > 0) el.style.animationDelay = delay + 'ms';
    el.classList.add('fi-play');
    // 不写 {once:true}：块内子元素动画结束会冒泡上来，once 会被首个冒泡事件吃掉
    var onEnd = function (e) {
      if (e.animationName !== 'flyIn04') return;
      el.removeEventListener('animationend', onEnd);
      finish(el);
    };
    el.addEventListener('animationend', onEnd);
    // 兜底：延迟 + 时长 + 余量，防止 animationend 未派发时停在初始态
    setTimeout(function () {
      el.removeEventListener('animationend', onEnd);
      finish(el);
    }, delay + 900 + 250);
  }

  // 关键：元素初始位移在容器外（overflow:hidden 已裁掉）时，观察元素自身永远
  // 不满足相交条件，会自锁在初始态。故有 .fi-group 时改为观察组容器。
  var triggers = new Map();
  items.forEach(function (el) {
    var trigger = el.closest('.fi-group') || el;
    if (!triggers.has(trigger)) triggers.set(trigger, []);
    triggers.get(trigger).push(el);
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      // 触发器是整个组时，一次播放组内全部元素（各自按序错峰）
      (triggers.get(entry.target) || [entry.target]).forEach(play);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

  triggers.forEach(function (_, trigger) { io.observe(trigger); });

  // 全站动效开关关闭：立即定格终态
  body.addEventListener('smarthsb-motion-change', function (e) {
    if (e.detail && e.detail.enabled) return;
    io.disconnect();
    items.forEach(function (el) {
      el.classList.remove('fi-ready', 'fi-play');
      el.classList.add('fi-done');
      clearDelay(el);
    });
  });
})();
