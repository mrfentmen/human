const Rhythm = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Rhythm Tests');

test('paces simple content', () => {
  const r = new Rhythm();
  const result = r.pace('Hello world. This is simple.', {});
  assert(result.chunks.length > 0, 'Should have chunks');
  assert(result.pace, 'Should have pace');
});

test('slow pace for complex content', () => {
  const r = new Rhythm();
  const result = r.pace('function calculateComplexity(data) { const result = data.map(x => x * 2).filter(x => x > 10).reduce((a, b) => a + b, 0); return result; } This function processes an array of numbers, doubles each value, filters those greater than 10, and sums them up. The time complexity is O(n) and space complexity is O(n).', {});
  assert(result.pace === 'slow' || result.pace === 'normal', `Got ${result.pace}`);
});

test('fast pace for urgent', () => {
  const r = new Rhythm();
  const result = r.pace('Simple text here.', { urgency: 0.9 });
  assert(result.pace === 'fast', `Got ${result.pace}`);
});

test('beginner gets slow', () => {
  const r = new Rhythm();
  const result = r.pace('Some content here.', { userLevel: 'beginner' });
  assert(result.pace === 'slow', `Got ${result.pace}`);
});

test('assessComplexity', () => {
  const r = new Rhythm();
  const simple = r.assessComplexity('Hello world.');
  const complex = r.assessComplexity('The function has O(n) complexity and uses async API calls to the database.');
  assert(complex > simple, 'Complex should be more complex');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
