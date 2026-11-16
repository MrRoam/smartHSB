const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'website', 'assets', 'js', 'column-home.js'),
  'utf8'
);

test('point-map stops scheduling frames while it is outside the viewport', () => {
  assert.match(
    source,
    /function schedule\(\)\{if\(!motion\|\|!visible\|\|document\.hidden\|\|frame\)return;/,
    'the scheduler must not queue a frame while the canvas is offscreen or the page is hidden'
  );
  assert.match(
    source,
    /function stop\(\)\{cancelAnimationFrame\(frame\);frame=0;\}/,
    'an already queued frame must be cancelled when the canvas leaves the viewport'
  );
  assert.match(
    source,
    /visible=entries\[0\]\.isIntersecting;if\(visible\)restart\(\);else stop\(\);/,
    'viewport changes must stop offscreen work and restart visible canvases'
  );
});

test('point-map cancels an offscreen frame and schedules one when it returns', () => {
  const start = source.indexOf('  function pointMap(canvas, isFooter=false){');
  const end = source.indexOf("  pointMap(document.querySelector('#footer-dots'),true);") +
    "  pointMap(document.querySelector('#footer-dots'),true);".length;
  assert.notEqual(start, -1, 'the point-map renderer must exist');
  assert.ok(end > start, 'the point-map renderer must keep both canvases registered');

  const frames = new Map();
  const observers = [];
  let frameId = 0;
  const context2d = {
    setTransform() {}, clearRect() {}, drawImage() {}, beginPath() {}, arc() {}, fill() {},
    moveTo() {}, quadraticCurveTo() {}, stroke() {}, fillText() {}
  };
  const canvas = () => ({
    width: 0,
    height: 0,
    getContext: () => ({ ...context2d }),
    getBoundingClientRect: () => ({ width: 160, height: 80 }),
    parentElement: { addEventListener() {} }
  });
  const world = canvas();
  const footer = canvas();
  const context = {
    window: { WORLD_POINTS: [] },
    document: {
      hidden: false,
      createElement: () => canvas(),
      querySelector: selector => selector === '#world-dots' ? world : selector === '#footer-dots' ? footer : null
    },
    performance: { now: () => 0 },
    devicePixelRatio: 1,
    requestAnimationFrame(callback) {
      const id = ++frameId;
      frames.set(id, callback);
      return id;
    },
    cancelAnimationFrame(id) { frames.delete(id); },
    ResizeObserver: class {
      constructor(callback) { this.callback = callback; }
      observe() { this.callback(); }
    },
    IntersectionObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe(target) { this.target = target; }
    }
  };

  const renderer = source.slice(start, end);
  vm.runInNewContext(`let motion = true; const canvasRenderers = []; ${renderer}`, context);
  assert.equal(frames.size, 2, 'both visible maps initially queue one frame');

  const footerObserver = observers.find(observer => observer.target === footer);
  footerObserver.callback([{ isIntersecting: false }]);
  assert.equal(frames.size, 1, 'the footer map has no queued frame while offscreen');

  footerObserver.callback([{ isIntersecting: true }]);
  assert.equal(frames.size, 2, 'the footer map resumes only after returning to the viewport');
});
