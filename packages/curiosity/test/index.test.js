const Curiosity = require('../src/index.js');
const fs = require('fs');
const path = require('path');
const os = require('os');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}: ${e.message}`); }
}

function assert(cond, msg) { if (!cond) throw new Error(msg); }

console.log('Curiosity Tests');

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'curiosity-'));
fs.writeFileSync(path.join(tmpDir, 'package.json'), JSON.stringify({ dependencies: { react: '18.0.0' }, devDependencies: { jest: '29.0.0' } }));
fs.writeFileSync(path.join(tmpDir, 'index.js'), 'console.log("hello")');
fs.mkdirSync(path.join(tmpDir, 'src'));
fs.writeFileSync(path.join(tmpDir, 'src', 'app.js'), 'module.exports = {}');
fs.writeFileSync(path.join(tmpDir, 'app.test.js'), 'test("x", () => {})');

test('scan discovers structure', () => {
  const c = new Curiosity();
  const knowledge = c.scan(tmpDir);
  assert(knowledge.structure['index.js'] === 'file', 'Should find index.js');
  assert(knowledge.structure['src'] !== undefined, 'Should find src dir');
});

test('scan discovers dependencies', () => {
  const c = new Curiosity();
  c.scan(tmpDir);
  assert(c.knowledge.dependencies.react === '18.0.0', 'Should find react');
});

test('scan discovers tests', () => {
  const c = new Curiosity();
  c.scan(tmpDir);
  assert(c.knowledge.tests.found === true, 'Should find tests');
});

test('scan discovers configs', () => {
  const c = new Curiosity();
  c.scan(tmpDir);
  assert(c.knowledge.configs.includes('package.json'), 'Should find package.json');
});

test('query structure', () => {
  const c = new Curiosity();
  c.scan(tmpDir);
  const result = c.query('what files are in the project?');
  assert(result.type === 'structure', 'Should return structure');
});

test('query dependencies', () => {
  const c = new Curiosity();
  c.scan(tmpDir);
  const result = c.query('what packages are installed?');
  assert(result.type === 'dependencies', 'Should return dependencies');
});

test('isScanned', () => {
  const c = new Curiosity();
  assert(c.isScanned() === false, 'Should not be scanned yet');
  c.scan(tmpDir);
  assert(c.isScanned() === true, 'Should be scanned');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
