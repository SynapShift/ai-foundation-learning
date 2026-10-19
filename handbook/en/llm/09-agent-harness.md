# Chapter 9: Model, Agent, and Harness

[阅读中文版](https://synapshift.github.io/ai-foundation-learning/zh/llm/09-agent-harness/)

[Previous: Evaluation](08-evaluation.md)

## Four roles

A `Model` produces output tokens. A `Tool` performs an external operation, such as reading a file. An `Agent` is a goal-directed loop or system that uses a model, observations, and actions to pursue a task. A `Harness` is the surrounding runtime that assembles context, calls the model, checks and routes tool requests, tracks state, and controls execution. These are roles, not four mutually exclusive products; implementations can combine them or use different names.

```text
user goal
  -> Harness builds context and calls Model
  -> Model returns text or a structured tool request
  -> Harness checks permissions and dispatches an allowed request
  -> Tool performs the external operation
  -> Harness records the observation and calls Model again
  -> stop when done, blocked, or at a limit
```

For example, `{tool: "read_file", path: "src/app.py"}` is a *request message*, not an operating-system read. The Harness's `Tool dispatcher` checks it against a `permission policy` and routes it. An underlying sandbox can enforce further limits. Only a permitted tool or runtime operation reads bytes and returns content to the model.

If the read is denied, the model receives an error observation, not the file contents. It should request authorization, use an allowed alternative, or explain the block. Claiming to have seen the file would be unsupported fabrication.

## Context, state, and memory

- `Context`: information supplied to one model call, such as the request, selected history, and tool results. Denied file content is absent.
- `State`: where the current task stands, such as "read denied; awaiting authorization."
- `Memory`: information intentionally retained across calls or tasks, such as stable preferences or project decisions. Not every Harness has persistent memory.

A `Context builder` selects relevant state, memory, and observations for a later model call. State is not automatically known to the model; it must be included in the next context. Long-term memory cannot authorize invented file contents.

An `Execution harness` runs a live task loop. An `Evaluation harness` runs test tasks and measures outcomes. Both may use models and tools, but for different purposes. A coding assistant is a product combining model, tools, harness, interface, and policies; it is not synonymous with "harness."

## Check your understanding

1. Does a model's `read_file` request itself read a file?
2. Which runtime component should check and route that request before I/O? What else can enforce the boundary?
3. What should the model receive after a denied read? May it claim to know the file's contents?
4. Is "read denied; awaiting authorization" task state or long-term memory?

<details><summary>Reference answers</summary>

1. No. It remains a request until a permitted runtime operation executes it.
2. The Harness's Tool dispatcher checks policy; tools and the OS sandbox can add enforcement.
3. A denial or error observation, not the content. It must not claim to have read unavailable bytes.
4. Task state. The Harness may include it in the next model call's context.

</details>
