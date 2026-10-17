# Imagination Specification

## Overview

Imagination is a generator that creates multiple alternative approaches to a problem.
Not reasoning (which finds the best answer), but imagination (which finds ALL possible
answers, including unconventional ones). "What if we approached this differently?"
"What are 5 ways to solve this?"

## Format

Not a file. Not a server. A **generator** that creates diverse alternatives.

## How It Works

1. AI receives a problem
2. Imagination generates N alternative approaches
3. Each approach is scored on: feasibility, novelty, efficiency, risk
4. AI presents all options to the user
5. User picks one, or AI picks the best

## Generation Types

| Type | Description |
|------|-------------|
| approaches | Different ways to solve a problem |
| architectures | Different system designs |
| optimizations | Different performance improvements |
| ui_designs | Different UI layouts |
| algorithms | Different algorithmic approaches |
| custom | Custom generation (prompt-based) |

## Delivery

- **Node.js:** `npm install ai-imagination`
- **Python:** `pip install ai-imagination`
- **Any language:** Generator library

## Cross-Platform

Works as a generator that any AI tool can use. Generates alternatives before committing.

## Comparison

| | Reasoning (best answer) | Imagination (new) |
|---|---|---|
| What it does | Finds the best solution | Finds ALL solutions |
| Output | One answer | Multiple alternatives |
| Use case | "Do this" | "What are my options?" |
| Creativity | Low (convergent) | High (divergent) |
