# 第 3 章：Transformer Block 的数据流

[Read in English](https://synapshift.github.io/ai-foundation-learning/en/llm/03-transformer-block/)

[上一章：Hidden State 与输出](02-hidden-states-and-output.md) | [下一章：自回归生成](04-generation.md)

## Attention 不是整个 Block

`Attention（注意力）`负责在 token 位置之间交换信息。`FFN / MLP（前馈网络）`分别加工每个位置的向量。`Residual connection（残差连接）`给信息提供直接通路；`LayerNorm / RMSNorm（归一化层）`帮助稳定进入子层的数值尺度。

一种常见的 `Pre-Norm（前置归一化）`写法是：

```text
x1 = x  + Attention(Norm(x))
x2 = x1 + FFN(Norm(x1))
```

`x`、`x1`、`x2` 都是 hidden state。不同模型的归一化顺序和 FFN 结构可能不同，上式只是常见形式。

## 四种工作不要混在一起

- 残差：`y = x + F(x)`。当 `F(x)` 接近零，输出仍接近 `x`。这有助于深层网络保留信息通路，不代表输出总等于输入。
- 归一化：LayerNorm 通常对特征减均值、按标准差缩放；RMSNorm 主要按均方根尺度缩放，不减均值。它们不是 attention softmax。
- Attention：当前位置根据权重汇集允许看见的位置的 V 向量。
- FFN：同一套参数在每个位置**分别**运行，常见结构是 `hidden_dim -> intermediate_dim -> hidden_dim`。它本身不直接读取另一个位置的向量。

但要注意：如果 Attention 已把位置 2 的信息混入位置 5 的向量，随后位置 5 的 FFN 就能加工这份混合信息。因此 FFN 的结果可以**间接**受其他位置影响，即使 FFN 的计算本身是逐位置的。

多层 Block 反复更新 hidden state；到最后才由输出层映射到词表 logits。

## 理解检查

1. 若 `F(x)` 约等于零，`x + F(x)` 大约是什么？
2. 没有 Attention 等跨位置操作时，位置 5 的标准 FFN 能直接查看位置 2 的当前向量吗？
3. 为什么经过 Attention 后，位置 5 的 FFN 输出仍可能受位置 2 影响？

<details><summary>参考答案</summary>

1. 大约是 `x`，残差通路保留了输入。
2. 不能。标准 FFN 在每个位置独立应用同一函数。
3. 位置 2 的信息可能已被 Attention 混入位置 5 的输入向量。

</details>
