declare namespace Cypress {
  interface Chainable<Subject = any> {
    matchImageSnapshot(value: string): Chainable<void>;
    fill(value: string): Chainable<void>;
  }
  interface cy extends Chainable<undefined> {}
}
