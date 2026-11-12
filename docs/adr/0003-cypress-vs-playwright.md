# ADR 0003: Cypress vs Playwright, and when I would choose each

- **Status:** Accepted (revisit as both suites grow)
- **Date:** 2026-11-12

## Context

The same 15 tests exist in this repo and in [playwright-qa-showcase](https://github.com/RobBrowning/playwright-qa-showcase). Building both made the differences concrete rather than theoretical.

## Differences that showed up in these repos

| Area | Cypress (this repo) | Playwright (twin) |
|---|---|---|
| Writing steps | Commands are queued and run later. Values pass through `.then()`, aliases or closures. See the subtotal step in `checkout.cy.ts`. | Plain `async/await`. Values are ordinary variables. |
| Shared setup | Custom commands plus `cy.session()` for login. | Typed fixtures injected per test. |
| Tags | `@cypress/grep` plugin, tags in test options. | Built-in `--grep` on the title. |
| Mobile | Viewport resize only. | Device profiles with touch, pixel ratio and user agent. |
| Multiple tabs, origins | One tab. Other origins need `cy.origin()`. | Multiple pages and contexts are normal. |
| API testing | `cy.request`, which runs inside the test runner. | `request` fixture, can run with no browser at all. |
| Parallel runs | Free locally per spec file via CI matrix; smart parallelism needs Cypress Cloud. | Built in, sharded by test, free. |
| Debugging | Interactive runner with time travel through every command. | Trace viewer and UI mode, also excellent. |
| Reporting | Plugin (mochawesome). | Built-in HTML reporter. |
| Component testing | Mature, part of the product. | Experimental. |

## When I would choose each

**Cypress** when the team is front-end led, wants the fastest feedback loop while writing tests, already uses or plans component tests, and the app lives on one origin in one tab.

**Playwright** when coverage needs real mobile emulation, multiple tabs or origins, several browser engines, free parallelism at scale, or an API suite that runs without a browser.

**For a mixed team** I would not migrate a healthy Cypress suite just to follow fashion. I would write new end-to-end work in whichever tool fits the gaps above, and keep shared conventions (tags, page object rules, strategy) identical across both, as these two repos do.
