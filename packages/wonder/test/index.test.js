const Wonder = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Wonder Tests');

test('novel finding is interesting', () => {
  const w = new Wonder();
  const result = w.evaluate('Pattern X found in 3 files');
  assert(result.interesting === true, 'Should be interesting');
  assert(result.types.includes('novel'), 'Should be novel');
});

test('same finding not interesting twice', () => {
  const w = new Wonder();
  w.evaluate('Pattern X');
  const result = w.evaluate('Pattern X');
  assert(result.interesting === false, 'Should not be interesting second time');
});

test('anomaly detection', () => {
  const w = new Wonder();
  const result = w.evaluate('Unusual pattern', { isAnomaly: true });
  assert(result.types.includes('anomaly'), 'Should be anomaly');
});

test('opportunity detection', () => {
  const w = new Wonder();
  const result = w.evaluate('Optimization found', { isOpportunity: true });
  assert(result.types.includes('opportunity'), 'Should be opportunity');
});

test('getKnownCount', () => {
  const w = new Wonder();
  w.evaluate('Finding 1');
  w.evaluate('Finding 2');
  assert(w.getKnownCount() === 2, 'Should have 2 known');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
