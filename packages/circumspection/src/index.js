// Clarity — Simplification engine for AI agents

class Clarity {
  constructor(options = {}) {
    this.levels = options.levels || {
      expert: { maxWords: 500, jargon: true, detail: 'high' },
      intermediate: { maxWords: 200, jargon: 'some', detail: 'medium' },
      beginner: { maxWords: 100, jargon: false, detail: 'low' },
      child: { maxWords: 50, jargon: false, detail: 'minimal' }
    };
  }

  simplify(text, level = 'beginner') {
    const config = this.levels[level] || this.levels.beginner;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());

    let simplified = sentences.slice(0, Math.ceil(config.maxWords / 10)).join('. ') + '.';

    if (!config.jargon) {
      simplified = simplified.replace(/O\(\w+\)/g, 'efficiently');
      simplified = simplified.replace(/\bAPI\b/g, 'interface');
      simplified = simplified.replace(/\basync\b/g, 'in the background');
    }

    return {
      original: text,
      simplified,
      level,
      wordCount: simplified.split(/\s+/).length
    };
  }

  getLevel(userLevel) {
    const levels = ['child', 'beginner', 'intermediate', 'expert'];
    const idx = levels.indexOf(userLevel);
    if (idx === -1) return 'beginner';
    return levels[idx];
  }
}

module.exports = Clarity;
module.exports.Clarity = Clarity;
module.exports.default = Clarity;
