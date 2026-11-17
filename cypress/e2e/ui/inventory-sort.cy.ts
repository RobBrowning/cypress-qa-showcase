import { InventoryPage } from '../../../src/pages/InventoryPage';

const inventory = new InventoryPage();

describe('Inventory sorting', () => {
  beforeEach(() => {
    cy.login();
  });

  it('sorts by name, A to Z', { tags: '@regression' }, () => {
    inventory.sortBy('az');
    cy.wait(2000);
    cy.get('.inventory_list .inventory_item .inventory_item_name').then(($names) => {
      const names = [...$names].map((el) => el.innerText);
      expect(names).to.deep.equal([...names].sort());
    });
  });
});
