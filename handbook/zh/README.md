# AI 基础模型手册 · 中文版

从模型内部的数据流出发，逐步读到推理、训练、评估与 Agent 系统。每章都包含讲解、关键边界、理解题和可展开的参考答案。可以按顺序读，也可以按主题查阅。

[English edition](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/en/README.md)

## LLM 课程目录

| 章节 | 主题 | 核心问题 |
| --- | --- | --- |
| 01 | [Attention 与 Q/K/V](llm/01-attention.md) | 信息怎样在 token 位置之间流动？ |
| 02 | [Hidden State、Logits 与两次 Softmax](llm/02-hidden-states-and-output.md) | 内部向量怎样变成下一 token 的概率？ |
| 03 | [Transformer Block 的数据流](llm/03-transformer-block.md) | Attention、FFN、残差和归一化各做什么？ |
| 04 | [自回归生成](llm/04-generation.md) | 模型怎样逐 token 生成并复用 KV？ |
| 05 | [现代架构与推理工程](llm/05-inference-engineering.md) | 各种加速和省显存方法分别解决什么？ |
| 06 | [预训练与参数更新](llm/06-pretraining.md) | Loss、反向传播和优化器怎样改变模型？ |
| 07 | [指令与偏好对齐](llm/07-alignment.md) | SFT、RLHF 和 DPO 的训练信号有何不同？ |
| 08 | [评估、泛化与推理](llm/08-evaluation.md) | 训练损失和测试分数能证明什么？ |
| 09 | [Model、Agent 与 Harness](llm/09-agent-harness.md) | 模型、工具和运行系统如何协作？ |

这是可复用的公开知识内容，不含任何人的学习进度、实际答题或能力评估。
