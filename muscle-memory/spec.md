# Muscle Memory Specification

## Overview

Muscle Memory is a runtime cache that stores successful execution paths as compressed,
reusable patterns. When a similar task comes up, the AI activates the cached pattern
instead of re-reasoning from scratch. Like how humans develop muscle memory for riding
a bike — they don't remember each attempt, they internalize the pattern.

## Format

Not a file. Not a server. A **runtime cache** stored as compressed binary blobs.

## Storage

- Location: `~/.ai-muscle-memory/` directory
- Format: Compressed JSON (gzip) with pattern metadata
- Index: SQLite database for fast lookup
- Scope: Global (shared across all projects)

## Data Structure

```json
{
  "id": "uuid",
  "pattern": "deploy_nextjs_app",
  "signature": "hash of task description",
  "steps": [
    { "action": "run_command", "command": "npm run build", "order": 1 },
    { "action": "run_command", "command": "npm run test", "order": 2 },
    { "action": "run_command", "command": "vercel --prod", "order": 3 }
  ],
  "success_count": 5,
  "failure_count": 1,
  "confidence": 0.83,
  "created": "2026-10-16T00:00:00Z",
  "last_used": "2026-10-16T12:00:00Z",
  "adaptations": ["changed build command for monorepo", "added env var check"]
}
```

## How It Works

1. AI successfully completes a task
2. System extracts the "decision skeleton" — which actions, in what order, with what params
3. Compresses into a "muscle memory" pattern
4. Stores in cache with success/failure tracking
5. When a similar task comes up, system matches against cached patterns
6. If match found, AI activates the cached pattern (adapting as needed)
7. Success increases confidence, failure decreases it
8. Low-confidence patterns are pruned over time

## How AI Uses It

1. User asks AI to do something
2. AI checks muscle memory cache for similar tasks
3. If found: "I've done this before. Let me use my muscle memory."
4. AI activates the cached pattern, adapting to current context
5. If not found: AI reasons normally, then caches the result

## Cross-Platform

Works as a library/SDK that any AI tool can import:
- Node.js: `npm install ai-muscle-memory`
- Python: `pip install ai-muscle-memory`
- Any language: HTTP API to a local daemon

## Comparison

| | Memory (facts) | Replay (exact traces) | Muscle Memory (new) |
|---|---|---|---|
| What it stores | Facts about the world | Exact execution traces | Distilled decision patterns |
| How it's used | Retrieved as context | Replayed step-by-step | Activated as a pattern |
| Adaptability | Static | None (exact replay) | High (adapts to new context) |
| Size | Large (all facts) | Large (all steps) | Small (distilled pattern) |
| Speed | Slow (search) | Slow (replay) | Fast (pattern activation) |
