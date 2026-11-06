/* ==========================================================================
   SmartHSB · 首页 HERO「科技 + 金融」深色初始化 → 3D 翻转 & 渐变回归控制器
   总时长：4400ms（< 5 秒），含 4 大类 3D 翻转终端、25 品种全景流、地球节点联动
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
  let savedMotion;
  try { savedMotion = localStorage.getItem('hsb-motion'); } catch {}
  const shouldRun = savedMotion !== 'off' && !prefersReduced.matches && root.classList.contains('hero-intro-ready');

  // 供 column-home.js 中 #world-dots 画布读取（1 = 深色金融科技节点态，0 = 正常浅色地图态）
  window.__hsbHeroIntroMix = shouldRun ? 1 : 0;

  if (!shouldRun) {
    root.classList.remove('hero-intro-ready', 'hero-intro-dark');
    return;
  }

  // SmartHSB 全部 4 大类 · 25 个 CFD 交易品种（与首页及 products.html 严格一致）
  const ALL_25_INSTRUMENTS = [
    { cat: '贵金属', sym: 'XAU/USD', name: '黄金', price: '2,384.70', chg: '+0.45%', up: true },
    { cat: '贵金属', sym: 'XAG/USD', name: '白银', price: '27.845', chg: '+0.62%', up: true },
    { cat: '能源', sym: 'USOIL', name: '美国原油', price: '71.240', chg: '-0.35%', up: false },
    { cat: '股指', sym: 'TECH100', name: '纳指100', price: '20,340.0', chg: '+0.34%', up: true },
    { cat: '股指', sym: 'SP500', name: '标普500', price: '5,820.50', chg: '-0.12%', up: false },
    { cat: '股指', sym: 'DJ30', name: '道琼斯', price: '42,650.0', chg: '+0.05%', up: true },
    { cat: '股指', sym: 'HK50', name: '香港恒生', price: '18,420.5', chg: '+0.28%', up: true },
    { cat: '股指', sym: 'JPN225', name: '日经225', price: '38,120.0', chg: '+0.16%', up: true },
    { cat: '外汇', sym: 'EUR/USD', name: '欧元/美元', price: '1.08640', chg: '+0.12%', up: true },
    { cat: '外汇', sym: 'GBP/USD', name: '英镑/美元', price: '1.29340', chg: '+0.08%', up: true },
    { cat: '外汇', sym: 'USD/JPY', name: '美元/日元', price: '151.350', chg: '-0.21%', up: false },
    { cat: '外汇', sym: 'AUD/USD', name: '澳元/美元', price: '0.65510', chg: '-0.09%', up: false },
    { cat: '外汇', sym: 'NZD/USD', name: '纽元/美元', price: '0.60230', chg: '+0.10%', up: true },
    { cat: '外汇', sym: 'USD/CHF', name: '美元/瑞郎', price: '0.88750', chg: '+0.05%', up: true },
    { cat: '外汇', sym: 'USD/CAD', name: '美元/加元', price: '1.37420', chg: '-0.06%', up: false },
    { cat: '外汇', sym: 'AUD/JPY', name: '澳元/日元', price: '99.160', chg: '-0.05%', up: false },
    { cat: '外汇', sym: 'AUD/NZD', name: '澳元/纽元', price: '1.08760', chg: '+0.07%', up: true },
    { cat: '外汇', sym: 'EUR/AUD', name: '欧元/澳元', price: '1.65820', chg: '+0.15%', up: true },
    { cat: '外汇', sym: 'EUR/CHF', name: '欧元/瑞郎', price: '0.96380', chg: '+0.01%', up: true },
    { cat: '外汇', sym: 'EUR/GBP', name: '欧元/英镑', price: '0.83980', chg: '+0.04%', up: true },
    { cat: '外汇', sym: 'EUR/JPY', name: '欧元/日元', price: '164.520', chg: '-0.12%', up: false },
    { cat: '外汇', sym: 'GBP/AUD', name: '英镑/澳元', price: '1.97420', chg: '+0.11%', up: true },
    { cat: '外汇', sym: 'GBP/CHF', name: '英镑/瑞郎', price: '1.14760', chg: '+0.09%', up: true },
    { cat: '外汇', sym: 'NZD/JPY', name: '纽元/日元', price: '91.180', chg: '-0.03%', up: false },
    { cat: '外汇', sym: 'GBP/JPY', name: '英镑/日元', price: '195.830', chg: '+0.02%', up: true }
  ];

  // 渲染底部 25 品种无缝滚动带（双倍拼接实现无缝循环）
  const track = document.querySelector('#cfd-ticker-track');
  if (track) {
    const html = ALL_25_INSTRUMENTS.map(item =>
      `<span class="cfd-tick-item"><b>${item.sym}</b><small>${item.name}</small><span>${item.price}</span><span class="${item.up ? 'up' : 'down'}">${item.chg}</span></span>`
    ).join('');
    track.innerHTML = html + html;
  }

  // 四张核心代表品种的价格滚动配置
  const featuredQuotes = [
    { el: document.querySelector('[data-cfd-price="gold"]'), from: 2376.40, to: 2384.70, decimals: 2, comma: true, ticks: [[1420, 2385.15, 'up'], [1900, 2384.70, 'up']] },
    { el: document.querySelector('[data-cfd-price="index"]'), from: 20265.0, to: 20340.0, decimals: 1, comma: true, ticks: [[1480, 20344.5, 'up'], [1960, 20340.0, 'up']] },
    { el: document.querySelector('[data-cfd-price="fx"]'), from: 1.08420, to: 1.08640, decimals: 5, comma: false, ticks: [[1520, 1.08652, 'up'], [2000, 1.08640, 'up']] },
    { el: document.querySelector('[data-cfd-price="energy"]'), from: 71.890, to: 71.240, decimals: 3, comma: false, ticks: [[1560, 71.195, 'down'], [2020, 71.240, 'down']] }
  ];

  const count25El = document.querySelector('#intro-count-25');
  const syncCountEl = document.querySelector('#intro-sync-count');

  function formatQuote(val, decimals, comma) {
    const fixed = val.toFixed(decimals);
    if (!comma) return fixed;
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  // 时间轴节点（严格总控 4350ms < 5000ms，左上角文字变色与晨曦光波零时差同步）
  const TOTAL_MS = 4350;
  const T_MATRIX = 40;
  const T_CONVERGE = 2280;
  const T_FLIP = 2580;
  const T_WIPE_START = 2620;
  const T_MORPH_COPY = 2620;
  const T_WIPE_END = 4080;

  let startTime = performance.now();
  let rafId = 0;
  let finished = false;
  let phaseMatrix = false, phaseConverge = false, phaseFlip = false, phaseMorph = false;
  const firedTicks = new Set();

  root.classList.add('hero-intro-ran');

  function finishIntro() {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(rafId);
    window.__hsbHeroIntroMix = 0;
    root.style.setProperty('--hero-wipe', '160%');
    root.style.setProperty('--intro-progress', '100%');
    root.classList.add('intro-matrix', 'intro-converge', 'intro-flip', 'intro-morph', 'intro-done');
    root.classList.remove('hero-intro-dark', 'hero-intro-ready');
  }

  function step(now) {
    if (finished) return;
    const elapsed = Math.max(0, now - startTime);

    // 总体进度条
    const pct = Math.min(100, (elapsed / TOTAL_MS) * 100);
    root.style.setProperty('--intro-progress', pct.toFixed(1) + '%');

    // 阶段 1：3D 矩阵翻入（40ms）
    if (!phaseMatrix && elapsed >= T_MATRIX) {
      phaseMatrix = true;
      root.classList.add('intro-matrix');
    }

    // 25 品种计数器滚动（120ms -> 1020ms）
    if (elapsed <= 1150) {
      const cp = Math.min(1, Math.max(0, (elapsed - 120) / 900));
      const curCount = Math.max(1, Math.round(1 + 24 * easeOutCubic(cp)));
      const str = String(curCount).padStart(2, '0');
      if (count25El) count25El.textContent = str;
      if (syncCountEl) syncCountEl.textContent = str;
    }

    // 四大代表品种价格滚动解码（220ms -> 1120ms）
    if (elapsed >= 200 && elapsed <= 1220) {
      featuredQuotes.forEach((q, idx) => {
        if (!q.el) return;
        const qp = Math.min(1, Math.max(0, (elapsed - (220 + idx * 80)) / 780));
        const val = q.from + (q.to - q.from) * easeOutCubic(qp);
        q.el.textContent = formatQuote(val, q.decimals, q.comma);
      });
    }

    // 阶段 2：真实行情脉冲跳动（1420ms -> 2150ms）
    featuredQuotes.forEach((q, qIdx) => {
      if (!q.el) return;
      q.ticks.forEach(([tickMs, tickVal, dir], tIdx) => {
        const key = `${qIdx}-${tIdx}`;
        if (!firedTicks.has(key) && elapsed >= tickMs) {
          firedTicks.add(key);
          q.el.textContent = formatQuote(tickVal, q.decimals, q.comma);
          const cls = dir === 'up' ? 'tick-up' : 'tick-down';
          q.el.classList.add(cls);
          setTimeout(() => q.el?.classList.remove(cls), 260);
        }
      });
    });

    // 阶段 3：向中心三维聚合（2320ms）
    if (!phaseConverge && elapsed >= T_CONVERGE) {
      phaseConverge = true;
      root.classList.add('intro-converge');
    }

    // 阶段 4：180° 空间翻转交接为正常浅色行情组件 & 底部监管栏（2620ms）
    if (!phaseFlip && elapsed >= T_FLIP) {
      phaseFlip = true;
      root.classList.add('intro-flip');
    }

    // 阶段 5：斜向晨曦光波渐变扫过 HERO 区 + 地球节点平滑回归浅色（2620ms -> 4080ms）
    if (elapsed >= T_WIPE_START) {
      const wp = Math.min(1, (elapsed - T_WIPE_START) / (T_WIPE_END - T_WIPE_START));
      const easedWipe = easeInOutQuad(wp);
      const wipePct = easedWipe * 150;
      root.style.setProperty('--hero-wipe', wipePct.toFixed(2) + '%');
      window.__hsbHeroIntroMix = Math.max(0, 1 - easedWipe);
    }

    if (!phaseMorph && elapsed >= T_MORPH_COPY) {
      phaseMorph = true;
      root.classList.add('intro-morph');
      root.classList.remove('hero-intro-dark');
    }

    // 4400ms（< 5 秒）完整落定回正常首页状态
    if (elapsed >= TOTAL_MS) {
      finishIntro();
      return;
    }

    rafId = requestAnimationFrame(step);
  }

  rafId = requestAnimationFrame(step);

  // 支持一键跳过与动效开关即时响应
  document.querySelector('.intro-skip-btn')?.addEventListener('click', finishIntro);
  document.querySelector('#motion-toggle')?.addEventListener('click', finishIntro);
  prefersReduced.addEventListener('change', e => { if (e.matches) finishIntro(); });
})();
