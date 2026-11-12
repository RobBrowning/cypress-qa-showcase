# ADR 0001: Cypress + TypeScript

- **Status:** Accepted
- **Date:** 2026-11-12

## Context

This repo is the Cypress twin of a Playwright showcase. I have used Cypress in production for years, including setting the automation strategy for a team that standardised on Cypress with `cypress-grep` tagging. The goal here is to show current Cypress practice, not a port of Playwright habits.

## Decision

- Cypress 15 with TypeScript (`strict`, `noUncheckedIndexedAccess`).
- Version pinned to the 15 line because `cypress-axe` does not yet declare support for Cypress 16. Revisit when it does.
- `@cypress/grep` for tags, `cypress-axe` for accessibility, `cypress-mochawesome-reporter` for HTML reports.
- Environment values go through Cypress's `expose` config and `Cypress.expose()`, which replaces the deprecated `Cypress.env()` for public values.

## Consequences

- One runner for UI and API through `cy.request`, with the interactive runner for debugging.
- Plugins replace some features Playwright has built in (tags, reporting).
- Specs follow Cypress's command queue model rather than `async/await`, which reads differently from the twin repo (see ADR 0003).
