# Hindsight File Format Specification

## Overview

A `.hindsight` file stores failure analysis and prevention rules. After a failure, the AI
generates a hindsight entry: what went wrong, why, and what to do differently next time.
These entries are checked before future actions to prevent repeating mistakes.

## File Location

- Project-level: `.hindsight` in the project root
- Global: `~/.hindsight` in the user's home directory
- Multiple files: `.hindsight.d/` directory

## Format

```
hindsight <name>
  what: <what went wrong>
  why: <why it went wrong>
  lesson: <what was learned>
  prevention: <rule to prevent recurrence>
  trigger: <when to check this hindsight>
```

## Keywords

| Keyword | Required | Description |
|---------|----------|-------------|
| hindsight | Yes | Declares a new hindsight entry |
| what | Yes | Description of what went wrong |
| why | Yes | Root cause of the failure |
| lesson | Yes | What was learned from the failure |
| prevention | Yes | Rule to prevent the same failure |
| trigger | No | When to check this (before_action, before_commit, etc.) |

## Example

```
hindsight failed_deploy
  what: deployed without running tests
  why: skipped test step to save time
  lesson: always run tests before deploy
  prevention: block deploy if tests haven't run in last 5 minutes
  trigger: before_deploy

hindsight broke_api
  what: changed function signature without updating callers
  why: didn't check for usages before modifying
  lesson: always search for all callers before changing a function
  prevention: warn if modifying function signature without checking callers
  trigger: before_action

hindsight lost_data
  what: deleted database without backup
  why: assumed data was backed up automatically
  lesson: always verify backup exists before destructive operations
  prevention: block delete if no backup exists
  trigger: before_action
```

## How It Works

1. AI takes an action that fails
2. AI analyzes: what went wrong, why, what to learn
3. AI creates a hindsight entry
4. Entry is saved to .hindsight file
5. Before future actions, AI checks if any hindsight triggers
6. If triggered, AI applies the prevention rule

## Cross-Platform

Works on ANY AI tool that can read files. Place .hindsight in project root.
