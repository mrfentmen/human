// Conscience — Ethical evaluation for AI agents

class Conscience {
  constructor(options = {}) {
    this.thresholds = options.thresholds || { allow: 7, warn: 4 };
  }

  evaluate(action, context = {}) {
    const checks = [];
    let score = 10;

    // Reversibility
    if (/delete|drop|remove|truncate/i.test(action)) {
      checks.push({ criterion: 'reversibility', score: 3, note: 'Irreversible action' });
      score -= 3;
    } else {
      checks.push({ criterion: 'reversibility', score: 10, note: 'Reversible action' });
    }

    // Impact scope
    if (context.affectedUsers && context.affectedUsers > 100) {
      checks.push({ criterion: 'impact_scope', score: 4, note: `Affects ${context.affectedUsers} users` });
      score -= 2;
    } else {
      checks.push({ criterion: 'impact_scope', score: 10, note: 'Limited impact' });
    }

    // Data sensitivity
    if (context.involvesPersonalData) {
      checks.push({ criterion: 'data_sensitivity', score: 5, note: 'Involves personal data' });
      score -= 1;
    } else {
      checks.push({ criterion: 'data_sensitivity', score: 10, note: 'No sensitive data' });
    }

    // Consent
    if (!context.userConsented) {
      checks.push({ criterion: 'consent', score: 2, note: 'No explicit consent' });
      score -= 3;
    } else {
      checks.push({ criterion: 'consent', score: 10, note: 'User consented' });
    }

    // Proportionality
    if (context.disproportionate) {
      checks.push({ criterion: 'proportionality', score: 3, note: 'Action disproportionate to need' });
      score -= 2;
    } else {
      checks.push({ criterion: 'proportionality', score: 10, note: 'Proportional action' });
    }

    score = Math.max(0, score);

    let verdict;
    if (score >= this.thresholds.allow) verdict = 'allow';
    else if (score >= this.thresholds.warn) verdict = 'warn';
    else verdict = 'block';

    const message = verdict === 'allow'
      ? 'Action appears ethical'
      : verdict === 'warn'
      ? 'Action is questionable. Consider alternatives.'
      : 'Action may be unethical. Blocked.';

    return { score, checks, verdict, message };
  }
}

module.exports = Conscience;
module.exports.Conscience = Conscience;
module.exports.default = Conscience;
