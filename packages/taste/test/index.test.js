const Taste = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Taste Tests');

test('evaluates code', () => {
  const t = new Taste();
  const result = t.evaluate('function hello() { return "world"; }', 'code');
  assert(result.overall > 0, 'Should have score');
  assert(result.scores, 'Should have scores');
});

test('evaluates ui', () => {
  const t = new Taste();
  const result = t.evaluate('padding: 10px; border-radius: 4px; transition: all .3s;', 'ui');
  assert(result.overall > 5, 'UI should score well');
});

test('evaluates text', () => {
  const t = new Taste();
  const result = t.evaluate('This is a well-written sentence. It has good flow.', 'text');
  assert(result.overall > 0, 'Should have score');
});

test('verdict', () => {
  const t = new Taste();
  const result = t.evaluate('function hello() { return "world"; }', 'code');
  assert(result.verdict, 'Should have verdict');
});

test('suggestions when low', () => {
  const t = new Taste({ threshold: 9 });
  const result = t.evaluate('x', 'code');
  assert(result.suggestions.length > 0, 'Should have suggestions');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
