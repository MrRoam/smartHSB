const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const read = (...parts) => fs.readFileSync(path.join(__dirname, '..', ...parts), 'utf8');
const homeScript = read('website', 'assets', 'js', 'column-home.js');
const homeStyles = read('website', 'assets', 'css', 'home-minpilot.css');

test('homepage places the market title with the market explorer and removes the standalone overview', () => {
  for (const homepage of [read('website', 'index.html'), read('index.html')]) {
    const marketSection = homepage.match(/<section class="markets section" id="markets">([\s\S]*?)<\/section>/)?.[1] ?? '';

    assert.doesNotMatch(homepage, /class="overview section"|class="overview-intro"/);
    assert.match(marketSection, /class="market-section-head reveal"/);
    assert.match(marketSection, /一个账户[\s\S]*打开全球市场/);
    assert.match(marketSection, /class="market-summary-row"/);
    assert.match(marketSection, /class="market-catalog-summary"/);
    assert.match(marketSection, /class="market-explorer/);
    assert.doesNotMatch(marketSection, /市场各有节奏|选择你的关注/);
    assert.ok(homepage.indexOf('id="markets"') < homepage.indexOf('id="platform"'));
  }
  assert.doesNotMatch(homeScript, /querySelectorAll\('\.overview-intro h2/);
  assert.match(homeStyles, /\.home-minpilot \.markets \{background:#fff;/);
});
