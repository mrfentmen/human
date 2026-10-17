const Conscience = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Conscience Tests');

test('allows ethical action', () => {
  const c = new Conscience();
  const result = c.evaluate('read file', { userConsented: true });
  assert(result.verdict === 'allow', `Expected allow, got ${result.verdict}`);
  assert(result.score >= 7, 'Score should be high');
});

test('blocks unethical action', () => {
  const c = new Conscience();
  const result = c.evaluate('delete user data', { affectedUsers: 1000, involvesPersonalData: true, userConsented: false });
  assert(result.verdict === 'block', `Expected block, got ${result.verdict}`);
  assert(result.score < 4, 'Score should be low');
});

test('warns on questionable action', () => {
  const c = new Conscience();
  const result = c.evaluate('delete temp files', { userConsented: false });
  assert(result.verdict === 'warn' || result.verdict === 'block', `Got ${result.verdict}`);
});

test('checks are returned', () => {
  const c = new Conscience();
  const result = c.evaluate('read file', { userConsented: true });
  assert(result.checks.length > 0, 'Should have checks');
  assert(result.checks.some(c => c.criterion === 'consent'), 'Should check consent');
});

test('irreversible action lowers score', () => {
  const c = new Conscience();
  const result = c.evaluate('delete database', { userConsented: true });
  assert(result.score < 10, 'Score should be reduced');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
