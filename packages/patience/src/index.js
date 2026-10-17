// Patience — Action queue system for AI agents
// Holds actions until conditions are met

class PatienceQueue {
  constructor(options = {}) {
    this.queue = [];
    this.maxWait = options.maxWait || 30000;
  }

  enqueue(action, conditions, options = {}) {
    const item = {
      id: Date.now() + Math.random(),
      action,
      conditions,
      options,
      status: 'waiting',
      createdAt: Date.now(),
      timeout: options.timeout || this.maxWait
    };
    this.queue.push(item);
    return item.id;
  }

  check(item) {
    const now = Date.now();
    if (now - item.createdAt > item.timeout) {
      item.status = 'timeout';
      return false;
    }
    return item.conditions.every(cond => {
      if (typeof cond === 'function') return cond();
      if (cond === 'tests_pass') return item.context?.testsPass || false;
      if (cond === 'git_clean') return item.context?.gitClean || false;
      if (cond === 'user_confirmed') return item.context?.userConfirmed || false;
      if (cond === 'build_complete') return item.context?.buildComplete || false;
      return true;
    });
  }

  process(context) {
    const released = [];
    const remaining = [];
    for (const item of this.queue) {
      item.context = context;
      if (item.status === 'waiting') {
        if (this.check(item)) {
          item.status = 'released';
          released.push(item);
        } else if (item.status === 'timeout') {
          item.status = 'expired';
        } else {
          remaining.push(item);
        }
      } else {
        remaining.push(item);
      }
    }
    this.queue = remaining;
    return released;
  }

  cancel(id) {
    this.queue = this.queue.filter(item => item.id !== id);
  }

  getQueue() {
    return this.queue.filter(item => item.status === 'waiting');
  }

  clear() {
    this.queue = [];
  }
}

module.exports = PatienceQueue;
module.exports.PatienceQueue = PatienceQueue;
module.exports.default = PatienceQueue;
