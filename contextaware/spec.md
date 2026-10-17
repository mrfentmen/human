# Curiosity Specification

## Overview

Curiosity is a background daemon that proactively explores the codebase/environment and
learns things the AI might need later. Not triggered by a user request — runs on its own.
Like a curious person who reads everything "just in case."

## Format

Not a file. Not a server. A **background daemon** that runs continuously.

## How It Works

1. Daemon starts when AI tool starts
2. Continuously scans project: files, dependencies, tests, docs, git history
3. Builds a knowledge base of project structure and patterns
4. When AI needs context, it queries the knowledge base
5. Daemon updates knowledge base as project changes

## What It Discovers

| Discovery | Description |
|-----------|-------------|
| Project structure | File tree, entry points, config files |
| Dependencies | Package versions, conflicts, outdated |
| Test coverage | Which files have tests, which don't |
| API routes | Endpoints, methods, parameters |
| Git history | Recent changes, frequent contributors |
| Code patterns | Common patterns, anti-patterns |
| Documentation | README, docs, comments |

## Delivery

- **Node.js:** `npm install ai-curiosity` (runs as background process)
- **Python:** `pip install ai-curiosity` (runs as background thread)
- **Any language:** Standalone daemon with HTTP API

## Cross-Platform

Works as a daemon that any AI tool can query. The AI tool starts the daemon and
queries it for context when needed.

## Comparison

| | Memory (facts) | Curiosity (new) |
|---|---|---|
| What it stores | What user told AI | What AI discovered on its own |
| When it runs | On demand | Continuously in background |
| Who triggers it | User/AI | Runs automatically |
| What it finds | User-provided facts | Project structure, patterns, issues |
