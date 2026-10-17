const Precision = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Precision Tests');

test('correct math', () => {
  const p = new Precision();
  const result = p.checkMath('2 + 2', 4);
  assert(result.passed, 'Should pass');
  assert(result.result === 4, 'Should be 4');
});

test('incorrect math', () => {
  const p = new Precision();
  const result = p.checkMath('2 + 2', 5);
  assert(!result.passed, 'Should fail');
});

test('complex math', () => {
  const p = new Precision();
  const result = p.checkMath('10 * 5 + 3', 53);
  assert(result.passed, 'Should pass');
});

test('unit conversion', () => {
  const p = new Precision();
  const result = p.checkUnits(1, 'm', 'cm');
  assert(result.passed, 'Should convert');
  assert(result.converted === 100, 'Should be 100');
});

test('same units', () => {
  const p = new Precision();
  const result = p.checkUnits(5, 'm', 'm');
  assert(result.passed, 'Should pass');
});

test('rounding', () => {
  const p = new Precision();
  assert(p.round(3.14159, 2) === 3.14, 'Should round to 2 decimals');
  assert(p.round(3.14159, 4) === 3.1416, 'Should round to 4 decimals');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
