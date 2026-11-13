/* ==========================================================================
   SmartHSB · HERO 开场动画（singularity tunnel → holographic trading hall）
   移植自「smartHSB-main/SmartHSB 开场动画.html」（2026-11-11 重制版）。
   适配首页 HERO 区（#intro-portal）：
   - 画布尺寸取 HERO 区块（非整窗）
   - 滚动离开 HERO 或切走标签页 → 暂停；回来时间轴顺延（不重播）
   - 系统减少动效 / body.motion-off → 静态终态（is-static）
   - 页脚「动效」开关重新开启 → 时间轴从头重播
   品牌字打字机、副标题逐字浮现、光线、扫光均与原片同步。
   ========================================================================== */
(() => {
  'use strict';

  const portalEl = document.getElementById('intro-portal');
  const cv = document.getElementById('intro-portal-canvas');
  if (!portalEl || !cv) return;
  const ctx = cv.getContext('2d');
  const root = document.getElementById('holo-title');
  const brandEl = document.getElementById('holo-brand');
  const subEl = document.getElementById('holo-sub');
  if (!root || !brandEl || !subEl) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const lerp = (a, b, x) => a + (b - a) * x;
  const sm = (a, b, x) => { const k = clamp((x - a) / (b - a), 0, 1); return k * k * (3 - 2 * k); };
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

  /* ---------- 标题 DOM：逐字拆分 ---------- */
  function splitChars(el, txt) {
    const paragraph = el.tagName === 'P';
    if (!paragraph) el.setAttribute('aria-label', txt);
    el.textContent = '';
    const arr = [];
    let idx = 0;
    const addChars = (parent, str) => {
      for (const c of str) {
        const s = document.createElement('span');
        s.className = 'ch';
        s.setAttribute('aria-hidden', 'true');
        s.style.setProperty('--i', idx++);
        s.textContent = c;
        s.dataset.c = c;
        parent.appendChild(s);
        arr.push(s);
      }
    };
    if (/\s/.test(txt)) {
      const words = txt.trim().split(/\s+/);
      words.forEach((w, wi) => {
        const wrap = document.createElement('span');
        wrap.className = 'w';
        addChars(wrap, w);
        el.appendChild(wrap);
        if (wi < words.length - 1) { el.appendChild(document.createTextNode(' ')); idx++; }
      });
    } else addChars(el, txt);
    if (paragraph) {
      const readable = document.createElement('span');
      readable.className = 'holo-accessible';readable.textContent = txt;el.prepend(readable);
    }
    return arr;
  }

  const brand = splitChars(brandEl, brandEl.textContent);
  const SPLIT = Math.max(0, brandEl.getAttribute('aria-label').indexOf('HSB'));
  brand.forEach((c, i) => { if (i < SPLIT) c.classList.add('sm'); });
  const cursor = document.createElement('span');
  cursor.className = 'holo-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  brandEl.appendChild(cursor);
  splitChars(subEl, subEl.textContent);

  let brandTW = 600, typedN = 0;
  function placeCursor(n) {
    const c = brand[n - 1];
    cursor.style.left = (c ? c.offsetLeft + c.offsetWidth : 0) + 'px';
  }
  function measure() {
    brand.forEach(s => { s.style.width = ''; });
    brand.forEach(s => {
      const cur = s.textContent;
      s.textContent = s.dataset.c;
      s._w = s.getBoundingClientRect().width;
      s.textContent = cur;
    });
    brand.forEach(s => { s.style.width = s._w + 'px'; });
    const x0 = brand[SPLIT] ? brand[SPLIT].offsetLeft : 0;
    const lastC = brand[brand.length - 1];
    brandTW = (lastC.offsetLeft + lastC.offsetWidth - x0) || 300;
    brandEl.style.setProperty('--tw', brandTW + 'px');
    brand.forEach(s => s.style.setProperty('--ox', (s.offsetLeft - x0) + 'px'));
    placeCursor(typedN);
  }

  /* ---------- 画布尺寸：取 HERO 区块 ---------- */
  let W = 0, H = 0, DPR = 1, cx = 0, cy = 0, F = 0, F2 = 0, hy = 0;
  function resize() {
    const rect = portalEl.getBoundingClientRect();
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.round(rect.width));
    H = Math.max(1, Math.round(rect.height));
    cv.width = Math.round(W * DPR);
    cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = W / 2; cy = H / 2;
    F = Math.max(W, H) * 0.4;
    F2 = Math.min(Math.max(H * 0.78, W * 0.5), W * 1.15);
    hy = H * 0.68;
    ctx.fillStyle = '#02030b'; ctx.fillRect(0, 0, W, H);
    measure();
    if (motionOff) drawScene(9.6, 0);
  }

  /* ---------- 鼠标视差 ---------- */
  let mx = 0, my = 0, tmx = 0, tmy = 0;
  window.addEventListener('pointermove', e => {
    const r = portalEl.getBoundingClientRect();
    tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    tmy = ((e.clientY - r.top) / r.height - 0.5) * 2;
  }, { passive: true });

  let sx_ = 0, sy_ = 0, p_ = 0;

  /* ---------- 全息交易大厅 ---------- */
  let camX = 0, camY = 1.7;
  function proj3(X, Y, Z) {
    const p = F2 / Z;
    sx_ = cx + (X - camX) * p;
    sy_ = hy - (Y - camY) * p;
    p_ = p;
  }
  let RX = 0, RY = 0, RZ = 0;
  function rotPt(x, y, z, ax, ay, az) {
    let c = Math.cos(ax), s = Math.sin(ax);
    let y1 = y * c - z * s, z1 = y * s + z * c; y = y1; z = z1;
    c = Math.cos(ay); s = Math.sin(ay);
    let x2 = x * c + z * s; z1 = -x * s + z * c; x = x2; z = z1;
    c = Math.cos(az); s = Math.sin(az);
    x2 = x * c - y * s; y1 = x * s + y * c; x = x2; y = y1;
    RX = x; RY = y; RZ = z;
  }

  const LANES = [4.4, 6.4, 8.6, 11, 13.8];
  const SC = 2.3, NC = 24;
  const EDGES = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const bxA = new Float32Array(8), byA = new Float32Array(8);
  const Pv = (li, k) => 2.3 + 1.5 * Math.sin(k * 0.43 + li * 1.7) + 0.8 * Math.sin(k * 1.13 + li * 2.9) + 0.9 * (hash(k * 3.7 + li * 11.3) - 0.5);
  const TIER_A = [0.95, 0.62, 0.34];

  function candles(t2, scroll) {
    const kStart = Math.floor(scroll / SC);
    const fills = [], strokes = [];
    for (let b = 0; b < 6; b++) { fills.push(new Path2D()); strokes.push(new Path2D()); }
    for (let j = 0; j < NC; j++) {
      const k = kStart + j;
      const Zc = k * SC - scroll + 1.0;
      if (Zc < 1.1) continue;
      const tier = Zc < 16 ? 0 : Zc < 34 ? 1 : 2;
      const g0 = clamp((t2 * 16 - Zc) / 12, 0, 1);
      const g = g0 * g0 * (3 - 2 * g0);
      if (g <= 0.001) continue;
      for (let l = 0; l < 5; l++) {
        for (let sg = -1; sg <= 1; sg += 2) {
          const X = sg * LANES[l];
          const li = l * 2 + (sg > 0 ? 1 : 0);
          const O = Pv(li, k), C = Pv(li, k + 1);
          const up = C >= O;
          const bi = (up ? 0 : 3) + tier;
          const ya = Math.min(O, C) * g;
          let yb = Math.max(O, C) * g;
          if (yb - ya < 0.15 * g) yb = ya + 0.15 * g;
          const x0 = X - 0.38, x1 = X + 0.38, z0 = Zc, z1 = Zc + 0.76;
          const XS = [x0, x1, x1, x0], YS = [ya, ya, yb, yb];
          for (let q = 0; q < 8; q++) {
            proj3(XS[q & 3], YS[q & 3], q < 4 ? z0 : z1);
            bxA[q] = sx_; byA[q] = sy_;
          }
          const st = strokes[bi], fl = fills[bi];
          for (let e = 0; e < 12; e++) {
            st.moveTo(bxA[EDGES[e][0]], byA[EDGES[e][0]]);
            st.lineTo(bxA[EDGES[e][1]], byA[EDGES[e][1]]);
          }
          fl.moveTo(bxA[0], byA[0]); fl.lineTo(bxA[1], byA[1]); fl.lineTo(bxA[2], byA[2]); fl.lineTo(bxA[3], byA[3]); fl.closePath();
          const f = sg > 0 ? [0, 3, 7, 4] : [1, 2, 6, 5];
          fl.moveTo(bxA[f[0]], byA[f[0]]);
          for (let q = 1; q < 4; q++) fl.lineTo(bxA[f[q]], byA[f[q]]);
          fl.closePath();
          const wu = 0.3 + 0.9 * hash(k * 5.3 + li), wl = 0.3 + 0.9 * hash(k * 2.1 + li * 3);
          proj3(X, yb + wu * g, z0 + 0.38); st.moveTo(sx_, sy_);
          proj3(X, Math.max(0.02, ya - wl * g), z0 + 0.38); st.lineTo(sx_, sy_);
        }
      }
    }
    ctx.lineWidth = 1.1;
    for (let b = 0; b < 6; b++) {
      const a = TIER_A[b % 3];
      const rgb = b < 3 ? '61,255,178' : '255,93,122';
      ctx.fillStyle = `rgba(${rgb},${0.1 * a})`;
      ctx.fill(fills[b]);
      ctx.strokeStyle = `rgba(${rgb},${a * 0.9})`;
      ctx.stroke(strokes[b]);
    }
  }

  const RINGS = [
    { R: 6.6, ax: 1.15, sx: 0.0, ay: 0, sy: 0.35, az: 0.2, sz: 0.0, h: 190, sp: 0.9 },
    { R: 5.3, ax: 0.2, sx: 0.28, ay: 0.6, sy: 0.0, az: 0, sz: 0.22, h: 265, sp: -1.2 },
    { R: 3.9, ax: 0.9, sx: -0.3, ay: 0, sy: -0.4, az: 1.1, sz: 0.0, h: 320, sp: 1.6 }
  ];
  function holoRings(t, t2, a) {
    const CY = 3.0, CZ = 26;
    ctx.lineJoin = 'round';
    for (const r of RINGS) {
      const ax = r.ax + t * r.sx, ay = r.ay + t * r.sy, az = r.az + t * r.sz;
      ctx.strokeStyle = `hsla(${r.h},100%,66%,${0.62 * a})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (let s = 0; s <= 72; s++) {
        const ph = s / 72 * TAU;
        rotPt(r.R * Math.cos(ph), r.R * Math.sin(ph), 0, ax, ay, az);
        proj3(RX, CY + RY, CZ + RZ);
        if (s) ctx.lineTo(sx_, sy_); else ctx.moveTo(sx_, sy_);
      }
      ctx.stroke();
      for (let k = 0; k < 2; k++) {
        const ph = t * r.sp + k * Math.PI;
        rotPt(r.R * Math.cos(ph), r.R * Math.sin(ph), 0, ax, ay, az);
        proj3(RX, CY + RY, CZ + RZ);
        ctx.fillStyle = `hsla(${r.h},100%,70%,${0.28 * a})`;
        ctx.beginPath(); ctx.arc(sx_, sy_, 7, 0, TAU); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${0.95 * a})`;
        ctx.beginPath(); ctx.arc(sx_, sy_, 2.6, 0, TAU); ctx.fill();
      }
    }
    /* tick ring */
    ctx.strokeStyle = `rgba(150,230,255,${0.5 * a})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 90; i++) {
      const ph = i / 90 * TAU, long = i % 5 === 0;
      const r0 = 8, r1 = 8 + (long ? 0.5 : 0.25);
      rotPt(r0 * Math.cos(ph), r0 * Math.sin(ph), 0, 1.35, t * 0.12, 0);
      proj3(RX, CY + RY, CZ + RZ); ctx.moveTo(sx_, sy_);
      rotPt(r1 * Math.cos(ph), r1 * Math.sin(ph), 0, 1.35, t * 0.12, 0);
      proj3(RX, CY + RY, CZ + RZ); ctx.lineTo(sx_, sy_);
    }
    ctx.stroke();
    /* core */
    proj3(0, CY, CZ);
    const rad = F2 / CZ * 3.2;
    const ca = 0.28 + 0.72 * (1 - sm(0, 2.5, t2));
    const gl = ctx.createRadialGradient(sx_, sy_, 0, sx_, sy_, rad);
    gl.addColorStop(0, `rgba(210,248,255,${0.9 * ca})`);
    gl.addColorStop(0.25, `rgba(90,150,255,${0.3 * ca})`);
    gl.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gl;
    ctx.beginPath(); ctx.arc(sx_, sy_, rad, 0, TAU); ctx.fill();
  }

  const DUST = [], PUL = [];
  function initScene() {
    DUST.length = 0;
    for (let i = 0; i < 170; i++) DUST.push({ X: (Math.random() - 0.5) * 28, Y: Math.random() * 9, Z: 2 + Math.random() * 40, tw: Math.random() * TAU });
    PUL.length = 0;
    for (let i = 0; i < 7; i++) PUL.push({ X: (Math.floor(Math.random() * 26) - 13) * 2, Z: 5 + Math.random() * 60, v: 10 + Math.random() * 10 });
  }

  function drawScene(t, dt) {
    const t2 = t - 5;
    mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
    camX = Math.sin(t * 0.35) * 0.5 + mx * 0.9;
    camY = 1.7 + Math.sin(t * 0.27) * 0.08 - my * 0.3;
    const scroll = t2 * 3.4;

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#02030b'); bg.addColorStop(0.66, '#111a52');
    bg.addColorStop(0.70, '#050720'); bg.addColorStop(1, '#02030b');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    /* horizon glow */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(cx, hy); ctx.scale(1, 0.14);
    const hg = ctx.createRadialGradient(0, 0, 0, 0, 0, W * 0.65);
    hg.addColorStop(0, 'rgba(90,210,255,0.55)'); hg.addColorStop(0.5, 'rgba(110,90,255,0.22)'); hg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(0, 0, W * 0.65, 0, TAU); ctx.fill();
    ctx.restore();

    /* floor grid */
    ctx.globalCompositeOperation = 'lighter';
    const ga = sm(0, 1.2, t2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(53,230,255,${0.3 * ga})`;
    ctx.beginPath();
    for (let X = -26; X <= 26; X += 2) {
      proj3(X, 0, 0.7); ctx.moveTo(sx_, sy_);
      proj3(X, 0, 70); ctx.lineTo(sx_, sy_);
    }
    ctx.stroke();
    ctx.beginPath();
    const go = scroll % 2.4;
    for (let Z = 2.4 - go; Z < 70; Z += 2.4) {
      if (Z < 0.8) continue;
      proj3(-26, 0, Z); ctx.moveTo(sx_, sy_);
      proj3(26, 0, Z); ctx.lineTo(sx_, sy_);
    }
    ctx.stroke();

    /* travelling pulses */
    for (const p of PUL) {
      p.Z -= p.v * dt;
      if (p.Z < 1.2) { p.Z = 70; p.X = (Math.floor(Math.random() * 26) - 13) * 2; }
      proj3(p.X, 0, p.Z + 3.5); const ax_ = sx_, ay_ = sy_;
      proj3(p.X, 0, p.Z);
      ctx.strokeStyle = `rgba(190,250,255,${0.9 * clamp(1 - p.Z / 70, 0, 1) * ga})`;
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(ax_, ay_); ctx.lineTo(sx_, sy_); ctx.stroke();
    }

    /* haze over the vanishing zone */
    ctx.globalCompositeOperation = 'source-over';
    const hz = ctx.createLinearGradient(0, hy - H * 0.08, 0, hy + H * 0.22);
    hz.addColorStop(0, 'rgba(10,15,50,0)'); hz.addColorStop(0.26, 'rgba(10,15,50,0.9)');
    hz.addColorStop(0.4, 'rgba(10,15,50,0.55)'); hz.addColorStop(1, 'rgba(10,15,50,0)');
    ctx.fillStyle = hz; ctx.fillRect(0, hy - H * 0.08, W, H * 0.3);

    /* holographic gyroscope */
    ctx.globalCompositeOperation = 'lighter';
    holoRings(t, t2, sm(0.2, 1.6, t2));

    /* candle corridor */
    candles(t2, scroll);

    /* dust */
    for (const d of DUST) {
      d.Z -= 2.5 * dt;
      if (d.Z < 1.2) { d.Z = 42; d.X = (Math.random() - 0.5) * 28; d.Y = Math.random() * 9; }
      proj3(d.X, d.Y, d.Z);
      if (sx_ < 0 || sx_ > W || sy_ < 0 || sy_ > H) continue;
      const s = clamp(p_ * 0.03, 0.6, 2.2);
      ctx.fillStyle = `rgba(160,235,255,${(0.25 + 0.4 * Math.sin(t * 2 + d.tw)) * clamp(1 - d.Z / 42, 0.1, 1)})`;
      ctx.fillRect(sx_, sy_, s, s);
    }

    /* dark pool behind the title */
    ctx.globalCompositeOperation = 'source-over';
    const k = sm(6.0, 7.0, t);
    if (k > 0) {
      const ty = H * 0.42, tr = Math.min(W * 0.5, 540);
      const tg = ctx.createRadialGradient(cx, ty, 0, cx, ty, tr);
      tg.addColorStop(0, `rgba(2,4,18,${0.6 * k})`); tg.addColorStop(1, 'rgba(2,4,18,0)');
      ctx.fillStyle = tg; ctx.fillRect(0, 0, W, H);
    }

    /* vignette */
    const vg = ctx.createRadialGradient(cx, cy, Math.min(W, H) * 0.35, cx, cy, Math.hypot(W, H) * 0.6);
    vg.addColorStop(0, 'rgba(0,0,5,0)'); vg.addColorStop(1, 'rgba(0,0,5,0.72)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }

  function overlay(t) {
    const e = t - T_START;
    if (e < 0.9) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(2,3,11,${1 - sm(0, 0.9, e)})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  /* ---------- DOM 同步 ---------- */
  const TYPE_T0 = 6.5, TYPE_STEP = 0.12;
  let titleOn = false, lastShine = -9999;
  function domUpdate(t) {
    const on = t >= 6.2;
    if (on !== titleOn) {
      titleOn = on;
      root.classList.toggle('on', on);
    }
    const n = clamp(Math.floor((t - TYPE_T0) / TYPE_STEP) + 1, 0, brand.length);
    if (n !== typedN) {
      typedN = n;
      brand.forEach((s, i) => s.classList.toggle('typed', i < n));
      placeCursor(n);
    }
    const endT = TYPE_T0 + TYPE_STEP * brand.length;
    cursor.classList.toggle('on', t >= TYPE_T0 - 0.3 && t < endT + 1.4);
    cursor.classList.toggle('typing', n > 0 && n < brand.length);
    /* 扫光循环 */
    let sh = -9999;
    if (t > 8.0) {
      const ph = ((t - 8.0) % 3.6) / 1.6;
      if (ph < 1) sh = lerp(-brandTW * 0.34, brandTW, ph * ph * (3 - 2 * ph));
    }
    if (sh !== lastShine) { lastShine = sh; brandEl.style.setProperty('--shine', sh + 'px'); }
  }

  /* ---------- 主循环：t 累加制，暂停即停止累加（时间轴顺延） ---------- */
  const T_START = 5.0;
  let t = T_START, last = 0, motionOff = false, inView = true, pageVisible = !document.hidden;

  const playing = () => inView && pageVisible && !motionOff;

  function frame(now) {
    const raw = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (playing()) {
      t += raw;
      drawScene(t, raw);
      overlay(t);
      domUpdate(t);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 静态终态 / 重播 ---------- */
  function applyStatic() {
    root.classList.remove('on');
    root.classList.add('is-static');
    brand.forEach(s => s.classList.add('typed'));
    typedN = brand.length;
    cursor.classList.remove('on', 'typing');
    titleOn = false;
    drawScene(9.6, 0);
  }

  function restart() {
    t = T_START;
    root.classList.remove('is-static');
    brand.forEach(s => s.classList.remove('typed'));
    typedN = 0;
    titleOn = false;
    lastShine = -9999;
    initScene();
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    ctx.fillStyle = '#02030b'; ctx.fillRect(0, 0, W, H);
  }

  /* 动效开关（页脚按钮切换 body.motion-off，由 column-home.js 管理） */
  new MutationObserver(() => {
    const off = document.body.classList.contains('motion-off');
    if (off !== motionOff) {
      motionOff = off;
      if (motionOff) applyStatic(); else restart();
    }
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  /* 滚动离开 / 切标签 → 暂停；回来时间轴顺延 */
  new IntersectionObserver(es => { inView = es[0].isIntersecting; }, { rootMargin: '80px' }).observe(portalEl);
  document.addEventListener('visibilitychange', () => { pageVisible = !document.hidden; });

  window.addEventListener('resize', resize);

  function start() {
    motionOff = reduce || document.body.classList.contains('motion-off');
    resize();
    initScene();
    last = performance.now();
    if (motionOff) {
      root.classList.add('is-static');
      applyStatic();
    } else {
      t = T_START;
      requestAnimationFrame(frame);
    }
  }

  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 1200))]).then(start);
})();
