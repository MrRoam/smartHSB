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
  assert.match(styles, /\.download-platform \.dl-visual\s*\{[^}]*grid-template-columns:1fr;grid-template-rows:1fr;gap:0/);
  assert.match(styles, /\.download-platform :is\(\.dv-phone,\.dv-laptop\)\{grid-area:1\/1;justify-self:center;align-self:center/);
  assert.match(styles, /\.dl-visual--mt5 \.dv-laptop\{transform:rotate\(4deg\)/);
  assert.match(styles, /:is\(\.dl-visual--app,\.dl-visual--mt5\) \.dv-plats\{right:7%;bottom:3%/);
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

test('platform descriptions state that SmartHSB APP can trade independently while MT5 only lacks registration', () => {
  const appPage = read('website/download-app.html');
  const mt5Page = read('website/download-mt5.html');

  assert.match(appPage, /您可按需要使用任一端交易，无需同时使用/);
  assert.match(appPage, /可以。SmartHSB APP 支持行情查看与下单交易/);
  assert.doesNotMatch(appPage, /行情分析与下单需通过/);
  assert.match(mt5Page, /MetaTrader 5 本身不提供注册功能/);
  assert.match(mt5Page, /您可直接在 SmartHSB APP 内完成交易/);
  assert.doesNotMatch(mt5Page, /MT5 是 HSB 指定的交易平台/);
});

test('SmartHSB APP introduction fills its visual column with a centered account preview', () => {
  const appPage = read('website/download-app.html');
  const styles = read('website/assets/css/download-platforms.css');

  assert.match(appPage, /class="app-about-layout"/);
  assert.match(appPage, /class="app-account-preview" aria-hidden="true"/);
  assert.match(appPage, /APP ACCOUNT/);
  assert.match(styles, /\.download-platform \.app-about-layout\{display:grid;grid-template-columns:minmax\(0,1\.45fr\) minmax\(260px,\.72fr\)/);
  assert.match(styles, /\.download-platform \.app-account-preview\{position:relative;min-height:245px;display:grid;place-items:center/);
});
