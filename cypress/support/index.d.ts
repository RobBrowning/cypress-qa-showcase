/// <reference types="@cypress/grep" />
declare namespace Cypress {
  interface Chainable {
    /** Log in (cached with cy.session) and land on the inventory page. Defaults to standard_user. */
    login(username?: string): Chainable<void>;
    /** Run axe and fail on serious or critical violations, skipping the given known rule IDs. */
    checkA11ySerious(knownIssues?: string[]): Chainable<void>;
  }
}
