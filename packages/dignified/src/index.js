// Dignity — Tone monitor for AI agents

class Dignity {
  constructor(options = {}) {
    this.threshold = options.threshold || 0.5;
  }

  evaluate(response) {
    const checks = [];
    let score = 10;
    const lower = response.toLowerCase();

    // Condescension
    const condescending = ['obviously', 'clearly', 'as I said', 'as I mentioned', 'you should know', 'simply', 'just'];
    const condescendingCount = condescending.filter(w => lower.includes(w)).length;
    if (condescendingCount > 0) {
      checks.push({ check: 'condescension', score: 10 - condescendingCount * 2, note: `Found ${condescendingCount} condescending phrases` });
      score -= condescendingCount * 2;
    } else {
      checks.push({ check: 'condescension', score: 10, note: 'No condescension' });
    }

    // Dismissiveness
    const dismissive = ['whatever', 'not my problem', 'figure it out', 'read the docs'];
    const dismissiveCount = dismissive.filter(w => lower.includes(w)).length;
    if (dismissiveCount > 0) {
      checks.push({ check: 'dismissiveness', score: 10 - dismissiveCount * 3, note: `Found ${dismissiveCount} dismissive phrases` });
      score -= dismissiveCount * 3;
    } else {
      checks.push({ check: 'dismissiveness', score: 10, note: 'No dismissiveness' });
    }

    // Blame
    const blame = ['you did', 'you failed', 'your fault', 'you should have'];
    const blameCount = blame.filter(w => lower.includes(w)).length;
    if (blameCount > 0) {
      checks.push({ check: 'blame', score: 10 - blameCount * 3, note: `Found ${blameCount} blaming phrases` });
      score -= blameCount * 3;
    } else {
      checks.push({ check: 'blame', score: 10, note: 'No blame' });
    }

    // Over-apology
    const apologies = (lower.match(/sorry|apologize|apologies/g) || []).length;
    if (apologies > 2) {
      checks.push({ check: 'over_apology', score: 7, note: 'Excessive apologizing' });
      score -= 1;
    } else {
      checks.push({ check: 'over_apology', score: 10, note: 'Appropriate apology level' });
    }

    // Honesty
    if (lower.includes("i don't know") || lower.includes("i'm not sure")) {
      checks.push({ check: 'honesty', score: 10, note: 'Honest about limitations' });
    } else {
      checks.push({ check: 'honesty', score: 8, note: 'No uncertainty acknowledged' });
    }

    score = Math.max(0, Math.min(10, score));
    const overall = Math.round(score * 10) / 10;

    return {
      score: overall,
      checks,
      verdict: overall >= 8 ? 'respectful' : overall >= 5 ? 'acceptable' : 'disrespectful',
      suggestions: overall < 8 ? ['Use more respectful language', 'Avoid condescending phrases'] : []
    };
  }
}

module.exports = Dignity;
module.exports.Dignity = Dignity;
module.exports.default = Dignity;
