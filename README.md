# AI Foundation Learning

A beginner-friendly, adaptive learning handbook for understanding foundation models from first principles.

一套面向初学者、强调理解而非背概念的 AI 基础模型学习体系。

This project is not a personal learning diary. It is a public knowledge base for learning foundation models such as LLMs, image generation models, and video generation models in a more approachable order.

## Learning Philosophy

The core learning path is:

```text
Why this technology is needed
-> The intuition
-> How real models implement it
-> Why the formulas are written this way
-> How it connects to nearby ideas
-> What problem it solves in engineering
```

The handbook favors understanding depth over speed. It avoids treating foundation model learning as a list of terms to memorize.

## What This Repository Contains

- `LEARNING_MAP.md`: a dependency-oriented knowledge map.
- `ROADMAP.md`: a phased public roadmap for learning foundation models.
- `handbook/`: beginner-friendly explanations that can be read independently.
- `exercises/`: reusable exercises for checking understanding.
- `notes/`: glossary entries and common misconceptions.
- `prompts/`: reusable prompts for adaptive AI tutoring and self-study.
- `AGENTS.md`: long-term rules for maintaining the learning system.

## Privacy Boundary

Public materials in this repository should be general, reusable, and depersonalized.

Private learning state, including personal progress, mastery level, mistakes, daily logs, and learning diagnostics, belongs in `.local-learning/`. That directory is ignored by Git and must not be committed or pushed.

## Current Public Starting Point

The initial public content starts with the LLM attention path:

```text
Attention
-> Q / K / V
-> Scaled Dot-Product Attention
-> Softmax
```

More topics will be added only when the explanation is stable enough to be useful for other learners.
