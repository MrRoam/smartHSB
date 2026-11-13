/* ==========================================================================
   内页按钮动效（2026-11-12）
   把 .internal-site .btn 的纯文本包成「上翻双层」结构，链式按钮补 ↗ 箭头，
   样式（渐变 / 彩虹边 / 翻转 / 箭头位移）全部在 site-light.css 里定义。
   仅在按钮内部只有文本节点时改造，含 img / svg / span 的按钮原样跳过。
   ========================================================================== */
(function () {
  'use strict';

  var SEL = '.internal-site .btn';

  function build(el) {
    if (!el || el.querySelector('.button-label')) return;
    // 含子元素（商店徽章 img、图标 svg 等）的按钮不改，避免破坏结构
    if (el.children.length) return;

    var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return;

    var label = document.createElement('span');
    label.className = 'button-label';

    var front = document.createElement('span');
    front.className = 'button-label__front';
    front.textContent = text;

    // 背面文字用 data-label + ::before 生成，DOM 里不出现重复文案（避免被搜索引擎当重复内容）
    var back = document.createElement('span');
    back.className = 'button-label__back';
    back.setAttribute('aria-hidden', 'true');
    back.setAttribute('data-label', text);

    label.appendChild(front);
    label.appendChild(back);

    while (el.firstChild) el.removeChild(el.firstChild);
    el.appendChild(label);

    // 链接类按钮补箭头，<button> 提交按钮不加（语义不合适）
    if (el.tagName === 'A') {
      var arrow = document.createElement('span');
      arrow.className = 'button-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '\u2197';
      el.appendChild(arrow);
    }
  }

  function run() {
    var list = document.querySelectorAll(SEL);
    for (var i = 0; i < list.length; i++) build(list[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
