// Courage — Strategy generator for AI agents

class Courage {
  constructor(options = {}) {
    this.maxStandardRetries = options.maxStandardRetries || 3;
    this.strategies = options.strategies || [
      'Try a completely different approach',
      'Use an alternative tool or library',
      'Simplify the problem first',
      'Break it into smaller sub-problems',
      'Look up documentation or examples',
      'Reverse the problem (solve the opposite)',
      'Combine two existing solutions',
      'Eliminate unnecessary steps',
      'Use a cached/known working solution',
      'Ask for human guidance'
    ];
  }

  generateAlternatives(failedApproach, count = 3) {
    const alternatives = [];
    const available = this.strategies.filter(s => s !== failedApproach);

    for (let i = 0; i < Math.min(count, available.length); i++) {
      alternatives.push({
        approach: available[i],
        novelty: Math.round((0.5 + Math.random() * 0.5) * 10) / 10,
        feasibility: Math.round((0.3 + Math.random() * 0.7) * 10) / 10,
        risk: Math.round(Math.random() * 10) / 10
      });
    }

    return alternatives.sort((a, b) => b.feasibility - a.feasibility);
  }

  shouldActivate(standardRetries) {
    return standardRetries >= this.maxStandardRetries;
  }

  addStrategy(strategy) {
    this.strategies.push(strategy);
  }
}

module.exports = Courage;
module.exports.Courage = Courage;
module.exports.default = Courage;
