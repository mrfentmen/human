// Hindsight — Failure learning for AI agents
// Learns from past mistakes to prevent recurrence

class Hindsight {
  constructor(options = {}) {
    this.entries = [];
    this.directory = options.directory || process.cwd();
    this.load();
  }

  load() {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(this.directory, '.hindsight');
    if (fs.existsSync(filePath)) {
      this.entries.push(...this.parse(fs.readFileSync(filePath, 'utf-8')));
    }
  }

  parse(content) {
    const lines = content.split('\n');
    const entries = [];
    let current = null;
    let currentKey = null;

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (!line.trim() || line.trim().startsWith('#')) continue;
      const trimmed = line.trim();

      if (trimmed.startsWith('hindsight ')) {
        if (current) entries.push(current);
        current = { name: trimmed.slice(9).trim(), rules: {} };
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

    if (current) entries.push(current);
    return entries;
  }

  recordFailure(what, why, lesson, prevention, trigger) {
    const entry = {
      name: `hindsight_${this.entries.length + 1}`,
      rules: {
        what: what.replace(/^"|"$/g, ''),
        why: why.replace(/^"|"$/g, ''),
        lesson: lesson.replace(/^"|"$/g, ''),
        prevention: prevention.replace(/^"|"$/g, ''),
        trigger: trigger || 'always'
      }
    };
    this.entries.push(entry);
    return entry;
  }

  check(context) {
    const results = [];
    for (const entry of this.entries) {
      const r = entry.rules;
      const trigger = r.trigger || 'always';
      if (trigger !== context.triggerType && trigger !== 'always') continue;

      results.push({
        name: entry.name,
        type: 'hindsight',
        what: r.what,
        why: r.why,
        lesson: r.lesson,
        prevention: r.prevention,
        message: `Hindsight: ${r.what}. Lesson: ${r.lesson}. Prevention: ${r.prevention}`
      });
    }
    return results;
  }

  getLessons() {
    return this.entries.map(e => ({
      name: e.name,
      lesson: e.rules.lesson,
      prevention: e.rules.prevention
    }));
  }
}

module.exports = Hindsight;
module.exports.Hindsight = Hindsight;
module.exports.default = Hindsight;
