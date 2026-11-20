/* Cookie 同意提示条（全站通用）
 * - 首次访问时在页面底部弹出，用户选择后记入 localStorage，不再重复弹出
 * - 选项：接受（必要+偏好类）/ 仅必要；说明与链接指向隐私政策 Cookie 章节
 * - 样式由本文件注入，不依赖页面 CSS；遵循系统减少动效设置
 */
(function () {
  'use strict';
  var KEY = 'hsb_cookie_consent';
  var stored = null;
  try { stored = window.localStorage.getItem(KEY); } catch (e) { stored = null; }
  if (stored === 'accepted' || stored === 'necessary') return;

  // 资源前缀：根目录镜像页通过 website/ 前缀加载本脚本；website/ 内页为相对路径
  var BASE = '';
  var tag = document.querySelector('script[src*="cookie-consent.js"]');
  if (tag) BASE = (tag.getAttribute('src') || '').replace(/assets\/js\/cookie-consent\.js.*$/, '');

  var css = [
    '.hsb-cookie-bar{position:fixed;left:50%;bottom:0;transform:translateX(-50%);z-index:9999;',
    'width:min(920px,calc(100% - 24px));margin-bottom:14px;padding:18px 22px;',
    'background:#fff;border:1px solid rgba(15,42,68,.14);border-radius:12px;',
    'box-shadow:0 12px 40px rgba(15,42,68,.18);',
    'display:flex;flex-wrap:wrap;align-items:center;gap:14px 18px;',
    'font-family:inherit;opacity:0;translate:0 8px;transition:opacity .35s ease,translate .35s ease}',
    '.hsb-cookie-bar.is-shown{opacity:1;translate:0 0}',
    '.hsb-cookie-bar__text{flex:1 1 320px;font-size:12.5px;line-height:1.8;color:#31414f;margin:0}',
    '.hsb-cookie-bar__text a{color:#0f7d5c;font-weight:500;text-decoration:underline;text-underline-offset:2px}',
    '.hsb-cookie-bar__actions{display:flex;gap:10px;flex:0 0 auto}',
    '.hsb-cookie-bar__btn{cursor:pointer;border-radius:8px;padding:9px 20px;font-size:13px;font-weight:500;',
    'border:1px solid rgba(15,42,68,.25);background:#fff;color:#13293d;transition:filter .2s}',
    '.hsb-cookie-bar__btn:hover{filter:brightness(.96)}',
    '.hsb-cookie-bar__btn--primary{background:#0f7d5c;border-color:#0f7d5c;color:#fff}',
    '.hsb-cookie-bar__btn:focus-visible{outline:2px solid #0f7d5c;outline-offset:2px}',
    '.hsb-cookie-bar:focus{outline:none}',
    '@media(max-width:600px){.hsb-cookie-bar{flex-direction:column;align-items:stretch;padding:16px}',
    '.hsb-cookie-bar__text{flex:0 0 auto}',
    '.hsb-cookie-bar__actions{justify-content:stretch}.hsb-cookie-bar__btn{flex:1}}',
    '@media(prefers-reduced-motion:reduce){.hsb-cookie-bar{transition:none}}'
  ].join('');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.className = 'hsb-cookie-bar';
  bar.setAttribute('role', 'dialog');
  bar.setAttribute('aria-label', 'Cookie 使用提示');
  bar.setAttribute('tabindex', '-1');
  bar.innerHTML =
    '<p class="hsb-cookie-bar__text">本网站使用 Cookie 与类似技术，用于提升浏览体验、保存偏好设置并保障站点安全。' +
    '点击「接受」即表示您同意此用途；您也可以选择「仅必要」。详见<a href="' + BASE + 'privacy-policy.html#s9">隐私政策 · Cookie 与跟踪技术</a>。</p>' +
    '<div class="hsb-cookie-bar__actions">' +
    '<button type="button" class="hsb-cookie-bar__btn hsb-cookie-bar__btn--primary" data-consent="accepted">接受</button>' +
    '<button type="button" class="hsb-cookie-bar__btn" data-consent="necessary">仅必要</button>' +
    '</div>';

  document.body.appendChild(bar);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () { bar.classList.add('is-shown'); });
  });

  bar.focus({ preventScroll: true });

  bar.addEventListener('click', function (ev) {
    var btn = ev.target.closest('button[data-consent]');
    if (!btn) return;
    try { window.localStorage.setItem(KEY, btn.getAttribute('data-consent')); } catch (e) { /* 隐私模式下忽略 */ }
    bar.classList.remove('is-shown');
    window.setTimeout(function () { bar.remove(); }, 400);
  });
})();
