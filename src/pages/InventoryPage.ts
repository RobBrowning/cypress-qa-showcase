import { byTest } from './selectors';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  title = () => cy.get(byTest('title'));
  items = () => cy.get(byTest('inventory-item'));
  itemNames = () => cy.get(byTest('inventory-item-name'));
  cartBadge = () => cy.get(byTest('shopping-cart-badge'));

  /** The product card whose text contains the given name. */
  item = (name: string) => cy.contains(byTest('inventory-item'), name);

  /**
   * Loads /inventory.html directly. SauceDemo quirk: the server answers a direct
   * load with a 404 status, then the client-side router renders the right page.
   * The 404 is asserted rather than ignored, so a different error (a 500, say)
   * still fails, and we find out if SauceDemo ever stops returning it.
   */
  visitDirect(): void {
    cy.intercept({ method: 'GET', pathname: '/inventory.html' }).as('inventoryDocument');
    cy.visit('/inventory.html', { failOnStatusCode: false });
    cy.wait('@inventoryDocument').its('response.statusCode').should('eq', 404);
  }

  expectLoaded(): void {
    cy.location('pathname').should('eq', '/inventory.html');
    this.title().should('have.text', 'Products');
  }

  addToCart(name: string): void {
    this.item(name).contains('button', 'Add to cart').click();
  }

  removeFromCart(name: string): void {
    this.item(name).contains('button', 'Remove').click();
  }

  sortBy(option: SortOption): void {
    cy.get(byTest('product-sort-container')).select(option);
  }

  /** Yields the displayed prices as numbers, in page order. */
  prices() {
    return cy
      .get(byTest('inventory-item-price'))
      .then(($els) => Cypress._.map($els, (el) => Number(el.innerText.replace('$', ''))));
  }

  /** Yields the displayed product names, in page order. */
  names() {
    return this.itemNames().then(($els) => Cypress._.map($els, (el) => el.innerText));
  }

  openCart(): void {
    cy.get(byTest('shopping-cart-link')).click();
  }
}
