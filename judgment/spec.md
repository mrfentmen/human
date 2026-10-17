# Judgment Specification

## Overview

Judgment is a scorer that rates the quality of AI decisions on multiple dimensions.
Not confidence (which is probabilistic), but judgment (which is evaluative). "This
approach is good but not great." "This is the best option given the constraints."

## Format

Not a file. Not a server. A **scorer** that rates AI decisions.

## Scoring Dimensions

| Dimension | Description | Scale |
|-----------|-------------|-------|
| Correctness | Is the solution correct? | 0-10 |
| Efficiency | Is it efficient? | 0-10 |
| Maintainability | Is it maintainable? | 0-10 |
| Safety | Is it safe? | 0-10 |
| Simplicity | Is it simple? | 0-10 |
| Overall | Weighted average | 0-10 |

## How It Works

1. AI proposes a solution
2. Judgment scores it on multiple dimensions
3. If score is below threshold: AI is told to improve
4. If score is acceptable: solution is delivered with score
5. Scores are tracked over time for calibration

## Delivery

- **Node.js:** `npm install ai-judgment`
- **Python:** `pip install ai-judgment`
- **Any language:** Scoring library

## Cross-Platform

Works as a scorer that any AI tool can use. Rates AI decisions before delivery.

## Comparison

| | Confidence (probabilistic) | Judgment (new) |
|---|---|---|
| What it measures | "How sure am I?" | "How good is this?" |
| Output | Percentage (0-100%) | Score (0-10) on multiple dimensions |
| Action on low score | Ask for help | Suggest improvements |
| Improves over time | No | Yes (calibrates with outcomes) |
