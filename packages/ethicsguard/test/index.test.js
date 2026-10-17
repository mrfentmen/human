const Discipline = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Discipline Tests');

const d = new Discipline();

test('detects var usage', () => {
  const result = d.lint('var x = 5;');
  assert(!result.passed, 'Should fail');
  assert(result.violations.some(v => v.rule === 'no_var'), 'Should detect var');
});

test('allows let and const', () => {
  const result = d.lint('let x = 5;\nconst y = 10;');
  assert(!result.violations.some(v => v.rule === 'no_var'), 'Should not detect var');
});

test('detects console.log', () => {
  const result = d.lint('console.log("hello");');
  assert(result.violations.some(v => v.rule === 'no_console_log'), 'Should detect console.log');
  assert(result.passed, 'Should pass (warning only)');
});

test('detects eval', () => {
  const result = d.lint('eval("code");');
  assert(!result.passed, 'Should fail');
  assert(result.violations.some(v => v.rule === 'no_eval'), 'Should detect eval');
});

test('detects any type', () => {
  const result = d.lint('const x: any = 5;');
  assert(result.violations.some(v => v.rule === 'no_any_type'), 'Should detect any');
});

test('clean code passes', () => {
  const result = d.lint('const x = 5;\nconst y = 10;\nreturn x + y;');
  assert(result.passed, 'Should pass');
  assert(result.errors === 0, 'Should have no errors');
});

test('add custom rule', () => {
  const d2 = new Discipline();
  d2.addRule({ name: 'no_todo', pattern: /TODO/, message: 'Remove TODO', severity: 'warning' });
  const result = d2.lint('const x = 5; // TODO fix this');
  assert(result.violations.some(v => v.rule === 'no_todo'), 'Should detect TODO');
});

test('remove rule', () => {
  const d2 = new Discipline();
  d2.removeRule('no_var');
  const result = d2.lint('var x = 5;');
  assert(!result.violations.some(v => v.rule === 'no_var'), 'Should not detect var after removal');
});

test('score calculation', () => {
  const result = d.lint('const x = 5;');
  assert(result.score > 0, 'Should have a score');
  assert(result.score <= 10, 'Score should be <= 10');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
