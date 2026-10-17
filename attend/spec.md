# Attention Specification

## Overview

Attention is a hook system (like git hooks) that triggers on specific events. Not
always-on (like peripheral), but event-triggered. "When the AI is about to write a
file, check if it's the right file." Focuses the AI's attention on what matters at
each step.

## Format

Not a file. Not a server. **Hooks** — event-triggered checks.

## Hook Types

| Hook | When it fires |
|------|--------------|
| pre-write | Before writing a file |
| pre-delete | Before deleting a file |
| pre-commit | Before a git commit |
| pre-deploy | Before a deployment |
| pre-command | Before running a command |
| post-error | After an error occurs |
| post-success | After a successful action |
| on-pattern | When a specific pattern is detected |

## How It Works

1. User defines hooks (like git hooks)
2. Hooks are stored in `.attention/` directory or config
3. When an event fires, all matching hooks run
4. Hooks can: block, warn, modify, log, or allow
5. Hooks run in order (like middleware)

## Delivery

- **Node.js:** `npm install ai-attention`
- **Python:** `pip install ai-attention`
- **Any language:** Hook runner that watches for events

## Cross-Platform

Works as a hook system that any AI tool can integrate. Hooks fire on tool execution events.

## Comparison

| | Peripheral (always-on) | Attention (new) |
|---|---|---|
| When it runs | Continuously | On specific events |
| What it watches | Everything | Specific triggers |
| Use case | "I'm always watching" | "I'm checking at the right moment" |
| Overhead | Higher (constant) | Lower (event-driven) |
