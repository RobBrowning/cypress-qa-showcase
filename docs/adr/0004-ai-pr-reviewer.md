# ADR 0004: AI PR reviewer with the official Claude GitHub Action

- **Status:** Accepted
- **Date:** 2026-11-17

## Context

PRs in this repo are reviewed by one person. A second, consistent pass focused on QA rules (AC coverage, no fixed waits, no weakened assertions, CLAUDE.md and ADR compliance) catches the things a tired human reviewer misses. It's also a portfolio piece showing AI used *for* QA with proper guardrails.

## Decision

- Use the official `anthropics/claude-code-action@v1`, not Copilot review or third-party bots.
- Run automatically on every non-draft PR (`opened`, `synchronize`, `ready_for_review`, `reopened`).
- Authenticate with a Claude subscription OAuth token (`CLAUDE_CODE_OAUTH_TOKEN`, from `claude setup-token`). No separate API bill.
- **Comments only.** Output is one summary comment (with an AC → test table) plus severity-tagged inline comments. The workflow token is read-only and Claude's allowed tools are limited to reading the repo, `gh pr view/diff/comment` and inline comments, so it can't push, approve or merge.
- The review rules live in `.github/claude-review-prompt.md`, separate from the workflow, so they can be tuned without touching CI.
- The ruleset on `main` and human approval stay the merge gate.

## Consequences

- Every PR gets a consistent QA-focused review within minutes.
- Reviews use the owner's Claude plan limits. Low volume, so acceptable. `--max-turns`, a 15-minute timeout and concurrency cancel-in-progress cap each run.
- PRs from forks don't get repo secrets, so they aren't reviewed. Fine for a portfolio repo, and it stops outsiders using the token.
- The AI can be wrong. Findings are advisory, and what it gets right and wrong is recorded for the case study.
- To be copied to playwright-qa-showcase once proven here.
