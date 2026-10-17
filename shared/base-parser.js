// Shared Human Concept Parser
// Handles all file-based concepts: reflex, habit, instinct, hindsight, peripheral
// Usage: const concepts = parseConceptFile(content, 'habit');

function parseConceptFile(content, conceptType) {
  const lines = content.split('\n');
  const concepts = [];
  let current = null;
  let currentKey = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const trimmed = line.trim();

    // New concept block (any concept type)
    const conceptTypes = ['reflex', 'habit', 'instinct', 'hindsight', 'peripheral'];
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

    // Key-value pair (indented)
    if (current && /^\s+\w+:/.test(rawLine)) {
      const colonIdx = trimmed.indexOf(':');
      const key = trimmed.slice(0, colonIdx).trim();
      const value = trimmed.slice(colonIdx + 1).trim();
      current.rules[key] = value;
      currentKey = key;
      continue;
    }

    // Continuation of previous value
    if (current && currentKey && /^\s+/.test(rawLine) && !trimmed.includes(':')) {
      current.rules[currentKey] += ' ' + trimmed;
      continue;
    }
  }

  if (current) concepts.push(current);
  return concepts;
}

function loadConcepts(directory, conceptType) {
  const concepts = [];
  const fs = require('fs');
  const path = require('path');

  // Load global
  const globalPath = path.join(process.env.HOME || '', '.' + conceptType);
  if (fs.existsSync(globalPath)) {
    const content = fs.readFileSync(globalPath, 'utf-8');
    concepts.push(...parseConceptFile(content, conceptType));
  }

  // Load project-level
  const projectPath = path.join(directory, '.' + conceptType);
  if (fs.existsSync(projectPath)) {
    const content = fs.readFileSync(projectPath, 'utf-8');
    concepts.push(...parseConceptFile(content, conceptType));
  }

  // Load from directory
  const conceptDir = path.join(directory, '.' + conceptType + '.d');
  if (fs.existsSync(conceptDir) && fs.statSync(conceptDir).isDirectory()) {
    const files = fs.readdirSync(conceptDir).filter(f => f.endsWith('.' + conceptType));
    for (const file of files) {
      const content = fs.readFileSync(path.join(conceptDir, file), 'utf-8');
      concepts.push(...parseConceptFile(content, conceptType));
    }
  }

  return concepts;
}

function loadAllConcepts(directory) {
  const conceptTypes = ['reflex', 'habit', 'instinct', 'hindsight', 'peripheral'];
  const all = {};
  for (const type of conceptTypes) {
    all[type] = loadConcepts(directory, type);
  }
  return all;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { parseConceptFile, loadConcepts, loadAllConcepts };
}
