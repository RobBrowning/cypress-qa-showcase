# Test Strategy

## Purpose

Show a realistic, maintainable approach to automating a web app and an API, not to maximise test count. This repo deliberately mirrors [playwright-qa-showcase](https://github.com/RobBrowning/playwright-qa-showcase), so the strategy is shared and only the framework differs.

**Guiding principle: less better, not more faster.** Every automated test must replace a named manual check. If nobody would check it by hand, it is not worth automating.

## Scope

### In scope

| Area | Why | Level |
|---|---|---|
| Login rules (valid, locked out, missing fields, wrong password, direct URL access) | Gatekeeper to everything, cheap to break | UI |
| Inventory sorting | Pure client logic, easy to regress, easy to assert | UI |
| Cart state (badge add/remove) | Shared state across pages | UI |
| Checkout journey + subtotal maths | Highest business value path | UI (E2E) |
| Accessibility of login, inventory and checkout | Legal and user risk, and cheap to check automatically for the serious cases | UI (axe) |
| Booking CRUD + filtering | Core API contract | API |
| Auth enforcement on update | Security-relevant behaviour | API |

### Deliberately not automated (and why)

| Item | Reason |
|---|---|
| `problem_user`, `error_user` broken behaviours | They are seeded defects in the demo app. Automating them would produce permanently red tests that teach nothing. Better covered as exploratory charters. |
| `performance_glitch_user` | A timing demo, not a functional check. Belongs in a performance tool, not an E2E suite. |
| Every sort option x every viewport | Sort is viewport-independent logic. Desktop covers it; the mobile run takes only the `@smoke` subset. |
| Restful-Booker PATCH | Same auth and payload rules as PUT. Adds runtime, not confidence. |
| Moderate and minor axe findings | Reported by axe but not gated. Gating them on a third-party app would mean permanently red runs; they belong in a manual accessibility review. |

### Tests with no Playwright twin

| Test | Reason |
|---|---|
| `a11y.cy.ts` (3 tests) | Accessibility is on the Playwright repo's roadmap and was built here first. The Playwright version will reuse these titles. |

## Test selection

Two questions drive what runs where:

1. **What changed, and what can it break?** (blast radius)
2. **How well-established is existing coverage there?** (baseline confidence)

High blast radius + low baseline confidence = automate and run on every push. Low + high = leave for scheduled or exploratory runs.

## Levels and tags

Tags use `@cypress/grep` and live in each test's options (`{ tags: '@smoke' }`), not in the title as Playwright does.

- `@smoke`: fast, high-value checks. Run on the mobile viewport and suitable as a deploy gate.
- `@regression`: full regression, desktop + API, on every push and a weekday schedule.

## Test classification

Fixed when a test is written, so the suite stays legible as it grows:

| Class | Meaning | Examples here |
|---|---|---|
| Structural | Stable regardless of data | Login errors, sorting, accessibility |
| State-specific | Depends on account or session state | Locked-out user, cart badge |
| Data-generated | Creates its own data per run | All API tests |

## Accessibility gate

- `cypress-axe` runs axe-core on the login, inventory and checkout pages.
- The gate fails on **serious** and **critical** violations only.
- A known SauceDemo issue that would fail the gate is recorded below by axe rule ID and passed to `cy.checkA11ySerious()` for that page only. It is never handled by turning the check off.

| Page | Axe rule ID | Impact | Note |
|---|---|---|---|
| (none yet) | | | |

## Environments and data

- Public demo apps only. No credentials beyond those the apps publish themselves.
- API data is unique per run (timestamp suffix), so tests are parallel-safe.
- UI login is cached per user with `cy.session()`; `testIsolation` clears the page and storage between tests, so cart state never leaks.

## Reporting

- Mochawesome HTML report with embedded screenshots of failures.
- CI uploads one report per matrix leg as an artifact.

## Risks and known limitations

- Third-party demo apps can change or go down. The weekday scheduled run exists to detect that drift early; a failure there is triaged as "app changed" vs "test wrong" before anything else.
- Restful-Booker resets its data periodically, so tests never rely on pre-existing bookings.
- The mobile run changes the viewport only. It does not emulate touch, pixel ratio or a mobile user agent (see ADR 0003).
