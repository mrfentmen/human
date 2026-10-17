# Instinct File Format Specification

## Overview

A `.instinct` file defines pattern-matching rules that fire instantly without full reasoning.
Like human instincts — gut feelings that guide decisions before conscious analysis.

## File Location

- Project-level: `.instinct` in the project root
- Global: `~/.instinct` in the user's home directory
- Multiple files: `.instinct.d/` directory

## Format

```
instinct <name>
  pattern: <what to match>
  response: <what to do immediately>
  confidence: <0.0-1.0>
  speed: instant | fast | normal
  message: <optional message>
```

## Keywords

| Keyword | Required | Description |
|---------|----------|-------------|
| instinct | Yes | Declares a new instinct with a name |
| pattern | Yes | What situation triggers this instinct |
| response | Yes | What to do immediately (block, warn, flag, allow) |
| confidence | No | How confident the pattern match is (0.0-1.0) |
| speed | No | How fast to respond (instant, fast, normal) |
| message | No | Message shown when instinct fires |

## Pattern Types

| Pattern | Description |
|---------|-------------|
| contains | Text contains a substring |
| matches | Text matches a regex |
| starts_with | Text starts with a prefix |
| ends_with | Text ends with a suffix |
| equals | Exact match |
| custom | Custom pattern (shell command) |

## Example

```
instinct suspicious_code
  pattern: contains "eval(" or "exec(" with user input
  response: flag
  confidence: 0.95
  speed: instant
  message: "Suspicious code pattern detected. Review before executing."

instinct breaking_change
  pattern: matches "function.*\(.*\).*{" in modified files
  response: warn
  confidence: 0.85
  speed: fast
  message: "Function signature changed. Check for callers."

instinct security_risk
  pattern: contains "password" or "secret" or "api_key" in plaintext
  response: block
  confidence: 0.99
  speed: instant
  message: "Secret detected in plaintext. Use environment variables."
```

## How It Works

1. AI encounters a situation
2. Before full reasoning, checks if any instinct pattern matches
3. If match: fires instantly, bypasses reasoning
4. If no match: proceeds with normal reasoning
5. Instincts are faster but less accurate than full reasoning

## Cross-Platform

Works on ANY AI tool that can read files. Place .instinct in project root.

## Comparison

| | Skill (MD) | Instinct (new) |
|---|---|---|
| Speed | Normal (full reasoning) | Instant (pattern match) |
| Accuracy | High | Lower (approximate) |
| When used | Complex tasks | Quick gut checks |
| Created by | Human | Human or AI |
| Can evolve | No | Yes (confidence adjusts) |
