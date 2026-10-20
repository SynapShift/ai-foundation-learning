# 第 7 章：指令与偏好对齐

[Read in English](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/en/llm/07-alignment.md)

[上一章：预训练](06-pretraining.md) | [下一章：评估](08-evaluation.md)

## 四个名字，不是四种同级算法

| 术语 | 训练信号或角色 | 简化例子 |
| --- | --- | --- |
| `Pretraining（预训练）` | 广泛的 token 序列，通常做下一 token 预测 | 学习文本的续写规律 |
| `SFT / Supervised Fine-Tuning（监督微调）` | 指令及其示范回答 | 这类请求应怎样回答 |
| `Preference alignment（偏好对齐）` | 让输出更符合偏好的目标和方法族 | B 比 A 更好 |
| `RLHF / Reinforcement Learning from Human Feedback（人类反馈强化学习）` | 一种偏好对齐路径，经典做法包含奖励模型与强化学习 | 学习打分偏好，再优化回答模型 |

它们往往都可能改变参数、提高某类回答的概率，但**数据提供的信号与优化过程不同**。普通预训练不需要给每条文本标注“人更喜欢哪一个回答”。

## Prompting 不是 SFT

正常聊天时输入“请用三点总结”，属于 `Prompting（提示）`：文本只进入本次推理的 context，不会因为这一条消息自动更新模型参数。SFT 则把许多“指令—示范回答”样本用于计算训练损失并更新参数，使变化在后续请求中持续存在。模型也不是把每个示范回答逐字存成标准答案。

## 偏好数据、RLHF 与 DPO

同一请求有回答 A、B，标注“B 优于 A”，这提供了**比较信息**，不只是展示 B。经典 RLHF 往往先用偏好比较训练 `reward model（奖励模型）`，再以强化学习更新生成回答的 `policy model（策略模型）`。`DPO / Direct Preference Optimization（直接偏好优化）`把胜出与落选回答直接用于偏好优化目标，不走独立奖励模型加 RL 的那条经典训练链。DPO 也使用落选回答 A 提供的信息，并非“只用 B 做 SFT”。

实际训练管线在数据来源、参考模型、优化细节与安全约束上各不相同；这里讲的是角色边界。

## 理解检查

1. 用户在普通聊天中输入“请用三点总结”，模型参数因此改变了吗？
2. “B 优于 A”相比只给一个 B，多了什么信息？
3. 偏好对齐是一种与 DPO、RLHF 平级的单一算法吗？

<details><summary>参考答案</summary>

1. 没有。普通 prompting 改变当前输入 context，不改变持久参数。
2. 多了同一请求下两个回答的相对偏好，包括落选回答的信息。
3. 不是。它是目标或方法族；RLHF 和 DPO 是不同实现路径。

</details>
