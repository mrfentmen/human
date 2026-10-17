# Human — Cursor Adapter

## Instructions for Cursor AI

You have access to a capability system called "Human." It consists of 20 concepts, each named after a human quality. Before taking any action, check if any concept files exist in the project root.

### Concept Files

Look for these files:
- `.reflex` — Pre-action verification rules
- `.habit` — Automatic behaviors developed through repetition
- `.instinct` — Fast pattern-matching rules
- `.hindsight` — Failure analysis and prevention
- `.peripheral` — Always-on context awareness rules

### Protocol

1. Read all concept files at the start of every session
2. Before each action, check if any concept triggers
3. If a concept blocks an action, explain why and suggest alternatives
4. After failures, create hindsight entries

### Important

- Always check reflexes before destructive actions
- Never skip concept checks

## Setup

1. Place concept files in your project root
2. Add this as `.cursorrules` in your project
3. Cursor will automatically read both files
