// Human — AI Capability System
// All 20 concepts in one package
// Usage: const human = require('ai-human'); const h = new Human(directory);

const fs = require('fs');
const path = require('path');

// ============================================================
// SHARED PARSER
// ============================================================

function parseConceptFile(content) {
  const lines = content.split('\n');
  const concepts = [];
  let current = null;
  let currentKey = null;
  const conceptTypes = ['reflex', 'habit', 'instinct', 'hindsight', 'peripheral'];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const trimmed = line.trim();

    let isNewConcept = false;
    for (const type of conceptTypes) {
      if (trimmed.startsWith(type + ' ')) {
        if (current) concepts.push(current);
        current = { type: type, name: trimmed.slice(type.length + 1).trim(), rules: {} };
        currentKey = null;
        isNewConcept = true;
        break;
      }
    }
    if (isNewConcept) continue;

    if (current && /^\s+\w+:/.test(rawLine)) {
      const colonIdx = trimmed.indexOf(':');
      const key = trimmed.slice(0, colonIdx).trim();
      const value = trimmed.slice(colonIdx + 1).trim();
      current.rules[key] = value;
      currentKey = key;
      continue;
    }

    if (current && currentKey && /^\s+/.test(rawLine) && !trimmed.includes(':')) {
      current.rules[currentKey] += ' ' + trimmed;
      continue;
    }
  }

  if (current) concepts.push(current);
  return concepts;
}

// ============================================================
// HUMAN CLASS
// ============================================================

class Human {
  constructor(options = {}) {
    this.directory = options.directory || process.cwd();
    this.concepts = {
      reflex: [], habit: [], instinct: [], hindsight: [], peripheral: []
    };
    this.muscleMemory = new Map();
    this.wisdom = [];
    this.userModel = {
      knowledge: { level: 'intermediate', domains: [], gaps: [] },
      preferences: { communicationStyle: 'detailed', verbosity: 0.5 },
      emotionalState: { frustration: 0, confidence: 0.5, urgency: 0 },
      goals: { current: '', history: [] },
      patterns: { frequentRequests: [], commonErrors: [], preferredTools: [] }
    };
    this.load();
  }

