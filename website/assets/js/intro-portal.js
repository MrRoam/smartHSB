/**
 * SmartHSB · Intelligence Layer Intro Portal
 *
 * Seamlessly renders the MotionSites "intelligence-layer" cinematic scene
 * (assets/video/intelligencelayer.mp4) featuring:
 * 1. Radiant central portal doorway of light.
 * 2. Photorealistic walking human figure in continuous smooth loop.
 * 3. Billboard billowing clouds and atmospheric ground mist.
 * 4. Symmetrical left-right halo masking removing template copy with 100% fidelity.
 * 5. Complete elimination of artificial shadows, rectangular cutouts, and seamlines.
 * 6. Top menu clearance: doorway positioned comfortably below header navigation across all screen resolutions.
 * 7. Bottom template logo row ("logoipsum") fully masked and eliminated.
 * 8. Edge-to-edge seamless cosmic blue gradient with zero lateral color discrepancy.
 */
(function () {
  'use strict';

  var portalEl = document.getElementById('intro-portal');
  var videoEl = document.getElementById('intro-portal-video');
  var canvas = document.getElementById('intro-portal-canvas');
  var replayBtn = document.getElementById('replay-intro-btn');

  // Typewriter & Slogan DOM elements
  var typeLine1El = document.getElementById('ip-type-line1');
  var typeSmartEl = document.getElementById('ip-type-smart');
  var typeHsbEl = document.getElementById('ip-type-hsb');
  var cursor1El = document.getElementById('ip-cursor-1');
  var cursor2El = document.getElementById('ip-cursor-2');
  var wordFlashEl = document.getElementById('ip-word-flash');
  var sentenceEl = document.getElementById('ip-sentence');

  if (!portalEl || !canvas) return;

  var ctx = canvas.getContext('2d');
  var auxCanvas = document.createElement('canvas');
  var auxCtx = auxCanvas.getContext('2d');
  var width = 0;
  var height = 0;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var rafId = null;
  var isRunning = false;
  var sloganFinished = false;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var portalBounds = portalEl.getBoundingClientRect();
  var inViewport = portalBounds.bottom > 0 && portalBounds.top < window.innerHeight;
  var videoFailed = !videoEl;

  // Typewriter & Slogan state
  var TEXT_LINE1 = 'Next-Generation Trading';
  var TEXT_SMART = 'Smart';
  var TEXT_HSB = 'HSB';
  var SLOGAN_WORDS = ['Smart', 'Trading', 'Made', 'Simple'];
  var typeTimer = null;

  function shouldAnimate() {
    return !reducedMotion.matches &&
      !document.body.classList.contains('motion-off') &&
      !document.hidden && inViewport && !videoFailed;
  }

  // Pausing an entrance completes its copy so resuming never leaves a partial title.
  function showStaticText() {
    if (typeTimer) window.clearTimeout(typeTimer);
    typeTimer = null;
    if (typeLine1El) typeLine1El.textContent = TEXT_LINE1;
    if (typeSmartEl) typeSmartEl.textContent = TEXT_SMART;
    if (typeHsbEl) typeHsbEl.textContent = TEXT_HSB;
    if (cursor1El) cursor1El.classList.add('is-hidden');
    if (cursor2El) cursor2El.classList.add('is-hidden');
    if (wordFlashEl) {
      wordFlashEl.classList.remove('is-active', 'is-smart-word');
      wordFlashEl.textContent = '';
    }
    if (sentenceEl) {
      sentenceEl.style.transition = 'none';
      sentenceEl.style.animation = 'none';
      sentenceEl.classList.add('is-assembled', 'is-illuminated');
      var flare = sentenceEl.querySelector('.intro-portal__flare-beam');
      if (flare) flare.style.animation = 'none';
    }
    sloganFinished = true;
  }

  /**
   * 3-Stage Kinetic Slogan Sequence for "Smart Trading Made Simple"
   */
  function runSloganSequence() {
    if (!wordFlashEl || !sentenceEl || !isRunning) return;

    var wIdx = 0;

    function showNextWord() {
      if (!isRunning) return;
      if (wIdx < SLOGAN_WORDS.length) {
        var word = SLOGAN_WORDS[wIdx];
        wordFlashEl.classList.remove('is-active', 'is-smart-word');
        void wordFlashEl.offsetWidth; // Force reflow
        wordFlashEl.textContent = word;
        if (wIdx === 0) {
          wordFlashEl.classList.add('is-smart-word');
        }
        wordFlashEl.classList.add('is-active');
        wIdx++;
        typeTimer = setTimeout(showNextWord, 430);
      } else {
        wordFlashEl.classList.remove('is-active', 'is-smart-word');
        wordFlashEl.textContent = '';
        sentenceEl.classList.add('is-assembled');

        typeTimer = setTimeout(function () {
          if (!isRunning) return;
          sentenceEl.classList.add('is-illuminated');
          sloganFinished = true;
        }, 480);
      }
    }

    showNextWord();
  }

  /**
   * Character-by-character typewriter animation
   */
  function startTypewriter() {
    if (!shouldAnimate()) { showStaticText(); return; }
    if (!typeLine1El || !typeSmartEl || !typeHsbEl) return;
    if (typeTimer) clearTimeout(typeTimer);
    sloganFinished = false;

    var idx1 = 0;
    var idx2 = 0;
    var totalLine2 = TEXT_SMART.length + TEXT_HSB.length;

    typeLine1El.textContent = '';
    typeSmartEl.textContent = '';
    typeHsbEl.textContent = '';
    if (cursor1El) cursor1El.classList.remove('is-hidden');
    if (cursor2El) cursor2El.classList.add('is-hidden');
    if (wordFlashEl) {
      wordFlashEl.classList.remove('is-active', 'is-smart-word');
      wordFlashEl.textContent = '';
    }
    if (sentenceEl) {
      sentenceEl.style.transition = '';
      sentenceEl.style.animation = '';
      var flare = sentenceEl.querySelector('.intro-portal__flare-beam');
      if (flare) flare.style.animation = '';
      sentenceEl.classList.remove('is-assembled', 'is-illuminated');
    }

    function stepLine1() {
      if (!isRunning) return;
      if (idx1 <= TEXT_LINE1.length) {
        typeLine1El.textContent = TEXT_LINE1.slice(0, idx1);
        idx1++;
        var delay = 70 + Math.random() * 45;
        typeTimer = setTimeout(stepLine1, delay);
      } else {
        typeTimer = setTimeout(function () {
          if (cursor1El) cursor1El.classList.add('is-hidden');
          if (cursor2El) cursor2El.classList.remove('is-hidden');
          stepLine2();
        }, 260);
      }
    }

    function stepLine2() {
      if (!isRunning) return;
      if (idx2 <= totalLine2) {
        var sCount = Math.min(idx2, TEXT_SMART.length);
        var hCount = Math.max(0, idx2 - TEXT_SMART.length);
        typeSmartEl.textContent = TEXT_SMART.slice(0, sCount);
        typeHsbEl.textContent = TEXT_HSB.slice(0, hCount);
        idx2++;
        var delay = 90 + Math.random() * 50;
        typeTimer = setTimeout(stepLine2, delay);
      } else {
        typeTimer = setTimeout(function () {
          if (cursor2El) cursor2El.classList.add('is-hidden');
          runSloganSequence();
        }, 750);
      }
    }

    typeTimer = setTimeout(stepLine1, 300);
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = portalEl.clientWidth || window.innerWidth;
    height = portalEl.clientHeight || window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    auxCanvas.width = Math.floor(width * dpr);
    auxCanvas.height = Math.floor(height * dpr);
    if (auxCtx) auxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Resizing clears a canvas even when playback is paused.
    drawVideoScene(ctx);
  }

  /**
   * Draws the intelligence-layer video frame with full atmospheric continuity:
   * - 100% seamless cosmic sky: base is filled with pure #000000 and feathered to #000000,
   *   then dyed with screen-blended #081b44 -> #153b86 so lateral bands are physically impossible.
   * - Natural ground reflection with zero rectangular cutouts.
   * - Door top positioned safely below the header menu across all screens.
   * - Bottom logoipsum row cleanly masked out.
   */
  function drawVideoScene(targetCtx) {
    var c = targetCtx || ctx;
    if (!c || !auxCtx) return;

    if (!videoEl || videoEl.readyState < 2 || videoFailed) {
      var fallback = c.createLinearGradient(0, 0, 0, height);
      fallback.addColorStop(0, '#0d66f8');
      fallback.addColorStop(0.48, '#0652e8');
      fallback.addColorStop(1, '#042d8c');
      c.fillStyle = fallback;
      c.fillRect(0, 0, width, height);
      return;
    }

    // 1. Base canvas filled with pure black (screen neutral element)
    c.fillStyle = '#000000';
    c.fillRect(0, 0, width, height);

    var vw = videoEl.videoWidth || 1462;
    var vh = videoEl.videoHeight || 1080;

    // 2. Proportionally balanced scale
    var scaleCover = Math.max(width / vw, height / vh);
    var scaleContain = Math.min(width / vw, height / vh);
    var scale = scaleCover * 0.70 + scaleContain * 0.30;

    var drawW = vw * scale;
    var drawH = vh * scale;
    var drawX = (width - drawW) * 0.5;

    // 3. Vertical alignment:
    // Door top in video coordinate space is ny = 0.3157 (door bottom ny = 0.7972)
    // We ensure the door top is comfortably below the 76px header with ample breathing space (>= 180px)
    var drawY = (height - drawH) * 0.46;
    var doorTop = drawY + 0.3157 * drawH;
    var minDoorTop = Math.max(175, height * 0.20);
    if (doorTop < minDoorTop) {
      drawY = minDoorTop - 0.3157 * drawH;
    }

    // Draw the video frame
    c.drawImage(videoEl, drawX, drawY, drawW, drawH);

    function vx(nx) { return drawX + nx * drawW; }
    function vy(ny) { return drawY + ny * drawH; }

    // 4. Mirror the clean right half of the doorway onto the left half
    // to cleanly remove baked-in English copy while preserving 100% outer halo symmetry
    auxCtx.globalCompositeOperation = 'source-over';
    auxCtx.clearRect(0, 0, width, height);
    auxCtx.save();
    auxCtx.translate(width, 0);
    auxCtx.scale(-1, 1);
    auxCtx.drawImage(
      videoEl,
      vw * 0.5, 0, vw * 0.5, vh,
      width * 0.5, drawY, drawW * 0.5, drawH
    );
    auxCtx.restore();

    auxCtx.globalCompositeOperation = 'destination-in';
    var mirrorMask = auxCtx.createLinearGradient(0, vy(0), 0, vy(0.585));
    mirrorMask.addColorStop(0, 'rgba(0, 0, 0, 1)');
    mirrorMask.addColorStop(0.87, 'rgba(0, 0, 0, 1)');
    mirrorMask.addColorStop(1, 'rgba(0, 0, 0, 0)');
    auxCtx.fillStyle = mirrorMask;
    auxCtx.fillRect(0, Math.min(0, drawY), width * 0.5 + 2, vy(0.585) - Math.min(0, drawY));

    c.drawImage(auxCanvas, 0, 0, width, height);

    // 5. Feather outer lateral edges smoothly into black
    if (drawX > 0) {
      var fadeW = drawW * 0.10;
      var leftSideGrad = c.createLinearGradient(drawX, 0, drawX + fadeW, 0);
      leftSideGrad.addColorStop(0, '#000000');
      leftSideGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      c.fillStyle = leftSideGrad;
      c.fillRect(drawX, 0, fadeW, height);

      // Solid black from 0 to drawX
      c.fillStyle = '#000000';
      c.fillRect(0, 0, drawX, height);
    }
    if (drawX + drawW < width) {
      var fadeW = drawW * 0.10;
      var rightSideGrad = c.createLinearGradient(drawX + drawW - fadeW, 0, drawX + drawW, 0);
      rightSideGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      rightSideGrad.addColorStop(1, '#000000');
      c.fillStyle = rightSideGrad;
      c.fillRect(drawX + drawW - fadeW, 0, fadeW, height);

      // Solid black from (drawX + drawW) to width
      c.fillStyle = '#000000';
      c.fillRect(drawX + drawW, 0, width - (drawX + drawW), height);
    }

    // 6. Mask out the original top navbar of the template video
    var topMaskY = vy(0.135);
    if (topMaskY > 0) {
      var topGrad = c.createLinearGradient(0, Math.min(0, drawY), 0, topMaskY);
      topGrad.addColorStop(0, '#000000');
      topGrad.addColorStop(0.70, '#000000');
      topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      c.fillStyle = topGrad;
      c.fillRect(0, Math.min(0, drawY), width, topMaskY - Math.min(0, drawY));
    }

    // 7. Mask out the bottom logoipsum row (starts at ny = 0.949 in the video)
    var botMaskY = vy(0.910);
    if (botMaskY < height) {
      var botFadeH = Math.max(1, drawH * 0.045);
      var botGrad = c.createLinearGradient(0, botMaskY, 0, Math.min(height, botMaskY + botFadeH));
      botGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      botGrad.addColorStop(1, '#000000');
      c.fillStyle = botGrad;
      c.fillRect(0, botMaskY, width, Math.min(height, botMaskY + botFadeH) - botMaskY);

      var solidBotY = Math.min(height, botMaskY + botFadeH);
      if (solidBotY < height) {
        c.fillStyle = '#000000';
        c.fillRect(0, solidBotY, width, height - solidBotY);
      }
    }

    // 8. Seamless Vibrant Brand Royal Blue Atmospheric Color Grading
    // Calibrated to match the authentic SmartHSB icon primary blue palette:
    // Luminous sky: #0d66f8 -> Vibrant primary electric blue: #0652e8 -> Deep sapphire ground: #042d8c
    // Over black (#000000), 'screen' composite renders the exact calibrated blue tone
    // across the entire width and height with zero lateral discrepancies.
    // The doorway center remains brilliant white, and ground reflections blend naturally.
    auxCtx.globalCompositeOperation = 'source-over';
    auxCtx.clearRect(0, 0, width, height);

    var baseBlueGrad = auxCtx.createLinearGradient(0, 0, 0, height);
    baseBlueGrad.addColorStop(0, '#0d66f8');      // Luminous royal blue (top sky)
    baseBlueGrad.addColorStop(0.48, '#0652e8');   // Vibrant primary brand blue (center field)
    baseBlueGrad.addColorStop(1, '#042d8c');      // Deep sapphire foundation (ground)
    auxCtx.fillStyle = baseBlueGrad;
    auxCtx.fillRect(0, 0, width, height);

    var portalBloom = auxCtx.createRadialGradient(
      width * 0.5,
      vy(0.56),
      20,
      width * 0.5,
      vy(0.56),
      Math.max(width, height) * 0.65
    );
    portalBloom.addColorStop(0, 'rgba(147, 215, 255, 0.28)'); // Luminous cyan-white portal glow
    portalBloom.addColorStop(0.42, 'rgba(56, 189, 248, 0.16)');
    portalBloom.addColorStop(1, 'rgba(6, 82, 232, 0)');
    auxCtx.fillStyle = portalBloom;
    auxCtx.fillRect(0, 0, width, height);

    c.save();
    c.globalCompositeOperation = 'screen';
    c.drawImage(auxCanvas, 0, 0, width, height);
    c.restore();

    // 9. Ground plane tone unity
    var groundY = vy(0.912);
    if (groundY < height) {
      c.save();
      c.globalCompositeOperation = 'color';
      var groundHueGrad = c.createLinearGradient(0, groundY, 0, height);
      groundHueGrad.addColorStop(0, 'rgba(6, 82, 232, 0)');
      groundHueGrad.addColorStop(0.25, 'rgba(6, 82, 232, 0.88)');
      groundHueGrad.addColorStop(1, 'rgba(4, 45, 140, 1.0)');
      c.fillStyle = groundHueGrad;
      c.fillRect(0, groundY, width, height - groundY);
      c.restore();
    }
  }

  function render(now) {
    if (!isRunning || !shouldAnimate()) { stopLoop(); return; }

    // Seamless continuous loop before figure disappears into the doorway
    if (videoEl && videoEl.duration) {
      if (videoEl.currentTime >= 6.1 || videoEl.currentTime >= videoEl.duration - 0.15) {
        videoEl.currentTime = 0.05;
      }
    }

    drawVideoScene(ctx);
    rafId = window.requestAnimationFrame(render);
  }

  function ensureVideoPlaying() {
    if (!videoEl || !shouldAnimate()) return;
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.playsInline = true;
    videoEl.loop = true;

    try {
      var playPromise = videoEl.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(function () {
          // A pending play() can resolve after the user has disabled motion.
          if (shouldAnimate()) startLoop();
          else stopLoop();
        }).catch(function () {
          if (shouldAnimate()) {
            stopLoop();
            showStaticText();
            drawVideoScene(ctx);
          }
        });
      }
    } catch (e) {
      stopLoop();
      showStaticText();
    }
  }

  function startLoop() {
    if (isRunning || !shouldAnimate()) return;
    isRunning = true;
    if (ctx && auxCtx) rafId = window.requestAnimationFrame(render);
  }

  function syncPlayback() {
    if (!shouldAnimate()) {
      stopLoop();
      showStaticText();
      drawVideoScene(ctx);
      return;
    }
    startLoop();
    ensureVideoPlaying();
  }

  function stopLoop() {
    isRunning = false;
    if (videoEl) {
      try { videoEl.pause(); } catch (e) {}
    }
    if (typeTimer) {
      clearTimeout(typeTimer);
      typeTimer = null;
    }
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Setup video element robust event handlers
  if (videoEl) {
    videoEl.muted = true;
    videoEl.defaultMuted = true;
    videoEl.playsInline = true;
    videoEl.loop = true;
    videoEl.setAttribute('muted', '');
    videoEl.setAttribute('playsinline', '');
    videoEl.setAttribute('webkit-playsinline', '');
    videoEl.setAttribute('loop', '');

    videoEl.addEventListener('loadeddata', function () {
      drawVideoScene(ctx);
      ensureVideoPlaying();
    });
    videoEl.addEventListener('canplay', ensureVideoPlaying);
    videoEl.addEventListener('error', function () {
      videoFailed = true;
      syncPlayback();
    });

    videoEl.addEventListener('ended', function () {
      if (!shouldAnimate()) return;
      try {
        videoEl.currentTime = 0.05;
        ensureVideoPlaying();
      } catch (e) {}
    });
  }

  // Global user interaction triggers to guarantee video unlocks in all browsers
  var unlockEvents = ['pointerdown', 'touchstart', 'click', 'scroll', 'mousemove', 'keydown'];
  function onUserGesture() {
    if (videoEl && videoEl.paused && shouldAnimate()) ensureVideoPlaying();
  }
  unlockEvents.forEach(function (ev) {
    window.addEventListener(ev, onUserGesture, { passive: true });
  });

  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', syncPlayback);
  var motionWasOff = document.body.classList.contains('motion-off');
  new MutationObserver(function () {
    var motionIsOff = document.body.classList.contains('motion-off');
    if (motionWasOff !== motionIsOff) {
      motionWasOff = motionIsOff;
      syncPlayback();
    }
  }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (entries) {
      var visible = entries[0].isIntersecting;
      if (inViewport !== visible) {
        inViewport = visible;
        syncPlayback();
      }
    }).observe(portalEl);
  }

  window.addEventListener('resize', resize, { passive: true });
  if (window.ResizeObserver) {
    new ResizeObserver(resize).observe(portalEl);
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion.matches || motionWasOff ? 'instant' : 'smooth' });
      if (videoEl && shouldAnimate()) {
        try {
          videoEl.currentTime = 0;
          syncPlayback();
        } catch (err) {}
      }
      startTypewriter();
    });
  }

  // Initialize
  resize();
  syncPlayback();
  if (shouldAnimate()) startTypewriter();
  else showStaticText();
})();
