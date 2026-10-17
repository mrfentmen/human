// Imagination — Alternative generator for AI agents

class Imagination {
  constructor(options = {}) {
    this.approaches = options.approaches || [
      'Try a different approach',
      'Simplify the problem',
      'Break it into smaller parts',
      'Use a different tool or library',
      'Ask for help or look up documentation',
      'Reverse the problem (solve the opposite)',
      'Use a cached solution',
      'Combine existing solutions',
      'Automate the repetitive parts',
      'Eliminate unnecessary steps'
    ];
  }

  imagine(problem, count = 5) {
    const alternatives = [];
    const selected = this.approaches.slice(0, Math.min(count, this.approaches.length));

    for (let i = 0; i < selected.length; i++) {
      alternatives.push({
        approach: selected[i],
        novelty: Math.round((Math.random() * 0.5 + 0.5) * 10) / 10,
        feasibility: Math.round((Math.random() * 0.5 + 0.5) * 10) / 10,
        risk: Math.round(Math.random() * 10) / 10
      });
    }

    return alternatives;
  }

  addApproach(approach) {
    this.approaches.push(approach);
  }

  getApproaches() {
    return [...this.approaches];
  }
}

module.exports = Imagination;
module.exports.Imagination = Imagination;
module.exports.default = Imagination;
