# Humility Specification

## Overview

Humility is a system that detects when the AI is likely wrong or uncertain and says so.
Instead of hallucinating confident answers, the AI admits "I don't know" and suggests
alternatives. Like a humble person who knows their limits.

## Format

Not a file. Not a server. A **confidence gate** that sits between reasoning and output.

## How It Works

1. AI generates a response
2. Humility evaluates: "How confident am I really?"
3. If confidence is high: deliver response normally
4. If confidence is medium: deliver with caveats ("I'm not entirely sure, but...")
5. If confidence is low: admit uncertainty ("I don't know this. Here's what I can try instead.")

## Confidence Signals

| Signal | Description |
|--------|-------------|
| Knowledge gap | AI has no training data on this topic |
| Contradiction | AI's reasoning contradicts itself |
| Novel situation | Situation is outside training distribution |
| Ambiguity | Question is ambiguous or underspecified |
| Stale knowledge | Information may be outdated |
| Complex reasoning | Multi-step reasoning with high error probability |

## Delivery

- **Node.js:** `npm install ai-humility`
- **Python:** `pip install ai-humility`
- **Any language:** Confidence evaluation library

## Cross-Platform

Works as a confidence gate that any AI tool can use. Evaluates AI output before delivery.

## Comparison

| | Confidence (number) | Humility (new) |
|---|---|---|
| What it does | Reports a probability | Decides whether to answer |
| Output | "I'm 80% sure" | "I don't know. Here's what I can try." |
| Action on low confidence | Still answers | Admits uncertainty |
| User experience | False confidence | Honest uncertainty |
