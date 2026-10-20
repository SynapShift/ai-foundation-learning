# 第 9 章：Model、Agent 与 Harness

[Read in English](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/en/llm/09-agent-harness.md)

[上一章：评估](08-evaluation.md)

## 四种角色

`Model（模型）`生成输出 token；`Tool（工具）`执行读取文件等外部操作；`Agent（智能体）`描述利用模型、观察与行动追求任务目标的循环或系统；`Harness（运行支架）`是负责组装上下文、调用模型、检查并路由工具请求、记录状态和控制执行的周边运行系统。这些是**角色**，不是四种互斥产品。具体实现可以合并组件，也可能使用别的名称。

```text
用户目标
  -> Harness 构建 context 并调用 Model
  -> Model 返回文本或结构化工具请求
  -> Harness 按权限检查并调度允许的请求
  -> Tool 执行外部操作
  -> Harness 记录观察结果，再调用 Model
  -> 任务完成、受阻或达到限制时停止
```

例如模型返回 `{tool: "read_file", path: "src/app.py"}`，这只是**请求消息**，不是操作系统读文件。Harness 中的 `Tool dispatcher（工具调度器）`按 `permission policy（权限规则）`验证并路由请求；底层 sandbox（沙箱）也可以进一步强制限制。只有获准的工具或运行环境真正读取字节并将内容返回模型。

如果被拒绝，模型收到的是错误观察结果，不是文件内容。它应请求授权、改用允许的方法，或解释阻塞。声称“我已经看过该文件”就是无依据编造。

## Context、State、Memory

- `Context（上下文）`：一次模型调用实际收到的信息，例如当前请求、选中的历史和工具结果；被拒绝文件的内容不在里面。
- `State（任务状态）`：当前任务走到哪一步，例如“读取失败，等待授权”。
- `Memory（记忆）`：有意跨调用或跨任务保留的信息，例如稳定偏好或项目决策。并非所有 Harness 都有持久记忆。

`Context builder（上下文构建器）`从状态、记忆和观察结果中选择下次模型调用需要的信息。State 不会自动进入模型；必须被放进下一轮 Context。长期 Memory 也不能当作读取受限文件的许可。

`Execution harness（执行支架）`运行真实任务循环；`Evaluation harness（评测支架）`运行测试任务并测量结果。两者都可能调用模型和工具，但目的不同。编程助手等产品是模型、工具、Harness、界面和权限规则的组合，不等同于“Harness”一词。

## 理解检查

1. 模型提出 `read_file` 请求，本身就读到文件了吗？
2. 真正读文件前，哪个运行组件应该检查并路由请求？还有什么可以加固边界？
3. 读取被拒绝后，模型会收到什么？能否声称知道文件内容？
4. “读取失败，等待授权”更像任务 State，还是长期 Memory？

<details><summary>参考答案</summary>

1. 没有。它仍是请求消息，直到获准的工具或运行环境执行。
2. Harness 的 Tool dispatcher 按权限规则检查；工具和操作系统沙箱还能进一步执行限制。
3. 收到拒绝或错误结果，而非文件内容；不能声称看过不可获得的内容。
4. 属于任务 State，可由 Harness 放进下一次模型调用的 Context。

</details>
