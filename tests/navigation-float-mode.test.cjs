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
  assert.match(homeStyles, /\.home-minpilot \.site-header\.sticky[\s\S]*?padding:0/);
  assert.match(homeStyles, /\.home-minpilot \.site-header\.sticky \.nav-inner[\s\S]*?height:66px/);
  assert.match(internalStyles, /\.internal-site\[data-page\] \.site-header \.nav-inner[\s\S]*?height:66px/);
});

test('desktop dropdowns remain connected to their trigger without a hover gap', () => {
  const homeStyles = read('website/assets/css/home-minpilot.css');
  const internalStyles = read('website/assets/css/site-light.css');

  assert.doesNotMatch(homeStyles, /\.site-header\.sticky \.dropdown \{top:calc\(100% \+ 8px\)/);
  assert.doesNotMatch(internalStyles, /\.site-header \.dropdown \{top:calc\(100% \+ 8px\)/);
});

test('internal-page hero background extends behind the fixed navigation', () => {
  const internalStyles = read('website/assets/css/site-light.css');

  assert.match(internalStyles, /\.internal-site\[data-page\]\.header-fixed main \{padding-top:0;\}/);
  assert.match(internalStyles, /\.internal-site\[data-page\] \.page-hero \{padding-top:168px;\}/);
  assert.match(internalStyles, /@media \(max-width:800px\)[\s\S]*?\.internal-site\[data-page\] \.page-hero \{padding-top:137px;\}/);
});

test('internal-page hero uses a bright blue and green light field instead of a grey-white wash', () => {
  const internalStyles = read('website/assets/css/site-light.css');

  assert.match(internalStyles, /linear-gradient\(118deg,#EAF6FF 0%,#F1FBFF 36%,#E8FFF5 67%,#DFFFEA 100%\)/);
  assert.match(internalStyles, /radial-gradient\(66% 100% at 100% 2%,rgba\(182,255,115,\.45\)/);
  assert.match(internalStyles, /\.internal-site\[data-page\] \.page-hero::before \{[\s\S]*?z-index:0/);
  assert.match(internalStyles, /\.internal-site\[data-page\] \.page-hero>\.wrap \{position:relative;z-index:1;\}/);
});

test('download-app navigation action uses the same blue-green brand gradient on every page', () => {
  const homeStyles = read('website/assets/css/home-minpilot.css');
  const internalStyles = read('website/assets/css/site-light.css');

  assert.match(homeStyles, /\.home-minpilot \.site-header \.nav-actions \.button-outline \{[\s\S]*?color:#fff;[\s\S]*?linear-gradient\(90deg,#1E5CD2 0%,#176EAC 48%,#00795F 78%,#006C45 100%\)/);
  assert.match(homeStyles, /\.home-minpilot \.site-header\.sticky \.nav-actions \.button-outline \{[\s\S]*?color:#fff;[\s\S]*?linear-gradient\(90deg,#1E5CD2 0%,#176EAC 48%,#00795F 78%,#006C45 100%\)/);
  assert.match(internalStyles, /\.internal-site\[data-page\] \.site-header \.nav-actions \.button-outline \{[\s\S]*?color:#fff;[\s\S]*?linear-gradient\(90deg,#1E5CD2 0%,#176EAC 48%,#00795F 78%,#006C45 100%\)/);
  assert.match(internalStyles, /\.internal-site\[data-page\] \.site-header \.nav-actions \.button-outline\.current-page \{color:#fff!important;\}/);
  assert.doesNotMatch(homeStyles, /\.site-header\.sticky \.nav-actions \.button-outline \{[\s\S]*?background:#10161E/);
  assert.doesNotMatch(internalStyles, /\.site-header \.nav-actions \.button-outline \{[\s\S]*?background:#10161E/);
});

test('dropdown and mobile submenu entries use consistent functional icons', () => {
  const styles = read('website/assets/css/navigation-v2.css');

  assert.match(styles, /\.navigation-complete \.dropdown a::before,[\s\S]*?\.navigation-complete-mobile \.mobile-nav-links a::before/);
  assert.match(styles, /-webkit-mask:\s*var\(--nav-menu-icon\) center\/contain no-repeat/);
  assert.match(styles, /:where\(\.navigation-complete \.dropdown a,\.navigation-complete-mobile \.mobile-nav-links a\) \{\s*--nav-menu-icon:/);
  assert.doesNotMatch(styles, /\.navigation-complete \.dropdown a,\s*\.navigation-complete-mobile \.mobile-nav-links a \{\s*--nav-menu-icon:/);
  assert.match(styles, /\[href\$="account-types\.html"\][\s\S]*?--nav-menu-icon:/);
  assert.match(styles, /\[href\$="products\.html"\][\s\S]*?--nav-menu-icon:/);
  assert.match(styles, /\[href\$="download-app\.html"\][\s\S]*?--nav-menu-icon:/);
  assert.match(styles, /\[href\$="privacy-policy\.html"\][\s\S]*?--nav-menu-icon:/);
});

test('header brand places the 2026 A+++ award after a divider', () => {
  const styles = read('website/assets/css/navigation-v2.css');

  assert.match(styles, /\.site-header \.brand > span:last-child::after \{[\s\S]*?border-left: 1px solid/);
  assert.match(styles, /\.site-header \.brand::after \{[\s\S]*?badge_award_2026_color\.png/);
  assert.match(styles, /background: linear-gradient\(135deg, #f6dc8d 0%, #d4a735 55%, #a66d09 100%\)/);
  assert.match(styles, /@media \(max-width: 1100px\) \{[\s\S]*?\.site-header \.brand::after \{ display: none; \}/);
});
