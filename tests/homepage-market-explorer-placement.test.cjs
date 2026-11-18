const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const read = (...parts) => fs.readFileSync(path.join(__dirname, '..', ...parts), 'utf8');

test('homepage replaces the overview map with the market explorer and removes its former heading', () => {
  for (const homepage of [read('website', 'index.html'), read('index.html')]) {
    const overview = homepage.match(/<section class="overview section" id="overview">([\s\S]*?)<\/section>/)?.[1] ?? '';
    const marketSection = homepage.match(/<section class="markets section" id="markets">([\s\S]*?)<\/section>/)?.[1] ?? '';

    assert.doesNotMatch(overview, /overview-world|class="stats"/);
    assert.match(marketSection, /class="market-catalog-summary"/);
    assert.match(marketSection, /class="market-explorer/);
    assert.doesNotMatch(marketSection, /市场各有节奏|选择你的关注/);
    assert.ok(homepage.indexOf('id="overview"') < homepage.indexOf('id="markets"'));
    assert.ok(homepage.indexOf('id="markets"') < homepage.indexOf('id="platform"'));
  }
});
