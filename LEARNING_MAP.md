# Learning Map

This map emphasizes dependency relationships rather than a fixed course order. The learning path can move across LLMs, image generation, and video generation depending on interest, prerequisites, and understanding.

```text
Foundation Models
|
+-- LLM
|   |
|   +-- Transformer
|   |   |
|   |   +-- Embedding
|   |   +-- Attention
|   |   |   +-- QKV
|   |   |   +-- Scaling
|   |   |   +-- Softmax
|   |   |   +-- Multi-Head Attention
|   |   |   +-- Causal Mask
|   |   |   +-- RoPE
|   |   |   +-- KV Cache
|   |   |   +-- GQA / MQA
|   |   |   +-- FlashAttention
|   |   |
|   |   +-- FFN
|   |       +-- Activation
|   |       +-- SwiGLU
|   |       +-- MoE
|   |
|   +-- Training
|   |   +-- Pretraining
|   |   +-- SFT
|   |   +-- RLHF / RLAIF
|   |   +-- DPO
|   |   +-- Reasoning
|   |
|   +-- Inference
|   |   +-- KV Cache
|   |   +-- Quantization
|   |   +-- Distillation
|   |   +-- Speculative Decoding
|   |
|   +-- Agent Systems
|       +-- Agent
|       |   +-- Tool Use
|       |   +-- Planning
|       |   +-- Memory / State
|       |   +-- Reflection
|       |
|       +-- Harness
|           +-- Model Calling Loop
|           +-- Tool Router
|           +-- Task Environment
|           +-- Evaluation Harness
|           +-- Guardrails
|
+-- Image Generation
|   +-- AutoEncoder
|   +-- VAE
|   +-- Latent Space
|   +-- Diffusion
|   +-- Latent Diffusion
|   +-- Conditioning
|   +-- CFG
|   +-- DiT
|   +-- Flow Matching
|   +-- Rectified Flow
|
+-- Video Generation
    +-- Video Representation
    +-- Temporal Modeling
    +-- 3D VAE
    +-- Temporal Compression
    +-- Spatiotemporal Tokens
    +-- Video DiT
    +-- Motion Modeling
    +-- Temporal Consistency
    +-- Long Video Generation
    +-- World Models
```

## Suggested Early Route

1. Attention: why models need token-to-token information routing.
2. Q / K / V: how the same hidden state is projected into different functional spaces.
3. Scaled dot-product attention: why score scale matters before softmax.
4. Softmax: how scores become weights.
5. Value aggregation: how information is mixed after attention weights are computed.
6. Hidden states and vocabulary logits: why attention output is not the final token probability.
7. Temperature: how logit scaling changes softmax sharpness.
8. Agent and harness basics: how models become task-running systems.
