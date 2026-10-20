# Chapter 2: Hidden States, Logits, and Two Softmaxes

[阅读中文版](https://github.com/SynapShift/ai-foundation-learning/blob/main/handbook/zh/llm/02-hidden-states-and-output.md)

[Previous: Attention](01-attention.md) | [Next: Transformer block](03-transformer-block.md)

## Why this matters

Attention outputs an updated vector, not a word. To predict the next token, the model must turn its final vector into a score for each vocabulary candidate.

`Token embedding` maps token IDs to vectors. Transformer layers repeatedly update them into `hidden states`. At the final position, the `lm_head` projects the final hidden state into one `logit` per vocabulary token. A final softmax turns logits into probabilities.

```text
visible tokens -> embeddings -> Transformer layers -> final hidden state
                                               -> lm_head -> vocabulary logits
                                               -> final softmax -> next-token probabilities
```

The head is usually a linear projection, for example `logits = h @ W_vocab`. Some models tie its weights to the input embedding matrix, but the stages still have different roles.

## Two different softmax operations

| Operation | Input | Distribution over | Purpose |
| --- | --- | --- | --- |
| Attention softmax | Q/K matching scores | Visible key positions | Weight V and update hidden states |
| Final softmax | Vocabulary logits | Candidate next tokens | Obtain generation probabilities |

Suppose the prompt means "I want to eat a" and the model next selects "apple." While predicting "apple," attention weights refer only to positions already visible. The final softmax assigns probabilities to next-token candidates such as "apple" or "banana." Only after "apple" is selected and appended can it be a visible position in the following step. A token need not correspond to one complete word.

## Check your understanding

1. Is an attention output shaped `[sequence_length, hidden_dim]` already a vocabulary probability distribution?
2. Which softmax weights visible positions, and which assigns probabilities to next-token candidates?
3. After "apple" has been appended, can the next attention step use it as a visible position?

<details><summary>Reference answers</summary>

1. No. It is still a hidden state; subsequent layers and the `lm_head` are needed.
2. Attention softmax weights visible key positions; final softmax distributes next-token probabilities.
3. Yes, subject to the context window and masking rules.

</details>
