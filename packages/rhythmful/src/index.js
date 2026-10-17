// Rhythm — Pacing engine for AI agents

class Rhythm {
  constructor(options = {}) {
    this.basePace = options.basePace || 'normal';
  }

  pace(content, context = {}) {
    const complexity = this.assessComplexity(content);
    const urgency = context.urgency || 0;
    const userLevel = context.userLevel || 'intermediate';

    let pace = this.basePace;
    let chunkSize = 3; // sentences per chunk
    let delay = 0;

    if (complexity > 0.7) {
      pace = 'slow';
      chunkSize = 2;
      delay = 100;
    } else if (urgency > 0.7) {
      pace = 'fast';
      chunkSize = 5;
      delay = 0;
    } else if (userLevel === 'beginner') {
      pace = 'slow';
      chunkSize = 2;
      delay = 50;
    }

    const sentences = content.split(/[.!?]+/).filter(s => s.trim());
    const chunks = [];
    for (let i = 0; i < sentences.length; i += chunkSize) {
      chunks.push(sentences.slice(i, i + chunkSize).join('. ') + '.');
    }

    return {
      pace,
      chunks,
      chunkSize,
      delay,
      totalChunks: chunks.length,
      totalSentences: sentences.length
    };
  }

  assessComplexity(text) {
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
    const hasCode = /function|const|let|var|class|import/.test(text);
    const hasTechnical = /API|database|algorithm|complexity|O\(/.test(text);

    let complexity = 0;
    if (avgWordsPerSentence > 20) complexity += 0.3;
    if (hasCode) complexity += 0.3;
    if (hasTechnical) complexity += 0.2;
    if (words > 200) complexity += 0.2;

    return Math.min(1, complexity);
  }
}

module.exports = Rhythm;
module.exports.Rhythm = Rhythm;
module.exports.default = Rhythm;
