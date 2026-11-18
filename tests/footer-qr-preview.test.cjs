const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('footer download badges reveal their channel-specific QR placeholder on hover and keyboard focus', () => {
  const styles = read('website/assets/css/column-home.css');

  assert.match(styles, /\.footer-links \.store-btn\{[^}]*width:174px[^}]*height:58px/);
  assert.match(styles, /\.footer-links \.dl-qr::after\{[^}]*transform:scale\(\.72\)/);
  assert.match(styles, /\.dl-box:has\(\.store-btn:nth-child\(1\):is\(:hover,:focus-visible\)\) \.dl-qr::after\{[^}]*transform:scale\(1\.5\)/);
  assert.match(styles, /url\('\.\.\/img\/qr\/qr_appstore\.png'\)/);
  assert.match(styles, /\.dl-box:has\(\.store-btn:nth-child\(2\):is\(:hover,:focus-visible\)\) \.dl-qr::after/);
  assert.match(styles, /url\('\.\.\/img\/qr\/qr_googleplay\.png'\)/);
  assert.doesNotMatch(styles, /\.dl-box:has\([^}]+\) \.dl-qr\{[^}]*\b(?:width|height):/);
});

test('two replaceable QR placeholder assets exist for the footer channels', () => {
  assert.ok(fs.existsSync(path.join(root, 'website/assets/img/qr/qr_appstore.png')));
  assert.ok(fs.existsSync(path.join(root, 'website/assets/img/qr/qr_googleplay.png')));
});
