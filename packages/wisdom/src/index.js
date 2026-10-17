// Wisdom — Distilled judgment database for AI agents

class Wisdom {
  constructor(options = {}) {
    this.entries = [];
  }

  add(topic, judgment, lessons = [], tags = []) {
    this.entries.push({
      id: Date.now() + Math.random(),
      topic,
      judgment,
      lessons: [...lessons],
      tags: [...tags],
      confidence: 0.5,
      sourceCount: 1,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    });
    return this.entries[this.entries.length - 1];
  }

  query(topic) {
    const q = topic.toLowerCase();
    return this.entries
      .filter(w => w.topic.toLowerCase().includes(q) || w.tags.some(t => t.toLowerCase().includes(q)))
      .sort((a, b) => b.confidence - a.confidence);
  }

  update(id, updates) {
    const entry = this.entries.find(e => e.id === id);
    if (entry) {
      Object.assign(entry, updates);
      entry.updated = new Date().toISOString();
      entry.sourceCount++;
      entry.confidence = Math.min(1, entry.confidence + 0.1);
    }
    return entry;
  }

  getTopics() {
    return [...new Set(this.entries.map(e => e.topic))];
  }

  getStats() {
    return {
      totalEntries: this.entries.length,
      avgConfidence: this.entries.length > 0
        ? this.entries.reduce((sum, e) => sum + e.confidence, 0) / this.entries.length
        : 0,
      topics: this.getTopics().length
    };
  }
}

module.exports = Wisdom;
module.exports.Wisdom = Wisdom;
module.exports.default = Wisdom;
