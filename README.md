# Human — AI Capability Concepts

A collection of 20 AI capability concepts, each named after a human quality. Each concept makes AI better, faster, more real.

## The Concept

AI tools today are built around "skills" (MD files) and "MCP servers" (external processes). These work, but they're limited:
- Skills are manually written and static
- MCP servers are external processes that need connections
- Neither is automatic or adaptive

"Human" introduces a new paradigm: **AI capabilities named after human qualities**, each with a different delivery mechanism. Not all files, not all servers. The format matches the concept.

## Concepts

### File-Based (5 concepts)
| # | Concept | Human Quality | What It Does |
|---|---------|--------------|--------------|
| 1 | **Reflex** | Reflexes | Pre-action verification |
| 2 | **Habit** | Habits | Automatic behaviors through repetition |
| 3 | **Instinct** | Instincts | Fast pattern matching without reasoning |
| 4 | **Hindsight** | Hindsight | Learning from past failures |
| 5 | **Peripheral** | Peripheral vision | Always-on context awareness |

### Runtime (4 concepts)
| # | Concept | Human Quality | What It Does |
|---|---------|--------------|--------------|
| 6 | **Muscle Memory** | Muscle memory | Cached execution paths |
| 7 | **Common Sense** | Common sense | Real-world action validation |
| 8 | **Curiosity** | Curiosity | Proactive background exploration |
| 9 | **Empathy** | Empathy | User mental state modeling |

### Monitor/Tool (6 concepts)
| # | Concept | Human Quality | What It Does |
|---|---------|--------------|--------------|
| 10 | **Conscience** | Conscience | Ethical action evaluation |
| 11 | **Attention** | Attention | Event-triggered checks |
| 12 | **Wisdom** | Wisdom | Distilled judgment database |
| 13 | **Focus** | Focus | Narrowing attention |
| 14 | **Patience** | Patience | Delaying actions |
| 15 | **Discipline** | Discipline | Quality enforcement |

### Advanced (5 concepts)
| # | Concept | Human Quality | What It Does |
|---|---------|--------------|--------------|
| 16 | **Judgment** | Judgment | Evaluating quality |
| 17 | **Taste** | Taste | Aesthetic evaluation |
| 18 | **Resilience** | Resilience | Adaptive retry |
| 19 | **Foresight** | Foresight | Predicting consequences |
| 20 | **Imagination** | Imagination | Generating alternatives |

## The Naming Principle

Each concept is named after something humans have or wish they had. One word. Instantly understandable. This makes them marketable because people already understand the concept.

## The Format Principle

Each concept uses a DIFFERENT delivery mechanism. Not all files, not all servers. The format matches the concept:
- Reflexes are rules → files
- Muscle memory is automatic → cache
- Common sense is a filter → middleware
- Curiosity is proactive → daemon
- Empathy is a capability → SDK
- Conscience is a guard → monitor
- Attention is event-based → hooks
- Wisdom is shared → database

## Directory Structure

```
human/
├── README.md
├── concepts/
│   ├── reflex/
│   │   ├── spec.md
│   │   ├── parser.js
│   │   ├── parser.py
│   │   ├── examples/
│   │   └── adapters/
│   ├── habit/
│   │   └── ...
│   └── ...
└── shared/
    ├── base-parser.js
    └── base-parser.py
```

## Quick Start

1. Pick a concept from the list above
2. Read its spec.md for the format
3. Use the parser to read .concept files
4. Install the adapter for your AI tool
5. Place .concept files in your project root

## Cross-Platform

Each concept has adapters for:
- OpenCode (native plugin)
- Claude Code (CLAUDE.md instructions)
- Cursor (.cursorrules)
- Any AI tool (generic system prompt)

## License

MIT
