# Cypress QA Showcase

[![Cypress tests](https://github.com/RobBrowning/cypress-qa-showcase/actions/workflows/cypress.yml/badge.svg)](https://github.com/RobBrowning/cypress-qa-showcase/actions/workflows/cypress.yml)
[![Claude PR Review](https://github.com/RobBrowning/cypress-qa-showcase/actions/workflows/claude-review.yml/badge.svg)](https://github.com/RobBrowning/cypress-qa-showcase/actions/workflows/claude-review.yml)

A small, deliberately well-structured test automation project built with **Cypress + TypeScript**, run against two public demo apps:

| Target | Type | What it covers |
|---|---|---|
| [SauceDemo](https://www.saucedemo.com) | Web UI | Login rules, inventory sorting, cart state, end-to-end checkout, accessibility |
| [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html) | REST API | CRUD, filtering, auth enforcement, documented API quirks |

**Twin repo:** [playwright-qa-showcase](https://github.com/RobBrowning/playwright-qa-showcase) runs the same tests, with the same titles, in Playwright. Read them side by side to see how each framework handles the same problem. [`docs/adr/0003-cypress-vs-playwright.md`](docs/adr/0003-cypress-vs-playwright.md) sets out the trade-offs.

It exists to show how I approach automation as a QA lead: **fewer, clearer tests that each earn their place**, with the reasoning written down.

## What to look at

- **[`docs/test-strategy.md`](docs/test-strategy.md)**: scope, risk-based selection, what is deliberately *not* automated and why, the accessibility gate.
- **[`src/`](src)**: page objects, a typed API client on `cy.request`, test data.
- **[`cypress/support/commands.ts`](cypress/support/commands.ts)**: `cy.login()` cached with `cy.session()`, and the axe gate.
- **[`cypress/e2e/`](cypress/e2e)**: UI, accessibility and API specs, each tagged `@smoke` or `@regression`.
- **[`.github/workflows/cypress.yml`](.github/workflows/cypress.yml)**: typecheck gate, then a parallel matrix (desktop, mobile viewport, API), reports uploaded as artifacts, scheduled weekday run.
- **[AI PR review](#ai-pr-review)**: every PR gets an automatic QA review from Claude, tuned to this repo's rules. See it in action on [PR #10](https://github.com/RobBrowning/cypress-qa-showcase/pull/10).
- **[`docs/adr/`](docs/adr)**: lightweight Architecture Decision Records.
- **[`CLAUDE.md`](CLAUDE.md)**: how this repo is set up for AI-assisted development with Claude Code.

## AI PR review

Every pull request gets an automatic first-pass review from Claude, using the official [Claude GitHub Action](https://github.com/anthropics/claude-code-action). It reviews like a QA lead, not a linter: it reads the PR's acceptance criteria first, then checks the tests against this repo's own rules.

**What it checks** (rules in [`.github/claude-review-prompt.md`](.github/claude-review-prompt.md)):

- Every acceptance criterion has a test. It posts an AC to test coverage table on each PR.
- No fixed waits (`cy.wait(<number>)`) and no weakened assertions.
- The conventions in [`CLAUDE.md`](CLAUDE.md) and the [ADRs](docs/adr): `byTest()` selectors, tags, page objects without assertions, twin parity with Playwright.

**Guardrails:** comments only. The workflow token is read-only and Claude can only read the repo and post comments, so it can't push, approve or merge. CI, the `protect-main` ruleset and human approval still decide what merges, and every review thread must be resolved first. Decisions: [ADR 0004](docs/adr/0004-ai-pr-reviewer.md) and [ADR 0005](docs/adr/0005-one-ai-reviewer-plus-on-demand-claude.md).

**How it was tested:** [PR #10](https://github.com/RobBrowning/cypress-qa-showcase/pull/10) was opened with four seeded defects, and reviewed by this QA-tuned reviewer and by Anthropic's generic code-review plugin side by side.

| Seeded defect | QA-tuned reviewer | Generic reviewer |
|---|---|---|
| `cy.wait(2000)` | Caught (Blocker) | Caught |
| CSS chain selector instead of `byTest()` | Caught (Major) | Caught |
| Cart badge assertion weakened to `should('exist')` | Caught (Blocker), with a one-click fix | Caught |
| An acceptance criterion with no test | Caught (Blocker) | Missed |

It also found three real issues nobody seeded. The best: SauceDemo already lists products A to Z, so the new A to Z test could never fail. The fix sorts Z to A first. No false positives, about a minute per review. The findings were then fixed on the same PR. The reviewer re-checked each push and finished on "Ready for human review" with no findings.

Need a second opinion on a PR? Mention `@claude` in a comment.

## Quick start

```bash
git clone https://github.com/RobBrowning/cypress-qa-showcase.git
cd cypress-qa-showcase
nvm use               # Node 22
npm ci                # also downloads the Cypress app
npm run open          # interactive runner: pick a spec, watch it, time-travel through each step
```

Headless runs:

```bash
npm test              # everything
npm run test:smoke    # @smoke subset only
npm run test:web      # desktop UI specs (includes accessibility)
npm run test:mobile   # UI @smoke at a Pixel 7 sized viewport
npm run test:api      # API specs only
npm run test:a11y     # accessibility specs only
```

The HTML report is written to `cypress/reports/html/index.html`.

Base URLs default to the public demo apps. Override with `UI_BASE_URL` / `API_BASE_URL` (see `.env.example`).

## Project layout

```
cypress/
  e2e/ui/      Login, inventory, checkout, accessibility
  e2e/api/     Booking lifecycle
  support/     Plugin registration, custom commands and their types
src/
  pages/       Page objects for SauceDemo + the byTest() selector helper
  api/         Typed Restful-Booker client + test data builder
  data/        Public demo accounts and customer data
docs/
  test-strategy.md
  qa-workflows.md
  adr/
.github/
  workflows/   CI (cypress.yml), AI PR review (claude-review.yml), @claude (claude.yml)
  claude-review-prompt.md   Rules the AI reviewer checks
```

## Conventions

- Selectors use `data-test` attributes through one helper, never brittle CSS chains.
- Specs chain commands. No `async/await` and no fixed `cy.wait()`: Cypress retries assertions until they pass or time out.
- One behaviour per test. The long checkout journey uses `cy.log` steps so the runner reads like a test case.
- Test data is generated per run, so API tests never depend on shared state.
- Known third-party quirks are asserted *and* commented, so they are not mistaken for bugs.
- Every automated test should replace a named manual check. If it does not, it does not get written.

## Roadmap

- [x] MVP: UI + API suites, page objects, custom commands, tags, axe checks, CI matrix
- [x] PR governance: CODEOWNERS, PR template, ruleset on main
- [x] AI PR reviewer: QA-focused Claude review on every PR, tested against seeded defects
- [ ] Bump GitHub Actions to Node 24 versions
- [ ] Component tests for a small React login form and cart badge (`cypress/react`)
- [ ] Contract-style schema validation on API responses
- [ ] AI verifier: a locally run agent that independently re-checks failures before they are reported

## About

Built by [Rob Browning](https://github.com/RobBrowning), QA lead with 18+ years in testing, using Claude Code as a pair. Demo apps are owned by their respective authors and used here only as public practice targets.
