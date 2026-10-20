# Chapter 8: Evaluation, Generalization, and Reasoning

[阅读中文版](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/zh/llm/08-evaluation.md)

[Previous: Instruction and preference alignment](07-alignment.md) | [Next: Agent and Harness](09-agent-harness.md)

## What can a score establish?

`Training loss` describes fit on training examples. A lower value is useful feedback, but it does not prove performance on new examples. Distinguish at least three levels of evidence:

1. `Training set`: examples used for parameter updates.
2. `Held-out in-domain set`: unused examples from a similar distribution.
3. `Out-of-domain set`: new domains, formats, or distributions.

A good held-out score only supports a claim about the tested distribution and measurement method. Data leakage, benchmark overfitting, vague grading, and distribution shift can all mislead. Always inspect a benchmark's scope, scoring method, and limitations.

## Reasoning is not just length

`Reasoning training` can use worked solutions, verifiable outcomes, or other supervision to improve multi-step problem solving. A long explanation is not proof of correctness. Evaluate the result against the task: correctness, evidence, required format, applicable safety constraints, and whether the user's problem was actually solved. Some tasks have automatically verifiable answers; open-ended tasks may not.

## Check your understanding

1. Training loss falls. Does that prove the model handles new articles from the same domain?
2. It passes a held-out in-domain set. Does that prove quality in an unrelated domain?
3. Is a long reasoning trace by itself evidence of task success?

<details><summary>Reference answers</summary>

1. No. Evaluate examples not used for training.
2. No. Cross-domain performance needs its own evidence.
3. No. Check the final result and the task's constraints.

</details>
