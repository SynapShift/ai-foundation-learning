# Attention

Attention is a mechanism for letting each token decide which other tokens are useful when updating its own representation.

## Why Attention Is Needed

A language model does not understand a token in isolation. In the sentence:

```text
The animal did not cross the street because it was tired.
```

the meaning of `it` depends on other tokens. A model needs a way to route information between related positions. Attention is one of the central mechanisms that does this routing.

## Intuition

A useful intuition is:

```text
Q and K decide which tokens are relevant.
V provides the information that will be gathered.
```

Short version:

```text
QK decides who to look at.
V decides what information to take.
```

This is an intuition, not a complete mathematical definition. The real computation uses learned projections, dot products, softmax, and weighted sums.

## Q / K / V

In self-attention, each token starts with a hidden state. The model applies three learned linear projections to create:

- `Q` query: what this token is looking for.
- `K` key: what this token can be matched by.
- `V` value: what information this token can pass forward if attended to.

The three projections do not create new information from nowhere. They reshape the same hidden state into three functional spaces: querying, matching, and carrying information.

## Scaled Dot-Product Attention

The core computation is:

```python
scores = q @ k.transpose(-2, -1)
scores = scores / math.sqrt(head_dim)
weights = torch.softmax(scores, dim=-1)
output = weights @ v
```

If `q` has shape:

```text
[batch, heads, query_tokens, head_dim]
```

and `k` has shape:

```text
[batch, heads, key_tokens, head_dim]
```

then `k.transpose(-2, -1)` has shape:

```text
[batch, heads, head_dim, key_tokens]
```

so `q @ k.transpose(-2, -1)` produces:

```text
[batch, heads, query_tokens, key_tokens]
```

Each score says how strongly one query token matches one key token.

## Why Divide by `sqrt(head_dim)`

As `head_dim` grows, the dot product between `Q` and `K` can become larger in magnitude. If the attention scores become too large before softmax, softmax can become very sharp too early: one token gets almost all the probability and the rest get almost none.

Dividing by `sqrt(head_dim)` scales the logits back to a more stable range.

This is better described as score scaling, not ordinary normalization. It does not make the vector length equal to 1, and it does not subtract a mean or divide by a standard deviation like many normalization layers do.

## Softmax

Softmax turns raw attention scores into weights:

```text
raw scores -> attention weights
```

It is applied over the key-token dimension. For each query token, the weights across all candidate key tokens sum to 1.

That means the model is deciding how much information to take from each possible source token.

## Value Aggregation

After softmax, the model computes:

```python
output = weights @ v
```

This creates a weighted mixture of value vectors. Tokens with larger attention weights contribute more to the output representation.

## Common Misconceptions

- `Q`, `K`, and `V` are not three separate sources of raw input. They are learned projections of the hidden state.
- Dividing by `sqrt(head_dim)` is attention score scaling, not ordinary vector normalization.
- Softmax does not retrieve information by itself. It creates weights; the information comes from the weighted sum over `V`.

