# 第 4 章：自回归生成

[Read in English](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/en/llm/04-generation.md)

[上一章：Transformer Block](03-transformer-block.md) | [下一章：推理工程](05-inference-engineering.md)

## 一次生成一个 Token

`Autoregressive（自回归）`语言模型根据可见前缀预测下一 token，选出一个、加入前缀，然后重复。`Causal mask（因果掩码）`阻止某个位置在训练时偷看未来的目标 token；实际生成时，未来 token 尚不存在。

```text
可见前缀 -> 模型 -> 词表 logits -> 选择 token -> 加入前缀 -> 重复
```

## 如何选择

- `Greedy decoding（贪心解码）`总选当前概率最高的候选项。
- `Sampling（采样）`按概率抽取，因此也可能选到非第一名。
- `Temperature（温度）`在 softmax 前用正数 `T` 除 logits。较低温度使相对差距更尖锐，较高温度使分布更平；不是让每个候选项的概率都一起下降。
- `Top-k`仅保留排名前 `k` 的候选项；`top-p / nucleus sampling（核采样）`按概率排序，保留累计概率达到或超过 `p` 的最短前缀，然后在保留项上重新归一化再采样。

例如概率为 `0.55、0.25、0.12、0.08`，`top-p = 0.9` 会保留前三项，因为累计到第三项才达到 `0.92`。这筛选的是**下一 token 候选项**，不是 Attention 的上下文位置。

## 复用过去的计算

`Prefill（提示词预处理）`处理初始提示词并建立各层 K/V。`Decode（逐步生成）`随后通常每次处理一个新生成的 token。

`KV cache（键值缓存）`保存各层过去位置的 K/V，让新 token 的 Q 与历史 K 计算 Attention、再汇集历史 V，而无需每步重算所有过去位置的 K/V。新的 K/V 也会加入缓存。它**不是**词表概率缓存，也**不是**持久的模型参数。

## 理解检查

1. 概率为 `0.6、0.3、0.1` 时，采样可能选第二项吗？贪心解码呢？
2. 调高温度会让所有候选项的概率都下降吗？
3. KV cache 保存的是过去的 K/V、模型参数，还是词表概率？

<details><summary>参考答案</summary>

1. 采样可能；第一项仍最高时，贪心不会。
2. 不会。分布变平时，高概率项通常失去部分概率质量，低概率项则得到部分概率质量。
3. 保存各 Attention 层过去位置的 K/V。

</details>
