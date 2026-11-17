const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('platform navigation presents separate SmartHSB APP and MetaTrader 5 destinations', () => {
  const appPage = read('website/download-app.html');
  const mt5Page = read('website/download-mt5.html');
  const homePage = read('website/index.html');

  assert.match(appPage, /<title>SmartHSB APP 下载/);
  assert.match(appPage, /href="download-mt5\.html"/);
  assert.match(mt5Page, /<title>MetaTrader 5 下载/);
  assert.match(mt5Page, /href="download-app\.html"/);
  assert.match(homePage, /href="download-app\.html">下载 APP/);
  assert.match(homePage, /href="download-mt5\.html">MetaTrader 5/);
});

test('both download pages use the dedicated responsive design and motion-safe stylesheet', () => {
  for (const page of ['website/download-app.html', 'website/download-mt5.html']) {
    const source = read(page);
    assert.match(source, /assets\/css\/download-platforms\.css\?v=/);
    assert.match(source, /data-download-platform="(?:app|mt5)"/);
  }

  const styles = read('website/assets/css/download-platforms.css');
  assert.match(styles, /@media \(prefers-reduced-motion:reduce\)/);
  assert.match(styles, /\.download-platform\.motion-off/);
  assert.match(styles, /\.download-platform \.icard\{[^}]*padding:31px 32px 32px/);
  assert.match(styles, /\.page-download-mt5\.download-platform \.mt5-intro\{max-width:none;width:100%/);
});

test('published navigation sends visitors to one of the two platform pages, not the former download hub', () => {
  const pages = fs.readdirSync(path.join(root, 'website')).filter(file => file.endsWith('.html'));

  for (const page of pages) {
    const source = read(`website/${page}`);
    assert.doesNotMatch(source, /href="download\.html"/);
    assert.match(source, /href="download-app\.html">SmartHSB APP/);
    assert.match(source, /href="download-mt5\.html">MetaTrader 5/);
  }
});
