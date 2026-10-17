const Reflex = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.log(`  ✗ ${name}: ${e.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

console.log('Reflex Tests');

const reflexContent = `
reflex prevent_overwrite
  trigger: before_action
  check: file_exists
  condition: action is write_file
  on_fail: allow
  on_pass: ask_user
  message: "File exists. Overwrite?"

reflex block_dangerous
  trigger: before_action
  check: custom "echo test"
  on_pass: block
  on_fail: allow
  message: "Dangerous command blocked"

reflex require_tests
  trigger: before_commit
  check: tests_pass
  on_pass: allow
  on_fail: block
  message: "Tests must pass"
`;

test('parse reflex file', () => {
  const r = new Reflex({ directory: '/tmp' });
  const parsed = r.parse(reflexContent);
  assert(parsed.length === 3, `Expected 3 reflexes, got ${parsed.length}`);
  assert(parsed[0].name === 'prevent_overwrite', 'Wrong name');
});

test('check file_exists when file exists', () => {
  const r = new Reflex({ directory: '/tmp' });
  r.rules = r.parse(reflexContent);
  const results = r.beforeAction('write_file', 'app.js', { fileExists: true });
  assert(results.length > 0, 'No reflex fired');
  assert(results[0].action === 'ask_user', `Expected ask_user, got ${results[0].action}`);
});

test('check file_exists when file does not exist', () => {
  const r = new Reflex({ directory: '/tmp' });
  r.rules = r.parse(reflexContent);
  const results = r.beforeAction('write_file', 'app.js', { fileExists: false });
  const preventResult = results.find(r => r.name === 'prevent_overwrite');
  assert(preventResult && preventResult.action === 'allow', 'Should allow when file does not exist');
});

test('beforeCommit triggers require_tests', () => {
  const r = new Reflex({ directory: '/tmp' });
  r.rules = r.parse(reflexContent);
  const results = r.beforeCommit({ testsPass: false });
  assert(results.length > 0, 'No reflex fired');
  assert(results[0].action === 'block', `Expected block, got ${results[0].action}`);
});

test('beforeCommit passes when tests pass', () => {
  const r = new Reflex({ directory: '/tmp' });
  r.rules = r.parse(reflexContent);
  const results = r.beforeCommit({ testsPass: true });
  const reqResult = results.find(r => r.name === 'require_tests');
  assert(reqResult && reqResult.action === 'allow', 'Should allow when tests pass');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
