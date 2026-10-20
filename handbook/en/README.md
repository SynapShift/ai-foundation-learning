# AI Foundation Handbook · English Edition

What actually happens after you send a sentence to a model? How does it use earlier tokens, choose the next one, and eventually work with files and tools?

This nine-chapter handbook follows that trail, one mechanism at a time. The point is not to memorize a glossary, but to see what problem each idea solves.

[中文版](https://synapshift.github.io/ai-foundation-learning/zh/)

## Where to begin

- **First time here?** Start with [01 Attention](llm/01-attention.md), then follow the path from the model's internals to generation, training, and agent systems.
- **Have a question already?** Use the key questions below to jump to the right chapter.
- **Finished a chapter?** Try its questions in your own words before opening the reference answers. Revisit the explanation whenever you need to.

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
