# Conscience Specification

## Overview

Conscience is a runtime monitor that watches all AI actions and can halt them if they
violate ethical/safety rules. Not guardrails (which filter content), but a moral compass
that evaluates the INTENT and CONSEQUENCE of actions. "Should I really delete this
production database?"

## Format

Not a file. Not a server. A **runtime monitor** that runs alongside the AI.

## How It Works

1. Monitor starts when AI tool starts
2. Intercepts every AI action before execution
3. Evaluates: "Is this action right? What are the consequences?"
4. If ethical: allow
5. If questionable: warn and ask for confirmation
6. If unethical: block and explain why

## Evaluation Criteria

| Criterion | Description |
|-----------|-------------|
| Reversibility | Can this action be undone? |
| Impact scope | How many users/systems affected? |
| Data sensitivity | Does this involve personal/sensitive data? |
| Consent | Has the user explicitly consented? |
| Proportionality | Is the action proportional to the need? |
| Transparency | Can the action be explained/audited? |

## Delivery

- **Node.js:** `npm install ai-conscience`
- **Python:** `pip install ai-conscience`
- **Any language:** Standalone monitor process

## Cross-Platform

Works as a monitor that any AI tool can integrate. Runs alongside the AI, intercepting actions.

## Comparison

| | Guardrails (content) | Conscience (new) |
|---|---|---|
| What it checks | Is content safe? | Is action right? |
| When it runs | Before output | Before execution |
| Example | "Is this hate speech?" | "Should I delete user data?" |
| Focus | Content filtering | Intent evaluation |
| Severity | Binary (safe/unsafe) | Spectrum (right/questionable/wrong) |
