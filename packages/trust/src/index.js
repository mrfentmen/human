// Trust — Reliability tracker for AI agents

class Trust {
  constructor(options = {}) {
    this.history = [];
    this.threshold = options.threshold || 0.7;
  }

  record(action, success, context = {}) {
    this.history.push({
      action,
      success,
      context,
      timestamp: new Date().toISOString()
    });
  }

  getReliability(actionType = null) {
    const relevant = actionType
      ? this.history.filter(h => h.action === actionType)
      : this.history;

    if (relevant.length === 0) return { rate: 0, count: 0, reliable: false };

    const successes = relevant.filter(h => h.success).length;
    const rate = successes / relevant.length;

    return {
      rate: Math.round(rate * 100) / 100,
      count: relevant.length,
      successes,
      failures: relevant.length - successes,
      reliable: rate >= this.threshold
    };
  }

  shouldTrust(actionType) {
    const reliability = this.getReliability(actionType);
    return reliability.reliable && reliability.count >= 3;
  }

  getReport() {
    const types = [...new Set(this.history.map(h => h.action))];
    const report = {};
    for (const type of types) {
      report[type] = this.getReliability(type);
    }
    return report;
  }
}

module.exports = Trust;
module.exports.Trust = Trust;
module.exports.default = Trust;
