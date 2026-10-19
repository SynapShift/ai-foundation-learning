# 第 2 章：Hidden State、Logits 与两次 Softmax

[Read in English](https://synapshift.github.io/ai-foundation-learning/en/llm/02-hidden-states-and-output/)

[上一章：Attention](01-attention.md) | [下一章：Transformer Block](03-transformer-block.md)

## 为什么需要这一章

Attention 的输出是更新后的向量，不是一个字或词。模型还要把最终向量转换成词表中每个候选 token 的分数，才能预测下一个 token。

`Token embedding（词元嵌入）`把 token ID 变成向量。经过多层 Transformer 后，这些向量成为不断更新的 `hidden state（隐藏状态）`。最终位置的 hidden state 经过 `lm_head（语言模型输出层）`，得到词表中每个候选 token 的 `logit（未归一化分数）`；最终 softmax 再把 logits 变成概率。

```text
可见 token -> embedding -> Transformer 各层 -> 最终 hidden state
                                        -> lm_head -> 词表 logits
                                        -> 最终 softmax -> 下一 token 的概率
```

`lm_head` 通常是线性投影，例如 `logits = h @ W_vocab`。有的模型与输入 embedding 共享权重，但这不改变数据流中的角色区别。

## 两次 Softmax 不在同一个地方

| 操作 | 输入 | 在谁之间分配 | 用途 |
| --- | --- | --- | --- |
| Attention softmax | Q/K 匹配分数 | 当前可见的 key 位置 | 给 V 加权，更新 hidden state |
| 最终 softmax | 词表 logits | 下一 token 的候选项 | 得到生成概率 |

假设提示词是“我想吃一个”，下一步选中了“苹果”。在**预测苹果之前**，attention 只能对已有的可见位置分配权重；最终 softmax 才会对“苹果”“香蕉”等下一 token 候选项分配概率。只有“苹果”被选中并加入上下文后，它才能在**再下一步**成为可见位置。token 不一定刚好对应一个汉字或完整词语。

## 理解检查

1. 一层 Attention 的输出形状为 `[sequence_length, hidden_dim]`，这已经是词表概率了吗？
2. 哪次 softmax 在可见位置之间分配权重？哪次在下一 token 候选项之间分配概率？
3. “苹果”加入上下文后，下一轮 Attention 能否把它作为可见位置？

<details><summary>参考答案</summary>

1. 不是。它仍是 hidden state；还要经过后续层和 `lm_head`。
2. Attention softmax 对可见 key 位置分配权重；最终 softmax 对词表候选项分配概率。
3. 可以，但仍受上下文窗口和掩码规则约束。

</details>
