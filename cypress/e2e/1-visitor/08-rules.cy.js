describe("Rules page", () => {
  beforeEach(() => {
    cy.visit(`/rules`);
  });

  it("switches between rules", () => {
    cy.get("[data-cy=rules-for-1]").should("have.length", 2);
    cy.get("[data-cy=btn-rules]").contains("Expert").click();

    cy.get("[data-cy=rules-for-1]").should("have.length", 0);
    cy.get("[data-cy=rules-for-51]").should("have.length", 2);
  });
});
