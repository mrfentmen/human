const Grace = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Grace Tests');

test('classifies network error', () => {
  const g = new Grace();
  const result = g.handle(new Error('network error'));
  assert(result.type === 'retry', 'Should retry');
  assert(result.fallback === 'cached', 'Should use cached');
});

test('classifies permission error', () => {
  const g = new Grace();
  const result = g.handle(new Error('permission denied'));
  assert(result.type === 'alternative', 'Should suggest alternative');
});

test('classifies not found', () => {
  const g = new Grace();
  const result = g.handle(new Error('file not found'));
  assert(result.type === 'simplified', 'Should simplify');
});

test('classifies timeout', () => {
  const g = new Grace();
  const result = g.handle(new Error('request timeout'));
  assert(result.type === 'partial', 'Should return partial');
});

test('classifies rate limit', () => {
  const g = new Grace();
  const result = g.handle(new Error('rate limit exceeded'));
  assert(result.type === 'wait', 'Should wait');
});

test('classifies unknown', () => {
  const g = new Grace();
  const result = g.handle(new Error('something weird'));
  assert(result.type === 'human_handoff', 'Should hand off');
});

test('getFallback', () => {
  const g = new Grace();
  const fb = g.getFallback('partial_result', { lastResult: 'data' });
  assert(fb.result === 'data', 'Should return partial result');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
