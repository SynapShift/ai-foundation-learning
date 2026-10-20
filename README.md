English | [简体中文](handbook/zh/README.md)

# AI Foundation Handbook

What happens after you send a sentence to a language model? How does it use context, choose the next token, and eventually work with files and tools?

This open handbook follows those questions through nine chapters, from attention and Transformer blocks to generation, training, evaluation, and agent systems. Each chapter includes explanations, key distinctions, practice questions, and reference answers.

## Start reading

- [Read the English handbook on GitHub](handbook/en/README.md)
- [Read the web edition](https://synapshift.github.io/ai-foundation-learning/en/)
- [Start with Chapter 01: Attention](handbook/en/llm/01-attention.md)

Read in order for the full path, or jump to a chapter when revisiting a topic.

## Chapters

| # | Topic | Key question |
| --- | --- | --- |
| 01 | [Attention and Q/K/V](handbook/en/llm/01-attention.md) | How does information move between token positions? |
| 02 | [Hidden states, logits, and two softmaxes](handbook/en/llm/02-hidden-states-and-output.md) | How does an internal vector become a next-token distribution? |
| 03 | [Transformer block flow](handbook/en/llm/03-transformer-block.md) | What do attention, FFN, residuals, and normalization each do? |
| 04 | [Autoregressive generation](handbook/en/llm/04-generation.md) | How are tokens generated one at a time? |
| 05 | [Inference engineering](handbook/en/llm/05-inference-engineering.md) | Which cost does each optimization address? |
| 06 | [Pretraining and parameter updates](handbook/en/llm/06-pretraining.md) | How do loss, backpropagation, and the optimizer change a model? |
| 07 | [Instruction and preference alignment](handbook/en/llm/07-alignment.md) | How do SFT, RLHF, and DPO differ? |
| 08 | [Evaluation and generalization](handbook/en/llm/08-evaluation.md) | What can training and test scores establish? |
| 09 | [Model, Agent, and Harness](handbook/en/llm/09-agent-harness.md) | How do models, tools, and the runtime work together? |

Licensed under [MIT](LICENSE).
