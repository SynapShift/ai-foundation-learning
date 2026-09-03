# Learning Roadmap

This roadmap describes the public learning path for the AI Foundation Learning handbook. It is not a learner's private progress record.

## Guiding Principle

The learning order should follow conceptual dependency, not a fixed calendar.

```text
understand the problem
-> build intuition
-> inspect the data flow
-> introduce the smallest useful formula
-> connect the concept to code and engineering trade-offs
```

## Phase 1: LLM Attention Core

Goal: understand how a Transformer layer routes and mixes token information.

Core path:

```text
Token embedding
-> hidden state
-> Q / K / V projections
-> QK attention scores
-> score scaling with sqrt(head_dim)
-> attention softmax
-> value aggregation
-> new hidden state
```

Key distinctions:

- `Q` and `K` compute relevance scores.
- `V` carries the information mixed by attention weights.
- Attention softmax distributes weight over context tokens.
- The language modeling head maps the final hidden state to vocabulary logits.
- Final softmax distributes probability over vocabulary tokens.

## Phase 2: Transformer Block Flow

Goal: understand why attention is only one part of a Transformer block.

Topics:

- Residual connections
- LayerNorm / RMSNorm
- Feed-forward networks
- Activation functions
- SwiGLU
- Stacking layers
- Why intermediate outputs remain hidden states

## Phase 3: Autoregressive Inference

Goal: understand how LLMs generate text one token at a time.

Topics:

- Vocabulary logits
- Sampling vs greedy decoding
- Temperature
- Top-k and top-p sampling
- Causal mask
- KV cache
- Prefill and decode

## Phase 4: Attention Engineering

Goal: understand why modern LLMs modify standard multi-head attention.

Topics:

- Multi-head attention
- MQA and GQA
- RoPE
- RoPE scaling
- FlashAttention
- Quantization
- Speculative decoding

## Phase 5: Training and Alignment

Goal: understand how LLMs are connected to tools, tasks, evaluation loops, and real working environments.

Topics:

- What an agent is
- Model vs agent vs application
- Tool use
- Planning and reflection
- Memory and state
- Agent harnesses
- Evaluation harnesses
- Task environments
- Failure modes and guardrails
- Product and engineering trade-offs

Key distinctions:

- A model predicts tokens; an agent uses a model inside a task loop.
- A harness is the surrounding structure that calls the model, provides tools, tracks state, runs evaluations, and manages execution.
- Agent capability depends on the model, the tools, the task environment, and the harness design.

## Phase 6: Training and Alignment

Goal: understand how foundation models acquire capabilities and behavior preferences.

Topics:

- Pretraining
- Supervised fine-tuning
- RLHF and RLAIF
- DPO
- Reasoning training
- Evaluation and benchmark limits

## Phase 7: Image Generation Foundations

Goal: understand how generative models represent and create images.

Topics:

- Autoencoders
- VAE
- Latent space
- Diffusion
- Latent diffusion
- Conditioning
- Classifier-free guidance
- DiT
- Flow matching
- Rectified flow

## Phase 8: Video Generation Foundations

Goal: understand how image generation extends into time and motion.

Topics:

- Video representation
- Temporal modeling
- 3D VAE
- Temporal compression
- Spatiotemporal tokens
- Video DiT
- Motion modeling
- Temporal consistency
- Long video generation
- World models

## Maintenance Rule

Public handbook content should be added only after an explanation becomes stable, reusable, and independently readable.
