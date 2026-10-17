const Flow = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Flow Tests');

test('initial state is good', () => {
  const f = new Flow();
  const state = f.getState();
  assert(state.state, 'Should have state');
  assert(state.overall >= 0, 'Should have overall');
});

test('records metrics', () => {
  const f = new Flow();
  f.record('responseQuality', 0.9);
  f.record('userSatisfaction', 0.95);
  const state = f.getState();
  assert(state.metrics.quality === 0.9, 'Should record quality');
});

test('flow state when high metrics', () => {
  const f = new Flow();
  f.record('responseQuality', 0.95);
  f.record('responseTime', 0.9);
  f.record('errorRate', 0.05);
  f.record('userSatisfaction', 0.95);
  f.record('tokenEfficiency', 0.9);
  const state = f.getState();
  assert(state.inFlow === true, `Should be in flow, got ${state.state}`);
});

test('poor state when low metrics', () => {
  const f = new Flow();
  f.record('responseQuality', 0.2);
  f.record('responseTime', 0.1);
  f.record('errorRate', 0.8);
  f.record('userSatisfaction', 0.2);
  f.record('tokenEfficiency', 0.2);
  const state = f.getState();
  assert(state.state === 'poor' || state.state === 'degraded', `Got ${state.state}`);
  assert(state.adjustments.length > 0, 'Should have adjustments');
});

test('reset', () => {
  const f = new Flow();
  f.record('responseQuality', 0.9);
  f.reset();
  const state = f.getState();
  assert(state.metrics.quality === 0.5, 'Should reset to default');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
