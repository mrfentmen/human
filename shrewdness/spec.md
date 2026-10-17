# Wisdom Specification

## Overview

Wisdom is a shared knowledge base that accumulates distilled judgment over time. Not
memory (stores facts), not skills (stores procedures). Wisdom stores "what I've learned
about how to approach problems." Like a mentor's accumulated advice.

## Format

Not a file. Not a server. A **database/service** that any AI can query.

## Data Structure

```json
{
  "id": "uuid",
  "topic": "authentication in nextjs",
  "judgment": "Use NextAuth.js for most cases. Only use custom JWT if you need fine-grained control.",
  "lessons": [
    "Common mistake: forgetting to set NEXTAUTH_SECRET in production",
    "NextAuth works best with Prisma adapter",
    "Don't use JWT strategy for sessions — use database strategy"
  ],
  "confidence": 0.92,
  "source_count": 50,
  "created": "2026-10-16T00:00:00Z",
  "updated": "2026-10-16T12:00:00Z",
  "tags": ["nextjs", "auth", "security"]
}
```

## How It Works

1. AI completes a task or encounters a problem
2. System distills the experience into "wisdom" (not facts, but judgment)
3. Wisdom is stored in the shared database
4. When AI faces a similar problem, it queries Wisdom
5. Wisdom returns distilled judgment, not raw facts
6. Wisdom improves as more experiences are added

## Delivery

- **Node.js:** `npm install ai-wisdom`
- **Python:** `pip install ai-wisdom`
- **Any language:** REST API to a shared service

## Cross-Platform

Works as a shared service that any AI can query. Wisdom is shared across all AI tools
and all users (with privacy controls).

## Comparison

| | Memory (facts) | Wisdom (new) |
|---|---|---|
| What it stores | "What happened" | "What was learned" |
| How it's queried | "What do I know about X?" | "What's the best approach for X?" |
| Return type | Facts | Judgment + lessons |
| Improves over time | No (static facts) | Yes (more experiences = better judgment) |
| Scope | Per-user or per-project | Shared across all users |
