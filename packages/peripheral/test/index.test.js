const Peripheral = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Peripheral Tests');

test('parse peripheral file', () => {
  const p = new Peripheral({ directory: '/tmp' });
  const content = `peripheral test\n  watch: file_changes\n  alert: "File changed: {file}"\n  level: warn\n  trigger: on_change`;
  const parsed = p.parse(content);
  assert(parsed.length === 1, `Expected 1, got ${parsed.length}`);
  assert(parsed[0].name === 'test', 'Wrong name');
});

test('always trigger fires', () => {
  const p = new Peripheral({ directory: '/tmp' });
  p.addWatcher('test', 'file_changes', 'File changed', 'warn', 'always');
  const results = p.check({});
  assert(results.length === 1, `Expected 1, got ${results.length}`);
  assert(results[0].level === 'warn', 'Wrong level');
});

test('on_change trigger', () => {
  const p = new Peripheral({ directory: '/tmp' });
  p.addWatcher('test', 'file_changes', 'Changed', 'info', 'on_change');
  const r1 = p.check({ changed: false });
  assert(r1.length === 0, 'Should not fire when not changed');
  const r2 = p.check({ changed: true });
  assert(r2.length === 1, 'Should fire when changed');
});

test('on_threshold trigger', () => {
  const p = new Peripheral({ directory: '/tmp' });
  p.addWatcher('test', 'context_overflow', 'Overflow', 'warn', 'on_threshold');
  const r1 = p.check({ thresholdExceeded: false });
  assert(r1.length === 0, 'Should not fire');
  const r2 = p.check({ thresholdExceeded: true });
  assert(r2.length === 1, 'Should fire');
});

test('alert template resolution', () => {
  const p = new Peripheral({ directory: '/tmp' });
  p.addWatcher('test', 'file_changes', 'File {file} changed', 'info', 'always');
  const results = p.check({ file: 'app.js' });
  assert(results[0].alert === 'File app.js changed', `Got: ${results[0].alert}`);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
