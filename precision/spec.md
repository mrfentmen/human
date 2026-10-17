# Precision Specification

## Overview

Precision is a system that ensures exactness in measurements, calculations, and outputs.
No "approximately" or "around." Like a scientist who measures twice and cuts once.

## Format

Not a file. Not a server. A **verification engine** that checks exactness.

## How It Works

1. AI generates output with numbers, calculations, or measurements
2. Precision checks: "Are these exact? Are there rounding errors?"
3. If imprecise: Precision corrects or flags
4. If exact: output is delivered

## Check Types

| Check | Description |
|-------|-------------|
| math_accuracy | Are calculations correct? |
| unit_consistency | Are units consistent? |
| rounding | Are numbers rounded appropriately? |
| significant_figures | Are significant figures correct? |
| currency | Are monetary values exact? |
| dates | Are dates and times exact? |

## Delivery

- **Node.js:** `npm install ai-precision`
- **Python:** `pip install ai-precision`
- **Any language:** Precision verification library

## Cross-Platform

Works as a verification engine that any AI tool can use. Checks numerical accuracy.

## Comparison

| | Discipline (rules) | Precision (new) |
|---|---|---|
| What it checks | Does it meet rules? | Is it numerically exact? |
| Example | "No console.log" | "2+2=4, not 4.0000001" |
| Focus | Code quality | Numerical accuracy |
| Output | Pass/fail | Corrected value |
