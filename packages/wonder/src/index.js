// Wonder — Novelty detector for AI agents

class Wonder {
  constructor(options = {}) {
    this.knownPatterns = new Set();
    this.interests = options.interests || [];
  }

  evaluate(finding, context = {}) {
    const isNovel = !this.knownPatterns.has(finding);
    const isAnomaly = context.isAnomaly || false;
    const isConnected = context.hasConnection || false;
    const isOpportunity = context.isOpportunity || false;
    const isRisk = context.isRisk || false;

    const types = [];
    if (isNovel) types.push('novel');
    if (isAnomaly) types.push('anomaly');
    if (isConnected) types.push('connection');
    if (isOpportunity) types.push('opportunity');
    if (isRisk) types.push('risk');

    const interesting = types.length > 0;

    if (interesting) {
      this.knownPatterns.add(finding);
    }

    return {
      finding,
      interesting,
      types,
      message: interesting ? `Interesting: ${finding} (${types.join(', ')})` : null
    };
  }

  getKnownCount() {
    return this.knownPatterns.size;
  }
}

module.exports = Wonder;
module.exports.Wonder = Wonder;
module.exports.default = Wonder;
