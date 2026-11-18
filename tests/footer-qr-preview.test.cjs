const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('footer download badges reveal their channel-specific QR placeholder on hover and keyboard focus', () => {
  const styles = read('website/assets/css/column-home.css');
  const homeStyles = read('website/assets/css/home-minpilot.css');

  assert.match(styles, /\.footer-links \.store-btn\{[^}]*width:156px[^}]*height:52px[^}]*background:transparent/);
  assert.match(styles, /\.footer-links \.dl-qr::after\{[^}]*transform:scale\(\.72\)/);
  assert.match(styles, /\.dl-box:has\(\.store-btn:nth-child\(1\):is\(:hover,:focus-visible\)\) \.dl-qr::after\{[^}]*transform:scale\(1\.5\)/);
  assert.match(styles, /url\('\.\.\/img\/qr\/qr_appstore\.png'\)/);
  assert.match(styles, /\.dl-box:has\(\.store-btn:nth-child\(2\):is\(:hover,:focus-visible\)\) \.dl-qr::after/);
  assert.match(styles, /url\('\.\.\/img\/qr\/qr_googleplay\.png'\)/);
  assert.doesNotMatch(styles, /\.dl-box:has\([^}]+\) \.dl-qr\{[^}]*\b(?:width|height):/);
  assert.match(homeStyles, /\.home-minpilot \.footer-links \.store-btn\s*\{[^}]*display:\s*block[^}]*align-items:\s*initial/);
});

test('two replaceable QR placeholder assets exist for the footer channels', () => {
  assert.ok(fs.existsSync(path.join(root, 'website/assets/img/qr/qr_appstore.png')));
  assert.ok(fs.existsSync(path.join(root, 'website/assets/img/qr/qr_googleplay.png')));
});

test('footer QR placeholders consistently invite visitors to scan for download', () => {
  const pages = [
    'index.html',
    ...fs.readdirSync(path.join(root, 'website')).filter(file => file.endsWith('.html')).map(file => `website/${file}`),
  ];

  for (const page of pages) {
    const source = read(page);
    assert.match(source, /class="dl-qr"[\s\S]*?<span>扫码下载<\/span>/, page);
    assert.doesNotMatch(source, /<span>待上线<\/span>/, page);
  }
});
