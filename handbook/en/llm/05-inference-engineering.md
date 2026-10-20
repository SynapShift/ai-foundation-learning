# Chapter 5: Modern Architecture and Inference Engineering

[阅读中文版](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/zh/llm/05-inference-engineering.md)

[Previous: Autoregressive generation](04-generation.md) | [Next: Pretraining](06-pretraining.md)

## The engineering problem

Generation balances quality, latency, compute, and memory. Techniques aimed at different costs are not interchangeable.

## Attention heads and cache size

`MHA / Multi-Head Attention` uses multiple attention heads with separately learned projections. Even on the same input, their attention weights need not match.

| Structure | Q heads | K/V heads | KV-cache size, all else equal |
| --- | ---: | ---: | --- |
| MHA | 8 | 8 | Largest |
| `GQA / Grouped-Query Attention` | 8 | 2 | Smaller |
| `MQA / Multi-Query Attention` | 8 | 1 | Smallest |

GQA and MQA let multiple Q heads share K/V heads. They reduce the *number* of K/V vectors, not the bit width of each stored value. Quality and efficiency trade-offs depend on the model and workload.

## Position versus visibility

`RoPE / Rotary Position Embedding` introduces position information into Q/K matching. It does not prohibit access to the future; the `causal mask` controls visibility. Extending RoPE to longer contexts has model-dependent quality limits and does not by itself guarantee reliable long-context reasoning.

## Different optimization targets

| Technique | Main mechanism | Not the same as |
| --- | --- | --- |
| `FlashAttention` | IO-aware tiling for efficient exact attention computation | Automatically shrinking the persistent KV cache |
| `KV-cache quantization` | Fewer bits per cached K/V value | Reducing the number of K/V heads |
| `Weight quantization` | Fewer bits per model parameter | Directly quantizing the KV cache |
| `Speculative decoding` | A `draft model` proposes tokens; a `target model` verifies them | Accepting draft tokens unconditionally |

`SwiGLU` is a gating design *inside* an FFN. `MoE / Mixture of Experts` uses a router to choose a small subset of expert FFNs for each token. With eight experts and top-2 routing, a token typically uses two selected experts, not all eight. Expert routing and within-FFN gating are different mechanisms.

## Check your understanding

1. With eight Q heads, which usually has a smaller KV cache: eight K/V heads or one K/V head?
2. Model weights fit in memory, but a long-context KV cache does not. Which technique directly reduces the bit width of cached values?
3. Can RoPE alone prevent a training position from seeing future tokens?
4. Can standard speculative decoding emit draft tokens without target-model verification?

<details><summary>Reference answers</summary>

1. One K/V head (MQA), assuming other dimensions and bit widths are equal.
2. KV-cache quantization. GQA/MQA also reduce cache size, but by reducing K/V head count and generally requiring a compatible model.
3. No. Position information and visibility are distinct; a causal mask handles the latter.
4. No. Target-model verification is central to standard speculative decoding.

</details>
