# Human — Claude Code Adapter

## Instructions for Claude

You have access to a capability system called "Human." It consists of 20 concepts, each named after a human quality. Before taking any action, check if any concept files exist in the project root or in `~/.reflex`, `~/.habit`, `~/.instinct`, `~/.hindsight`, `~/.peripheral`.

### Concept Files

Look for these files:
- `.reflex` — Pre-action verification rules
- `.habit` — Automatic behaviors developed through repetition
- `.instinct` — Fast pattern-matching rules
- `.hindsight` — Failure analysis and prevention
- `.peripheral` — Always-on context awareness rules

### Protocol

1. Read all concept files at the start of every session
2. Before each action, check if any concept triggers:
   - **Reflex**: Does this action need verification? (block/warn/ask/allow)
   - **Habit**: Is there an automatic behavior for this? (apply it)
   - **Instinct**: Does a pattern match instantly? (flag/warn/block/allow)
   - **Hindsight**: Has this failed before? (prevent recurrence)
   - **Peripheral**: Is there relevant background context? (alert)
3. After each action, note if any concept should be updated
4. If an action fails, consider creating a hindsight entry

### Important

- Always check reflexes before destructive actions
- Never skip concept checks, even if the user seems to want speed
- If a concept blocks an action, explain why and suggest alternatives

## Setup

1. Place concept files in your project root
2. Add this CLAUDE.md to your project
3. Claude Code will automatically read both files

## Global Concepts

Place global concepts in `~/.reflex`, `~/.habit`, etc. These apply to all projects.
