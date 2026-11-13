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
    el.textContent = '';

    var probeFrag = document.createDocumentFragment();
    var probes = [];

    segs.forEach(function (seg) {
      if (seg.br) {
        probeFrag.appendChild(document.createElement('br'));
        probes.push({ br: true });
        return;
      }
      var re = /[A-Za-z0-9$%.,'\u2019+\-]+|\s+|[\s\S]/g;
      var m;
      while ((m = re.exec(seg.text))) {
        var t = m[0];
        var s = document.createElement('span');
        s.textContent = t;
        probeFrag.appendChild(s);
        probes.push({ node: s, text: t });
      }
    });
    el.appendChild(probeFrag);

    var rows = [];
    var cur = null;
    probes.forEach(function (p) {
      if (p.br) { cur = null; return; }
      if (!/\S/.test(p.text)) { if (cur) cur.items.push(p.text); return; }
      var top = Math.round(p.node.getBoundingClientRect().top);
      if (cur && Math.abs(cur.top - top) < 2) cur.items.push(p.text);
      else { cur = { top: top, items: [p.text] }; rows.push(cur); }
    });

    el.textContent = '';
    rows.forEach(function (row, i) {
      var text = row.items.join('').replace(/\s+$/, '').replace(/^\s+/, '');
      if (!text) return;
      var mask = document.createElement('span');
      mask.className = 'ti-mask';
      var unit = document.createElement('span');
      unit.className = 'ti-unit';
      unit.style.setProperty('--i', i);
      unit.textContent = text;
      mask.appendChild(unit);
      el.appendChild(mask);
    });
    return rows.length;
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
      var total = lead + 500 + (mode === 'chars'
        ? step * Math.max(0, units.length - 1)
        : 50 * Math.max(0, units.length - 1)) + 150;
      setTimeout(function () { el.classList.add('ti-done'); }, total);
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  function boot() {
    Array.prototype.forEach.call(document.querySelectorAll('.type-in'), function (el) {
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
        reset(el);
        prep(el);
      });
    }, 150);
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
