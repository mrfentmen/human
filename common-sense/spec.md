# Common Sense Specification

## Overview

Common Sense is a middleware layer that validates AI actions against real-world knowledge.
Like a bouncer at a club — every action passes through it before reaching the real world.
"You can't delete a file that's open in another process." "You can't install a package
that conflicts with an existing one."

## Format

Not a file. Not a server. **Middleware** — sits between the AI and the real world.

## How It Works

1. AI proposes an action (write file, run command, install package, etc.)
2. Action passes through Common Sense middleware
3. Middleware checks: "Does this make sense in the real world?"
4. If yes: action proceeds
5. If no: action is blocked or modified with explanation

## Check Types

| Check | Description |
|-------|-------------|
| file_open | Is the file open in another process? |
| dependency_conflict | Does this package conflict with existing ones? |
| disk_space | Is there enough disk space? |
| port_in_use | Is the port already in use? |
| process_running | Is the process already running? |
| env_var_missing | Are required environment variables set? |
| version_conflict | Does this version conflict with requirements? |
| custom | Custom real-world check (shell command) |

## Delivery

- **Node.js:** Express-style middleware: `app.use(commonSense())`
- **Python:** Decorator: `@common_sense`
- **Any language:** HTTP proxy that wraps tool calls

## Cross-Platform

Works as a library that any AI tool can import. The AI tool routes actions through
the middleware before executing them.

## Comparison

| | Guardrails (content) | Common Sense (new) |
|---|---|---|
| What it checks | Is content safe? | Does action make sense? |
| When it runs | Before output | Before execution |
| Example | "Is this hate speech?" | "Is this port in use?" |
| False positives | High (over-blocking) | Low (real-world checks) |
