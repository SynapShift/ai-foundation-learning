# Chapter 6: Pretraining and Parameter Updates

[阅读中文版](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/zh/llm/06-pretraining.md)

[Previous: Inference engineering](05-inference-engineering.md) | [Next: Instruction and preference alignment](07-alignment.md)

## What is learned?

`Model weights` are persistent values in projections, embeddings, FFNs, and other trainable components. They are not the attention weights from one forward pass, one step's vocabulary probabilities, or a temporary KV cache.

Common language-model `pretraining` uses large token sequences to predict target tokens from preceding context. A simplified training step is:

```text
input tokens -> forward pass -> predicted target-token probability
             -> loss -> backpropagation -> optimizer -> updated model weights
```

`Loss` measures the mismatch between prediction and target. A common single-token loss is `-log p(target | context)`: a lower target probability gives a larger loss. `Backpropagation` computes gradients of the loss with respect to trainable parameters; the `optimizer` uses those gradients to update the parameters. KV cache mainly reuses computation at inference time; it is not the persistent object being learned here.

Broad next-token training can teach language and world patterns, but it does not alone guarantee reliable instruction following, factuality, safety, or success on a practical task. Those outcomes need appropriate training signals and evaluation evidence.

## Check your understanding

1. A training example assigns too little probability to its target token. What may persistently change after an optimizer step?
2. Which component computes gradients, and which applies parameter updates?
3. Does low training loss prove the model follows a new user's instructions well?

<details><summary>Reference answers</summary>

1. Trainable model weights, subject to freezing and optimizer settings.
2. Backpropagation computes gradients; the optimizer updates parameters.
3. No. Fit on training data and behavior on new instructions are different claims.

</details>
