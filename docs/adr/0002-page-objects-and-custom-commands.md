# ADR 0002: Page objects plus a small set of custom commands

- **Status:** Accepted
- **Date:** 2026-11-12

## Context

Cypress has no fixture injection like Playwright's `test.extend`. Teams usually pick between page objects and custom commands, and often end up with hundreds of global commands that are hard to discover.

## Decision

- Page objects in `src/pages/` own selectors and page-level actions only. Assertions about business behaviour stay in specs.
- Selectors are functions (`username = () => cy.get(...)`), so every use queries the page again and keeps Cypress's retry behaviour.
- Custom commands are kept for cross-cutting setup only: `cy.login()` (cached with `cy.session()`) and `cy.checkA11ySerious()`. Both are typed in `cypress/support/index.d.ts`.
- The API client wraps `cy.request` and returns chainables.

## Consequences

- Specs read as behaviour and match the twin repo's shape closely.
- `cy.login()` replaces Playwright's `loggedIn` fixture; `cy.session()` means the login form is typed once per user per spec run.
- The command list stays short enough to read in one file.
