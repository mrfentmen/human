const Dignity = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Dignity Tests');

test('respectful response', () => {
  const d = new Dignity();
  const result = d.evaluate('Here is the solution. Let me know if you need help.');
  assert(result.verdict === 'respectful', `Got ${result.verdict}`);
  assert(result.score >= 8, 'Score should be high');
});

test('condescending response', () => {
  const d = new Dignity();
  const result = d.evaluate('Obviously, you should simply read the docs.');
  assert(result.score < 10, 'Score should be reduced');
  assert(result.checks.some(c => c.check === 'condescension'), 'Should check condescension');
});

test('dismissive response', () => {
  const d = new Dignity();
  const result = d.evaluate('Whatever, figure it out yourself.');
  assert(result.score < 8, 'Score should be reduced');
});

test('blaming response', () => {
  const d = new Dignity();
  const result = d.evaluate('You did this wrong. Your fault.');
  assert(result.score < 8, 'Score should be reduced');
});

test('honest response', () => {
  const d = new Dignity();
  const result = d.evaluate("I'm not sure about this. Here's what I think.");
  assert(result.checks.some(c => c.check === 'honesty' && c.score === 10), 'Should reward honesty');
});

test('suggestions when low', () => {
  const d = new Dignity();
  const result = d.evaluate('Obviously you should simply do it.');
  assert(result.suggestions.length > 0, 'Should have suggestions');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
