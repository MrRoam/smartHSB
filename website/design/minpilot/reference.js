(function () {
  'use strict';

  var status = document.getElementById('copy-status');
  document.querySelectorAll('[data-copy]').forEach(function (button) {
    button.hidden = false;
    button.addEventListener('click', async function () {
      var target = document.getElementById(button.dataset.copy);
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(target.textContent);
        status.textContent = '已复制：' + button.dataset.label + '。';
      } catch (error) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(target);
        selection.removeAllRanges();
        selection.addRange(range);
        target.focus();
        status.textContent = '已选中提示词，请按 Ctrl+C（Mac 使用 Command+C）复制。';
      }
    });
  });

  var panel = document.getElementById('motion-demo');
  var toggle = document.getElementById('preview-toggle');
  var motionStatus = document.getElementById('motion-status');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var requested = false;
  var inViewport = false;

  function renderMotion() {
    var active = requested && !reduce.matches && !document.hidden && inViewport;
    panel.classList.toggle('playing', active);
    toggle.disabled = reduce.matches;
    toggle.setAttribute('aria-pressed', String(requested && !reduce.matches));
    toggle.textContent = requested && !reduce.matches ? '暂停动效示例' : '播放动效示例';
    if (reduce.matches) {
      motionStatus.textContent = '系统已启用减少动效，示例保持静止。';
    } else if (active) {
      motionStatus.textContent = '播放中：浮卡往返 6 秒、上下各 6px，轨道 30 秒一圈。';
    } else if (requested) {
      motionStatus.textContent = '示例离屏或页面在后台，动效已暂停。';
    } else {
      motionStatus.textContent = '示例已暂停。这里演示 SmartHSB 建议参数，不改变现有首页。';
    }
  }

  toggle.hidden = false;
  toggle.addEventListener('click', function () {
    requested = !requested;
    renderMotion();
  });
  reduce.addEventListener('change', function () {
    if (reduce.matches) requested = false;
    renderMotion();
  });
  document.addEventListener('visibilitychange', renderMotion);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inViewport = entries[0].isIntersecting;
      renderMotion();
    }, { threshold: 0 }).observe(panel);
  } else {
    inViewport = true;
  }
  renderMotion();
}());
