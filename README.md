English | [简体中文](handbook/zh/README.md)

# AI Foundation Handbook

You type a sentence. A model replies. Between those two events, quite a lot happens, and none of it involves a tiny person hiding in the GPU.

This open, nine-chapter handbook traces the path from a token inside a Transformer to a model inside a tool-using agent. It is written to make the moving parts legible: what each part does, what it does *not* do, and how the pieces fit together. Every chapter includes a short explanation, distinctions worth keeping straight, questions, and reference answers.

## Start reading

- [Browse the English chapters on GitHub](handbook/en/README.md)
- [Read the web edition](https://synapshift.github.io/ai-foundation-learning/en/) (navigation and search included)
- [Start with Chapter 01: Attention](handbook/en/llm/01-attention.md)

No installation or GPU is needed to read along. A pencil may prove more useful than a graphics card here.

## What you will learn

- **Inside the model:** how attention moves information between token positions; how hidden states, logits, and two different softmax operations fit into a Transformer block.
- **While it generates:** why text comes out one token at a time, how sampling changes the choice, and what a KV cache actually saves.
- **While it is trained:** where loss, backpropagation, and the optimizer fit; why pretraining, instruction fine-tuning, and preference alignment are different steps.
- **Around the model:** what evaluation can and cannot establish, and how a model, tools, an agent loop, and a harness divide the work.

By the end, terms such as *GQA*, *DPO*, and *tool dispatcher* should point to mechanisms rather than float around as impressive-looking initials.

## Who this is for

This is a starting point for curious newcomers, developers crossing into LLM work, and product or research practitioners who need to ask better technical questions. You do not need to be able to train a model. Familiarity with vectors and probabilities helps, but the explanations start with the job each mechanism performs.

If you already implement Transformer kernels or run large training jobs, use this as a compact map and a source of teaching questions, not as your primary technical reference.

## What this is not

- A full mathematical derivation of Transformer architectures.
- A recipe for training, fine-tuning, or deploying a production model.
- A benchmark leaderboard or a guarantee about any particular model.
- A prompt collection promising to make every answer correct. That would be a very short and very suspicious chapter.

The goal is a reliable mental model. For implementation details, current model behavior, and empirical claims, consult primary papers, official documentation, and your own tests.

## Learn better alongside it

1. **Trace one example by hand.** Pick a short phrase and sketch which positions can attend to which others, then follow the hidden state to the next-token distribution. Small examples expose fuzzy understanding quickly.
2. **Check the chapter questions before opening the answers.** Explain the mechanism in your own words. If two terms still sound interchangeable, revisit their boundary rather than memorizing a definition.
3. **Pair concepts with a tiny experiment.** Change temperature on the same prompt, inspect a small attention example, or compare a plain model response with an actual tool result. Observe what changed and what did not.
4. **Use deeper sources when you hit the edge of a chapter.** The [original Transformer paper](https://arxiv.org/abs/1706.03762) is a useful next step for architecture; [PyTorch's tensor introduction](https://pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html) helps if the vector notation feels slippery. An AI assistant can quiz you, but verify claims it makes about papers, code, or specific models.

Reading one chapter, drawing one diagram, and answering one question is usually more valuable than collecting twenty tabs. Your browser may disagree.

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
