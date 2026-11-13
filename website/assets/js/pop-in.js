/* ==========================================================================
   M-01 弹出 / Pop-In —— 规范：00-项目管理/2026-11-12_动效规范库.md
   目标元素：.pop-in（各自独立触发，顶边到视口 90% 时播一次）
   初始态由本脚本加 .pop-ready（不依赖 html.js 标记，任何页面都可直接用）；
   播放结束加 .pop-done 归还 transform。
   ========================================================================== */
(function () {
  'use strict';

  var items = Array.prototype.slice.call(document.querySelectorAll('.pop-in'));
  if (!items.length) return;

  var body = document.body;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function motionOn() {
    return !body.classList.contains('motion-off') && !reduced.matches;
  }

  function finish(el) {
    el.classList.remove('pop-play');
    el.classList.add('pop-done');
    el.style.removeProperty('animation-delay');
  }

  if (!motionOn() || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('pop-done'); });
    return;
  }

  items.forEach(function (el) { el.classList.add('pop-ready'); });

  // 同基线并排的多块不会自然错峰，用 .pop-group[data-pop-step="70"] 补递进
  function delayOf(el) {
    var group = el.closest('[data-pop-step]');
    if (!group) return 0;
    var step = parseInt(group.getAttribute('data-pop-step'), 10) || 0;
    if (!step) return 0;
    var peers = Array.prototype.filter.call(group.querySelectorAll('.pop-in'), function (n) {
      return n.closest('[data-pop-step]') === group;
    });
    return Math.max(peers.indexOf(el), 0) * step;
  }

  function play(el) {
    var delay = delayOf(el);
    if (delay > 0) el.style.animationDelay = delay + 'ms';
    el.classList.add('pop-play');
    // 不写 {once:true}：块内子元素（如 M-02 打字单元）的 animationend 会冒泡上来，
    // once 会被首个冒泡事件吃掉，导致自身动画结束后无人收尾、闪回 scale(0)。
    var onEnd = function (e) {
      if (e.animationName !== 'popIn01') return;
      el.removeEventListener('animationend', onEnd);
      finish(el);
    };
    el.addEventListener('animationend', onEnd);
    // 兜底：延迟 + 时长 + 余量，防止 animationend 未派发时停在初始态
    setTimeout(function () {
      el.removeEventListener('animationend', onEnd);
      finish(el);
    }, delay + 700 + 250);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      play(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

  items.forEach(function (el) { io.observe(el); });

  // 全站动效开关关闭：立即定格终态
  body.addEventListener('smarthsb-motion-change', function (e) {
    if (e.detail && e.detail.enabled) return;
    io.disconnect();
    items.forEach(function (el) {
      el.classList.remove('pop-ready', 'pop-play');
      el.classList.add('pop-done');
    });
  });
})();
