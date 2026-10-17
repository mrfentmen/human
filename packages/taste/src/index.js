// Taste — Aesthetic evaluation for AI output

class Taste {
  constructor(options = {}) {
    this.threshold = options.threshold || 6;
  }

  evaluate(output, type = 'code') {
    const scores = {
      visual: 5,
      elegance: 5,
      clarity: 5,
      consistency: 5
    };

    if (type === 'code') {
      if (output.includes('function') && output.includes('return')) scores.elegance += 1;
      if (output.length < 500) scores.clarity += 2;
      if (output.includes('\n\n')) scores.visual += 1;
      if (!output.includes('var ')) scores.consistency += 1;
    } else if (type === 'ui') {
      if (output.includes('padding') || output.includes('margin')) scores.visual += 1;
      if (output.includes('border-radius')) scores.elegance += 1;
      if (output.includes('transition')) scores.clarity += 1;
    } else if (type === 'text') {
      if (output.length > 50 && output.length < 300) scores.clarity += 2;
      if (output.includes('.')) scores.visual += 1;
    }

    for (const key of Object.keys(scores)) {
      scores[key] = Math.min(10, Math.max(0, scores[key]));
    }

    const overall = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

    const suggestions = [];
    if (scores.visual < 7) suggestions.push('Improve visual appeal');
    if (scores.elegance < 7) suggestions.push('Improve code elegance');
    if (scores.clarity < 7) suggestions.push('Improve clarity');
    if (scores.consistency < 7) suggestions.push('Improve consistency');

    return {
      scores,
      overall: Math.round(overall * 10) / 10,
      suggestions: overall < this.threshold ? suggestions : [],
      verdict: overall >= 8 ? 'beautiful' : overall >= this.threshold ? 'good' : 'needs_work'
    };
  }
}

module.exports = Taste;
module.exports.Taste = Taste;
module.exports.default = Taste;
