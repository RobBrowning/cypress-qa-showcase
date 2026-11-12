import { InventoryPage } from '../../../src/pages/InventoryPage';

const inventory = new InventoryPage();

describe('Inventory', () => {
  beforeEach(() => {
    cy.login();
  });

  it('sorts by price, low to high', { tags: '@regression' }, () => {
    inventory.sortBy('lohi');
    inventory.prices().then((prices) => {
      expect(prices).to.deep.equal([...prices].sort((a, b) => a - b));
    });
  });

  it('sorts by price, high to low', { tags: '@regression' }, () => {
    inventory.sortBy('hilo');
    inventory.prices().then((prices) => {
      expect(prices).to.deep.equal([...prices].sort((a, b) => b - a));
    });
  });

  it('sorts by name, Z to A', { tags: '@regression' }, () => {
    inventory.sortBy('za');
    inventory.names().then((names) => {
      expect(names).to.deep.equal([...names].sort().reverse());
    });
  });

  it('cart badge tracks add and remove', { tags: '@smoke' }, () => {
    inventory.cartBadge().should('not.exist');
    inventory.addToCart('Sauce Labs Backpack');
    inventory.addToCart('Sauce Labs Bike Light');
    inventory.cartBadge().should('have.text', '2');
    inventory.removeFromCart('Sauce Labs Backpack');
    inventory.cartBadge().should('have.text', '1');
  });
});
