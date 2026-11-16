const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('homepage promotes the header only after the intro portal has left the top edge', () => {
  const source = read('website/assets/js/column-home.js');

  assert.match(source, /const introPortal=document\.querySelector\('#intro-portal'\)/);
  assert.match(source, /introPortal\.getBoundingClientRect\(\)\.bottom<=96/);
  assert.match(source, /header\.classList\.toggle\('sticky',pastHero\)/);
});

test('internal pages start with a visible floating header and never hide it on downward scroll', () => {
  const source = read('website/assets/js/subpages.js');

  assert.match(source, /header\?\.classList\.add\('sticky'\)/);
  assert.match(source, /header\.classList\.remove\('hidden-header'\)/);
  assert.doesNotMatch(source, /hidden-header',fixed&&y>prior\+4/);
});

test('floating navigation has a pill surface on home and internal pages', () => {
  const homeStyles = read('website/assets/css/home-minpilot.css');
  const internalStyles = read('website/assets/css/site-light.css');

  assert.match(homeStyles, /\.home-minpilot \.site-header\.sticky[\s\S]*?border-radius:999px/);
  assert.match(internalStyles, /\.internal-site\[data-page\] \.site-header[\s\S]*?position:fixed[\s\S]*?border-radius:999px/);
});
