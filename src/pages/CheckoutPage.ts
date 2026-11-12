import type { CustomerDetails } from '../data/checkout';
import { byTest } from './selectors';

export class CheckoutPage {
  error = () => cy.get(byTest('error'));
  completeHeader = () => cy.get(byTest('complete-header'));

  fillDetails(details: CustomerDetails): void {
    if (details.firstName) cy.get(byTest('firstName')).type(details.firstName);
    if (details.lastName) cy.get(byTest('lastName')).type(details.lastName);
    if (details.postalCode) cy.get(byTest('postalCode')).type(details.postalCode);
    cy.get(byTest('continue')).click();
  }

  /** Yields the item subtotal as a number, e.g. "Item total: $37.98" becomes 37.98. */
  subtotalValue() {
    return cy
      .get(byTest('subtotal-label'))
      .invoke('text')
      .then((text) => Number(text.replace(/[^0-9.]/g, '')));
  }

  finish(): void {
    cy.get(byTest('finish')).click();
    cy.location('pathname').should('eq', '/checkout-complete.html');
  }
}
