# 第 6 章：预训练与参数更新

[Read in English](https://synapshift.github.io/ai-foundation-learning/en/llm/06-pretraining/)

[上一章：推理工程](05-inference-engineering.md) | [下一章：指令与偏好对齐](07-alignment.md)

## 到底学到了哪里

`Model weights（模型参数）`是投影矩阵、embedding、FFN 等组件里可持久保存的数值。它们不同于某次前向计算得到的 attention 权重、某一步的词表概率，也不同于临时的 KV cache。

常见语言模型的 `Pretraining（预训练）`使用大量 token 序列，让模型根据前文预测目标 token。简化后的训练步骤是：

```text
输入 token -> 前向计算 -> 目标 token 的预测概率
           -> loss -> backpropagation -> optimizer -> 更新 model weights
```

`Loss（损失）`衡量预测与目标的差距。常见的单 token 损失是 `-log p(target | context)`：目标概率越低，损失越大。`Backpropagation（反向传播）`计算损失对可训练参数的梯度；`optimizer（优化器）`利用梯度更新参数。KV cache 的主要用途是推理时复用计算，不是这里要学习的持久参数。

大量文本的下一 token 训练能带来语言和知识模式能力，但本身不保证稳定遵循指令、事实正确、安全或完成某项实际任务。这些性质还需要相应的训练信号和评估证据。

## 理解检查

1. 一个训练样本的目标 token 概率太低，优化器执行一步后，什么可能被持久更新？
2. 谁计算梯度？谁使用梯度更新参数？
3. 训练损失低，能直接证明模型能遵循一个新用户的指令吗？

<details><summary>参考答案</summary>

1. 可训练的 model weights；具体取决于哪些参数未冻结及优化器设置。
2. Backpropagation 计算梯度；optimizer 更新参数。
3. 不能。训练集拟合与新指令上的表现是不同结论。

</details>
