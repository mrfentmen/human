const MuscleMemory = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Muscle Memory Tests');

test('cache a pattern', () => {
  const mm = new MuscleMemory();
  const p = mm.cache('deploy_app', ['build', 'test', 'deploy']);
  assert(p.name === 'deploy_app', 'Wrong name');
  assert(p.steps.length === 3, 'Wrong steps');
  assert(p.confidence === 0.5, 'Initial confidence should be 0.5');
});

test('find pattern by description', () => {
  const mm = new MuscleMemory();
  mm.cache('deploy_app', ['build', 'test', 'deploy']);
  const found = mm.find('deploy my app');
  assert(found !== null, 'Should find pattern');
  assert(found.name === 'deploy_app', 'Wrong pattern');
});

test('no match returns null', () => {
  const mm = new MuscleMemory();
  mm.cache('deploy_app', ['build', 'test', 'deploy']);
  const found = mm.find('cook dinner');
  assert(found === null, 'Should not find pattern');
});

test('record success increases confidence', () => {
  const mm = new MuscleMemory();
  mm.cache('test', ['step1']);
  mm.recordSuccess('test');
  mm.recordSuccess('test');
  const p = mm.patterns.get('test');
  assert(p.successCount === 2, 'Should have 2 successes');
  assert(p.confidence === 1, 'Confidence should be 1');
});

test('record failure decreases confidence', () => {
  const mm = new MuscleMemory();
  mm.cache('test', ['step1']);
  mm.recordSuccess('test');
  mm.recordFailure('test');
  const p = mm.patterns.get('test');
  assert(p.confidence === 0.5, 'Confidence should be 0.5');
});

test('add adaptation', () => {
  const mm = new MuscleMemory();
  mm.cache('test', ['step1']);
  mm.addAdaptation('test', 'changed build command');
  const p = mm.patterns.get('test');
  assert(p.adaptations.length === 1, 'Should have 1 adaptation');
});

test('prune low confidence', () => {
  const mm = new MuscleMemory({ maxPatterns: 2 });
  mm.cache('a', ['s1']);
  mm.cache('b', ['s2']);
  mm.cache('c', ['s3']);
  mm.recordFailure('a');
  mm.recordFailure('a');
  mm.prune();
  assert(mm.patterns.size <= 2, 'Should prune to max');
});

test('getStats', () => {
  const mm = new MuscleMemory();
  mm.cache('a', ['s1']);
  mm.cache('b', ['s2']);
  const stats = mm.getStats();
  assert(stats.totalPatterns === 2, 'Should have 2 patterns');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
