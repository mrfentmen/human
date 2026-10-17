// Muscle Memory — Cached execution paths for AI agents

class MuscleMemory {
  constructor(options = {}) {
    this.patterns = new Map();
    this.maxPatterns = options.maxPatterns || 100;
  }

  cache(name, steps) {
    this.patterns.set(name, {
      name,
      steps: [...steps],
      successCount: 0,
      failureCount: 0,
      confidence: 0.5,
      created: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
      adaptations: []
    });
    this.prune();
    return this.patterns.get(name);
  }

  find(taskDescription) {
    const desc = taskDescription.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const [name, pattern] of this.patterns) {
      const nameWords = name.toLowerCase().split(/[_\s-]+/);
      const descWords = desc.split(/\s+/);
      let score = 0;
      for (const word of descWords) {
        if (nameWords.some(nw => nw.includes(word) || word.includes(nw))) {
          score++;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = pattern;
      }
    }

    return bestMatch && bestScore > 0 ? bestMatch : null;
  }

  recordSuccess(name) {
    const pattern = this.patterns.get(name);
    if (pattern) {
      pattern.successCount++;
      pattern.confidence = pattern.successCount / (pattern.successCount + pattern.failureCount);
      pattern.lastUsed = new Date().toISOString();
    }
  }

  recordFailure(name) {
    const pattern = this.patterns.get(name);
    if (pattern) {
      pattern.failureCount++;
      pattern.confidence = pattern.successCount / (pattern.successCount + pattern.failureCount);
    }
  }

  addAdaptation(name, adaptation) {
    const pattern = this.patterns.get(name);
    if (pattern) {
      pattern.adaptations.push(adaptation);
    }
  }

  prune() {
    if (this.patterns.size <= this.maxPatterns) return;
    // Remove lowest confidence patterns
    const sorted = [...this.patterns.entries()].sort((a, b) => a[1].confidence - b[1].confidence);
    const toRemove = sorted.slice(0, this.patterns.size - this.maxPatterns);
    for (const [name] of toRemove) {
      this.patterns.delete(name);
    }
  }

  getStats() {
    return {
      totalPatterns: this.patterns.size,
      avgConfidence: this.patterns.size > 0
        ? [...this.patterns.values()].reduce((sum, p) => sum + p.confidence, 0) / this.patterns.size
        : 0
    };
  }
}

module.exports = MuscleMemory;
module.exports.MuscleMemory = MuscleMemory;
module.exports.default = MuscleMemory;
