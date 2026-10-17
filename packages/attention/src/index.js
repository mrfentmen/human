// Attention — Event-triggered hooks for AI agents

class Attention {
  constructor(options = {}) {
    this.hooks = {};
  }

  register(event, handler) {
    if (!this.hooks[event]) this.hooks[event] = [];
    this.hooks[event].push(handler);
  }

  trigger(event, context = {}) {
    const handlers = this.hooks[event] || [];
    const results = [];
    for (const handler of handlers) {
      try {
        results.push(handler(context));
      } catch (e) {
        results.push({ error: e.message });
      }
    }
    // Also trigger wildcard hooks
    const wildcardHandlers = this.hooks['*'] || [];
    for (const handler of wildcardHandlers) {
      try {
        results.push(handler(event, context));
      } catch (e) {
        results.push({ error: e.message });
      }
    }
    return results;
  }

  unregister(event, handler) {
    if (this.hooks[event]) {
      this.hooks[event] = this.hooks[event].filter(h => h !== handler);
    }
  }

  listHooks() {
    return Object.keys(this.hooks);
  }

  hasHooks(event) {
    return (this.hooks[event] && this.hooks[event].length > 0) || false;
  }
}

module.exports = Attention;
module.exports.Attention = Attention;
module.exports.default = Attention;
