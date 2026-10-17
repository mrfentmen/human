# Patience Specification

## Overview

Patience is a queue system that holds AI actions until the right moment. Not a reflex
(which blocks), but a pause (which waits). "Don't deploy until tests pass." "Don't send
the email until the user confirms."

## Format

Not a file. Not a server. A **queue** that holds actions until conditions are met.

## How It Works

1. AI proposes an action
2. Action is placed in the Patience queue
3. Queue checks: "Are all conditions met?"
4. If yes: action is released
5. If no: action waits, with optional timeout
6. User can cancel queued actions

## Delivery

- **Node.js:** `npm install ai-patience`
- **Python:** `pip install ai-patience`
- **Any language:** Queue library

## Cross-Platform

Works as a queue that any AI tool can use. Actions are queued and released based on conditions.

## Comparison

| | Reflex (blocks) | Patience (new) |
|---|---|---|
| What it does | Blocks bad actions | Delays actions until ready |
| Response | "Don't do that" | "Wait until it's time" |
| User experience | Prevents mistakes | Prevents premature actions |
| Example | Block delete without backup | Wait for tests before deploy |
