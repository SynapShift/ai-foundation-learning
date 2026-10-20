# AI 基础模型手册 · 中文版

一句话输入模型后，究竟发生了什么？它怎样参考前文、选出下一个 token；又怎样在模型之外读文件、调用工具、完成任务？

我们从最小的一步讲起，沿着数据流走过九章。不是先背名词，而是把每个机制放回它所解决的问题里。

[English README](https://github.com/SynapShift/ai-foundation-learning/blob/main/README.md) · [English web edition](https://synapshift.github.io/ai-foundation-learning/en/)

## 从哪里开始？

- **第一次读：** 从 [01 Attention](llm/01-attention.md) 开始，顺着“模型内部 → 生成与训练 → 模型之外”的路线往下走。
- **带着问题来：** 看下面的“核心问题”，直接跳到相关章节。
- **读完一章：** 先用自己的话回答章末问题，再展开参考答案。答不上来就回看讲解，不急着赶进度。

## 九章阅读路线

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

先弄清模型内部的信息如何流动，再看生成时如何省时间和显存；之后进入训练、对齐与评估，最后把模型放进会使用工具的 Agent 系统。
