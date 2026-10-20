# Chapter 1: Attention and Q/K/V

[阅读中文版](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/zh/llm/01-attention.md)

[Next: Hidden states and output](02-hidden-states-and-output.md)

## Why attention matters

A token's meaning depends on context. In "The animal did not cross the street because it was tired," interpreting `it` requires information from earlier words. `Attention` provides a way to select and combine information across token positions.

## From intuition to computation

Each position starts with a `hidden state` vector. Three learned linear projections of that same vector produce:

- `Q / Query`: what this position seeks.
- `K / Key`: how this position can be matched.
- `V / Value`: the information it can contribute after matching.

The shorthand "Q/K decide where to look; V supplies what to take" is an intuition, not the full definition. Q, K, and V are not three independent raw inputs, nor do projections create information from nothing.

## Scaled dot-product attention

```python
scores = q @ k.transpose(-2, -1)
scores = scores / math.sqrt(head_dim)
weights = torch.softmax(scores, dim=-1)
output = weights @ v
```

If `q` has shape `[batch, heads, query_tokens, head_dim]` and `k` has shape `[batch, heads, key_tokens, head_dim]`, `scores` has shape `[batch, heads, query_tokens, key_tokens]`. Each score measures how a query position matches a visible key position. In an autoregressive model, future positions are masked before softmax.

Why divide by `sqrt(head_dim)`? Larger head dimensions can produce larger Q/K dot products, making softmax too sharp. This is `score scaling`, not unit-vector normalization or the centering and rescaling performed by LayerNorm.

Attention softmax distributes weights over visible key positions; for each query, those weights sum to one. `weights @ v` then mixes the corresponding value vectors. Softmax provides weights, while V carries the information being mixed.

## Check your understanding

1. What are the distinct jobs of Q/K and V?
2. Does division by `sqrt(head_dim)` make every Q vector have length one?
3. Does attention softmax weight context positions or directly assign next-token vocabulary probabilities?
4. Must two heads given the same input have identical attention weights?

<details><summary>Reference answers</summary>

1. Q/K produce matching scores; the resulting weights are applied to V.
2. No. It scales scores, not vector lengths.
3. Visible key positions. Vocabulary probabilities are produced later by the output head.
4. No. Heads can have different learned projection parameters.

</details>
