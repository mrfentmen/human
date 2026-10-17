# Empathy Specification

## Overview

Empathy is an SDK/library that gives AI the ability to model the user's mental state.
Not memory (stores facts), but a dynamic model of "who the user is" — what they know,
what they care about, how they communicate, what they're trying to achieve.

## Format

Not a file. Not a server. An **SDK/Library** that any AI tool can import.

## Data Model

```typescript
interface UserModel {
  knowledge: {
    level: 'beginner' | 'intermediate' | 'expert';
    domains: string[];
    gaps: string[];
  };
  preferences: {
    communicationStyle: 'concise' | 'detailed' | 'casual' | 'formal';
    codeStyle: string;
    verbosity: number; // 0-1
  };
  emotionalState: {
    frustration: number; // 0-1
    confidence: number; // 0-1
    urgency: number; // 0-1
  };
  goals: {
    current: string;
    history: string[];
  };
  patterns: {
    frequentRequests: string[];
    commonErrors: string[];
    preferredTools: string[];
  };
}
```

## How It Works

1. AI imports the Empathy SDK
2. SDK tracks user interactions over time
3. SDK builds and updates a UserModel
4. Before responding, AI queries the UserModel
5. AI adapts response based on user state:
   - Frustrated user → simpler, more direct response
   - Expert user → technical, concise response
   - Beginner user → detailed, educational response

## Delivery

- **Node.js:** `npm install ai-empathy`
- **Python:** `pip install ai-empathy`
- **Any language:** REST API to a local service

## Cross-Platform

Works as a library that any AI tool can import.

## Comparison

| | Memory (facts) | Empathy (new) |
|---|---|---|
| What it stores | "User prefers dark mode" | "User is frustrated, needs simple answers" |
| How it's used | Retrieved as context | Adapts response style |
| What it tracks | Explicit preferences | Implicit emotional state |
| Granularity | Fact-level | State-level |
