// Balance — Trade-off analyzer for AI agents

class Balance {
  constructor(options = {}) {
    this.dimensions = options.dimensions || ['speed', 'security', 'maintainability', 'cost', 'complexity', 'scalability'];
  }

  analyze(options) {
    const results = [];
    for (const option of options) {
      const scores = {};
      for (const dim of this.dimensions) {
        scores[dim] = option[dim] || 5;
      }
      const overall = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
      results.push({
        name: option.name,
        scores,
        overall: Math.round(overall * 10) / 10,
        tradeoffs: this.getTradeoffs(option, options)
      });
    }

    // Sort by overall score
    results.sort((a, b) => b.overall - a.overall);

    return {
      options: results,
      recommendation: results[0] ? results[0].name : null,
      comparison: this.compare(results)
    };
  }

  getTradeoffs(option, allOptions) {
    const tradeoffs = [];
    for (const other of allOptions) {
      if (other.name === option.name) continue;
      const pros = [];
      const cons = [];
      for (const dim of this.dimensions) {
        if ((option[dim] || 5) > (other[dim] || 5)) pros.push(dim);
        if ((option[dim] || 5) < (other[dim] || 5)) cons.push(dim);
      }
      if (pros.length > 0 || cons.length > 0) {
        tradeoffs.push({ vs: other.name, pros, cons });
      }
    }
    return tradeoffs;
  }

  compare(results) {
    if (results.length < 2) return null;
    const best = results[0];
    const second = results[1];
    return `${best.name} scores higher overall (${best.overall} vs ${second.overall})`;
  }
}

module.exports = Balance;
module.exports.Balance = Balance;
module.exports.default = Balance;
