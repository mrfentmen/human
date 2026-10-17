const Courage = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Courage Tests');

test('generates alternatives', () => {
  const c = new Courage();
  const alts = c.generateAlternatives('Try a different approach', 3);
  assert(alts.length === 3, `Expected 3, got ${alts.length}`);
  assert(alts[0].approach, 'Should have approach');
  assert(alts[0].feasibility >= 0, 'Should have feasibility');
});

test('excludes failed approach', () => {
  const c = new Courage();
  const alts = c.generateAlternatives('Try a different approach', 10);
  assert(!alts.some(a => a.approach === 'Try a different approach'), 'Should exclude failed approach');
});

test('shouldActivate', () => {
  const c = new Courage({ maxStandardRetries: 3 });
  assert(!c.shouldActivate(2), 'Should not activate before threshold');
  assert(c.shouldActivate(3), 'Should activate at threshold');
  assert(c.shouldActivate(5), 'Should activate after threshold');
});

test('add strategy', () => {
  const c = new Courage();
  const before = c.strategies.length;
  c.addStrategy('New strategy');
  assert(c.strategies.length === before + 1, 'Should add strategy');
});

test('sorted by feasibility', () => {
  const c = new Courage();
  const alts = c.generateAlternatives('x', 5);
  for (let i = 1; i < alts.length; i++) {
    assert(alts[i-1].feasibility >= alts[i].feasibility, 'Should be sorted by feasibility');
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
