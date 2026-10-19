# 第 1 章：Attention 与 Q/K/V

[下一章：Hidden State 与输出](02-hidden-states-and-output.md)

## 为什么需要 Attention

一个 token 的含义会受上下文影响。例如：

```text
The animal did not cross the street because it was tired.
```

这里 `it` 的指代需要参考前面的词。`Attention（注意力）`提供一种在 token 位置之间选择并汇集信息的机制。

## 从直觉到计算

每个位置先有一个 `hidden state（隐藏状态）`向量。模型用三组学习得到的线性投影，从同一个输入向量算出：

- `Q / Query（查询）`：当前位置要寻找什么样的信息。
- `K / Key（键）`：当前位置可怎样被匹配。
- `V / Value（值）`：匹配后可以传递什么信息。

可以暂时记成“Q/K 判断看谁，V 提供取什么”。这只是直觉：真正的计算是向量点积、softmax 和加权求和。Q、K、V 不是三份独立的原始输入，也不是无中生有地增加信息，而是同一 hidden state 在不同功能空间中的投影。

## Scaled Dot-Product Attention

简化代码如下：

```python
scores = q @ k.transpose(-2, -1)
scores = scores / math.sqrt(head_dim)
weights = torch.softmax(scores, dim=-1)
output = weights @ v
```

若 `q` 的形状是 `[batch, heads, query_tokens, head_dim]`，`k` 是 `[batch, heads, key_tokens, head_dim]`，则 `scores` 为 `[batch, heads, query_tokens, key_tokens]`。每个分数表示某个查询位置与某个可见 key 位置的匹配程度。用于自回归语言模型时，不允许看见的未来位置会在 softmax 前被 mask 掉。

为什么除以 `sqrt(head_dim)`？维度增大时，Q/K 点积的尺度可能变大，让 softmax 过早变得极端。按维度平方根缩放有助于稳定分数范围。这是 `score scaling（分数缩放）`，不是把向量长度归一为 1，也不是 LayerNorm 那样减均值、除标准差。

`Attention softmax`在可见 key 位置之间分配权重；对每个查询位置，这些权重加起来为 1。随后 `weights @ v` 汇集对应 V，得到新的表示。Softmax 自己不负责取出信息；它给权重，V 承载被加权的信息。

## 理解检查

1. Q/K 和 V 在这条计算链里分别起什么作用？
2. 除以 `sqrt(head_dim)` 是分数缩放，还是把每个 Q 向量归一成长度 1？
3. Attention softmax 在上下文位置之间分配权重，还是直接给词表里的下一 token 分配概率？
4. 两个头看同一输入，它们的注意力权重必须相同吗？

<details><summary>参考答案</summary>

1. Q/K 形成匹配分数；权重作用于 V，汇集其承载的信息。
2. 是分数缩放，不是向量长度归一。
3. 在可见 key 位置之间分配权重；词表概率属于后面的输出层。
4. 不必相同。各头可以使用不同的学习投影参数。

</details>

[更多练习](../../exercises/llm/attention.md)
