const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('trading signals use the public strategy API with Chinese content', () => {
  const source = read('website/assets/js/market-content.js');

  assert.match(source, /content\.adxpm99\.com\/api\/v1\/content\/strategies/);
  assert.match(source, /STRATEGY_API\+'\/page/);
  assert.match(source, /STRATEGY_API\+'\/detail/);
  assert.match(source, /'X-Language':'zh-CN'/);
  assert.match(source, /fetch\(/);
});

test('trading signals have pagination and no cryptocurrency category or sample', () => {
  const source = read('website/assets/js/market-content.js');

  assert.match(source, /var PAGE_SIZE=12/);
  assert.match(source, /pageSize='\+PAGE_SIZE/);
  assert.match(source, /data-load-more/);
  assert.match(source, /加载更多策略/);
  assert.doesNotMatch(source, /\['crypto','加密货币'\]/);
  assert.doesNotMatch(source, /BCHUSD/);
});

test('signal pages do not show the removed static-snapshot banner', () => {
  const source = read('website/assets/js/market-content.js');

  assert.doesNotMatch(source, /静态快照 · \$\{snapshot\} · 非实时/);
  assert.match(source, /策略数据由 Trading Central 提供/);
});

test('signal pagination has a visible keyboard-focusable control', () => {
  const styles = read('website/assets/css/market-content.css');

  assert.match(styles, /\.signal-load-more/);
  assert.match(styles, /\.signal-load-more:focus-visible/);
});
