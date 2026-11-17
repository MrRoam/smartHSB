const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('homepage hero renders four market signals within the existing canvas scene', () => {
  const source = read('website/assets/js/hero-holo.js');

  assert.match(source, /const MARKET_SIGNALS = \[/);
  for (const label of ['贵金属', '股指', '外汇', '能源']) {
    assert.match(source, new RegExp(`label: '${label}'`));
  }
  assert.match(source, /function drawMarketSignals\(t2, scroll\)/);
  assert.match(source, /candles\(t2, scroll\);\s*drawMarketSignals\(t2, scroll\);/);
});

test('market signals respect the hero safe area and do not add a separate DOM overlay', () => {
  const source = read('website/assets/js/hero-holo.js');
  const homepage = read('website/index.html');

  assert.match(source, /const Z = 10 \+ \(\(signal\.Z - scroll\) % 46 \+ 46\) % 46/);
  assert.match(source, /if \(Z < 13 \|\| Z > 52\) continue/);
  assert.match(source, /if \(W > 760 && size > 11\)/);
  assert.doesNotMatch(homepage, /market-signals|holo-market-signal/);
});
