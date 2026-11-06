# Prompts

Ready-to-send prompts that start an agent session in this repo. Each file explains when to use it
above a `---` line; everything below the line is the prompt itself — copy it, fill in the
placeholders, and send it as the session's first message.

| Prompt            | When to use                                                                                                                               | Placeholders |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `orchestrator.md` | Drive several Linear issues from one session: pick a batch, delegate each issue to a subagent in its own worktree, relay, merge approved. | none         |
| `task.md`         | Take one Linear issue end to end (`ai/workflow.md`). The orchestrator also sends it to each subagent.                                     | `{ISSUE}`    |

Conventions:

- Prompts are written in English, like the rest of `ai/`; the agent still talks to the author in
  Russian (`AGENTS.md`).
- A prompt points to the docs (`AGENTS.md`, `ai/workflow.md`, `ai/map.md`) instead of repeating them,
  so it stays short and does not drift from the rules. The checks are the ones under "Verification"
  in `AGENTS.md`, never a list of their own.
- When the workflow changes, update the prompts in the same change.
- The Linear issue template is not a prompt — it stays in `ai/linear-task-template.md`.
