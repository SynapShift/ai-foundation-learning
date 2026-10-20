# Chapter 3: Transformer Block Flow

[阅读中文版](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/zh/llm/03-transformer-block.md)

[Previous: Hidden states and output](02-hidden-states-and-output.md) | [Next: Autoregressive generation](04-generation.md)

## Attention is not the whole block

`Attention` exchanges information across token positions. The `FFN / MLP` transforms each position separately. A `residual connection` keeps a direct information path, while `LayerNorm / RMSNorm` helps control the scale of inputs to sublayers.

A common `Pre-Norm` block is:

```text
x1 = x  + Attention(Norm(x))
x2 = x1 + FFN(Norm(x1))
```

Here `x`, `x1`, and `x2` are hidden-state tensors. Models vary in normalization order and FFN design; this is one common pattern.

## Four distinct jobs

- Residual: `y = x + F(x)`. If `F(x)` is near zero, the output remains near `x`. This helps preserve an information path through deep networks.
- Norm: LayerNorm generally centers and rescales features; RMSNorm rescales using root-mean-square magnitude without subtracting the mean. Neither is attention softmax.
- Attention: the current position gathers V vectors from permitted positions according to attention weights.
- FFN: the same learned network runs separately at each position, often as `hidden_dim -> intermediate_dim -> hidden_dim`. It does not directly read another position's vector.

There is a subtlety: attention may already have mixed information from position 2 into position 5's vector. The FFN at position 5 can transform that mixed input. Its result can therefore depend *indirectly* on other positions even though the FFN itself is position-wise.

Stacked blocks repeatedly update hidden states. Only the final output head maps a hidden state into vocabulary logits.

## Check your understanding

1. If `F(x)` is approximately zero, what is `x + F(x)` approximately?
2. Without attention or another cross-position operation, can the standard FFN at position 5 directly inspect position 2's current vector?
3. Why can position 5's FFN output nevertheless depend on position 2 after attention?

<details><summary>Reference answers</summary>

1. Approximately `x`, through the residual path.
2. No. A standard FFN applies the same function independently at each position.
3. Attention may already have mixed position 2's information into position 5's input vector.

</details>
