// Flow — Performance state monitor for AI agents

class Flow {
  constructor(options = {}) {
    this.metrics = {
      responseQuality: [],
      responseTime: [],
      errorRate: [],
      userSatisfaction: [],
      tokenEfficiency: []
    };
    this.threshold = options.threshold || 0.7;
  }

  record(metric, value) {
    if (this.metrics[metric]) {
      this.metrics[metric].push({ value, timestamp: Date.now() });
      // Keep last 100 entries
      if (this.metrics[metric].length > 100) {
        this.metrics[metric].shift();
      }
    }
  }

  getState() {
    const avg = (arr) => arr.length > 0 ? arr.reduce((s, e) => s + e.value, 0) / arr.length : 0.5;

    const quality = avg(this.metrics.responseQuality);
    const speed = avg(this.metrics.responseTime);
    const errors = avg(this.metrics.errorRate);
    const satisfaction = avg(this.metrics.userSatisfaction);
    const efficiency = avg(this.metrics.tokenEfficiency);

    const overall = (quality + (1 - errors) + satisfaction + efficiency) / 4;

    let state;
    let adjustments = [];

    if (overall >= this.threshold) {
      state = 'flow';
    } else if (overall >= this.threshold - 0.2) {
      state = 'good';
    } else if (overall >= this.threshold - 0.4) {
      state = 'degraded';
      adjustments.push('Consider shorter context');
      adjustments.push('Simplify approach');
    } else {
      state = 'poor';
      adjustments.push('Reset session');
      adjustments.push('Reduce complexity');
    }

    if (speed < 0.3) {
      adjustments.push('Responses are slow. Consider caching.');
    }

    return {
      state,
      overall: Math.round(overall * 100) / 100,
      metrics: { quality, speed, errors, satisfaction, efficiency },
      adjustments,
      inFlow: state === 'flow'
    };
  }

  reset() {
    for (const key of Object.keys(this.metrics)) {
      this.metrics[key] = [];
    }
  }
}

module.exports = Flow;
module.exports.Flow = Flow;
module.exports.default = Flow;
