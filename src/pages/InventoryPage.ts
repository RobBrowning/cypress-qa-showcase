import { byTest } from './selectors';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  title = () => cy.get(byTest('title'));
  items = () => cy.get(byTest('inventory-item'));
  itemNames = () => cy.get(byTest('inventory-item-name'));
  cartBadge = () => cy.get(byTest('shopping-cart-badge'));

  /** The product card whose text contains the given name. */
  item = (name: string) => cy.contains(byTest('inventory-item'), name);

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
