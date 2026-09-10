# Foundation Atlas

`Foundation Atlas` is a dependency-free local learning interface for the AI Foundation Learning project.

## Run Locally

Open `index.html` in a modern browser. No Node.js, package installation, account, or API key is required.

The page provides:

- four connected learning routes for LLMs, image generation, video generation, and agent systems;
- prerequisite-based node unlocking;
- short learning material before each diagnostic question;
- practical sandbox prompts;
- local progress persistence and JSON import/export;
- a mentor-message generator for continuing a node with an external AI tutor.

## Privacy

Generic course data and application code are public. Personal progress is stored in browser `localStorage` and can be exported as a private JSON file.

For this repository's local learner, the optional private seed file lives at:

```text
.local-learning/learning-state.js
```

That file is ignored by Git and must never be committed.
