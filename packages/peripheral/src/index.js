// Peripheral — Always-on context awareness for AI agents

class Peripheral {
  constructor(options = {}) {
    this.watchers = [];
    this.alerts = [];
    this.directory = options.directory || process.cwd();
    this.load();
  }

  load() {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(this.directory, '.peripheral');
    if (fs.existsSync(filePath)) {
      this.watchers.push(...this.parse(fs.readFileSync(filePath, 'utf-8')));
    }
  }

  parse(content) {
    const lines = content.split('\n');
    const watchers = [];
    let current = null;
    let currentKey = null;

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (!line.trim() || line.trim().startsWith('#')) continue;
      const trimmed = line.trim();

      if (trimmed.startsWith('peripheral ')) {
        if (current) watchers.push(current);
        current = { name: trimmed.slice(10).trim(), rules: {} };
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

    if (current) watchers.push(current);
    return watchers;
  }

  check(context) {
    const results = [];
    for (const watcher of this.watchers) {
      const r = watcher.rules;
      const watch = r.watch;
      const alert = (r.alert || '').replace(/^"|"$/g, '');
      const level = r.level || 'info';
      const trigger = r.trigger || 'always';

      // Check if trigger condition is met
      let triggered = false;
      if (trigger === 'always') triggered = true;
      else if (trigger === 'on_change') triggered = context.changed || false;
      else if (trigger === 'on_threshold') triggered = context.thresholdExceeded || false;

      if (triggered) {
        // Resolve alert template variables
        const resolvedAlert = alert.replace(/\{(\w+)\}/g, (_, key) => context[key] || '');
        results.push({
          name: watcher.name,
          type: 'peripheral',
          watch,
          level,
          alert: resolvedAlert,
          message: resolvedAlert
        });
      }
    }
    return results;
  }

  addWatcher(name, watch, alert, level = 'info', trigger = 'always') {
    this.watchers.push({
      name,
      rules: { watch, alert: `"${alert}"`, level, trigger }
    });
  }
}

module.exports = Peripheral;
module.exports.Peripheral = Peripheral;
module.exports.default = Peripheral;
