const Focus = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Focus Tests');

const focus = new Focus();

test('filters relevant context', () => {
  const context = {
    login: 'login authentication code here',
    unrelated: 'unrelated stuff about weather',
    auth: 'auth module with JWT tokens'
  };
  const result = focus.filter(context, 'login auth');
  assert(result.filtered.login, 'Should include login');
  assert(result.filtered.auth, 'Should include auth');
  assert(!result.filtered.unrelated, 'Should exclude unrelated');
});

test('returns relevance score', () => {
  const context = { a: 'login code', b: 'weather info' };
  const result = focus.filter(context, 'login');
  assert(result.relevanceScore > 0, 'Should have relevance');
  assert(result.removedCount === 1, `Expected 1 removed, got ${result.removedCount}`);
});

test('scores text relevance', () => {
  const score = focus.score('This is about login and authentication', 'login auth');
  assert(score > 0.5, `Expected > 0.5, got ${score}`);
});

test('extracts relevant sentences', () => {
  const text = 'The weather is nice. Login requires authentication. Cats are cute. Auth uses JWT tokens.';
  const relevant = focus.extractRelevant(text, 'login auth', 2);
  assert(relevant.length <= 2, 'Should return at most 2');
  assert(relevant.some(s => s.includes('Login') || s.includes('Auth')), 'Should include relevant sentences');
});

test('handles empty context', () => {
  const result = focus.filter({}, 'anything');
  assert(Object.keys(result.filtered).length === 0, 'Should be empty');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
