# Peripheral File Format Specification

## Overview

A `.peripheral` file defines context the AI should be aware of, even when not directly
relevant to the current task. Like peripheral vision — always on, always watching.

## File Location

- Project-level: `.peripheral` in the project root
- Global: `~/.peripheral` in the user's home directory
- Multiple files: `.peripheral.d/` directory

## Format

```
peripheral <name>
  watch: <what to monitor>
  alert: <what to say when triggered>
  level: info | warn | block
  trigger: always | on_change | on_threshold
```

## Keywords

| Keyword | Required | Description |
|---------|----------|-------------|
| peripheral | Yes | Declares a new peripheral awareness rule |
| watch | Yes | What to monitor (file changes, dependency conflicts, etc.) |
| alert | Yes | Message to show when triggered |
| level | No | Severity (info, warn, block; default: info) |
| trigger | No | When to check (always, on_change, on_threshold; default: always) |

## Watch Types

| Watch | Description |
|-------|-------------|
| file_changes | Monitor files being modified by other processes |
| dependency_conflict | Watch for package conflicts |
| context_overflow | Monitor token/context usage |
| git_status | Watch git working tree state |
| process_status | Monitor running processes |
| disk_space | Watch disk space |
| custom | Custom watch (shell command) |

## Example

```
peripheral file_changes
  watch: files being modified by other processes
  alert: "Another process is modifying {file}. Coordinate changes?"
  level: warn
  trigger: on_change

peripheral dependency_conflict
  watch: new dependencies being installed
  alert: "Package {name} conflicts with existing {existing}. Resolve before installing?"
  level: block
  trigger: on_change

peripheral context_overflow
  watch: token usage approaching limit
  alert: "Context window at 80%. Consider summarizing."
  level: warn
  trigger: on_threshold
```

## How It Works

1. Peripheral rules are always active (unlike reflexes which trigger on specific actions)
2. AI continuously monitors the watched conditions
3. When a condition changes, AI alerts the user
4. Alerts can be informational, warnings, or blocking
5. Peripheral runs in the background, never blocking normal operation

## Cross-Platform

Works on ANY AI tool that can read files. Place .peripheral in project root.
