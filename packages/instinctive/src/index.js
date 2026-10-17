// Instinct — Fast pattern matching for AI agents
// Gut feelings without full reasoning

class Instinct {
  constructor(options = {}) {
    this.instincts = [];
    this.directory = options.directory || process.cwd();
    this.load();
  }

  load() {
    this.instincts = [];
    const fs = require('fs');
    const path = require('path');

    // Load global
    const globalPath = path.join(process.env.HOME || '', '.instinct');
    if (fs.existsSync(globalPath)) {
      this.instincts.push(...this.parse(fs.readFileSync(globalPath, 'utf-8')));
    }

    // Load project
    const projectPath = path.join(this.directory, '.instinct');
    if (fs.existsSync(projectPath)) {
      this.instincts.push(...this.parse(fs.readFileSync(projectPath, 'utf-8')));
    }

    // Load from .instinct.d
    const dirPath = path.join(this.directory, '.instinct.d');
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.instinct'));
      for (const file of files) {
        this.instincts.push(...this.parse(fs.readFileSync(path.join(dirPath, file), 'utf-8')));
      }
    }
  }

  parse(content) {
    const lines = content.split('\n');
    const instincts = [];
    let current = null;
    let currentKey = null;

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (!line.trim() || line.trim().startsWith('#')) continue;
      const trimmed = line.trim();

      if (trimmed.startsWith('instinct ')) {
        if (current) instincts.push(current);
        current = { name: trimmed.slice(8).trim(), rules: {} };
        currentKey = null;
        continue;
      }

      if (current && /^\s+\w+:/.test(rawLine)) {
        const colonIdx = trimmed.indexOf(':');
        const key = trimmed.slice(0, colonIdx).trim();
        const value = trimmed.slice(colonIdx + 1).trim();
        current.rules[key] = value;
        currentKey = key;
        continue;
      }

      if (current && currentKey && /^\s+/.test(rawLine) && !trimmed.includes(':')) {
        current.rules[currentKey] += ' ' + trimmed;
        continue;
      }
    }

    if (current) instincts.push(current);
    return instincts;
  }

  check(context) {
    const results = [];
    const text = context.text || context.code || context.command || '';

    for (const instinct of this.instincts) {
      const r = instinct.rules;
      const pattern = r.pattern || '';
      const response = r.response || 'flag';
      const confidence = parseFloat(r.confidence || '0.9');
      const message = (r.message || '').replace(/^"|"$/g, '');

      let matched = false;

      if (pattern.startsWith('contains ')) {
        const term = pattern.slice(9).replace(/"/g, '').toLowerCase();
        matched = text.toLowerCase().includes(term);
      } else if (pattern.startsWith('matches ')) {
        const regexStr = pattern.slice(8).replace(/^"|"$/g, '');
        try {
          matched = new RegExp(regexStr).test(text);
        } catch (e) {
          matched = false;
        }
      } else if (pattern.startsWith('starts_with ')) {
        const term = pattern.slice(12).replace(/^"|"$/g, '').toLowerCase();
        matched = text.toLowerCase().startsWith(term);
      } else if (pattern.startsWith('ends_with ')) {
        const term = pattern.slice(10).replace(/^"|"$/g, '').toLowerCase();
        matched = text.toLowerCase().endsWith(term);
      } else if (pattern.startsWith('equals ')) {
        const term = pattern.slice(7).replace(/^"|"$/g, '');
        matched = text === term;
      }

      if (matched) {
        results.push({
          name: instinct.name,
          pattern,
          response,
          confidence,
          message
        });

        if (response === 'block') break;
      }
    }

    return results;
  }
}

module.exports = Instinct;
module.exports.Instinct = Instinct;
module.exports.default = Instinct;
