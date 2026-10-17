const CommonSense = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Common Sense Tests');

test('allows valid action', () => {
  const cs = new CommonSense({ checks: ['disk_space'] });
  const result = cs.validate('write_file', { diskSpace: 50 });
  assert(result.allowed === true, 'Should allow');
});

test('blocks low disk space', () => {
  const cs = new CommonSense({ checks: ['disk_space'] });
  const result = cs.validate('write_file', { diskSpace: 5 });
  assert(result.allowed === false, 'Should block');
  assert(result.reason === 'Low disk space', 'Wrong reason');
});

test('blocks file open', () => {
  const cs = new CommonSense({ checks: ['file_open'] });
  const result = cs.validate('write_file', { fileOpen: true });
  assert(result.allowed === false, 'Should block');
});

test('custom check passes', () => {
  const cs = new CommonSense({});
  cs.addCustomCheck('is_js', (action, ctx) => ctx.file && ctx.file.endsWith('.js'));
  const result = cs.validate('write_file', { file: 'app.js' });
  assert(result.allowed === true, 'Should allow');
});

test('custom check fails', () => {
  const cs = new CommonSense({});
  cs.addCustomCheck('is_js', (action, ctx) => ctx.file && ctx.file.endsWith('.js'));
  const result = cs.validate('write_file', { file: 'app.py' });
  assert(result.allowed === false, 'Should block');
});

test('multiple checks', () => {
  const cs = new CommonSense({ checks: ['disk_space', 'file_open'] });
  const result = cs.validate('write_file', { diskSpace: 50, fileOpen: false });
  assert(result.allowed === true, 'Should allow');
  assert(result.results.length === 2, 'Should have 2 results');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
