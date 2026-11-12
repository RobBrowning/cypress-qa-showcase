## What and why

<!-- One or two sentences: what this PR changes and the reason for it. -->

## Manual check replaced

<!-- New tests must name the manual check they replace. If none, add it to the "not automated" table in docs/test-strategy.md instead. -->

## Checklist

- [ ] `npm run typecheck` passes
- [ ] Relevant suites pass locally (`npm test`, `test:smoke`, `test:api` or `test:a11y`)
- [ ] Test titles match the Playwright twin, or the reason for no twin is in `docs/test-strategy.md`
- [ ] Selectors use `byTest()` with `[data-test="..."]`: no CSS chains, no XPath
- [ ] No `async/await` and no `cy.wait(<number>)` in specs
- [ ] Page objects hold selectors and actions only; business assertions live in specs
- [ ] Third-party quirks are asserted and commented, not worked around
- [ ] No assertion weakened and no axe rule switched off wholesale
- [ ] No tests for seeded defects (`problem_user`, `error_user`)
- [ ] Structural decisions recorded as a new ADR in `docs/adr/`
- [ ] No `.env`, reports, screenshots or videos committed
- [ ] No em dashes or en dashes in any file
