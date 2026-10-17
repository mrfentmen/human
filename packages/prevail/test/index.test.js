const PatienceQueue = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Patience Tests');

test('enqueue and process', () => {
  const q = new PatienceQueue();
  const id = q.enqueue('deploy', ['tests_pass'], {});
  assert(id, 'Should return id');
  assert(q.getQueue().length === 1, 'Should have 1 queued');
});

test('release when condition met', () => {
  const q = new PatienceQueue();
  q.enqueue('deploy', ['tests_pass'], {});
  const released = q.process({ testsPass: true });
  assert(released.length === 1, `Expected 1 released, got ${released.length}`);
  assert(q.getQueue().length === 0, 'Queue should be empty');
});

test('hold when condition not met', () => {
  const q = new PatienceQueue();
  q.enqueue('deploy', ['tests_pass'], {});
  const released = q.process({ testsPass: false });
  assert(released.length === 0, 'Should not release');
  assert(q.getQueue().length === 1, 'Should still be queued');
});

test('cancel queued action', () => {
  const q = new PatienceQueue();
  const id = q.enqueue('deploy', ['tests_pass'], {});
  q.cancel(id);
  assert(q.getQueue().length === 0, 'Should be cancelled');
});

test('multiple conditions', () => {
  const q = new PatienceQueue();
  q.enqueue('deploy', ['tests_pass', 'git_clean'], {});
  const released1 = q.process({ testsPass: true, gitClean: false });
  assert(released1.length === 0, 'Should not release (git not clean)');
  const released2 = q.process({ testsPass: true, gitClean: true });
  assert(released2.length === 1, 'Should release when all conditions met');
});

test('function condition', () => {
  const q = new PatienceQueue();
  q.enqueue('deploy', [() => true], {});
  const released = q.process({});
  assert(released.length === 1, 'Function condition should work');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
