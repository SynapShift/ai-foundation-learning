# 第 5 章：现代架构与推理工程

[Read in English](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/en/llm/05-inference-engineering.md)

[上一章：自回归生成](04-generation.md) | [下一章：预训练](06-pretraining.md)

## 要解决的工程问题

生成质量、延迟、算力与显存之间存在取舍。下面几种方法针对的成本不同，不能只因为都叫“优化”就混为一谈。

## 注意力头和缓存大小

`MHA / Multi-Head Attention（多头注意力）`使用多个分别投影的注意力头。即使输入相同，头的 Q/K/V 投影参数不同，注意力权重也未必相同。

| 结构 | Q 头数 | K/V 头数 | 其他条件相同时的 KV 缓存 |
| --- | ---: | ---: | --- |
| MHA | 8 | 8 | 最大 |
| GQA / Grouped-Query Attention（分组查询注意力） | 8 | 2 | 较小 |
| MQA / Multi-Query Attention（多查询注意力） | 8 | 1 | 最小 |

GQA/MQA 让多个 Q 头共享 K/V 头，减少的是**K/V 头的数量**，不是每个数值的位数。质量与效率的具体取舍取决于模型和工作负载。

## 位置与可见性

`RoPE / Rotary Position Embedding（旋转位置编码）`给 Q/K 的匹配引入位置信息，但它不负责禁止看到未来。`Causal mask（因果掩码）`才约束可见位置。RoPE 的长上下文扩展也有模型相关的质量边界，不能单靠修改位置处理保证长文本推理可靠。

## 看起来相似、其实目标不同

| 技术 | 主要机制 | 不等于 |
| --- | --- | --- |
| `FlashAttention` | 通过分块和减少显存读写，高效计算精确 Attention | 自动缩小持久 KV cache |
| `KV-cache quantization（KV 缓存量化）` | 降低缓存中每个 K/V 数值的位数 | 减少 K/V 头数 |
| `Weight quantization（权重量化）` | 降低模型参数的存储位数 | 直接量化 KV cache |
| `Speculative decoding（推测解码）` | `draft model（草稿模型）`提出 token，`target model（目标模型）`验证 | 草稿结果直接无条件采用 |

`SwiGLU` 是一个 FFN 内部的门控设计；`MoE / Mixture of Experts（混合专家）`则由 router 为每个 token 选择少量专家 FFN。八个专家、top-2 路由，通常是每个 token 用两个被选中的专家，而不是八个都运行。“专家选择”和“单个 FFN 内的门控”是不同层面的事。

## 理解检查

1. 同为八个 Q 头，八个 K/V 头与一个 K/V 头，谁的 KV cache 通常更小？
2. 模型参数放得下，但长上下文 KV cache 占满显存；哪种方法直接降低缓存数值的位数？
3. 仅用 RoPE 能防止训练位置偷看未来吗？
4. 标准推测解码能跳过目标模型验证，直接输出草稿 token 吗？

<details><summary>参考答案</summary>

1. 一个 K/V 头，即 MQA；前提是其他维度和位数相同。
2. KV-cache quantization。GQA/MQA 也能减缓存，但靠减少 K/V 头数，通常需要兼容的模型架构。
3. 不能；位置信息和可见性是不同问题，需要 causal mask。
4. 不能；目标模型验证是标准推测解码保持结果正确性的关键。

</details>
