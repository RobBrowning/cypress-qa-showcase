# ADR 0005: One AI reviewer, plus @claude on demand

- **Status:** Accepted
- **Date:** 2026-11-17
- **Builds on:** [ADR 0004](0004-ai-pr-reviewer.md)

## Context

Running `/install-github-app` added two workflows next to the QA reviewer from ADR 0004:

- `claude-code-review.yml`: Anthropic's generic code-review plugin, run on every PR.
- `claude.yml`: Claude answers when someone mentions `@claude` in a PR or issue.

Both reviewers ran on test PR #10, which had four seeded defects. The QA-tuned reviewer caught all four, plus three genuine issues nobody seeded, with no false positives. The generic plugin caught three and missed the acceptance criterion with no test, because it doesn't read ACs.

## Decision

- Keep one automatic reviewer: `claude-review.yml` with `.github/claude-review-prompt.md`.
- Remove `claude-code-review.yml`. A second automatic review doubles the noise and the plan usage, and adds nothing the QA reviewer misses.
- Keep `claude.yml` for on-demand help: `@claude` in a PR or issue comment. Unlike the reviewer, it can push commits to a PR branch when asked to. Only people with write access can trigger it, and `protect-main` still gates every merge.

## Consequences

- Every PR gets exactly one automatic AI review.
- `@claude` follow-up questions run only when asked, so they cost nothing otherwise.
- The PR #10 comparison is kept in the README as evidence for the decision.
