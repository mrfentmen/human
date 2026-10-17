// Grace — Elegant error handling for AI agents

class Grace {
  constructor(options = {}) {
    this.fallbacks = options.fallbacks || {};
  }

  handle(error, context = {}) {
    const errorType = this.classify(error);

    switch (errorType) {
      case 'network':
        return { type: 'retry', message: 'Network error. Retrying with backoff.', fallback: 'cached' };
      case 'permission':
        return { type: 'alternative', message: 'Permission denied. Try alternative approach.', fallback: 'alternative' };
      case 'not_found':
        return { type: 'simplified', message: 'Resource not found. Simplifying request.', fallback: 'simplified' };
      case 'timeout':
        return { type: 'partial', message: 'Operation timed out. Returning partial results.', fallback: 'partial_result' };
      case 'rate_limit':
        return { type: 'wait', message: 'Rate limited. Waiting before retry.', fallback: 'cached' };
      default:
        return { type: 'human_handoff', message: 'Unexpected error. Manual intervention may be needed.', fallback: 'human_handoff' };
    }
  }

  classify(error) {
    const msg = (error.message || error || '').toLowerCase();
    if (msg.includes('network') || msg.includes('econnrefused') || msg.includes('fetch')) return 'network';
    if (msg.includes('permission') || msg.includes('eacces') || msg.includes('403')) return 'permission';
    if (msg.includes('not found') || msg.includes('404') || msg.includes('enoent')) return 'not_found';
    if (msg.includes('timeout') || msg.includes('etimedout')) return 'timeout';
    if (msg.includes('rate limit') || msg.includes('429')) return 'rate_limit';
    return 'unknown';
  }

  getFallback(type, context = {}) {
    if (this.fallbacks[type]) return this.fallbacks[type](context);
    const defaults = {
      partial_result: { result: context.lastResult || null, note: 'Partial result returned' },
      alternative: { suggestion: 'Try a different approach' },
      simplified: { suggestion: 'Simplify the request' },
      cached: { result: context.cachedResult || null, note: 'Using cached result' },
      human_handoff: { suggestion: 'Manual intervention required' }
    };
    return defaults[type] || { note: 'No fallback available' };
  }
}

module.exports = Grace;
module.exports.Grace = Grace;
module.exports.default = Grace;
