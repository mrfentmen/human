// Discipline — Quality linter for AI output
// Enforces coding standards and best practices

class Discipline {
  constructor(options = {}) {
    this.rules = options.rules || this.defaultRules();
  }

  defaultRules() {
    return [
      { name: 'no_var', pattern: /\bvar\s+\w/, message: "Use 'let' or 'const' instead of 'var'", severity: 'error' },
      { name: 'no_console_log', pattern: /console\.log\(/, message: "Remove console.log before committing", severity: 'warning' },
      { name: 'has_error_handling', check: (code) => /try\s*\{/.test(code) || /catch\s*\(/.test(code), message: "Missing error handling", severity: 'warning', appliesTo: 'function' },
      { name: 'no_eval', pattern: /\beval\(/, message: "Avoid eval() — security risk", severity: 'error' },
      { name: 'no_any_type', pattern: /:\s*any\b/, message: "Avoid 'any' type in TypeScript", severity: 'warning' },
      { name: 'has_return', check: (code) => /function\s+\w+/.test(code) ? /return/.test(code) : true, message: "Function missing return statement", severity: 'warning', appliesTo: 'function' },
    ];
  }

  lint(code, options = {}) {
    const violations = [];
    const lines = code.split('\n');

    for (const rule of this.rules) {
      if (rule.pattern) {
        const matches = code.match(new RegExp(rule.pattern, 'g'));
        if (matches) {
          violations.push({
            rule: rule.name,
            message: rule.message,
            severity: rule.severity,
            count: matches.length
          });
        }
      }

      if (rule.check && (!rule.appliesTo || this.applies(rule, code))) {
        if (!rule.check(code)) {
          violations.push({
            rule: rule.name,
            message: rule.message,
            severity: rule.severity,
            count: 1
          });
        }
      }
    }

    const errors = violations.filter(v => v.severity === 'error');
    const warnings = violations.filter(v => v.severity === 'warning');

    return {
      passed: errors.length === 0,
      violations,
      errors: errors.length,
      warnings: warnings.length,
      score: Math.max(0, 10 - (errors.length * 3) - (warnings.length * 1))
    };
  }

  applies(rule, code) {
    if (rule.appliesTo === 'function') {
      return /function\s+\w+/.test(code) || /=>\s*\{/.test(code);
    }
    return true;
  }

  addRule(rule) {
    this.rules.push(rule);
  }

  removeRule(name) {
    this.rules = this.rules.filter(r => r.name !== name);
  }
}

module.exports = Discipline;
module.exports.Discipline = Discipline;
module.exports.default = Discipline;
