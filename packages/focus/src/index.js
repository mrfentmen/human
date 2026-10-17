// Focus — Context filter for AI agents
// Narrows attention to only what matters

class Focus {
  constructor(options = {}) {
    this.stopWords = options.stopWords || ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'and', 'but', 'or', 'nor', 'so', 'yet', 'both', 'either', 'neither', 'not', 'only', 'own', 'same', 'than', 'too', 'very', 'just', 'because', 'if', 'when', 'where', 'how', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'it', 'its', 'they', 'them', 'their'];
  }

  filter(context, goal) {
    const goalWords = goal.toLowerCase().split(/\s+/).filter(w => !this.stopWords.includes(w));
    const filtered = {};
    let totalRelevance = 0;

    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string') {
        const valueLower = value.toLowerCase();
        const relevance = goalWords.filter(w => valueLower.includes(w)).length;
        if (relevance > 0) {
          filtered[key] = value;
          totalRelevance += relevance;
        }
      } else if (Array.isArray(value)) {
        const relevant = value.filter(item => {
          if (typeof item === 'string') {
            return goalWords.some(w => item.toLowerCase().includes(w));
          }
          return true;
        });
        if (relevant.length > 0) {
          filtered[key] = relevant;
        }
      } else {
        filtered[key] = value;
      }
    }

    return {
      filtered,
      relevanceScore: goalWords.length > 0 ? totalRelevance / goalWords.length : 0,
      removedCount: Object.keys(context).length - Object.keys(filtered).length
    };
  }

  score(text, goal) {
    const goalWords = goal.toLowerCase().split(/\s+/).filter(w => !this.stopWords.includes(w));
    const textLower = text.toLowerCase();
    const matches = goalWords.filter(w => textLower.includes(w)).length;
    return goalWords.length > 0 ? matches / goalWords.length : 0;
  }

  extractRelevant(text, goal, maxSentences = 5) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const goalWords = goal.toLowerCase().split(/\s+/).filter(w => !this.stopWords.includes(w));
    
    const scored = sentences.map(sentence => ({
      sentence: sentence.trim(),
      score: goalWords.filter(w => sentence.toLowerCase().includes(w)).length
    }));

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSentences)
      .map(s => s.sentence);
  }
}

module.exports = Focus;
module.exports.Focus = Focus;
module.exports.default = Focus;
