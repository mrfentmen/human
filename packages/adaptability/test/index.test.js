const Adaptability = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Adaptability Tests');

test('beginner gets detailed', () => {
  const a = new Adaptability();
  const result = a.adapt({ userLevel: 'beginner' });
  assert(result.style === 'detailed_educational', `Got ${result.style}`);
  assert(result.verbosity > 0.5, 'Should be verbose');
});

test('expert gets concise', () => {
  const a = new Adaptability();
  const result = a.adapt({ userLevel: 'expert' });
  assert(result.style === 'concise_technical', `Got ${result.style}`);
  assert(result.verbosity < 0.5, 'Should be concise');
});

test('urgent reduces verbosity', () => {
  const a = new Adaptability();
  const result = a.adapt({ userLevel: 'beginner', urgent: true });
  assert(result.verbosity <= 0.4, 'Should reduce verbosity');
});

test('project type sets code style', () => {
  const a = new Adaptability();
  const result = a.adapt({ projectType: 'web' });
  assert(result.codeStyle === 'react', 'Should set react');
});

test('late night reduces verbosity', () => {
  const a = new Adaptability();
  const result = a.adapt({ timeOfDay: 'late_night' });
  assert(result.verbosity <= 0.4, 'Should reduce verbosity');
});

test('default is balanced', () => {
  const a = new Adaptability();
  const result = a.adapt({});
  assert(result.style === 'balanced', 'Should be balanced');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
