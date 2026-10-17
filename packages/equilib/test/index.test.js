const Balance = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Balance Tests');

test('analyzes options', () => {
  const b = new Balance();
  const result = b.analyze([
    { name: 'Option A', speed: 8, security: 4 },
    { name: 'Option B', speed: 4, security: 8 }
  ]);
  assert(result.options.length === 2, 'Should have 2 options');
  assert(result.recommendation, 'Should have recommendation');
});

test('sorts by overall', () => {
  const b = new Balance();
  const result = b.analyze([
    { name: 'Low', speed: 2, security: 2 },
    { name: 'High', speed: 9, security: 9 }
  ]);
  assert(result.options[0].name === 'High', 'Should sort by overall');
});

test('tradeoffs', () => {
  const b = new Balance();
  const result = b.analyze([
    { name: 'Fast', speed: 9, security: 3 },
    { name: 'Secure', speed: 3, security: 9 }
  ]);
  const fast = result.options.find(o => o.name === 'Fast');
  assert(fast.tradeoffs.length > 0, 'Should have tradeoffs');
  assert(fast.tradeoffs[0].pros.includes('speed'), 'Should list speed as pro');
});

test('comparison', () => {
  const b = new Balance();
  const result = b.analyze([
    { name: 'A', speed: 8 },
    { name: 'B', speed: 5 }
  ]);
  assert(result.comparison, 'Should have comparison');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
