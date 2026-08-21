# Common Misconceptions

## Attention

### Misconception: Q, K, and V are three separate input sources

More accurately, in standard self-attention they are learned projections of the same hidden states. The split lets the model represent different functional roles: querying, matching, and carrying information.

### Misconception: Dividing by `sqrt(head_dim)` is ordinary normalization

More accurately, it is attention score scaling. As the head dimension increases, QK dot products can grow in magnitude. Dividing by `sqrt(head_dim)` helps control the scale of logits before softmax.

### Misconception: Softmax directly retrieves information

Softmax converts attention scores into weights. The information comes from applying those weights to the value vectors.

