// Curiosity — Background exploration daemon for AI agents

class Curiosity {
  constructor(options = {}) {
    this.knowledge = {
      structure: {},
      dependencies: {},
      tests: {},
      routes: [],
      patterns: []
    };
    this.scanned = false;
  }

  scan(projectPath) {
    const fs = require('fs');
    const path = require('path');

    // Scan directory structure
    this.knowledge.structure = this.scanDirectory(projectPath);

    // Check for package.json
    const pkgPath = path.join(projectPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        this.knowledge.dependencies = pkg.dependencies || {};
        this.knowledge.devDependencies = pkg.devDependencies || {};
      } catch (e) {}
    }

    // Check for tests
    this.knowledge.tests = this.findTests(projectPath);

    // Check for common config files
    this.knowledge.configs = this.findConfigs(projectPath);

    this.scanned = true;
    return this.knowledge;
  }

  scanDirectory(dir, depth = 0, maxDepth = 3) {
    if (depth > maxDepth) return {};
    const fs = require('fs');
    const path = require('path');
    const result = {};

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        if (entry.isDirectory()) {
          result[entry.name] = this.scanDirectory(path.join(dir, entry.name), depth + 1, maxDepth);
        } else {
          result[entry.name] = 'file';
        }
      }
    } catch (e) {}

    return result;
  }

  findTests(dir) {
    const fs = require('fs');
    const path = require('path');
    const tests = { found: false, files: [], coverage: 0 };

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true, recursive: true });
      for (const entry of entries) {
        if (entry.name && (entry.name.includes('.test.') || entry.name.includes('.spec.') || entry.name.includes('__tests__'))) {
          tests.found = true;
          tests.files.push(entry.name);
        }
      }
    } catch (e) {}

    return tests;
  }

  findConfigs(dir) {
    const fs = require('fs');
    const path = require('path');
    const configs = [];
    const configFiles = ['package.json', 'tsconfig.json', '.env', 'next.config.js', 'next.config.ts', 'vite.config.js', 'webpack.config.js'];

    for (const file of configFiles) {
      if (fs.existsSync(path.join(dir, file))) {
        configs.push(file);
      }
    }
    return configs;
  }

  query(question) {
    const q = question.toLowerCase();
    if (q.includes('structure') || q.includes('files')) {
      return { type: 'structure', data: this.knowledge.structure };
    }
    if (q.includes('dependencies') || q.includes('packages')) {
      return { type: 'dependencies', data: this.knowledge.dependencies };
    }
    if (q.includes('tests') || q.includes('coverage')) {
      return { type: 'tests', data: this.knowledge.tests };
    }
    if (q.includes('config')) {
      return { type: 'configs', data: this.knowledge.configs };
    }
    return { type: 'unknown', data: this.knowledge };
  }

  isScanned() {
    return this.scanned;
  }
}

module.exports = Curiosity;
module.exports.Curiosity = Curiosity;
module.exports.default = Curiosity;
