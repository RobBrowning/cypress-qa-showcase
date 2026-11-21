import { CartPage } from '../../../src/pages/CartPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { LoginPage } from '../../../src/pages/LoginPage';

/**
 * Twin of playwright-qa-showcase tests/ui/a11y.spec.ts: same titles, same
 * axe-core 4.14.0. Fails on serious and critical axe violations only. Known
 * SauceDemo issues are listed by rule ID in docs/test-strategy.md and passed in
 * here, never switched off wholesale.
 */
const KNOWN_ISSUES: Record<'login' | 'inventory' | 'checkout', string[]> = {
  login: [],
  inventory: [],
  checkout: [],
};

describe('Accessibility', () => {
  it('login page has no serious or critical axe violations', { tags: '@regression' }, () => {
    new LoginPage().visit();
    cy.injectAxe();
    cy.checkA11ySerious(KNOWN_ISSUES.login);
  });

  it('inventory page has no serious or critical axe violations', { tags: '@regression' }, () => {
    cy.login();
    new InventoryPage().expectLoaded();
    cy.injectAxe();
    cy.checkA11ySerious(KNOWN_ISSUES.inventory);
  });

  it('checkout page has no serious or critical axe violations', { tags: '@regression' }, () => {
    const inventory = new InventoryPage();
    cy.login();
    inventory.addToCart('Sauce Labs Backpack');
    inventory.openCart();
    new CartPage().checkout();
    cy.injectAxe();
    cy.checkA11ySerious(KNOWN_ISSUES.checkout);
  });
});
