const Judgment = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Judgment Tests');

test('scores solution', () => {
  const j = new Judgment();
  const result = j.judge('function test() {}', { hasTests: true, hasErrorHandling: true });
  assert(result.overall > 5, 'Score should be above 5');
  assert(result.scores, 'Should have scores');
});

test('excellent verdict', () => {
  const j = new Judgment();
  const result = j.judge('code', { hasTests: true, isOptimized: true, isDocumented: true, hasErrorHandling: true, isSimple: true });
  assert(result.verdict === 'good' || result.verdict === 'excellent', `Got ${result.verdict}`);
  assert(result.overall >= 6, 'Score should be at least 6');
});

test('suggestions', () => {
  const j = new Judgment();
  const result = j.judge('code', {});
  assert(result.suggestions.length > 0, 'Should have suggestions');
});

test('custom weights', () => {
  const j = new Judgment({ weights: { correctness: 0.5, efficiency: 0.1, maintainability: 0.1, safety: 0.2, simplicity: 0.1 } });
  const result = j.judge('code', { hasTests: true });
  assert(result.overall > 0, 'Should have score');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
