const Empathy = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Empathy Tests');

test('initial state is balanced', () => {
  const e = new Empathy();
  assert(e.getAdaptedStyle() === 'balanced', 'Should start balanced');
});

test('frustration changes style', () => {
  const e = new Empathy();
  e.updateUserState({ frustrated: true });
  e.updateUserState({ frustrated: true });
  e.updateUserState({ frustrated: true });
  assert(e.getAdaptedStyle() === 'concise_direct', 'Should be concise_direct');
});

test('success increases confidence', () => {
  const e = new Empathy();
  e.updateUserState({ success: true });
  e.updateUserState({ success: true });
  const model = e.getUserModel();
  assert(model.emotionalState.confidence > 0.5, 'Confidence should increase');
});

test('urgency changes style', () => {
  const e = new Empathy();
  e.updateUserState({ urgent: true });
  e.updateUserState({ urgent: true });
  assert(e.getAdaptedStyle() === 'fast_focused', 'Should be fast_focused');
});

test('tracks domains', () => {
  const e = new Empathy();
  e.updateUserState({ topic: 'react' });
  e.updateUserState({ topic: 'node' });
  const model = e.getUserModel();
  assert(model.knowledge.domains.includes('react'), 'Should include react');
  assert(model.knowledge.domains.includes('node'), 'Should include node');
});

test('tracks errors', () => {
  const e = new Empathy();
  e.updateUserState({ error: 'TypeError' });
  const model = e.getUserModel();
  assert(model.patterns.commonErrors.includes('TypeError'), 'Should track error');
});

test('response guidelines', () => {
  const e = new Empathy();
  const guidelines = e.getResponseGuidelines();
  assert(guidelines.maxWords, 'Should have maxWords');
  assert(guidelines.tone, 'Should have tone');
});

test('reset', () => {
  const e = new Empathy();
  e.updateUserState({ frustrated: true });
  e.reset();
  assert(e.getAdaptedStyle() === 'balanced', 'Should reset to balanced');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
