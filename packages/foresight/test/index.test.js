const Foresight = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Foresight Tests');

test('low risk action', () => {
  const f = new Foresight();
  const result = f.simulate('read file', {});
  assert(result.riskScore < 20, 'Should be low risk');
  assert(result.recommendation.includes('Low risk'), 'Should recommend safe');
});

test('high risk delete', () => {
  const f = new Foresight();
  const result = f.simulate('delete database', { affectedFiles: 10, affectedUsers: 100 });
  assert(result.riskScore > 50, 'Should be high risk');
  assert(result.recommendation.includes('High risk'), 'Should recommend caution');
});

test('deploy risk', () => {
  const f = new Foresight();
  const result = f.simulate('deploy to production', {});
  assert(result.riskScore >= 20, 'Should have some risk');
  assert(result.impacts.some(i => i.type === 'production'), 'Should flag production');
});

test('irreversible flag', () => {
  const f = new Foresight();
  const result = f.simulate('drop table users', {});
  assert(result.impacts.some(i => i.type === 'irreversible'), 'Should flag irreversible');
});

test('impacts array', () => {
  const f = new Foresight();
  const result = f.simulate('delete file', { affectedFiles: 3 });
  assert(Array.isArray(result.impacts), 'Should have impacts array');
  assert(result.impacts.length > 0, 'Should have impacts');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
