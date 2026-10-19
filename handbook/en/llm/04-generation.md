# Chapter 4: Autoregressive Generation

[阅读中文版](https://synapshift.github.io/ai-foundation-learning/zh/llm/04-generation/)

[Previous: Transformer block](03-transformer-block.md) | [Next: Inference engineering](05-inference-engineering.md)

## One token at a time

An `autoregressive` language model predicts a next token from the visible prefix, selects one, appends it, and repeats. A `causal mask` prevents a training position from seeing future target tokens; during generation, future tokens do not yet exist.

```text
visible prefix -> model -> vocabulary logits -> token selection -> append -> repeat
```

## How a token is selected

- `Greedy decoding` always chooses the highest-probability candidate.
- `Sampling` draws according to probabilities, so it can choose a lower-ranked candidate.
- `Temperature` divides logits by a positive `T` before softmax. Lower temperatures sharpen relative differences; higher ones flatten the distribution. They do not lower every candidate's probability together.
- `Top-k` keeps the `k` highest-ranked candidates. `Top-p / nucleus sampling` keeps the smallest ranked prefix whose cumulative probability reaches or exceeds `p`. The kept candidates are then renormalized before sampling.

With probabilities `0.55, 0.25, 0.12, 0.08`, `top-p = 0.9` keeps the first three: the cumulative probability first exceeds the threshold at `0.92`. This filters *next-token candidates*, not attention context positions.

## Reusing past computation

`Prefill` processes the initial prompt and builds K/V tensors for its positions. `Decode` then usually processes newly generated tokens one step at a time.

The `KV cache` stores past K/V tensors in each attention layer. A new token's Q can match historical K and gather historical V without recomputing those past projections at every step. New K/V are added to the cache. It is neither a cache of vocabulary probabilities nor a set of persistent model parameters.

## Check your understanding

1. With probabilities `0.6, 0.3, 0.1`, can sampling choose the second option? Can greedy decoding?
2. Does increasing temperature reduce every candidate's probability?
3. Does a KV cache store past K/V, model parameters, or vocabulary probabilities?

<details><summary>Reference answers</summary>

1. Sampling can; greedy cannot while the first remains highest.
2. No. Flattening typically shifts probability mass from higher- to lower-probability candidates.
3. Past K/V tensors in attention layers.

</details>
