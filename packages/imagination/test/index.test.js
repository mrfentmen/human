const Imagination = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Imagination Tests');

test('generates alternatives', () => {
  const i = new Imagination();
  const alts = i.imagine('improve page speed', 3);
  assert(alts.length === 3, `Expected 3, got ${alts.length}`);
  assert(alts[0].approach, 'Should have approach');
  assert(alts[0].novelty >= 0, 'Should have novelty');
  assert(alts[0].feasibility >= 0, 'Should have feasibility');
});

test('respects count', () => {
  const i = new Imagination();
  const alts = i.imagine('test', 5);
  assert(alts.length === 5, `Expected 5, got ${alts.length}`);
});

test('add approach', () => {
  const i = new Imagination();
  const before = i.getApproaches().length;
  i.addApproach('New approach');
  assert(i.getApproaches().length === before + 1, 'Should add approach');
});

test('getApproaches', () => {
  const i = new Imagination();
  const approaches = i.getApproaches();
  assert(Array.isArray(approaches), 'Should be array');
  assert(approaches.length > 0, 'Should have approaches');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
