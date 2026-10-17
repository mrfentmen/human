# Rhythm Specification

## Overview

Rhythm is a system that paces AI responses and actions appropriately. Not too fast,
not too slow. Like a musician who knows when to speed up and when to slow down.

## Format

Not a file. Not a server. A **pacing engine** that controls AI timing.

## How It Works

1. AI generates a response or action
2. Rhythm evaluates: "Is this the right pace?"
3. If too fast: Rhythm adds pauses, breaks into steps
4. If too slow: Rhythm combines steps, reduces verbosity
5. Rhythm adapts to user's reading speed and urgency

## Pacing Factors

| Factor | Description |
|--------|-------------|
| Complexity | Complex topics need slower pacing |
| Urgency | Urgent requests need faster responses |
| User level | Beginners need slower, more detailed |
| Content type | Code → concise, Explanation → detailed |
| Time of day | Late night → shorter responses |

## Delivery

- **Node.js:** `npm install ai-rhythm`
- **Python:** `pip install ai-rhythm`
- **Any language:** Pacing library

## Cross-Platform

Works as a pacing engine that any AI tool can use. Controls response timing.

## Comparison

| | Patience (delays actions) | Rhythm (new) |
|---|---|---|
| What it does | Holds actions until ready | Paces response delivery |
| Focus | Action timing | Response timing |
| Example | "Wait for tests before deploy" | "Break this into 3 messages" |
| Output | Delayed action | Paced response |
