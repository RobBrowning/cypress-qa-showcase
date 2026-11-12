import { byTest } from './selectors';

export class CartPage {
  itemNames = () => cy.get(byTest('inventory-item-name'));

  expectLoaded(): void {
    cy.location('pathname').should('eq', '/cart.html');
  }

  checkout(): void {
    cy.get(byTest('checkout')).click();
  }
}
