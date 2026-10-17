// Humility — Confidence gate for AI agents

class Humility {
  constructor(options = {}) {
    this.thresholds = options.thresholds || { high: 0.8, medium: 0.5 };
  }

  evaluate(response, context = {}) {
    const signals = [];
    let confidence = 1.0;

    // Knowledge gap
    if (context.noTrainingData) {
      signals.push({ type: 'knowledge_gap', severity: 'high' });
      confidence -= 0.4;
    }

    // Contradiction
    if (context.contradiction) {
      signals.push({ type: 'contradiction', severity: 'high' });
      confidence -= 0.3;
    }

    // Novel situation
    if (context.novelSituation) {
      signals.push({ type: 'novel_situation', severity: 'medium' });
      confidence -= 0.2;
    }

    // Ambiguity
    if (context.ambiguous) {
      signals.push({ type: 'ambiguity', severity: 'medium' });
      confidence -= 0.15;
    }

    // Stale knowledge
    if (context.possiblyOutdated) {
      signals.push({ type: 'stale_knowledge', severity: 'low' });
      confidence -= 0.1;
    }

    confidence = Math.max(0, Math.min(1, confidence));

    let verdict;
    if (confidence >= this.thresholds.high) verdict = 'confident';
    else if (confidence >= this.thresholds.medium) verdict = 'uncertain';
    else verdict = 'unknown';

    const message = verdict === 'confident'
      ? response
      : verdict === 'uncertain'
      ? `I'm not entirely sure, but: ${response}. Please verify.`
      : `I don't know this. ${response ? 'Here is what I can try instead: ' + response : 'I cannot answer this question.'}`;

    return { confidence, signals, verdict, message };
  }
}

module.exports = Humility;
module.exports.Humility = Humility;
module.exports.default = Humility;
