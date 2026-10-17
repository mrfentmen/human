// Foresight — Consequence simulator for AI agents

class Foresight {
  constructor(options = {}) {
    this.riskThreshold = options.riskThreshold || 50;
  }

  simulate(action, context = {}) {
    const impacts = [];
    let risk = 0;

    if (action.includes('delete') || action.includes('drop') || action.includes('remove') || action.includes('truncate')) {
      impacts.push({ type: 'irreversible', severity: 'high', description: 'This action cannot be undone' });
      risk += 30;
    }
    if (action.includes('deploy') || action.includes('publish')) {
      impacts.push({ type: 'production', severity: 'high', description: 'This will affect production' });
      risk += 20;
    }
    if (context.affectedFiles && context.affectedFiles > 5) {
      impacts.push({ type: 'wide_impact', severity: 'medium', description: `Affects ${context.affectedFiles} files` });
      risk += 15;
    }
    if (context.affectedUsers && context.affectedUsers > 10) {
      impacts.push({ type: 'user_impact', severity: 'high', description: `Affects ${context.affectedUsers} users` });
      risk += 20;
    }
    if (action.includes('install') || action.includes('upgrade')) {
      impacts.push({ type: 'dependency', severity: 'medium', description: 'May affect dependencies' });
      risk += 10;
    }

    risk = Math.min(100, risk);

    return {
      action,
      impacts,
      riskScore: risk,
      recommendation: risk > 50 ? 'High risk. Review carefully before proceeding.' : risk > 20 ? 'Moderate risk. Proceed with caution.' : 'Low risk. Safe to proceed.'
    };
  }
}

module.exports = Foresight;
module.exports.Foresight = Foresight;
module.exports.default = Foresight;
