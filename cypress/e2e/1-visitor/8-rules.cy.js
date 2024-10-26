describe("Rules page", () => {
  beforeEach(() => {
    cy.visit(`${Cypress.env("base_url")}/rules`);
  });

  it("switches between rules", () => {
    cy.get('[data-cy="rules-for-list"]').should("have.length", 2);
    cy.get('[data-cy="btn-rules"]').contains("Expert").click();

    cy.get('[data-cy="rules-for-list"]').should("have.length", 0);
    cy.get('[data-cy="rules-for-experts"]').should("have.length", 2);
  });
});
