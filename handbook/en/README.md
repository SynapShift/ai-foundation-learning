# AI Foundation Handbook · English Edition

Start with information flow inside a language model, then continue through inference, training, evaluation, and agent systems. Every chapter has an explanation, key distinctions, questions, and expandable reference answers. Read in order or jump to a topic.

[中文版](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/zh/README.md)

## LLM Course Contents

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

This public material is reusable and depersonalized. It contains no individual's progress, actual answers, or ability assessment.
