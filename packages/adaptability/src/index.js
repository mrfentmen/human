// Adaptability — Context adapter for AI agents

class Adaptability {
  constructor(options = {}) {
    this.rules = options.rules || [];
  }

  adapt(context) {
    const adaptations = [];
    let style = 'balanced';
    let verbosity = 0.5;
    let codeStyle = 'standard';

    // User level
    if (context.userLevel === 'beginner') {
      style = 'detailed_educational';
      verbosity = 0.9;
    } else if (context.userLevel === 'expert') {
      style = 'concise_technical';
      verbosity = 0.3;
    }

    // Urgency
    if (context.urgent) {
      style = 'fast_focused';
      verbosity = Math.min(verbosity, 0.4);
    }

    // Project type
    if (context.projectType === 'web') {
      codeStyle = 'react';
    } else if (context.projectType === 'api') {
      codeStyle = 'rest';
    } else if (context.projectType === 'cli') {
      codeStyle = 'node';
    }

    // Time of day
    if (context.timeOfDay === 'late_night') {
      verbosity = Math.min(verbosity, 0.4);
    }

    adaptations.push({ dimension: 'style', value: style });
    adaptations.push({ dimension: 'verbosity', value: verbosity });
    adaptations.push({ dimension: 'codeStyle', value: codeStyle });

    return { style, verbosity, codeStyle, adaptations };
  }

  addRule(rule) {
    this.rules.push(rule);
  }
}

module.exports = Adaptability;
module.exports.Adaptability = Adaptability;
module.exports.default = Adaptability;
