# AI Foundation Handbook · English Edition

You type a sentence. A model replies. Between those two events, quite a lot happens, and none of it involves a tiny person hiding in the GPU.

This nine-chapter handbook follows the path from a token inside a Transformer to a model inside a tool-using agent. It is a map of what each mechanism does, what it does *not* do, and how the pieces fit together. Every chapter includes an explanation, useful distinctions, questions, and reference answers.

[中文版](https://synapshift.github.io/ai-foundation-learning/zh/)

## What you will learn

- **Inside the model:** how attention moves information between token positions; how hidden states, logits, two different softmax operations, and Transformer blocks connect.
- **While it generates:** why text comes out one token at a time, how sampling changes the choice, and what a KV cache saves.
- **While it is trained:** where loss, backpropagation, and the optimizer fit; why pretraining, SFT, and preference alignment are distinct.
- **Around the model:** what evaluation can and cannot establish, and how models, tools, agents, and harnesses divide the work.

By the end, *GQA*, *DPO*, and *tool dispatcher* should point to mechanisms rather than float around as impressive-looking initials.

## Who this is for

This is for curious newcomers, developers moving into LLM work, and product or research practitioners who need a clearer technical vocabulary. You do not need to know how to train a model. Some familiarity with vectors and probabilities helps, but the explanations begin with the job each mechanism performs.

If you already build Transformer kernels or run large training jobs, use this as a compact map and a source of teaching questions, not your main technical reference.

## What this is not

- A complete mathematical derivation of Transformer architectures.
- A production recipe for training, fine-tuning, or deployment.
- A live benchmark leaderboard or a guarantee about any particular model.
- A collection of magic prompts. That chapter would be suspiciously short.

For implementation details, current model behavior, and empirical claims, consult primary papers, official documentation, and your own tests.

## Where to begin

- **First time here?** Start with [01 Attention](llm/01-attention.md), then follow the path from the model's internals to generation, training, and agent systems.
- **Have a question already?** Use the key questions below to jump to the right chapter.
- **Finished a chapter?** Try its questions in your own words before opening the reference answers. Revisit the explanation whenever you need to.

## Learn better alongside it

1. **Trace one small example.** Draw which token positions can attend to which others, then follow a hidden state to the next-token distribution.
2. **Answer before peeking.** If two terms still sound interchangeable, go back to the boundary between their jobs.
3. **Run a tiny experiment.** Change temperature on the same prompt, inspect a small attention example, or compare a model's tool request with an actual tool result. Change one condition at a time.
4. **Go deeper when a chapter ends.** The [original Transformer paper](https://arxiv.org/abs/1706.03762) is a next step for architecture; [PyTorch's tensor introduction](https://pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html) helps with vector notation. An AI assistant can quiz you, but verify its claims about papers, code, and specific models.

One chapter, one diagram, and one question answered properly usually beat twenty open tabs. Your browser may disagree.

## Nine-chapter reading path

| Chapter | Topic | Key question |
| --- | --- | --- |
| 01 | [Attention and Q/K/V](llm/01-attention.md) | How does information move between token positions? |
| 02 | [Hidden states, logits, and two softmaxes](llm/02-hidden-states-and-output.md) | How does an internal vector become a next-token distribution? |
| 03 | [Transformer block flow](llm/03-transformer-block.md) | What are the roles of attention, FFN, residuals, and normalization? |
| 04 | [Autoregressive generation](llm/04-generation.md) | How are tokens generated and past K/V reused? |
| 05 | [Modern architecture and inference engineering](llm/05-inference-engineering.md) | Which cost does each optimization address? |
| 06 | [Pretraining and parameter updates](llm/06-pretraining.md) | How do loss, backpropagation, and the optimizer change the model? |
| 07 | [Instruction and preference alignment](llm/07-alignment.md) | How do SFT, RLHF, and DPO differ? |
| 08 | [Evaluation, generalization, and reasoning](llm/08-evaluation.md) | What can training and test scores establish? |
| 09 | [Model, Agent, and Harness](llm/09-agent-harness.md) | How do models, tools, and the runtime work together? |

First trace how information moves inside a model. Then see how generation is made practical, how training changes model weights, how answers are evaluated, and what happens when a model becomes part of a tool-using Agent system.
