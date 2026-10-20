# AI 基础模型手册 · 中文版

输入一句话，模型回了一段话。中间到底发生了什么？至少可以确定，显卡里没有一个小人在替你查字典。

这份九章手册沿着一条线讲：从 Transformer 内部的一个 token，到能调用工具的 Agent 系统。重点不是背名词，而是看每个机制负责什么、不负责什么，以及它们怎样接起来。每章都有讲解、容易混淆的边界、理解题和参考答案。

[阅读中文版网页](https://synapshift.github.io/ai-foundation-learning/zh/) · [English README](https://github.com/SynapShift/ai-foundation-learning/blob/main/README.md) · [English web edition](https://synapshift.github.io/ai-foundation-learning/en/)

## 你能学到什么？

- **模型内部：** Attention 怎样在 token 位置间传递信息；Hidden State、Logits、两处不同的 Softmax 和 Transformer Block 怎样衔接。
- **生成时：** 为什么输出是逐 token 生成的；采样怎样影响选择；KV Cache 究竟省下了什么计算。
- **训练时：** Loss、Backpropagation 与 Optimizer 分别做什么；Pretraining、SFT 和偏好对齐为什么不是同一件事。
- **模型之外：** 评估分数能说明什么、不能说明什么；Model、Tool、Agent 与 Harness 怎样分工。

读完后，GQA、DPO、Tool dispatcher 这些缩写应该能对应到具体机制，而不只是看着很像懂了。

## 适合谁？

适合刚开始系统了解大模型的读者、转向 LLM 工作的开发者，以及需要与技术团队讨论模型能力的产品和研究同学。不要求你会训练模型；知道一点向量和概率会更顺手，但手册会先解释每个机制要解决的问题。

如果你已经在写 Transformer 算子或跑大规模训练，这里更适合当作速查图和教学题库，不宜代替深入的技术资料。

## 学不到什么？

- Transformer 各部分的完整数学推导。
- 从零训练、微调或部署生产级模型的操作流程。
- 某个模型的实时能力排行，或“用了这个方法就一定有效”的保证。
- 万能提示词秘方。真有这种东西，这一章会短得可疑。

这里要建立的是可靠的理解框架。涉及实现细节、具体模型表现和实证结论时，仍应查原论文、官方文档并亲自验证。

## 从哪里开始？

- **第一次读：** 从 [01 Attention](llm/01-attention.md) 开始，顺着“模型内部 → 生成与训练 → 模型之外”的路线往下走。
- **带着问题来：** 看下面的“核心问题”，直接跳到相关章节。
- **读完一章：** 先用自己的话回答章末问题，再展开参考答案。答不上来就回看讲解，不急着赶进度。

## 搭配什么学更有效？

1. **拿一个短句画流程。** 标出每个位置能看到哪些 token，再从 Hidden State 一路追到下一 token 的概率。小例子比大段术语更容易暴露“不太明白”的地方。
2. **先答理解题，再看参考答案。** 用自己的话解释机制；如果两个术语听起来还是一样，就回去找它们的职责边界。
3. **做一个很小的实验。** 对同一提示调整 Temperature，观察输出；或比较模型提出工具请求与工具真正返回结果的区别。每次只改变一个条件。
4. **遇到章节边界就查更深的材料。** 想继续读架构，可看 [Transformer 原论文](https://arxiv.org/abs/1706.03762)；觉得向量表示抽象，可配合 [PyTorch Tensor 入门](https://pytorch.org/tutorials/beginner/basics/tensorqs_tutorial.html)。AI 助手可以陪你互相提问，但它引用的论文、代码和模型事实仍需核实。

一章、一张自己画的图、一道真正答明白的题，通常比打开二十个标签页更有效。浏览器可能不同意。

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
