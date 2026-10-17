# Wonder Specification

## Overview

Wonder is a system that recognizes when something is novel, interesting, or surprising
and highlights it. Like a person who says "wow, that's cool!" when they see something
new. Helps the AI and user discover unexpected insights.

## Format

Not a file. Not a server. A **novelty detector** that flags interesting findings.

## How It Works

1. AI processes information (code, data, text, etc.)
2. Wonder evaluates: "Is this novel or unexpected?"
3. If yes: Wonder highlights it ("Interesting: this pattern only appears in 3 files")
4. If no: Wonder stays silent
5. Over time, Wonder learns what the user finds interesting

## Detection Types

| Type | Description |
|------|-------------|
| Novel pattern | A pattern not seen before |
| Anomaly | Something that doesn't fit the norm |
| Connection | An unexpected relationship between things |
| Opportunity | A potential improvement or optimization |
| Risk | A potential problem or vulnerability |

## Delivery

- **Node.js:** `npm install ai-wonder`
- **Python:** `pip install ai-wonder`
- **Any language:** Novelty detection library

## Cross-Platform

Works as a novelty detector that any AI tool can use. Highlights interesting findings.

## Comparison

| | Curiosity (explores) | Wonder (new) |
|---|---|---|
| What it does | Proactively explores | Reacts to findings |
| When it runs | Continuously | When processing information |
| Output | Knowledge base | Highlighted insights |
| Example | "I found 5 test files" | "Interesting: only 2 of 5 tests actually run" |
