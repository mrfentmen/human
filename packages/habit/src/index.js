// Habit — Automatic behaviors for AI agents
// Develops through repetition

class Habit {
  constructor(options = {}) {
    this.habits = [];
    this.patterns = new Map();
    this.threshold = options.threshold || 3;
  }

  observe(action, context = {}) {
    const key = this.patternKey(action, context);
    if (!this.patterns.has(key)) {
      this.patterns.set(key, { count: 0, actions: [], context: {} });
    }
    const pattern = this.patterns.get(key);
    pattern.count++;
    pattern.actions.push(action);
    pattern.context = { ...pattern.context, ...context };

    if (pattern.count >= this.threshold && !this.hasHabit(key)) {
      this.createHabit(key, pattern);
    }

    return pattern;
  }

  patternKey(action, context) {
    return `${action}:${JSON.stringify(context)}`;
  }

  hasHabit(key) {
    return this.habits.some(h => h.key === key);
  }

  createHabit(key, pattern) {
    const habit = {
      key,
      name: `habit_${this.habits.length + 1}`,
      trigger: 'on_request',
      behavior: `Repeat: ${pattern.actions[0]}`,
      developedAfter: pattern.count,
      confidence: Math.min(0.99, 0.5 + (pattern.count * 0.1)),
      created: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    };
    this.habits.push(habit);
    return habit;
  }

  getHabits(trigger) {
    return this.habits.filter(h => h.trigger === trigger || h.trigger === 'always' || h.trigger === 'on_request');
  }

  applyHabit(habit, context) {
    habit.lastUsed = new Date().toISOString();
    return {
      habit: habit.name,
      behavior: habit.behavior,
      confidence: habit.confidence,
      applied: true
    };
  }

  removeHabit(name) {
    this.habits = this.habits.filter(h => h.name !== name);
  }

  getStats() {
    return {
      totalPatterns: this.patterns.size,
      totalHabits: this.habits.length,
      avgConfidence: this.habits.length > 0
        ? this.habits.reduce((sum, h) => sum + h.confidence, 0) / this.habits.length
        : 0
    };
  }
}

module.exports = Habit;
module.exports.Habit = Habit;
module.exports.default = Habit;
