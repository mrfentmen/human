const Clarity = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Clarity Tests');

test('simplify text', () => {
  const c = new Clarity();
  const result = c.simplify('This is a complex sentence. It has many words. And more.', 'beginner');
  assert(result.simplified, 'Should have simplified text');
  assert(result.level === 'beginner', 'Should have level');
  assert(result.wordCount > 0, 'Should have word count');
});

test('expert keeps jargon', () => {
  const c = new Clarity();
  const result = c.simplify('The function has O(n) complexity.', 'expert');
  assert(result.simplified.includes('O(n)') || result.simplified.includes('complexity'), 'Should keep technical terms');
});

test('beginner removes jargon', () => {
  const c = new Clarity();
  const result = c.simplify('The function has O(n) complexity.', 'beginner');
  assert(!result.simplified.includes('O(n)'), 'Should remove jargon');
});

test('getLevel', () => {
  const c = new Clarity();
  assert(c.getLevel('expert') === 'expert', 'Should return expert');
  assert(c.getLevel('unknown') === 'beginner', 'Should default to beginner');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
