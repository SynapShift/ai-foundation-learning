# Chapter 7: Instruction and Preference Alignment

[阅读中文版](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/zh/llm/07-alignment.md)

[Previous: Pretraining](06-pretraining.md) | [Next: Evaluation](08-evaluation.md)

## Four terms at different levels

| Term | Signal or role | Simplified example |
| --- | --- | --- |
| `Pretraining` | Broad token sequences, often next-token prediction | Learn continuation patterns |
| `SFT / Supervised Fine-Tuning` | Instruction and demonstration response | Learn how to answer this kind of request |
| `Preference alignment` | Goal or family of methods favoring preferred behavior | Prefer answer B over answer A |
| `RLHF / Reinforcement Learning from Human Feedback` | One alignment route, classically with a reward model and RL | Learn preference scores, then optimize a generator |

All may ultimately change parameters and make certain outputs more likely, but their **data signals and optimization procedures differ**. Ordinary pretraining does not require a human preference label on every text example.

## Prompting is not SFT

In a normal chat, an instruction such as "summarize in three points" enters the current `context`. By itself it does not update persistent model weights. SFT uses many instruction-demonstration examples to compute a training loss and update parameters, so the change can affect later requests. The model does not literally store one fixed answer for every demonstration prompt.

## Preference pairs, RLHF, and DPO

Suppose A and B answer the same request and B is preferred. The pair provides *comparative* information, not just an example of B. Classical RLHF often trains a `reward model` from comparisons, then uses reinforcement learning to improve the answer-generating `policy model`. `DPO / Direct Preference Optimization` uses preferred and rejected responses directly in a preference objective, without that separate reward-model-plus-RL training loop. The rejected answer A still contributes information; DPO is not simply SFT on B.

Real pipelines vary in data sources, reference models, optimization details, and safety constraints. These are the conceptual boundaries.

## Check your understanding

1. Does typing "summarize in three points" in an ordinary chat change the model's weights?
2. What extra information does "B is preferred to A" provide beyond showing B alone?
3. Is preference alignment one algorithm at the same level as DPO and RLHF?

<details><summary>Reference answers</summary>

1. No. Ordinary prompting changes the current context, not persistent weights.
2. It states a relative preference between two answers to the same request, including information about the rejected answer.
3. No. It is a goal or family; RLHF and DPO are different approaches within it.

</details>
