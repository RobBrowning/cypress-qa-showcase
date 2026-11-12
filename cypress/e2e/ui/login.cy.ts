import { LoginPage } from '../../../src/pages/LoginPage';
import { InventoryPage } from '../../../src/pages/InventoryPage';
import { DEMO_PASSWORD, users } from '../../../src/data/users';

const loginPage = new LoginPage();
const inventoryPage = new InventoryPage();

describe('Login', () => {
  beforeEach(() => {
    loginPage.visit();
  });

  it('standard user can log in', { tags: '@smoke' }, () => {
    loginPage.login(users.standard, DEMO_PASSWORD);
    inventoryPage.expectLoaded();
    inventoryPage.items().should('have.length', 6);
  });

  it('locked out user sees a clear error', { tags: '@regression' }, () => {
    loginPage.login(users.lockedOut, DEMO_PASSWORD);
    loginPage.error().should('contain.text', 'this user has been locked out');
    cy.location('pathname').should('not.eq', '/inventory.html');
  });

  const invalid = [
    { name: 'empty username', user: '', pass: DEMO_PASSWORD, message: 'Username is required' },
    { name: 'empty password', user: users.standard, pass: '', message: 'Password is required' },
    {
      name: 'wrong password',
      user: users.standard,
      pass: 'not_the_password',
      message: 'Username and password do not match',
    },
  ];

  invalid.forEach(({ name, user, pass, message }) => {
    it(`rejects ${name}`, { tags: '@regression' }, () => {
      loginPage.login(user, pass);
      loginPage.error().should('contain.text', message);
    });
  });

  it('inventory is not reachable without logging in', { tags: '@regression' }, () => {
    // SauceDemo answers a direct hit on /inventory.html with a 404 status before its
    // client-side router shows the error, so the status check is relaxed for this visit.
    cy.visit('/inventory.html', { failOnStatusCode: false });
    loginPage
      .error()
      .should('contain.text', "You can only access '/inventory.html' when you are logged in");
  });
});
