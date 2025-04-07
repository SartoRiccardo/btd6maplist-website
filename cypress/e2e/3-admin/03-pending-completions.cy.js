describe("Pending Completions", () => {
  const uid = 30;

  before(() => {
    cy.resetApi();
  });

  beforeEach(() => {
    cy.login(uid, { permissions: { "!verifier": null } });
    cy.visit("/completions/pending");
  });

  it("shows pending completions and paginates", () => {
    cy.get("[data-cy=single-completion]").then(($completions) => {
      cy.get("[data-cy=btn-paginate-next]").first().click();
      cy.get("[data-cy=single-completion]").should(
        "not.have.length",
        $completions.length
      );
    });
  });
});
