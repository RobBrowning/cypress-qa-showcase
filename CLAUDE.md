# Cypress QA Showcase: Claude Code project context

This is **cypress-qa-showcase**, a Cypress + TypeScript portfolio suite testing SauceDemo (UI) and Restful-Booker (API), plus axe accessibility checks. It is the twin of `playwright-qa-showcase`: same targets, same test titles, so the two can be compared directly.

**Status (updated 2026-11-12):** MVP. UI, API and accessibility specs, page objects, custom commands and CI matrix exist. Component tests are deliberately deferred to v2.

## Hard rule

Never use an em dash or en dash in any file. Use a colon, comma or full stop instead. Ordinary hyphens in compound words are fine.

## Before you change anything

- Read `docs/test-strategy.md` before adding, changing or removing a test.
- Read `docs/adr/` before any structural change: page objects, commands, config or folders.
- Accepted ADRs are binding. A change of decision means a new ADR; existing ADRs are never edited.
- Only add a test if it replaces a named manual check. Otherwise record it in the strategy's "Deliberately not automated" table.
- A test that differs from its Playwright twin is listed in the strategy's "Tests with no Playwright twin" section, with the reason and whether the twin needs it too.
- Follow `docs/qa-workflows.md` when adding a test, running tests, debugging a failing test or reviewing a PR. Don't skip the steps it marks as most often skipped.

ADR index: @docs/adr/README.md

## Commands

- `npm run typecheck`: must pass before any commit
- `npm test`, `npm run test:smoke`, `npm run test:web`, `npm run test:mobile`, `npm run test:api`, `npm run test:a11y`
- `npm run open`: Cypress app for interactive debugging

## Conventions

- Selectors: `[data-test="..."]` through the `byTest()` helper in `src/pages/selectors.ts`. No CSS chains, no XPath.
- Specs chain Cypress commands. No `async/await`, no `cy.wait(<number>)`.
- UI login goes through `cy.login(user)`, which uses `cy.session()`.
- Page objects in `src/pages/` hold selectors and actions only. Business assertions live in specs.
- Every test carries a `tags` option: `@smoke` or `@regression`.
- Test titles must match the Playwright twin. A test with no twin needs a reason in `docs/test-strategy.md`.
- New tests must name the manual check they replace. If none, propose adding it to the "not automated" table instead.
- Third-party quirks get asserted and commented, never "fixed" in the test.
- Record any structural decision as a new ADR in `docs/adr/`.

## Do not

- Commit `.env`, reports, screenshots or videos.
- Add tests for the demo app's seeded defects (`problem_user`, `error_user`).
- Weaken an assertion, or switch off an axe rule wholesale, to make a test pass. Find the cause first.
- Add component tests, Cypress Cloud or visual testing without a /plan first.
