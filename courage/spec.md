# Courage Specification

## Overview

Courage is a system that tries unconventional or risky approaches when standard ones
fail. Not just retrying (Resilience), but trying something completely different. Like
a brave person who takes a different path when the first one is blocked.

## Format

Not a file. Not a server. A **strategy generator** that produces unconventional approaches.

## How It Works

1. Standard approach fails
2. Resilience retries (same approach, modified)
3. If Resilience fails N times, Courage activates
4. Courage generates unconventional alternatives
5. AI tries the most promising unconventional approach
6. If it works, Courage learns and suggests it earlier next time

## Delivery

- **Node.js:** `npm install ai-courage`
- **Python:** `pip install ai-courage`
- **Any language:** Strategy generation library

## Cross-Platform

Works as a strategy generator that any AI tool can use. Generates alternatives when standard approaches fail.

## Comparison

| | Resilience (retry) | Courage (new) |
|---|---|---|
| What it does | Tries the same approach differently | Tries a completely different approach |
| When it activates | On failure | After Resilience fails N times |
| Creativity | Low (modifications) | High (novel approaches) |
| Example | "Retry with --legacy-peer-deps" | "Instead of npm, try pnpm or yarn" |