  load() {
    const conceptTypes = ['reflex', 'habit', 'instinct', 'hindsight', 'peripheral'];
    for (const type of conceptTypes) {
      this.concepts[type] = [];
      const globalPath = path.join(process.env.HOME || '', '.' + type);
      if (fs.existsSync(globalPath)) {
        this.concepts[type].push(...parseConceptFile(fs.readFileSync(globalPath, 'utf-8')));
      }
      const projectPath = path.join(this.directory, '.' + type);
      if (fs.existsSync(projectPath)) {
        this.concepts[type].push(...parseConceptFile(fs.readFileSync(projectPath, 'utf-8')));
      }
      const dirPath = path.join(this.directory, '.' + type + '.d');
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.' + type));
        for (const file of files) {
          this.concepts[type].push(...parseConceptFile(fs.readFileSync(path.join(dirPath, file), 'utf-8')));
        }
      }
    }
  }

  // ============================================================
  // REFLEX — Pre-action verification
  // ============================================================
  checkReflex(context) {
    const results = [];
    for (const reflex of this.concepts.reflex) {
      const r = reflex.rules;
      const trigger = r.trigger;
      const check = r.check;
      const condition = r.condition;
      const onPass = r.on_pass || 'allow';
      const onFail = r.on_fail || 'allow';

      if (trigger && trigger !== context.triggerType && trigger !== 'always') continue;
      if (condition) {
        const parts = condition.split(/\s+/);
        if (parts[1] === 'is' && context.action !== parts[2]) continue;
      }

      let checkResult = true;
      if (check === 'file_exists') checkResult = context.fileExists || false;
      else if (check === 'file_not_exists') checkResult = !context.fileExists;
      else if (check === 'no_secrets') checkResult = !context.hasSecrets;
      else if (check === 'tests_pass') checkResult = context.testsPass || false;
      else if (check === 'git_clean') checkResult = context.gitClean || false;
      else if (check === 'backup_exists') checkResult = context.hasBackup || false;
      else if (check === 'user_confirmed') checkResult = context.userConfirmed || false;
      else if (check === 'rate_limit') checkResult = !context.rateLimitExceeded;

      const action = checkResult ? onPass : onFail;
      results.push({ name: reflex.name, type: 'reflex', action, message: (r.message || '').replace(/^"|"$/g, '') });
      if (action === 'block') break;
    }
    return results;
  }

  // ============================================================
  // INSTINCT — Fast pattern matching
  // ============================================================
  checkInstinct(context) {
    const text = context.text || context.code || context.command || '';
    const results = [];
    for (const instinct of this.concepts.instinct) {
      const r = instinct.rules;
      const pattern = r.pattern || '';
      const response = r.response || 'flag';
      let matched = false;

      if (pattern.startsWith('contains ')) {
        const term = pattern.slice(9).replace(/"/g, '').toLowerCase();
        matched = text.toLowerCase().includes(term);
      } else if (pattern.startsWith('matches ')) {
        try { matched = new RegExp(pattern.slice(8).replace(/^"|"$/g, '')).test(text); }
        catch (e) { matched = false; }
      }

      if (matched) {
        results.push({ name: instinct.name, type: 'instinct', response, message: (r.message || '').replace(/^"|"$/g, '') });
        if (response === 'block') break;
      }
    }
    return results;
  }

  // ============================================================
  // HINDSIGHT — Failure prevention
  // ============================================================
  checkHindsight(context) {
    const results = [];
    for (const h of this.concepts.hindsight) {
      const r = h.rules;
      const trigger = r.trigger;
      if (trigger && trigger !== context.triggerType && trigger !== 'always') continue;

      // Check if prevention rule applies
      const prevention = r.prevention || '';
      results.push({
        name: h.name,
        type: 'hindsight',
        lesson: r.lesson,
        prevention,
        message: `Hindsight: ${r.what}. Lesson: ${r.lesson}`
      });
    }
    return results;
  }

  // ============================================================
  // PERIPHERAL — Always-on awareness
  // ============================================================
  checkPeripheral(context) {
    const results = [];
    for (const p of this.concepts.peripheral) {
      const r = p.rules;
      const level = r.level || 'info';
      const alert = (r.alert || '').replace(/^"|"$/g, '');
      results.push({
        name: p.name,
        type: 'peripheral',
        level,
        alert: alert.replace(/\{(\w+)\}/g, (_, key) => context[key] || ''),
        message: alert
      });
    }
    return results;
  }

  // ============================================================
  // HABIT — Automatic behaviors
  // ============================================================
  getHabits(trigger) {
    return this.concepts.habit.filter(h => {
      const t = h.rules.trigger;
      return t === trigger || t === 'always' || t === 'on_request';
    });
  }

  // ============================================================
  // MUSCLE MEMORY — Cached execution paths
  // ============================================================
  cachePattern(name, steps) {
    this.muscleMemory.set(name, {
      name,
      steps,
      successCount: 0,
      failureCount: 0,
      confidence: 0.5,
      created: new Date().toISOString(),
      lastUsed: new Date().toISOString()
    });
  }

  findPattern(taskDescription) {
    // Simple similarity matching
    const desc = taskDescription.toLowerCase();
    let bestMatch = null;
    let bestScore = 0;

    for (const [name, pattern] of this.muscleMemory) {
      const nameWords = name.toLowerCase().split(/[_\s]+/);
      const descWords = desc.split(/\s+/);
      let score = 0;
      for (const word of descWords) {
        if (nameWords.some(nw => nw.includes(word) || word.includes(nw))) {
          score++;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = pattern;
      }
    }

    return bestMatch && bestScore > 0 ? bestMatch : null;
  }

  recordSuccess(name) {
    const pattern = this.muscleMemory.get(name);
    if (pattern) {
      pattern.successCount++;
      pattern.confidence = pattern.successCount / (pattern.successCount + pattern.failureCount);
      pattern.lastUsed = new Date().toISOString();
    }
  }

  recordFailure(name) {
    const pattern = this.muscleMemory.get(name);
    if (pattern) {
      pattern.failureCount++;
      pattern.confidence = pattern.successCount / (pattern.successCount + pattern.failureCount);
    }
  }

  // ============================================================
  // WISDOM — Distilled judgment
  // ============================================================
  addWisdom(topic, judgment, lessons = [], tags = []) {
    this.wisdom.push({
      id: Date.now() + Math.random(),
      topic,
      judgment,
      lessons,
      tags,
      confidence: 0.5,
      sourceCount: 1,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    });
  }

  queryWisdom(topic) {
    const query = topic.toLowerCase();
    return this.wisdom
      .filter(w => w.topic.toLowerCase().includes(query) || w.tags.some(t => t.toLowerCase().includes(query)))
      .sort((a, b) => b.confidence - a.confidence);
  }

  // ============================================================
  // FOCUS — Context filtering
  // ============================================================
  focus(context, goal) {
    const goalWords = goal.toLowerCase().split(/\s+/);
    const filtered = {};

    for (const [key, value] of Object.entries(context)) {
      if (typeof value === 'string') {
        const relevance = goalWords.filter(w => value.toLowerCase().includes(w)).length;
        if (relevance > 0) {
          filtered[key] = value;
        }
      } else {
        filtered[key] = value;
      }
    }

    return filtered;
  }

  // ============================================================
  // EMPATHY — User modeling
  // ============================================================
  updateUserState(interaction) {
    if (interaction.frustrated) {
      this.userModel.emotionalState.frustration = Math.min(1, this.userModel.emotionalState.frustration + 0.2);
    }
    if (interaction.success) {
      this.userModel.emotionalState.confidence = Math.min(1, this.userModel.emotionalState.confidence + 0.1);
    }
    if (interaction.urgent) {
      this.userModel.emotionalState.urgency = Math.min(1, this.userModel.emotionalState.urgency + 0.3);
    }
    if (interaction.topic) {
      if (!this.userModel.knowledge.domains.includes(interaction.topic)) {
        this.userModel.knowledge.domains.push(interaction.topic);
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

  // ============================================================
  // CONSCIENCE — Ethical evaluation
  // ============================================================
  evaluateConscience(action, context) {
    const checks = [];
    let score = 10;

    // Reversibility
    if (action.includes('delete') || action.includes('drop') || action.includes('remove')) {
      checks.push({ criterion: 'reversibility', score: 3, note: 'Irreversible action' });
      score -= 3;
    }

    // Impact scope
    if (context.affectedUsers && context.affectedUsers > 100) {
      checks.push({ criterion: 'impact_scope', score: 4, note: `Affects ${context.affectedUsers} users` });
      score -= 2;
    }

    // Data sensitivity
    if (context.involvesPersonalData) {
      checks.push({ criterion: 'data_sensitivity', score: 5, note: 'Involves personal data' });
      score -= 1;
    }

    // Consent
    if (!context.userConsented) {
      checks.push({ criterion: 'consent', score: 2, note: 'No explicit consent' });
      score -= 3;
    }

    return {
      score: Math.max(0, score),
      checks,
      verdict: score >= 7 ? 'allow' : score >= 4 ? 'warn' : 'block',
      message: score >= 7 ? 'Action appears ethical' : score >= 4 ? 'Action is questionable. Consider alternatives.' : 'Action may be unethical. Blocked.'
    };
  }

  // ============================================================
  // ATTENTION — Event-triggered hooks
  // ============================================================
  hooks = {};

  registerHook(event, handler) {
    if (!this.hooks[event]) this.hooks[event] = [];
    this.hooks[event].push(handler);
  }

  triggerHook(event, context) {
    const handlers = this.hooks[event] || [];
    const results = [];
    for (const handler of handlers) {
      try {
        results.push(handler(context));
      } catch (e) {
        results.push({ error: e.message });
      }
    }
    return results;
  }

  // ============================================================
  // JUDGMENT — Quality scoring
  // ============================================================
  judge(solution, context = {}) {
    const scores = {
      correctness: 5,
      efficiency: 5,
      maintainability: 5,
      safety: 5,
      simplicity: 5
    };

    // Adjust based on context
    if (context.hasTests) scores.correctness += 2;
    if (context.isOptimized) scores.efficiency += 2;
    if (context.isDocumented) scores.maintainability += 2;
    if (context.hasErrorHandling) scores.safety += 2;
    if (context.isSimple) scores.simplicity += 2;

    // Clamp to 0-10
    for (const key of Object.keys(scores)) {
      scores[key] = Math.min(10, Math.max(0, scores[key]));
    }

    const overall = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

    return {
      scores,
      overall: Math.round(overall * 10) / 10,
      verdict: overall >= 8 ? 'excellent' : overall >= 6 ? 'good' : overall >= 4 ? 'acceptable' : 'needs_improvement'
    };
  }

  // ============================================================
  // TASTE — Aesthetic evaluation
  // ============================================================
  evaluateTaste(output, type = 'code') {
    const scores = {
      visual: 5,
      elegance: 5,
      clarity: 5,
      consistency: 5
    };

    // Simple heuristics
    if (type === 'code') {
      if (output.includes('function') && output.includes('return')) scores.elegance += 1;
      if (output.length < 500) scores.clarity += 2;
      if (output.includes('\n\n')) scores.visual += 1;
    }

    for (const key of Object.keys(scores)) {
      scores[key] = Math.min(10, Math.max(0, scores[key]));
    }

    const overall = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;

    return {
      scores,
      overall: Math.round(overall * 10) / 10,
      suggestions: overall < 7 ? ['Consider improving readability', 'Add more structure'] : []
    };
  }

  // ============================================================
  // RESILIENCE — Adaptive retry (wrapper)
  // ============================================================
  async resilientExecute(fn, context = {}, options = {}) {
    const maxRetries = options.maxRetries || 3;
    const baseDelay = options.baseDelay || 1000;
    let lastError = null;
    let attempt = 0;
    const history = [];

    while (attempt < maxRetries) {
      attempt++;
      try {
        const result = await fn(context, attempt);
        return { success: true, result, attempts: attempt, history };
      } catch (error) {
        lastError = error;
        history.push({ attempt, error: error.message });

        // Adapt
        const msg = (error.message || '').toLowerCase();
        if (msg.includes('peer dependency')) context.useLegacyPeerDeps = true;
        if (msg.includes('timeout')) context.timeout = (context.timeout || 30000) * 2;
        if (msg.includes('not found')) context.checkPath = true;

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt - 1)));
        }
      }
    }

    return { success: false, error: lastError, attempts: attempt, history };
  }

  // ============================================================
  // FORESIGHT — Consequence simulation
  // ============================================================
  simulate(action, context = {}) {
    const impacts = [];
    let risk = 0;

    if (action.includes('delete') || action.includes('drop')) {
      impacts.push({ type: 'irreversible', severity: 'high', description: 'This action cannot be undone' });
      risk += 30;
    }
    if (action.includes('deploy')) {
      impacts.push({ type: 'production', severity: 'high', description: 'This will affect production' });
      risk += 20;
    }
    if (context.affectedFiles && context.affectedFiles > 5) {
      impacts.push({ type: 'wide_impact', severity: 'medium', description: `Affects ${context.affectedFiles} files` });
      risk += 15;
    }

    return {
      action,
      impacts,
      riskScore: Math.min(100, risk),
      recommendation: risk > 50 ? 'High risk. Review carefully before proceeding.' : risk > 20 ? 'Moderate risk. Proceed with caution.' : 'Low risk. Safe to proceed.'
    };
  }

  // ============================================================
  // IMAGINATION — Alternative generation
  // ============================================================
  imagine(problem, count = 5) {
    const alternatives = [];
    const approaches = [
      'Try a different approach',
      'Simplify the problem',
      'Break it into smaller parts',
      'Use a different tool or library',
      'Ask for help or look up documentation',
      'Reverse the problem (solve the opposite)',
      'Use a cached solution',
      'Combine existing solutions'
    ];

    for (let i = 0; i < Math.min(count, approaches.length); i++) {
      alternatives.push({
        approach: approaches[i],
        novelty: Math.round(Math.random() * 10) / 10,
        feasibility: Math.round(Math.random() * 10) / 10,
        risk: Math.round(Math.random() * 10) / 10
      });
    }

    return alternatives;
  }

  // ============================================================
  // UNIFIED CHECK — Run all applicable concepts
  // ============================================================
  checkAll(context) {
    // Run reflexes
    const reflexResults = this.checkReflex(context);

    const results = {
      reflex: reflexResults,
      instinct: this.checkInstinct(context),
      hindsight: this.checkHindsight(context),
      peripheral: this.checkPeripheral(context),
      habits: this.getHabits(context.triggerType || 'on_request'),
      muscleMemory: this.findPattern(context.action || ''),
      wisdom: this.queryWisdom(context.action || ''),
      focus: this.focus(context, context.goal || ''),
      empathy: this.getAdaptedStyle(),
      conscience: this.evaluateConscience(context.action || '', context),
      judgment: this.judge(context.solution || '', context),
      taste: this.evaluateTaste(context.output || '', context.type || 'code'),
      foresight: this.simulate(context.action || '', context),
      imagination: this.imagine(context.problem || context.action || '', 3)
    };

    return results;
  }
}

module.exports = Human;
module.exports.Human = Human;
module.exports.default = Human;
module.exports.parseConceptFile = parseConceptFile;
