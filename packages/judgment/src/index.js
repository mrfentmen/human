// Judgment — Multi-dimensional quality scorer for AI decisions

class Judgment {
  constructor(options = {}) {
    this.weights = options.weights || {
      correctness: 0.3,
      efficiency: 0.2,
      maintainability: 0.2,
      safety: 0.2,
      simplicity: 0.1
    };
    this.threshold = options.threshold || 6;
  }

  judge(solution, context = {}) {
    const scores = {
      correctness: 5,
      efficiency: 5,
      maintainability: 5,
      safety: 5,
      simplicity: 5
    };

    if (context.hasTests) scores.correctness += 2;
    if (context.isOptimized) scores.efficiency += 2;
    if (context.isDocumented) scores.maintainability += 2;
    if (context.hasErrorHandling) scores.safety += 2;
    if (context.isSimple) scores.simplicity += 2;
    if (context.hasTypeScript) scores.correctness += 1;
    if (context.noConsoleLog) scores.maintainability += 1;

    for (const key of Object.keys(scores)) {
      scores[key] = Math.min(10, Math.max(0, scores[key]));
    }

    const overall = Object.keys(this.weights).reduce((sum, key) => {
      return sum + scores[key] * this.weights[key];
    }, 0);

    const overallRounded = Math.round(overall * 10) / 10;

    return {
      scores,
      overall: overallRounded,
      verdict: overallRounded >= 8 ? 'excellent' : overallRounded >= this.threshold ? 'good' : overallRounded >= 4 ? 'acceptable' : 'needs_improvement',
      suggestions: this.getSuggestions(scores)
    };
  }

  getSuggestions(scores) {
    const suggestions = [];
    if (scores.correctness < 7) suggestions.push('Add tests to improve correctness');
    if (scores.efficiency < 7) suggestions.push('Consider performance optimization');
    if (scores.maintainability < 7) suggestions.push('Improve documentation and code structure');
    if (scores.safety < 7) suggestions.push('Add error handling');
    if (scores.simplicity < 7) suggestions.push('Simplify the solution');
    return suggestions;
  }
}

module.exports = Judgment;
module.exports.Judgment = Judgment;
module.exports.default = Judgment;
