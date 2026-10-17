# Discipline Specification

## Overview

Discipline is a linter that checks AI output against a set of rules before it's shown
to the user. Not guardrails (which check safety), but quality enforcement. "Always use
TypeScript." "Never use var." "Always include error handling."

## Format

Not a file. Not a server. A **linter** that checks AI output against rules.

## How It Works

1. AI generates output (code, text, etc.)
2. Output passes through Discipline linter
3. Linter checks against configured rules
4. If all pass: output is delivered
5. If violations found: AI is told to fix them before delivering

## Rule Types

| Rule | Description |
|------|-------------|
| no_var | Don't use 'var' keyword |
| use_typescript | All code must be TypeScript |
| error_handling | All functions must have try/catch |
| no_console_log | No console.log in production code |
| test_coverage | All new code must have tests |
| naming_convention | Follow naming conventions |
| custom | Custom rule (regex or shell command) |

## Delivery

- **Node.js:** `npm install ai-discipline`
- **Python:** `pip install ai-discipline`
- **Any language:** Linter library

## Cross-Platform

Works as a linter that any AI tool can integrate. Runs on AI output before delivery.

## Comparison

| | Guardrails (safety) | Discipline (new) |
|---|---|---|
| What it checks | Is content safe? | Is content quality? |
| Example | "Is this hate speech?" | "Does this have error handling?" |
| Focus | Safety | Quality |
| Severity | Binary (safe/unsafe) | Spectrum (quality score) |
