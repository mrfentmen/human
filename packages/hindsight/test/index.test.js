const Hindsight = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Hindsight Tests');

test('record failure', () => {
  const h = new Hindsight({ directory: '/tmp' });
  const entry = h.recordFailure('deployed without tests', 'skipped tests', 'always run tests', 'block deploy if no tests', 'before_deploy');
  assert(entry.name === 'hindsight_1', 'Wrong name');
  assert(entry.rules.lesson === 'always run tests', 'Wrong lesson');
});

test('check returns entries', () => {
  const h = new Hindsight({ directory: '/tmp' });
  h.recordFailure('broke api', 'no callers check', 'check callers first', 'warn on signature change', 'before_action');
  const results = h.check({ triggerType: 'before_action' });
  assert(results.length === 1, `Expected 1, got ${results.length}`);
  assert(results[0].name === 'hindsight_1', 'Wrong name');
});

test('trigger filtering', () => {
  const h = new Hindsight({ directory: '/tmp' });
  h.recordFailure('test', 'test', 'test', 'test', 'before_commit');
  const results = h.check({ triggerType: 'before_action' });
  assert(results.length === 0, 'Should not fire for different trigger');
});

test('getLessons', () => {
  const h = new Hindsight({ directory: '/tmp' });
  h.recordFailure('a', 'b', 'lesson1', 'prev1', 'always');
  h.recordFailure('c', 'd', 'lesson2', 'prev2', 'always');
  const lessons = h.getLessons();
  assert(lessons.length === 2, 'Should have 2 lessons');
  assert(lessons[0].lesson === 'lesson1', 'Wrong lesson');
});

test('parse hindsight file', () => {
  const h = new Hindsight({ directory: '/tmp' });
  const content = `hindsight test\n  what: something broke\n  why: reason\n  lesson: learned\n  prevention: prevent\n  trigger: always`;
  const parsed = h.parse(content);
  assert(parsed.length === 1, `Expected 1, got ${parsed.length}`);
  assert(parsed[0].rules.what === 'something broke', 'Wrong what');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
