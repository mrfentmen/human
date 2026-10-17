// Reflex — Pre-action verification for AI agents
// Usage: const reflex = require('ai-reflex'); reflex.check(action, context);

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class Reflex {
  constructor(options = {}) {
    this.rules = [];
    this.directory = options.directory || process.cwd();
    this.globalPath = options.globalPath || path.join(process.env.HOME || '', '.reflex');
    this.load();
  }

  load() {
    this.rules = [];
    // Load global
    if (fs.existsSync(this.globalPath)) {
      this.rules.push(...this.parse(fs.readFileSync(this.globalPath, 'utf-8')));
    }
    // Load project
    const projectPath = path.join(this.directory, '.reflex');
    if (fs.existsSync(projectPath)) {
      this.rules.push(...this.parse(fs.readFileSync(projectPath, 'utf-8')));
    }
    // Load from .reflex.d
    const dirPath = path.join(this.directory, '.reflex.d');
    if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.reflex'));
      for (const file of files) {
        this.rules.push(...this.parse(fs.readFileSync(path.join(dirPath, file), 'utf-8')));
      }
    }
  }

  parse(content) {
    const lines = content.split('\n');
    const reflexes = [];
    let current = null;
    let currentKey = null;

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      if (!line.trim() || line.trim().startsWith('#')) continue;
      const trimmed = line.trim();

      if (trimmed.startsWith('reflex ')) {
        if (current) reflexes.push(current);
        current = { name: trimmed.slice(7).trim(), rules: {} };
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

    if (current) reflexes.push(current);
    return reflexes;
  }

  check(context) {
    const results = [];
    for (const reflex of this.rules) {
      const r = reflex.rules;
      const trigger = r.trigger;
      const check = r.check;
      const condition = r.condition;
      const onPass = r.on_pass || 'allow';
      const onFail = r.on_fail || 'allow';
      const message = r.message || '';

      // Check trigger
      if (trigger && trigger !== context.triggerType && trigger !== 'always') {
        continue;
      }

      // Check condition
      if (condition) {
        const parts = condition.split(/\s+/);
        if (parts[1] === 'is' && context.action !== parts[2]) continue;
        if (parts[1] === 'matches') {
          const pattern = parts[2].replace(/\*/g, '.*');
          if (!new RegExp('^' + pattern + '$').test(context.target || '')) continue;
        }
      }

      // Run check
      let checkResult = this.runCheck(check, context);

      const action = checkResult ? onPass : onFail;
      results.push({
        name: reflex.name,
        check,
        result: checkResult,
        action,
        message: message.replace(/^"|"$/g, '')
      });

      if (action === 'block') break;
    }
    return results;
  }

  runCheck(check, context) {
    switch (check) {
      case 'file_exists': return context.fileExists || false;
      case 'file_not_exists': return !context.fileExists;
      case 'has_tests': return context.hasTests || false;
      case 'tests_pass': return context.testsPass || false;
      case 'git_clean': return context.gitClean || false;
      case 'no_secrets': return !context.hasSecrets;
      case 'rate_limit': return !context.rateLimitExceeded;
      case 'backup_exists': return context.hasBackup || false;
      case 'user_confirmed': return context.userConfirmed || false;
      default:
        if (check.startsWith('custom ')) {
          const cmdMatch = check.match(/"([^"]*)"/);
          if (cmdMatch) {
            try {
              execSync(cmdMatch[1], { stdio: 'pipe' });
              return true;
            } catch (e) {
              return false;
            }
          }
        }
        return true;
    }
  }

  // Convenience methods
  beforeAction(action, target, extra = {}) {
    return this.check({
      triggerType: 'before_action',
      action,
      target,
      ...extra
    });
  }

  beforeCommit(extra = {}) {
    return this.check({
      triggerType: 'before_commit',
      action: 'commit',
      ...extra
    });
  }

  beforeDeploy(extra = {}) {
    return this.check({
      triggerType: 'before_deploy',
      action: 'deploy',
      ...extra
    });
  }
}

module.exports = Reflex;
module.exports.Reflex = Reflex;
module.exports.default = Reflex;
