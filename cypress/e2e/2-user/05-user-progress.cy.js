describe("User Progress", () => {
  const uid = 42;

  before(() => {
    cy.resetApi();
  });

  beforeEach(() => {
    cy.login(uid, 0);
  });

  it("shows completions on a map", () => {
    cy.visit("/map/MLXXXAE");
    cy.get("[data-cy=user-completions]")
      .find("[data-cy=single-completion]")
      .should("have.length", 1);

    cy.visit("/map/MLXXXAA");
    cy.get("[data-cy=user-completions]")
      .find("[data-cy=single-completion]")
      .should("have.length", 3);
  });

  describe("List progress", () => {
    it("shows progress on the Maplist", () => {
      cy.visit("/list");
      cy.get("[data-cy=custom-map]").find("[data-cy=medals]");
    });

    it.skip("shows progress on the Expert List", () => {
      cy.visit("/experts");
      cy.get("[data-cy=custom-map]").find("[data-cy=medals]");
    });
  });
});
