import { InventoryPage } from '../../../src/pages/InventoryPage';
import { CartPage } from '../../../src/pages/CartPage';
import { CheckoutPage } from '../../../src/pages/CheckoutPage';
import { defaultCustomer } from '../../../src/data/checkout';
import { byTest } from '../../../src/pages/selectors';

const inventory = new InventoryPage();
const cart = new CartPage();
const checkout = new CheckoutPage();
const products = ['Sauce Labs Backpack', 'Sauce Labs Onesie'];

describe('Checkout', () => {
  beforeEach(() => {
    cy.login();
  });

  it('customer can buy two items end to end', { tags: '@smoke' }, () => {
    // Cypress queues commands, so a plain variable is only filled in once the
    // queued .then() callbacks run. It is read later inside another callback,
    // by which point every price has been added.
    let expectedTotal = 0;

    cy.log('**add items and note their prices**');
    products.forEach((name) => {
      inventory
        .item(name)
        .find(byTest('inventory-item-price'))
        .invoke('text')
        .then((text) => {
          expectedTotal += Number(text.replace('$', ''));
        });
      inventory.addToCart(name);
    });

    cy.log('**review cart**');
    inventory.openCart();
    cart.expectLoaded();
    cart.itemNames().then(($els) => {
      expect(Cypress._.map($els, (el) => el.innerText)).to.deep.equal(products);
    });
    cart.checkout();

    cy.log('**enter details and confirm subtotal**');
    checkout.fillDetails(defaultCustomer);
    checkout.subtotalValue().then((subtotal) => {
      expect(subtotal).to.be.closeTo(expectedTotal, 0.01);
    });

    cy.log('**place order**');
    checkout.finish();
    checkout.completeHeader().should('have.text', 'Thank you for your order!');
    inventory.cartBadge().should('not.exist');
  });

  it('checkout requires a postal code', { tags: '@regression' }, () => {
    inventory.addToCart('Sauce Labs Backpack');
    inventory.openCart();
    cart.checkout();
    checkout.fillDetails({ ...defaultCustomer, postalCode: '' });
    checkout.error().should('contain.text', 'Postal Code is required');
  });
});
