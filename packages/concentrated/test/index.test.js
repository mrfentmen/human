const Attention = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Attention Tests');

test('register and trigger', () => {
  const a = new Attention();
  let called = false;
  a.register('pre-write', (ctx) => { called = true; return 'ok'; });
  const results = a.trigger('pre-write', {});
  assert(results.length === 1, 'Should have 1 result');
  assert(called, 'Handler should be called');
});

test('trigger with no handlers', () => {
  const a = new Attention();
  const results = a.trigger('unknown', {});
  assert(results.length === 0, 'Should be empty');
});

test('unregister', () => {
  const a = new Attention();
  const handler = (ctx) => 'ok';
  a.register('test', handler);
  a.unregister('test', handler);
  const results = a.trigger('test', {});
  assert(results.length === 0, 'Should be unregistered');
});

test('listHooks', () => {
  const a = new Attention();
  a.register('hook1', () => {});
  a.register('hook2', () => {});
  const hooks = a.listHooks();
  assert(hooks.includes('hook1'), 'Should include hook1');
  assert(hooks.includes('hook2'), 'Should include hook2');
});

test('hasHooks', () => {
  const a = new Attention();
  assert(!a.hasHooks('test'), 'Should not have hooks');
  a.register('test', () => {});
  assert(a.hasHooks('test'), 'Should have hooks');
});

test('wildcard hooks', () => {
  const a = new Attention();
  a.register('*', (event, ctx) => `wildcard: ${event}`);
  const results = a.trigger('pre-write', {});
  assert(results.length === 1, 'Should fire wildcard');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
