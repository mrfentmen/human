# Habit File Format Specification

## Overview

A `.habit` file defines behaviors that AI agents develop automatically through repetition.
Unlike skills (manually written), habits are organic — the AI notices patterns in what
you repeatedly ask for and makes them automatic.

## File Location

- Project-level: `.habit` in the project root
- Global: `~/.habit` in the user's home directory
- Multiple files: `.habit.d/` directory

## Format

```
habit <name>
  trigger: <when to fire>
  behavior: <what to do automatically>
  developed_after: <number of repetitions>
  confidence: <0.0-1.0>
  message: <optional message>
```

## Keywords

| Keyword | Required | Description |
|---------|----------|-------------|
| habit | Yes | Declares a new habit with a name |
| trigger | Yes | When the habit fires (on_request, on_error, on_success, always) |
| behavior | Yes | What the AI does automatically |
| developed_after | Yes | Number of repetitions before habit activates |
| confidence | No | How confident the AI is (0.0-1.0, default 0.9) |
| message | No | Message shown when habit fires |

## Trigger Types

| Trigger | When it fires |
|---------|--------------|
| on_request | When user makes a specific type of request |
| on_error | When an error occurs |
| on_success | After a successful action |
| on_pattern | When a pattern is detected |
| always | On every AI turn |

## Example

```
habit code_review_format
  trigger: on_request
  behavior: always check security first, then performance, then style
  developed_after: 5
  confidence: 0.95
  message: "Applying code review habit (developed over 5 reviews)"

habit conventional_commits
  trigger: on_request
  behavior: always use conventional commit format (feat:, fix:, docs:, etc.)
  developed_after: 3
  confidence: 0.99
  message: "Using conventional commit format"

habit error_first
  trigger: on_error
  behavior: before retrying, analyze the error message and suggest a fix
  developed_after: 2
  confidence: 0.90
  message: "Analyzing error before retrying"
```

## How It Works

1. AI observes user patterns over time
2. When a pattern repeats N times (developed_after), AI creates a habit
3. Habit is saved to .habit file
4. On future requests, habit fires automatically
5. Confidence increases with successful use
6. Habits can be manually edited or deleted

## Cross-Platform

Works on ANY AI tool that can read files. Place .habit in project root.

## Comparison

| | Skill (MD) | Habit (new) |
|---|---|---|
| Who creates it | Human (manually) | AI (automatically) |
| How it's learned | Written by user | Developed through repetition |
| When it fires | When AI loads it | Automatically on pattern match |
| Can it evolve | No (static) | Yes (confidence increases) |
| User control | Full control | Can edit/delete but AI creates |
