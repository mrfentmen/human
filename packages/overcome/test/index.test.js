const Resilience = require('../src/index.js');

let passed = 0;
let failed = 0;

function assert(cond, msg) { if (!cond) throw new Error(msg); }

async function runTests() {
  console.log('Resilience Tests');

  // succeeds on first try
  try {
    const r = new Resilience({ maxRetries: 3, baseDelay: 10 });
    const result = await r.execute(async (ctx, attempt) => 'success');
    assert(result.success === true, 'Should succeed');
    assert(result.attempts === 1, 'Should succeed on first try');
    console.log('  ✓ succeeds on first try');
    passed++;
  } catch (e) { failed++; console.log(`  ✗ succeeds on first try: ${e.message}`); }

  // retries on failure
  try {
    const r = new Resilience({ maxRetries: 3, baseDelay: 10 });
    let attempts = 0;
    const result = await r.execute(async (ctx, attempt) => {
      attempts++;
      if (attempts < 3) throw new Error('not yet');
      return 'success after retries';
    });
    assert(result.success === true, 'Should succeed after retries');
    assert(result.attempts === 3, `Expected 3 attempts, got ${result.attempts}`);
    console.log('  ✓ retries on failure');
    passed++;
  } catch (e) { failed++; console.log(`  ✗ retries on failure: ${e.message}`); }

  // fails after max retries
  try {
    const r = new Resilience({ maxRetries: 2, baseDelay: 10 });
    const result = await r.execute(async (ctx, attempt) => { throw new Error('always fails'); });
    assert(result.success === false, 'Should fail');
    assert(result.attempts === 2, `Expected 2 attempts, got ${result.attempts}`);
    console.log('  ✓ fails after max retries');
    passed++;
  } catch (e) { failed++; console.log(`  ✗ fails after max retries: ${e.message}`); }

  // analyzes peer dependency error
  try {
    const r = new Resilience({ maxRetries: 2, baseDelay: 10 });
    const result = await r.execute(async (ctx, attempt) => {
      if (attempt === 1) throw new Error('peer dependency conflict');
      return 'success';
    });
    assert(result.success === true, 'Should succeed');
    assert(result.history[0].adaptation.type === 'dependency', 'Should detect peer dep');
    console.log('  ✓ analyzes peer dependency error');
    passed++;
  } catch (e) { failed++; console.log(`  ✗ analyzes peer dependency error: ${e.message}`); }

  // analyzes timeout error
  try {
    const r = new Resilience({ maxRetries: 2, baseDelay: 10 });
    const result = await r.execute(async (ctx, attempt) => {
      if (attempt === 1) throw new Error('request timeout');
      return 'success';
    });
    assert(result.success === true, 'Should succeed');
    assert(result.history[0].adaptation.type === 'timeout', 'Should detect timeout');
    console.log('  ✓ analyzes timeout error');
    passed++;
  } catch (e) { failed++; console.log(`  ✗ analyzes timeout error: ${e.message}`); }

  // custom adaptations
  try {
    const r = new Resilience({ maxRetries: 2, baseDelay: 10, adaptations: { 'custom error': { type: 'custom', changes: { fixed: true }, suggestion: 'Fixed' } } });
    const result = await r.execute(async (ctx, attempt) => {
      if (attempt === 1) throw new Error('custom error occurred');
      return 'success';
    });
    assert(result.success === true, 'Should succeed');
    assert(result.history[0].adaptation.type === 'custom', 'Should detect custom');
    console.log('  ✓ custom adaptations');
    passed++;
  } catch (e) { failed++; console.log(`  ✗ custom adaptations: ${e.message}`); }

  // tracks history
  try {
    const r = new Resilience({ maxRetries: 3, baseDelay: 10 });
    const result = await r.execute(async (ctx, attempt) => {
      if (attempt < 3) throw new Error(`fail ${attempt}`);
      return 'success';
    });
    assert(result.history.length === 2, `Expected 2 history entries, got ${result.history.length}`);
    console.log('  ✓ tracks history');
    passed++;
  } catch (e) { failed++; console.log(`  ✗ tracks history: ${e.message}`); }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
