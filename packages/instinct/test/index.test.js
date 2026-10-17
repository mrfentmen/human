const Instinct = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Instinct Tests');

const content = `
instinct suspicious_code
  pattern: contains eval(
  response: flag
  confidence: 0.95
  speed: instant
  message: "Suspicious code detected"

instinct secret_check
  pattern: contains password
  response: block
  confidence: 0.99
  speed: instant
  message: "Secret detected"

instinct no_match
  pattern: contains foobar
  response: warn
  confidence: 0.5
  message: "No match expected"
`;

test('parse instinct file', () => {
  const i = new Instinct({ directory: '/tmp' });
  const parsed = i.parse(content);
  assert(parsed.length === 3, `Expected 3, got ${parsed.length}`);
  assert(parsed[0].name === 'suspicious_code', 'Wrong name');
});

test('contains match fires', () => {
  const i = new Instinct({ directory: '/tmp' });
  i.instincts = i.parse(content);
  const results = i.check({ text: 'const x = eval(input)' });
  assert(results.length === 1, `Expected 1, got ${results.length}`);
  assert(results[0].name === 'suspicious_code', 'Wrong instinct');
  assert(results[0].response === 'flag', 'Wrong response');
});

test('block on secret', () => {
  const i = new Instinct({ directory: '/tmp' });
  i.instincts = i.parse(content);
  const results = i.check({ text: 'const password = "secret123"' });
  assert(results.length === 1, `Expected 1, got ${results.length}`);
  assert(results[0].response === 'block', 'Should block');
});

test('no match returns empty', () => {
  const i = new Instinct({ directory: '/tmp' });
  i.instincts = i.parse(content);
  const results = i.check({ text: 'const x = 42' });
  assert(results.length === 0, `Expected 0, got ${results.length}`);
});

test('multiple matches', () => {
  const i = new Instinct({ directory: '/tmp' });
  i.instincts = i.parse(content);
  const results = i.check({ text: 'eval(input) with password' });
  assert(results.length === 2, `Expected 2, got ${results.length}`);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
