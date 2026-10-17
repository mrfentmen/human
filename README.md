# Human — AI Capability Concepts

A collection of 32 AI capability concepts, each named after a human quality. Each concept makes AI better, faster, more real.

## The Concept

AI tools today are built around "skills" (MD files) and "MCP servers" (external processes). These work, but they're limited:
- Skills are manually written and static
- MCP servers are external processes that need connections
- Neither is automatic or adaptive

"Human" introduces a new paradigm: **AI capabilities named after human qualities**, each with a different delivery mechanism. Not all files, not all servers. The format matches the concept.

## Concepts

### File-Based (5 concepts)
| # | Concept | Directory | Human Quality | What It Does |
|---|---------|-----------|--------------|--------------|
| 1 | **Reflexes** | `reflexes/` | Reflexes | Pre-action verification |
| 2 | **Habituate** | `habituate/` | Habits | Automatic behaviors through repetition |
| 3 | **Instinctive** | `instinctive/` | Instincts | Fast pattern matching without reasoning |
| 4 | **Retrospectively** | `retrospectively/` | Hindsight | Learning from past failures |
| 5 | **Peripheral** | `peripheral/` | Peripheral vision | Always-on context awareness |

### Runtime (4 concepts)
| # | Concept | Directory | Human Quality | What It Does |
|---|---------|-----------|--------------|--------------|
| 6 | **Musclemem** | `musclemem/` | Muscle memory | Cached execution paths |
| 7 | **Practicality** | `practicality/` | Common sense | Real-world action validation |
| 8 | **Contextaware** | `contextaware/` | Curiosity | Proactive background exploration |
| 9 | **Empathize** | `empathetic/` | Empathy | User mental state modeling |

### Monitor/Tool (6 concepts)
| # | Concept | Directory | Human Quality | What It Does |
|---|---------|-----------|--------------|--------------|
| 10 | **Conscience** | `conscience/` | Conscience | Ethical action evaluation |
| 11 | **Attend** | `attend/` | Attention | Event-triggered checks |
| 12 | **Shrewdness** | `shrewdness/` | Wisdom | Distilled judgment database |
| 13 | **Perspicacity** | `perspicacity/` | Focus | Narrowing attention |
| 14 | **Prevail** | `prevail/` | Patience | Delaying actions |
| 15 | **Ethicsguard** | `ethicsguard/` | Discipline | Quality enforcement |

### Advanced (5 concepts)
| # | Concept | Directory | Human Quality | What It Does |
|---|---------|-----------|--------------|--------------|
| 16 | **Judicious** | `judicious/` | Judgment | Evaluating quality |
| 17 | **Tasteful** | `tasteful/` | Taste | Aesthetic evaluation |
| 18 | **Overcome** | `overcome/` | Resilience | Adaptive retry |
| 19 | **Foresightful** | `foresightful/` | Foresight | Predicting consequences |
| 20 | **Imagination** | `imagination/` | Imagination | Generating alternatives |

### New (12 concepts)
| # | Concept | Directory | Human Quality | What It Does |
|---|---------|-----------|--------------|--------------|
| 21 | **Humility** | `humility/` | Humility | Admitting uncertainty |
| 22 | **Courage** | `courage/` | Courage | Trying unconventional approaches |
| 23 | **Circumspection** | `circumspection/` | Clarity | Making complex things simple |
| 24 | **Astuteness** | `astuteness/` | Precision | Numerical exactness |
| 25 | **Respectfully** | `respectfully/` | Grace | Elegant error handling |
| 26 | **Adaptability** | `adaptability/` | Adaptability | Adjusting to context |
| 27 | **Rhythmful** | `rhythmful/` | Rhythm | Pacing responses |
| 28 | **Trustful** | `trustful/` | Trust | Building reliability |
| 29 | **Wonderous** | `wonderous/` | Wonder | Recognizing novelty |
| 30 | **Equilib** | `equilib/` | Balance | Weighing trade-offs |
| 31 | **Flowive** | `flowive/` | Flow | Optimal performance state |
| 32 | **Dignified** | `dignified/` | Dignity | Respectful interactions |

## The Naming Principle

Each concept is named after something humans have or wish they had. One word. Instantly understandable. This makes them marketable because people already understand the concept.

## The Format Principle

Each concept uses a DIFFERENT delivery mechanism. Not all files, not all servers. The format matches the concept.

## Directory Structure

```
human/
├── README.md
├── <concept>/          (32 concept dirs, each with spec.md)
├── adapters/           (OpenCode plugin, Claude Code, Cursor, Generic)
├── examples/           (Example .reflex, .habit, etc. files)
├── packages/           (33 npm packages with src/, test/, package.json)
├── shared/             (Base parsers: base-parser.js, base-parser.py)
```

## npm Packages

All 33 packages are published to npm with one-word names:

```bash
npm install reflexes
npm install habituate
npm install musclemem
npm install humankind  # combined package with all 32 concepts
```

## Quick Start

1. Pick a concept from the list above
2. Read its spec.md for the format
3. Use the shared parser to read .concept files
4. Install the npm package or use the adapter for your AI tool
5. Place .concept files in your project root

## Cross-Platform

Each concept has adapters for:
- OpenCode (native plugin)
- Claude Code (CLAUDE.md instructions)
- Cursor (.cursorrules)
- Any AI tool (generic system prompt)

## License

MIT
