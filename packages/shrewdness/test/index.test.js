const Wisdom = require('../src/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Wisdom Tests');

test('add entry', () => {
  const w = new Wisdom();
  const entry = w.add('auth', 'Use NextAuth.js', ['Set NEXTAUTH_SECRET'], ['nextjs', 'auth']);
  assert(entry.topic === 'auth', 'Wrong topic');
  assert(entry.judgment === 'Use NextAuth.js', 'Wrong judgment');
  assert(entry.lessons.length === 1, 'Should have 1 lesson');
});

test('query by topic', () => {
  const w = new Wisdom();
  w.add('auth', 'Use NextAuth.js', [], ['nextjs']);
  w.add('database', 'Use Prisma', [], ['prisma']);
  const results = w.query('auth');
  assert(results.length === 1, `Expected 1, got ${results.length}`);
  assert(results[0].topic === 'auth', 'Wrong topic');
});

test('query by tag', () => {
  const w = new Wisdom();
  w.add('auth', 'Use NextAuth.js', [], ['nextjs', 'security']);
  const results = w.query('security');
  assert(results.length === 1, 'Should find by tag');
});

test('update increases confidence', () => {
  const w = new Wisdom();
  const entry = w.add('test', 'test judgment', [], []);
  const updated = w.update(entry.id, { judgment: 'updated judgment' });
  assert(updated.confidence > 0.5, 'Confidence should increase');
  assert(updated.judgment === 'updated judgment', 'Should update judgment');
});

test('getTopics', () => {
  const w = new Wisdom();
  w.add('auth', 'a', [], []);
  w.add('database', 'b', [], []);
  w.add('auth', 'c', [], []);
  const topics = w.getTopics();
  assert(topics.length === 2, `Expected 2, got ${topics.length}`);
});

test('getStats', () => {
  const w = new Wisdom();
  w.add('a', 'b', [], []);
  const stats = w.getStats();
  assert(stats.totalEntries === 1, 'Should have 1 entry');
  assert(stats.topics === 1, 'Should have 1 topic');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
