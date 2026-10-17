// Empathy — User mental state modeling for AI agents

class Empathy {
  constructor(options = {}) {
    this.userModel = {
      knowledge: { level: 'intermediate', domains: [], gaps: [] },
      preferences: { communicationStyle: 'detailed', verbosity: 0.5 },
      emotionalState: { frustration: 0, confidence: 0.5, urgency: 0 },
      goals: { current: '', history: [] },
      patterns: { frequentRequests: [], commonErrors: [], preferredTools: [] }
    };
  }

  updateUserState(interaction) {
    if (interaction.frustrated) {
      this.userModel.emotionalState.frustration = Math.min(1, this.userModel.emotionalState.frustration + 0.2);
    }
    if (interaction.success) {
      this.userModel.emotionalState.confidence = Math.min(1, this.userModel.emotionalState.confidence + 0.1);
      this.userModel.emotionalState.frustration = Math.max(0, this.userModel.emotionalState.frustration - 0.1);
    }
    if (interaction.urgent) {
      this.userModel.emotionalState.urgency = Math.min(1, this.userModel.emotionalState.urgency + 0.3);
    }
    if (interaction.topic) {
      if (!this.userModel.knowledge.domains.includes(interaction.topic)) {
        this.userModel.knowledge.domains.push(interaction.topic);
      }
    }
    if (interaction.error) {
      if (!this.userModel.patterns.commonErrors.includes(interaction.error)) {
        this.userModel.patterns.commonErrors.push(interaction.error);
      }
    }
    if (interaction.request) {
      this.userModel.patterns.frequentRequests.push(interaction.request);
      if (this.userModel.patterns.frequentRequests.length > 20) {
        this.userModel.patterns.frequentRequests.shift();
      }
    }
  }

  getAdaptedStyle() {
    const { frustration, confidence, urgency } = this.userModel.emotionalState;
    if (frustration > 0.5) return 'concise_direct';
    if (urgency > 0.5) return 'fast_focused';
    if (confidence < 0.3) return 'detailed_educational';
    return 'balanced';
  }

  getResponseGuidelines() {
    const style = this.getAdaptedStyle();
    const guidelines = {
      concise_direct: { maxWords: 50, tone: 'direct', askQuestions: false },
      fast_focused: { maxWords: 80, tone: 'urgent', askQuestions: false },
      detailed_educational: { maxWords: 200, tone: 'patient', askQuestions: true },
      balanced: { maxWords: 120, tone: 'friendly', askQuestions: true }
    };
    return guidelines[style];
  }

  getUserModel() {
    return { ...this.userModel };
  }

  reset() {
    this.userModel.emotionalState = { frustration: 0, confidence: 0.5, urgency: 0 };
  }
}

module.exports = Empathy;
module.exports.Empathy = Empathy;
module.exports.default = Empathy;
