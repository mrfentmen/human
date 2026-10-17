// Resilience — Adaptive retry system for AI agents
// Tries differently, not just again

class Resilience {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000;
    this.adaptations = options.adaptations || {};
  }

  async execute(fn, context = {}) {
    let lastError = null;
    let attempt = 0;
    const history = [];

    while (attempt < this.maxRetries) {
      attempt++;
      try {
        const result = await fn(context, attempt);
        return { success: true, result, attempts: attempt, history };
      } catch (error) {
        lastError = error;
        history.push({ attempt, error: error.message, context: { ...context } });

        // Analyze failure and adapt
        const adaptation = this.analyze(error, context, attempt);
        if (adaptation) {
          context = { ...context, ...adaptation.changes };
          history[history.length - 1].adaptation = adaptation;
        }

        // Wait before retry (exponential backoff)
        if (attempt < this.maxRetries) {
          await this.delay(this.baseDelay * Math.pow(2, attempt - 1));
        }
      }
    }

    return { success: false, error: lastError, attempts: attempt, history };
  }

  analyze(error, context, attempt) {
    const msg = (error.message || '').toLowerCase();
    const adaptations = this.adaptations;

    // Check for known failure patterns
    if (msg.includes('peer dependency') || msg.includes('peer dep')) {
      return { type: 'dependency', changes: { useLegacyPeerDeps: true }, suggestion: 'Try --legacy-peer-deps' };
    }
    if (msg.includes('permission denied') || msg.includes('eacces')) {
      return { type: 'permission', changes: { useSudo: true }, suggestion: 'Try with elevated permissions' };
    }
    if (msg.includes('timeout') || msg.includes('etimedout')) {
      return { type: 'timeout', changes: { timeout: (context.timeout || 30000) * 2 }, suggestion: 'Increase timeout' };
    }
    if (msg.includes('not found') || msg.includes('enoent')) {
      return { type: 'not_found', changes: { checkPath: true }, suggestion: 'Check if path exists' };
    }
    if (msg.includes('rate limit') || msg.includes('429')) {
      return { type: 'rate_limit', changes: { wait: 60000 }, suggestion: 'Wait for rate limit reset' };
    }
    if (msg.includes('conflict')) {
      return { type: 'conflict', changes: { force: true }, suggestion: 'Try force flag' };
    }

    // Check custom adaptations
    for (const [pattern, adaptation] of Object.entries(adaptations)) {
      if (msg.includes(pattern.toLowerCase())) {
        return adaptation;
      }
    }

    return null;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = Resilience;
module.exports.Resilience = Resilience;
module.exports.default = Resilience;
