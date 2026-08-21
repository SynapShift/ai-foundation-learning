# Attention Exercises

These exercises are reusable diagnostics for attention understanding. They are not personal answer records.

## Level 1: Intuition

### Q1

In the intuition of attention, what do `Q` and `K` mainly help compute?

A. Which tokens are relevant to each other  
B. The final vocabulary probabilities  
C. The model's permanent factual memory

<details>
<summary>Answer</summary>

A. `Q` and `K` are used to compute matching scores between tokens.

</details>

### Q2

What role does `V` play?

A. It decides the learning rate  
B. It provides the information that attention will mix together  
C. It removes tokens from the context window

<details>
<summary>Answer</summary>

B. Attention weights are applied to `V` to create the output mixture.

</details>

## Level 2: Mechanism

### Q3

Why does scaled dot-product attention divide scores by `sqrt(head_dim)`?

<details>
<summary>Answer</summary>

Because dot products tend to grow in scale as the head dimension grows. Scaling helps keep logits in a range where softmax does not become too extreme too early.

</details>

