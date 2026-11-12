import { byTest } from './selectors';

/** Selectors and actions only. Assertions about behaviour live in the specs. */
export class LoginPage {
  username = () => cy.get(byTest('username'));
  password = () => cy.get(byTest('password'));
  loginButton = () => cy.get(byTest('login-button'));
  error = () => cy.get(byTest('error'));

  visit(): void {
    cy.visit('/');
    this.loginButton().should('be.visible');
  }

  login(username: string, password: string): void {
    // type('') throws in Cypress, so empty values are left blank on purpose.
    if (username) this.username().type(username);
    if (password) this.password().type(password, { log: false });
    this.loginButton().click();
  }
}
