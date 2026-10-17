// OpenCode Human Plugin
// Handles all 5 file-based concepts: reflex, habit, instinct, hindsight, peripheral
// Install: Add to opencode.json -> "plugin": ["opencode-human"]
// Place .reflex, .habit, .instinct, .hindsight, .peripheral files in project root

import type { Plugin } from "@opencode-ai/plugin";
import * as fs from "fs";
import * as path from "path";

// Shared parser (embedded)
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

function loadAllConcepts(directory) {
  const conceptTypes = ['reflex', 'habit', 'instinct', 'hindsight', 'peripheral'];
  const all = {};
  for (const type of conceptTypes) {
    all[type] = [];
    
    // Global
    const globalPath = path.join(process.env.HOME || '', '.' + type);
    if (fs.existsSync(globalPath)) {
      const content = fs.readFileSync(globalPath, 'utf-8');
      all[type].push(...parseConceptFile(content));
    }
    
    // Project-level
    const projectPath = path.join(directory, '.' + type);
    if (fs.existsSync(projectPath)) {
      const content = fs.readFileSync(projectPath, 'utf-8');
      all[type].push(...parseConceptFile(content));
    }
    
    // Directory
    const conceptDir = path.join(directory, '.' + type + '.d');
    if (fs.existsSync(conceptDir) && fs.statSync(conceptDir).isDirectory()) {
      const files = fs.readdirSync(conceptDir).filter(f => f.endsWith('.' + type));
      for (const file of files) {
        const content = fs.readFileSync(path.join(conceptDir, file), 'utf-8');
        all[type].push(...parseConceptFile(content));
      }
    }
  }
  return all;
}

export const HumanPlugin = async (ctx) => {
  const { project, client, $, directory, worktree } = ctx;
  const concepts = loadAllConcepts(directory);
  const totalCount = Object.values(concepts).reduce((sum, arr) => sum + arr.length, 0);

  console.log(`[Human] Loaded ${totalCount} concepts from ${directory}`);
  for (const [type, items] of Object.entries(concepts)) {
    if (items.length > 0) {
      console.log(`[Human]   ${type}: ${items.length} loaded`);
    }
  }

  return {
    "tool.execute.before": async (input, output) => {
      const toolName = input.tool;
      const toolArgs = output.args || {};

      let action = toolName;
      if (toolName === 'bash') action = 'run_command';
      if (toolName === 'write' || toolName === 'edit') action = 'write_file';
      if (toolName === 'delete') action = 'delete_file';

      const context = {
        triggerType: 'before_action',
        action,
        toolName,
        toolArgs,
        target: toolArgs.path || toolArgs.command || toolArgs.file || '',
        fileExists: false,
        hasTests: false,
        testsPass: false,
        gitClean: false,
        hasSecrets: false,
        rateLimitExceeded: false,
        hasBackup: false,
        userConfirmed: false,
      };

      // Run reflexes
      for (const reflex of concepts.reflex) {
        const result = checkConcept(reflex, context);
        if (result.fired) {
          console.log(`[Human:Reflex] ${result.name}: ${result.action} - ${result.message}`);
          if (result.action === 'block') {
            throw new Error(`Reflex blocked: ${result.message}`);
          }
          if (result.action === 'warn') {
            console.warn(`[Human:Reflex Warning] ${result.message}`);
          }
        }
      }

      // Run instincts (pattern matching)
      for (const instinct of concepts.instinct) {
        const result = checkConcept(instinct, context);
        if (result.fired) {
          console.log(`[Human:Instinct] ${result.name}: ${result.action} - ${result.message}`);
          if (result.action === 'block') {
            throw new Error(`Instinct blocked: ${result.message}`);
          }
          if (result.action === 'warn') {
            console.warn(`[Human:Instinct Warning] ${result.message}`);
          }
        }
      }

      // Check hindsight (failure prevention)
      for (const hindsight of concepts.hindsight) {
        const result = checkConcept(hindsight, context);
        if (result.fired) {
          console.log(`[Human:Hindsight] ${result.name}: ${result.action} - ${result.message}`);
          if (result.action === 'block') {
            throw new Error(`Hindsight blocked: ${result.message}`);
          }
          if (result.action === 'warn') {
            console.warn(`[Human:Hindsight Warning] ${result.message}`);
          }
        }
      }
    },

    "tool.execute.after": async (input, output) => {
      const toolName = input.tool;
      const success = !output.error;
      console.log(`[Human] ${toolName} completed: ${success ? 'success' : 'failed'}`);

      // If action failed, could trigger hindsight creation
      if (!success) {
        console.log(`[Human:Hindsight] Consider creating a hindsight entry for this failure`);
      }
    },
  };
};

function checkConcept(concept, context) {
  const rules = concept.rules;
  const trigger = rules.trigger;
  const check = rules.check || rules.pattern || rules.watch;
  const condition = rules.condition;
  const onPass = rules.on_pass || 'allow';
  const onFail = rules.on_fail || 'allow';
  const message = rules.message;

  // Check trigger
  if (trigger && trigger !== context.triggerType && trigger !== 'always') {
    return { fired: false };
  }

  // Check condition
  if (condition) {
    const parts = condition.split(/\s+/);
    if (parts[1] === 'is' && context.action !== parts[2]) {
      return { fired: false };
    }
  }

  // Run check (simplified)
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

  return {
    fired: true,
    name: concept.name,
    type: concept.type,
    check: check,
    result: checkResult,
    action: action,
    message: message || null
  };
}

export default HumanPlugin;
export { HumanPlugin };
