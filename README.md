# Cypress QA Showcase

[![Cypress tests](https://github.com/RobBrowning/cypress-qa-showcase/actions/workflows/cypress.yml/badge.svg)](https://github.com/RobBrowning/cypress-qa-showcase/actions/workflows/cypress.yml)

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
- **[`docs/adr/`](docs/adr)**: lightweight Architecture Decision Records.
- **[`CLAUDE.md`](CLAUDE.md)**: how this repo is set up for AI-assisted development with Claude Code.

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
  adr/
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
- [ ] Bump GitHub Actions to Node 24 versions
- [ ] Component tests for a small React login form and cart badge (`cypress/react`)
- [ ] Contract-style schema validation on API responses
- [ ] AI verifier: a locally run agent that independently re-checks failures before they are reported

## About

Built by [Rob Browning](https://github.com/RobBrowning), QA lead with 18+ years in testing, using Claude Code as a pair. Demo apps are owned by their respective authors and used here only as public practice targets.
