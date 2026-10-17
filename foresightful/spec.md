# Foresight Specification

## Overview

Foresight is a simulator that runs actions in a preview/sandbox before committing.
Not verification (which checks if it works), but simulation (which checks what will
happen). "If I deploy this, what will break?" "If I change this config, what's the
downstream effect?"

## Format

Not a file. Not a server. A **simulator** that previews consequences.

## How It Works

1. AI proposes an action
2. Foresight simulates the action in a sandbox
3. Foresight predicts: "What will happen if this is committed?"
4. Foresight reports: affected files, breaking changes, side effects
5. AI decides whether to proceed based on simulation

## Simulation Types

| Type | Description |
|------|-------------|
| file_change | What files will be affected? |
| dependency_upgrade | What will break? |
| config_change | What's the downstream effect? |
| deploy | What will happen in production? |
| refactor | What callers will break? |
| custom | Custom simulation (shell command) |

## Delivery

- **Node.js:** `npm install ai-foresight`
- **Python:** `pip install ai-foresight`
- **Any language:** Simulator library

## Cross-Platform

Works as a simulator that any AI tool can use. Previews actions before committing.

## Comparison

| | Verification (does it work?) | Foresight (new) |
|---|---|---|
| What it checks | Does the action succeed? | What happens if it succeeds? |
| Question | "Will this work?" | "What will this cause?" |
| Output | Pass/fail | Impact report |
| Example | "Tests pass" | "Upgrading React breaks 3 components" |
