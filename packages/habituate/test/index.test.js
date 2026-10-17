const Habit = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Habit Tests');

test('observe creates pattern', () => {
  const h = new Habit({ threshold: 3 });
  const p = h.observe('code_review', { type: 'review' });
  assert(p.count === 1, 'Should have count 1');
});

test('develops habit after threshold', () => {
  const h = new Habit({ threshold: 3 });
  h.observe('code_review', { type: 'review' });
  h.observe('code_review', { type: 'review' });
  const p = h.observe('code_review', { type: 'review' });
  assert(h.habits.length === 1, `Expected 1 habit, got ${h.habits.length}`);
});

test('no habit before threshold', () => {
  const h = new Habit({ threshold: 5 });
  h.observe('code_review', { type: 'review' });
  h.observe('code_review', { type: 'review' });
  assert(h.habits.length === 0, 'Should have no habits yet');
});

test('confidence increases with repetition', () => {
  const h = new Habit({ threshold: 3 });
  h.observe('action', { type: 'test' });
  h.observe('action', { type: 'test' });
  const p = h.observe('action', { type: 'test' });
  const habit = h.habits[0];
  assert(habit.confidence > 0.5, 'Confidence should increase');
});

test('getHabits returns habits', () => {
  const h = new Habit({ threshold: 2 });
  h.observe('commit', { type: 'git' });
  h.observe('commit', { type: 'git' });
  const habits = h.getHabits('on_request');
  assert(habits.length === 1, 'Should have 1 habit');
});

test('applyHabit returns application', () => {
  const h = new Habit({ threshold: 2 });
  h.observe('test', { type: 'test' });
  h.observe('test', { type: 'test' });
  const habit = h.habits[0];
  const result = h.applyHabit(habit, {});
  assert(result.applied === true, 'Should be applied');
  assert(result.confidence > 0, 'Should have confidence');
});

test('removeHabit', () => {
  const h = new Habit({ threshold: 2 });
  h.observe('test', { type: 'test' });
  h.observe('test', { type: 'test' });
  const name = h.habits[0].name;
  h.removeHabit(name);
  assert(h.habits.length === 0, 'Should be removed');
});

test('getStats', () => {
  const h = new Habit({ threshold: 2 });
  h.observe('a', { type: 'x' });
  h.observe('a', { type: 'x' });
  const stats = h.getStats();
  assert(stats.totalPatterns === 1, 'Should have 1 pattern');
  assert(stats.totalHabits === 1, 'Should have 1 habit');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
