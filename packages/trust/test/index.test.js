const Trust = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Trust Tests');

test('record and getReliability', () => {
  const t = new Trust();
  t.record('write', true);
  t.record('write', true);
  t.record('write', false);
  const rel = t.getReliability('write');
  assert(rel.rate === 0.67, `Expected 0.67, got ${rel.rate}`);
  assert(rel.count === 3, 'Should have 3 records');
  assert(rel.successes === 2, 'Should have 2 successes');
});

test('shouldTrust with enough data', () => {
  const t = new Trust({ threshold: 0.7 });
  t.record('read', true);
  t.record('read', true);
  t.record('read', true);
  assert(t.shouldTrust('read') === true, 'Should trust');
});

test('shouldTrust with insufficient data', () => {
  const t = new Trust();
  t.record('read', true);
  assert(t.shouldTrust('read') === false, 'Should not trust with 1 record');
});

test('getReport', () => {
  const t = new Trust();
  t.record('write', true);
  t.record('read', false);
  const report = t.getReport();
  assert(report.write, 'Should have write');
  assert(report.read, 'Should have read');
});

test('overall reliability', () => {
  const t = new Trust();
  t.record('write', true);
  t.record('read', true);
  const rel = t.getReliability();
  assert(rel.rate === 1, 'Should be 100%');
  assert(rel.count === 2, 'Should have 2 records');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
