const Humility = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Humility Tests');

test('confident response', () => {
  const h = new Humility();
  const result = h.evaluate('The answer is 42', {});
  assert(result.verdict === 'confident', `Got ${result.verdict}`);
  assert(result.confidence >= 0.8, 'Should be high confidence');
});

test('uncertain response', () => {
  const h = new Humility();
  const result = h.evaluate('Maybe 42', { ambiguous: true, novelSituation: true });
  assert(result.verdict === 'uncertain' || result.verdict === 'unknown', `Got ${result.verdict}`);
});

test('unknown response', () => {
  const h = new Humility();
  const result = h.evaluate('Guess', { noTrainingData: true, contradiction: true });
  assert(result.verdict === 'unknown', `Got ${result.verdict}`);
  assert(result.message.includes("don't know"), 'Should admit uncertainty');
});

test('signals tracked', () => {
  const h = new Humility();
  const result = h.evaluate('test', { noTrainingData: true });
  assert(result.signals.length > 0, 'Should have signals');
  assert(result.signals[0].type === 'knowledge_gap', 'Wrong signal type');
});

test('confidence decreases', () => {
  const h = new Humility();
  const r1 = h.evaluate('test', {});
  const r2 = h.evaluate('test', { noTrainingData: true, ambiguous: true });
  assert(r2.confidence < r1.confidence, 'Confidence should decrease');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
