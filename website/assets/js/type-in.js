/* ==========================================================================
   M-02 打字出场 / Type-In —— 见 00-项目管理/2026-11-12_动效规范库.md
   用法：h2 挂 class="type-in" data-type-in="chars"
         p  挂 class="type-in" data-type-in="lines"
         小标签挂 class="type-in-eyebrow"
   ========================================================================== */
(function () {
  'use strict';

  if (!('IntersectionObserver' in window)) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduce.matches) return;
  if (document.body && document.body.classList.contains('motion-off')) return;

  var PUNCT = /[\u3000-\u303f\uff01-\uff0f\uff1a-\uff20\uff3b-\uff40\uff5b-\uff65)\]\u2019\u201d]|[！？，。、；：]/;
  var orig = new WeakMap();

  function norm(s) {
    return s.replace(/[\t\r\n]+/g, ' ').replace(/ {2,}/g, ' ');
  }

  /* 按文本节点 / <br> 切成片段；内联元素降级为纯文本 */
  function segments(el) {
    var out = [];
    Array.prototype.forEach.call(el.childNodes, function (n) {
      if (n.nodeType === 3) out.push({ text: norm(n.nodeValue) });
      else if (n.nodeName === 'BR') out.push({ br: true });
      else if (n.nodeType === 1) out.push({ text: norm(n.textContent) });
    });
    return out;
  }

  /* ---------- 逐字：标题 ---------- */
  function splitChars(el) {
    var segs = segments(el);
    el.textContent = '';

    var pieces = [];
    var units = [];
    var lastSpace = false;
    var atStart = true;

    segs.forEach(function (seg) {
      if (seg.br) {
        pieces.push({ br: true });
        atStart = true;
        lastSpace = false;
        return;
      }
      Array.prototype.forEach.call(Array.from(seg.text), function (ch) {
        if (ch === ' ') {
          if (atStart || lastSpace) return;
          pieces.push({ space: true });
          lastSpace = true;
          return;
        }
        atStart = false;
        lastSpace = false;
        if (PUNCT.test(ch) && units.length) {
          units[units.length - 1].textContent += ch;   /* 全角标点并入前字，保住紧排 */
          return;
        }
        var mask = document.createElement('span');
        mask.className = 'ti-mask';
        var unit = document.createElement('span');
        unit.className = 'ti-unit';
        unit.textContent = ch;
        mask.appendChild(unit);
        pieces.push({ node: mask });
        units.push(unit);
      });
    });

    while (pieces.length && pieces[pieces.length - 1].space) pieces.pop();

    var frag = document.createDocumentFragment();
    pieces.forEach(function (p) {
      if (p.br) frag.appendChild(document.createElement('br'));
      else if (p.space) frag.appendChild(document.createTextNode(' '));
      else frag.appendChild(p.node);
    });

    units.forEach(function (u, i) { u.style.setProperty('--i', i); });
    el.appendChild(frag);
    return units.length;
  }

  /* ---------- 逐行：正文 ---------- */
  function splitLines(el) {
    var segs = segments(el);
    var frag = document.createDocumentFragment();
    var units = [];
    segs.forEach(function (seg) {
      if (seg.br) { frag.appendChild(document.createElement('br')); return; }
      var tokens = seg.text.match(/[A-Za-z0-9$%.,'’+\-]+|\s+|[^\s]/g) || [];
      tokens.forEach(function (token) {
        if (/^\s+$/.test(token)) { frag.appendChild(document.createTextNode(token)); return; }
        if (PUNCT.test(token) && units.length) {
          units[units.length - 1].textContent += token;
          return;
        }
        var mask = document.createElement('span'); mask.className = 'ti-mask';
        var unit = document.createElement('span'); unit.className = 'ti-unit'; unit.textContent = token;
        mask.appendChild(unit); frag.appendChild(mask); units.push(unit);
      });
    });
    el.replaceChildren(frag);
    // Read all row positions before writing delays. Preserve whitespace and natural reflow.
    var tops = units.map(function (unit) { return Math.round(unit.offsetTop); });
    var row = 0;
    units.forEach(function (unit, i) {
      if (i && Math.abs(tops[i] - tops[i - 1]) > 2) row++;
      unit.style.setProperty('--i', row);
    });
    return row + 1;
  }

  /* ---------- 触发与播放 ---------- */
  function prep(el) {
    var mode = el.getAttribute('data-type-in') || 'chars';
    if (!orig.has(el)) orig.set(el, el.innerHTML);
    if (mode === 'lines') {
      el.classList.add('ti-line');
      splitLines(el);
    } else {
      splitChars(el);
    }
    return mode;
  }

  function reset(el) {
    if (!orig.has(el)) return;
    el.innerHTML = orig.get(el);
    el.classList.remove('ti-play', 'ti-done', 'ti-line');
    el.style.removeProperty('--ti-step');
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      io.unobserve(el);

      var units = el.querySelectorAll('.ti-unit');
      var mode = el.getAttribute('data-type-in') || 'chars';
      var step = 0;
      var lead = 0;
      if (mode === 'chars') {
        step = Math.min(60, 500 / Math.max(1, units.length - 1));
        el.style.setProperty('--ti-step', step + 'ms');
      } else {
        // 同一 section 里有 M-02 标题时，正文等标题推完再接上（规范：680ms）
        var sec = el.closest('section');
        lead = (sec && sec.querySelector('.type-in[data-type-in="chars"]')) ? 680 : 0;
        el.style.setProperty('--ti-lead', lead + 'ms');
      }
      el.classList.add('ti-play');
      var lastLine = mode === 'lines' ? Array.prototype.reduce.call(units, function (last, unit) {
        return Math.max(last, Number(unit.style.getPropertyValue('--i')) || 0);
      }, 0) : 0;
      var total = lead + 500 + (mode === 'chars'
        ? step * Math.max(0, units.length - 1)
        : 50 * lastLine) + 150;
      setTimeout(function () { el.classList.add('ti-done'); }, total);
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll('.type-in'), function (el) {
      // Never flatten emphasis, links or other authored inline markup.
      if (Array.prototype.some.call(el.children, function (child) { return child.tagName !== 'BR'; })) return;
      prep(el);
      io.observe(el);
    });

    Array.prototype.forEach.call(document.querySelectorAll('.type-in-eyebrow'), function (el) {
      var eyeIO = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          obs.disconnect();
          el.classList.add('ti-play');
          setTimeout(function () { el.classList.add('ti-done'); }, 1200);
        });
      }, { rootMargin: '0px 0px -10% 0px' });
      eyeIO.observe(el);
    });
  }

  /* 视口宽度变化时，重建「还没播过」的元素（行数随宽度变化） */
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      Array.prototype.forEach.call(document.querySelectorAll('.type-in:not(.ti-play)'), function (el) {
        if (!orig.has(el) || reduce.matches || document.body.classList.contains('motion-off')) return;
        reset(el);
        prep(el);
      });
    }, 150);
  });

  function settle() {
    if (!reduce.matches && !document.body.classList.contains('motion-off')) return;
    io.disconnect();
    document.querySelectorAll('.type-in,.type-in-eyebrow').forEach(function (el) { el.classList.add('ti-done'); });
  }
  reduce.addEventListener('change', settle);
  document.body.addEventListener('smarthsb-motion-change', settle);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
