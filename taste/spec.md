# Taste Specification

## Overview

Taste is a filter that evaluates the aesthetic quality of AI output. Not functionality
(does it work?), but beauty (does it look good?). "This UI is functional but ugly."
"This code works but is messy." "This writing is correct but boring."

## Format

Not a file. Not a server. A **filter** that evaluates aesthetic quality.

## Evaluation Criteria

| Criterion | Description | Scale |
|-----------|-------------|-------|
| Visual appeal | Does it look good? | 0-10 |
| Code elegance | Is the code clean and elegant? | 0-10 |
| Writing style | Is the writing engaging? | 0-10 |
| UX quality | Is the user experience smooth? | 0-10 |
| Overall | Weighted average | 0-10 |

## How It Works

1. AI generates output (UI, code, text, etc.)
2. Taste evaluates aesthetic quality
3. If below threshold: AI is told what to improve
4. If acceptable: output is delivered with taste score

## Delivery

- **Node.js:** `npm install ai-taste`
- **Python:** `pip install ai-taste`
- **Any language:** Aesthetic evaluation library

## Cross-Platform

Works as a filter that any AI tool can use. Evaluates AI output before delivery.

## Comparison

| | Discipline (rules) | Taste (new) |
|---|---|---|
| What it checks | Does it meet rules? | Is it beautiful? |
| Example | "No console.log" | "Increase whitespace, improve contrast" |
| Focus | Correctness | Aesthetics |
| Output | Pass/fail | Score + suggestions |
