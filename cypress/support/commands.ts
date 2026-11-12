import { LoginPage } from '../../src/pages/LoginPage';
import { DEMO_PASSWORD, users } from '../../src/data/users';

/**
 * Logs in once per user and caches the session (cookies and localStorage)
 * with cy.session(), then lands on the inventory page. Later tests restore the
 * cached session instead of typing the login form again.
 */
Cypress.Commands.add('login', (username: string = users.standard) => {
  cy.session(username, () => {
    const loginPage = new LoginPage();
    loginPage.visit();
    loginPage.login(username, DEMO_PASSWORD);
    cy.location('pathname').should('eq', '/inventory.html');
  });
  cy.visit('/inventory.html');
});

/**
 * Accessibility gate: fails only on serious and critical axe violations.
 * Known third-party issues are excluded by rule ID (see docs/test-strategy.md),
 * never by switching the check off.
 */
Cypress.Commands.add('checkA11ySerious', (knownIssues: string[] = []) => {
  const rules = Object.fromEntries(knownIssues.map((id) => [id, { enabled: false }]));
  cy.checkA11y(undefined, { includedImpacts: ['serious', 'critical'], rules }, logViolations);
});

function logViolations(violations: { id: string; impact?: string | null; nodes: unknown[] }[]): void {
  cy.task(
    'log',
    violations.map((v) => `${v.impact}: ${v.id} (${v.nodes.length} nodes)`).join('\n'),
    { log: false },
  );
}
