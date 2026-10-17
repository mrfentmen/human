const Human = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Human Tests');

const h = new Human({ directory: '/tmp' });

test('parse concept file', () => {
  const parsed = h.constructor.parseConceptFile ? null : null;
  // Use module export
  const { parseConceptFile } = require('../src/index.js');
  const content = `reflex test\n  trigger: before_action\n  check: file_exists`;
  const result = parseConceptFile(content);
  assert(result.length === 1, `Expected 1, got ${result.length}`);
  assert(result[0].type === 'reflex', 'Wrong type');
});

test('muscle memory cache and find', () => {
  h.cachePattern('deploy_app', ['build', 'test', 'deploy']);
  const found = h.findPattern('deploy my app');
  assert(found !== null, 'Should find pattern');
  assert(found.name === 'deploy_app', 'Wrong pattern');
});

test('muscle memory record success', () => {
  h.cachePattern('test_pattern', ['step1']);
  h.recordSuccess('test_pattern');
  const p = h.muscleMemory.get('test_pattern');
  assert(p.successCount === 1, 'Should have 1 success');
  assert(p.confidence === 1, 'Confidence should be 1');
});

test('wisdom add and query', () => {
  h.addWisdom('auth', 'Use NextAuth.js', ['Set NEXTAUTH_SECRET'], ['nextjs', 'auth']);
  const results = h.queryWisdom('auth');
  assert(results.length === 1, 'Should find wisdom');
  assert(results[0].judgment === 'Use NextAuth.js', 'Wrong judgment');
});

test('focus filters context', () => {
  const context = { login: 'login code here', unrelated: 'unrelated stuff', auth: 'auth code' };
  const filtered = h.focus(context, 'login auth');
  assert(filtered.login, 'Should include login');
  assert(filtered.auth, 'Should include auth');
  assert(!filtered.unrelated, 'Should exclude unrelated');
});

test('empathy adapts style', () => {
  const h2 = new Human({ directory: '/tmp' });
  h2.updateUserState({ frustrated: true });
  h2.updateUserState({ frustrated: true });
  h2.updateUserState({ frustrated: true });
  const style = h2.getAdaptedStyle();
  assert(style === 'concise_direct', `Expected concise_direct, got ${style}`);
});

test('conscience evaluates action', () => {
  const result = h.evaluateConscience('delete user data', { affectedUsers: 1000, involvesPersonalData: true, userConsented: false });
  assert(result.verdict === 'block', `Expected block, got ${result.verdict}`);
  assert(result.score < 7, 'Score should be low');
});

test('attention hooks', () => {
  let called = false;
  h.registerHook('pre-write', (ctx) => { called = true; return 'ok'; });
  const results = h.triggerHook('pre-write', {});
  assert(results.length === 1, 'Should have 1 result');
  assert(called, 'Handler should have been called');
});

test('judgment scores solution', () => {
  const result = h.judge('function test() {}', { hasTests: true, hasErrorHandling: true });
  assert(result.overall > 5, 'Score should be above 5');
  assert(result.verdict !== 'needs_improvement', 'Should not need improvement');
});

test('taste evaluates output', () => {
  const result = h.evaluateTaste('function hello() { return "world"; }', 'code');
  assert(result.overall > 0, 'Should have a score');
  assert(result.scores, 'Should have scores');
});

test('foresight simulates action', () => {
  const result = h.simulate('delete database', { affectedFiles: 10 });
  assert(result.riskScore >= 30, `Should be at least moderate risk, got ${result.riskScore}`);
  assert(result.recommendation.includes('risk'), 'Should include risk assessment');
});

test('imagination generates alternatives', () => {
  const alts = h.imagine('improve page speed', 3);
  assert(alts.length === 3, `Expected 3, got ${alts.length}`);
  assert(alts[0].approach, 'Should have approach');
});

test('checkAll runs all concepts', () => {
  const h3 = new Human({ directory: '/tmp' });
  h3.concepts.reflex.push({ name: 'test_reflex', type: 'reflex', rules: { trigger: 'before_action', check: 'file_exists', condition: 'action is write_file', on_pass: 'ask_user', on_fail: 'allow', message: 'test' } });
  const results = h3.checkAll({ triggerType: 'before_action', action: 'write_file', fileExists: true });
  assert(results.reflex, 'Should have reflex results');
  assert(results.reflex.length > 0, 'Should have at least one reflex result');
  assert(results.empathy, 'Should have empathy results');
  assert(results.conscience, 'Should have conscience results');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
